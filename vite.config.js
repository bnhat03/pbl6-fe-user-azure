import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

// Load biến môi trường từ file `.env`
dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify('https://food-app-gvbhgyfabjcthbhd.southeastasia-01.azurewebsites.net'),
    'import.meta.env.VITE_AI_URL': JSON.stringify('https://da73-14-191-112-76.ngrok-free.app'),
    // 'import.meta.env.VITE_AI_PRODUCT_URL': JSON.stringify('https://d709-14-191-113-242.ngrok-free.app'),
  },
  server: {
    port: 3000,
  },
});