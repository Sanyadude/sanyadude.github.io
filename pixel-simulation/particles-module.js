const ParticlesModule = (() => {
    const COLORS_PER_MAT = 4;

    const EMTY_SPACE = 0;

    const ROCK_MAT = 10;
    const WOOD_MAT = 11;
    const ICE_MAT = 14;
    const WATER_MAT = 15;
    const SAND_MAT = 20;
    const FIRE_MAT = 30;
    const SMOKE_MAT = 40;
    const STEAM_MAT = 41;
    const ACID_MAT = 50;
    const PLANT_MAT = 60;

    const ParticleProps = (() => {
        const properties = {};

        properties[WOOD_MAT] = {
            id: WOOD_MAT,
            name: 'Wood',
            colors: ['#5a2806', '#7e470b', '#66300b', '#7a4408']
        }
        properties[ROCK_MAT] = {
            id: ROCK_MAT,
            name: 'Rock',
            colors: ['#2c2b2b', '#383030', '#2c2b2b', '#383030']
        }
        properties[ICE_MAT] = {
            id: ICE_MAT,
            name: 'Ice',
            colors: ['#b3e1e3', '#82cfd1', '#f7f7f7', '#b3e1e3']
        }
        properties[WATER_MAT] = {
            id: WATER_MAT,
            name: 'Water',
            colors: ['#1ca3ec', '#42d6f7', '#1692d5', '#0a97e3']
        }
        properties[SAND_MAT] = {
            id: SAND_MAT,
            name: 'Sand',
            colors: ['#e5c69d', '#eacba4', '#e0be91', '#b3a076']
        }
        properties[FIRE_MAT] = {
            id: FIRE_MAT,
            name: 'Fire',
            colors: ['#f70000', '#f75700', '#b02103', '#f7c800']
        }
        properties[SMOKE_MAT] = {
            id: SMOKE_MAT,
            name: 'Smoke',
            colors: ['#595656', '#696767', '#595656', '#696767']
        }
        properties[STEAM_MAT] = {
            id: STEAM_MAT,
            name: 'Steam',
            colors: ['#e4ecf2', '#dfe6ec', '#d9e0e5', '#cdd9e1']
        }
        properties[ACID_MAT] = {
            id: ACID_MAT,
            name: 'Acid',
            colors: ['#aab919', '#c5dc14', '#84e810', '#7de208']
        }
        properties[PLANT_MAT] = {
            id: PLANT_MAT,
            name: 'Plant',
            colors: ['#57a65e', '#338453', '#5fb766', '#57a65e']
        }

        return properties;
    })()

    const colActions = {
        move: 1,
        swap: 2,
        annihilate: 3
    }

    const particleCollisionActions = (() => {
        const actions = {};

        actions[WATER_MAT] = [[SMOKE_MAT, colActions.swap], [STEAM_MAT, colActions.swap], [ACID_MAT, colActions.swap]];
        actions[SAND_MAT] = [[WATER_MAT, colActions.swap], [SMOKE_MAT, colActions.swap], [STEAM_MAT, colActions.swap], [ACID_MAT, colActions.swap]];
        actions[ACID_MAT] = [[SMOKE_MAT, colActions.swap], [STEAM_MAT, colActions.swap]];

        return actions;
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

    //dx, dy
    const directions = {
        topLeft: [-1, -1], top: [-1, 0], topRight: [-1, 1],
        left: [0, -1], center: [0, 0], right: [0, 1],
        bottomLeft: [1, -1], bottom: [1, 0], bottomRight: [1, 1]
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

    const spreadMoveDir = [directions.top, directions.bottom, directions.left, directions.right];
    const allDirMove = [directions.topLeft, directions.top, directions.topRight, directions.left, directions.right, directions.bottomLeft, directions.bottom, directions.bottomRight];

    const updateStatic = (x, y, particles, modified, sleep) => sleep[x][y] = 1;

    const updateGas = (matId, x, y, particles, modified, sleep) => {
        const directions = gasMoveDir();
        for (let i = 0; i < directions.length; i++) {
            const dir = directions[i];
            if (particles[x + dir[0]]) {
                if (particles[x + dir[0]][y + dir[1]] === EMTY_SPACE) {
                    particles[x + dir[0]][y + dir[1]] = matId;
                    particles[x][y] = EMTY_SPACE;
                    modified[x + dir[0]][y + dir[1]] = 1;
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        }
        sleep[x][y] = 1;
    }
    const updateSmoke = (x, y, particles, modified, sleep) => updateGas(SMOKE_MAT, x, y, particles, modified, sleep);
    const updateSteam = (x, y, particles, modified, sleep) => updateGas(STEAM_MAT, x, y, particles, modified, sleep);

    const updateWater = (x, y, particles, modified, sleep) => {
        const directions = liquidMoveDir();
        for (let i = 0; i < directions.length; i++) {
            const dir = directions[i];
            if (particles[x + dir[0]]) {
                if (particles[x + dir[0]][y + dir[1]] === EMTY_SPACE) {
                    particles[x + dir[0]][y + dir[1]] = WATER_MAT;
                    particles[x][y] = EMTY_SPACE;
                    modified[x + dir[0]][y + dir[1]] = 1;
                    awakeNeighbours(x, y, sleep);
                    return;
                } else if (particles[x + dir[0]][y + dir[1]] === ICE_MAT && Math.random() < 0.1) {
                    particles[x][y] = ICE_MAT;
                    modified[x][y] = 1;
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        }
        if (particles[x + 1]) {
            const colActions = particleCollisionActions[WATER_MAT];
            for (let i = 0; i < colActions.length; i++) {
                const otherParticle = colActions[i];
                if (particles[x + 1][y] === otherParticle[0]) {
                    particles[x + 1][y] = WATER_MAT;
                    particles[x][y] = otherParticle[0];
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        }
        sleep[x][y] = 1;
    }

    const updateSand = (x, y, particles, modified, sleep) => {
        const directions = granuleMoveDir();
        for (let i = 0; i < directions.length; i++) {
            const dir = directions[i];
            if (particles[x + dir[0]]) {
                if (particles[x + dir[0]][y + dir[1]] === EMTY_SPACE) {
                    particles[x + dir[0]][y + dir[1]] = SAND_MAT;
                    particles[x][y] = EMTY_SPACE;
                    modified[x + dir[0]][y + dir[1]] = 1;
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        }
        if (particles[x + 1]) {
            const colActions = particleCollisionActions[SAND_MAT];
            for (let i = 0; i < colActions.length; i++) {
                const otherParticle = colActions[i];
                if (particles[x + 1][y] === otherParticle[0]) {
                    particles[x + 1][y] = SAND_MAT;
                    particles[x][y] = otherParticle[0];
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        }
        sleep[x][y] = 1;
    }

    const updateFire = (x, y, particles, modified, sleep) => {
        const directions = spreadMoveDir;
        for (let i = 0; i < directions.length; i++) {
            const dir = directions[i];
            if (particles[x + dir[0]]) {
                if (particles[x + dir[0]][y + dir[1]] === WOOD_MAT 
                    || particles[x + dir[0]][y + dir[1]] === PLANT_MAT) {
                    particles[x + dir[0]][y + dir[1]] = FIRE_MAT;
                    particles[x][y] = SMOKE_MAT;
                    modified[x + dir[0]][y + dir[1]] = 1;
                    awakeNeighbours(x, y, sleep);
                } else if (particles[x + dir[0]][y + dir[1]] === ICE_MAT) {
                    particles[x + dir[0]][y + dir[1]] = WATER_MAT;
                    particles[x][y] = EMTY_SPACE;
                    awakeNeighbours(x, y, sleep);
                } else if (particles[x + dir[0]][y + dir[1]] === WATER_MAT && Math.random() < 0.1) {
                    particles[x + dir[0]][y + dir[1]] = STEAM_MAT;
                    particles[x][y] = EMTY_SPACE;
                    awakeNeighbours(x, y, sleep);
                }
            }
        }
        particles[x][y] = particles[x][y] === SMOKE_MAT ? SMOKE_MAT : 0;
    }

    const updateAcid = (x, y, particles, modified, sleep) => {
        const directions = liquidMoveDir();
        for (let i = 0; i < directions.length; i++) {
            const dir = directions[i];
            if (particles[x + dir[0]]) {
                if (particles[x + dir[0]][y + dir[1]] === EMTY_SPACE) {
                    particles[x + dir[0]][y + dir[1]] = ACID_MAT;
                    particles[x][y] = EMTY_SPACE;
                    modified[x + dir[0]][y + dir[1]] = 1;
                    awakeNeighbours(x, y, sleep);
                    return;
                } else if (particles[x + dir[0]][y + dir[1]] !== ACID_MAT && Math.random() < 0.1) {
                    particles[x + dir[0]][y + dir[1]] = EMTY_SPACE;
                    particles[x][y] = EMTY_SPACE;
                    modified[x + dir[0]][y + dir[1]] = 1;
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        }
        if (particles[x + 1]) {
            const colActions = particleCollisionActions[ACID_MAT];
            for (let i = 0; i < colActions.length; i++) {
                const otherParticle = colActions[i];
                if (particles[x + 1][y] === otherParticle[0]) {
                    particles[x + 1][y] = ACID_MAT;
                    particles[x][y] = otherParticle[0];
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        }
        sleep[x][y] = 1;
    }

    const updatePlant = (x, y, particles, modified, sleep) => {
        let plantsAround = true;
        for (let i = 0; i < allDirMove.length; i++) {
            const dir = allDirMove[i];
            if (particles[x + dir[0]]) {
                if (particles[x + dir[0]][y + dir[1]] !== PLANT_MAT) {
                    plantsAround = false;
                    break;
                }
            }
        }
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

    const particlesUpdate = (() => {
        const updateFunctions = {};

        updateFunctions[WOOD_MAT] = updateStatic;
        updateFunctions[ROCK_MAT] = updateStatic;
        updateFunctions[ICE_MAT] = updateStatic;
        updateFunctions[WATER_MAT] = updateWater;
        updateFunctions[SAND_MAT] = updateSand;
        updateFunctions[FIRE_MAT] = updateFire;
        updateFunctions[SMOKE_MAT] = updateSmoke;
        updateFunctions[STEAM_MAT] = updateSteam;
        updateFunctions[ACID_MAT] = updateAcid;
        updateFunctions[PLANT_MAT] = updatePlant;

        return updateFunctions;
    })()

    const Particles = function (scale, min, max, maxParticles) {
        const particles = {};

        particles.tickCount = 0;
        particles.updated = 0;
        particles.drawedMoving = 0;
        particles.drawedToStatic = 0;
        particles.drawedFromStatic = 0;
        particles.lastDrawedParticles = 0;

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
        particles.staticParticleArray = null;
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
            this.particleArray = fillArray(this.arrayXY.x, this.arrayXY.y, () => 0);
            this.staticParticleArray = fillArray(this.arrayXY.x, this.arrayXY.y, () => 0);
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
                    if (this.particleArray[row][col] !== 0)
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
                && this.particleArray[y - this.min.y][x - this.min.x] === 0) {
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
                this.particleArray[y - this.min.y][x - this.min.x] = 0;
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
                if (id !== FIRE_MAT && id !== PLANT_MAT) {
                    particlesUpdate[id](row, col, this.particleArray, this.particleModified, this.particleSleep);
                } else if (this.tickCount % 10 === 0) {
                    particlesUpdate[id](row, col, this.particleArray, this.particleModified, this.particleSleep);
                }
                this.updated++;
            }
        }

        particles.draw = function () {
            this.trigger('before-draw');
            this.drawedToStatic = 0;
            this.drawedFromStatic = 0;
            this.drawedMoving = 0;
            for (let row = this.particleArray.length - 1; row >= 0; row--) {
                if (row % 2 === 0) {
                    for (let col = this.particleArray[row].length - 1; col >= 0; col--)
                        this.drawParticle(row, col);
                } else {
                    for (let col = 0; col < this.particleArray[row].length; col++)
                        this.drawParticle(row, col);
                }
            }
            this.lastDrawedParticles = this.drawedToStatic + this.drawedFromStatic + this.drawedMoving;
            this.drawBounds();
        }

        particles.drawParticle = function (row, col) {
            const id = this.particleArray[row][col];
            if (id !== 0 && this.particleSleep[row][col] === 0) {
                this.drawedMoving++;
                this.staticParticleArray[row][col] = 1;
                this.drawParticleMain(col, row, this.debugMoving ? '#c101ff' : ParticleProps[id].colors[this.particleColors[row][col]]);
            } else if (id !== 0 && this.particleSleep[row][col] === 1 && this.particlePrevSleep[row][col] === 0) {
                this.drawedToStatic++;
                this.staticParticleArray[row][col] = 1;
                this.drawParticleMain(col, row, ParticleProps[id].colors[this.particleColors[row][col]]);
            } else if ((this.particleSleep[row][col] === 0 && this.particlePrevSleep[row][col] === 1)
                || (this.staticParticleArray[row][col] === 1 && id === 0)) {
                this.drawedFromStatic++;
                this.staticParticleArray[row][col] = 0;
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