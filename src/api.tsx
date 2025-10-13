
export const API = import.meta.env.DEV
  ? "http://127.0.0.1:5000"              // local Flask
  : "https://productivity-manager-iwb3.onrender.com"; // prod Flask
