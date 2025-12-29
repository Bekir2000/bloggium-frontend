"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn, signUp } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const isSubmitting = form.formState.isSubmitting;

  // Inside onSubmit in RegisterForm.tsx
  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const isSignedUp = await signUp(
        values.email,
        values.password,
        values.name.split(" ")[0],
        values.name.split(" ")[1] || ""
      );

      if (isSignedUp) {
        await signIn(values.email, values.password);
        toast.success("Welcome aboard!");
        router.push("/");
        router.refresh();
      }
    } catch (error: any) {
      // Check if it's our custom ApiError with a detail message
      const errorMessage = error?.message || "Application failed to respond";

      console.error("Registration Details:", error);

      toast.error("Registration Failed", {
        description: errorMessage, // This will now show the actual API detail
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] rounded-[2.5rem] p-4 bg-gray-50/50 dark:bg-zinc-900/50">
        <CardHeader className="pb-8 pt-6">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">
            Account Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="relative pb-7">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-foreground/70 ml-1">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-14 rounded-2xl border-2 border-border/50 bg-background px-6 transition-all focus:border-primary focus:ring-4 focus:ring-primary/5"
                        placeholder="Jacob Kovacek"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="absolute bottom-1 left-1 text-[9px] font-black uppercase tracking-widest text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="relative pb-7">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-foreground/70 ml-1">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className="h-14 rounded-2xl border-2 border-border/50 bg-background px-6 transition-all focus:border-primary focus:ring-4 focus:ring-primary/5"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="absolute bottom-1 left-1 text-[9px] font-black uppercase tracking-widest text-red-500" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative pb-7">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-foreground/70 ml-1">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="h-14 rounded-2xl border-2 border-border/50 bg-background px-6 transition-all focus:border-primary focus:ring-4 focus:ring-primary/5"
                          placeholder="••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="absolute bottom-1 left-1 text-[8px] font-black uppercase tracking-tighter text-red-500 leading-none" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="relative pb-7">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-foreground/70 ml-1">
                        Confirm
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="h-14 rounded-2xl border-2 border-border/50 bg-background px-6 transition-all focus:border-primary focus:ring-4 focus:ring-primary/5"
                          placeholder="••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="absolute bottom-1 left-1 text-[8px] font-black uppercase tracking-tighter text-red-500 leading-none" />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 mt-4 rounded-full bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest text-[11px] shadow-xl transition-all active:scale-[0.98]"
              >
                {isSubmitting ? "Creating..." : "Register Membership"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-center">
        <Link
          href="/login"
          className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          Already a member? Sign in →
        </Link>
      </div>
    </div>
  );
};
