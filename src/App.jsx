import SkillGraph from "./components/skillGraph";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black text-gray-200 overflow-x-auto font-fantasy">
        <SkillGraph/>
      </div>
    </ErrorBoundary>
  );
}
