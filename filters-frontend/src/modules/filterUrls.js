// src/modules/filterUrls.js

class FilterUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000'; // Порт твоего бэкенда Express
    }

    // Получить все фильтры (GET /filters)
    getFilters() {
        return `${this.baseUrl}/digitalFilters`;
    }

    // Получить один фильтр по ID (GET /filters/:id)
    getFilterById(id) {
        return `${this.baseUrl}/digitalFilters/${id}`;
    }

    // Создать новый фильтр (POST /filters)
    createFilter() {
        return `${this.baseUrl}/digitalFilters`;
    }

    // Удалить фильтр по ID (DELETE /filters/:id) — ИСПРАВЛЕНО: добавлен (id)
    removeFilterById(id) {
        return `${this.baseUrl}/digitalFilters/${id}`;
    }

    // Частично обновить фильтр по ID (PATCH /filters/:id) — ИСПРАВЛЕНО: добавлен (id)
    updateFilterById(id) {
        return `${this.baseUrl}/digitalFilters/${id}`;
    }
}

export const filterUrls = new FilterUrls();