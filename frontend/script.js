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
      renderResult(
        outputId,
        `<strong>Prediction:</strong> ${data.prediction}<br>
         <strong>Confidence:</strong> ${(data.confidence_score * 100).toFixed(2)}%`
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
      datasets: [{
        label: "Habitability Score",
        data: scores,
        backgroundColor: "rgba(30, 136, 229, 0.7)"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 1,
          ticks: {
            color: "#ccc"
          },
          grid: {
            color: "rgba(255,255,255,0.1)"
          }
        },
        x: {
          ticks: {
            color: "#ccc"
          },
          grid: {
            color: "rgba(255,255,255,0.05)"
          }
        }
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

        list += `
          <li>
            <strong>Planet ${i + 1}</strong><br>
            Habitability Score: ${habitability.toFixed(4)}
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
      datasets: [{
        label: "Impact on Habitability",
        data: Object.values(contributions),
        fill: true,
        backgroundColor: "rgba(0, 200, 255, 0.25)",
        borderColor: "#00c8ff",
        pointBackgroundColor: "#00c8ff"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          suggestedMax: 0.3,   // ⭐ important
          ticks: {
            stepSize: 0.05,
            backdropColor: "transparent",
            color: "#aaa"
          },
          pointLabels: {
            color: "#ccc",
            font: { size: 12 }
          },
          grid: {
            color: "rgba(255,255,255,0.12)"
          },
          angleLines: {
            color: "rgba(255,255,255,0.12)"
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: "#ccc"
          }
        }
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

