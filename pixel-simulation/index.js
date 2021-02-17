const body = document.querySelector('body');

const infoContainer = document.querySelector('#material-info');
const fpsContainer = document.querySelector('#fps-info');

const importFromFileInput = document.querySelector('#import-from-file');
const exportToFileButton = document.querySelector('#export-to-file');
const exportToImgButton = document.querySelector('#export-to-img');
const saveButton = document.querySelector('#save-to-local-storage');
const loadButton = document.querySelector('#load-from-local-storage');

const clearButton = document.querySelector('#clear');
const undoButton = document.querySelector('#undo');
const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');
const typeSelect = document.querySelector('#type');

const spreadInput = document.querySelector('#spread');
const amountInput = document.querySelector('#amount');
const debugCheckbox = document.querySelector('#debug');

const materialPicker = document.querySelector('#material-picker');

const textCanvas = document.querySelector('#pixel-text');

const scale = 4;
const min = { x: 1, y: 40 };
const max = { x: Math.floor(window.innerWidth / scale) - 2, y: Math.floor(window.innerHeight / scale) - 2 };

textCanvas.width = window.innerWidth;
textCanvas.height = scale * min.y;
const textCanvasContext = textCanvas.getContext('2d');

const materialProperies = new MaterialsModule.Materials();
const pixelWorld = new PixelsModule.PixelWorld(scale, min, max);
pixelWorld.init(body, materialProperies);
pixelWorld.on('before-tick', () => {
    textCanvasContext.clearRect(0, 0, textCanvas.width, textCanvas.height);
    for (let i = 0; i < textPixels.length; i++) {
        const pixel = textPixels[i];
        textCanvasContext.fillStyle = pixel.color;
        textCanvasContext.fillRect(10 + pixel.x, 120 + pixel.y, pixel.w, pixel.h);
    }
});
const pixelCanvas = pixelWorld.context.canvas;
let prevData = [pixelWorld.toBase64()];

let materials = (() => {
    const side = 50;
    const materials = [];
    for (const key in materialProperies) {
        materials.push(materialProperies[key]);
    }
    materials.sort((a, b) => a.name > b.name ? 1 : -1);
    materials.forEach((element, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.innerText = `Material [${element.name}]`;
        typeSelect.appendChild(option);
        const matCanvas = document.createElement('canvas');
        matCanvas.width = side;
        matCanvas.height = side;
        matCanvas.title = element.name;
        matCanvas.setAttribute('data-index', index);
        materialPicker.appendChild(matCanvas);
        const matContext = matCanvas.getContext('2d');
        for (let i = 0; i < side; i += scale) {
            for (let j = 0; j < side; j += scale) {
                matContext.fillStyle = element.colors[Math.floor(Math.random() * 7)];
                matContext.fillRect(i, j, scale, scale);
            }
        }
    });

    return materials;
})();

let currentParticleIndex = 0;

let cursorX = 0;
let cursorY = 0;

let isLeftMouseButtonPressed = false;
let isRightMouseButtonPressed = false;

let spawnedAmount = +amountInput.value;
let spawnSpread = +spreadInput.value;

