import path from 'path';
import express from 'express';
import passport from 'passport';

const router = express.Router();

/* Protect Landing & Home route, redirect user to corresponding page */
router.get('/landing', (req, res, next): void => {
  if (req.isAuthenticated()) {
    res.redirect('/home');
  } else {
    next();
  }
});

router.get('/home', (req, res, next): void => {
  if (!req.isAuthenticated()) {
    res.redirect('/landing');
  } else {
    next();
  }
});

/* Handle Google login */
router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/home', failureRedirect: '/landing' }));

/* Handle logout */
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/landing');
});

/* Handle any requests that don't match any routes */
router.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../../client/build/index.html'));
});

export default router;
