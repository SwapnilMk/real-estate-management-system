"use client";

import { useLoginMutation } from "@/services/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { LoginSchema } from "../schema/auth.schemas";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      toast.success("Login successful");
      if (result.user.role === "AGENT") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Invalid credentials");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          Enter your credentials to sign in
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Password</Label>
            <Link
              to="/forgot-password"
              className="text-sm underline hover:text-primary"
            >
              Forgot password?
            </Link>
          </div>

          <Input type="password" {...form.register("password")} />
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>
      </div>

      <Button className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 animate-spin" /> Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/sign-up" className="underline hover:text-primary">
          Sign up
        </Link>
      </p>
    </form>
  );
}
