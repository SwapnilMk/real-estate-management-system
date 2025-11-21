import User from "../models/user.model";

export const getAllUsers = async () => {
  return await User.find({}).select("-password");
};

export const updateUserService = async (
  userId: string,
  data: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    avatar?: string;
  },
) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true, runValidators: true },
  ).select("-password");

  if (!user) throw new Error("User not found");

  return user;
};

export const changePasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new Error("Current password is incorrect");

  // Update password
  user.password = newPassword;
  await user.save();

  return true;
};
