import Background from "@/assets/background.jpg";
import { Link } from "react-router-dom";
import { ForgotPasswordForm } from "./components/forgot-password-form";

export default function ForgotPassword() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* LEFT IMAGE */}
      <div className="bg-muted relative hidden lg:block">
        <img
          src={Background}
          alt="Forgot Password"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="absolute top-6 left-6 text-xl font-bold text-white">
          Real Estate
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center md:justify-start gap-2 lg:hidden">
          <Link to="/" className="flex items-center gap-2 font-medium">
            Real Estate
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xl">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
