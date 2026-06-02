import { api } from '../api.js';
import { filterUrls } from '../filterUrls.js';

/**
 * EditPage — страница добавления / редактирования фильтра.
 *
 * ЛР №6: появляется кнопка «Сохранить».
 * Создание  → POST   /filters
 * Изменение → PATCH  /filters/:id
 */
export class EditPage {
    constructor(root, navigateFunc, id) {
        this.root = root;
        this.navigate = navigateFunc;
        this.id = id;
        this.isEditMode = id !== null;
    }

    render() {
        this.root.innerHTML = '';

        this.root.insertAdjacentHTML('beforeend', `
            <div style="width: 100%; padding: 20px 50px;">
                <button id="back-btn" class="my-btn secondary" style="padding: 0 20px; height: 45px; font-size: 1.1rem; margin-bottom: 20px;">
                    &larr; Вернуться назад
                </button>
            </div>
            <div class="filter-card" style="max-width: 700px; width: 90%; padding: 40px; margin: 0 auto;">
                <div class="result" style="height: auto; white-space: normal; font-size: 1.6rem; padding: 15px; margin-bottom: 20px;">
                    ${this.isEditMode ? 'Редактирование фильтра' : 'Добавление нового фильтра'}
                </div>
                <div id="form-content">
                    <p style="color:#888;">${this.isEditMode ? 'Загрузка данных с сервера...' : ''}</p>
                </div>
            </div>
        `);

        document.getElementById('back-btn').addEventListener('click', () => this.navigate('main'));

        if (this.isEditMode) {
            this.loadAndRenderForm();
        } else {
            this.renderForm(document.getElementById('form-content'), null);
        }
    }

    async loadAndRenderForm() {
        const formContent = document.getElementById('form-content');
        try {
            const { data, status } = await api.get(filterUrls.getFilterById(this.id));
            if (status !== 200 || !data) {
                formContent.innerHTML = `<p style="color:red;">Фильтр не найден (статус: ${status}).</p>`;
                return;
            }
            this.renderForm(formContent, data);
        } catch (err) {
            formContent.innerHTML = `<p style="color:red;">Ошибка: ${err.message}</p>`;
        }
    }

    renderForm(container, filter) {
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 20px; width: 100%;">

                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label style="font-weight: bold; color: #2c3e50; font-size: 1.1rem;">Название фильтра:</label>
                    <input type="text" id="field-name" class="result"
                        style="height: 50px; min-height: 50px; font-size: 1.1rem; text-align: left; padding: 0 15px; width: 100%;"
                        placeholder="Например: ФНЧ (Low-pass)"
                        value="${filter ? this._escape(filter.name) : ''}">
                </div>

                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label style="font-weight: bold; color: #2c3e50; font-size: 1.1rem;">Тип фильтра:</label>
                    <input type="text" id="field-type" class="result"
                        style="height: 50px; min-height: 50px; font-size: 1.1rem; text-align: left; padding: 0 15px; width: 100%;"
                        placeholder="Например: IIR (БИХ) или FIR (КИХ)"
                        value="${filter ? this._escape(filter.type) : ''}">
                </div>

                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label style="font-weight: bold; color: #2c3e50; font-size: 1.1rem;">Описание:</label>
                    <textarea id="field-description" class="result"
                        style="min-height: 120px; font-size: 1.1rem; text-align: left; padding: 12px 15px; width: 100%; resize: vertical; line-height: 1.5;"
                        placeholder="Краткое описание принципа работы фильтра..."
                    >${filter ? this._escape(filter.description) : ''}</textarea>
                </div>

                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label style="font-weight: bold; color: #2c3e50; font-size: 1.1rem;">URL изображения:</label>
                    <input type="text" id="field-imageUrl" class="result"
                        style="height: 50px; min-height: 50px; font-size: 1.1rem; text-align: left; padding: 0 15px; width: 100%;"
                        placeholder="https://example.com/image.png"
                        value="${filter ? this._escape(filter.imageUrl) : ''}">
                </div>

                <div id="save-error" style="display:none; color:red; font-size:1rem; padding: 10px;"></div>

                <button id="save-btn" class="my-btn execute" style="width: 100%; height: 60px; font-size: 1.3rem; margin-top: 10px;">
                    💾 Сохранить
                </button>

            </div>
        `;

        document.getElementById('save-btn').addEventListener('click', () => this.handleSave());
    }

    async handleSave() {
        const name        = document.getElementById('field-name').value.trim();
        const type        = document.getElementById('field-type').value.trim();
        const description = document.getElementById('field-description').value.trim();
        const imageUrl    = document.getElementById('field-imageUrl').value.trim();
        const errorDiv    = document.getElementById('save-error');

        if (!name || !type || !description) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = 'Заполните поля: Название, Тип и Описание.';
            return;
        }

        errorDiv.style.display = 'none';
        const saveBtn = document.getElementById('save-btn');
        saveBtn.disabled = true;
        saveBtn.textContent = 'Сохранение...';

        const body = { name, type, description, imageUrl };

        try {
            let status;
            if (this.isEditMode) {
                ({ status } = await api.patch(filterUrls.updateFilterById(this.id), body));
            } else {
                ({ status } = await api.post(filterUrls.createFilter(), body));
            }

            if (status === 200 || status === 201) {
                this.navigate('main');
            } else {
                errorDiv.style.display = 'block';
                errorDiv.textContent = `Ошибка сервера (статус: ${status}).`;
                saveBtn.disabled = false;
                saveBtn.textContent = '💾 Сохранить';
            }
        } catch (err) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = `Ошибка сети: ${err.message}`;
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Сохранить';
        }
    }

    _escape(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
}