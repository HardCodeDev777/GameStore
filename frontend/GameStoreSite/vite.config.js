import { defineConfig } from 'vite';

export default defineConfig(() => {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5278';

  return {
    server: {
      host: true, 
      proxy: {
        '/games': {
          target: backendUrl,
          changeOrigin: true,
        },
        '/auth': {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
  };
});