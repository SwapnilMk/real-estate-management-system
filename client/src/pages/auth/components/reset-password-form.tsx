"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";
import { useResetPasswordMutation } from "@/services/authApi";

interface Props {
  token: string;
}

export function ResetPasswordForm({ token }: Props) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const result = await resetPassword({ token, password }).unwrap();
      if (result.accessToken) {
        dispatch(setCredentials(result));
        setSuccess(true);
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err: any) {
      alert(err.data?.message || "Invalid or expired token");
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6 py-10">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="text-2xl font-bold">Password Reset Successful!</h2>
        <p className="text-muted-foreground">Redirecting to home...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Set New Password</h1>
        <p className="text-muted-foreground">Enter a strong new password</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div>
          <Label htmlFor="confirm">Confirm New Password</Label>
          <Input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
      </div>

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