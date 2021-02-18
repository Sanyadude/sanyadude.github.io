const MaterialsModule = (() => {
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
    const RAINBOW_MAT = 70;

    const generateMaterialColors = (colors, max) => {
        const matColors = [];
        for (let i = 0, j = 0; i < max; i++ , j++) {
            if (j >= colors.length)
                j = 0;
            matColors.push(colors[j]);
        }
        return matColors;
    }

    const getRgbFromHex = (hexColor) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
        if (result) {
            return {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            }
        }
    }

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

    const matAroundCount = (matId, x, y, pixels) => {
        let count = 0;
        for (let i = 0; i < allDirMove.length; i++) {
            const dir = allDirMove[i];
            if (pixels[x + dir[0]]) {
                if (pixels[x + dir[0]][y + dir[1]] === matId) {
                    count++;
                }
            }
        }
        return count
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

    const updateStatic = (x, y, pixels, modified) => false;

    const updateGas = (matId, x, y, pixels, modified) => {
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
            return true;
        }
        return false;
    }
    const updateSmoke = (x, y, pixels, modified) => updateGas(SMOKE_MAT, x, y, pixels, modified);
    const updateSteam = (x, y, pixels, modified) => updateGas(STEAM_MAT, x, y, pixels, modified);

    const updateGranule = (matId, x, y, pixels, modified) => {
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
            return true;
        }
        return false;
    }
    const updateSand = (x, y, pixels, modified) => updateGranule(SAND_MAT, x, y, pixels, modified);
    const updateSnow = (x, y, pixels, modified) => updateGranule(SNOW_MAT, x, y, pixels, modified);

    const updateWater = (x, y, pixels, modified) => {
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
            return true;
        }
        return false;
    }

    const updateFire = (x, y, pixels, modified) => {
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
        if (moved.length) {
            moved.forEach(m => modified[m.x][m.y] = 1);
            return true;
        }
        pixels[x][y] = pixels[x][y] === SMOKE_MAT ? SMOKE_MAT : EMTY_SPACE;
    }

    const updateAcid = (x, y, pixels, modified) => {
        const directions = liquidMoveDir();
        const swapMaterials = [EMTY_SPACE, LAVA_MAT]
        const moveParams = swapMaterials.map(swapMat => ({
            conditionCheck: (mat, chance) => mat === swapMat,
            targetMatIdAfter: ACID_MAT,
            sourceMatIdAfter: swapMat
        }));
        moveParams.push({
            conditionCheck: (mat, chance) => mat === METAL_MAT && chance < 0.09,
            targetMatIdAfter: METAL_MAT,
            sourceMatIdAfter: ACID_MAT
        }, {
            conditionCheck: (mat, chance) => mat !== ACID_MAT && mat !== RAINBOW_MAT && mat !== GLASS_MAT && chance < 0.1,
            targetMatIdAfter: EMTY_SPACE,
            sourceMatIdAfter: EMTY_SPACE
        });
        const moved = moveInDirection(x, y, pixels, directions, moveParams);
        if (moved) {
            modified[moved.x][moved.y] = 1;
            return true;
        }
        return false;
    }

    const updateLava = (x, y, pixels, modified) => {
        let lavaAround = hasMatAround(LAVA_MAT, x, y, pixels);
        if (lavaAround) {
            modified[x][y] = 1;
            return false;
        }
        const directions = liquidMoveDir();
        const moveParams = [{
            conditionCheck: (mat, chance) => mat === EMTY_SPACE,
            targetMatIdAfter: LAVA_MAT,
            sourceMatIdAfter: EMTY_SPACE
        }, {
            conditionCheck: (mat, chance) => (mat === WATER_MAT || mat === SNOW_MAT) && chance < 0.05,
            targetMatIdAfter: LAVA_MAT,
            sourceMatIdAfter: STEAM_MAT
        }, {
            conditionCheck: (mat, chance) => mat === ICE_MAT,
            targetMatIdAfter: LAVA_MAT,
            sourceMatIdAfter: WATER_MAT
        }, {
            conditionCheck: (mat, chance) => mat === ROCK_MAT && chance < 0.099,
            targetMatIdAfter: ROCK_MAT,
            sourceMatIdAfter: LAVA_MAT
        }, {
            conditionCheck: (mat, chance) => mat !== LAVA_MAT && mat !== RAINBOW_MAT && chance < 0.1,
            targetMatIdAfter: FIRE_MAT,
            sourceMatIdAfter: SMOKE_MAT
        }, {
            conditionCheck: (mat, chance) => mat !== LAVA_MAT && mat !== ROCK_MAT && mat !== RAINBOW_MAT && chance < 0.3,
            targetMatIdAfter: FIRE_MAT,
            sourceMatIdAfter: LAVA_MAT
        }]
        const moved = moveInDirection(x, y, pixels, directions, moveParams);
        if (moved) {
            modified[moved.x][moved.y] = 1;
            return true;
        }
    }

    const updatePlant = (x, y, pixels, modified) => {
        let plantsAround = hasMatAround(PLANT_MAT, x, y, pixels);
        if (plantsAround) {
            modified[x][y] = 1;
            return false;
        }
        let woodAround = hasMatAround(WOOD_MAT, x, y, pixels);
        if (woodAround) {
            pixels[x][y] = WOOD_MAT;
            modified[x][y] = 1;
            return false;
        }
        const moveParams = [{
            conditionCheck: (mat, chance) => mat === WATER_MAT && chance < 0.05,
            targetMatIdAfter: PLANT_MAT,
            sourceMatIdAfter: PLANT_MAT
        }]
        const moved = moveInDirection(x, y, pixels, allDirMove, moveParams);
        if (moved) {
            modified[moved.x][moved.y] = 1;
            return true;
        }
        const rand = Math.random();
        if (rand < 0.02) {
            const top = directions.top;
            if (pixels[x + top[0]]) {
                if (pixels[x + top[0]][y + top[1]] === EMTY_SPACE) {
                    pixels[x + top[0]][y + top[1]] = PLANT_MAT;
                    modified[x + top[0]][y + top[1]] = 1;
                    return true;
                }
            }
        } else if (rand < 0.025) {
            const topSide = Math.random() < 0.5 ? directions.left : directions.right;
            if (pixels[x + topSide[0]]) {
                if (pixels[x + topSide[0]][y + topSide[1]] === EMTY_SPACE) {
                    pixels[x + topSide[0]][y + topSide[1]] = PLANT_MAT;
                    modified[x + topSide[0]][y + topSide[1]] = 1;
                    return true;
                }
            }
        } else if (rand < 0.026) {
            pixels[x][y] = WOOD_MAT;
            modified[x][y] = 1;
            return true;
        }
    }

    const updateRainbow = (x, y, pixels, modified) => {
        const directions = liquidMoveDir();
        let moveParams = [{
            conditionCheck: (mat, chance) => mat === EMTY_SPACE,
            targetMatIdAfter: RAINBOW_MAT,
            sourceMatIdAfter: EMTY_SPACE
        }, {
            conditionCheck: (mat, chance) => mat !== RAINBOW_MAT,
            targetMatIdAfter: RAINBOW_MAT,
            sourceMatIdAfter: RAINBOW_MAT
        }];
        const moved = moveInDirection(x, y, pixels, directions, moveParams);
        if (moved) {
            modified[moved.x][moved.y] = 1;
            return true;
        }
        return false;
    }

    const MaterialFactory = function () {
        const materialFactory = {};

        const COLORS_PER_MAT = 7;
        
        materialFactory.createMaterial = (id, name, colors, updateFunction, updateFrequency) => {
            const material = {
                id: id,
                name: name,
                colors: generateMaterialColors(colors, COLORS_PER_MAT),
                rgbColor: getRgbFromHex(colors[0]),
                updateFrequency: updateFrequency || 1,
                update: updateFunction || updateStatic
            }
            return material;
        }

        return materialFactory;
    }

    const Materials = function () {
        const materials = {};

        const materialFactory = new MaterialFactory();        
        materials[WOOD_MAT] = materialFactory.createMaterial(WOOD_MAT, 'Wood', 
            ['#5a2806', '#7e470b', '#66300b', '#7a4408']);
        materials[ROCK_MAT] = materialFactory.createMaterial(ROCK_MAT, 'Rock', 
            ['#2c2b2b', '#383030', '#2c2b2b']);
        materials[METAL_MAT] = materialFactory.createMaterial(METAL_MAT, 'Metal', 
            ['#b5b5b5', '#c6c6c6', '#b5b5b5', '#e7e7e7']);
        materials[GLASS_MAT] = materialFactory.createMaterial(GLASS_MAT, 'Glass', 
            ['#dbe1e3', '#d8e4e9', '#a7c7cb']);
        materials[ICE_MAT] = materialFactory.createMaterial(ICE_MAT, 'Ice', 
            ['#b3e1e3', '#82cfd1', '#f7f7f7']);
        materials[WATER_MAT] = materialFactory.createMaterial(WATER_MAT, 'Water', 
            ['#1ca3ec', '#42d6f7', '#1692d5', '#0a97e3'], updateWater);
        materials[SAND_MAT] = materialFactory.createMaterial(SAND_MAT, 'Sand', 
            ['#e5c69d', '#eacba4', '#e0be91', '#b3a076'], updateSand);
        materials[SNOW_MAT] = materialFactory.createMaterial(SNOW_MAT, 'Snow', 
            ['#f7f2f2', '#f1f1f1', '#e8f2f7'], updateSnow);
        materials[FIRE_MAT] = materialFactory.createMaterial(FIRE_MAT, 'Fire', 
            ['#f70000', '#f75700', '#b02103', '#f7c800'], updateFire, 10);
        materials[SMOKE_MAT] = materialFactory.createMaterial(SMOKE_MAT, 'Smoke', 
            ['#595656', '#696767'], updateSmoke);
        materials[STEAM_MAT] = materialFactory.createMaterial(STEAM_MAT, 'Steam', 
            ['#dfe6ec', '#d9e0e5'], updateSteam);
        materials[ACID_MAT] = materialFactory.createMaterial(ACID_MAT, 'Acid', 
            ['#aab919', '#c5dc14', '#84e810', '#7de208'], updateAcid);
        materials[LAVA_MAT] = materialFactory.createMaterial(LAVA_MAT, 'Lava', 
            ['#f72400', '#f76300', '#c90f1f', '#463a31'], updateLava);
        materials[PLANT_MAT] = materialFactory.createMaterial(PLANT_MAT, 'Plant', 
            ['#57a65e', '#338453', '#5fb766'], updatePlant, 10);
        materials[RAINBOW_MAT] = materialFactory.createMaterial(RAINBOW_MAT, 'Rainbow', 
            ['#4a058f', '#337ac7', '#23be40', '#dedc3d', '#de7800', '#c8131e', '#cb39e0'], updateRainbow);

        return materials;
    };

    return {
        Materials: Materials
    };
})();