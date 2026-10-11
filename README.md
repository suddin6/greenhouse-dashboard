_Sumaya Uddin_<br>
_Professor Amartya Sen_<br>
_CSI 3150 - Web and Mobile Systems_<br>
_October 11, 2026_<br>

# Assignment 2A - Greenhouse Sensor Logger UI Architecture

### **_1. User Journey Funnel_**

#### <u>User Stories (for reference)</u>:

- **Story 1 (Controlled Sensor Entry)**: As a greenhouse technician, I want to `record telemetry readings for a specific bay with real-time numeric bounds enforcement so that invalid sensor inputs (e.g., pH outside 0 to 14 or negative values) are rejected immediately.`

- **Story 2 (Status Feedback)**: As an agronomist, I want the portal to `calculate and display an environmental status tag ("Optimal", "Warning", "Critical Hazard") immediately upon input submission.`

- **Story 3 (Offline Session Persistence)**: As a field worker moving between greenhouses, I want `logged sensor entries saved to localStorage so that refreshing the browser retains active log history.`

- **Story 4 (Log Removal & Queue Purging)**: As an operations supervisor, I want to `delete resolved logs individually or purge the entire log history.`

- **Story 5 (Dynamic Out-of-Bound Indicators)**: As a technician typing values into the form, I want `input fields to show instant visual error feedback whenever entered numbers exceed acceptable plant growth ranges.`

#### <u>Less Than Equal 4 Click User Journey Funnel</u>:

- **Starting State**:
  - Initial viewport upon entering the Greenhouse Sensor Logger dashboard. Input form for telemetry readings are on the left, output cards are shown on the right.

- **Action 1**:
  - User lands on the page and enters appropriate information in input fields. If value is less than the min value, greater than the max value, or the input field is blank, the form cannot be submitted and no output card is produced.

- **Action 2**:
  - User clicks the submit button on the form and an output card is produced onto the dashboard on the right-hand side. All output cards are stored in a local storage.

- **Action 3**:
  - UI state will dynamically update the count on the "Active Queue: " and show all the inputted information in a condensed manner with appropriate badges for ease of readability.

- **Action 4**:
  - Users can purge the entire queue or delete a specific output card by clicking the appropriate buttons.

- **Terminal State**:
  - Zero output cards in the dashboard with the "Active Queue: " counter turning back to 0 and the static HTML elements displayed on the screen. Purging queue will clear the entries from both the DOM and the local storage.

---

### **_2. Don Norman Usability & Constraint Audit_**

| Norman Principle      | System Context                                                                 | Using Concrete Implementation Mechanism (DOM / HTML / JS)                                                                                                                                                                                                                    |
| :-------------------- | :----------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gulf of Execution     | Typing numeric sensor metrics (pH, ElectricalConductivity[EC], Temp, Humidity) | The `<label>` elements state the unit of measure (mS/cm, %, and °F) and the `placeholder` attributes ("6.0", "1.5", etc.) indicate the expected formats.                                                                                                                     |
| Gulf of Evaluation    | Ingesting sensor values after clicking "Record Reading"                        | The system communicates the severity of the input through dynamic risk badges (`.status-badge`) on the output card that explicitly label the state (`Optimal, Critical Hazard, Warning`) with distinct colors (green, red, yellow).                                          |
| System Constraint     | E.g. Water pH Boundaries (0.0 <= pH <= 14.0)                                   | HTML input attributes (`min="0.0" max="14.0" step="0.1" required`) constrain the entry bounds to ensure that only valid inputs can be submitted.                                                                                                                             |
| Visual Feedback State | Real-Time Input Error / Out-of-Bounds                                          | JavaScript event listeners evalute user input and toggle CSS error classes ("`.alert alert-danger hidden`") with the role of `alert ` to inform the user that their input was out-of-bound.                                                                                  |
| Error Recovery        | Accidental or test data                                                        | The "`Remove Telemetry Reading`" button is on the output card and used to clear specific bad or accidental records in the active queue without clearing all inputs. The `Purge Queue` buttons is used to remove all entries in the dashboard from `DOM` and `local storage`. |

---

### **_3. Semantic Component & Working Tree_**

