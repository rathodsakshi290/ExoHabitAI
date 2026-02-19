import Starfield from "@/components/Starfield";
import Navbar from "@/components/Navbar";
import { Globe, Sparkles, Brain, Database } from "lucide-react";

const sections = [
  {
    icon: Globe,
    title: "What Are Exoplanets?",
    content:
      "Exoplanets are planets that orbit stars outside our solar system. Since the first confirmed discovery in 1992, over 5,000 exoplanets have been cataloged by NASA. These distant worlds come in an incredible variety — from scorching gas giants to rocky Earth-sized planets in the habitable zone of their parent star.",
  },
  {
    icon: Sparkles,
    title: "What Is Habitability?",
    content:
      "Habitability refers to a planet's potential to support life as we know it. Key factors include the presence of liquid water, an appropriate temperature range, suitable atmospheric conditions, and the right distance from its host star (the habitable zone). Our AI model evaluates 21 different planetary and stellar parameters to assess this potential.",
  },
  {
    icon: Brain,
    title: "Machine Learning Approach",
    content:
      "ExoHabitAI uses a Random Forest classifier — an ensemble learning method that builds multiple decision trees and merges their results for robust predictions. The model is trained on confirmed exoplanet data from NASA, learning complex patterns across features like planet radius, mass, orbital characteristics, and host star properties to predict habitability with high confidence.",
  },
  {
    icon: Database,
    title: "NASA Exoplanet Archive",
    content:
      "Our dataset comes from the NASA Exoplanet Archive, the most comprehensive and regularly updated catalog of confirmed exoplanets. It contains detailed measurements for thousands of planets including physical parameters (radius, mass, density), orbital characteristics (period, eccentricity), and host star properties (temperature, luminosity, metallicity).",
  },
];

const About = () => {
  return (
    <div className="min-h-screen relative">
      <Starfield />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-center mb-2 gradient-text">
            About ExoHabitAI
          </h1>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Understanding how artificial intelligence is revolutionizing the search for habitable worlds beyond our solar system.
          </p>

          <div className="space-y-6">
            {sections.map((section, i) => (
              <div
                key={section.title}
                className="glass-panel-hover p-6 sm:p-8 opacity-0 animate-fade-in"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20">
                    <section.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold mb-3 text-foreground">
                      {section.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
