import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SkillTree from "./components/SkillTree";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <SkillTree />
    </div>
  );
}

