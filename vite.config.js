import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

// Load biến môi trường từ file `.env`
dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify('https://food-app-gvbhgyfabjcthbhd.southeastasia-01.azurewebsites.net'),
    'import.meta.env.VITE_API_KEY_MAP': JSON.stringify('5b3ce3597851110001cf6248d480712f52d0466d8d71a3927b194e84Y'),
    'import.meta.env.VITE_AI_URL': JSON.stringify('http://localhost:5000'),
    'import.meta.env.VITE_GG_CLIENT_ID': JSON.stringify('573457159835-eove7gjjeoh97o5148hai0boiarfko3s.apps.googleusercontent.com'),
  },
  server: {
    port: 3000,
  },
});