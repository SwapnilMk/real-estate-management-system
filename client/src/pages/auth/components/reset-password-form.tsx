"use client";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPasswordMutation } from "@/services/authApi";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { ResetPasswordSchema } from "../schema/auth.schemas";

interface Props {
  token: string;
}

export function ResetPasswordForm({ token }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
    try {
      const result = await resetPassword({
        token,
        password: data.password,
      }).unwrap();

      if (result.accessToken) {
        dispatch(setCredentials(result));
        toast.success("Password reset successful");
        setSuccess(true);

        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Invalid or expired token");
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6 py-14">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="text-3xl font-bold">Password Reset Successful!</h2>
        <p className="text-muted-foreground">Redirecting to home...</p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Set New Password</h1>
        <p className="text-muted-foreground">Enter a strong new password</p>
      </div>

      {/* Inputs */}
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input id="password" type="password" {...form.register("password")} />
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm New Password</Label>
          <Input id="confirm" type="password" {...form.register("confirm")} />
          {form.formState.errors.confirm && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.confirm.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting...
          </>
        ) : (
          "Reset Password"
        )}
      </Button>
    </form>
  );
}
