import express from 'express';
import { authenticateJWT } from '../middlewares/auth';
import {
  createProperty,
  listProperties,
  getProperty,
  updateProperty,
  deleteProperty
} from '../controllers/propertyController';

const router = express.Router();

router.post('/', authenticateJWT, createProperty);
router.get('/', listProperties);
router.get('/:id', getProperty);
router.put('/:id', authenticateJWT, updateProperty);
router.delete('/:id', authenticateJWT, deleteProperty);

export default router;
