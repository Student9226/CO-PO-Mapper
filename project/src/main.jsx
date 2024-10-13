import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import axios from 'axios';
import { StrictMode , useEffect} from 'react';
axios.defaults.baseURL = 'https://5000-sagar999-copomapper-sasdici9ljh.ws-us116.gitpod.io';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        
        <App />
    </StrictMode>
)
