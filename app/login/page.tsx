"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Bot,
  Workflow as WorkflowIcon,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/store/use-auth";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NeuralNetwork } from "@/components/login/neural-network";
import { ThemeToggle } from "@/components/theme-toggle";

const stats = [
  { icon: Bot, value: "24", label: "Active Agents" },
  { icon: WorkflowIcon, value: "120", label: "Running Workflows" },
  { icon: ShieldCheck, value: "99.99%", label: "Availability" },
];

const particles = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 53) % 100,
  top: (i * 37) % 100,
  delay: (i % 6) * 0.7,
  duration: 6 + (i % 5),
  size: 2 + (i % 3),
}));

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = React.useState("alpireddylokesh.raj@cognizant.com");
  const [password, setPassword] = React.useState("••••••••••");
  const [showPw, setShowPw] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      login(email);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — brand & visualization */}
      <div className="relative hidden overflow-hidden bg-[#070b1a] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-brand-radial" />
        <div className="absolute inset-0 opacity-40">
          <NeuralNetwork />
        </div>
        {particles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-indigo-300/40"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="relative z-10">
          <Logo className="text-white" size="lg" />
        </div>

        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-indigo-200 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Enterprise AI Operations
            </div>
            <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
              SmartCOMM
              <br />
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-sky-300 bg-clip-text text-transparent">
                GenAI Platform
              </span>
            </h1>
            <p className="text-lg font-medium text-indigo-100/80">
              Build. Orchestrate. Govern. Scale.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-3"
          >
            {stats.map((s, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
              >
                <s.icon className="mb-2 h-5 w-5 text-indigo-300" />
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-indigo-100/60">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <p className="relative z-10 text-xs text-indigo-100/40">
          © 2026 SmartCOMM. Enterprise AI Platform.
        </p>
      </div>

      {/* Right — login card */}
      <div className="relative flex flex-col items-center justify-center bg-background px-6 py-10">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <div className="absolute left-6 top-6 lg:hidden">
          <Logo />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 space-y-1.5">
            <h2 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in to your SmartCOMM workspace to continue.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              Remember me for 30 days
            </label>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">
                  or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={submit}
            >
              <svg className="h-4 w-4" viewBox="0 0 23 23" fill="none">
                <path d="M0 0h11v11H0z" fill="#f25022" />
                <path d="M12 0h11v11H12z" fill="#7fba00" />
                <path d="M0 12h11v11H0z" fill="#00a4ef" />
                <path d="M12 12h11v11H12z" fill="#ffb900" />
              </svg>
              Sign In with Microsoft
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Enterprise AI Platform · Powered by SmartCOMM
          </p>
        </motion.div>
      </div>
    </div>
  );
}
