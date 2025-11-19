import { Request, Response } from "express";
import {
  getProperties as getPropertiesService,
  getPropertyById as getPropertyByIdService,
  getSimilarProperties as getSimilarPropertiesService,
  addToWishlist as addToWishlistService,
  removeFromWishlist as removeFromWishlistService,
} from "../services/property.service";

export const getProperties = async (req: Request, res: Response) => {
  try {
    const properties = await getPropertiesService(req.query);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching properties" });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const property = await getPropertyByIdService(req.params.id);
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Error fetching property" });
  }
};

export const getSimilarProperties = async (req: Request, res: Response) => {
  try {
    const properties = await getSimilarPropertiesService(req.params.id);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching similar properties" });
  }
};

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const user = await addToWishlistService(req.user.id, req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist" });
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const user = await removeFromWishlistService(req.user.id, req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error removing from wishlist" });
  }
};
