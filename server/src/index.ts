import path from 'path';
import express from 'express';
import session from 'express-session';
import mongo from 'connect-mongo';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';

import logger from './utils/logger';
import routes from './routes/index';
import googleStrategy from './utils/passport';
import { env } from './configs/config';

/* Connect server to MongoDB */
mongoose.connect(env.MONGO_URI || 'mongodb://localhost:27017/tetribass', {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(
  /* Handle initial connection to MongoDB */
  () => logger.info(`Connected to MongoDB (${mongoose.connection.host})!`),
  (err) => logger.error(err),
);

/* Listen for errors after MongoDB is connected */
mongoose.connection.on('error', (err) => logger.error(err));

/* Initialize Express server */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Serve up static route */
app.use(express.static(path.join(__dirname, '../../client/build')));

/* Configure session */
const MongoStore = mongo(session);

app.use(session({
  secret: 'nunkugemu',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

/* Initialize Passport with Google OAuth */
googleStrategy(passport);
app.use(passport.initialize());
app.use(passport.session());

/* Add routes */
app.use(routes);

/* Setup morgan to pass its HTTP request logs to winston */
class LoggerStream {
  write(message: string) {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  }
}

app.use(morgan('combined', { stream: new LoggerStream() }));

/* Listen for requests */
const PORT = env.PORT || 8080;

app.listen(PORT, () => {
  logger.info(`Launched in ${env.PRODUCTION_MODE ? 'production' : 'development'} mode on port ${PORT}!`);
});
