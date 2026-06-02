import { FilterCard } from '../components/FilterCard.js';
import { api } from '../modules/api.js';
import { filterUrls } from '../modules/filterUrls.js';

export class MainPage {
    constructor(root, navigateFunc) {
        this.root = root;
        this.navigate = navigateFunc;
        this.currentQuery = '';
    }

    render() {
        this.root.innerHTML = '';

        this.root.insertAdjacentHTML('beforeend', `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 10px 50px; margin-bottom: 20px;">
                <button id="home-btn" class="my-btn secondary" style="padding: 0 20px; height: 45px; font-size: 1.1rem; width: auto;">Сброс</button>

                <input type="text" id="search-input" class="result"
                    style="width: 50vw; height: 45px; min-height: 45px; margin: 0; font-size: 1.2rem; text-align: left; padding: 0 15px;"
                    placeholder="Поиск фильтра..." value="${this.currentQuery}">

                <button id="add-btn" class="my-btn execute" style="width: auto; padding: 0 20px; height: 45px; font-size: 1.1rem; margin: 0;">+ Добавить фильтр</button>
            </div>
            <div class="gallery-grid" id="cards-container">
                <p style="color:#888; font-size:1.2rem;">Загрузка...</p>
            </div>
        `);

        if (this.currentQuery) {
            const input = document.getElementById('search-input');
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
        }

        this.addListeners();
        this.fetchFilters(this.currentQuery);
    }

    /**
     * fetch-запрос вместо XHR.
     * async/await: ждём ответа, потом рисуем карточки.
     * try/catch: ловим ошибки сети.
     */
    async fetchFilters(nameQuery = '') {
        const container = document.getElementById('cards-container');
        try {
            const { data, status } = await api.get(filterUrls.getFilters(nameQuery));
            if (!container) return;

            if (status !== 200 || !data) {
                container.innerHTML = `<p style="color:red;">Ошибка загрузки (статус: ${status}).</p>`;
                return;
            }
            if (data.length === 0) {
                container.innerHTML = `<p style="color:#888;">Ничего не найдено.</p>`;
                return;
            }
            container.innerHTML = data.map(f => new FilterCard().getHTML(f)).join('');
        } catch (err) {
            if (container) container.innerHTML = `<p style="color:red;">Сервер недоступен: ${err.message}</p>`;
        }
    }

    addListeners() {
        document.getElementById('home-btn').addEventListener('click', () => {
            this.currentQuery = '';
            this.render();
        });

        document.getElementById('search-input').addEventListener('input', (e) => {
            this.currentQuery = e.target.value;
            this.fetchFilters(this.currentQuery);
        });

        document.getElementById('add-btn').addEventListener('click', () => {
            this.navigate('edit', null);
        });

        document.getElementById('cards-container').addEventListener('click', async (e) => {
            const id = parseInt(e.target.dataset.id);
            if (isNaN(id)) return;

            if (e.target.classList.contains('btn-delete')) {
                try {
                    const { status } = await api.delete(filterUrls.deleteFilterById(id));
                    if (status === 204) {
                        this.fetchFilters(this.currentQuery);
                    } else {
                        alert('Ошибка при удалении');
                    }
                } catch (err) {
                    alert(`Ошибка сети: ${err.message}`);
                }
            }
            if (e.target.classList.contains('btn-edit')) this.navigate('edit', id);
            if (e.target.classList.contains('btn-detail')) this.navigate('detail', id);
        });
    }
}