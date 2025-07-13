# 🧭 Project Roadmap: Cooking Skills Tracker

An interactive skill-tracking and learning platform for cooking techniques. Designed like a skill tree from RPG games, this tool helps users learn, visualize, and practice culinary skills with structure and fun.

---

## 📌 Stage 1: Core Stabilization & Refactoring
**Goal**: Improve maintainability and deepen understanding of React and modern frontend practices.

- [x] Modularize components (hooks, UI, logic).
- [x] Implement graph-based prerequisite handling.
- [x] Add unit tests for core logic (`useSkillTree`, `computeUnlocks`, etc).
- [ ] Introduce global state manager (e.g., Zustand or Redux) if needed.
- [ ] Clean up styles and remove redundant props and state.

---

## 📚 Stage 2: Multi-Skill Trees and Learning Paths
**Goal**: Support more than just knife skills and allow learning pathways.

- [ ] Abstract skill tree logic to support different domains (e.g., baking, pastry, sauces).
- [ ] Implement dropdown/menu for tree selection.
- [ ] Enable custom paths (e.g., "Beginner Cook", "Vegetarian Prep", "Protein Mastery").

---

## 🧠 Stage 3: User Profiles & Progress Persistence
**Goal**: Let users track progress across sessions.

- [ ] Store skill points and preferences in localStorage or IndexedDB.
- [ ] Add basic profile view:
  - Total skill points
  - Completed paths
  - Suggested next steps
- [ ] Enable save/load functionality per tree.

---

## ✨ Stage 4: Enhanced Visuals & UX
**Goal**: Improve clarity, engagement, and accessibility.

- [ ] Animate node unlocking and skill connections.
- [ ] Support zoom and pan in graph layout (e.g., via `react-flow`, `dagre`, or `elkjs`).
- [ ] Add minimap or overview mode for large trees.
- [ ] Improve layout responsiveness (mobile/tablet support).
- [ ] Improve skill node tooltips and visual feedback (e.g., locked vs unlocked).

---

## 🎓 Stage 5: Educational Content Integration
**Goal**: Teach users while they learn and build confidence.

- [ ] Attach external resources or videos to skills.
- [ ] Implement "Practice Mode":
  - Step-by-step skill progression
  - Suggestions on next practice focus
- [ ] Include self-assessment tools (e.g., checkboxes or quizzes).

---

## 🌍 Stage 6: Long-Term Expansion
**Goal**: Enable real users, sharing, and scale.

- [ ] Add multi-language support (e.g., Hebrew and English).
- [ ] Introduce backend with real user accounts (e.g., Supabase or Firebase).
- [ ] Enable uploading and sharing of custom skill trees.
- [ ] Explore mobile app version (React Native / Expo).

---

## 🛠 Tech Stack (Current)
- React + Vite
- Tailwind CSS
- React Flow (planned for graph layout)
- Custom hooks and modular state management

---

## 🤝 Contributing (Planned)
- [ ] Contribution guide
- [ ] Skill tree schema documentation
- [ ] Feature requests and bug reporting

---

*Created by Avishai Barnoy — follow the journey as we turn cooking into an adventure.*

