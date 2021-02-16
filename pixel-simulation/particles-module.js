const PixelsModule = (() => {
    const COLORS_PER_MAT = 4;
    const DEBUG_COLOR = '#c101ff';

    const EMTY_SPACE = 0;
    const ROCK_MAT = 10;
    const WOOD_MAT = 11;
    const METAL_MAT = 12;
    const GLASS_MAT = 13;
    const ICE_MAT = 14;
    const WATER_MAT = 15;
    const SAND_MAT = 20;
    const SNOW_MAT = 21;
    const FIRE_MAT = 30;
    const SMOKE_MAT = 40;
    const STEAM_MAT = 41;
    const ACID_MAT = 50;
    const LAVA_MAT = 51;
    const PLANT_MAT = 60;

    //dx, dy
    const directions = {
        topLeft: [-1, -1], top: [-1, 0], topRight: [-1, 1],
        left: [0, -1], center: [0, 0], right: [0, 1],
        bottomLeft: [1, -1], bottom: [1, 0], bottomRight: [1, 1]
    }

    const moveInDirection = (x, y, pixels, directions, moveProperties, checkAll) => {
        let moved = checkAll ? [] : false;
        for (let i = 0; i < directions.length; i++) {
            const xDir = x + directions[i][0];
            const yDir = y + directions[i][1];
            if (pixels[xDir]) {
                if (pixels[xDir][yDir] === undefined)
                    continue;
                const rand = Math.random();
                for (let j = 0; j < moveProperties.length; j++) {
                    const moveProp = moveProperties[j];
                    if (moveProp.conditionCheck(pixels[xDir][yDir], rand)) {
                        pixels[xDir][yDir] = moveProp.targetMatIdAfter;
                        pixels[x][y] = moveProp.sourceMatIdAfter;
                        const movedDir = { x: xDir, y: yDir };
                        if (!checkAll)
                            return movedDir;
                        else
                            moved.push(movedDir);
                    }
                }
            }
        }
        return moved;
    }

    const hasMatAround = (matId, x, y, pixels) => {
        for (let i = 0; i < allDirMove.length; i++) {
            const dir = allDirMove[i];
            if (pixels[x + dir[0]]) {
                if (pixels[x + dir[0]][y + dir[1]] !== matId) {
                    return false;
                }
            }
        }
        return true
    }

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

    const granuleMoveDir = () => Math.random() < 0.5
        ? [directions.bottom, directions.bottomLeft, directions.bottomRight]
        : [directions.bottom, directions.bottomRight, directions.bottomLeft];

    const liquidMoveDir = () => Math.random() < 0.5
        ? [directions.bottom, directions.bottomLeft, directions.bottomRight, directions.left, directions.right]
        : [directions.bottom, directions.bottomRight, directions.bottomLeft, directions.right, directions.left];

    const gasMoveDir = () => Math.random() < 0.5
        ? [directions.top, directions.topLeft, directions.topRight, directions.left, directions.right]
        : [directions.top, directions.topRight, directions.topLeft, directions.right, directions.left];

    const sideMoveDir = [directions.top, directions.bottom, directions.left, directions.right];
    const allDirMove = [directions.topLeft, directions.top, directions.topRight, directions.left, directions.right, directions.bottomLeft, directions.bottom, directions.bottomRight];

    const updateStatic = (x, y, pixels, modified, sleep) => sleep[x][y] = 1;

    const updateGas = (matId, x, y, pixels, modified, sleep) => {
        const directions = gasMoveDir();
        const swapMaterials = [EMTY_SPACE, WATER_MAT, SAND_MAT, SNOW_MAT, ACID_MAT, LAVA_MAT]
        const moveParams = swapMaterials.map(swapMat => ({
            conditionCheck: (mat, chance) => mat === swapMat,
            targetMatIdAfter: matId,
            sourceMatIdAfter: swapMat
        }));
        const moved = moveInDirection(x, y, pixels, directions, moveParams);
        if (moved) {
            modified[moved.x][moved.y] = 1;
            awakeNeighbours(x, y, sleep);
            return;
        }
        sleep[x][y] = 1;
    }
    const updateSmoke = (x, y, pixels, modified, sleep) => updateGas(SMOKE_MAT, x, y, pixels, modified, sleep);
    const updateSteam = (x, y, pixels, modified, sleep) => updateGas(STEAM_MAT, x, y, pixels, modified, sleep);

    const updateGranule = (matId, x, y, pixels, modified, sleep) => {
        const directions = granuleMoveDir();
        const swapMaterials = [EMTY_SPACE, WATER_MAT, ACID_MAT, LAVA_MAT];
        const moveParams = swapMaterials.map(swapMat => ({
            conditionCheck: (mat, chance) => mat === swapMat,
            targetMatIdAfter: matId,
            sourceMatIdAfter: swapMat
        }));
        const moved = moveInDirection(x, y, pixels, directions, moveParams);
        if (moved) {
            modified[moved.x][moved.y] = 1;
            awakeNeighbours(x, y, sleep);
            return;
        }
        sleep[x][y] = 1;
    }
    const updateSand = (x, y, pixels, modified, sleep) => updateGranule(SAND_MAT, x, y, pixels, modified, sleep);
    const updateSnow = (x, y, pixels, modified, sleep) => updateGranule(SNOW_MAT, x, y, pixels, modified, sleep);

    const updateWater = (x, y, pixels, modified, sleep) => {
        const directions = liquidMoveDir();
        const swapMaterials = [EMTY_SPACE, ACID_MAT, LAVA_MAT]
        let moveParams = swapMaterials.map(swapMat => ({
            conditionCheck: (mat, chance) => mat === swapMat,
            targetMatIdAfter: WATER_MAT,
            sourceMatIdAfter: swapMat
        }));
        moveParams = moveParams.concat([{
            conditionCheck: (mat, chance) => mat === ICE_MAT && chance < 0.1,
            targetMatIdAfter: ICE_MAT,
            sourceMatIdAfter: ICE_MAT
        }, {
            conditionCheck: (mat, chance) => mat === SNOW_MAT && chance < 0.01,
            targetMatIdAfter: WATER_MAT,
            sourceMatIdAfter: WATER_MAT
        }]);
        const moved = moveInDirection(x, y, pixels, directions, moveParams);
        if (moved) {
            modified[moved.x][moved.y] = 1;
            awakeNeighbours(x, y, sleep);
            return;
        }
        sleep[x][y] = 1;
    }

    const updateFire = (x, y, pixels, modified, sleep) => {
        const directions = sideMoveDir;
        const moveParams = [{
            conditionCheck: (mat, chance) => mat === WOOD_MAT || mat === PLANT_MAT,
            targetMatIdAfter: FIRE_MAT,
            sourceMatIdAfter: SMOKE_MAT
        }, {
            conditionCheck: (mat, chance) => mat === ICE_MAT || mat === SNOW_MAT,
            targetMatIdAfter: WATER_MAT,
            sourceMatIdAfter: EMTY_SPACE
        }, {
            conditionCheck: (mat, chance) => mat === SAND_MAT,
            targetMatIdAfter: GLASS_MAT,
            sourceMatIdAfter: EMTY_SPACE
        }, {
            conditionCheck: (mat, chance) => mat === WATER_MAT && chance < 0.3,
            targetMatIdAfter: STEAM_MAT,
            sourceMatIdAfter: EMTY_SPACE
        }]
        const moved = moveInDirection(x, y, pixels, directions, moveParams, true);
        if (moved) {
            moved.forEach(m => modified[m.x][m.y] = 1);
            awakeNeighbours(x, y, sleep);
        }
        pixels[x][y] = pixels[x][y] === SMOKE_MAT ? SMOKE_MAT : EMTY_SPACE;
    }

    const updateAcid = (x, y, pixels, modified, sleep) => {
        const directions = liquidMoveDir();
        const swapMaterials = [EMTY_SPACE, LAVA_MAT]
        const moveParams = swapMaterials.map(swapMat => ({
            conditionCheck: (mat, chance) => mat === swapMat,
            targetMatIdAfter: ACID_MAT,
            sourceMatIdAfter: swapMat
        }));
        moveParams.push({
            conditionCheck: (mat, chance) => mat !== ACID_MAT && mat !== METAL_MAT && mat !== GLASS_MAT && chance < 0.1,
            targetMatIdAfter: EMTY_SPACE,
            sourceMatIdAfter: EMTY_SPACE
        });
        const moved = moveInDirection(x, y, pixels, directions, moveParams);
        if (moved) {
            modified[moved.x][moved.y] = 1;
            awakeNeighbours(x, y, sleep);
            return;
        }
        sleep[x][y] = 1;
    }

    const updateLava = (x, y, pixels, modified, sleep) => {
        let lavaAround = hasMatAround(LAVA_MAT, x, y, pixels);
        if (lavaAround) {
            modified[x][y] = 1;
            sleep[x][y] = 1;
            return;
        }
        const directions = liquidMoveDir();
        const moveParams = [{
            conditionCheck: (mat, chance) => mat === EMTY_SPACE,
            targetMatIdAfter: LAVA_MAT,
            sourceMatIdAfter: EMTY_SPACE
        }, {
            conditionCheck: (mat, chance) => mat === SAND_MAT && chance < 0.1,
            targetMatIdAfter: LAVA_MAT,
            sourceMatIdAfter: GLASS_MAT
        }, {
            conditionCheck: (mat, chance) => (mat === WATER_MAT || mat === SNOW_MAT) && chance < 0.1,
            targetMatIdAfter: LAVA_MAT,
            sourceMatIdAfter: STEAM_MAT
        }, {
            conditionCheck: (mat, chance) => mat === ICE_MAT,
            targetMatIdAfter: LAVA_MAT,
            sourceMatIdAfter: WATER_MAT
        }, {
            conditionCheck: (mat, chance) => mat !== LAVA_MAT && chance < 0.1,
            targetMatIdAfter: FIRE_MAT,
            sourceMatIdAfter: SMOKE_MAT
        }, {
            conditionCheck: (mat, chance) => mat !== LAVA_MAT && chance < 0.3,
            targetMatIdAfter: LAVA_MAT,
            sourceMatIdAfter: FIRE_MAT
        }]
        const moved = moveInDirection(x, y, pixels, directions, moveParams);
        if (moved) {
            modified[moved.x][moved.y] = 1;
            awakeNeighbours(x, y, sleep);
            return;
        }
    }

    const updatePlant = (x, y, pixels, modified, sleep) => {
        let plantsAround = hasMatAround(PLANT_MAT, x, y, pixels);
        if (plantsAround) {
            modified[x][y] = 1;
            sleep[x][y] = 1;
            return;
        }
        const rand = Math.random();
        if (rand > 0.99) {
            const top = directions.top;
            if (pixels[x + top[0]]) {
                if (pixels[x + top[0]][y + top[1]] !== PLANT_MAT) {
                    pixels[x][y] = EMTY_SPACE;
                    modified[x][y] = 1;
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        } else if (rand < 0.01) {
            const topSide = Math.random() < 0.5 ? directions.topLeft : directions.topRight;
            if (pixels[x + topSide[0]]) {
                if (pixels[x + topSide[0]][y + topSide[1]] === EMTY_SPACE) {
                    pixels[x + topSide[0]][y + topSide[1]] = PLANT_MAT;
                    modified[x + topSide[0]][y + topSide[1]] = 1;
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        } else if (rand < 0.1) {
            const top = directions.top;
            if (pixels[x + top[0]]) {
                if (pixels[x + top[0]][y + top[1]] === EMTY_SPACE) {
                    pixels[x + top[0]][y + top[1]] = PLANT_MAT;
                    modified[x + top[0]][y + top[1]] = 1;
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        }
    }

    const MaterialProps = (() => {
        const properties = {};

        properties[WOOD_MAT] = {
            id: WOOD_MAT,
            name: 'Wood',
            colors: ['#5a2806', '#7e470b', '#66300b', '#7a4408'],
            update: updateStatic
        }
        properties[ROCK_MAT] = {
            id: ROCK_MAT,
            name: 'Rock',
            colors: ['#2c2b2b', '#383030', '#2c2b2b', '#383030'],
            update: updateStatic
        }
        properties[METAL_MAT] = {
            id: METAL_MAT,
            name: 'Metal',
            colors: ['#b5b5b5', '#c6c6c6', '#b5b5b5', '#e7e7e7'],
            update: updateStatic
        }
        properties[GLASS_MAT] = {
            id: GLASS_MAT,
            name: 'Glass',
            colors: ['#dbe1e3', '#d8e4e9', '#a7c7cb', '#a7c7cb'],
            update: updateStatic
        }
        properties[ICE_MAT] = {
            id: ICE_MAT,
            name: 'Ice',
            colors: ['#b3e1e3', '#82cfd1', '#f7f7f7', '#b3e1e3'],
            update: updateStatic
        }
        properties[WATER_MAT] = {
            id: WATER_MAT,
            name: 'Water',
            colors: ['#1ca3ec', '#42d6f7', '#1692d5', '#0a97e3'],
            update: updateWater
        }
        properties[SAND_MAT] = {
            id: SAND_MAT,
            name: 'Sand',
            colors: ['#e5c69d', '#eacba4', '#e0be91', '#b3a076'],
            update: updateSand
        }
        properties[SNOW_MAT] = {
            id: SNOW_MAT,
            name: 'Snow',
            colors: ['#f7f2f2', '#f1f1f1', '#e8f2f7', '#f1f1f1'],
            update: updateSnow
        }
        properties[FIRE_MAT] = {
            id: FIRE_MAT,
            name: 'Fire',
            colors: ['#f70000', '#f75700', '#b02103', '#f7c800'],
            update: updateFire
        }
        properties[SMOKE_MAT] = {
            id: SMOKE_MAT,
            name: 'Smoke',
            colors: ['#595656', '#696767', '#595656', '#696767'],
            update: updateSmoke
        }
        properties[STEAM_MAT] = {
            id: STEAM_MAT,
            name: 'Steam',
            colors: ['#e4ecf2', '#dfe6ec', '#d9e0e5', '#cdd9e1'],
            update: updateSteam
        }
        properties[ACID_MAT] = {
            id: ACID_MAT,
            name: 'Acid',
            colors: ['#aab919', '#c5dc14', '#84e810', '#7de208'],
            update: updateAcid
        }
        properties[LAVA_MAT] = {
            id: LAVA_MAT,
            name: 'Lava',
            colors: ['#f72400', '#f76300', '#c90f1f', '#463a31'],
            update: updateLava
        }
        properties[PLANT_MAT] = {
            id: PLANT_MAT,
            name: 'Plant',
            colors: ['#57a65e', '#338453', '#5fb766', '#57a65e'],
            update: updatePlant
        }

        return properties;
    })()

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

        pixelWorld.init = function (element) {
            containerElement = element;
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
            this.pixelsArray = fillArray(this.arrayCells.rows, this.arrayCells.cols, () => EMTY_SPACE);
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
                    if (this.pixelsArray[row][col] !== EMTY_SPACE)
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
                    if (this.pixelsArray[row][col] !== EMTY_SPACE)
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
                && this.pixelsArray[row][col] === EMTY_SPACE) {
                this.pixelsArray[row][col] = id;
                this.renderedPixels[row][col] = 1;
                this.drawParticleMain(col, row, MaterialProps[id].colors[this.pixelsColors[row][col]]);
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
                this.pixelsArray[row][col] = EMTY_SPACE;
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
                if (id !== FIRE_MAT && id !== PLANT_MAT && id !== SNOW_MAT) {
                    MaterialProps[id].update(row, col, this.pixelsArray, this.pixelsModified, this.pixelsSleeping);
                } else if (tickCounter % 10 === 0) {
                    MaterialProps[id].update(row, col, this.pixelsArray, this.pixelsModified, this.pixelsSleeping);
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
            if (id !== EMTY_SPACE) {
                if (this.pixelsSleeping[row][col] === 0) {
                    this.renderedPixels[row][col] = 1;
                    pixelsRendered++;
                    this.drawParticleMain(col, row, debugActivity ? DEBUG_COLOR : MaterialProps[id].colors[this.pixelsColors[row][col]]);
                } else if (this.pixelsSleeping[row][col] === 1 && this.pixelsPrevTickSleeping[row][col] === 0) {
                    this.renderedPixels[row][col] = 1;
                    pixelsRendered++;
                    this.drawParticleMain(col, row, MaterialProps[id].colors[this.pixelsColors[row][col]]);
                }
            } else if (this.renderedPixels[row][col] === 1 && id === EMTY_SPACE) {
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
        PixelWorld: PixelWorld,
        MaterialProps: MaterialProps
    };
})();