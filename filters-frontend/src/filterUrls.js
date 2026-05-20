/**
 * Класс для хранения URL-адресов API бэкенда (ЛР №4).
 * Лежит рядом с mockData.js в src/ — аналогично тому,
 * как mockData был источником данных, теперь им становится API.
 */
class FilterUrls {
    constructor() {
        // Адрес сервера из ЛР №4
        this.baseUrl = 'http://localhost:3000';
    }
 
    // GET /filters?name=... — получить все фильтры (опционально с фильтрацией)
    getFilters(nameQuery = '') {
        const url = `${this.baseUrl}/filters`;
        return nameQuery ? `${url}?name=${encodeURIComponent(nameQuery)}` : url;
    }
 
    // GET /filters/:id
    getFilterById(id) {
        return `${this.baseUrl}/filters/${id}`;
    }
 
    // POST /filters
    createFilter() {
        return `${this.baseUrl}/filters`;
    }
 
    // PATCH /filters/:id
    updateFilterById(id) {
        return `${this.baseUrl}/filters/${id}`;
    }
 
    // DELETE /filters/:id
    deleteFilterById(id) {
        return `${this.baseUrl}/filters/${id}`;
    }
}
 
export const filterUrls = new FilterUrls();
 