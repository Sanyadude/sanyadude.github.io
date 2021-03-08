const body = document.querySelector('body');
const pixelWorldContainer = document.querySelector('#pixel-world-container');

const infoContainer = document.querySelector('#material-info');
const fpsContainer = document.querySelector('#fps-info');

const controlsContainer = document.querySelector('#controls-container');

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

const spreadRadiusInput = document.querySelector('#spread');
const spawnInSquare = document.querySelector('#spawn-in-square');
const speedInput = document.querySelector('#speed');
const debugCheckbox = document.querySelector('#debug');
const scaleInput = document.querySelector('#scale');

const materialPicker = document.querySelector('#material-picker');
const materialPickerSpreadCanvas = document.querySelector('#material-picker-spread');

const textCanvas = document.querySelector('#pixel-text');
textCanvas.width = body.offsetWidth;
textCanvas.height = controlsContainer.offsetHeight + 8;

let scale = +scaleInput.value;
const onResize = () => {
    const recomendedMaxPixels = 100000;
    const recomendedMinScale = 4;
    scaleInput.value = Math.max(recomendedMinScale, Math.floor(Math.sqrt(window.innerWidth * window.innerHeight / recomendedMaxPixels)));
    scale = +scaleInput.value;
    const smallScreenMaxWidth = 1200;
    const hiddenElements = document.querySelectorAll('.small-hidden');
    if (window.innerWidth < smallScreenMaxWidth) {
        hiddenElements.forEach(el => el.classList.add('hidden'));
        controlsContainer.classList.add('small-screen');
        pixelWorldContainer.style.height = (window.innerHeight - controlsContainer.offsetHeight - 10) + 'px';
    } else {
        hiddenElements.forEach(el => el.classList.remove('hidden'));
        controlsContainer.classList.remove('small-screen');
        pixelWorldContainer.style.height = (window.innerHeight - textCanvas.height - 10) + 'px';
    }
}
onResize();

const textCanvasContext = textCanvas.getContext('2d');
const materialPack = MaterialsModule.MaterialsPack;
const colorsPerMat = materialPack.getMaxColors();
const materialProperies = materialPack.getMaterials();
const pixelWorld = new PixelsModule.PixelWorld(scale);

pixelWorld.init(pixelWorldContainer, materialPack);
pixelWorld.on('before-tick', () => {
    textCanvasContext.clearRect(0, 0, textCanvas.width, textCanvas.height);
    for (let i = 0; i < textPixels.length; i++) {
        const pixel = textPixels[i];
        textCanvasContext.fillStyle = pixel.color;
        textCanvasContext.fillRect(5 + pixel.x, 110 + pixel.y, pixel.w, pixel.h);
    }
});
const pixelCanvas = pixelWorld.context.canvas;
let prevData = [pixelWorld.toBase64()];
const saveDataFromPixelWorld = () => {
    prevData.push(pixelWorld.toBase64());
    if (prevData.length > 10)
        prevData.shift();
}

const undoData = () => {
    if (prevData.length <= 1)
        return;
    prevData.pop();
    const lastData = prevData.length - 1;
    pixelWorld.fromBase64(prevData[lastData]);
}

const dataIndexAttr = 'data-index';
let materials = (() => {
    const side = 40;
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
        matCanvas.setAttribute(dataIndexAttr, index);
        materialPicker.appendChild(matCanvas);
        const matContext = matCanvas.getContext('2d');
        for (let i = 0; i < side; i += scale) {
            for (let j = 0; j < side; j += scale) {
                matContext.fillStyle = element.colors[Math.floor(Math.random() * colorsPerMat)];
                matContext.fillRect(i, j, scale, scale);
            }
        }
    });

    return materials;
})();

const defaultMatIndex = 15;
let currentParticleIndex = 0;

let cursorX = 0;
let cursorY = 0;

let isSpreadMaterialEnabled = false;
let isRemoveMaterialEnabled = false;

let spreadRadius = +spreadRadiusInput.value;
let spreadInSquare = false;

let textPixels = [];

//draw pixels from text
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

const updateSpreadCanvas = (colors) => {
    const context = materialPickerSpreadCanvas.getContext('2d');
    const w = materialPickerSpreadCanvas.width;
    const h = materialPickerSpreadCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    context.clearRect(0, 0, w, h);
    for (let dx = -spreadRadius; dx <= spreadRadius; dx++) {
        for (let dy = -spreadRadius; dy <= spreadRadius; dy++) {
            if (!spreadInSquare && spreadRadius - 1 < Math.sqrt(dx * dx + dy * dy))
                continue;
            context.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            context.fillRect(cx + dx * scale, cy + dy * scale, scale, scale);
        }
    }
}

