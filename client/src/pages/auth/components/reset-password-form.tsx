import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function ResetPasswordForm({
  token,
  className,
  ...props
}: {
  token: string;
} & React.ComponentProps<"form">) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`,
      { password },
    );

    navigate("/sign-in");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        {/* Header */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your new password.
          </p>
        </div>

        {/* New Password */}
        <Field>
          <FieldLabel htmlFor="password">New Password</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        {/* Confirm Password */}
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Field>

        {/* Submit */}
        <Field>
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
