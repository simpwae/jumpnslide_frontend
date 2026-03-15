import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const container = document.getElementById("root")!;
import { ErrorBoundary } from './components/ErrorBoundary';

createRoot(container).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
