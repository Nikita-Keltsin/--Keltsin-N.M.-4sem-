import { ajax } from '../modules/ajax.js';
import { filterUrls } from '../modules/filterUrls.js';

export class EditPage {
    constructor(root, navigateFunc, id = null) {
        this.root = root;
        this.navigate = navigateFunc;
        this.id = id;
    }

    render() {
        this.root.innerHTML = `
            <div style="width: 100%; padding: 20px 50px;">
                <button id="back-btn" class="my-btn secondary" style="height: 45px;">&larr; Назад</button>
            </div>
            <div class="filter-card" style="max-width: 600px; width: 90%; padding: 40px; margin: 0 auto;">
                <div class="result" style="font-size: 1.6rem; padding: 15px;">
                    ${this.id ? 'Просмотр фильтра' : 'Добавление фильтра'}
                </div>
                <div id="form-container">Загрузка...</div>
            </div>
        `;
        document.getElementById('back-btn').addEventListener('click', () => this.navigate('main'));

        if (this.id) {
            ajax.get(filterUrls.getFilterById(this.id), (data, status) => {
                if (status === 200) this.renderForm(data);
            });
        } else {
            this.renderForm(null);
        }
    }

    renderForm(data) {
        document.getElementById('form-container').innerHTML = `
            <input type="text" class="result" value="${data ? data.name : ''}" placeholder="Название фильтра" style="text-align:left;">
            <input type="text" class="result" value="${data ? data.type : ''}" placeholder="Тип (КИХ/БИХ)" style="text-align:left;">
            <p style="color: red; font-weight: bold; text-align: center;">ЛР №5: Кнопки 'Сохранить' нет по заданию!</p>
        `;
    }
}