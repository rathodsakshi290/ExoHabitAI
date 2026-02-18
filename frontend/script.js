const API = "http://127.0.0.1:5000";

/* ---------- UTILITY ---------- */

function renderResult(containerId, html) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="output-box">
      <button class="btn-close position-absolute top-0 end-0 m-2"
        onclick="this.parentElement.remove()"></button>
      ${html}
    </div>
  `;
}

/* ---------- FORM PREDICTION ---------- */

function predictFromForm() {
  const fields = [
    "radius", "mass", "period", "axis",
    "density", "temp", "lum", "met", "type"
  ];

  for (let id of fields) {
    const el = document.getElementById(id);
    if (!el.value || el.value.trim() === "") {
      alert("Please fill in all fields before predicting.");
      return;
    }
  }

  const data = {
    "Planet radius": Number(radius.value),
    "Planet mass": Number(mass.value),
    "Orbital period": Number(period.value),
    "Semi-major axis": Number(axis.value),
    "Planet density": Number(density.value),
    "Host star temperature": Number(temp.value),
    "Star luminosity": Number(lum.value),
    "Star metallicity": Number(met.value),
    "Star type": type.value
  };

  sendPredict(data, "formResult");
}

/* ---------- JSON PREDICTION ---------- */

function predictFromJSON() {
  try {
    const data = JSON.parse(jsonInput.value);
    sendPredict(data, "jsonResult");
  } catch {
    alert("Invalid JSON format.");
  }
}

/* ---------- SHARED PREDICT ---------- */

function sendPredict(payload, outputId) {
  fetch(`${API}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      renderPredictionUI(
        outputId,
        data.prediction,
        (data.confidence_score * 100).toFixed(0)
      );


      const contributionData = computeContributionFromInput(payload);

      // FORM prediction
      if (outputId === "formResult") {
        const section = document.getElementById("formContributionSection");
        section.classList.remove("d-none");

        setTimeout(() => {
          drawContributionChart(
            "formContributionChart",
            contributionData
          );
        }, 100);
      }

      // JSON prediction
      if (outputId === "jsonResult") {
        const section = document.getElementById("jsonContributionSection");
        section.classList.remove("d-none");

        setTimeout(() => {
          drawContributionChart(
            "jsonContributionChart",
            contributionData
          );
          section.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    })
    .catch(err => {
      console.error(err);
      alert("Prediction failed.");
    });
}



/* ---------- MULTI PLANET ---------- */


/*Rank Chart Function*/
let rankChart;

function drawRankChart(labels, scores) {
  const ctx = document.getElementById("rankChart").getContext("2d");

  if (rankChart) rankChart.destroy();

  rankChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          data: scores,
          backgroundColor: "#2de2ff",
          borderRadius: 10,
          barThickness: 60
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      scales: {
        y: {
          beginAtZero: true,
          max: 1, /* IMPORTANT */
          ticks: {
            stepSize: 0.25,
            color: "rgba(200,220,255,0.6)"
          },
          grid: {
            color: "rgba(255,255,255,0.08)"
          }
        },
        x: {
          ticks: {
            color: "rgba(200,220,255,0.7)"
          },
          grid: {
            display: false
          }
        }
      },

      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(15,18,30,0.95)",
          borderColor: "#2de2ff",
          borderWidth: 1,
          titleColor: "#ffffff",
          bodyColor: "#2de2ff",
          displayColors: false,
          callbacks: {
            label: (ctx) =>
              "Habitability score : " + ctx.raw.toFixed(4)
          }
        }
      },

      animation: {
        duration: 800,
        easing: "easeOutQuart"
      }
    }
  });
}

function addPlanetJson() {
  const container = document.getElementById("planetJsonContainer");

  const card = document.createElement("div");
  card.className = "card glass mt-3 p-3 position-relative";

  card.innerHTML = `
    <button class="btn-close btn-close-white position-absolute top-0 end-0 m-2"
      onclick="this.parentElement.remove()"></button>

    <textarea class="form-control planet-json" rows="6" placeholder='{
  "Planet radius": 1.2,
  "Planet mass": 2.0,
  "Orbital period": 365,
  "Semi-major axis": 1.0,
  "Planet density": 5.5,
  "Host star temperature": 288,
  "Star luminosity": 1.0,
  "Star metallicity": 0.02,
  "Star type": "G"
}'></textarea>
  `;

  container.appendChild(card);
}

