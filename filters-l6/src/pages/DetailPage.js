import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { api } from '../api.js';
import { filterUrls } from '../filterUrls.js';

export class DetailPage {
    constructor(root, navigateFunc, id) {
        this.root = root;
        this.navigate = navigateFunc;
        this.id = id;
        this.filter = null;
    }

    calculateDCOffset(signalArray) {
        if (signalArray.length === 0) return "Сигнал отсутствует!";
        let sum = 0;
        for (let i = 0; i < signalArray.length; i++) sum += signalArray[i];
        return (sum / signalArray.length).toFixed(2);
    }

    mergeConfigurations(...objects) {
        const result = {};
        for (const obj of objects) {
            for (const key in obj) {
                if (Object.hasOwn(obj, key) && !(key in result)) result[key] = obj[key];
            }
        }
        return result;
    }

    render() {
        this.root.innerHTML = '';
        this.root.insertAdjacentHTML('beforeend', `
            <div style="width: 100%; padding: 20px 50px;">
                <button id="home-btn" class="my-btn secondary" style="padding: 0 20px; height: 45px; font-size: 1.1rem; margin-bottom: 20px;">&larr; Вернуться назад</button>
            </div>
            <div id="detail-content" style="width: 100%; display: flex; justify-content: center;">
                <p style="color:#888; font-size:1.2rem;">Загрузка...</p>
            </div>
        `);

        document.getElementById('home-btn').addEventListener('click', () => this.navigate('main'));
        this.fetchFilter();
    }

    async fetchFilter() {
        const content = document.getElementById('detail-content');
        try {
            const { data, status } = await api.get(filterUrls.getFilterById(this.id));
            if (status !== 200 || !data) {
                content.innerHTML = `<p style="color:red;">Фильтр не найден (статус: ${status}).</p>`;
                return;
            }
            this.filter = data;
            this.renderContent(content);
        } catch (err) {
            content.innerHTML = `<p style="color:red;">Ошибка: ${err.message}</p>`;
        }
    }

    renderContent(container) {
        container.innerHTML = `
            <div class="filter-card" style="max-width: 900px; width: 90%; padding: 40px; margin: 0 auto;">
                <div class="result" style="white-space: normal; height: auto; font-size: 2rem; padding: 20px;">${this.filter.name}</div>

                <h3 style="color:#1b5c87; margin-top: 20px;">3D Модель (Audio DSP):</h3>
                <div id="model-container" style="width: 100%; height: 450px; background: #e0e0e8; border-radius: 12px; border: 2px solid #2c3e50; margin-bottom: 20px; overflow: hidden;"></div>

                <p style="text-align:justify; font-size:1.3rem; line-height: 1.6;">${this.filter.description}</p>
                <p style="color: #2c3e50; font-weight: bold; font-size: 1.3rem;">Тип: <span style="color: #276221">${this.filter.type}</span></p>

                <hr style="width:100%; border: 1px solid #ccc; margin: 30px 0;">

                <h3 style="color:#276221">Аналитика сигнала (ДЗ)</h3>
                <button id="run-analytics-btn" class="my-btn execute" style="width: 300px; height: 60px; font-size: 1.3rem;">Запустить расчеты</button>
                <div id="analytics-result" style="display: block; background: #e0e0e8; border: 1px solid #e2e8f0; border-radius: 12px; color: #2c3e50; font-family: 'Courier New', monospace; font-size: 1.3rem; padding: 25px; margin-top: 20px; width: 100%; text-align: left; line-height: 2.0;">
                    Ожидание...
                </div>
            </div>
        `;

        document.getElementById('run-analytics-btn').addEventListener('click', () => {
            const resDiv = document.getElementById('analytics-result');
            resDiv.innerHTML = "Считаем...<br><br>";

            const inputSignal = [23, 78, 90, 567, 231];
            const userConfig = { type: this.filter.type, cutoff: 1000 };
            const defaultConfig = { cutoff: 500, gain: 1.5, status: "Active" };
            const dcOffset = this.calculateDCOffset(inputSignal);
            const finalConfig = this.mergeConfigurations(userConfig, defaultConfig);

            let stabilityLevel = 0, steps = 0;
            do { stabilityLevel += Math.random() * 30; steps++; } while (stabilityLevel < 100);

            resDiv.innerHTML = `
                <strong style="color:#1b5c87;">1. Постоянная составляющая сигнала:</strong> ${dcOffset} (Функция №1.8)<br><br>
                <strong style="color:#1b5c87;">2. Итоговая конфигурация фильтра:</strong> ${JSON.stringify(finalConfig)} (Функция №3.1)<br><br>
                <strong style="color:#1b5c87;">3. Стабилизация фильтра (do-while):</strong> Достигнута за ${steps} шагов.
            `;
        });

        setTimeout(() => this.initThreeJS(), 100);
    }

    initThreeJS() {
        const container = document.getElementById('model-container');
        if (!container) return;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#e0e0e8');
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 5);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        scene.add(new THREE.AmbientLight(0xffffff, 2.0));
        const d = new THREE.DirectionalLight(0xffffff, 2.0);
        d.position.set(5, 10, 7);
        scene.add(d);
        new GLTFLoader().load(
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb',
            (gltf) => { gltf.scene.scale.set(80, 80, 80); scene.add(gltf.scene); }
        );
        const animate = () => { requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); };
        animate();
    }
}