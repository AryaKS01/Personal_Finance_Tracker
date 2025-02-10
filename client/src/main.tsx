import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter
import './index.css';
import App from './App.jsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter> {/* Wrap your app in BrowserRouter */}
        <App />
      </BrowserRouter>
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}


