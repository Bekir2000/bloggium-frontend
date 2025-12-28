import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="w-full max-w-[440px] space-y-8">
        <div className="text-center space-y-3">
          <h1 className="font-sans text-4xl font-black tracking-tighter text-foreground uppercase">
            Join Us
          </h1>
          <p className="font-serif italic text-lg text-muted-foreground leading-relaxed">
            Start crafting your story today.
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
