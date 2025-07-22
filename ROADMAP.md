# 🧭 Project Roadmap: Cooking Skills Tracker

An interactive skill-tracking and learning platform for cooking techniques. Designed like a skill tree from RPG games, this tool helps users learn, visualize, and practice culinary skills with structure and fun.

## 🎉 **Recent Major Milestone: Stage 4 Complete!**
The Kitchen Skills Tracker has evolved into a **production-ready learning platform** with professional-grade visual design, intelligent guidance systems, and comprehensive cross-device support. Stage 4 delivered not just the planned features, but significant bonus enhancements that transform the user experience.

---

## 📌 Stage 1: Core Stabilization & Refactoring ✅ **COMPLETED**
**Goal**: Improve maintainability and deepen understanding of React and modern frontend practices.

- [x] Modularize components (hooks, UI, logic).
- [x] Implement graph-based prerequisite handling.
- [x] Add unit tests for core logic (`useSkillTree`, `computeUnlocks`, etc).
- [x] Introduce global state manager (e.g., Zustand or Redux) if needed.
- [x] Clean up styles and remove redundant props and state.

---

## 📚 Stage 2: Multi-Skill Trees and Learning Paths ✅ **COMPLETED**
**Goal**: Support more than just knife skills and allow learning pathways.

- [x] Abstract skill tree logic to support different domains (e.g., baking, pastry, sauces).
- [x] Implement dropdown/menu for tree selection.
- [x] Enable custom paths (e.g., "Beginner Cook", "Vegetarian Prep", "Protein Mastery").

---

## 🧠 Stage 3: User Profiles & Progress Persistence ✅ **COMPLETED**
**Goal**: Let users track progress across sessions.

- [x] Store skill points and preferences in localStorage or IndexedDB.
- [x] Add basic profile view:
  - Total skill points
  - Completed paths
  - Suggested next steps
- [x] Enable save/load functionality per tree.

---

## ✨ Stage 4: Enhanced Visuals & UX ✅ **COMPLETED**
**Goal**: Improve clarity, engagement, and accessibility.

- [x] Animate node unlocking and skill connections.
- [x] Support zoom and pan in graph layout (via React Flow + Dagre).
- [x] Add minimap or overview mode for large trees.
- [x] Improve layout responsiveness (mobile/tablet support).
- [x] Improve skill node tooltips and visual feedback (locked vs unlocked).

**✨ Bonus Enhancements Delivered:**
- [x] Dual view modes (grid and professional flow chart)
- [x] Functional learning paths with real-time skill highlighting
- [x] Intelligent profile suggestions with priority ranking
- [x] Cross-tree learning path support
- [x] Professional graph layout with automatic positioning
- [x] Touch gesture support for mobile devices
- [x] Enhanced achievement browser with filtering and search

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
- **Frontend**: React 19 + Vite for fast development and building
- **Styling**: Tailwind CSS with custom utilities and responsive design
- **Animations**: Framer Motion for smooth transitions and visual feedback
- **Graph Visualization**: React Flow + Dagre for professional skill tree layouts
- **State Management**: Zustand with localStorage persistence
- **Icons**: Lucide React for consistent iconography
- **Testing**: Vitest + React Testing Library with comprehensive coverage

---

## 🤝 Contributing (Planned)
- [ ] Contribution guide
- [ ] Skill tree schema documentation
- [ ] Feature requests and bug reporting

---

*Created by Avishai Barnoy — follow the journey as we turn cooking into an adventure.*

