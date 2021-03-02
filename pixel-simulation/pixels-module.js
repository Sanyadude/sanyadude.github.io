const PixelsModule = (() => {
    const DEBUG_COLOR = '#c101ff';
    const DEBUG_PIXEL_MAT_ID = 9999;

    const awakeAll = CoreModule.MovingOptions.awakeAllNeighbours;

    const fillGrid = (gridSize, expression) => {
        const filled = [];
        for (let i = 0; i <= gridSize.rows; i++) {
            filled.push([]);
            for (let j = 0; j <= gridSize.cols; j++) {
                filled[i].push(expression(i, j));
            }
        }
        return filled;
    }

    const executeOnGrid = (gridSize, expression) => {
        const filled = [];
        for (let i = 0; i <= gridSize.rows; i++) {
            filled.push([]);
            for (let j = 0; j <= gridSize.cols; j++) {
                expression(i, j);
            }
        }
    }

    const findClosestMatToRgb = (rgb, materials) => {
        let closestMat = null;
        let closestValue = Infinity;
        for (let i = 0; i < materials.length; i++) {
            const matColor = materials[i].rgbColor;
            if (!closestMat) {
                closestMat = materials[i];
                continue;
            }
            const value = Math.sqrt(Math.pow(rgb.r - matColor.r, 2) + Math.pow(rgb.g - matColor.g, 2) + Math.pow(rgb.b - matColor.b, 2));
            if (value < closestValue) {
                closestMat = materials[i];
                closestValue = value;
            }
        }
        return closestMat;
    }

    const imageToPositions = (img, pixelWorld, materials) => {
        const imgCanvas = document.createElement('canvas');
        const imgContext = imgCanvas.getContext('2d');
        imgCanvas.width = img.width;
        imgCanvas.height = img.height;
        imgContext.drawImage(img, 0, 0);

        const matColorsArray = [];
        for (const key in materials) {
            if (materials[key].specialBehavior)
                continue;
            matColorsArray.push(materials[key]);
        }

        const data = imgContext.getImageData(0, 0, img.width, img.height).data;
        const positions = [];
        const ratio = Math.max(Math.ceil(img.width / pixelWorld.gridSize.cols), Math.ceil(img.height / pixelWorld.gridSize.rows));
        for (let row = 0; row < pixelWorld.gridSize.rows; row++) {
            for (let col = 0; col < Math.floor(img.width / ratio); col++) {
                const i = (row * img.width + col) * ratio * 4;
                if (i > data.length)
                    break;
                if (data[i + 3] > 0) {
                    const matId = findClosestMatToRgb({ r: data[i], g: data[i + 1], b: data[i + 2] }, matColorsArray).id;
                    positions.push([matId, row, col]);
                }
            }
        }
        pixelWorld.restore(positions);
    };

    const imageDataUrlToPositions = (dataUrl, pixelWorld, materials) => {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => imageToPositions(img, pixelWorld, materials);
    }

    const imageDataUrlSaveToImage = (dataUrl, fileName) => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = fileName + '.png';
        body.appendChild(a);
        a.click();
        a.remove();
    }

    const textToTxtFile = (text, fileName) => {
        const file = new Blob([text], { type: 'txt' });
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName + '.txt';
        body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    const readFromFileAsText = (file, callback) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => callback(reader.result);
    }

    const readFromFileAsDataUrl = (file, callback) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => callback(reader.result);
    }

    const toBase64 = function (data) {
        const rawString = JSON.stringify(data);
        return btoa(rawString);
    }

    const fromBase64 = (encodedString) => {
        if (!encodedString)
            return;
        const rawString = atob(encodedString);
        if (!rawString)
            return;
        return JSON.parse(rawString);
    }

    const PixelWorld = function (scale) {
        const pixelWorld = {};

        let storageKey = 'PixelWorld.pixelPositions';
        let defaultSaveFileName = 'pixelWorld';

        let tickCounter = 0;
        let pixelsUpdated = 0;
        let pixelsRendered = 0;
        let erasedPixels = 0;

        let debugActivity = false;

        let pixelScale = scale || 10;

        let paused = false;
        let slowRate = 1;

        let containerElement = null;
        pixelWorld.context = null;
        pixelWorld.min = null;
        pixelWorld.max = null
        pixelWorld.gridSize = null;

        pixelWorld.pixelsArray = [];
        pixelWorld.renderedPixels = [];
        pixelWorld.pixelsColors = [];

        let callbacks = { 'before-tick': null };

        let materialPackage = null;
        const pixelFactory = new CoreModule.PixelFactory;

        pixelWorld.init = function (element, materialPack) {
            containerElement = element;
            materialPackage = materialPack;
            const canvas = document.createElement('canvas');
            canvas.width = element.offsetWidth;
            canvas.height = element.offsetHeight;
            element.appendChild(canvas);
            this.context = canvas.getContext('2d');
            this.min = { x: 1, y: 1 };
            this.max = {
                x: Math.floor(canvas.width / pixelScale) - 1,
                y: Math.floor(canvas.height / pixelScale) - 1
            };
            this.gridSize = {
                rows: this.max.y - this.min.y,
                cols: this.max.x - this.min.x
            }
            this.clear();
        }

        pixelWorld.clear = function () {
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            this.pixelsArray = fillGrid(this.gridSize, () => null);
            this.renderedPixels = fillGrid(this.gridSize, () => 0);
            this.pixelsColors = fillGrid(this.gridSize, () => Math.floor(Math.random() * materialPackage.getMaxColors()));
            this.drawContextBounds();
        }

        pixelWorld.setSlowRate = (value) => slowRate = value;
        pixelWorld.start = () => paused = false;
        pixelWorld.stop = () => paused = true;
        pixelWorld.toggleDebug = (forceState) => debugActivity = forceState ? forceState : !debugActivity;
        pixelWorld.on = (name, callback) => callbacks[name] = callback;
        pixelWorld.off = (name) => delete callbacks[name];
        pixelWorld.trigger = function (name) {
            if (typeof callbacks[name] == 'function')
                callbacks[name](this);
        }

        pixelWorld.getPositionFromCoords = function (x, y) {
            return {
                row: Math.floor(y / pixelScale) - this.min.y,
                col: Math.floor(x / pixelScale) - this.min.x
            }
        }

        pixelWorld.getCount = function (condition) {
            let count = 0;
            for (let row = 0; row < this.pixelsArray.length; row++) {
                for (let col = 0; col < this.pixelsArray[row].length; col++) {
                    if (this.pixelsArray[row][col] == null)
                        continue;
                    if (typeof condition !== 'function') {
                        count++;
                        continue;
                    } else if (condition(this.pixelsArray[row][col]))
                        count++;
                }
            }
            return count;
        }

        pixelWorld.getMatPositions = function () {
            const positions = [];
            for (let row = 0; row < this.pixelsArray.length; row++) {
                for (let col = 0; col < this.pixelsArray[row].length; col++) {
                    if (this.pixelsArray[row][col] != null)
                        positions.push([this.pixelsArray[row][col].matId, row, col]);
                }
            }
            return positions;
        }

        pixelWorld.toImage = function () {
            const imageData = this.context.canvas.toDataURL('image/png');
            imageDataUrlSaveToImage(imageData, defaultSaveFileName);
        }

        pixelWorld.saveToLocalStorage = function () {
            localStorage.setItem(storageKey, JSON.stringify(this.getMatPositions()));
        }

        pixelWorld.loadFromLocalStorage = function () {
            const positions = JSON.parse(localStorage.getItem(storageKey));
            this.restore(positions);
        }

        pixelWorld.toFile = function () {
            textToTxtFile(this.toBase64(), defaultSaveFileName);
        }

        pixelWorld.fromFile = function (file) {
            if (file.constructor !== File)
                return;
            if (file.type == 'text/plain') {
                readFromFileAsText(file, (result) => this.fromBase64(result));
            } else if (file.type == 'image/png' || file.type == 'image/jpeg') {
                readFromFileAsDataUrl(file, (result) => imageDataUrlToPositions(result, this, materialPack.getMaterials()));
            }
        }

        pixelWorld.toBase64 = function () {
            return toBase64(this.getMatPositions());
        }

        pixelWorld.fromBase64 = function (encodedString) {
            const positions = fromBase64(encodedString);
            this.restore(positions);
        }

        pixelWorld.restore = function (positions) {
            if (positions.constructor !== Array)
                return;
            this.clear();
            positions.forEach(pos => this.add(pos[0], pos[1], pos[2]));
        }

        pixelWorld.add = function (id, row, col) {
            if (this.pixelsArray[row] !== undefined
                && this.pixelsArray[row][col] !== undefined
                && this.pixelsArray[row][col] == null) {
                this.pixelsArray[row][col] = pixelFactory.create(id);
                this.renderedPixels[row][col] = id;
                this.drawContextPixel(col, row, materialPackage.getMatColor(id, this.pixelsColors[row][col]));
            }
        }

        pixelWorld.addFewInSquare = function (id, row, col, side, chance) {
            for (let dRow = -side; dRow <= side; dRow++) {
                for (let dCol = -side; dCol <= side; dCol++) {
                    if (Math.random() < chance)
                        continue;
                    this.add(id, row + dRow, col + dCol);
                }
            }
        }

        pixelWorld.addFewInRadius = function (id, row, col, radius, chance) {
            for (let dRow = -radius; dRow <= radius; dRow++) {
                for (let dCol = -radius; dCol <= radius; dCol++) {
                    if (radius - 1 < Math.sqrt(dRow * dRow + dCol * dCol) || (radius > 1 && Math.random() < chance))
                        continue;
                    this.add(id, row + dRow, col + dCol);
                }
            }
        }

        pixelWorld.remove = function (row, col) {
            if (this.pixelsArray[row] !== undefined
                && this.pixelsArray[row][col] !== undefined) {
                this.pixelsArray[row][col] = null;
                this.renderedPixels[row][col] = 0;
                this.clearContextPixel(col, row);
                awakeAll(row, col, this.pixelsArray);
            }
        }

        pixelWorld.removeFewInRadius = function (row, col, radius) {
            for (let dRow = -radius; dRow <= radius; dRow++) {
                for (let dCol = -radius; dCol <= radius; dCol++) {
                    if (radius < Math.sqrt(dRow * dRow + dCol * dCol))
                        continue;
                    this.remove(row + dRow, col + dCol);
                }
            }
        }

        pixelWorld.removeFewInSquare = function (row, col, side) {
            for (let dRow = -side; dRow <= side; dRow++) {
                for (let dCol = -side; dCol <= side; dCol++) {
                    this.remove(row + dRow, col + dCol);
                }
            }
        }

        pixelWorld.tick = function () {
            this.trigger('before-tick');
            if (paused)
                return;
            tickCounter++;
            if (tickCounter % slowRate !== 0)
                return;
            this.update();
            this.draw();
        }

        pixelWorld.update = function () {
            pixelsUpdated = 0;
            executeOnGrid(this.gridSize, (row, col) => {
                if (this.pixelsArray[row][col] == null)
                    return;
                this.pixelsArray[row][col].updated = false;
                this.pixelsArray[row][col].prevSleeping = this.pixelsArray[row][col].sleeping;
            });
            for (let row = this.pixelsArray.length - 1; row >= 0; row--) {
                if (row % 2 == 0) {
                    for (let col = this.pixelsArray[row].length - 1; col >= 0; col--) {
                        this.updatePixel(row, col);
                    }
                } else {
                    for (let col = 0; col < this.pixelsArray[row].length; col++) {
                        this.updatePixel(row, col);
                    }
                }
            }
        }

        pixelWorld.updatePixel = function (row, col) {
            const pixel = this.pixelsArray[row][col];
            if (pixel == null)
                return;
            pixel.lifeTime++;
            if (materialPackage.update(pixel, row, col, this.pixelsArray, tickCounter))
                pixelsUpdated++;
        }

        pixelWorld.draw = function () {
            pixelsRendered = 0;
            erasedPixels = 0;
            for (let row = 0; row < this.pixelsArray.length; row++) {
                for (let col = 0; col < this.pixelsArray[row].length; col++)
                    this.drawPixel(row, col);
            }
            this.drawContextBounds();
        }

        pixelWorld.drawPixel = function (row, col) {
            const pixel = this.pixelsArray[row][col];
            if (pixel != null) {
                const matId = pixel.matId;
                if (this.renderedPixels[row][col] == matId)
                    return;
                if (!pixel.sleeping || (pixel.sleeping && !pixel.prevSleeping)) {
                    const drawDebugPixel = !pixel.sleeping && debugActivity;
                    this.renderedPixels[row][col] = drawDebugPixel ? DEBUG_PIXEL_MAT_ID : matId;
                    pixelsRendered++;
                    const color = drawDebugPixel ? DEBUG_COLOR : materialPackage.getMatColor(matId, this.pixelsColors[row][col]);
                    this.drawContextPixel(col, row, color);
                }
            } else if (this.renderedPixels[row][col] != 0) {
                erasedPixels++;
                this.renderedPixels[row][col] = 0;
                this.clearContextPixel(col, row);
            }
        }

        pixelWorld.drawContextPixel = function (x, y, color) {
            this.context.fillStyle = color;
            this.context.fillRect((this.min.x + x) * pixelScale, (this.min.y + y) * pixelScale, pixelScale, pixelScale);
        }

        pixelWorld.clearContextPixel = function (x, y) {
            this.context.clearRect((this.min.x + x) * pixelScale, (this.min.y + y) * pixelScale, pixelScale, pixelScale);
        }

        pixelWorld.drawContextBounds = function () {
            this.context.strokeStyle = '#000';
            this.context.strokeRect(this.min.x * pixelScale, this.min.y * pixelScale, (this.max.x - this.min.x + 1) * pixelScale, (this.max.y - this.min.y + 1) * pixelScale);
        }

        return pixelWorld;
    }

    return {
        PixelWorld: PixelWorld
    };
})();