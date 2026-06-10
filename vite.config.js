import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: 'public',    // папка, куда сложится сборка
        emptyOutDir: true,
        rollupOptions: {
            input: 'index.html',
        },
    },
    server: {
        port: 5173,
    },
});