// src/modules/filterUrls.js

class FilterUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000'; // Порт твоего бэкенда Express
    }


    getFilters() {
        return `${this.baseUrl}/digitalFilters`;
    }
   
    getFilterById(id) {
        return `${this.baseUrl}/digitalFilters/${id}`;
    }

    createFilter() {
        return `${this.baseUrl}/digitalFilters`;
    }

    removeFilterById(id) {
        return `${this.baseUrl}/digitalFilters/${id}`;
    }

    updateFilterById(id) {
        return `${this.baseUrl}/digitalFilters/${id}`;
    }
}

export const filterUrls = new FilterUrls();