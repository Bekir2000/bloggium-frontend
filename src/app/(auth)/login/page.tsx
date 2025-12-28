"use client";

import LoginForm from "@/components/auth/LoginForm";
import { performDemoLogin } from "@/lib/actions/demo-magic-link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);

  useEffect(() => {
    const handleDemoLogin = async () => {
      const demoType = searchParams.get("demo");
      if (demoType === "hr") {
        setIsAutoLoggingIn(true);
        try {
          const success = await performDemoLogin();
          if (success) {
            router.push("/");
            router.refresh();
          } else {
            setIsAutoLoggingIn(false);
          }
        } catch (error) {
          setIsAutoLoggingIn(false);
        }
      }
    };
    handleDemoLogin();
  }, [searchParams, router]);

  if (isAutoLoggingIn) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <div className="animate-spin h-10 w-10 border-4 border-foreground border-t-transparent rounded-full" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">
          Accessing Demo...
        </h3>
      </div>
    );
  }

  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="w-full max-w-[440px] space-y-8">
        <div className="text-center space-y-3">
          <h1 className="font-sans text-4xl font-black tracking-tighter text-foreground uppercase">
            Sign In
          </h1>
          <p className="font-serif italic text-lg text-muted-foreground leading-relaxed">
            Welcome back to the collection.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="h-[400px] w-full bg-muted/50 animate-pulse rounded-[2.5rem]" />
          }
        >
          <LoginContent />
        </Suspense>
      </div>
    </div>
  );
}
