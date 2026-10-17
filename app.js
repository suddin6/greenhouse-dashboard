// IIFE Function
(function () {
  ("use strict()");

  // Storage Key for localStorage API
  const STORAGE_KEY = "agrosens_telemetry_records_v1";

  // Variables from HTML IDs
  const userForm = document.getElementById("user-form");
  const errorBanner = document.getElementById("form-error-banner");
  const recordsList = document.getElementById("records-list");
  const queueCount = document.getElementById("queue-count");
  const emptyState = document.getElementById("empty-state");
  const btnClearAll = document.getElementById("btn-clear-all");

  // Input Field Variables
  const inputName = document.getElementById("user-name");
  const inputPh = document.getElementById("ph");
  const inputEc = document.getElementById("ec");
  const inputTemp = document.getElementById("temp");
  const inputRh = document.getElementById("rh");
  const inputBayId = document.getElementById("bay-id");

  // Initialize the State
  let records = loadRecords();

  // Initialize UI
  render();

  // loadRecords Function
  function loadRecords() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load records from localStorage.", error);
      return [];
    }
  }

  // saveRecords Function
  function saveRecords() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error("Failed to write to data store.", error);
    }
  }

  // evaluateRisk Function
  function evaluateRisk(ph, ec, temp, rh) {
    if (
      (ph < 5 || ph > 7.5) &&
      (temp < 55 || temp > 95) &&
      (ec < 0.2 || ec > 4.5) &&
      (rh < 30 || rh > 90)
    ) {
      return { level: "critical", label: "Critical Hazard" };
    } else if (
      ph >= 5.5 &&
      ph <= 6.5 &&
      temp >= 64.4 &&
      temp <= 71.6 &&
      ec >= 1.0 &&
      ec <= 2.0 &&
      rh >= 50 &&
      rh <= 70
    ) {
      return { level: "optimal", label: "Optimal" };
    } else {
      return { level: "warning", label: "Warning" };
    }
  }

  // validateInput Function
  function validateInput(data) {
    const errors = [];

    if (!data.name.trim()) {
      errors.push("User Name is a required field.");
    }

    if (isNaN(data.ph) || data.ph < 0 || data.ph > 14) {
      errors.push("pH must be a number between 0-14.");
    }

    if (isNaN(data.ec) || data.ec < 0 || data.ec > 10) {
      errors.push("EC must be a number between 0-10 mS/cm.");
    }

    if (isNaN(data.temp) || data.temp < -20 || data.temp > 100) {
      errors.push("Temperature must be a number between -20-100°F.");
    }

    if (isNaN(data.rh) || data.rh < 0 || data.rh > 100) {
      errors.push("RH must be a number between 0-100%.");
    }

    if (isNaN(data.bayId) || data.bayId < 1 || data.bayId > 100) {
      errors.push("BayID must be a number between 1-100.");
    }

    return errors;
  }

  // userForm EventListener
  userForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = {
      id: crypto.randomUUID(),
      name: inputName.value,
      ph: parseFloat(inputPh.value),
      ec: parseFloat(inputEc.value),
      temp: parseFloat(inputTemp.value),
      rh: parseInt(inputRh.value, 10),
      bayId: parseInt(inputBayId.value, 10),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const validateErrors = validateInput(formData);
    if (validateErrors.length > 0) {
      displayError(validateErrors.join(" "));
      return;
    }

    hideError();

    formData.risk = evaluateRisk(
      formData.ph,
      formData.ec,
      formData.temp,
      formData.rh,
    );

    records.unshift(formData);
    saveRecords();
    render();
    userForm.reset();
    inputName.focus();
  });

  // recordsList EventListener
  recordsList.addEventListener("click", function (event) {
    const target = event.target;
    if (target.classList.contains("btn-delete-all")) {
      const recordId = target.dataset.id;
      records = records.filter(function (record) {
        return record.id !== recordId;
      });
      saveRecords();
      render();
    }
  });

  // btnClearAll EventListener
  btnClearAll.addEventListener("click", (event) => {
    if (records.length === 0) return;
    if (confirm("Are you sure you want to delete all telemetry readings?")) {
      records = [];
      saveRecords();
      render();
    }
  });

  // render Function
  function render() {
    queueCount.textContent = records.length;

    if (records.length === 0) {
      emptyState.classList.remove("hidden");
      recordsList.innerHTML = "";
      return;
    }

    emptyState.classList.add("hidden");

    const fragment = document.createDocumentFragment();

    records.forEach(function (rec) {
      const li = document.createElement("li");
      li.className = "user-card status-" + rec.risk.level;

      li.innerHTML = `
      <div class="card-top">
        <div>
          <div class="user-name-text">
            ${escapeHtml(rec.name)}
          </div>
          <div class="timestamp">
            Logged at: ${rec.timestamp}
          </div>
        </div>
        <span class="risk-badge ${rec.risk.level}">
            ${rec.risk.label}
          </span>
      </div>

      <div class="telemetry-stats">
        <div class="stat-item"><span>pH:</span>${rec.ph.toFixed(1)}</div>
        <div class="stat-item"><span>Electrical Conductivity:</span>${rec.ec.toFixed(1)} mS/cm</div>
        <div class="stat-item"><span>Temperature:</span>${rec.temp.toFixed(1)}°F</div>
        <div class="stat-item"><span>Relative Humidity:</span>${rec.rh}%</div>
        <div class="stat-item"><span>Bay ID:</span>${rec.bayId}</div>
      </div>

      <button class="btn btn-outline-danger btn-sm btn-delete-all" data-id="${rec.id}">Remove Reading</button>
      `;

      fragment.appendChild(li);
    });

    recordsList.innerHTML = "";
    recordsList.appendChild(fragment);
  }

  // displayError Function
  function displayError(message) {
    errorBanner.textContent = message;
    errorBanner.classList.remove("hidden");
  }

  // hideError Function
  function hideError() {
    errorBanner.textContent = "";
    errorBanner.classList.add("hidden");
  }

  // escapeHtml Function
  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
})();
