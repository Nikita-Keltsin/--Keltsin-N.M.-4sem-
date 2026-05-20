import { ajax } from '../ajax.js';
import { filterUrls } from '../filterUrls.js';
 
/**
 * EditPage — страница добавления / редактирования фильтра.
 *
 * ЛР №5: поля интерактивны (можно вводить данные),
 * но кнопка «Сохранить» появится только в ЛР №6.
 *
 * id === null → режим создания (поля пустые)
 * id — число  → режим редактирования (поля заполнены с сервера)
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
            // XHR GET /filters/:id — заполняем поля данными с сервера
            ajax.get(filterUrls.getFilterById(this.id), (data, status) => {
                const formContent = document.getElementById('form-content');
                if (status !== 200 || !data) {
                    formContent.innerHTML = `<p style="color:red;">Фильтр не найден (статус: ${status}).</p>`;
                    return;
                }
                this.renderForm(formContent, data);
            });
        } else {
            this.renderForm(document.getElementById('form-content'), null);
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
 
                <!-- Кнопка «Сохранить» появится в ЛР №6 -->
                <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 12px; padding: 15px; margin-top: 10px;">
                    <p style="margin: 0; color: #856404; font-size: 1rem;">
                        ℹ️ <strong>ЛР №5:</strong> поля можно заполнять, но сохранение реализовано в ЛР №6 через <code>fetch</code>.
                    </p>
                </div>
 
            </div>
        `;
    }
 
    _escape(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
}
 