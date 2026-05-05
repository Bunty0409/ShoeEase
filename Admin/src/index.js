import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { ConfigProvider, theme } from "antd";

const RootApp = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: isDarkMode ? {
            colorPrimary: '#6366f1',
            colorBgBase: '#0f172a',
            colorBgContainer: '#1e293b',
            colorBgElevated: '#1e293b',
            colorBorderSecondary: '#334155',
            fontFamily: "'Inter', 'Outfit', sans-serif",
            borderRadius: 8,
          } : {
            colorPrimary: '#6366f1',
            colorBgBase: '#f3f4f6',
            colorBgContainer: '#ffffff',
            colorBgElevated: '#ffffff',
            colorBorderSecondary: '#e2e8f0',
            fontFamily: "'Inter', 'Outfit', sans-serif",
            borderRadius: 8,
          },
        }}
      >
        <App />
      </ConfigProvider>
    </Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RootApp />);
