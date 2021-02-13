const ParticlesModule = (() => {
    const fillArray = function (x, y, expression) {
        const filled = [];
        for (let i = 0; i <= y; i++) {
            filled.push([]);
            for (let j = 0; j <= x; j++) {
                filled[i].push(expression(i, j));
            }
        }
        return filled;
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

    const granuleRules = () => {
        let bottom = [1, 0];
        let bottomLeft = [1, -1];
        let bottomRight = [1, 1];

        let rules = [bottom];
        rules = rules.concat(Math.random() < 0.51 ? [bottomLeft, bottomRight] : [bottomRight, bottomLeft]);

        return rules;
    };

    const liquidRules = () => {
        let bottom = [1, 0];
        let bottomLeft = [1, -1];
        let bottomRight = [1, 1];
        let left = [0, -1];
        let right = [0, 1];

        let rules = [bottom];
        rules = rules.concat(Math.random() < 0.51 ? [bottomLeft, bottomRight] : [bottomRight, bottomLeft]);
        rules = rules.concat(Math.random() < 0.51 ? [left, right] : [right, left]);

        return rules;
    };

    const gasRules = () => {
        let top = [-1, 0];
        let topLeft = [-1, -1];
        let topRight = [-1, 1];
        let left = [0, -1];
        let right = [0, 1];

        let rules = [top];
        rules = rules.concat(Math.random() < 0.51 ? [topLeft, topRight] : [topRight, topLeft]);
        rules = rules.concat(Math.random() < 0.51 ? [left, right] : [right, left]);

        return rules;
    }

    const fastSpreadingRules = () => {
        let top = [-1, 0];
        let bottom = [1, 0];
        let left = [0, -1];
        let right = [0, 1];
        return [top, bottom, left, right];
    }

    const updateSand = (x, y, particles, modified, sleep) => {
        const rules = granuleRules();
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (particles[x + rule[0]]) {
                if (particles[x + rule[0]][y + rule[1]] === 0) {
                    particles[x + rule[0]][y + rule[1]] = 3;
                    particles[x][y] = 0;
                    modified[x + rule[0]][y + rule[1]] = 1;
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        }
        if (particles[x + 1]) {
            const otherParticleRules = [2, 5, 6, 7];
            for (let i = 0; i < otherParticleRules.length; i++) {
                const otherParticleId = otherParticleRules[i];
                if (particles[x + 1][y] === otherParticleId) {
                    particles[x + 1][y] = 3;
                    particles[x][y] = otherParticleId;
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        }
        sleep[x][y] = 1;
    };

    const updateSmoke = (x, y, particles, modified, sleep) => {
        const rules = gasRules();
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (particles[x + rule[0]]) {
                if (particles[x + rule[0]][y + rule[1]] === 0) {
                    particles[x + rule[0]][y + rule[1]] = 5;
                    particles[x][y] = 0;
                    modified[x + rule[0]][y + rule[1]] = 1;
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        }
        sleep[x][y] = 1;
    };

    const updateSteam = (x, y, particles, modified, sleep) => {
        const rules = gasRules();
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (particles[x + rule[0]]) {
                if (particles[x + rule[0]][y + rule[1]] === 0) {
                    particles[x + rule[0]][y + rule[1]] = 6;
                    particles[x][y] = 0;
                    modified[x + rule[0]][y + rule[1]] = 1;
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        }
        sleep[x][y] = 1;
    };

    const updateWater = (x, y, particles, modified, sleep) => {
        const rules = liquidRules();
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (particles[x + rule[0]]) {
                if (particles[x + rule[0]][y + rule[1]] === 0) {
                    particles[x + rule[0]][y + rule[1]] = 2;
                    particles[x][y] = 0;
                    modified[x + rule[0]][y + rule[1]] = 1;
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        }
        if (particles[x + 1]) {
            const otherParticleRules = [5, 6, 7];
            for (let i = 0; i < otherParticleRules.length; i++) {
                const otherParticleId = otherParticleRules[i];
                if (particles[x + 1][y] === otherParticleId) {
                    particles[x + 1][y] = 2;
                    particles[x][y] = otherParticleId;
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        }
        sleep[x][y] = 1;
    };

    const updateAcid = (x, y, particles, modified, sleep) => {
        const rules = liquidRules();
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (particles[x + rule[0]]) {
                if (particles[x + rule[0]][y + rule[1]] === 0) {
                    particles[x + rule[0]][y + rule[1]] = 7;
                    particles[x][y] = 0;
                    modified[x + rule[0]][y + rule[1]] = 1;
                    awakeNeighbours(x, y, sleep);
                    return;
                } else if (particles[x + rule[0]][y + rule[1]] !== 7 && Math.random() < 0.1) {
                    particles[x + rule[0]][y + rule[1]] = 0;
                    particles[x][y] = 0;
                    modified[x + rule[0]][y + rule[1]] = 1;
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        }
        if (particles[x + 1]) {
            const otherParticleRules = [5, 6];
            for (let i = 0; i < otherParticleRules.length; i++) {
                const otherParticleId = otherParticleRules[i];
                if (particles[x + 1][y] === otherParticleId) {
                    particles[x + 1][y] = 2;
                    particles[x][y] = otherParticleId;
                    awakeNeighbours(x, y, sleep);
                    return;
                }
            }
        }
        sleep[x][y] = 1;
    };

    const updateFire = (x, y, particles, modified, sleep) => {
        const rules = fastSpreadingRules();
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (particles[x + rule[0]]) {
                if (particles[x + rule[0]][y + rule[1]] === 1) {
                    particles[x + rule[0]][y + rule[1]] = 4;
                    particles[x][y] = 5;
                    modified[x + rule[0]][y + rule[1]] = 1;
                    awakeNeighbours(x, y, sleep);
                } else if (particles[x + rule[0]][y + rule[1]] === 2) {
                    particles[x + rule[0]][y + rule[1]] = 6;
                    particles[x][y] = 0;
                    awakeNeighbours(x, y, sleep);
                }
            }
        }
        particles[x][y] = particles[x][y] === 5 ? 5 : 0;
    };

    const updateWood = (x, y, particles, modified, sleep) => {
        sleep[x][y] = 1;
    };

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
            this.particleArray = fillArray(this.arrayXY.x, this.arrayXY.y, () => 0);
            this.staticParticleArray = fillArray(this.arrayXY.x, this.arrayXY.y, () => 0);
            this.particleColors = fillArray(this.arrayXY.x, this.arrayXY.y, () => Math.floor(Math.random() * 4));
            this.particleModified = fillArray(this.arrayXY.x, this.arrayXY.y, () => 0);
            this.particleSleep = fillArray(this.arrayXY.x, this.arrayXY.y, () => 0);
            this.particlePrevSleep = fillArray(this.arrayXY.x, this.arrayXY.y, () => 0);
            this.initialized = true;
        }

        particles.clear = function () {
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            this.particleArray = fillArray(this.arrayXY.x, this.arrayXY.y, () => 0);
            this.staticParticleArray = fillArray(this.arrayXY.x, this.arrayXY.y, () => 0);
            this.particleColors = fillArray(this.arrayXY.x, this.arrayXY.y, () => Math.floor(Math.random() * 4));
            this.particleModified = fillArray(this.arrayXY.x, this.arrayXY.y, () => 0);
            this.particleSleep = fillArray(this.arrayXY.x, this.arrayXY.y, () => 0);
            this.particlePrevSleep = fillArray(this.arrayXY.x, this.arrayXY.y, () => 0);
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

        particles.getImage = function () {
            const imageData = this.context.canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = imageData;
            a.download = 'particles_img.png';
            this.containerElement.appendChild(a);
            a.click();
            a.remove();
        }

        particles.add = function (id, x, y) {
            if (this.particleArray[y - this.min.y] !== undefined
                && this.particleArray[y - this.min.y][x - this.min.x] !== undefined
                && this.particleArray[y - this.min.y][x - this.min.x] === 0) {
                this.particleArray[y - this.min.y][x - this.min.x] = id;
            }
        }

        particles.addFew = function (id, x, y, spread, amount) {
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
                this.moveParticle(id, row, col);
                this.updated++;
            }
        }

        particles.moveParticle = function (cellId, row, col) {
            switch (cellId) {
                case 1:
                    updateWood(row, col, this.particleArray, this.particleModified, this.particleSleep);
                    return;
                case 2:
                    updateWater(row, col, this.particleArray, this.particleModified, this.particleSleep);
                    return;
                case 3:
                    updateSand(row, col, this.particleArray, this.particleModified, this.particleSleep);
                    return;
                case 4:
                    if (this.tickCount % 10 === 0)
                        updateFire(row, col, this.particleArray, this.particleModified, this.particleSleep);
                    return;
                case 5:
                    updateSmoke(row, col, this.particleArray, this.particleModified, this.particleSleep);
                    return;
                case 6:
                    updateSteam(row, col, this.particleArray, this.particleModified, this.particleSleep);
                    return;
                case 7:
                    updateAcid(row, col, this.particleArray, this.particleModified, this.particleSleep);
                    return;
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
            if (this.particleSleep[row][col] === 0 && id !== 0) {
                this.drawedMoving++;
                this.staticParticleArray[row][col] = 1;
                this.drawParticleMain(col, row, this.debugMoving ? 'red' : ParticleProps[id].colors[this.particleColors[row][col]]);
            } else if (this.particleSleep[row][col] === 1 && this.particlePrevSleep[row][col] === 0) {
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

    const ParticleProps = {
        '1': {
            id: 1,
            name: 'Wood',
            colors: ['#5a2806', '#7e470b', '#66300b', '#7a4408']
        },
        '2': {
            id: 2,
            name: 'Water',
            colors: ['#1ca3ec', '#42d6f7', '#1692d5', '#0a97e3']
        },
        '3': {
            id: 3,
            name: 'Sand',
            colors: ['#e5c69d', '#eacba4', '#e0be91', '#b3a076']
        },
        '4': {
            id: 4,
            name: 'Fire',
            colors: ['#f70000', '#f75700', '#b02103', '#f7c800']
        },
        '5': {
            id: 5,
            name: 'Smoke',
            colors: ['#595656', '#262626', '#595656', '#262626']
        },
        '6': {
            id: 6,
            name: 'Steam',
            colors: ['#e4ecf2', '#dfe6ec', '#d9e0e5', '#cdd9e1']
        },
        '7': {
            id: 7,
            name: 'Acid',
            colors: ['#aab919', '#c5dc14', '#84e810', '#7de208']
        }
    }

    const particlesModule = {
        Particles: Particles,
        ParticleProps: ParticleProps
    };

    return particlesModule;
})();