import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

// Load biến môi trường từ file `.env`
dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify('https://food-app-gvbhgyfabjcthbhd.southeastasia-01.azurewebsites.net'),
    'import.meta.env.VITE_AI_URL': JSON.stringify('http://localhost:5000'),
  },
  server: {
    port: 3000,
  },
});