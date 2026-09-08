import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import ShopPage from './pages/ShopPage.jsx';
import ProductPage from './pages/ProductPage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShopPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/products/:slug" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
