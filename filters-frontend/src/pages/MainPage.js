// src/pages/MainPage.js
import { FilterCard } from '../components/FilterCard.js';
import { ajax } from '../modules/ajax.js';
import { filterUrls } from '../modules/filterUrls.js';

export class MainPage {
    constructor(root, navigateFunc) {
        this.root = root;
        this.navigate = navigateFunc;
        this.currentData = [];
        this.currentQuery = ''; 
    }

    getData(query = '') {
        const url = query ? `${filterUrls.getFilters()}?name_like=${encodeURIComponent(query)}` : filterUrls.getFilters();
        
        ajax.get(url, (data, status) => {
            if (status === 200 && data) {
                this.currentData = data;
                this.renderCards();
            } else {
                console.error("Ошибка сервера или CORS!", status);
                const container = document.getElementById('cards-container');
                if (container) {
                    container.innerHTML = `<p style="color:red; font-size:1.2rem; text-align:center; width:100%;">Ошибка загрузки данных (Статус: ${status})</p>`;
                }
            }
        });
    }

    render() {
        this.root.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: flex-start; gap: 20px; width: 100%; padding: 15px 50px; margin-bottom: 25px;">
                <button id="home-btn" class="my-btn secondary" style="padding: 0 20px; height: 42px; margin: 0; border-radius: 10px; font-size: 1rem;">Сброс</button>
                
                <input type="text" id="search-input" 
                    style="width: 40vw; height: 42px; margin: 0; padding: 0 15px; font-size: 1.1rem; border: 2px solid #cbd5e1; border-radius: 10px; outline: none; font-family: inherit;" 
                    placeholder="Поиск фильтра (через API)..." value="${this.currentQuery}">
                
                <button id="add-btn" class="my-btn execute" 
                    style="padding: 0 25px; height: 42px; font-size: 1.1rem; font-weight: bold; margin: 0; border-radius: 10px; background-color: #2ecc71; color: white; border: none;">
                    + Добавить фильтр
                </button>
            </div>
            <div class="gallery-grid" id="cards-container"></div>
        `;

        if (this.currentQuery) {
            const input = document.getElementById('search-input');
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
        }

        this.addListeners();
        this.getData(this.currentQuery); 
    }

    renderCards() {
        const container = document.getElementById('cards-container');
        if (!container) return;
        
        container.style.justifyContent = 'flex-start'; 
        
        if (!this.currentData || this.currentData.length === 0) {
            container.innerHTML = `<p style="color:#888; font-size:1.2rem; text-align:center; width:100%;">Ничего не найдено.</p>`;
            return;
        }
        
        const processedData = [...this.currentData].reverse().map(f => {
            if (f.imageUrl && !f.imageUrl.startsWith('http') && !f.imageUrl.startsWith('data:')) {
                f.imageUrl = `http://localhost:3000/${f.imageUrl}`;
            }
            
            if (!f.imageUrl) {
                f.imageUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%232c3e50'/%3E%3Cpath d='M 0,100 L 400,100 M 200,0 L 200,200' stroke='%2334495e' stroke-width='2'/%3E%3Cpath d='M 40,40 L 180,40 C 240,40 240,160 360,160' stroke='%232ecc71' stroke-width='6' fill='none'/%3E%3C/svg%3E";
            }
            return f;
        });
        
        container.innerHTML = processedData.map(f => new FilterCard().getHTML(f)).join('');
    }

    addListeners() {
        document.getElementById('home-btn').addEventListener('click', () => {
            this.currentQuery = '';
            document.getElementById('search-input').value = '';
            this.getData(); 
        });

        document.getElementById('search-input').addEventListener('input', (e) => {
            this.currentQuery = e.target.value.trim();
            this.getData(this.currentQuery);
        });

        // РЕШЕНИЕ ПРОБЛЕМЫ 3: Никаких окон! Перенаправляем роутер на страницу добавления в текущем окне
        document.getElementById('add-btn').addEventListener('click', () => {
            this.navigate('edit'); 
        });

        document.getElementById('cards-container').addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            if (isNaN(id)) return;

            if (e.target.classList.contains('btn-detail')) this.navigate('detail', id);
            
    
            if (e.target.classList.contains('btn-edit')) this.navigate('edit', id); 
            
            if (e.target.classList.contains('btn-delete')) {
                if (confirm('Вы уверены, что хотите удалить этот фильтр?')) {
                    ajax.delete(filterUrls.removeFilterById(id), (data, status) => {
                        if (status === 200 || status === 204) this.getData(this.currentQuery);
                    });
                }
            }
        });
    }
}