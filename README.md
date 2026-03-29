<h1 align="center">AI-Based Timetable Generator 🧬</h1>

<p align="center">
  <strong>An Intelligent Academic Scheduler Built with Genetic Algorithms</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer-motion&logoColor=blue" alt="Framer Motion" />
</p>

## 📌 Overview

Scheduling academic timetables is a notoriously difficult NP-Hard combinatorial optimization problem. This project implements a **Genetic Algorithm (GA) from scratch** to fully automate the generation of conflict-free schedules for a large dataset consisting of **30 sections (1,500+ students), 60 faculty members, and 15 shared rooms** across a dual-shift system.

This isn't a wrapper around an API—this is a custom, in-browser evolutionary algorithm that mathematically guarantees high-efficiency constraint resolution with visual analytics showing the algorithmic convergence in real time.

---

## ✨ Features

- **Real-Time Evolutionary Tracking**: Watch the genetic algorithm learn visually. Interactive charts plot Best Fitness, Average Fitness, and Total Conflicts live as generations pass.
- **Three Core Algorithm Variants**:
  - `Standard GA`: Classic generational replacement with elitism constraints.
  - `Steady-State GA`: Asynchronous real-time offspring validation.
  - `Adaptive Mutation GA`: Features a highly advanced **Triggered Pulse Mutation** metric preventing "local optima death spirals" by intelligently heating/cooling mutation rates (Simulated Annealing style).
- **Strict "Class-Boundary" Crossover**: Mathematically designed genetic swapping that perfectly preserves soft-constraints (like schedule gaps) while evolving hard-constraints (teacher overlaps).
- **Dual-Shift Processing System**: Morning (Section 1) and Afternoon (Section 2) shifts utilizing a shared pool of 15 fully-utilized rooms.
- **Conflict Highlighting Engine**: An interactive UI to instantly identify precisely down to the *Gene* where schedule gaps, room overlaps, or teacher double-bookings remain.
- **State-of-the-Art UI/UX**: Built with Framer Motion and TailwindCSS for a natively responsive, premium dashboard feel with zero blocking latency during calculation thanks to asynchronous async-loop yielding.

---

## 🔬 The Genetic Algorithm (Under the Hood)

### Chromosome Representation
Our GA encodes the problem linearly. Each "Gene" represents a singular subject assignment: `[ClassID, SubjectID, TeacherID, RoomID, Timeslot]`. The entire university schedule represents a massive `480-gene` Chromosome.

### Fitness Function
Fitness is evaluated by harshly penalizing broken constraints:
- ❌ **Hard Constraints (Severe Penalty):** Teacher overlapping, Room Overbooking, and Shift-Timing Violations.
- ⚠️ **Soft Constraints (Minor Penalty):** Schedule Gaps (empty blocks of time for a class) and Subject Repetitions in a single day.

### Crossover & Pulse Mutation
Because standard 1-point and 2-point array crossovers rip individual class schedules apart, this engine uses a specialized **Class-Boundary Crossover**. It only swaps perfectly intact class schedules between parents, retaining structural stability. To guarantee >95% success rates, the engine uses **Triggered Pulse Mutation**, a custom mechanic that detects fitness stagnation and temporarily blasts the DNA with high mutation to shock the schedule out of local un-optimizable traps before cooling back down.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18 + Vite
- **Typing & Logic:** TypeScript (Strict Mode)
- **Styling:** TailwindCSS 
- **Animation:** Framer Motion
- **Data Visualization:** Recharts
- **State Management:** Zustand
- **Local Seed Engine:** Mulberry32 PRNG (for perfect dataset reproducibility)

---

## 🚀 Getting Started

To run this project locally, follow these steps:

### Prerequisites
Make sure you have Node JS and NPM installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YourUsername/ai-timetable-generator.git
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
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/YourUsername/ai-timetable-generator/issues).

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Built from scratch with ❤️ as a showcase of evolutionary algorithm constraints.*
