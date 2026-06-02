import { FilterCard } from '../components/FilterCard.js';
import { ajax } from '../modules/ajax.js';
import { filterUrls } from '../modules/filterUrls.js';

export class MainPage {
    constructor(root, navigateFunc) {
        this.root = root;
        this.navigate = navigateFunc;
        this.currentData = [];
        this.currentQuery = ''; // Храним запрос, чтобы инпут не очищался при перерисовке
    }

    // Получаем данные с бэкенда через XMLHttpRequest (ЛР №5)
    getData(query = '') {
        const url = query ? `${filterUrls.getFilters()}?name_like=${encodeURIComponent(query)}` : filterUrls.getFilters();
        
        ajax.get(url, (data, status) => {
            if (status === 200 && data) {
                this.currentData = data;
                this.renderCards();
            } else {
                console.error("Ошибка CORS или сервер не запущен!", status);
                const container = document.getElementById('cards-container');
                if (container) {
                    container.innerHTML = `<p style="color:red; font-size:1.2rem; text-align:center; width:100%;">Ошибка сети (статус: ${status}). Проверьте CORS Unblock!</p>`;
                }
            }
        });
    }

    render() {
        this.root.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 10px 50px; margin-bottom: 20px;">
                <button id="home-btn" class="my-btn secondary" style="padding: 0 20px; height: 45px;">Сброс</button>
                <input type="text" id="search-input" class="result" style="width: 50vw; height: 45px; margin: 0; padding: 0 15px;" placeholder="Поиск фильтра (через API)..." value="${this.currentQuery}">
                <button id="add-btn" class="my-btn execute" style="padding: 0 20px; height: 45px;">+ Добавить фильтр</button>
            </div>
            <div class="gallery-grid" id="cards-container">
                <p style="color:#888; font-size:1.2rem;">Загрузка...</p>
            </div>
        `;

        // Возвращаем фокус в инпут, если там был текст (чтобы можно было печатать без остановок)
        if (this.currentQuery) {
            const input = document.getElementById('search-input');
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
        }

        this.addListeners();
        this.getData(this.currentQuery); // Первичная загрузка
    }

    renderCards() {
        const container = document.getElementById('cards-container');
        if (!container) return;
        
        // Прижимаем влево (Твое требование!)
        container.style.justifyContent = 'flex-start'; 
        
        if (!this.currentData || this.currentData.length === 0) {
            container.innerHTML = `<p style="color:#888; font-size:1.2rem; text-align:center; width:100%;">Ничего не найдено.</p>`;
            return;
        }

        // Переворачиваем массив, чтобы новые были слева (Твое требование!)
        const reversedData = [...this.currentData].reverse();
        
        container.innerHTML = reversedData.map(f => new FilterCard().getHTML(f)).join('');
    }

    addListeners() {
        document.getElementById('home-btn').addEventListener('click', () => {
            this.currentQuery = '';
            this.getData(); 
            this.render();
        });

        // Живой поиск через API (Query параметры)
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.currentQuery = e.target.value.trim();
            this.getData(this.currentQuery);
        });

        // Навигация на страницу добавления
        document.getElementById('add-btn').addEventListener('click', () => {
            this.navigate('edit'); // Переход без ID = создание
        });

        document.getElementById('cards-container').addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            if (isNaN(id)) return;

            if (e.target.classList.contains('btn-detail')) this.navigate('detail', id);
            if (e.target.classList.contains('btn-edit')) this.navigate('edit', id); // Редактирование
            
            // Удаление через XHR (ЛР №5)
            if (e.target.classList.contains('btn-delete')) {
                if (confirm('Вы уверены, что хотите удалить этот фильтр?')) {
                    // Используем правильный метод removeFilterById
                    ajax.delete(filterUrls.removeFilterById(id), (data, status) => {
                        if (status === 200 || status === 204) {
                            this.getData(this.currentQuery); // Перезагружаем список
                        } else {
                            alert(`Ошибка при удалении. Статус: ${status}`);
                        }
                    });
                }
            }
        });
    }
}