import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/styles/index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
