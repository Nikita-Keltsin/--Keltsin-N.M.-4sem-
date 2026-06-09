// Рисуем настоящие математические графики АЧХ в формате SVG
const imgLowPass = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%232c3e50'/%3E%3Cpath d='M 0,100 L 400,100 M 200,0 L 200,200' stroke='%2334495e' stroke-width='2'/%3E%3Cpath d='M 40,40 L 180,40 C 240,40 240,160 360,160' stroke='%232ecc71' stroke-width='6' fill='none'/%3E%3C/svg%3E";

const imgHighPass = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%232c3e50'/%3E%3Cpath d='M 0,100 L 400,100 M 200,0 L 200,200' stroke='%2334495e' stroke-width='2'/%3E%3Cpath d='M 40,160 C 160,160 160,40 220,40 L 360,40' stroke='%23e74c3c' stroke-width='6' fill='none'/%3E%3C/svg%3E";

const imgBandPass = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%232c3e50'/%3E%3Cpath d='M 0,100 L 400,100 M 200,0 L 200,200' stroke='%2334495e' stroke-width='2'/%3E%3Cpath d='M 40,160 C 120,160 140,40 200,40 C 260,40 280,160 360,160' stroke='%23f1c40f' stroke-width='6' fill='none'/%3E%3C/svg%3E";

const imgNotch = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%232c3e50'/%3E%3Cpath d='M 0,100 L 400,100 M 200,0 L 200,200' stroke='%2334495e' stroke-width='2'/%3E%3Cpath d='M 40,40 L 140,40 C 180,40 190,160 200,160 C 210,160 220,40 260,40 L 360,40' stroke='%239b59b6' stroke-width='6' fill='none'/%3E%3C/svg%3E";

const imgMovingAvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%232c3e50'/%3E%3Cpath d='M 0,100 L 400,100 M 200,0 L 200,200' stroke='%2334495e' stroke-width='2'/%3E%3Cpath d='M 40,100 L 60,60 L 80,140 L 100,70 L 120,130 L 140,80 L 160,120 L 180,90 L 200,110 L 220,95 L 240,105 L 260,98 L 280,102 L 300,100 L 360,100' stroke='%237f8c8d' stroke-width='2' fill='none'/%3E%3Cpath d='M 40,100 C 100,100 120,100 200,100 C 250,100 300,100 360,100' stroke='%233498db' stroke-width='6' fill='none'/%3E%3C/svg%3E";


export let digitalFilters = [
    {
        id: 1,
        name: "ФНЧ (Low-pass)",
        type: "IIR (БИХ)",
        description: "Пропускает частоты ниже частоты среза и подавляет высокие частоты. Применяется в аудио для среза ВЧ шумов и сглаживания графиков.",
        imageUrl: imgLowPass
    },
    {
        id: 2,
        name: "ФВЧ (High-pass)",
        type: "FIR (КИХ)",
        description: "Пропускает частоты выше частоты среза. Широко используется для удаления постоянной составляющей (DC offset) из сигнала.",
        imageUrl: imgHighPass
    },
    {
        id: 3,
        name: "Полосовой (Band-pass)",
        type: "IIR (БИХ)",
        description: "Пропускает сигнал только в определенном диапазоне частот, подавляя всё, что выше и ниже. Используется в эквалайзерах и радиоприемниках.",
        imageUrl: imgBandPass
    },
    {
        id: 4,
        name: "Режекторный (Notch)",
        type: "FIR (КИХ)",
        description: "Подавляет сигнал в очень узком диапазоне частот (вырезает полосу). Идеален для удаления сетевой наводки (50 Гц или 60 Гц) из аудио.",
        imageUrl: imgNotch
    },
    {
        id: 5,
        name: "Скользящее среднее",
        type: "FIR (КИХ)",
        description: "Простейший фильтр нижних частот во временной области. Усредняет несколько соседних отсчетов. Отлично убирает случайный белый шум.",
        imageUrl: imgMovingAvg
    }
];