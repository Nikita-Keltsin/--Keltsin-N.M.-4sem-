export class FilterUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }
    getFilters(query = '') {
        let url = `${this.baseUrl}/digitalFilters`;
        if (query) {
            url += `?name_like=${encodeURIComponent(query)}`;
        }
        return url;
    }
    getFilterById(id) {
        return `${this.baseUrl}/digitalFilters/${id}`;
    }
    createFilter() {
        return `${this.baseUrl}/digitalFilters`;
    }
    deleteFilter(id) {
        return `${this.baseUrl}/digitalFilters/${id}`;
    }
    updateFilter(id) {
        return `${this.baseUrl}/digitalFilters/${id}`;
    }
}
export const filterUrls = new FilterUrls();