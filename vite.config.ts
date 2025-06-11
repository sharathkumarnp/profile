import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/profile/', // Change this if necessary
  optimizeDeps: {
    include: ['lucide-react','react-custom-scrollbars'], // Make sure this is included if you're using the library
  },
});
