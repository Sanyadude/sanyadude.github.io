const CoreModule = (() => {
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

    const randNegToPos = (number) => Math.ceil(Math.random() * number) * (Math.round(Math.random()) ? 1 : -1);

    const MaterialFactory = function (maxColors) {
        const materialFactory = {};

        materialFactory.create = (id, name, colors, updateFunc, options) => {
            options = options || {};
            const material = {
                id: id,
                name: name,
                colors: generateMaterialColors(colors, maxColors),
                rgbColor: getRgbFromHex(colors[0]),
                update: updateFunc,
                updateFrequency: options.updateFrequency || 1,
                isAlive: options.isAlive || (() => true),
                specialBehavior: options.specialBehavior || false
            }
            return material;
        }

        return materialFactory;
    }

    const MaterialsPackage = function (maxColors) {
        const materialPackage = {};
        const materials = {};

        const materialFactory = new CoreModule.MaterialFactory(maxColors);

        materialPackage.getMaxColors = () => maxColors;
        materialPackage.addMaterial = (id, name, colors, updateFunc, options) => {
            materials[id] = materialFactory.create(id, name, colors, updateFunc, options);
        };
        materialPackage.removeMaterial = (material) => delete materials[material.id];
        materialPackage.getMaterials = () => materials;
        materialPackage.getMatColor = (id, index) => materials[id].colors[index];

        materialPackage.update = (pixel, row, col, pixelsArray, tick) => {
            if (!materials[pixel.matId].isAlive(pixel, row, col, pixelsArray))
                return false;
            if (!pixel.updated && !pixel.sleeping && (tick % materials[pixel.matId].updateFrequency == 0)) {
                materials[pixel.matId].update(pixel, row, col, pixelsArray);
                return true;
            }
            return false;
        };

        return materialPackage;
    };

    const PixelFactory = function () {
        const pixelFactory = {};

        pixelFactory.create = (id) => {
            const pixel = {
                matId: id,
                updated: false,
                sleeping: false,
                prevSleeping: false,
                lifeTime: 0
            }
            return pixel;
        }

        return pixelFactory;
    }

    //dx, dy
    const directions = {
        topLeft: [-1, -1], top: [-1, 0], topRight: [-1, 1],
        left: [0, -1], center: [0, 0], right: [0, 1],
        bottomLeft: [1, -1], bottom: [1, 0], bottomRight: [1, 1]
    }
    const sideMoveDir = [directions.top, directions.bottom, directions.left, directions.right];
    const allDirMove = [directions.topLeft, directions.top, directions.topRight, directions.left, directions.right, directions.bottomLeft, directions.bottom, directions.bottomRight];

    const allDirClockwise = [directions.left, directions.topLeft, directions.top, directions.topRight, directions.right, directions.bottomRight, directions.bottom, directions.bottomLeft];
    const allDirCounterClockwise = allDirClockwise.reverse();

    const randomDirection = () => allDirMove[Math.floor(Math.random() * allDirMove.length)];

    const granuleMoveDir = () => {
        const chance = Math.random();
        return chance > 0.7 ? [directions.bottom] : (chance < 0.5
            ? [directions.bottom, directions.bottomLeft, directions.bottomRight]
            : [directions.bottom, directions.bottomRight, directions.bottomLeft])
    };

    const liquidMoveDir = () => Math.random() < 0.5
        ? [directions.bottom, directions.bottomLeft, directions.bottomRight, directions.left, directions.right]
        : [directions.bottom, directions.bottomRight, directions.bottomLeft, directions.right, directions.left];

    const gasMoveDir = () => Math.random() < 0.5
        ? [directions.top, directions.topLeft, directions.topRight, directions.left, directions.right]
        : [directions.top, directions.topRight, directions.topLeft, directions.right, directions.left];

    const hasMatAround = (matId, x, y, pixels) => {
        for (let i = 0; i < allDirMove.length; i++) {
            const dir = allDirMove[i];
            if (pixels[x + dir[0]]) {
                if (pixels[x + dir[0]][y + dir[1]] == null) {
                    return false;
                }
                if (pixels[x + dir[0]][y + dir[1]].matId !== matId) {
                    return false;
                }
            }
        }
        return true
    }

    const getEmptyDirections = (x, y, pixels) => {
        const directionsClockwise = [directions.left,
        directions.topLeft,
        directions.top,
        directions.topRight,
        directions.right,
        directions.bottomRight,
        directions.bottom,
        directions.bottomLeft];
        const emptyDirections = [];
        for (let i = 0; i < directionsClockwise.length; i++) {
            const prevDir = i == 0
                ? directionsClockwise[directionsClockwise.length - 1]
                : directionsClockwise[i - 1];
            const dir = directionsClockwise[i];
            const nextDir = i == directionsClockwise.length - 1
                ? directionsClockwise[0]
                : directionsClockwise[i + 1];
            if (pixels[x + dir[0]] && pixels[x + prevDir[0]] && pixels[x + nextDir[0]]) {
                if (pixels[x + dir[0]][y + dir[1]] == null
                    && pixels[x + dir[0]][y + dir[1]] == null
                    && pixels[x + dir[0]][y + dir[1]] == null) {
                    emptyDirections.push(dir);
                }
            }
        }
        return emptyDirections;
    }

    const moveInDirection = (x, y, pixels, directions, moveHandlers) => {
        for (let i = 0; i < directions.length; i++) {
            const xDir = x + directions[i][0];
            const yDir = y + directions[i][1];
            if (!pixels[xDir])
                continue;
            if (pixels[xDir][yDir] === undefined)
                continue;
            const chance = Math.random();
            for (let j = 0; j < moveHandlers.length; j++) {
                const moveHandler = moveHandlers[j];
                if (!moveHandler.conditionCheck(pixels[xDir][yDir]))
                    continue;
                moveHandler.success(xDir, yDir, chance);
                return true;
            }
        }
        return false;
    }

    const spreadInDirection = (x, y, pixels, directions, spreadHandlers) => {
        let spreaded = false;
        for (let i = 0; i < directions.length; i++) {
            const xDir = x + directions[i][0];
            const yDir = y + directions[i][1];
            if (!pixels[xDir])
                continue;
            if (pixels[xDir][yDir] === undefined)
                continue;
            const chance = Math.random();
            for (let j = 0; j < spreadHandlers.length; j++) {
                const spreadHandler = spreadHandlers[j];
                if (pixels[x][y] !== null && spreadHandler.conditionCheck(pixels[xDir][yDir])) {
                    spreadHandler.success(xDir, yDir, chance);
                    spreaded = true;
                    break;
                }
            }
        }
        return spreaded;
    }

    const swap = (x1, y1, x2, y2, pixels) => {
        const temp = pixels[x2][y2];
        pixels[x2][y2] = pixels[x1][y1];
        pixels[x1][y1] = temp;
    }

    const transformTo = (matId, x, y, pixels) => {
        pixels[x][y].matId = matId;
        pixels[x][y].updated = true;
        pixels[x][y].sleeping = false;
        pixels[x][y].lifeTime = 0;
    }

    const awakeFirstNeighbour = (x, y, pixels, directions) => {
        for (let i = 0; i < directions.length; i++) {
            const xDir = x + directions[i][0];
            const yDir = y + directions[i][1];
            if (!pixels[xDir])
                continue;
            if (pixels[xDir][yDir] === undefined || pixels[xDir][yDir] == null)
                continue;
            pixels[xDir][yDir].sleeping = false;
            return;
        }
    }

    const awakeNeighbours = (x, y, pixels, directions) => {
        for (let i = 0; i < directions.length; i++) {
            const xDir = x + directions[i][0];
            const yDir = y + directions[i][1];
            if (!pixels[xDir])
                continue;
            if (pixels[xDir][yDir] === undefined || pixels[xDir][yDir] == null)
                continue;
            pixels[xDir][yDir].sleeping = false;
        }
    }

    const awakeAllNeighbours = (x, y, pixels) => awakeNeighbours(x, y, pixels, allDirMove);

    const Utils = {
        randNegToPos: randNegToPos
    }

    const DirectionsOptions = {
        //directions as object
        directions: directions,
        //directions arrays
        sideMoveDir: sideMoveDir,
        allDirMove: allDirMove,
        allDirClockwise: allDirClockwise,
        allDirCounterClockwise: allDirCounterClockwise,
        //methods that return directions array
        getRandomDirection: randomDirection,
        getGranuleMoveDir: granuleMoveDir,
        getLiquidMoveDir: liquidMoveDir,
        getGasMoveDir: gasMoveDir
    }

    const MovingOptions = {
        //awake methods for neighbour pixels
        awakeNeighbours: awakeNeighbours,
        awakeFirstNeighbour: awakeFirstNeighbour,
        awakeAllNeighbours: awakeAllNeighbours,
        //check if mat around
        hasMatAround: hasMatAround,
        getEmptyDirections: getEmptyDirections,
        //move methods
        moveInDirection: moveInDirection,
        spreadInDirection: spreadInDirection,
        swap: swap,
        transformTo: transformTo
    }

    return {
        MaterialsPackage: MaterialsPackage,
        MaterialFactory: MaterialFactory,
        PixelFactory: PixelFactory,
        DirectionsOptions: DirectionsOptions,
        MovingOptions: MovingOptions,
        Utils: Utils
    };
})();