import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import { CargoStoreProvider } from './store/cargoStore';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CargoStoreProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CargoStoreProvider>
  </React.StrictMode>
);
