const PixelsModule = (() => {
    const COLORS_PER_MAT = 7;
    const DEBUG_COLOR = '#c101ff';

    const awakeNeighbours = (x, y, sleep) => {
        if (sleep[x - 1]) {
            if (sleep[x - 1][y - 1] !== undefined)
                sleep[x - 1][y - 1] = 0;
            sleep[x - 1][y] = 0;
            if (sleep[x - 1][y + 1] !== undefined)
                sleep[x - 1][y + 1] = 0;
        }
        if (sleep[x]) {
            if (sleep[x][y - 1] !== undefined)
                sleep[x][y - 1] = 0;
            sleep[x][y] = 0;
            if (sleep[x][y + 1] !== undefined)
                sleep[x][y + 1] = 0;
        }
        if (sleep[x + 1]) {
            if (sleep[x + 1][y - 1] !== undefined)
                sleep[x + 1][y - 1] = 0;
            sleep[x + 1][y] = 0;
            if (sleep[x + 1][y + 1] !== undefined)
                sleep[x + 1][y + 1] = 0;
        }
    }

    const fillArray = (rows, cols, expression) => {
        const filled = [];
        for (let i = 0; i <= rows; i++) {
            filled.push([]);
            for (let j = 0; j <= cols; j++) {
                filled[i].push(expression(i, j));
            }
        }
        return filled;
    }

    const PixelWorld = function (scale, min, max, maxCount) {
        const pixelWorld = {};

        let storageKey = 'PixelWorld.pixelPositions';
        let defaultSaveFileName = 'pixelWorld_img';

        let tickCounter = 0;
        let pixelsUpdated = 0;
        let pixelsRendered = 0;
        let erasedPixels = 0;

        let debugActivity = false;

        let pixelScale = scale || 10;
        let maxPixels = maxCount || Infinity;

        let paused = false;

        let containerElement = null;
        pixelWorld.context = null;
        pixelWorld.min = null;
        pixelWorld.max = null
        pixelWorld.arrayCells = null;

        pixelWorld.pixelsArray = null;
        pixelWorld.renderedPixels = null;
        pixelWorld.pixelsColors = null;
        pixelWorld.pixelsModified = null;
        pixelWorld.pixelsSleeping = null;
        pixelWorld.pixelsPrevTickSleeping = null;

        let callbacks = { 'before-tick': null };

        pixelWorld.materials = null;

        pixelWorld.init = function (element, materials) {
            containerElement = element;
            this.materials = materials;
            const canvas = document.createElement('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            element.appendChild(canvas);
            this.context = canvas.getContext('2d');
            this.min = min || { x: 1, y: 1 };
            this.max = max || {
                x: Math.floor(canvas.width / pixelScale) - 1,
                y: Math.floor(canvas.height / pixelScale) - 1
            };
            this.arrayCells = {
                rows: this.max.y - this.min.y,
                cols: this.max.x - this.min.x
            }
            this.clear();
        }

        pixelWorld.clear = function () {
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            this.pixelsArray = fillArray(this.arrayCells.rows, this.arrayCells.cols, () => 0);
            this.renderedPixels = fillArray(this.arrayCells.rows, this.arrayCells.cols, () => 0);
            this.pixelsColors = fillArray(this.arrayCells.rows, this.arrayCells.cols, () => Math.floor(Math.random() * COLORS_PER_MAT));
            this.pixelsModified = fillArray(this.arrayCells.rows, this.arrayCells.cols, () => 0);
            this.pixelsSleeping = fillArray(this.arrayCells.rows, this.arrayCells.cols, () => 0);
            this.pixelsPrevTickSleeping = fillArray(this.arrayCells.rows, this.arrayCells.cols, () => 0);
            this.drawBounds();
        }

        pixelWorld.start = () => paused = false;
        pixelWorld.stop = () => paused = true;
        pixelWorld.toggleDebug = (forceState) => debugActivity = forceState ? forceState : !debugActivity;
        pixelWorld.on = (name, callback) => callbacks[name] = callback;
        pixelWorld.off = (name) => delete callbacks[name];
        pixelWorld.trigger = function (name) {
            if (typeof callbacks[name] === 'function')
                callbacks[name](this);
        }

        pixelWorld.getPositionFromCoords = function (x, y) {
            return {
                row: Math.floor(y / pixelScale) - this.min.y,
                col: Math.floor(x / pixelScale) - this.min.x
            }
        }

        pixelWorld.getCount = function () {
            let count = 0;
            for (let row = 0; row < this.pixelsArray.length; row++) {
                for (let col = 0; col < this.pixelsArray[row].length; col++) {
                    if (this.pixelsArray[row][col] !== 0)
                        count++;
                }
            }
            return count;
        }

        pixelWorld.saveAsImage = function () {
            const imageData = this.context.canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = imageData;
            a.download = defaultSaveFileName + '.png';
            containerElement.appendChild(a);
            a.click();
            a.remove();
        }

        pixelWorld.getMatPositions = function () {
            const positions = [];
            for (let row = 0; row < this.pixelsArray.length; row++) {
                for (let col = 0; col < this.pixelsArray[row].length; col++) {
                    if (this.pixelsArray[row][col] !== 0)
                        positions.push([this.pixelsArray[row][col], row, col]);
                }
            }
            return positions;
        }

        pixelWorld.saveToLocalStorage = function () {
            localStorage.setItem(storageKey, JSON.stringify(this.getMatPositions()));
        }

        pixelWorld.restoreFromLocalStorage = function () {
            const positions = JSON.parse(localStorage.getItem(storageKey));
            this.restore(positions);
        }

        pixelWorld.saveAsBase64 = function () {
            const positionsStr = JSON.stringify(this.getMatPositions());
            return btoa(positionsStr);
        }

        pixelWorld.restoreFromBase64 = function (encodedString) {
            const rawString = atob(encodedString);
            if (!rawString)
                return;
            const positions = JSON.parse(rawString);
            this.restore(positions);
        }

        pixelWorld.restore = function (positions) {
            if (!positions)
                return;
            if (positions.constructor === Array) {
                this.clear();
                positions.forEach(pos => this.add(pos[0], pos[1], pos[2]));
            }
        }

        pixelWorld.add = function (id, row, col) {
            if (this.pixelsArray[row] !== undefined
                && this.pixelsArray[row][col] !== undefined
                && this.pixelsArray[row][col] === 0) {
                this.pixelsArray[row][col] = id;
                this.renderedPixels[row][col] = 1;
                this.drawParticleMain(col, row, this.materials[id].colors[this.pixelsColors[row][col]]);
            }
        }

        pixelWorld.addFew = function (id, row, col, spread, amount) {
            for (let i = 0; i < amount; i++) {
                const dRow = Math.floor(Math.random() * spread) * ((Math.random() < 0.5) ? 1 : -1);
                const dCol = Math.floor(Math.random() * spread) * ((Math.random() < 0.5) ? 1 : -1);
                this.add(id, row + dRow, col + dCol);
            }
        }

        pixelWorld.remove = function (row, col) {
            if (this.pixelsArray[row] !== undefined
                && this.pixelsArray[row][col] !== undefined) {
                this.pixelsArray[row][col] = 0;
                awakeNeighbours(row, col, this.pixelsSleeping);
                this.renderedPixels[row][col] = 0;
                this.clearMain(col, row);
            }
        }

        pixelWorld.removeFew = function (row, col, spread, amount) {
            for (let i = 0; i < amount; i++) {
                const dRow = Math.floor(Math.random() * spread) * ((Math.random() < 0.5) ? 1 : -1);
                const dCol = Math.floor(Math.random() * spread) * ((Math.random() < 0.5) ? 1 : -1);
                this.remove(row + dRow, col + dCol);
            }
        }

        pixelWorld.tick = function () {
            this.trigger('before-tick');
            if (paused)
                return;
            tickCounter++;
            this.update();
            this.draw();
            this.pixelsPrevTickSleeping = fillArray(this.arrayCells.rows, this.arrayCells.cols, (row, col) => this.pixelsSleeping[row][col]);
        }

        pixelWorld.update = function () {
            pixelsUpdated = 0;
            this.pixelsModified = fillArray(this.arrayCells.rows, this.arrayCells.cols, () => 0);
            for (let row = this.pixelsArray.length - 1; row >= 0; row--) {
                if (row % 2 === 0) {
                    for (let col = this.pixelsArray[row].length - 1; col >= 0; col--)
                        this.updateParticle(row, col);
                } else {
                    for (let col = 0; col < this.pixelsArray[row].length; col++)
                        this.updateParticle(row, col);
                }
            }
        }

        pixelWorld.updateParticle = function (row, col) {
            const id = this.pixelsArray[row][col];
            if (!id)
                return;
            if (this.pixelsModified[row][col] === 0 && this.pixelsSleeping[row][col] === 0) {
                if (tickCounter % this.materials[id].updateFrequency === 0) {
                    const wasUpdated = this.materials[id].update(row, col, this.pixelsArray, this.pixelsModified);
                    if (wasUpdated === true)
                        awakeNeighbours(row, col, this.pixelsSleeping);
                    else if (wasUpdated === false)
                        this.pixelsSleeping[row][col] = 1;
                }
                pixelsUpdated++;
            }
        }

        pixelWorld.draw = function () {
            pixelsRendered = 0;
            erasedPixels = 0;
            for (let row = 0; row < this.pixelsArray.length; row++) {
                for (let col = 0; col < this.pixelsArray[row].length; col++)
                    this.drawParticle(row, col);
            }
            this.drawBounds();
        }

        pixelWorld.drawParticle = function (row, col) {
            const id = this.pixelsArray[row][col];
            if (id !== 0) {
                if (this.pixelsSleeping[row][col] === 0) {
                    this.renderedPixels[row][col] = 1;
                    pixelsRendered++;
                    this.drawParticleMain(col, row, debugActivity ? DEBUG_COLOR : this.materials[id].colors[this.pixelsColors[row][col]]);
                } else if (this.pixelsSleeping[row][col] === 1 && this.pixelsPrevTickSleeping[row][col] === 0) {
                    this.renderedPixels[row][col] = 1;
                    pixelsRendered++;
                    this.drawParticleMain(col, row, this.materials[id].colors[this.pixelsColors[row][col]]);
                }
            } else if (this.renderedPixels[row][col] === 1 && id === 0) {
                erasedPixels++;
                this.renderedPixels[row][col] = 0;
                this.clearMain(col, row);
            }
        }

        pixelWorld.drawParticleMain = function (x, y, color) {
            this.context.fillStyle = color;
            this.context.fillRect((this.min.x + x) * pixelScale, (this.min.y + y) * pixelScale, pixelScale, pixelScale);
        }

        pixelWorld.clearMain = function (x, y) {
            this.context.clearRect((this.min.x + x) * pixelScale, (this.min.y + y) * pixelScale, pixelScale, pixelScale);
        }

        pixelWorld.drawBounds = function () {
            this.context.strokeStyle = '#000';
            this.context.strokeRect(this.min.x * pixelScale, this.min.y * pixelScale, (this.max.x - this.min.x + 1) * pixelScale, (this.max.y - this.min.y + 1) * pixelScale);
        }

        return pixelWorld;
    }

    return {
        PixelWorld: PixelWorld
    };
})();