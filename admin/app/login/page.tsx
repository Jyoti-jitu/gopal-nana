"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth/auth-context";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AlertCircle, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { getCloudinaryUrl } from "@/lib/cloudinary";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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

  const bgUrl = getCloudinaryUrl("/images/hero/home-hero-banner.jpg");

  return (
    <div className="flex min-h-screen w-full bg-slate-100">
      {/* Left Column: Hero Lightning Visual matching Screen 1 in reference image */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden bg-[#07172e] p-12 text-white">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('${bgUrl}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061426] via-[#071a33]/80 to-[#0a2347]/70" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-blue-600/90 flex items-center justify-center p-2 shadow-lg shadow-blue-500/30">
            <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="9" stroke="#93C5FD" strokeWidth="2" strokeDasharray="16 4" />
              <path d="M7 12a5 5 0 0 1 10 0" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-black tracking-widest text-white uppercase block">
              FORECAST
            </span>
            <span className="text-[10px] font-bold text-blue-300 tracking-wider uppercase block">
              EARTHINGS PVT. LTD.
            </span>
          </div>
        </div>

        {/* Bottom Hero Tagline matching Reference */}
        <div className="relative z-10 space-y-2 max-w-md">
          <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Secure Access to a Safer World™
          </h2>
          <p className="text-sm font-medium text-blue-200/90 tracking-wide">
            Enterprise Admin Management Panel
          </p>
        </div>
      </div>

      {/* Right Column: Login Card matching Reference Screen 1 */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-12 md:p-16 bg-white">
        <div className="w-full max-w-md space-y-7">
          {/* Centered Logo & Greeting */}
          <div className="text-center space-y-3">
            <div className="mx-auto h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center p-2.5 border border-blue-100 shadow-sm">
              <svg className="w-full h-full text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="9" stroke="#2563EB" strokeWidth="2" />
                <path d="M7 12a5 5 0 0 1 10 0" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Welcome Back
              </h1>
              <p className="mt-1 text-xs text-slate-500 font-medium">
                Sign in to your Forecast Earthings admin panel
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-center space-x-2 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Email Address</label>
              <Input
                type="email"
                placeholder="admin@forecastearthings.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4" />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => alert("Please contact the super administrator to reset your credentials.")}
                className="text-xs font-semibold text-brand hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Vibrant Blue Sign In Button */}
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full h-11 text-sm font-semibold rounded-lg mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Footer Branding matching Reference Image Screen 1 */}
          <div className="border-t border-slate-100 pt-6 text-center space-y-1">
            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              FORECAST EARTHINGS PVT. LTD.
            </p>
            <p className="text-[11px] font-medium text-slate-500">
              Chalo Banaye Behtar Bharat 🇮🇳
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
