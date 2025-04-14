import React from 'react';
import { AppRoutes } from './routes';
import './index.css'; // Importação do CSS global

function App() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <AppRoutes />
    </div>
  );
}

export default App;