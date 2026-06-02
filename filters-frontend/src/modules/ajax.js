class Ajax {
    /**
     * GET — только читает данные, тело не отправляет.
     * @param {string}   url
     * @param {function} callback(data, status)
     */
    get(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();
 
        xhr.onreadystatechange = () => {
            // readyState === 4: ответ полностью получен
            if (xhr.readyState === 4) {
                this._handleResponse(xhr, callback);
            }
        };
    }
 
    /**
     * POST — создаёт новый ресурс.
     * @param {string}   url
     * @param {object}   data  — будет сериализован в JSON
     * @param {function} callback(data, status)
     */
    post(url, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
 
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this._handleResponse(xhr, callback);
            }
        };
    }
 
    /**
     * PATCH — частично обновляет ресурс.
     */
    patch(url, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('PATCH', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
 
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this._handleResponse(xhr, callback);
            }
        };
    }
 
    /**
     * DELETE — удаляет ресурс.
     */
    delete(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', url);
        xhr.send();
 
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this._handleResponse(xhr, callback);
            }
        };
    }
 
    /**
     * Приватный метод: парсит JSON из ответа и вызывает коллбек.
     */
    _handleResponse(xhr, callback) {
        try {
            const data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
            callback(data, xhr.status);
        } catch (e) {
            console.error('Ошибка парсинга JSON:', e);
            callback(null, xhr.status);
        }
    }
}
 
export const ajax = new Ajax();
 