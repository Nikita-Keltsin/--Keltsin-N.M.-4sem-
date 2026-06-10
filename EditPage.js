import { ajax } from '../modules/ajax.js';
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
                        <label style="font-weight:bold;">Название:</label><br>
                        <input type="text" id="edit-name" class="result" style="width:100%; height:50px; font-size:1.2rem;">
                    </div>
                    <div style="margin-bottom:20px;">
                        <label style="font-weight:bold;">Тип:</label><br>
                        <input type="text" id="edit-type" class="result" style="width:100%; height:50px; font-size:1.2rem;">
                    </div>
                    <div style="margin-bottom:20px;">
                        <label style="font-weight:bold;">Описание:</label><br>
                        <textarea id="edit-description" class="result" rows="8" style="width:100%; font-size:1.2rem; padding:10px;"></textarea>
                    </div>
                    <div style="margin-bottom:20px;">
                        <label style="font-weight:bold;">URL изображения (data:image/svg...):</label><br>
                        <input type="text" id="edit-image" class="result" style="width:100%; height:50px; font-size:1.1rem;">
                    </div>
                    <p style="color:red; font-style:italic; font-size:1.1rem;">* Сохранение будет в ЛР6</p>
                </div>
            </div>
        `;
        document.getElementById('back-btn').addEventListener('click', () => this.navigate('main'));
        if (this.id) this.loadData();
        else this.clearForm();
    }

    loadData() {
        ajax.get(filterUrls.getFilterById(this.id), (data, status) => {
            if (status === 200 && data) {
                document.getElementById('edit-name').value = data.name || '';
                document.getElementById('edit-type').value = data.type || '';
                document.getElementById('edit-description').value = data.description || '';
                document.getElementById('edit-image').value = data.imageUrl || '';
            } else {
                alert('Не удалось загрузить данные фильтра');
                this.navigate('main');
            }
        });
    }

    clearForm() {
        document.getElementById('edit-name').value = '';
        document.getElementById('edit-type').value = '';
        document.getElementById('edit-description').value = '';
        document.getElementById('edit-image').value = '';
    }
}