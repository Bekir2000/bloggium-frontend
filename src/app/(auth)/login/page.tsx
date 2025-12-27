"use client";

import LoginForm from "@/components/auth/LoginForm";
import { performDemoLogin } from "@/lib/actions/demo-magic-link";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react"; // Added Suspense import

// 1. RENAME original component to 'LoginContent'
function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);

  useEffect(() => {
    const handleDemoLogin = async () => {
      // Check for the magic query param (e.g. ?demo=hr)
      const demoType = searchParams.get("demo");

      if (demoType === "hr") {
        setIsAutoLoggingIn(true);

        try {
          // Call the Server Action
          const success = await performDemoLogin();

          if (success) {
            router.push("/");
            router.refresh();
          } else {
            console.error(
              "Auto-login failed: Invalid credentials or server error"
            );
            setIsAutoLoggingIn(false);
          }
        } catch (error) {
          console.error("Auto-login error:", error);
          setIsAutoLoggingIn(false);
        }
      }
    };

    handleDemoLogin();
  }, [searchParams, router]);

  // Show a loading spinner while logging in
  if (isAutoLoggingIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
          <h3 className="text-xl font-semibold text-gray-800">
            Accessing Demo Environment...
          </h3>
          <p className="text-sm text-gray-500">
            Please wait while we log you in securely.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-8 shadow-md">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Sign in to your account</h2>
          <p className="text-sm text-gray-600">
            Welcome back! Please enter your details.
          </p>
        </div>

        <LoginForm />

        <p className="mt-4 text-center text-sm text-gray-600">
          {/* Fixed quote here: Don't -> Don&apos;t */}
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

// 2. EXPORT a new wrapper component as default
export default function LoginPage() {
  return (
    // This tells Next.js: "If URL params aren't ready, show this fallback"
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
