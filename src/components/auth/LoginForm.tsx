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
import { signIn } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const isLoggedIn = await signIn(values.email, values.password);
      if (!isLoggedIn) {
        toast.error("Entry Denied", { description: "Invalid credentials." });
      } else {
        toast.success("Login Successful!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  }

  return (
    <div className="space-y-8">
      <Card className="border-none shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] rounded-[2.5rem] p-4 bg-gray-50/50 dark:bg-zinc-900/50">
        <CardHeader className="pb-8 pt-6">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">
            Security Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        className="h-14 rounded-2xl border-2 border-border/50 bg-background transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 px-6"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold uppercase" />
                  </FormItem>
                )}
              />

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
                        className="h-14 rounded-2xl border-2 border-border/50 bg-background transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 px-6"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold uppercase" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-14 rounded-full bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest text-[11px] shadow-xl shadow-black/10 transition-all active:scale-[0.98]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Syncing..." : "Access Account"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="text-center">
        <Link
          href="/register"
          className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          New here? Create a membership →
        </Link>
      </div>
    </div>
  );
}
