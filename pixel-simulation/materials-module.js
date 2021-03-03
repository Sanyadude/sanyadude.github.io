const MaterialsModule = (() => {
    const DirectionsOptions = CoreModule.DirectionsOptions;
    const MovingOptions = CoreModule.MovingOptions;
    const Utils = CoreModule.Utils;

    const randNegToPos = Utils.randNegToPos;

    const directionsObj = DirectionsOptions.directions;
    const sideMoveDir = DirectionsOptions.sideMoveDir;
    const allDirMove = DirectionsOptions.allDirMove;
    const allDirClockwise = DirectionsOptions.allDirClockwise;
    const allDirCounterClockwise = DirectionsOptions.allDirCounterClockwise;

    const getGasMoveDir = DirectionsOptions.getGasMoveDir;
    const getGranuleMoveDir = DirectionsOptions.getGranuleMoveDir;
    const getLiquidMoveDir = DirectionsOptions.getLiquidMoveDir;
    const getRandomDirection = DirectionsOptions.getRandomDirection;

    const moveInDirection = MovingOptions.moveInDirection;
    const spreadInDirection = MovingOptions.spreadInDirection;

    const hasMatAround = MovingOptions.hasMatAround;
    const getEmptyDirections = MovingOptions.getEmptyDirections;

    const swap = MovingOptions.swap;
    const transformTo = MovingOptions.transformTo;

    const awakeNeighbours = MovingOptions.awakeNeighbours;
    const awakeFirstNeighbour = MovingOptions.awakeFirstNeighbour;
    const awakeAllNeighbours = MovingOptions.awakeAllNeighbours;

    const pixelFactory = new CoreModule.PixelFactory;

    const ROCK_MAT = 10;
    const WOOD_MAT = 11;
    const METAL_MAT = 12;
    const GOLD_MAT = 13;
    const GLASS_MAT = 14;
    const ICE_MAT = 15;
    const SAND_MAT = 20;
    const SNOW_MAT = 21;
    const ASH_MAT = 22;
    const GUN_POWDER_MAT = 23;
    const FIRE_MAT = 30;
    const SMOKE_MAT = 40;
    const STEAM_MAT = 41;
    const WATER_MAT = 50;
    const ACID_MAT = 51;
    const LAVA_MAT = 52;
    const OIL_MAT = 53;
    const PLANT_MAT = 60;
    const BLOOM_MAT = 61;
    const RAINBOW_MAT = 70;

    const updateSolid = (currentPixel, x, y, pixels) => currentPixel.sleeping = true;

    const updateGas = (currentPixel, x, y, pixels) => {
        const moveHandlers = [
            {
                conditionCheck: (pixel) => pixel == null,
                success: (newX, newY, chance) => swap(x, y, newX, newY, pixels)
            }
        ];
        const moved = moveInDirection(x, y, pixels, getGasMoveDir(), moveHandlers);
        if (moved) {
            awakeNeighbours(x, y, pixels, allDirMove);
            currentPixel.updated = true;
            currentPixel.sleeping = false;
        } else {
            currentPixel.sleeping = true;
        }
    }

    const updateGranule = (currentPixel, x, y, pixels) => {
        const moveHandlers = [
            {
                conditionCheck: (pixel) => pixel == null,
                success: (newX, newY, chance) => swap(x, y, newX, newY, pixels)
            },
            {
                conditionCheck: (pixel) => pixel.matId == WATER_MAT
                    || pixel.matId == OIL_MAT
                    || pixel.matId == ACID_MAT
                    || pixel.matId == LAVA_MAT
                    || pixel.matId == STEAM_MAT
                    || pixel.matId == SMOKE_MAT,
                success: (newX, newY, chance) => {
                    pixels[newX][newY].updated = true;
                    pixels[newX][newY].sleeping = false;
                    swap(x, y, newX, newY, pixels);
                }
            }
        ];
        const moved = moveInDirection(x, y, pixels, getGranuleMoveDir(), moveHandlers);
        if (moved) {
            const awakeDirections = [directionsObj.top, directionsObj.topLeft, directionsObj.topRight];
            awakeNeighbours(x, y, pixels, awakeDirections);
            currentPixel.updated = true;
            currentPixel.sleeping = false;
        } else {
            currentPixel.sleeping = true;
        }
    }

    const updateWater = (currentPixel, x, y, pixels) => {
        const moveHandlers = [
            {
                conditionCheck: (pixel) => pixel == null,
                success: (newX, newY, chance) => swap(x, y, newX, newY, pixels)
            },
            {
                conditionCheck: (pixel) => pixel.matId == STEAM_MAT
                    || pixel.matId == SMOKE_MAT
                    || pixel.matId == OIL_MAT,
                success: (newX, newY, chance) => {
                    pixels[newX][newY].updated = true;
                    pixels[newX][newY].sleeping = false;
                    swap(x, y, newX, newY, pixels);
                }
            },
            {
                conditionCheck: (pixel) => pixel.matId == LAVA_MAT,
                success: (newX, newY, chance) => {
                    if (chance < 0.5) {
                        pixels[newX][newY] = null;
                    }
                    transformTo(STEAM_MAT, x, y, pixels);
                }
            },
            {
                conditionCheck: (pixel) => pixel.matId == PLANT_MAT,
                success: (newX, newY, chance) => pixels[newX][newY].lifeTime = 0
            },
            {
                conditionCheck: (pixel) => pixel.matId == BLOOM_MAT,
                success: (newX, newY, chance) => {
                    if (chance < 0.99)
                        return;
                    transformTo(PLANT_MAT, x, y, pixels);
                }
            },
            {
                conditionCheck: (pixel) => pixel.matId == ICE_MAT,
                success: (newX, newY, chance) => {
                    if (chance < 0.9)
                        return;
                    transformTo(ICE_MAT, x, y, pixels);
                }
            },
            {
                conditionCheck: (pixel) => pixel.matId == SNOW_MAT,
                success: (newX, newY, chance) => {
                    if (chance < 0.9)
                        return;
                    transformTo(WATER_MAT, newX, newY, pixels);
                }
            }
        ];
        const moved = moveInDirection(x, y, pixels, getLiquidMoveDir(), moveHandlers);
        if (moved) {
            awakeNeighbours(x, y, pixels, allDirMove);
            currentPixel.updated = true;
            currentPixel.sleeping = false;
        } else {
            currentPixel.sleeping = true;
        }
    }

    const updateOil = (currentPixel, x, y, pixels) => {
        const moveHandlers = [
            {
                conditionCheck: (pixel) => pixel == null,
                success: (newX, newY, chance) => swap(x, y, newX, newY, pixels)
            },
            {
                conditionCheck: (pixel) => pixel.matId == STEAM_MAT || pixel.matId == SMOKE_MAT,
                success: (newX, newY, chance) => {
                    pixels[newX][newY].updated = true;
                    pixels[newX][newY].sleeping = false;
                    swap(x, y, newX, newY, pixels);
                }
            },
            {
                conditionCheck: (pixel) => pixel.matId == LAVA_MAT,
                success: (newX, newY, chance) => transformTo(FIRE_MAT, x, y, pixels)
            }
        ];
        const moved = moveInDirection(x, y, pixels, getLiquidMoveDir(), moveHandlers);
        if (moved) {
            awakeNeighbours(x, y, pixels, allDirMove);
            currentPixel.updated = true;
            currentPixel.sleeping = false;
        } else {
            currentPixel.sleeping = true;
        }
    }

    const updateAcid = (currentPixel, x, y, pixels) => {
        const moveHandlers = [
            {
                conditionCheck: (pixel) => pixel == null,
                success: (newX, newY, chance) => swap(x, y, newX, newY, pixels)
            },
            {
                conditionCheck: (pixel) => pixel.matId == STEAM_MAT || pixel.matId == SMOKE_MAT,
                success: (newX, newY, chance) => {
                    pixels[newX][newY].updated = true;
                    pixels[newX][newY].sleeping = false;
                    swap(x, y, newX, newY, pixels);
                }
            },
            {
                conditionCheck: (pixel) => pixel.matId == LAVA_MAT,
                success: (newX, newY, chance) => {
                    pixels[newX][newY].updated = true;
                    pixels[newX][newY].sleeping = false;
                    swap(x, y, newX, newY, pixels);
                }
            },
            {
                conditionCheck: (pixel) => pixel.matId != ACID_MAT
                    && pixel.matId != WATER_MAT
                    && pixel.matId != OIL_MAT
                    && pixel.matId != GLASS_MAT
                    && pixel.matId != RAINBOW_MAT,
                success: (newX, newY, chance) => {
                    if (chance < 0.9)
                        return;
                    pixels[x][y] = null;
                    pixels[newX][newY] = null;
                }
            }
        ];
        const moved = moveInDirection(x, y, pixels, getLiquidMoveDir(), moveHandlers);
        if (moved) {
            awakeNeighbours(x, y, pixels, allDirMove);
            currentPixel.updated = true;
            currentPixel.sleeping = false;
        } else {
            currentPixel.sleeping = true;
        }
    }

    const updateLava = (currentPixel, x, y, pixels) => {
        if (currentPixel.lifeTime < 100 + randNegToPos(90)) {
            const fireSpreadDir = [];
            for (let i = 0; i < 1; i++) {
                fireSpreadDir.push([randNegToPos(3), randNegToPos(3)]);
            }
            const fireSpreadHandlers = [
                {
                    conditionCheck: (pixel) => pixel == null,
                    success: (newX, newY, chance) => pixels[newX][newY] = pixelFactory.create(FIRE_MAT)
                }
            ];
            moveInDirection(x, y, pixels, fireSpreadDir, fireSpreadHandlers);
        }
        const moveHandlers = [
            {
                conditionCheck: (pixel) => pixel == null,
                success: (newX, newY, chance) => swap(x, y, newX, newY, pixels)
            },
            {
                conditionCheck: (pixel) => pixel.matId == FIRE_MAT,
                success: (newX, newY, chance) => swap(x, y, newX, newY, pixels)
            },
            {
                conditionCheck: (pixel) => pixel.matId == STEAM_MAT || pixel.matId == SMOKE_MAT,
                success: (newX, newY, chance) => {
                    pixels[newX][newY].updated = true;
                    pixels[newX][newY].sleeping = false;
                    swap(x, y, newX, newY, pixels);
                }
            },
            {
                conditionCheck: (pixel) => pixel.matId == WATER_MAT || pixel.matId == SNOW_MAT,
                success: (newX, newY, chance) => {
                    if (chance < 0.3) {
                        pixels[x][y] = null;
                    }
                    transformTo(STEAM_MAT, newX, newY, pixels);
                    swap(x, y, newX, newY, pixels);
                }
            },
            {
                conditionCheck: (pixel) => pixel.matId == ICE_MAT,
                success: (newX, newY, chance) => {
                    transformTo(WATER_MAT, newX, newY, pixels);
                    swap(x, y, newX, newY, pixels);
                }
            },
            {
                conditionCheck: (pixel) => pixel.matId != LAVA_MAT
                    && pixel.matId != ROCK_MAT
                    && pixel.matId != RAINBOW_MAT,
                success: (newX, newY, chance) => {
                    if (chance < 0.7)
                        return;
                    if (chance < 0.71) {
                        transformTo(FIRE_MAT, newX, newY, pixels);
                        pixels[x][y] = null;
                    } else {
                        transformTo(SMOKE_MAT, newX, newY, pixels);
                    }
                }
            }
        ];
        const moved = moveInDirection(x, y, pixels, getLiquidMoveDir(), moveHandlers);
        if (moved) {
            awakeNeighbours(x, y, pixels, allDirMove);
            currentPixel.updated = true;
            currentPixel.sleeping = false;
        } else {
            currentPixel.sleeping = true;
        }
    }

    const updateFire = (currentPixel, x, y, pixels) => {
        const spreadHandlers = [
            {
                conditionCheck: (pixel) => pixel == null,
                success: (newX, newY, chance) => {}
            },
            {
                conditionCheck: (pixel) => pixel.matId == WATER_MAT,
                success: (newX, newY, chance) => {
                    if (chance > 0.3)
                        return;
                    transformTo(STEAM_MAT, newX, newY, pixels);
                    pixels[x][y] = null;
                }
            },
            {
                conditionCheck: (pixel) => pixel.matId == ICE_MAT || pixel.matId == SNOW_MAT,
                success: (newX, newY, chance) => {
                    transformTo(WATER_MAT, newX, newY, pixels);
                    pixels[x][y] = null;
                }
            },
            {
                conditionCheck: (pixel) => pixel.matId == SAND_MAT,
                success: (newX, newY, chance) => {
                    transformTo(GLASS_MAT, newX, newY, pixels);
                    if (chance < 0.3) {
                        currentPixel.lifeTime = 0;
                        swap(x, y, newX, newY, pixels);
                    }
                }
            },
            {
                conditionCheck: (pixel) => pixel.matId == WOOD_MAT,
                success: (newX, newY, chance) => {
                    if (chance < 0.01) {
                        transformTo(ASH_MAT, newX, newY, pixels)
                        swap(x, y, newX, newY, pixels);
                    } else if (chance < 0.02) {
                        transformTo(FIRE_MAT, newX, newY, pixels)
                    } else if (chance < 0.5) {
                        if (pixels[x - 1]) {
                            if (pixels[x - 1][y] === null && chance < 0.05) {
                                pixels[x - 1][y] = pixelFactory.create(SMOKE_MAT);
                            }
                        }
                    }
                    currentPixel.lifeTime = 0;
                }
            },
            {
                conditionCheck: (pixel) => pixel.matId == PLANT_MAT || pixel.matId == BLOOM_MAT,
                success: (newX, newY, chance) => {
                    if (chance < 0.02) {
                        transformTo(ASH_MAT, newX, newY, pixels)
                        swap(x, y, newX, newY, pixels);
                    } else if (chance < 0.1) {
                        transformTo(FIRE_MAT, newX, newY, pixels)
                    } else if (chance < 0.8) {
                        if (pixels[x - 1]) {
                            if (pixels[x - 1][y] === null && chance < 0.01) {
                                pixels[x - 1][y] = pixelFactory.create(SMOKE_MAT);
                            }
                        }
                    }
                    currentPixel.lifeTime = 0;
                }
            },
            {
                conditionCheck: (pixel) => pixel.matId == GUN_POWDER_MAT || pixel.matId == OIL_MAT,
                success: (newX, newY, chance) => {
                    if (chance < 0.1)
                        return;
                    transformTo(FIRE_MAT, newX, newY, pixels);
                    //transformTo(SMOKE_MAT, x, y, pixels);
                    if (chance < 0.6)
                        return;
                    if (pixels[x - 1]) {
                        if (pixels[x - 1][y] === null)
                            pixels[x - 1][y] = pixelFactory.create(SMOKE_MAT);
                        if (pixels[x - 1][y - 1] === null)
                            pixels[x - 1][y - 1] = pixelFactory.create(SMOKE_MAT);
                        if (pixels[x - 1][y + 1] === null)
                            pixels[x - 1][y + 1] = pixelFactory.create(SMOKE_MAT);
                    }
                }
            }
        ];
        const fireSpreadDir = sideMoveDir.slice(0, 4);
        for (let i = 0; i < 4; i++) {
            fireSpreadDir.push([randNegToPos(2), randNegToPos(2)]);
        }
        spreadInDirection(x, y, pixels, fireSpreadDir, spreadHandlers);
        if (currentPixel.lifeTime > 4) {
            pixels[x][y] = null;
            awakeNeighbours(x, y, pixels, allDirMove);
        }
    }

    const updatePlant = (currentPixel, x, y, pixels) => {
        if (!currentPixel.growDir) {
            currentPixel.growDir = Math.floor(Math.random() * 8);
        }
        const growDirection = allDirClockwise[currentPixel.growDir];
        const growHandlers = [
            {
                conditionCheck: (pixel) => pixel == null,
                success: (newX, newY, chance) => {
                    if (chance < 0.005) {
                        pixels[newX][newY] = pixelFactory.create(BLOOM_MAT);
                    } else if (chance < 0.05) {
                        const randDirStep = (Math.floor(Math.random() * 10) % 3) - 1;
                        const currentGrow = currentPixel.growDir;
                        let newGrowDir = currentGrow + randDirStep;
                        pixels[newX][newY] = pixelFactory.create(PLANT_MAT);
                        pixels[newX][newY].growDir = newGrowDir > 7 ? 0 : (newGrowDir < 0 ? 7 : newGrowDir);
                    }
                }
            }
        ];
        const growed = moveInDirection(x, y, pixels, [growDirection], growHandlers);
        const moveHandlers = [
            {
                conditionCheck: (pixel) => pixel == null,
                success: (newX, newY, chance) => { }
            },
            {
                conditionCheck: (pixel) => pixel.matId == WATER_MAT,
                success: (newX, newY, chance) => {
                    if (chance < 0.99)
                        return;
                    transformTo(PLANT_MAT, newX, newY, pixels);
                }
            },
            {
                conditionCheck: (pixel) => pixel.matId == WOOD_MAT,
                success: (newX, newY, chance) => {
                    if (chance < 0.999)
                        return;
                    transformTo(WOOD_MAT, x, y, pixels);
                }
            }
        ];
        const moved = moveInDirection(x, y, pixels, allDirMove, moveHandlers);
        if (growed || moved) {
            awakeNeighbours(x, y, pixels, allDirMove);
            currentPixel.updated = true;
        }
    }

    const updateBloom = (currentPixel, x, y, pixels) => {
        let growed = false;
        if (currentPixel.lifeTime < 2) {
            const growHandlers = [
                {
                    conditionCheck: (pixel) => pixel == null,
                    success: (newX, newY, chance) => {
                        pixels[newX][newY] = pixelFactory.create(BLOOM_MAT);
                        pixels[newX][newY].lifeTime = currentPixel.lifeTime;
                    }
                }
            ];
            growed = spreadInDirection(x, y, pixels, sideMoveDir, growHandlers);
        }
        const moveHandlers = [
            {
                conditionCheck: (pixel) => pixel == null,
                success: (newX, newY, chance) => {
                    if (chance < 0.9)
                        return;
                    pixels[newX][newY] = pixelFactory.create(PLANT_MAT);
                }
            }
        ];
        const moved = moveInDirection(x, y, pixels, [getRandomDirection()], moveHandlers);
        if (growed || moved) {
            awakeNeighbours(x, y, pixels, allDirMove);
            currentPixel.updated = true;
        }
    }

    const updateRainbow = (currentPixel, x, y, pixels) => {
        const moveHandlers = [
            {
                conditionCheck: (pixel) => pixel == null,
                success: (newX, newY, chance) => swap(x, y, newX, newY, pixels)
            },
            {
                conditionCheck: (pixel) => pixel.matId != RAINBOW_MAT,
                success: (newX, newY, chance) => transformTo(RAINBOW_MAT, newX, newY, pixels)
            }
        ];
        const moved = moveInDirection(x, y, pixels, getLiquidMoveDir(), moveHandlers);
        if (moved) {
            awakeNeighbours(x, y, pixels, allDirMove);
            currentPixel.updated = true;
            currentPixel.sleeping = false;
        } else {
            currentPixel.sleeping = true;
        }
    }

    const isPlantAlive = (pixel, row, col, pixelsArray) => {
        if (pixel.lifeTime > 200 + randNegToPos(50)) {
            pixel.sleeping = true;
            pixel.prevSleeping = true;
            pixel.updated = true;
            return true;
        }

        return true;
    }

    const isBloomAlive = (pixel, row, col, pixelsArray) => {
        if (pixel.lifeTime > 20) {
            pixel.sleeping = true;
            pixel.prevSleeping = true;
            pixel.updated = true;
            return true;
        }

        return true;
    }

    const isGasAlive = (pixel, row, col, pixelsArray) => {
        if (pixel.lifeTime > 1000 + randNegToPos(500)) {
            pixelsArray[row][col] = null;
            return true;
        }

        return true;
    }

    const isLavaAlive = (pixel, row, col, pixelsArray) => {
        if (pixel.sleeping && pixel.lifeTime > 1000 + randNegToPos(300)) {
            pixel.lifeTime = 0;
            pixel.matId = ROCK_MAT;
            pixel.prevSleeping = false;
            pixel.sleeping = false;
            return true;
        }

        return true;
    }

    const MaterialsPack = (() => {
        const COLORS_PER_MAT = 7;
        const materialPackage = new CoreModule.MaterialsPackage(COLORS_PER_MAT);

        materialPackage.addMaterial(WOOD_MAT, 'Wood',
            ['#5a2806', '#7e470b', '#66300b', '#7a4408'], updateSolid);
        materialPackage.addMaterial(ROCK_MAT, 'Rock',
            ['#2d2c2c', '#3a3232', '#493c3c'], updateSolid);
        materialPackage.addMaterial(METAL_MAT, 'Metal',
            ['#b5b5b5', '#c6c6c6', '#b5b5b5', '#e7e7e7'], updateSolid);
        materialPackage.addMaterial(GOLD_MAT, 'Gold',
            ['#f7b900', '#f7c93e', '#b9962e'], updateSolid);
        materialPackage.addMaterial(GLASS_MAT, 'Glass',
            ['#dbe1e3', '#d8e4e9', '#a7c7cb'], updateSolid);
        materialPackage.addMaterial(ICE_MAT, 'Ice',
            ['#b3e1e3', '#82cfd1', '#b3e1e3', '#82cfd1', '#f7f7f7'], updateSolid);
        materialPackage.addMaterial(PLANT_MAT, 'Plant',
            ['#57a65e', '#338453', '#5fb766'], updatePlant, {
            isAlive: isPlantAlive
        });
        materialPackage.addMaterial(BLOOM_MAT, 'Bloom',
            ['#db9cbb', '#f0c4e7', '#c26392'], updateBloom, {
                isAlive: isBloomAlive
            });
        materialPackage.addMaterial(SAND_MAT, 'Sand',
            ['#e5c69d', '#eacba4', '#e0be91', '#b3a076'], updateGranule);
        materialPackage.addMaterial(GUN_POWDER_MAT, 'Gun powder',
            ['#575661', '#6a6971'], updateGranule);
        materialPackage.addMaterial(SNOW_MAT, 'Snow',
            ['#f7f2f2', '#f1f1f1', '#e8f2f7'], updateGranule, {
            updateFrequency: 2
        });
        materialPackage.addMaterial(ASH_MAT, 'Ash',
            ['#9b9897', '#989586', '#727064'], updateGranule, {
            updateFrequency: 2
        });
        materialPackage.addMaterial(SMOKE_MAT, 'Smoke',
            ['#595656', '#696767'], updateGas, {
            isAlive: isGasAlive
        });
        materialPackage.addMaterial(STEAM_MAT, 'Steam',
            ['#dfe6ec', '#d9e0e5'], updateGas, {
            isAlive: isGasAlive
        });
        materialPackage.addMaterial(WATER_MAT, 'Water',
            ['#1ca3ec', '#1692d5'], updateWater);
        materialPackage.addMaterial(ACID_MAT, 'Acid',
            ['#aab919', '#c5dc14', '#84e810', '#7de208'], updateAcid);
        materialPackage.addMaterial(LAVA_MAT, 'Lava',
            ['#f72400', '#f76300', '#c90f1f', '#463a31'], updateLava, {
            isAlive: isLavaAlive
        });
        materialPackage.addMaterial(OIL_MAT, 'Oil',
            ['#353834'], updateOil);
        materialPackage.addMaterial(RAINBOW_MAT, 'Rainbow',
            ['#cb39e0', '#4a058f', '#337ac7', '#23be40', '#dedc3d', '#de7800', '#c8131e'], updateRainbow, {
            specialBehavior: true
        });
        materialPackage.addMaterial(FIRE_MAT, 'Fire',
            ['#f70000', '#f75700', '#f7c800'], updateFire, {
            specialBehavior: true
        });

        return materialPackage;
    })();

    return {
        MaterialsPack: MaterialsPack
    };
})();