const infoContainer = document.querySelector('#info');
const fpsContainer = document.querySelector('#fps');
const spreadInput = document.querySelector('#spread-value');
const amountInput = document.querySelector('#amount-value');
const typeSelect = document.querySelector('#type');
const debugCheck = document.querySelector('#debug');
const resetButton = document.querySelector('#reset');
const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');
const saveButton = document.querySelector('#save');
const matPicker = document.querySelector('#mat-picker');

const scale = 4;
const min = { x: 1, y: 40 };
const max = { x: Math.floor(window.innerWidth / scale) - 30, y: Math.floor(window.innerHeight / scale) - 1 };

const textCanvas = document.querySelector('#text');
textCanvas.width = window.innerWidth;
textCanvas.height = scale * min.y;
const textCanvasContext = textCanvas.getContext('2d');

const particles = new ParticlesModule.Particles(scale, min, max);
particles.init(document.querySelector('body'));
particles.on('before-draw', () => {
    textCanvasContext.clearRect(0, 0, textCanvas.width, textCanvas.height);
    for (let i = 0; i < pixels.length; i++) {
        const pixel = pixels[i];
        textCanvasContext.fillStyle = pixel.color;
        textCanvasContext.fillRect(pixel.x, pixel.y, pixel.w, pixel.h);
    }
});
const canvas = particles.context.canvas;

let particleTypes = (() => {
    const side = 50;
    const particles = [];
    for (const key in ParticlesModule.ParticleProps) {
        particles.push(ParticlesModule.ParticleProps[key]);
    }
    particles.sort((a, b) => a.name > b.name ? 1 : -1);
    particles.forEach((element, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.innerText = `Material ${element.name}`;
        typeSelect.appendChild(option);
        const matCanvas = document.createElement('canvas');
        matCanvas.width = side;
        matCanvas.height = side;
        matCanvas.setAttribute('data-index', index);
        matPicker.appendChild(matCanvas);
        const matContext = matCanvas.getContext('2d');
        for (let i = 0; i < side; i += scale) {
            for (let j = 0; j < side; j += scale) {
                matContext.fillStyle = element.colors[Math.floor(Math.random() * 4)];
                matContext.fillRect(i, j, scale, scale);
            }
        }
    });

    return particles;
})();

let currentParticleIndex = 0;

let cursorX = 0;
let cursorY = 0;

let isLeftMouseButtonPressed = false;
let isRightMouseButtonPressed = false;

let spawnedAmount = +amountInput.value;
let spawnSpread = +spreadInput.value;

//draw pixels from text
let pixels = [];
const pixelsFromText = function (text, colors) {
    const w = textCanvas.width;
    const h = textCanvas.height;
    textCanvasContext.clearRect(0, 0, w, h);
    textCanvasContext.font = '14px arial';
    const paddingTop = 10;
    textCanvasContext.fillText(text.toUpperCase(), 0, paddingTop);

    const side = 2;
    pixels = [];
    const data32 = new Uint32Array(textCanvasContext.getImageData(0, 0, w, paddingTop).data.buffer);
    for (let i = 0; i < data32.length; i++) {
        if (data32[i] & 0xff000000) {
            pixels.push({
                x: (i % w) * side + side,
                y: ((i / w) | 0) * side + side,
                w: side,
                h: side,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }
    textCanvasContext.clearRect(0, 0, w, h);
    return pixels;
}

const updateInfo = () => {
    const text = `Particle - ${particleTypes[currentParticleIndex].name} - a${spawnedAmount} - s${spawnSpread}`;
    infoContainer.innerHTML = text;
    const colors = particleTypes[currentParticleIndex].colors;
    pixelsFromText(text, colors);
}

const changeMaterial = (prevIndex, index) => {
    const prevMaterial = document.querySelector(`[data-index="${prevIndex}"]`);
    prevMaterial.className = '';
    const material = document.querySelector(`[data-index="${index}"]`);
    material.className = 'active';
    currentParticleIndex = index;
    typeSelect.value = index;
    updateInfo();
}
changeMaterial(currentParticleIndex, currentParticleIndex);

canvas.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
});

canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0)
        isLeftMouseButtonPressed = true;
    if (e.button === 2)
        isRightMouseButtonPressed = true;
});

canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

canvas.addEventListener('mouseup', (e) => {
    if (e.button === 0)
        isLeftMouseButtonPressed = false;
    if (e.button === 2)
        isRightMouseButtonPressed = false;
});

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (event.deltaY > 0) {
        const newIndex = currentParticleIndex + 1;
        const maxIndex = particleTypes.length - 1;
        changeMaterial(currentParticleIndex, newIndex <= maxIndex ? newIndex : 0);
    } else {
        const newIndex = currentParticleIndex - 1;
        const maxIndex = particleTypes.length - 1;
        changeMaterial(currentParticleIndex, newIndex >= 0 ? newIndex : maxIndex);
    }
});

spreadInput.addEventListener('change', (e) => {
    spawnSpread = +e.currentTarget.value;
    updateInfo();
});

amountInput.addEventListener('change', (e) => {
    spawnedAmount = +e.currentTarget.value;
    updateInfo();
});

debugCheck.addEventListener('change', (e) => {
    particles.debugMoving = e.currentTarget.checked;
});

typeSelect.addEventListener('change', (e) => {
    changeMaterial(currentParticleIndex, +e.currentTarget.value);
});

resetButton.addEventListener('click', (e) => {
    particles.clear();
});

startButton.addEventListener('click', (e) => {
    particles.start();
});

stopButton.addEventListener('click', (e) => {
    particles.stop();
});

saveButton.addEventListener('click', (e) => {
    particles.saveImage();
});

matPicker.addEventListener('click', (e) => {
    changeMaterial(currentParticleIndex, +e.target.getAttribute('data-index'));
})

let prevF = 0;
const mainLoop = (f) => {
    const pos = particles.getPositionFromCoords(cursorX, cursorY);
    if (isLeftMouseButtonPressed) {
        particles.addFew(particleTypes[currentParticleIndex].id, pos.x, pos.y, spawnSpread, spawnedAmount);
    }
    if (isRightMouseButtonPressed) {
        particles.removeFew(pos.x, pos.y, spawnSpread, spawnedAmount);
    }
    particles.tick();

    fpsContainer.innerHTML = `fps: ${Math.round(1000 / (f - prevF))}`;
    prevF = f;
    requestAnimationFrame(mainLoop);
}
mainLoop();