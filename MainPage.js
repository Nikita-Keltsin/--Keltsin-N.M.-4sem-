import { FilterCard } from '../components/FilterCard.js';
import { get, del } from '../modules/api.js';
import { filterUrls } from '../modules/filterUrls.js';

export class MainPage {
    constructor(root, navigateFunc) {
        this.root = root;
        this.navigate = navigateFunc;
        this.render();
    }

    render() {
        this.root.innerHTML = '';
        const cardsHTML = '';
        const html = `
           <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 10px 50px; margin-bottom: 20px;">
                <button id="home-btn" class="my-btn secondary" style="width: 120px; margin-left: 20px; padding: 0 20px; height: 45px;">Сброс</button>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="text" id="search-input" class="result" style="width: 700px; height: 60px; font-size: 1.2rem; padding: 0 15px; color: white;" placeholder="Поиск фильтра...">
                    <button id="search-btn" class="my-btn" style="background-color: #add8e6; border: none; padding: 0 20px; height: 45px; border-radius: 12px; cursor: pointer;">Найти</button>
                </div>
                <button id="add-btn" class="my-btn execute" style="margin-right: 20px; padding: 0 20px; height: 45px;">+ Добавить фильтр</button>
            </div>
            <div class="gallery-grid" style="justify-content: flex-start;" id="cards-container">
                ${cardsHTML}
            </div>
        `;
        this.root.insertAdjacentHTML('beforeend', html);
        this.addListeners();
        this.getData();
    }

    async getData(query = '') {
        try {
            const url = filterUrls.getFilters(query);
            const filters = await get(url);
            this.renderCards(filters);
        } catch (err) {
            console.error('Ошибка загрузки фильтров:', err);
            const container = document.getElementById('cards-container');
            if (container) container.innerHTML = '<p style="color:red;">Ошибка загрузки данных</p>';
        }
    }

    renderCards(filters) {
        const container = document.getElementById('cards-container');
        if (!container) return;
        container.innerHTML = '';
        filters.forEach(filter => {
            const card = new FilterCard();
            container.insertAdjacentHTML('beforeend', card.getHTML(filter));
        });
        this.attachCardEvents();
    }

    attachCardEvents() {
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.removeEventListener('click', this.handleDelete);
            btn.addEventListener('click', this.handleDelete.bind(this));
        });
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.removeEventListener('click', this.handleEdit);
            btn.addEventListener('click', this.handleEdit.bind(this));
        });
        document.querySelectorAll('.btn-detail').forEach(btn => {
            btn.removeEventListener('click', this.handleDetail);
            btn.addEventListener('click', this.handleDetail.bind(this));
        });
    }

    async handleDelete(e) {
        const id = parseInt(e.target.dataset.id);
        try {
            await del(filterUrls.deleteFilter(id));
            this.getData();
        } catch {
            alert('Ошибка удаления');
        }
    }

    handleEdit(e) {
        const id = parseInt(e.target.dataset.id);
        this.navigate('edit', id);
    }

    handleDetail(e) {
        const id = parseInt(e.target.dataset.id);
        this.navigate('detail', id);
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
            this.navigate('edit');
        });
    }
}