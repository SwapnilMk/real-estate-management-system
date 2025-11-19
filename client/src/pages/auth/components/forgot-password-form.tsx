"use client";

import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "@/services/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { ForgotPasswordSchema } from "../schema/auth.schemas";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      toast.success("If this email exists, a reset link has been sent.");
      setSent(true);
    } catch (err) {
      toast.success("If this email exists, a reset link has been sent.");
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="text-center space-y-6 py-14">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="text-3xl font-bold">Check your email</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          If an account exists with <strong>{form.getValues("email")}</strong>,
          a password reset link has been sent.
        </p>

        <Link to="/sign-in">
          <Button variant="outline">Back to Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Forgot your password?</h1>
        <p className="text-muted-foreground">We'll send you a reset link</p>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Reset Link"
        )}
      </Button>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link to="/sign-in" className="underline hover:text-primary">
          Sign in
        </Link>
      </p>
    </form>
  );
}
