"use client";
import { RegisterRequest } from "@/api/generated/model";
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
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }) satisfies z.ZodType<RegisterRequest>;

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    console.log(values);
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] rounded-[2.5rem] p-4 bg-gray-50/50 dark:bg-zinc-900/50">
        <CardHeader className="pb-8 pt-6">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            Account Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-foreground/70 ml-1">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-14 rounded-2xl border-2 border-border/50 px-6"
                        placeholder="Jacob Kovacek"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold uppercase" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-foreground/70 ml-1">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className="h-14 rounded-2xl border-2 border-border/50 px-6"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold uppercase" />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-foreground/70 ml-1">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="h-14 rounded-2xl border-2 border-border/50 px-6"
                          placeholder="••••••"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-foreground/70 ml-1">
                        Confirm
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="h-14 rounded-2xl border-2 border-border/50 px-6"
                          placeholder="••••••"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-14 mt-4 rounded-full bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest text-[11px] shadow-xl"
              >
                Register Membership
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="text-center">
        <Link
          href="/login"
          className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          Already a member? Sign in →
        </Link>
      </div>
    </div>
  );
};
