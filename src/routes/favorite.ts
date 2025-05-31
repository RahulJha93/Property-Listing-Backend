import express from 'express';
import { authenticateJWT } from '../middlewares/auth';
import { addFavorite, removeFavorite, listFavorites } from '../controllers/favoriteController';

const router = express.Router();

router.post('/:id', authenticateJWT, addFavorite);
router.delete('/:id', authenticateJWT, removeFavorite);
router.get('/', authenticateJWT, listFavorites);

export default router;
