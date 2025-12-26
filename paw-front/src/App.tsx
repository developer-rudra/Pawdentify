import { BrowserRouter } from "react-router-dom";
import { ScanHistoryProvider } from "./contexts/ScanHistoryContext";
import { CommunityProvider } from "./contexts/CommunityContext";
import AppWithRouter from "./AppWithRouter";

console.log("API KEY →", (import.meta as any).env.VITE_FIREBASE_API_KEY);

export default function App() {
  return (
    <BrowserRouter>
      <CommunityProvider>
        <ScanHistoryProvider>
          <AppWithRouter />
        </ScanHistoryProvider>
      </CommunityProvider>
    </BrowserRouter>
  );
}


