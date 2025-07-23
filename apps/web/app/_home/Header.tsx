import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-neon-pink to-neon-purple rounded-lg"></div>
          <span className="text-xl font-bold bg-gradient-to-r from-neon-pink to-neon-cyan bg-clip-text text-transparent">
            AURA AI
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-foreground hover:text-primary transition-colors">Pricing</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">FAQ</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">Gallery</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">Ideas</a>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="hidden sm:inline-flex">
            Log in
          </Button>
          <Button className="text-sm px-6">
            Take photos like these →
          </Button>
        </div>
      </div>
    </header>
  );
};