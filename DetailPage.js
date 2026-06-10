import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { get } from '../modules/api.js';
import { filterUrls } from '../modules/filterUrls.js';

export class DetailPage {
    constructor(root, navigateFunc, id) {
        this.root = root;
        this.navigate = navigateFunc;
        this.id = id;
        this.filter = null;
        this.render();
    }

    render() {
        this.root.innerHTML = `
            <div style="width:100%; padding:20px 50px;">
                <button id="back-btn" class="my-btn secondary" style="padding:10px 25px; font-size:1.2rem;">← Назад</button>
            </div>
            <div class="filter-card" style="max-width:1100px; margin:0 auto; padding:40px;">
                <div id="detail-content">Загрузка...</div>
            </div>
        `;
        document.getElementById('back-btn').addEventListener('click', () => this.navigate('main'));
        this.loadData();
    }

    async loadData() {
        try {
            const url = filterUrls.getFilterById(this.id);
            const data = await get(url);
            this.filter = data;
            this.renderDetail();
            this.initThreeJS();
            this.addAnalyticsListener();
        } catch {
            document.getElementById('detail-content').innerHTML = '<p style="color:red;">Фильтр не найден</p>';
        }
    }

    renderDetail() {
        const html = `
            <div class="result" style="font-size:2.5rem; padding:20px;">${this.filter.name}</div>
            <h3 style="font-size:1.8rem; margin:30px 0 15px 0;">3D Модель (Audio DSP):</h3>
            <div id="model-container" style="width:100%; height:500px; background:#e0e0e8; border-radius:16px; margin-bottom:30px;"></div>
            <div style="background:#f5f5f7; padding:35px 40px; border-radius:20px; margin:30px 0; border-left:6px solid #276221;">
                <p style="font-size:1.6rem; line-height:1.8; margin:0; text-align:justify;">${this.filter.description}</p>
            </div>
            <p style="font-size:1.4rem; font-weight:bold;">Тип: <span style="color:#276221;">${this.filter.type}</span></p>
            <hr>
            <h3>Аналитика сигнала</h3>
            <button id="run-analytics-btn" class="my-btn execute">Запустить расчеты</button>
            <div id="analytics-result" style="background:#e0e0e8; padding:30px; margin-top:25px; font-family:monospace; font-size:1.4rem;"></div>
        `;
        document.getElementById('detail-content').innerHTML = html;
    }

    addAnalyticsListener() {
        const btn = document.getElementById('run-analytics-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                const resDiv = document.getElementById('analytics-result');
                resDiv.innerHTML = "Считаем...";
                const inputSignal = [23, 78, 90, 567, 231];
                const dcOffset = this.calculateDCOffset(inputSignal);
                const userConfig = { type: this.filter.type, cutoff: 1000 };
                const defaultConfig = { cutoff: 500, gain: 1.5, status: "Active" };
                const finalConfig = this.mergeConfigurations(userConfig, defaultConfig);
                let stability = 0, steps = 0;
                do { stability += Math.random() * 30; steps++; } while (stability < 100);
                resDiv.innerHTML = `
                    <strong>1. Постоянная составляющая:</strong> ${dcOffset}<br><br>
                    <strong>2. Конфигурация:</strong> ${JSON.stringify(finalConfig)}<br><br>
                    <strong>3. Стабилизация за ${steps} шагов.</strong>
                `;
            });
        }
    }

    calculateDCOffset(signal) {
        if (!signal.length) return "Нет сигнала";
        let sum = 0;
        for (let v of signal) sum += v;
        return (sum / signal.length).toFixed(2);
    }

    mergeConfigurations(...objects) {
        const result = {};
        for (const obj of objects) {
            for (const key in obj) {
                if (!(key in result)) result[key] = obj[key];
            }
        }
        return result;
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
        const ambientLight = new THREE.AmbientLight(0xffffff, 2);
        const dirLight = new THREE.DirectionalLight(0xffffff, 2);
        dirLight.position.set(5, 10, 7);
        scene.add(ambientLight, dirLight);
        const loader = new GLTFLoader();
        loader.load('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb', (gltf) => {
            const model = gltf.scene;
            model.scale.set(80, 80, 80);
            scene.add(model);
        });
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();
    }
}