import { Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import Property from "../models/Property";
import { AuthRequest } from "../middlewares/auth";
import { getUser, getProperty } from "../utils/validation";

export async function addFavorite(req: AuthRequest, res: Response) {
  try {
    const user = await getUser(req.user!.userId, res);
   const property = await getProperty(req.params.id, res);
    if (!user || !property) return;
    const propertyObjId = property._id as mongoose.Types.ObjectId;
    if (
      user.favorites.some((fav: mongoose.Types.ObjectId) =>
        fav.equals(propertyObjId)
      )
    ) {
      return res.status(409).json({ message: "Property already in favorites" });
    }
    user.favorites.push(propertyObjId);
    await user.save();
    res.json({ message: "Added to favorites" });
  } catch (err) {
    res.status(500).json({ message: "Error adding favorite", error: err });
  }
}

export async function removeFavorite(req: AuthRequest, res: Response) {
  try {
    const user = await getUser(req.user!.userId, res);
    const property = await getProperty(req.params.id, res);
    if (!user || !property) return;
    const propertyObjId = property._id as mongoose.Types.ObjectId;
    user.favorites = user.favorites.filter(
      (fav: mongoose.Types.ObjectId) => !fav.equals(propertyObjId)
    );
    await user.save();
    res.json({ message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ message: "Error removing favorite", error: err });
  }
}

export async function listFavorites(req: AuthRequest, res: Response) {
  try {
    const user = await getUser(req.user!.userId, res, true);
    if (!user) return;
    if (user?.favorites?.length) {
      res.json(user.favorites);
    } else {
      res.json({ message: "No favorites found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching favorites", error: err });
  }
}
