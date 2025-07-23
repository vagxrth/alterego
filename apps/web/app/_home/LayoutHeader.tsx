"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function LayoutHeader() {
  const pathname = usePathname();
  
  if (pathname === "/") {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-vibrant-pink to-neon-purple rounded-lg shadow-neon"></div>
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-vibrant-pink to-neon-cyan bg-clip-text text-transparent">
              AlterEgo
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-white hover:text-neon-cyan transition-all duration-300 font-medium">Pricing</a>
            <a href="#" className="text-white hover:text-neon-cyan transition-all duration-300 font-medium">FAQ</a>
            <a href="#" className="text-white hover:text-neon-cyan transition-all duration-300 font-medium">Gallery</a>
            <a href="#" className="text-white hover:text-neon-cyan transition-all duration-300 font-medium">Ideas</a>
          </nav>

          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton>
                <button className="text-white hover:text-neon-cyan transition-all duration-300 bg-transparent border-none cursor-pointer text-sm font-medium">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-gradient-to-r from-vibrant-pink to-neon-purple text-white rounded-full font-bold text-sm px-6 py-2.5 cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-neon">
                  Take photos like these →
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <a href="/train" className="bg-gradient-to-r from-vibrant-pink to-neon-purple text-white rounded-full font-bold text-sm px-6 py-2.5 cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-neon">
                Train Model
              </a>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>
      <div className="pt-20" />
    </>
  );
} 