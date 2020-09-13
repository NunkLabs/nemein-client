import { PassportStatic } from 'passport';
import google from 'passport-google-oauth20';
import moment from 'moment';
import logger from './logger';
import User from '../models/User';
import { keys } from '../configs/config';

const GoogleStrategy = google.Strategy;

const googleStrategy = (passport: PassportStatic): void => {
  passport.serializeUser(({ id }, done) => done(null, id));

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
      .catch((err) => logger.error(err));
  });

  passport.use(
    new GoogleStrategy({
      clientID: keys.google.CLIENT_ID,
      clientSecret: keys.google.CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done): Promise<void> => {
      const newUser = {
        emailAddress: profile.emails ? profile.emails[0].value : '',
        displayName: profile.displayName,
        profilePic: profile.photos ? profile.photos[0].value : '',
        createdAt: moment().format('MMMM Do, YYYY'),
        scores: [],
      };

      try {
        let user = await User.findOne({ emailAddress: newUser.emailAddress });

        if (!user) {
          user = await User.create(newUser);
        }

        done('', user);
      } catch (err) {
        logger.error(err);
      }
    }),
  );
};

export default googleStrategy;