//draw pixels from text
let textPixels = [];
const pixelsFromText = function (text, colors) {
    const w = textCanvas.width;
    const h = textCanvas.height;
    textCanvasContext.clearRect(0, 0, w, h);
    textCanvasContext.font = '14px arial';
    const paddingTop = 10;
    textCanvasContext.fillText(text.toUpperCase(), 0, paddingTop);
    const side = 2;
    textPixels = [];
    const data32 = new Uint32Array(textCanvasContext.getImageData(0, 0, w, paddingTop).data.buffer);
    for (let i = 0; i < data32.length; i++) {
        if (data32[i] & 0xff000000) {
            textPixels.push({
                x: (i % w) * side + side,
                y: ((i / w) | 0) * side + side,
                w: side,
                h: side,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }
    textCanvasContext.clearRect(0, 0, w, h);
}

const updateInfo = () => {
    const text = `Material ${materials[currentParticleIndex].name}`;
    infoContainer.innerHTML = text + ` [amount ${spawnedAmount}, spread ${spawnSpread}]`;
    const colors = materials[currentParticleIndex].colors;
    pixelsFromText(text, colors);
}

const changeMaterial = (prevIndex, index) => {
    const prevMaterial = document.querySelector(`[data-index="${prevIndex}"]`);
    prevMaterial.classList.remove('active');
    const material = document.querySelector(`[data-index="${index}"]`);
    material.classList.add('active');
    currentParticleIndex = index;
    typeSelect.value = index;
    updateInfo();
}
const defaultMatIndex = 8;
changeMaterial(currentParticleIndex, defaultMatIndex);

pixelCanvas.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
});

pixelCanvas.addEventListener('mousedown', (e) => {
    if (e.button === 0)
        isLeftMouseButtonPressed = true;
    if (e.button === 2)
        isRightMouseButtonPressed = true;
});

pixelCanvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

pixelCanvas.addEventListener('mouseup', (e) => {
    if (e.button === 0)
        isLeftMouseButtonPressed = false;
    if (e.button === 2)
        isRightMouseButtonPressed = false;
    prevData.push(pixelWorld.toBase64());
    if (prevData.length > 10)
        prevData.shift();
});

pixelCanvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (event.deltaY > 0) {
        const newIndex = currentParticleIndex + 1;
        const maxIndex = materials.length - 1;
        changeMaterial(currentParticleIndex, newIndex <= maxIndex ? newIndex : 0);
    } else {
        const newIndex = currentParticleIndex - 1;
        const maxIndex = materials.length - 1;
        changeMaterial(currentParticleIndex, newIndex >= 0 ? newIndex : maxIndex);
    }
});

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    pixelCanvas.addEventListener(eventName, (e) => {
        e.preventDefault()
        e.stopPropagation()
    });
});

pixelCanvas.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    pixelWorld.fromFile(file);
});

clearButton.addEventListener('click', (e) => {
    pixelWorld.clear();
});

undoButton.addEventListener('click', (e) => {
    if (prevData.length <= 1)
        return;
    prevData.pop();
    const lastData = prevData.length - 1;
    pixelWorld.fromBase64(prevData[lastData]);
});

startButton.addEventListener('click', (e) => {
    startButton.classList.add('active');
    stopButton.classList.remove('active');
    pixelWorld.start();
});

stopButton.addEventListener('click', (e) => {
    startButton.classList.remove('active');
    stopButton.classList.add('active');
    pixelWorld.stop();
});

typeSelect.addEventListener('change', (e) => {
    changeMaterial(currentParticleIndex, +e.currentTarget.value);
});

importFromFileInput.addEventListener('change', (event) => {
    const file = importFromFileInput.files[0];
    pixelWorld.fromFile(file);
    importFromFileInput.value = '';
});

exportToImgButton.addEventListener('click', (e) => {
    pixelWorld.toImage();
});

exportToFileButton.addEventListener('click', (e) => {
    pixelWorld.toFile();
});

saveButton.addEventListener('click', (e) => {
    pixelWorld.saveToLocalStorage();
});

loadButton.addEventListener('click', (e) => {
    pixelWorld.loadFromLocalStorage();
});

spreadInput.addEventListener('change', (e) => {
    spawnSpread = +e.currentTarget.value;
    updateInfo();
});

amountInput.addEventListener('change', (e) => {
    spawnedAmount = +e.currentTarget.value;
    updateInfo();
});

debugCheckbox.addEventListener('change', (e) => {
    pixelWorld.toggleDebug(e.currentTarget.checked);
});

materialPicker.addEventListener('click', (e) => {
    changeMaterial(currentParticleIndex, +e.target.getAttribute('data-index'));
});

let prevF = 0;
const mainLoop = (f) => {
    if (isLeftMouseButtonPressed) {
        const pos = pixelWorld.getPositionFromCoords(cursorX, cursorY);
        pixelWorld.addFew(materials[currentParticleIndex].id, pos.row, pos.col, spawnSpread, spawnedAmount);
    }
    if (isRightMouseButtonPressed) {
        const pos = pixelWorld.getPositionFromCoords(cursorX, cursorY);
        pixelWorld.removeFew(pos.row, pos.col, spawnSpread, spawnedAmount);
    }
    pixelWorld.tick();

    fpsContainer.innerHTML = `fps: ${Math.round(1000 / (f - prevF))}`;
    prevF = f;
    requestAnimationFrame(mainLoop);
}
mainLoop();