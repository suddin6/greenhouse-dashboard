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
  - Initial viewport upon entering the Greenhouse Sensor Logger dashboard.
  -

- **Action 1**:
  - User lands on the page and identifies the primary signifier: the navigation bar along with the brand logo and "Deploy Free Cluster" call-to-action [CTA] button.
  -

- **Action 2**:
  - User scrolls down or clicks on navigation link to reach the three hosting tiers.
  -

- **Action 3**:
  - User inspects the tiered cards where the "Pro Cluster" card is visually elevated (badge signifier).
  -

- **Action 4**:
  - User submits log throughput and node count requirements into a number input field and clicks the primary registration CTA (Generate API Keys).
  -

- **Terminal State**:
  - Visual confirmation upon submission of form.
  -

---

### **_2. Don Norman Usability & Constraint Audit_**

| Norman Principle      | System Context                                                                 | Using Concrete Implementation Mechanism (DOM / HTML / JS) |
| :-------------------- | :----------------------------------------------------------------------------- | :-------------------------------------------------------- |
| Gulf of Execution     | Typing numeric sensor metrics (pH, ElectricalConductivity[EC], Temp, Humidity) |                                                           |
| Gulf of Evaluation    | Ingesting sensor values after clicking "Record Reading"                        |                                                           |
| System Constraint     | E.g. Water pH Boundaries (0.0 <= pH <= 14.0)                                   |                                                           |
| Visual Feedback State | Real-Time Input Error / Out-of-Bounds                                          |                                                           |
| Error Recovery        | Accidental or test data submissions                                            |                                                           |

---

### **_3. Semantic Component & Working Tree_**

```
body
  header
    div<logo>
    nav
      a<capabilities>
      a<comparison>
      a<compatibility>
    CTA button <Deploy Free Cluster>
  main
    section<hero>
        h1<title of page>
        p<subtitle/short text> (Core Value Metrics)
        img<>
    section<capabilities>
      header
        h2<section-title>
        p<section-subtitle>
      div<features-grid>
        article<feature-1>
          h3<feature-name> (Latency Tracking)
          p<describe feature>
        article<feature-2>
          h3<feature-name> (Log Aggregation)
          p<describe feature>
        article<feature-3>
          h3<feature-name> (Auto-Remediation)
          p<describe feature>
    section<comparison>
      header
        h2<section-title>
        p<section-subtitle>
      div<tier-grid>
        article<tier-1>
          h3<tier-name> (Developer)
          p<describe tier>
          div<tier-price>
            span<tier-values>
          ul<tier-features>
            li<features-list>
          CTA Button <Deploy Developer>
        article<tier-2>
          div<popular-tag>
          h3<feature-tier> (Pro Cluster)
          p<describe tier>
          div<tier-price>
            span<tier-values>
          ul<tier-features>
            li<features-list>
          CTA Button <Join Pro Cluster>
        article<tier-3>
          h3<feature-tier> (Enterprise Dedicated)
          p<describe tier>
          div<tier-price>
            span<tier-values>
          ul<tier-features>
            li<features-list>
          CTA Button <Become Dedicated Today>
    section<registration>
      div<form-wrapper>
        header
          h2<section-title>
          p<section-subtitle>
        form<registration-form>
          div<form-group>
            label<contact-email>
            input<type="email" required>
          div<form-group>
            label<node-count>
            input<type="number" min="" max="" step="1000" required>
            span<constraints>
          div<form-group>
            label<log-throughput>
            input<type="number" min="" max="" step="1000" required>
            span<constraints>
          div<form-group>
            label<business-tier>
            select
              option<Developer>
              option<Pro Cluster>
              option<Enterprise Dedicated>
          button<Generate API Keys>
  footer
    div<footer-container>
      div<logo>
      div<links>
        a<capabilities>
        a<comparison>
        a<compatibility>
        a<scroll to top> (Hero Section)
      a<attribution>
```

---

### **_4. Data Schema_**

Write the blueprint of the JS object that will store the data for this application. The object must outline the exact keys and data types stored in memory (either front-end or back-end).

```
const greenhouseLoggerSchema = {
    id: "String", // Unique alphanumeric identifier
    fullName: "String", // Farmer's full name
    lastName: "String", // Student's family name
    dateOfBirth: "String", // date format (YYYY-MM-DD)
    email: "String", // Academic or personal email address
    phoneNumber: "String" // formatted contact number
};
```

---
