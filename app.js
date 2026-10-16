// IIFE Function
(function () {
  "use strict()";

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

  function loadRecords() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load records from localStorage.", error);
      return [];
    }
  }

  function saveRecords() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error("Failed to write to data store.", error);
    }
  }
});
