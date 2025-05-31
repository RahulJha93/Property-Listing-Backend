import express from 'express';
import { authenticateJWT } from '../middlewares/auth';
import { recommendProperty, getRecommendationsReceived } from '../controllers/recommendationController';

const router = express.Router();

router.post('/', authenticateJWT, recommendProperty);
router.get('/received', authenticateJWT, getRecommendationsReceived);

export default router;
