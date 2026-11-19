/* =========================================================
   Hemat Energi, Selamatkan Bumi — Fase 3
   Fitur Interaktif: Tantangan 7 Hari & Generator Janji Komitmen
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  // -----------------------------------------------------------
  // 1. TANTANGAN 7 HARI HEMAT ENERGI (dengan localStorage)
  // -----------------------------------------------------------
  const STORAGE_KEY = "hemat_energi_challenge_v1";
  const challengeItems = document.querySelectorAll(".challenge-item");
  const progressBarFill = document.getElementById("challengeProgressFill");
  const progressText = document.getElementById("challengeProgressText");
  const completionBadge = document.getElementById("challengeCompletionBadge");
  const resetBtn = document.getElementById("resetChallengeBtn");

  // Muat status yang tersimpan
  function loadChallengeState() {
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      saved = {};
    }
    return saved;
  }

  // Simpan status
  function saveChallengeState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Gagal menyimpan ke localStorage", e);
    }
  }

  // Update UI progress
  function updateProgress() {
    const state = loadChallengeState();
    let checkedCount = 0;
    const total = challengeItems.length;

    challengeItems.forEach(function (item) {
      const id = item.dataset.id;
      const checkbox = item.querySelector('input[type="checkbox"]');
      const isChecked = Boolean(state[id]);

      if (checkbox) {
        checkbox.checked = isChecked;
      }

      if (isChecked) {
        item.classList.add("is-completed");
        checkedCount++;
      } else {
        item.classList.remove("is-completed");
      }
    });

    const percent = total > 0 ? Math.round((checkedCount / total) * 100) : 0;
    if (progressBarFill) {
      progressBarFill.style.width = percent + "%";
    }
    if (progressText) {
      progressText.textContent = `${checkedCount} dari ${total} Selesai (${percent}%)`;
    }

    if (completionBadge) {
      if (checkedCount === total && total > 0) {
        completionBadge.style.display = "block";
      } else {
        completionBadge.style.display = "none";
      }
    }
  }

  // Pasang listener pada tiap item checklist
  challengeItems.forEach(function (item) {
    const checkbox = item.querySelector('input[type="checkbox"]');
    if (!checkbox) return;

    // Klik pada area item
    item.addEventListener("click", function (e) {
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }
      const state = loadChallengeState();
      state[item.dataset.id] = checkbox.checked;
      saveChallengeState(state);
      updateProgress();
    });

    // Perubahan langsung checkbox
    checkbox.addEventListener("change", function () {
      const state = loadChallengeState();
      state[item.dataset.id] = checkbox.checked;
      saveChallengeState(state);
      updateProgress();
    });
  });

  // Tombol Reset Tantangan
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (confirm("Apakah Anda yakin ingin mengatur ulang progres Tantangan 7 Hari?")) {
        localStorage.removeItem(STORAGE_KEY);
        updateProgress();
      }
    });
  }

  // Inisialisasi status awal tantangan
  updateProgress();

  // -----------------------------------------------------------
  // 2. GENERATOR KARTU KOMITMEN / IKRAR DIGITAL HEMAT ENERGI
  // -----------------------------------------------------------
  const pledgeForm = document.getElementById("pledgeForm");
  const pledgeCardResult = document.getElementById("pledgeCardResult");
  const pledgeCardName = document.getElementById("pledgeCardName");
  const pledgeCardIdentity = document.getElementById("pledgeCardIdentity");
  const pledgeCardActionsList = document.getElementById("pledgeCardActionsList");
  const pledgeCardDate = document.getElementById("pledgeCardDate");
  const pledgeCardId = document.getElementById("pledgeCardId");
  const printPledgeBtn = document.getElementById("printPledgeBtn");

  if (pledgeForm) {
    pledgeForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nameInput = document.getElementById("pledgeName");
      const classSelect = document.getElementById("pledgeClass");
      const name = nameInput ? nameInput.value.trim() : "";
      const className = classSelect ? classSelect.value : "";

      if (!name) {
        alert("Silakan masukkan nama Anda terlebih dahulu.");
        if (nameInput) nameInput.focus();
        return;
      }

      // Ambil aksi komitmen yang dipilih
      const checkedBoxes = pledgeForm.querySelectorAll('input[name="pledgeActions"]:checked');
      if (checkedBoxes.length === 0) {
        alert("Pilih minimal 1 komitmen aksi hemat energi yang siap Anda lakukan.");
        return;
      }

      // Render ke kartu komitmen
      if (pledgeCardName) {
        pledgeCardName.textContent = name;
      }
      if (pledgeCardIdentity) {
        pledgeCardIdentity.textContent = `${className || "Siswa Kelas XI"} — Pejuang Konservasi Energi Sekolah`;
      }

      if (pledgeCardActionsList) {
        pledgeCardActionsList.innerHTML = "";
        const ul = document.createElement("ul");
        checkedBoxes.forEach(function (cb) {
          const li = document.createElement("li");
          li.textContent = cb.parentElement.textContent.trim();
          ul.appendChild(li);
        });
        pledgeCardActionsList.appendChild(ul);
      }

      // Generate ID dan Tanggal
      const randomId = Math.floor(1000 + Math.random() * 9000);
      if (pledgeCardId) {
        pledgeCardId.textContent = `NO. IKRAR: ESD-${new Date().getFullYear()}-${randomId}`;
      }
      if (pledgeCardDate) {
        const today = new Date();
        const options = { day: "numeric", month: "long", year: "numeric" };
        pledgeCardDate.textContent = `Diterbitkan pada: ${today.toLocaleDateString("id-ID", options)}`;
      }

      // Tampilkan kartu dengan efek visual
      if (pledgeCardResult) {
        pledgeCardResult.style.display = "block";
        pledgeCardResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  // Cetak atau simpan kartu
  if (printPledgeBtn) {
    printPledgeBtn.addEventListener("click", function () {
      window.print();
    });
  }
});
