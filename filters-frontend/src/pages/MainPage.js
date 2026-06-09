import { digitalFilters } from '../mockData.js';
import { FilterCard } from '../components/FilterCard.js';

export class MainPage {
    constructor(root, navigateFunc) {
        this.root = root;
        this.navigate = navigateFunc;
        this.currentData = [...digitalFilters];
        //this.getData(); // загружаем начальные данные
    }

    getData(query = '') {
        let filtered = [...digitalFilters];
        if (query) {
            filtered = digitalFilters.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));
        }
        this.currentData = filtered;
        this.render();
    }

    render() {
        this.root.innerHTML = '';
        const cardsHTML = this.currentData.map(f => new FilterCard().getHTML(f)).join('');
        const html = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 10px 50px; margin-bottom: 20px;">
                <button id="home-btn" class="my-btn secondary" style="width: 120px; margin-left: 20px; padding: 0 20px; height: 45px; font-size: 1.1rem;">Сброс</button>
            <div style="display: flex; gap: 10px; align-items: center;">
                <input type="text" id="search-input" class="result" style="width: 700px; height: 60px; font-size: 1.2rem; text-align: left; padding: 0 15px; color: white;" placeholder="Поиск фильтра...">
            <button id="search-btn" class="my-btn" style="background-color: #add8e6; border: none; padding: 0 20px; height: 45px; font-size: 1.1rem; border-radius: 12px; cursor: pointer;">Найти</button>
            </div>
                <button id="add-btn" class="my-btn execute" style="margin-right: 20px; padding: 0 20px; height: 45px; font-size: 1.1rem;">+ Добавить фильтр</button>
            </div>
            <div class="gallery-grid" style="justify-content: flex-start;" id="cards-container">
                ${cardsHTML}
            </div>
        `;
        this.root.insertAdjacentHTML('beforeend', html);
        this.addListeners();
    }

    addListeners() {
        document.getElementById('home-btn').addEventListener('click', () => {
            document.getElementById('search-input').value = '';
            this.getData();
        });

        document.getElementById('search-btn').addEventListener('click', () => {
            const query = document.getElementById('search-input').value;
            this.getData(query);
        });

        document.getElementById('add-btn').addEventListener('click', () => {
            if (digitalFilters.length > 0) {
                const newCard = { ...digitalFilters[0], id: Date.now(), name: "Новый фильтр" };
                digitalFilters.push(newCard);
                this.getData(); // обновляем список
            }
        });

        document.getElementById('cards-container').addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            if (e.target.classList.contains('btn-delete')) {
                const index = digitalFilters.findIndex(f => f.id === id);
                if (index > -1) digitalFilters.splice(index, 1);
                this.getData();
            }
            if (e.target.classList.contains('btn-edit')) {
                const filter = digitalFilters.find(f => f.id === id);
                const newName = prompt("Введите новое название:", filter.name);
                if (newName && newName.trim()) {
                    filter.name = newName;
                    this.getData();
                }
            }
            if (e.target.classList.contains('btn-detail')) {
                this.navigate('detail', id);
            }
        });
    }
}