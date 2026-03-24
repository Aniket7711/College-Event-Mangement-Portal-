import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.tsx";
import "./index.css";

// This should ideally come from an environment variable (e.g. VITE_GOOGLE_CLIENT_ID)
const GOOGLE_CLIENT_ID = "366518061478-5l2p0q904lschr3v78oql2otkpq16pji.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
