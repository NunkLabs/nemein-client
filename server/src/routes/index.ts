import path from 'path';
import express from 'express';
import passport from 'passport';

import apiRoutes from './api/index';

const router = express.Router();

/* Setup API routes */
router.use('/api', apiRoutes);

/* Protect Landing, Home & API route, redirect user to corresponding page */
router
  .get('/landing', (req, res, next): void => {
    if (req.isAuthenticated()) {
      res.redirect('/home');
    } else {
      next();
    }
  })
  .get('/home', (req, res, next): void => {
    if (!req.isAuthenticated()) {
      res.redirect('/landing');
    } else {
      next();
    }
  });

/* Handle Google login */
router
  .get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
  .get('/auth/google/callback', passport.authenticate('google', {
    prompt: 'select_account',
    successRedirect: '/home',
    failureRedirect: '/landing',
  }));

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
