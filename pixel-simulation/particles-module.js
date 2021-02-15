const ParticlesModule = (() => {
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

    const moveInDirection = (x, y, particles, directions, moveProperties, checkAll) => {
        let moved = checkAll ? [] : false;
        for (let i = 0; i < directions.length; i++) {
            const xDir = x + directions[i][0];
            const yDir = y + directions[i][1];
            if (particles[xDir]) {
                if (particles[xDir][yDir] === undefined)
                    continue;
                const rand = Math.random();
                for (let j = 0; j < moveProperties.length; j++) {
                    const moveProp = moveProperties[j];
                    if (moveProp.conditionCheck(particles[xDir][yDir], rand)) {
                        particles[xDir][yDir] = moveProp.targetMatIdAfter;
                        particles[x][y] = moveProp.sourceMatIdAfter;
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

    const hasMatAround = (matId, x, y, particles) => {
        for (let i = 0; i < allDirMove.length; i++) {
            const dir = allDirMove[i];
            if (particles[x + dir[0]]) {
                if (particles[x + dir[0]][y + dir[1]] !== matId) {
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

    const updateStatic = (x, y, particles, modified, sleep) => sleep[x][y] = 1;

    const updateGas = (matId, x, y, particles, modified, sleep) => {
        const directions = gasMoveDir();
        const swapMaterials = [EMTY_SPACE, WATER_MAT, SAND_MAT, SNOW_MAT, ACID_MAT, LAVA_MAT]
        const moveParams = swapMaterials.map(swapMat => ({
            conditionCheck: (mat, chance) => mat === swapMat,
            targetMatIdAfter: matId,
            sourceMatIdAfter: swapMat
        }));
        const moved = moveInDirection(x, y, particles, directions, moveParams);
        if (moved) {
            modified[moved.x][moved.y] = 1;
            awakeNeighbours(x, y, sleep);
            return;
        }
        sleep[x][y] = 1;
    }
    const updateSmoke = (x, y, particles, modified, sleep) => updateGas(SMOKE_MAT, x, y, particles, modified, sleep);
    const updateSteam = (x, y, particles, modified, sleep) => updateGas(STEAM_MAT, x, y, particles, modified, sleep);

    const updateGranule = (matId, x, y, particles, modified, sleep) => {
        const directions = granuleMoveDir();
        const swapMaterials = [EMTY_SPACE, WATER_MAT, ACID_MAT, LAVA_MAT];
        const moveParams = swapMaterials.map(swapMat => ({
            conditionCheck: (mat, chance) => mat === swapMat,
            targetMatIdAfter: matId,
            sourceMatIdAfter: swapMat
        }));
        const moved = moveInDirection(x, y, particles, directions, moveParams);
        if (moved) {
            modified[moved.x][moved.y] = 1;
            awakeNeighbours(x, y, sleep);
            return;
        }
        sleep[x][y] = 1;
    }
    const updateSand = (x, y, particles, modified, sleep) => updateGranule(SAND_MAT, x, y, particles, modified, sleep);
    const updateSnow = (x, y, particles, modified, sleep) => updateGranule(SNOW_MAT, x, y, particles, modified, sleep);

    const updateWater = (x, y, particles, modified, sleep) => {
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
        const moved = moveInDirection(x, y, particles, directions, moveParams);
        if (moved) {
            modified[moved.x][moved.y] = 1;
            awakeNeighbours(x, y, sleep);
            return;
        }
        sleep[x][y] = 1;
    }

    const updateFire = (x, y, particles, modified, sleep) => {
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
        const moved = moveInDirection(x, y, particles, directions, moveParams, true);
        if (moved) {
            moved.forEach(m => modified[m.x][m.y] = 1);
            awakeNeighbours(x, y, sleep);
        }
        particles[x][y] = particles[x][y] === SMOKE_MAT ? SMOKE_MAT : EMTY_SPACE;
    }

    const updateAcid = (x, y, particles, modified, sleep) => {
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
        const moved = moveInDirection(x, y, particles, directions, moveParams);
        if (moved) {
            modified[moved.x][moved.y] = 1;
            awakeNeighbours(x, y, sleep);
            return;
        }
        sleep[x][y] = 1;
    }

    const updateLava = (x, y, particles, modified, sleep) => {
        let lavaAround = hasMatAround(LAVA_MAT, x, y, particles);
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
        const moved = moveInDirection(x, y, particles, directions, moveParams);
        if (moved) {
            modified[moved.x][moved.y] = 1;
            awakeNeighbours(x, y, sleep);
            return;
        }
    }

    const updatePlant = (x, y, particles, modified, sleep) => {
        let plantsAround = hasMatAround(PLANT_MAT, x, y, particles);
        if (plantsAround) {
            modified[x][y] = 1;
            sleep[x][y] = 1;
            return;
        }
        const rand = Math.random();
        if (rand > 0.99) {
            const top = directions.top;
            if (particles[x + top[0]]) {
                if (particles[x + top[0]][y + top[1]] !== PLANT_MAT) {
                    particles[x][y] = EMTY_SPACE;
                    modified[x][y] = 1;
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        } else if (rand < 0.01) {
            const topSide = Math.random() < 0.5 ? directions.topLeft : directions.topRight;
            if (particles[x + topSide[0]]) {
                if (particles[x + topSide[0]][y + topSide[1]] === EMTY_SPACE) {
                    particles[x + topSide[0]][y + topSide[1]] = PLANT_MAT;
                    modified[x + topSide[0]][y + topSide[1]] = 1;
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        } else if (rand < 0.1) {
            const top = directions.top;
            if (particles[x + top[0]]) {
                if (particles[x + top[0]][y + top[1]] === EMTY_SPACE) {
                    particles[x + top[0]][y + top[1]] = PLANT_MAT;
                    modified[x + top[0]][y + top[1]] = 1;
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        }
    }

    const ParticleProps = (() => {
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

    const fillArray = (x, y, expression) => {
        const filled = [];
        for (let i = 0; i <= y; i++) {
            filled.push([]);
            for (let j = 0; j <= x; j++) {
                filled[i].push(expression(i, j));
            }
        }
        return filled;
    }

    const Particles = function (scale, min, max, maxParticles) {
        const particles = {};

        particles.tickCount = 0;
        particles.updated = 0;
        particles.drawedParticles = 0;
        particles.erasedParticles = 0;

        particles.debugMoving = false;

        particles.scale = scale || 10;
        particles.maxParticles = maxParticles || Infinity;

        particles.initialized = false;
        particles.paused = false;

        particles.containerElement = null;
        particles.context = null;
        particles.min = null;
        particles.max = null
        particles.arrayXY = null;

        particles.particleArray = null;
        particles.drawedParticleArray = null;
        particles.particleColors = null;
        particles.particleModified = null;
        particles.particleSleep = null;
        particles.particlePrevSleep = null;

        particles.callbacks = {
            'before-draw': null
        };

        particles.init = function (element) {
            this.containerElement = element;
            const canvas = document.createElement('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            element.appendChild(canvas);
            this.context = canvas.getContext('2d');
            this.min = min || { x: 1, y: 1 };
            this.max = max || {
                x: Math.floor(canvas.width / this.scale) - 1,
                y: Math.floor(canvas.height / this.scale) - 1
            };
            this.arrayXY = {
                x: this.max.x - this.min.x,
                y: this.max.y - this.min.y
            }
            this.clear();
        }

        particles.clear = function () {
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            this.particleArray = fillArray(this.arrayXY.x, this.arrayXY.y, () => EMTY_SPACE);
            this.drawedParticleArray = fillArray(this.arrayXY.x, this.arrayXY.y, () => 0);
            this.particleColors = fillArray(this.arrayXY.x, this.arrayXY.y, () => Math.floor(Math.random() * COLORS_PER_MAT));
            this.particleModified = fillArray(this.arrayXY.x, this.arrayXY.y, () => 0);
            this.particleSleep = fillArray(this.arrayXY.x, this.arrayXY.y, () => 0);
            this.particlePrevSleep = fillArray(this.arrayXY.x, this.arrayXY.y, () => 0);
            this.drawBounds();
        }

        particles.start = function () {
            this.paused = false;
        }

        particles.stop = function () {
            this.paused = true;
        }

        particles.on = function (name, callback) {
            this.callbacks[name] = callback;
        }

        particles.trigger = function (name) {
            if (typeof this.callbacks[name] === 'function')
                this.callbacks[name](this);
        }

        particles.getPositionFromCoords = function (x, y) {
            return {
                x: Math.floor(x / this.scale),
                y: Math.floor(y / this.scale)
            }
        }

        particles.getCount = function () {
            let count = 0;
            for (let row = 0; row < this.particleArray.length; row++) {
                for (let col = 0; col < this.particleArray[row].length; col++) {
                    if (this.particleArray[row][col] !== EMTY_SPACE)
                        count++;
                }
            }
            return count;
        }

        particles.saveImage = function () {
            const imageData = this.context.canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = imageData;
            a.download = 'particles_img.png';
            this.containerElement.appendChild(a);
            a.click();
            a.remove();
        }

        particles.add = function (id, x, y) {
            if (this.paused)
                return;
            if (this.particleArray[y - this.min.y] !== undefined
                && this.particleArray[y - this.min.y][x - this.min.x] !== undefined
                && this.particleArray[y - this.min.y][x - this.min.x] === EMTY_SPACE) {
                this.particleArray[y - this.min.y][x - this.min.x] = id;
            }
        }

        particles.addFew = function (id, x, y, spread, amount) {
            if (this.paused)
                return;
            for (let i = 0; i < amount; i++) {
                const xR = Math.floor(Math.random() * spread) * ((Math.random() < 0.5) ? 1 : -1);
                const xY = Math.floor(Math.random() * spread) * ((Math.random() < 0.5) ? 1 : -1);
                this.add(id, x + xR, y + xY);
            }
        }

        particles.remove = function (x, y) {
            if (this.particleArray[y - this.min.y] !== undefined
                && this.particleArray[y - this.min.y][x - this.min.x] !== undefined) {
                this.particleArray[y - this.min.y][x - this.min.x] = EMTY_SPACE;
                awakeNeighbours(y - this.min.y, x - this.min.x, this.particleSleep);
            }
        }

        particles.removeFew = function (x, y, spread, amount) {
            for (let i = 0; i < amount; i++) {
                const xR = Math.floor(Math.random() * spread) * ((Math.random() < 0.5) ? 1 : -1);
                const xY = Math.floor(Math.random() * spread) * ((Math.random() < 0.5) ? 1 : -1);
                this.remove(x + xR, y + xY);
            }
        }

        particles.tick = function () {
            if (this.paused)
                return;
            this.tickCount++;
            this.update();
            this.draw();
            this.particlePrevSleep = fillArray(this.arrayXY.x, this.arrayXY.y, (row, col) => this.particleSleep[row][col]);
        }

        particles.update = function () {
            this.updated = 0;
            this.particleModified = fillArray(this.arrayXY.x, this.arrayXY.y, () => 0);
            for (let row = this.particleArray.length - 1; row >= 0; row--) {
                if (row % 2 === 0) {
                    for (let col = this.particleArray[row].length - 1; col >= 0; col--)
                        this.updateParticle(row, col);
                } else {
                    for (let col = 0; col < this.particleArray[row].length; col++)
                        this.updateParticle(row, col);
                }
            }
        }

        particles.updateParticle = function (row, col) {
            const id = this.particleArray[row][col];
            if (!id)
                return;
            if (this.particleModified[row][col] === 0 && this.particleSleep[row][col] === 0) {
                if (id !== FIRE_MAT && id !== PLANT_MAT && id !== SNOW_MAT) {
                    ParticleProps[id].update(row, col, this.particleArray, this.particleModified, this.particleSleep);
                } else if (this.tickCount % 10 === 0) {
                    ParticleProps[id].update(row, col, this.particleArray, this.particleModified, this.particleSleep);
                }
                this.updated++;
            }
        }

        particles.draw = function () {
            this.trigger('before-draw');
            this.drawedParticles = 0;
            this.erasedParticles = 0;
            for (let row = 0; row < this.particleArray.length; row++) {
                for (let col = 0; col < this.particleArray[row].length; col++)
                    this.drawParticle(row, col);
            }
            this.drawBounds();
        }

        particles.drawParticle = function (row, col) {
            const id = this.particleArray[row][col];
            if (id !== EMTY_SPACE) {
                if (this.particleSleep[row][col] === 0) {
                    this.drawedParticleArray[row][col] = 1;
                    this.drawedParticles++;
                    this.drawParticleMain(col, row, this.debugMoving ? DEBUG_COLOR : ParticleProps[id].colors[this.particleColors[row][col]]);
                } else if (this.particleSleep[row][col] === 1 && this.particlePrevSleep[row][col] === 0) {
                    this.drawedParticleArray[row][col] = 1;
                    this.drawedParticles++;
                    this.drawParticleMain(col, row, ParticleProps[id].colors[this.particleColors[row][col]]);
                }
            } else if (this.drawedParticleArray[row][col] === 1 && id === EMTY_SPACE) {
                this.erasedParticles++;
                this.drawedParticleArray[row][col] = 0;
                this.clearMain(col, row);
            }
        }

        particles.drawParticleMain = function (x, y, color) {
            this.context.fillStyle = color;
            this.context.fillRect((this.min.x + x) * this.scale, (this.min.y + y) * this.scale, this.scale, this.scale);
        }

        particles.clearMain = function (x, y) {
            this.context.clearRect((this.min.x + x) * this.scale, (this.min.y + y) * this.scale, this.scale, this.scale);
        }

        particles.drawBounds = function () {
            this.context.strokeStyle = '#000';
            this.context.strokeRect(this.min.x * this.scale, this.min.y * this.scale, (this.max.x - this.min.x + 1) * this.scale, (this.max.y - this.min.y + 1) * this.scale);
        }

        return particles;
    }

    const particlesModule = {
        Particles: Particles,
        ParticleProps: ParticleProps
    };

    return particlesModule;
})();