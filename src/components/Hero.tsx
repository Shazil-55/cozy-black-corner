
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="py-20 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Welcome to Your New App
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A clean slate to build something amazing. Start adding your components and features.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">Learn More</Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
