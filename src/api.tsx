
export const API = import.meta.env.DEV
  ? "http://127.0.0.1:5000"              // local Flask
  : "https://dashboard.render.com/web/srv-d3lk2bogjchc73cfgln0"; // prod Flask
