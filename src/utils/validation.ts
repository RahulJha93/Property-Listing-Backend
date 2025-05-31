import User from '../models/User';
import Property from '../models/Property';
import { Response } from 'express';

export async function getUser(userId: string, res: Response, populateFavorites = false) {
  const query = User.findById(userId);
  if (populateFavorites) query.populate('favorites');
  const user = await query;
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return null;
  }
  return user;
}

export async function getProperty(id: string, res: Response) {
  const property = await Property.findById(id);
  if (!property) {
    res.status(404).json({ message: 'Property not found' });
    return null;
  }
  return property;
}
