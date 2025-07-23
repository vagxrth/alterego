import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Award } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const HeroSection = () => {
  return (
    <section className="min-h-screen bg-hero-gradient relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${heroImage})` }}
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
                <span className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-clip-text text-transparent">
                  photographer
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
                <Input 
                  type="email" 
                  placeholder="Type your email..." 
                  className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground"
                />
                <Button className="w-full">
                  Start taking AI photos now →
                </Button>
                
                <p className="text-center text-sm text-muted-foreground">
                  ⭐ 1,015,351 photos generated this month
                </p>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-white text-black hover:bg-white/90">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
                
                <p className="text-center text-xs text-muted-foreground">
                  If you already have an account, we&apos;ll log you in
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};