import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add custom class for crimson color to be used in components
document.documentElement.classList.add('bg-background');

createRoot(document.getElementById("root")!).render(<App />);
