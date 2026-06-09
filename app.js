import { MainPage } from './pages/MainPage.js';
import { DetailPage } from './pages/DetailPage.js';

const root = document.getElementById('root');

function navigate(page, id = null) {
    if (page === 'main') {
        new MainPage(root, navigate).render();
    } else if (page === 'detail') {
        new DetailPage(root, navigate, id).render();
    }
}
navigate('main');