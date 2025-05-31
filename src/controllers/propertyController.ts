import { Request, Response } from 'express';
import Property from '../models/Property';
import { getProperty as getPropertyUtil } from '../utils/validation';
import mongoose from 'mongoose';
import { redisClient } from '../app';
import { AuthRequest } from '../middlewares/auth';


export async function createProperty(req: AuthRequest, res: Response) {
  try {
    const data = req.body;
    data.createdBy = req.user!.userId;

    const property = await Property.create(data);
  
    await redisClient.keys('properties:*').then(keys => keys.length && redisClient.del(keys));
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ message: 'Error creating property', error: err });
  }
}


export async function listProperties(req: Request, res: Response) {
  try {
    const cacheKey = `properties:${JSON.stringify(req.query)}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
  
    const filter: any = {};
    Object.entries(req.query).forEach(([key, value]) => {
      if (value !== undefined && value !== '') filter[key] = value;
    });
    const properties = await Property.find(filter);
    await redisClient.set(cacheKey, JSON.stringify(properties), { EX: 60 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching properties', error: err });
  }
}


export async function getProperty(req: Request, res: Response) {
  try {
    const cacheKey = `property:${req.params.id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
    const property = await getPropertyUtil(req.params.id, res);
    if (!property) return;
    await redisClient.set(cacheKey, JSON.stringify(property), { EX: 60 }); 
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching property', error: err });
  }
}


export async function updateProperty(req: AuthRequest, res: Response) {
  try {
    const property = await getPropertyUtil(req.params.id, res);
    if (!property) return;
    if (property.createdBy.toString() !== req.user!.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    Object.assign(property, req.body);
    await property.save();
   
    await redisClient.del(`property:${req.params.id}`);
    await redisClient.keys('properties:*').then(keys => keys.length && redisClient.del(keys));
    res.json(property);
  } catch (err) {
    res.status(400).json({ message: 'Error updating property', error: err });
  }
}


export async function deleteProperty(req: AuthRequest, res: Response) {
  try {
    const property = await getPropertyUtil(req.params.id, res);
    if (!property) return;
    if (property.createdBy.toString() !== req.user!.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await property.deleteOne();
   
    await redisClient.del(`property:${req.params.id}`);
    await redisClient.keys('properties:*').then(keys => keys.length && redisClient.del(keys));
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting property', error: err });
  }
}
