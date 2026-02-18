import Starfield from "@/components/Starfield";
import Navbar from "@/components/Navbar";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const habitabilityData = [
  { name: "Habitable", value: 34 },
  { name: "Not Habitable", value: 66 },
];

const PIE_COLORS = ["hsl(150, 80%, 45%)", "hsl(0, 72%, 51%)"];

const featureData = [
  { name: "Radius", value: 1.12, fill: "hsl(190, 90%, 55%)" },
  { name: "Mass", value: 0.85, fill: "hsl(220, 80%, 60%)" },
  { name: "Orbital", value: 310, fill: "hsl(270, 60%, 55%)" },
  { name: "Star Temp", value: 5400, fill: "hsl(30, 90%, 55%)" },
  { name: "Density", value: 5.2, fill: "hsl(150, 70%, 50%)" },
];

const stats = [
  { label: "Planets Analyzed", value: "5,247" },
  { label: "Habitable Candidates", value: "1,784" },
  { label: "Model Accuracy", value: "94.3%" },
  { label: "Features Used", value: "21" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen relative">
      <Starfield />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-center mb-2 gradient-text">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground text-center mb-10">
            Sample analytics from exoplanet habitability predictions.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="glass-panel p-5 text-center">
                <p className="font-mono-data text-2xl font-bold text-primary mb-1">{s.value}</p>
                <p className="text-muted-foreground text-xs uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Doughnut */}
            <div className="glass-panel p-6">
              <h3 className="font-display text-lg font-semibold mb-6 text-foreground">Habitability Distribution</h3>
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={habitabilityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {habitabilityData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip
  content={({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "#ffffff",
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            color: "#000",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
          }}
        >
          {payload[0].name} : {payload[0].value}%
        </div>
      );
    }
    return null;
  }}
/>

                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[0] }} /><span className="text-sm text-muted-foreground">Habitable (34%)</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[1] }} /><span className="text-sm text-muted-foreground">Not Habitable (66%)</span></div>
              </div>
            </div>

            {/* Bar */}
            <div className="glass-panel p-6">
              <h3 className="font-display text-lg font-semibold mb-6 text-foreground">Planet Feature Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={featureData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 20%, 18%)" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(225, 25%, 8%)", border: "1px solid hsl(225, 20%, 18%)", borderRadius: "8px", color: "hsl(210, 40%, 95%)" }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {featureData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
