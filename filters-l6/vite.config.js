// vite.config.js
//
// Vite — bundler: собирает все JS-файлы в один оптимизированный bundle.
// npm run dev   → dev-сервер с hot-reload на localhost:5173
// npm run build → сборка в папку ./public
//
// Папку ./public копируем в корень проекта ЛР №4.
// Express раздаёт её как статику — фронтенд и API на одном порту,
// CORS не возникает.
 
export default {
    build: {
        outDir: 'public',
        emptyOutDir: true,
    },
};
 