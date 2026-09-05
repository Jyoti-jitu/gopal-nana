"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth/auth-context";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Shield, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@forecastearthings.com");
  const [password, setPassword] = useState("Admin@Forecast2026!");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid credentials or login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-2xl border border-navy-800">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy-900 text-brand-light shadow-md">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-xl font-extrabold uppercase tracking-wider text-navy-950">
            FORECAST EARTHINGS
          </h1>
          <p className="mt-1 text-xs font-bold uppercase tracking-widest text-navy-500">
            ADMIN MANAGEMENT PANEL
          </p>
        </div>

        {errorMessage && (
          <div className="flex items-center space-x-2 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Super Admin / Editor Email"
            type="email"
            placeholder="admin@forecastearthings.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Account Password"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" isLoading={isLoading} className="w-full h-11 text-sm font-semibold">
            <Lock className="mr-2 h-4 w-4" /> Sign In to CMS Panel
          </Button>
        </form>

        <div className="border-t border-navy-100 pt-4 text-center">
          <p className="text-[11px] text-navy-400 font-medium">
            Protected Enterprise Content Management System
          </p>
        </div>
      </div>
    </div>
  );
}
