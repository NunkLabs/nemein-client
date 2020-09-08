/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import express from 'express';
import User from '../../models/User';
import logger from '../../utils/logger';

const router = express.Router();

/* GET: user info */
router.get('/info', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      if (req.session) {
        const { user } = req.session.passport;

        const dbUser = await User.findOne({ _id: user });
        if (dbUser) {
          return res.send({
            emailAddress: dbUser.emailAddress,
            displayName: dbUser.displayName,
            profilePic: dbUser.profilePic,
            createdAt: dbUser.createdAt,
            scores: dbUser.scores,
          });
        }
      }

      return res.status(404).end();
    } catch (err) {
      logger.error(err);

      return res.status(500).end();
    }
  } else {
    res.redirect('/landing');

    return res.status(401).end();
  }
});

/* POST: update scores */
router.put('/update_scores', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      if (req.session) {
        const { user } = req.session.passport;
        const dbUser = await User.findOne({ _id: user });

        if (dbUser) {
          const { newScore } = req.body;

          dbUser.scores.push(newScore);
          dbUser.scores
            .sort((a, b) => b.score - a.score)
            .pop();

          await User.findOneAndUpdate({ _id: user }, { scores: dbUser.scores });

          return res.status(200).end();
        }
      }

      return res.status(404).end();
    } catch (err) {
      logger.error(err);

      return res.status(500).end();
    }
  } else {
    res.redirect('/landing');

    return res.status(401).end();
  }
});

export default router;