function rankPlanets() {
  const planets = [];

  try {
    document.querySelectorAll(".planet-json").forEach(t => {
      if (t.value.trim()) {
        planets.push(JSON.parse(t.value));
      }
    });
  } catch {
    alert("Invalid JSON in one of the planet inputs.");
    return;
  }

  if (planets.length === 0) {
    alert("Please add at least one exoplanet.");
    return;
  }

  console.log("Sending planets:", planets);

  fetch(`${API}/rank`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planets })
  })
    .then(res => res.json())
    .then(data => {

      // ✅ Backend contract check
      if (data.status !== "success" || !Array.isArray(data.ranked_exoplanets)) {
        alert("Unexpected backend response.");
        console.error("Response:", data);
        return;
      }

      let list = "<ol>";
      const scores = [];
      const labels = [];

      data.ranked_exoplanets.forEach((p, i) => {
  const habitability = Number(p.habitability_score) || 0;
  const barWidth = Math.min(habitability * 100, 100);

  list += `
    <li>
      <strong>#${i + 1} Planet ${i + 1}</strong>

      <div class="rank-bar">
        <div class="rank-bar-fill" style="width:${barWidth}%"></div>
      </div>

      <div class="rank-score">
        ${(habitability * 100).toFixed(0)}%
      </div>
    </li>
  `;

  scores.push(habitability);
  labels.push(`Planet ${i + 1}`);
});


      list += "</ol>";

      renderResult("rankResult", list);

      // Show chart section
      const section = document.getElementById("rankSection");
      section.classList.remove("d-none");

      // Draw chart
      setTimeout(() => {
        drawRankChart(labels, scores);
      }, 100);
    })
    .catch(err => {
      console.error("Rank error:", err);
      alert("Ranking failed.");
    });
}

let contributionCharts = {};

function drawContributionChart(canvasId, contributions) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  if (contributionCharts[canvasId]) {
    contributionCharts[canvasId].destroy();
  }

  contributionCharts[canvasId] = new Chart(ctx, {
    type: "radar",
    data: {
      labels: Object.keys(contributions),
      datasets: [
        {
          data: Object.values(contributions),

          /* Line */
          borderColor: "#2de2ff",
          borderWidth: 2,

          /* Fill */
          backgroundColor: "rgba(45,226,255,0.18)",

          /* Points */
          pointRadius: 3,
          pointHoverRadius: 7,
          pointBackgroundColor: "#2de2ff",
          pointBorderColor: "#0b0f1c",
          pointHoverBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      /* 🔥 IMPORTANT PART */
      interaction: {
        mode: "nearest",
        intersect: false
      },

      scales: {
        r: {
          beginAtZero: true,

          grid: {
            color: "rgba(255,255,255,0.12)"
          },
          angleLines: {
            color: "rgba(255,255,255,0.12)"
          },
          ticks: {
            display: false
          },
          pointLabels: {
            color: "rgba(220,240,255,0.7)",
            font: { size: 11 }
          }
        }
      },

      plugins: {
        legend: { display: false },

        tooltip: {
          enabled: true,
          backgroundColor: "rgba(15,18,30,0.95)",
          borderColor: "#2de2ff",
          borderWidth: 1,
          titleColor: "#ffffff",
          bodyColor: "#2de2ff",
          padding: 12,
          cornerRadius: 10,
          displayColors: false,

          callbacks: {
            title: (items) => items[0].label,
            label: (item) =>
              "value : " + Number(item.raw).toFixed(3)
          }
        }
      },

      animation: {
        duration: 700,
        easing: "easeOutQuart"
      }
    }
  });
}




function computeContributionFromInput(input) {
  const raw = {
    "Planet radius": Math.abs(input["Planet radius"] - 1),
    "Planet mass": Math.abs(input["Planet mass"] - 1),

    // smoother scaling (no spikes)
    "Orbital period": Math.abs(input["Orbital period"] - 365) / 365,
    "Semi-major axis": Math.abs(input["Semi-major axis"] - 1),

    "Planet density": Math.abs(input["Planet density"] - 5.5),
    "Host star temperature": Math.abs(input["Host star temperature"] - 288) / 288,
    "Star luminosity": Math.abs(input["Star luminosity"] - 1),
    "Star metallicity": Math.abs(input["Star metallicity"] - 0.02),

    // categorical → fixed mild influence
    "Star type": 0.3
  };

  const sum = Object.values(raw).reduce((a, b) => a + b, 0);

  const normalized = {};
  for (let key in raw) {
    normalized[key] = +(raw[key] / sum).toFixed(3);
  }

  return normalized;
}
// Smooth scroll to Single Planet Prediction
const exploreBtn = document.getElementById("exploreBtn");
const scrollHint = document.querySelector(".scroll-hint");

function scrollToPrediction() {
  const target = document.querySelector(".section-heading");
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

exploreBtn?.addEventListener("click", scrollToPrediction);
scrollHint?.addEventListener("click", scrollToPrediction);

// Optional: scroll on mouse wheel from hero
window.addEventListener("wheel", (e) => {
  if (window.scrollY < 50 && e.deltaY > 0) {
    scrollToPrediction();
  }
}, { once: true });
function renderPredictionUI(containerId, prediction, confidence) {
  const container = document.getElementById(containerId);

  const isHabitable = prediction.toLowerCase().includes("habitable") &&
    !prediction.toLowerCase().includes("not");

  container.innerHTML = `
    <div class="output-box">
      <div class="prediction-strip">
        <div class="prediction-left">
          <div class="prediction-label">PREDICTION</div>
          <div class="prediction-pill ${isHabitable ? "habitable" : "not-habitable"}">
            ${isHabitable ? "✔" : "⛔"} ${prediction}
          </div>
        </div>

        <div class="confidence-box">
          <div class="confidence-label">
            CONFIDENCE: ${confidence}%
          </div>
          <div class="confidence-bar">
            <div class="confidence-fill" style="width:${confidence}%"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}
