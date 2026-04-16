<h1 align="center">AI-Based Timetable Generator 🧬</h1>

<p align="center">
  <strong>An Intelligent Academic Scheduler Built with Genetic Algorithms</strong>
</p>

<p align="center">
  <strong>💻 Algorithm & Core Engine:</strong><br>
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript_Engine-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Algorithm-Genetic_Evolution-8b5cf6?style=for-the-badge" alt="Genetic Algorithm" />
</p>
<p align="center">
  <strong>🎨 Dashboard & UI:</strong><br>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer-motion&logoColor=blue" alt="Framer Motion" />
</p>

## 📌 Overview

Scheduling academic timetables is a notoriously difficult NP-Hard combinatorial optimization problem. This project implements a **Genetic Algorithm (GA) from scratch** to fully automate the generation of conflict-free schedules for a large dataset consisting of **30 sections (1,500+ students), 60 faculty members, and 15 shared rooms** across a dual-shift system.

This isn't a wrapper around an API—this is a custom, in-browser evolutionary algorithm that mathematically guarantees high-efficiency constraint resolution with visual analytics showing the algorithmic convergence in real time.

---

## ✨ Features

- **Live Evolutionary Timetable Grid**: Watch the genetic algorithm learn visually. The timetable interface streams down straight from the background web-workers directly updating the grid cells in real-time as generations pass. Interactively track Best Fitness, Average Fitness, and Total Conflicts via dynamic dashboard charts.
- **Three Core Algorithm Variants**:
  - `Standard GA`: Classic generational replacement with elitism constraints.
  - `Steady-State GA`: Asynchronous real-time offspring validation.
  - `Adaptive Mutation GA`: Features a highly advanced **Triggered Pulse Mutation** metric preventing "local optima death spirals" by intelligently heating/cooling mutation rates (plotted directly onto secondary real-time metric axes).
- **Extremely Fast $O(1)$ Fitness Evaluations**: Deep optimization mapping converts traditional $O(N)$ nested search loops into $O(1)$ Hash Map lookups `Map<string, Conflict[]>`, drastically reducing memory bloat and calculation latency.
- **Strict "Class-Boundary" Crossover & Swap Mutation**: Mathematically engineered genetic operators that preserve integrity. Recombination only tears between class borders, while the custom **Swap Operator** probabilistically exchanges internal scheduling cells for the exact same class logic without accidentally generating duplicate invalid assignments.
- **Conflict Highlighting Insight Tooltips**: An interactive hover-tooltip interface indexing `conflictMaps` to instantly identify *precisely why* schedule gaps, room overlaps, or teacher double-bookings remain directly on the rendered cell.
- **State-of-the-Art UI/UX**: Built with Framer Motion and TailwindCSS for a natively responsive, premium dashboard feel. Complete with zero blocking latency thanks to asynchronous async-loop yielding rendering over 60FPS.

---

## 🔬 The Genetic Algorithm (Under the Hood)

### Chromosome Representation
Our GA encodes the problem linearly. Each "Gene" represents a singular subject assignment: `[ClassID, SubjectID, TeacherID, RoomID, Timeslot]`. The entire university schedule represents a massive `480-gene` Chromosome.

### Fitness Function
Fitness is evaluated by harshly penalizing broken constraints:
- ❌ **Hard Constraints (Severe Penalty):** Teacher overlapping, Room Overbooking, and Shift-Timing Violations.
- ⚠️ **Soft Constraints (Minor Penalty):** Schedule Gaps (empty blocks of time for a class) and Subject Repetitions in a single day.

### Crossover, Swap & Pulse Mutation
Because standard 1-point and 2-point array crossovers rip individual class schedules apart, this engine uses a specialized **Class-Boundary Crossover**. It only swaps perfectly intact class schedules between parents. For tight mutation edge-cases, the engine engages an advanced **Swap Mutator**, directly switching two localized cells belonging to an identical class. To guarantee high success rates escaping local minimas, the engine utilizes **Triggered Pulse Mutation**, a custom mechanic that tracks fitness stagnation and temporarily blasts the DNA with high mutation to shock the schedule into new boundaries before cooling down over generations.

---

## 🛠️ Tech Stack & Architecture

### Backend / Core Engine (Logic Layer)
- **Language:** TypeScript (Strict Mode)
- **Environment:** Node.js processing mapped to browser-workers via asynchronous yielding.
- **Algorithm State:** Custom Genesis array handling 480-gene crossover mutations.
- **Data Safety:** Mulberry32 PRNG (Seeded generation for identical reproducible output).

### Frontend / Dashboard (Presentation Layer)
- **Framework:** React 18 + Vite
- **Styling:** TailwindCSS 
- **Animation:** Framer Motion
- **Data Visualization:** Recharts
- **State Management:** Zustand

---

## 🚀 Getting Started

To run this project locally, follow these steps:

### Prerequisites
Make sure you have Node JS and NPM installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shhreyannn/ai-timetable-generator.git
   ```

2. Navigate into the directory:
   ```bash
   cd ai-timetable-generator
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173` in your browser.

---

## 📊 Usage Guide

1. Open the Dashboard.
2. Click **Load Sample Dataset (30 Classes)** to instantly populate the B.Tech CSE constraints (15 Morning sections, 15 Afternoon sections).
3. Select your GA Settings from the control panel (Default recommended: *Adaptive Mutation*, *400 Generations*, *0.15 Base Rate*).
4. Click **Run Algorithm**.
5. Watch the dashboard visually map out the evolutionary curve as conflicts are destroyed.
6. Toggle **Conflicts ON** to identify any remaining soft-penalties highlighted in red within the real-time grid.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/shhreyannn/ai-timetable-generator/issues).

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
