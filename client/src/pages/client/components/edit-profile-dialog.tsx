import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateUserProfileMutation } from "@/services/userApi";
import { setCredentials } from "@/features/auth/authSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@/types";

const EditProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  phoneNumber: z.string().optional(),
  avatar: z.any().optional(),
});

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  user,
}: EditProfileDialogProps) {
  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof EditProfileSchema>) => {
    try {
      const updateData: {
        name?: string;
        email?: string;
        phoneNumber?: string;
        avatar?: File;
      } = {};

      if (data.name && data.name !== user.name) {
        updateData.name = data.name;
      }

      if (data.email && data.email !== user.email) {
        updateData.email = data.email;
      }

      if (data.phoneNumber !== user.phoneNumber) {
        updateData.phoneNumber = data.phoneNumber;
      }

      if (data.avatar && data.avatar.length > 0) {
        updateData.avatar = data.avatar[0];
      }

      if (Object.keys(updateData).length === 0) {
        toast.info("No changes to save");
        return;
      }

      const updatedUser = await updateProfile(updateData).unwrap();

      // Update Redux state with new user data
      dispatch(
        setCredentials({
          user: updatedUser,
          accessToken: localStorage.getItem("accessToken") || "",
        }),
      );

      toast.success("Profile updated successfully");
      onOpenChange(false);
      setAvatarPreview(null);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error.data?.message || "Failed to update profile");
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information here.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Avatar Preview */}
          {avatarPreview && (
            <div className="flex justify-center">
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="h-24 w-24 rounded-full object-cover"
              />
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              placeholder="Your name"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              placeholder="you@example.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="edit-phoneNumber">Phone Number</Label>
            <Input
              id="edit-phoneNumber"
              type="tel"
              placeholder="+1 234 567 8900"
              {...form.register("phoneNumber")}
            />
          </div>

          {/* Avatar */}
          <div className="space-y-2">
            <Label htmlFor="edit-avatar">Profile Photo</Label>
            <Input
              id="edit-avatar"
              type="file"
              accept="image/*"
              {...form.register("avatar")}
              onChange={(e) => {
                form.register("avatar").onChange(e);
                handleAvatarChange(e);
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
