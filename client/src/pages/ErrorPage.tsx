"use client";
import { useNavigate, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";

type RouteError = {
  status?: number;
  statusText?: string;
  message?: string;
};

const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError() as RouteError;

  const handleReload = () => window.location.reload();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-8 px-4 md:px-8 bg-background relative">
      {/* Background subtle icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <AlertTriangle className="w-64 h-64 text-muted-foreground" />
      </div>

      <div className="z-10 text-center flex flex-col items-center gap-4 max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Oops! Something went wrong.
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl">
          {error?.statusText ||
            error?.message ||
            "An unexpected error occurred."}
        </p>

        {error?.status && (
          <p className="text-sm text-muted-foreground/70">
            Error Code: <span className="font-mono">{error.status}</span>
          </p>
        )}

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto justify-center mt-6">
          <Button
            variant="outline"
            className="rounded-full shadow-md"
            onClick={handleReload}
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </Button>
          <Button
            className="rounded-full bg-yellow-500 text-black hover:bg-yellow-400 shadow-md"
            onClick={() => navigate("/")}
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
