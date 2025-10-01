
import { createRoot } from "react-dom/client";
import axios from 'axios';
// ... ReactDOM 렌더링 코드 위쪽에
axios.defaults.withCredentials = true;
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(<App />);
  