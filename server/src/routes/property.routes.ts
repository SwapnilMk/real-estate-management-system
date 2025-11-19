import { Router } from "express";
import {
  getProperties,
  getPropertyById,
  getSimilarProperties,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/property.controller";

const router = Router();

router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.get("/similar/:id", getSimilarProperties);
router.post("/wishlist/:id", addToWishlist);
router.delete("/wishlist/:id",  removeFromWishlist);

export default router;