const updateInfo = () => {
    const text = `Material ${materials[currentParticleIndex].name}`;
    infoContainer.innerHTML = text + ` [spread ${spreadRadius}]`;
    const colors = materials[currentParticleIndex].colors;
    pixelsFromText(text, colors);
    updateSpreadCanvas(colors);
}

const changeMaterial = (prevIndex, index) => {
    const prevMaterial = document.querySelector(`[${dataIndexAttr}="${prevIndex}"]`);
    prevMaterial.classList.remove('active');
    const material = document.querySelector(`[${dataIndexAttr}="${index}"]`);
    material.classList.add('active');
    currentParticleIndex = index;
    typeSelect.value = index;
    updateInfo();
}

changeMaterial(currentParticleIndex, defaultMatIndex);

window.addEventListener('resize', onResize);

pixelCanvas.addEventListener('mousemove', (e) => {
    cursorX = e.offsetX;
    cursorY = e.offsetY;
});

pixelCanvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const touchTargetRect = document.elementFromPoint(touch.clientX, touch.clientY).getBoundingClientRect();
    cursorX = touch.clientX - touchTargetRect.x;
    cursorY = touch.clientY - touchTargetRect.y;
    e.preventDefault();
});

pixelCanvas.addEventListener('mousedown', (e) => {
    if (e.button === 0)
        isSpreadMaterialEnabled = true;
    if (e.button === 2)
        isRemoveMaterialEnabled = true;
});

pixelCanvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const touchTargetRect = document.elementFromPoint(touch.clientX, touch.clientY).getBoundingClientRect();
    cursorX = touch.clientX - touchTargetRect.x;
    cursorY = touch.clientY - touchTargetRect.y;
    isSpreadMaterialEnabled = true;
});

pixelCanvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

pixelCanvas.addEventListener('mouseup', (e) => {
    if (e.button === 0)
        isSpreadMaterialEnabled = false;
    if (e.button === 2)
        isRemoveMaterialEnabled = false;
    saveDataFromPixelWorld();
});

pixelCanvas.addEventListener('touchend', (e) => {
    isSpreadMaterialEnabled = false;
    saveDataFromPixelWorld();
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
    saveDataFromPixelWorld();
    pixelWorld.clear();
    saveDataFromPixelWorld();
});

undoButton.addEventListener('click', (e) => {
    undoData();
});

document.addEventListener('keyup', (e) => {
    //z key - 90
    if (e.keyCode === 90 && e.ctrlKey)
        undoData();
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
    saveDataFromPixelWorld();
    pixelWorld.loadFromLocalStorage();
});

spreadRadiusInput.addEventListener('change', (e) => {
    spreadRadius = +e.currentTarget.value;
    e.currentTarget.blur();
    updateInfo();
});

spawnInSquare.addEventListener('change', (e) => {
    spreadInSquare = e.currentTarget.checked;
    e.currentTarget.blur();
    updateInfo();
});

speedInput.addEventListener('change', (e) => {
    pixelWorld.setSlowRate(+e.currentTarget.value);
    e.currentTarget.blur();
});

debugCheckbox.addEventListener('change', (e) => {
    pixelWorld.toggleDebug(e.currentTarget.checked);
    e.currentTarget.blur();
});

scaleInput.addEventListener('change', (e) => {
    pixelWorld.setScale(+e.currentTarget.value);
    e.currentTarget.blur();
});

materialPicker.addEventListener('click', (e) => {
    if (e.target.hasAttribute(dataIndexAttr))
        changeMaterial(currentParticleIndex, +e.target.getAttribute(dataIndexAttr));
});

let prevF = 0;
const mainLoop = (f) => {
    const pos = pixelWorld.getPositionFromCoords(cursorX, cursorY);

    if (isSpreadMaterialEnabled) {
        if (spreadInSquare)
            pixelWorld.addFewInSquare(materials[currentParticleIndex].id, pos.row, pos.col, spreadRadius, 0.7);
        else
            pixelWorld.addFewInRadius(materials[currentParticleIndex].id, pos.row, pos.col, spreadRadius, 0.7);
    }
    if (isRemoveMaterialEnabled) {
        if (spreadInSquare)
            pixelWorld.removeFewInSquare(pos.row, pos.col, spreadRadius);
        else
            pixelWorld.removeFewInRadius(pos.row, pos.col, spreadRadius);
    }
    pixelWorld.tick();

    fpsContainer.innerHTML = `Pos:${pos.row},${pos.col}; fps: ${Math.round(1000 / (f - prevF))}`;
    prevF = f;
    requestAnimationFrame(mainLoop);
}
mainLoop();