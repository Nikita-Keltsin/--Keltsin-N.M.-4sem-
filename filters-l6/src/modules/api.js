class Api {
    /**
     * Внутренний метод — выполняет fetch и возвращает {data, status}.
     */
    async _request(url, options = {}) {
        const response = await fetch(url, options);
 
        let data = null;
        if (response.status !== 204) {
            try {
                data = await response.json();
            } catch {
                data = null;
            }
        }
 
        return { data, status: response.status };
    }
 
    async get(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Ошибка GET: ${response.status}`);
        }
        return await response.json(); // fetch автоматически оборачивает это в Promise
    }

    /**
     * POST — Создание новой записи (передаем тело data)
     */
    async post(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`Ошибка POST: ${response.status}`);
        }
        return await response.json();
    }

    /**
     * DELETE — Удаление записи по ID
     */
    async delete(url) {
        const response = await fetch(url, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Ошибка DELETE: ${response.status}`);
        }
        // Если сервер возвращает 204 No Content, не пытаемся парсить JSON
        return response.status !== 204 ? await response.json() : null;
    }

    /**
     * PATCH — Частичное обновление данных
     */
    async patch(url, data) {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`Ошибка PATCH: ${response.status}`);
        }
        return await response.json();
    }
}

// Экспортируем готовый экземпляр класса для работы на страницах
export const api = new Api();
 