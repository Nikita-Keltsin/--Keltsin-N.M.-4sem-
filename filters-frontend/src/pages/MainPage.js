import { FilterCard } from '../components/FilterCard.js';
import { ajax } from '../modules/ajax.js';
import { filterUrls } from '../modules/filterUrls.js';

export class MainPage {
    constructor(root, navigateFunc) {
        this.root = root;
        this.navigate = navigateFunc;
        this.currentData = [];
    }

    // Получаем данные с бэкенда (как в методичке)
    getData(query = '') {
        const url = query ? `${filterUrls.getFilters()}?name_like=${query}` : filterUrls.getFilters();
        ajax.get(url, (data, status) => {
            if (status === 200 && data) {
                this.currentData = data;
                this.renderCards();
            } else {
                console.error("Ошибка CORS или сервер не запущен!", status);
            }
        });
    }

    render() {
        this.root.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 10px 50px; margin-bottom: 20px;">
                <button id="home-btn" class="my-btn secondary" style="padding: 0 20px; height: 45px;">Сброс</button>
                <input type="text" id="search-input" class="result" style="width: 50vw; height: 45px; margin: 0; padding: 0 15px;" placeholder="Поиск фильтра (через API)...">
                <button id="add-btn" class="my-btn execute" style="padding: 0 20px; height: 45px;">+ Добавить фильтр</button>
            </div>
            <div class="gallery-grid" id="cards-container"></div>
        `;
        this.addListeners();
        this.getData(); // Первичная загрузка
    }

    renderCards() {
        const container = document.getElementById('cards-container');
        
        // ИСПРАВЛЕНИЕ: Прижимаем влево
        container.style.justifyContent = 'flex-start'; 
        
        // ИСПРАВЛЕНИЕ: Переворачиваем массив, чтобы новые (последние добавленные в БД) были слева!
        const reversedData = [...this.currentData].reverse();
        
        container.innerHTML = reversedData.map(f => new FilterCard().getHTML(f)).join('');
    }

    addListeners() {
        document.getElementById('home-btn').addEventListener('click', () => {
            document.getElementById('search-input').value = '';
            this.getData(); 
        });

        // Поиск через API (Query параметры)
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.getData(e.target.value);
        });

        // Навигация на страницу добавления
        document.getElementById('add-btn').addEventListener('click', () => {
            this.navigate('edit'); // Переход без ID = создание
        });

        document.getElementById('cards-container').addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            if (e.target.classList.contains('btn-detail')) this.navigate('detail', id);
            if (e.target.classList.contains('btn-edit')) this.navigate('edit', id); // Редактирование
            
            if (e.target.classList.contains('btn-delete')) {
                ajax.delete(filterUrls.getFilterById(id), (data, status) => {
                    if (status === 200 || status === 204) this.getData();
                });
            }
        });
    }
}