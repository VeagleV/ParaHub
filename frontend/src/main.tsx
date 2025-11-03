import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.tsx'
import 'leaflet/dist/leaflet.css'

console.log('React.version', (React as any).version);
console.log('ReactDOM available:', !!ReactDOM);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
