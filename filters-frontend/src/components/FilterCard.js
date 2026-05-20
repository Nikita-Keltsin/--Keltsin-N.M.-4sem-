export class FilterCard {
    getHTML(filter) {
        return `
            <div class="filter-card">
                <img src="${filter.imageUrl}" alt="${filter.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px; margin-bottom: 15px; border: 1px solid #ccc;">
                
                <div class="result" style="height: auto; white-space: normal; font-size: 1.4rem; padding: 10px;">
                    ${filter.name}
                </div>
                
                <p style="color: #2c3e50; font-weight: bold; font-size: 1.1rem; text-align: center;">Тип: <span style="color: #276221">${filter.type}</span></p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; margin-top: auto;">
                    <button class="my-btn primary btn-detail" data-id="${filter.id}" style="width: 100%; height: 50px; font-size: 1rem;">Подробнее</button>
                    <button class="my-btn secondary btn-edit" data-id="${filter.id}" style="width: 100%; height: 50px; font-size: 1rem;">Изменить</button>
                </div>
                <button class="my-btn secondary btn-delete" data-id="${filter.id}" style="width: 100%; height: 40px; font-size: 1rem; color: #d9534f; margin-top: 10px;">Удалить</button>
            </div>
        `;
    }
}