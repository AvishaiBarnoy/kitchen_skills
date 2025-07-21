import MainNavigation from "./components/MainNavigation";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <MainNavigation />
    </ErrorBoundary>
  );
}
