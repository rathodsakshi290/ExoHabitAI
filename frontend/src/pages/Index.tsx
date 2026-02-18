import { Link } from "react-router-dom";
import { Bot, Satellite, BarChart3 } from "lucide-react";
import Starfield from "@/components/Starfield";
import Navbar from "@/components/Navbar";

const features = [
  {
    icon: Bot,
    title: "Machine Learning Prediction",
    description: "Advanced Random Forest algorithms trained on thousands of confirmed exoplanets to predict habitability with high accuracy.",
  },
  {
    icon: Satellite,
    title: "NASA Dataset Analysis",
    description: "Leveraging the NASA Exoplanet Archive — the most comprehensive database of confirmed exoplanets beyond our solar system.",
  },
  {
    icon: BarChart3,
    title: "Interactive Dashboard",
    description: "Visualize planetary parameters, habitability scores, and feature comparisons through interactive charts and analytics.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Starfield />
      <Navbar />

      {/* Hero */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 opacity-0 animate-fade-in"
          >
            Discover{" "}
            <span className="gradient-text">Habitable Worlds</span>{" "}
            Using Artificial Intelligence
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-in-delay-1">
            Harness the power of machine learning to predict exoplanet habitability using real NASA data. Explore thousands of worlds beyond our solar system.
          </p>
          <Link to="/predict" className="inline-block opacity-0 animate-fade-in-delay-2">
            <button className="gradient-btn text-lg px-10 py-4 font-display tracking-wider animate-pulse-glow">
              Start Prediction
            </button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-12 gradient-text">
            Platform Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`glass-panel-hover p-8 text-center opacity-0 animate-fade-in`}
                style={{ animationDelay: `${0.2 + i * 0.2}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-8 text-center text-muted-foreground text-sm">
        <p>© 2026 ExoHabitAI — AI-Powered Exoplanet Habitability Prediction</p>
      </footer>
    </div>
  );
};

export default Index;
