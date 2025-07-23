import { Button } from "@/components/ui/button";

export const FeatureShowcase = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Photo AI is the <span className="bg-gradient-to-r from-neon-pink to-neon-cyan bg-clip-text text-transparent">first AI Photographer</span> in the world.
          </h2>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            Train photo models with AI, and then use the AI Photographer to take photos with them. 
            Photos you see below are taken with Photo AI and look real, but are 100% AI.
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
            
            <Button size="lg" className="text-xl px-12 py-6">
              Start taking AI photos now →
            </Button>
            
            <p className="text-neon-cyan font-semibold mt-4">
              🌟 1,015,351 photos generated this month
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};