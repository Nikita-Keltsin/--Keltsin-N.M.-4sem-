import { get, post, patch } from '../modules/api.js';
import { filterUrls } from '../modules/filterUrls.js';

export class EditPage {
    constructor(root, navigateFunc, id = null) {
        this.root = root;
        this.navigate = navigateFunc;
        this.id = id;
        this.render();
    }

    render() {
        this.root.innerHTML = `
            <div style="padding:20px 50px;">
                <button id="back-btn" class="my-btn secondary">← Назад</button>
                <h2>${this.id ? 'Редактирование фильтра' : 'Добавление нового фильтра'}</h2>
                <div id="edit-form" style="max-width:800px; margin-top:30px;">
                    <div style="margin-bottom:20px;">
                        <label>Название:</label><br>
                        <input type="text" id="edit-name" class="result" style="width:100%; height:50px; font-size:1.2rem;">
                    </div>
                    <div style="margin-bottom:20px;">
                        <label>Тип:</label><br>
                        <input type="text" id="edit-type" class="result" style="width:100%; height:50px; font-size:1.2rem;">
                    </div>
                    <div style="margin-bottom:20px;">
                        <label>Описание:</label><br>
                        <textarea id="edit-description" class="result" rows="8" style="width:100%; font-size:1.2rem; padding:10px;"></textarea>
                    </div>
                    <div style="margin-bottom:20px;">
                        <label>URL изображения (data:image/svg...):</label><br>
                        <input type="text" id="edit-image" class="result" style="width:100%; height:50px; font-size:1.1rem;">
                    </div>
                    <button id="save-btn" class="my-btn execute" style="margin-top:20px; width:200px; height:50px; font-size:1.2rem;">Сохранить</button>
                </div>
            </div>
        `;
        document.getElementById('back-btn').addEventListener('click', () => this.navigate('main'));
        document.getElementById('save-btn').addEventListener('click', () => this.saveData());
        if (this.id) this.loadData();
        else this.clearForm();
    }

    async loadData() {
        try {
            const url = filterUrls.getFilterById(this.id);
            const data = await get(url);
            document.getElementById('edit-name').value = data.name || '';
            document.getElementById('edit-type').value = data.type || '';
            document.getElementById('edit-description').value = data.description || '';
            document.getElementById('edit-image').value = data.imageUrl || '';
        } catch (err) {
            alert('Не удалось загрузить данные фильтра');
            this.navigate('main');
        }
    }

    clearForm() {
        document.getElementById('edit-name').value = '';
        document.getElementById('edit-type').value = '';
        document.getElementById('edit-description').value = '';
        document.getElementById('edit-image').value = '';
    }

    async saveData() {
        const name = document.getElementById('edit-name').value.trim();
        const type = document.getElementById('edit-type').value.trim();
        const description = document.getElementById('edit-description').value.trim();
        const imageUrl = document.getElementById('edit-image').value.trim();

        if (!name || !type || !description) {
            alert('Заполните все поля!');
            return;
        }

        const payload = { name, type, description, imageUrl };

        try {
            if (this.id) {
                // Редактирование (PATCH)
                await patch(filterUrls.updateFilter(this.id), payload);
                alert('Фильтр обновлён');
            } else {
                // Добавление (POST)
                await post(filterUrls.createFilter(), payload);
                alert('Фильтр добавлен');
            }
            this.navigate('main'); // возврат на главную после сохранения
        } catch (err) {
            console.error(err);
            alert('Ошибка сохранения');
        }
    }
}