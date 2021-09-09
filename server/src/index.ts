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
const mongoURI = env.MONGO_URI || 'mongodb://localhost:27017/tetribass';

mongoose.connect(mongoURI).then(
  /* Handle initial connection to MongoDB */
  () => {
    logger.info(`Connected to MongoDB (${mongoose.connection.host})!`);

    /* Initialize Express server */
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    /* Serve up static route */
    app.use(express.static(path.join(__dirname, '../../client/build')));

    /* Configure session */
    app.use(session({
      resave: false,
      saveUninitialized: false,
      store: mongo.create({
        mongoUrl: mongoURI,
      }),
      secret: 'nunkugemu',
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
    const PORT: number = env.PORT || 8080;

    app.listen(PORT, () => {
      logger.info(`Launched in ${env.PRODUCTION_MODE ? 'production' : 'development'} mode on port ${PORT}!`);
    });
  },
  (err) => {
    logger.error(err);
  },
);

/* Listen for errors after MongoDB is connected */
mongoose.connection.on('error', (err) => logger.error(err));
