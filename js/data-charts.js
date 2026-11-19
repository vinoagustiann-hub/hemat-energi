/* =========================================================
   Hemat Energi, Selamatkan Bumi — Fase 2
   Visualisasi Data & Grafik Interaktif menggunakan Chart.js
   Sumber Data: data-perilaku-energi.js (DATA_ENERGI)
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  // Pastikan data dan Chart.js tersedia
  const data = window.DATA_ENERGI || (typeof DATA_ENERGI !== "undefined" ? DATA_ENERGI : null);

  if (!data) {
    console.error("DATA_ENERGI tidak ditemukan. Pastikan data-perilaku-energi.js dimuat sebelum skrip ini.");
    return;
  }

  if (typeof Chart === "undefined") {
    console.error("Chart.js tidak ditemukan. Pastikan CDN Chart.js dimuat di HTML.");
    return;
  }

  // Konfigurasi default visual Chart.js
  Chart.defaults.font.family = "'Inter', system-ui, -apple-system, sans-serif";
  Chart.defaults.color = "#374151";

  // Palette warna tema
  const colors = {
    greenPrimary: "#16a34a",
    greenDark: "#15803d",
    greenDeep: "#14532d",
    greenLight: "#86efac",
    greenSoft: "#dcfce7",
    yellowPrimary: "#eab308",
    yellowAccent: "#facc15",
    amberLight: "#fef3c7",
    amberDark: "#b45309",
    blueLight: "#93c5fd",
    bluePrimary: "#2563eb",
    redLight: "#fca5a5",
    redPrimary: "#dc2626",
    grayBorder: "#e5e7eb",
  };

  // -----------------------------------------------------------
  // 1. Grafik Sebaran Kategori Perilaku (Doughnut Chart)
  // -----------------------------------------------------------
  const ctxCategory = document.getElementById("categoryChart");
  if (ctxCategory) {
    const katLabels = ["Sangat Baik (Skor 3.26 - 4.00)", "Baik (Skor 2.51 - 3.25)", "Cukup (Skor 1.76 - 2.50)", "Kurang (Skor 1.00 - 1.75)"];
    const katValues = [
      data.ringkasan.kategori["Sangat Baik"],
      data.ringkasan.kategori["Baik"],
      data.ringkasan.kategori["Cukup"],
      data.ringkasan.kategori["Kurang"]
    ];

    new Chart(ctxCategory, {
      type: "doughnut",
      data: {
        labels: katLabels,
        datasets: [
          {
            data: katValues,
            backgroundColor: [
              colors.greenDark,
              colors.greenPrimary,
              colors.yellowAccent,
              colors.redPrimary
            ],
            borderColor: "#ffffff",
            borderWidth: 2,
            hoverOffset: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 14,
              padding: 16,
              font: { size: 12, weight: "500" }
            }
          },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const val = ctx.parsed;
                const pct = ((val / total) * 100).toFixed(1);
                return ` ${ctx.label.split(" (")[0]}: ${val} siswa (${pct}%)`;
              }
            }
          }
        },
        cutout: "62%"
      }
    });
  }

  // -----------------------------------------------------------
  // 2. Grafik Skor 10 Indikator Perilaku (Horizontal Bar Chart)
  // -----------------------------------------------------------
  const ctxIndicators = document.getElementById("indicatorsChart");
  if (ctxIndicators) {
    const butirData = data.per_butir;
    const labels = butirData.map(b => `${b.kode}: ${b.label}`);
    const scores = butirData.map(b => b.rata_rata);

    // Bedakan warna: 3 tertinggi (hijau gelap), 3 terendah (kuning/amber), sisanya hijau standar
    const bgColors = butirData.map(b => {
      if (b.kode === "P01" || b.kode === "P02" || b.kode === "P06") {
        return colors.greenDark; // Tertinggi
      }
      if (b.kode === "P04" || b.kode === "P09" || b.kode === "P05") {
        return colors.yellowPrimary; // Terendah / butuh perhatian
      }
      return colors.greenPrimary;
    });

    new Chart(ctxIndicators, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Rata-rata Skor (Skala 1.00 - 4.00)",
            data: scores,
            backgroundColor: bgColors,
            borderRadius: 6,
            maxBarThickness: 24
          }
        ]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            min: 2.8,
            max: 3.8,
            grid: { color: colors.grayBorder },
            ticks: {
              stepSize: 0.2,
              callback: val => Number(val).toFixed(1)
            },
            title: {
              display: true,
              text: "Rata-rata Skor (1 = Kurang, 4 = Sangat Baik)",
              font: { size: 12, weight: "600" }
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { size: 11, weight: "500" }
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: function (items) {
                const idx = items[0].dataIndex;
                return `${butirData[idx].kode} — ${butirData[idx].pertanyaan}`;
              },
              label: function (ctx) {
                const idx = ctx.dataIndex;
                const b = butirData[idx];
                return [
                  `Rata-rata Skor: ${b.rata_rata.toFixed(2)} / 4.00`,
                  `Siswa Sering (Skor 3-4): ${b.persen_sering}%`,
                  `Siswa Jarang (Skor 1-2): ${b.persen_jarang}%`
                ];
              }
            }
          }
        }
      }
    });
  }

  // -----------------------------------------------------------
  // 3. Grafik Perbandingan Per Jurusan (Bar Chart)
  // -----------------------------------------------------------
  const ctxMajor = document.getElementById("majorChart");
  if (ctxMajor) {
    const majors = [...data.per_jurusan].sort((a, b) => b.rata_rata_skor - a.rata_rata_skor);
    const majorLabels = majors.map(m => `${m.kode} (${m.nama})`);
    const majorScores = majors.map(m => m.rata_rata_skor);

    new Chart(ctxMajor, {
      type: "bar",
      data: {
        labels: majorLabels,
        datasets: [
          {
            label: "Rata-rata Skor Indeks Hemat Energi",
            data: majorScores,
            backgroundColor: majors.map((m, idx) => {
              if (idx < 2) return colors.greenDark;
              if (idx >= majors.length - 2) return colors.yellowPrimary;
              return colors.greenPrimary;
            }),
            borderRadius: 6,
            maxBarThickness: 36
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 3.0,
            max: 3.6,
            grid: { color: colors.grayBorder },
            ticks: {
              stepSize: 0.1,
              callback: val => Number(val).toFixed(2)
            },
            title: {
              display: true,
              text: "Rata-rata Skor Jurusan",
              font: { size: 12, weight: "600" }
            }
          },
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 11, weight: "600" },
              callback: function (val, index) {
                return majors[index].kode;
              }
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: function (items) {
                const idx = items[0].dataIndex;
                return `${majors[idx].nama} (${majors[idx].kode})`;
              },
              label: function (ctx) {
                const idx = ctx.dataIndex;
                const m = majors[idx];
                return [
                  `Rata-rata Skor: ${m.rata_rata_skor.toFixed(2)} / 4.00`,
                  `Jumlah Responden: ${m.jumlah_responden} siswa`,
                  `Kategori Sangat Baik: ${m.kategori_persen["Sangat Baik"]}%`
                ];
              }
            }
          }
        }
      }
    });
  }

  // -----------------------------------------------------------
  // 4. Grafik Sebaran Skor Total Responden (Distribution Line/Bar Chart)
  // -----------------------------------------------------------
  const ctxDistribution = document.getElementById("distributionChart");
  if (ctxDistribution) {
    const distData = data.sebaran_skor_total;
    const labels = distData.map(d => `${d.skor_total}`);
    const counts = distData.map(d => d.jumlah);

    new Chart(ctxDistribution, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Jumlah Siswa",
            data: counts,
            backgroundColor: distData.map(d => (d.skor_total >= 33 ? colors.greenPrimary : colors.greenLight)),
            borderColor: colors.greenDark,
            borderWidth: 1,
            borderRadius: 4,
            maxBarThickness: 28
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: colors.grayBorder },
            title: {
              display: true,
              text: "Frekuensi (Jumlah Siswa)",
              font: { size: 12, weight: "600" }
            }
          },
          x: {
            grid: { display: false },
            title: {
              display: true,
              text: "Skor Total Responden (Rentang 10 s.d. 40)",
              font: { size: 12, weight: "600" }
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                const val = ctx.parsed.y;
                const pct = ((val / data.meta.jumlah_responden) * 100).toFixed(1);
                return ` ${val} siswa (${pct}% dari total responden)`;
              }
            }
          }
        }
      }
    });
  }

  // -----------------------------------------------------------
  // 5. Render Tabel Rincian 10 Butir Kuesioner secara Dinamis
  // -----------------------------------------------------------
  const tableBody = document.getElementById("indicatorTableBody");
  if (tableBody && data.per_butir) {
    tableBody.innerHTML = "";
    data.per_butir.forEach((item, index) => {
      const tr = document.createElement("tr");

      let badgeClass = "badge--green";
      let statusText = "Sangat Baik";
      if (item.rata_rata < 3.25) {
        badgeClass = "badge--yellow";
        statusText = "Perlu Perhatian";
      } else if (item.persen_jarang > 12) {
        badgeClass = "badge--amber";
        statusText = "Perlu Didorong";
      }

      tr.innerHTML = `
        <td class="code-cell">${item.kode}</td>
        <td>
          <strong>${item.label}</strong>
          <div style="font-size: 0.85rem; color: var(--ink-500); margin-top: 4px;">${item.pertanyaan}</div>
        </td>
        <td class="score-cell">${item.rata_rata.toFixed(2)}</td>
        <td>
          <span style="font-weight: 600; color: var(--green-700);">${item.persen_sering}%</span>
          <span style="font-size: 0.8rem; color: var(--ink-500);">(${item.persen_jarang}% jarang)</span>
        </td>
        <td><span class="badge ${badgeClass}">${statusText}</span></td>
      `;
      tableBody.appendChild(tr);
    });
  }
});
