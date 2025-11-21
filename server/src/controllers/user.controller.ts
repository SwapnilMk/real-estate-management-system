import { Request, Response } from "express";
import {
  getAllUsers,
  updateUserService,
  changePasswordService,
} from "../services/user.service";
import { uploadToCloudinary } from "../middlewares/upload.middleware";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?.id || user?._id;
    let avatarUrl = undefined;

    if (req.file) {
      const result: any = await uploadToCloudinary(req.file);
      avatarUrl = result.secure_url;
    }

    const updateData = {
      ...req.body,
      ...(avatarUrl && { avatar: avatarUrl }),
    };

    const updatedUser = await updateUserService(userId, updateData);

    res.json(updatedUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?.id || user?._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await changePasswordService(userId, currentPassword, newPassword);

    res.json({ message: "Password changed successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
