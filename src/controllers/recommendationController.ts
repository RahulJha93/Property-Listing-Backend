import { Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import Property from '../models/Property';
import { AuthRequest } from '../middlewares/auth';
import { getProperty } from '../utils/validation';

// Recommend a property to another user by email
export async function recommendProperty(req: AuthRequest, res: Response) {
  try {
    const { recipientEmail, id } = req.body;
    if (!recipientEmail || !id) return res.status(400).json({ message: 'recipientEmail and id required' });
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) return res.status(404).json({ message: 'Recipient user not found' });
    const property = await getProperty(id, res); 
    if (!property) return;
    const propObjId = property._id as mongoose.Types.ObjectId;
    if (recipient.recommendationsReceived.some((rec: mongoose.Types.ObjectId) => rec.equals(propObjId))) {
      return res.status(409).json({ message: 'Property already recommended to this user' });
    }
    recipient.recommendationsReceived.push(propObjId);
    await recipient.save();
    res.json({ message: 'Property recommended successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error recommending property', error: err });
  }
}

// Get all recommendations received by the logged-in user
export async function getRecommendationsReceived(req: AuthRequest, res: Response) {
  try {
    const user = await User.findById(req.user!.userId).populate('recommendationsReceived');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.recommendationsReceived);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recommendations', error: err });
  }
}
