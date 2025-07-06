import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SkillTree from "./components/SkillTree";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-800 via-gray-900 to-black text-gray-200 flex items-center justify-center p-8">
      <SkillTree />
    </div>
  );
}