```
<body>
  <header class="portal-header"> (CSS: flex on row, space-between, centered)
    <div class="header-content">
      <div class="brand">
        <span class="brand-icon>
        <h1>(Text: "Greenhouse Sensor Logger")<span class="brand-sub">(Text: "Dashboard")
      <div class="header-status">(Text: "Active Queue") [STATIC]<span id="queue-count" class="badge-count"> (Text: "0") [STATIC (dynamically changed in JS)]
  <main class="portal-container"> (CSS: grid, columns [1fr])
    <aside class="panel form-panel">
        <h2 class="panel-title> (Text: "Record Telemetry Readings")
        <div id="form-error-banner" class="alert alert-danger hidden"> [DYNAMIC]
      <form action="#" id="user-form" novalidate> (CSS: flex on column, space-between, centered) [STATIC]
        <div class="form-group">
          <label for="user-name" class="form-label">(Text: "Full Name:" )<span class="required">(Text: "*")
          <input type="text" name="user-name" id="user-name" class="form-control" placeholder="Sumaya Uddin" required>
        <div class="form-row"> (CSS: flex on row, space-between, centered)
          <div class="form-group">
            <label for="ph" class="form-label">(Text: "pH" )<span class="required">(Text: "*")
            <input type="number" name="ph" id="ph" class="form-control" min="0.0" max="14.0" step="0.1" placeholder="6" required>
          <div class="form-group">
            <label for="ec" class="form-label">(Text: "Electrical Conductivity (mS/cm)")<span class="required">(Text: "*")
            <input type="number" name="ec" id="ec" class="form-control" min="0.0" max="10.0" step="0.1" placeholder="1.5" required>
        <div class="form-row"> (CSS: flex on row, space-between, centered)
          <div class="form-group">
            <label for="temp" class="form-label">(Text: "Air Temperature (°F)")<span class="required">(Text: "*")
            <input type="number" name="temp" id="temp" class="form-control" min="-20" max="150" step="1" placeholder="68" required>
          <div class="form-group">
            <label for="rh" class="form-label">(Text: "Relative Humidity (%)" )<span class="required">(Text: "*")
            <input type="number" name="rh" id="rh" class="form-control" min="0" max="100" step="1"  placeholder="60" required>
        <div class="form-group">
          <label for="bay-id" class="form-label">(Text: "Bay Id" )<span class="required">(Text: "*")
          <input type="number" name="bay-id" id="bay-id" class="form-control" min="0" max="50.0" step="1" placeholder="1" required>
        <button type="submit" id="btn-submit" class="btn btn-primary btn-block"> (Text: "Log Sensor Inputs") (CSS: inline-flex, centered) [STATIC] (Event: type: 'submit')
    <section class="panel records-panel">
      <div class="records-header"> (CSS: flex on row, space-between, centered)
        <h2 class="panel-title"> (Text: "Purge Queue")
        <button id="btn-clear-all" class="btn btn-outline-danger btn-sm"> [STATIC] (Event: type: 'click')
      <div id="empty-state" class="empty-state"> [STATIC]
        <span class="empty-icon">(Emoji)
        <p>(Text: "No active records logged.")
      <ul id="records-list" class="record-grid" aria-live="polite"> (CSS: grid, autofill columns [1fr]) [STATIC] (Event: type: 'click')
        <li class="record-card"> (CSS: flex on column, space-evenly, centered) [DYNAMIC]
          <span class="status-badge staus-critical"> (Aesthetic Border) [DYNAMIC]
          <span class="status-badge staus-optimal"> (Aesthetic Border) [DYNAMIC]
          <span class="status-badge staus-warning"> (Aesthetic Border) [DYNAMIC]
          <header class="card-top"> (CSS: flex on row, space-between, flex-start) [DYNAMIC]
            <h3 class="user-name-text"> [DYNAMIC]
            <p class="timestamp"> (Time: "24hr") [DYNAMIC]
            <p class="telemetry-stats"> (Text: "Input Info") [DYNAMIC]
            <span class="status-badge critical"> (Text: "Critical Hazard") [DYNAMIC]
            <span class="status-badge optimal"> (Text: "Optimal") [DYNAMIC]
            <span class="status-badge warning"> (Text: "Warning") [DYNAMIC]
          <button class="btn btn-outline-danger btn-block"> (Text: "Remove Telemetry Reading") [DYNAMIC] (Event: type: 'click')
  footer
    <p> (Text: "&copy; Greenhouse Sensor Logger Dashboard - Sumaya Uddin")
  <script src="app.js">
```

---

### **_4. Data Schema_**

```
const greenhouseLoggerSchema = {
    id: "String", // Unique alphanumeric identifier
    bayId: "Number", // Specific bay input came from
    fullName: "String", // Logger's full name
    ph: "Number", // pH value
    ec: "Number", // Electrical Conductivity value
    temp: "Number", // Air Temperature value
    rh: "Number", // Relative Humidity value
    status: "String" // "Optimal", "Warning", "Critical Hazard"
};
```

---
