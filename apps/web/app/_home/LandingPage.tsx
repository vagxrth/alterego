"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Star, Award } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const LandingPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const logos = [
    "New York Times", "Shopify", "TechCrunch", "MSN", "Yahoo", "Google", 
    "Intel", "PwC", "Stanford", "MIT"
  ];

  const testimonials = [
    {
      quote: "AlterEgo is making money by selling the computing cycles required to run the prompts and spit out a set of images",
      source: "TechCrunch",
      logo: "TC"
    },
    {
      quote: "AlterEgo can help content creators save time and money as they'll no longer need to travel or hire expensive photographers to do photoshoots",
      source: "MSN",
      logo: "MSN"
    },
    {
      quote: "AlterEgo will be able to generate a virtually unlimited number of portraits of that person with different clothing...",
      source: "Fast Company",
      logo: "FC"
    }
  ];

  const handleGetStarted = () => {
    // If signed in, go to train page, otherwise trigger signup
    router.push('/train');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-neon-pink to-neon-purple rounded-lg"></div>
            <span 
              className="text-xl font-bold bg-gradient-to-r from-neon-pink to-neon-cyan bg-clip-text text-transparent"
              style={{
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              AlterEgo
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors">Pricing</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">FAQ</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Gallery</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Ideas</a>
          </nav>

          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton>
                <Button variant="ghost" className="hidden sm:inline-flex">
                  Log in
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button variant="neon" className="text-sm px-6">
                  Take photos like these →
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button 
                variant="neon" 
                className="text-sm px-6"
                onClick={() => router.push('/train')}
              >
                Train Model →
              </Button>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen bg-hero-gradient relative overflow-hidden">
        {/* Background Image - Replace this URL with your own image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80)` }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
        
        <div className="relative container mx-auto px-4 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-border rounded-full px-6 py-3">
                <Award className="w-5 h-5 text-neon-cyan" />
                <span className="text-sm font-medium">#1 AI Photographer</span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-neon-pink text-neon-pink" />
                  ))}
                </div>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="text-foreground">🔥 Fire your</span>
                  <br />
                  <span 
                    className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-clip-text"
                    style={{
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text'
                    }}
                  >
                    Photographer
                  </span>
                </h1>
              </div>

              {/* Feature List */}
              <div className="space-y-3 text-lg text-muted-foreground">
                <p className="flex items-center space-x-3">
                  <span>✏️</span>
                  <span>Upload your selfies → Create an <span className="text-neon-cyan font-semibold">AI model</span> of yourself</span>
                </p>
                <p className="flex items-center space-x-3">
                  <span>👸</span>
                  <span>...or <span className="text-neon-pink font-semibold">create a 100% AI influencer</span> to monetize</span>
                </p>
                <p className="flex items-center space-x-3">
                  <span>📸</span>
                  <span>Then <span className="text-neon-purple font-semibold">take AI photos</span> with your AI model in any pose, place or action</span>
                </p>
                <p className="flex items-center space-x-3">
                  <span>🎥</span>
                  <span>And <span className="text-neon-cyan font-semibold">create AI videos</span> starring your AI model as the main character</span>
                </p>
                <p className="flex items-center space-x-3">
                  <span>❤️</span>
                  <span>Run 100s of photo packs like Tinder or AI Photography</span>
                </p>
              </div>

              {/* Speed Highlight */}
              <div className="bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20 border border-neon-cyan/30 rounded-lg p-4">
                <p className="text-lg font-semibold text-neon-cyan">
                  💨 Get your first free photos in less than a minute!
                </p>
              </div>
            </div>

            {/* Right Column - Sign Up Form */}
            <div className="lg:ml-auto">
              <div className="bg-card-gradient backdrop-blur-lg border border-border rounded-2xl p-8 shadow-card max-w-md mx-auto">
                {/* Form Header */}
                <div className="text-center mb-6">
                  <div className="inline-block bg-gradient-to-r from-neon-cyan to-neon-pink text-background font-bold text-sm px-4 py-2 rounded-full mb-4">
                    Get your first free photos in less than a minute!
                  </div>
                </div>

                {/* Email Form */}
                <div className="space-y-4">
                  <SignedOut>
                    <Input 
                      type="email" 
                      placeholder="Type your email..." 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                    <SignUpButton>
                      <Button variant="hero" className="w-full">
                        Start taking AI photos now →
                      </Button>
                    </SignUpButton>
                  </SignedOut>
                  
                  <SignedIn>
                    <Button 
                      variant="hero" 
                      className="w-full"
                      onClick={handleGetStarted}
                    >
                      Start training your AI model →
                    </Button>
                  </SignedIn>
                  
                  <p className="text-center text-sm text-muted-foreground">
                    ⭐ 1,015,351 photos generated this month
                  </p>
                  
                  <SignedOut>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-card px-2 text-muted-foreground">or</span>
                      </div>
                    </div>

                    <SignUpButton>
                      <Button variant="outline" className="w-full bg-white text-black hover:bg-white/90">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </Button>
                    </SignUpButton>
                    
                    <p className="text-center text-xs text-muted-foreground">
                      If you already have an account, we&apos;ll log you in
                    </p>
                  </SignedOut>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-16 bg-background/95 backdrop-blur-sm border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm text-muted-foreground mb-8">as seen on</p>
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 opacity-60">
              {logos.map((logo, index) => (
                <div 
                  key={index} 
                  className="text-muted-foreground font-semibold text-sm lg:text-base hover:text-foreground transition-colors"
                >
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="bg-card-gradient backdrop-blur-lg border-border shadow-card p-8 hover:shadow-neon transition-all duration-300"
              >
                <blockquote className="text-muted-foreground leading-relaxed mb-6">
                  {testimonial.quote}
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-lg flex items-center justify-center text-background font-bold text-sm">
                    {testimonial.logo}
                  </div>
                  <div className="font-semibold text-foreground">
                    {testimonial.source}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold">
              AlterEgo is the <span 
                className="bg-gradient-to-r from-neon-pink to-neon-cyan bg-clip-text text-transparent"
                style={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >first AI Photographer</span> in the world.
            </h2>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Train photo models with AI, and then use the AI Photographer to take photos with them. 
              Photos you see below are taken with AlterEgo and look real, but are 100% AI.
            </p>

            <div className="bg-card-gradient backdrop-blur-lg border border-border rounded-2xl p-8 shadow-card">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-border bg-input"
                  defaultChecked
                />
                <span className="text-sm text-muted-foreground">
                  I agree to the Terms of Service
                </span>
              </div>
              
              <SignedOut>
                <SignUpButton>
                  <Button variant="hero" size="lg" className="text-xl px-12 py-6">
                    Start taking AI photos now →
                  </Button>
                </SignUpButton>
              </SignedOut>
              
              <SignedIn>
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="text-xl px-12 py-6"
                  onClick={handleGetStarted}
                >
                  Start training your AI model →
                </Button>
              </SignedIn>
              
              <p className="text-neon-cyan font-semibold mt-4">
                🌟 1,015,351 photos generated this month
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}; 