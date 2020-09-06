import path from 'path';
import express from 'express';
import passport from 'passport';

const router = express.Router();

/* Handle Google login */
router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (_req, res) => {
  res.redirect('/home');
});

/* Handle logout */
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

/* Handle any requests that don't match any routes */
router.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../../client/build/index.html'));
});

export default router;
