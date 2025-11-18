import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
      email,
    });

    setSent(true);
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
          <h1 className="text-2xl font-bold">Forgot your password?</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email and we will send you a reset link.
          </p>
        </div>

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        {/* Submit */}
        <Field>
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </Field>

        {/* Status */}
        {sent && (
          <p className="text-center text-green-600 text-sm">
            If the email exists, a reset link has been sent.
          </p>
        )}

        {/* Back to login */}
        <FieldDescription className="text-center">
          Remembered your password?{" "}
          <Link to="/sign-in" className="underline underline-offset-4">
            Login
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
