const MaterialsModule = (() => {
    const DirectionsOptions = CoreModule.DirectionsOptions;
    const MovingOptions = CoreModule.MovingOptions;

    const directionsObj = DirectionsOptions.directions;

    const moveInDirection = MovingOptions.moveInDirection;
    const spreadInDirection = MovingOptions.spreadInDirection;
    const hasMatAround = MovingOptions.hasMatAround;
    const swap = MovingOptions.swap;
    const transformTo = MovingOptions.transformTo;
    const awakeNeighbours = MovingOptions.awakeNeighbours;
    const awakeFirstNeighbour = MovingOptions.awakeFirstNeighbour;
    const awakeAllNeighbours = MovingOptions.awakeAllNeighbours;

    const pixelFactory = new CoreModule.PixelFactory;
    const materialFactory = new CoreModule.MaterialFactory;

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
                conditionCheck: (pixel, chance) => pixel == null,
                success: (newX, newY) => swap(x, y, newX, newY, pixels)
            }
        ];
        const moved = moveInDirection(x, y, pixels, DirectionsOptions.getGasMoveDir(), moveHandlers);
        if (moved) {
            const awakeDirections = DirectionsOptions.allDirMove;
            awakeNeighbours(x, y, pixels, awakeDirections);
            currentPixel.updated = true;
            currentPixel.sleeping = false;
        } else {
            currentPixel.sleeping = true;
        }
    }

    const updateGranule = (currentPixel, x, y, pixels) => {
        const moveHandlers = [
            {
                conditionCheck: (pixel, chance) => pixel == null,
                success: (newX, newY) => swap(x, y, newX, newY, pixels)
            },
            {
                conditionCheck: (pixel, chance) => pixel.matId == WATER_MAT
                    || pixel.matId == OIL_MAT
                    || pixel.matId == ACID_MAT
                    || pixel.matId == LAVA_MAT
                    || pixel.matId == STEAM_MAT
                    || pixel.matId == SMOKE_MAT,
                success: (newX, newY) => {
                    pixels[newX][newY].updated = true;
                    pixels[newX][newY].sleeping = false;
                    swap(x, y, newX, newY, pixels);
                }
            }
        ];
        const moved = moveInDirection(x, y, pixels, DirectionsOptions.getGranuleMoveDir(), moveHandlers);
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
                conditionCheck: (pixel, chance) => pixel == null,
                success: (newX, newY) => swap(x, y, newX, newY, pixels)
            },
            {
                conditionCheck: (pixel, chance) => pixel.matId == STEAM_MAT || pixel.matId == SMOKE_MAT,
                success: (newX, newY) => {
                    pixels[newX][newY].updated = true;
                    pixels[newX][newY].sleeping = false;
                    swap(x, y, newX, newY, pixels);
                }
            },
            {
                conditionCheck: (pixel, chance) => pixel.matId == LAVA_MAT,
                success: (newX, newY) => transformTo(STEAM_MAT, x, y, pixels)
            },
            {
                conditionCheck: (pixel, chance) => pixel.matId == ICE_MAT && chance < 0.1,
                success: (newX, newY) => transformTo(ICE_MAT, x, y, pixels)
            },
            {
                conditionCheck: (pixel, chance) => pixel.matId == SNOW_MAT && chance < 0.1,
                success: (newX, newY) => transformTo(WATER_MAT, newX, newY, pixels)
            }
        ];
        const moved = moveInDirection(x, y, pixels, DirectionsOptions.getLiquidMoveDir(), moveHandlers);
        if (moved) {
            const awakeDirections = DirectionsOptions.allDirMove;
            awakeNeighbours(x, y, pixels, awakeDirections);
            currentPixel.updated = true;
            currentPixel.sleeping = false;
        } else {
            currentPixel.sleeping = true;
        }
    }

    const updateOil = (currentPixel, x, y, pixels) => {
        const moveHandlers = [
            {
                conditionCheck: (pixel, chance) => pixel == null,
                success: (newX, newY) => swap(x, y, newX, newY, pixels)
            },
            {
                conditionCheck: (pixel, chance) => pixel.matId == STEAM_MAT || pixel.matId == SMOKE_MAT,
                success: (newX, newY) => {
                    pixels[newX][newY].updated = true;
                    pixels[newX][newY].sleeping = false;
                    swap(x, y, newX, newY, pixels);
                }
            },
            {
                conditionCheck: (pixel, chance) => pixel.matId == LAVA_MAT,
                success: (newX, newY) => transformTo(FIRE_MAT, x, y, pixels)
            }
        ];
        const moved = moveInDirection(x, y, pixels, DirectionsOptions.getLiquidMoveDir(), moveHandlers);
        if (moved) {
            const awakeDirections = DirectionsOptions.allDirMove;
            awakeNeighbours(x, y, pixels, awakeDirections);
            currentPixel.updated = true;
            currentPixel.sleeping = false;
        } else {
            currentPixel.sleeping = true;
        }
    }

    const updateAcid = (currentPixel, x, y, pixels) => {
        const moveHandlers = [
            {
                conditionCheck: (pixel, chance) => pixel == null,
                success: (newX, newY) => swap(x, y, newX, newY, pixels)
            },
            {
                conditionCheck: (pixel, chance) => pixel.matId == STEAM_MAT || pixel.matId == SMOKE_MAT,
                success: (newX, newY) => {
                    pixels[newX][newY].updated = true;
                    pixels[newX][newY].sleeping = false;
                    swap(x, y, newX, newY, pixels);
                }
            },
            {
                conditionCheck: (pixel, chance) => pixel.matId == LAVA_MAT,
                success: (newX, newY) => {
                    pixels[newX][newY].updated = true;
                    pixels[newX][newY].sleeping = false;
                    swap(x, y, newX, newY, pixels);
                }
            },
            {
                conditionCheck: (pixel, chance) => pixel.matId !== ACID_MAT
                    && pixel.matId !== WATER_MAT
                    && pixel.matId !== OIL_MAT
                    && pixel.matId !== GLASS_MAT
                    && pixel.matId !== RAINBOW_MAT
                    && chance < 0.1,
                success: (newX, newY) => {
                    pixels[x][y] = null;
                    pixels[newX][newY] = null;
                }
            }
        ];
        const moved = moveInDirection(x, y, pixels, DirectionsOptions.getLiquidMoveDir(), moveHandlers);
        if (moved) {
            const awakeDirections = DirectionsOptions.allDirMove;
            awakeNeighbours(x, y, pixels, awakeDirections);
            currentPixel.updated = true;
            currentPixel.sleeping = false;
        } else {
            currentPixel.sleeping = true;
        }
    }

    const updateLava = (currentPixel, x, y, pixels) => {
        const shouldAnnihilate = Math.random() < 0.2;
        const moveHandlers = [
            {
                conditionCheck: (pixel, chance) => pixel == null,
                success: (newX, newY) => swap(x, y, newX, newY, pixels)
            },
            {
                conditionCheck: (pixel, chance) => pixel.matId == STEAM_MAT || pixel.matId == SMOKE_MAT,
                success: (newX, newY) => {
                    pixels[newX][newY].updated = true;
                    pixels[newX][newY].sleeping = false;
                    swap(x, y, newX, newY, pixels);
                }
            },
            {
                conditionCheck: (pixel, chance) => (pixel.matId === WATER_MAT || pixel.matId === SNOW_MAT),
                success: (newX, newY) => {
                    transformTo(STEAM_MAT, newX, newY, pixels);
                    swap(x, y, newX, newY, pixels);
                }
            },
            {
                conditionCheck: (pixel, chance) => pixel.matId === ICE_MAT,
                success: (newX, newY) => {
                    transformTo(WATER_MAT, newX, newY, pixels);
                    swap(x, y, newX, newY, pixels);
                }
            },
            {
                conditionCheck: (pixel, chance) => pixel.matId !== LAVA_MAT
                    && pixel.matId !== ROCK_MAT
                    && pixel.matId !== RAINBOW_MAT
                    && chance < 0.3,
                success: (newX, newY) => {
                    if (shouldAnnihilate) {
                        transformTo(FIRE_MAT, newX, newY, pixels);
                        pixels[x][y] = null;
                    } else {
                        transformTo(SMOKE_MAT, newX, newY, pixels);
                    }
                }
            }
        ];
        const moved = moveInDirection(x, y, pixels, DirectionsOptions.getLiquidMoveDir(), moveHandlers);
        if (moved) {
            const awakeDirections = DirectionsOptions.allDirMove;
            awakeNeighbours(x, y, pixels, awakeDirections);
            currentPixel.updated = true;
            currentPixel.sleeping = false;
        } else {
            currentPixel.sleeping = true;
        }
    }

    const updateRainbow = (currentPixel, x, y, pixels) => {
        const moveHandlers = [
            {
                conditionCheck: (pixel, chance) => pixel == null,
                success: (newX, newY) => swap(x, y, newX, newY, pixels)
            },
            {
                conditionCheck: (pixel, chance) => pixel.matId !== RAINBOW_MAT,
                success: (newX, newY) => transformTo(RAINBOW_MAT, newX, newY, pixels)
            }
        ];
        const moved = moveInDirection(x, y, pixels, DirectionsOptions.getLiquidMoveDir(), moveHandlers);
        if (moved) {
            const awakeDirections = DirectionsOptions.allDirMove;
            awakeNeighbours(x, y, pixels, awakeDirections);
            currentPixel.updated = true;
            currentPixel.sleeping = false;
        } else {
            currentPixel.sleeping = true;
        }
    }

    const updateFire = (currentPixel, x, y, pixels) => {
        const moveHandlers = [
            {
                conditionCheck: (pixel, chance) => pixel.matId == WATER_MAT && chance < 0.3,
                success: (newX, newY) => {
                    transformTo(STEAM_MAT, newX, newY, pixels);
                    pixels[x][y] = null;
                }
            },
            {
                conditionCheck: (pixel, chance) => pixel.matId == ICE_MAT || pixel.matId == SNOW_MAT,
                success: (newX, newY) => {
                    transformTo(WATER_MAT, newX, newY, pixels);
                    pixels[x][y] = null;
                }
            },
            {
                conditionCheck: (pixel, chance) => pixel.matId == SAND_MAT,
                success: (newX, newY) => {
                    const chance = Math.random();
                    transformTo(GLASS_MAT, newX, newY, pixels);
                    if (chance < 0.3) {
                        currentPixel.lifeTime = 0;
                        swap(x, y, newX, newY, pixels);
                    }
                }
            },
            {
                conditionCheck: (pixel, chance) => pixel.matId == WOOD_MAT,
                success: (newX, newY) => {
                    const chance = Math.random();
                    if (chance < 0.01) {
                        transformTo(ASH_MAT, newX, newY, pixels)
                        currentPixel.lifeTime = 0;
                        swap(x, y, newX, newY, pixels);
                    } else if (chance < 0.02) {
                        transformTo(FIRE_MAT, newX, newY, pixels)
                    } else if (chance < 0.5) {
                        if (pixels[x - 1]) {
                            if (pixels[x - 1][y] == null && chance < 0.05) {
                                pixels[x - 1][y] = pixelFactory.create(SMOKE_MAT);
                            }
                        }
                        currentPixel.lifeTime = 0;
                    }
                }
            },
            {
                conditionCheck: (pixel, chance) => pixel.matId == PLANT_MAT || pixel.matId == BLOOM_MAT,
                success: (newX, newY) => {
                    const chance = Math.random();
                    if (chance < 0.02) {
                        transformTo(ASH_MAT, newX, newY, pixels)
                        currentPixel.lifeTime = 0;
                        swap(x, y, newX, newY, pixels);
                    } else if (chance < 0.1) {
                        transformTo(FIRE_MAT, newX, newY, pixels)
                    } else if (chance < 0.8) {
                        if (pixels[x - 1]) {
                            if (pixels[x - 1][y] === null && chance < 0.01) {
                                pixels[x - 1][y] = pixelFactory.create(SMOKE_MAT);
                            }
                        }
                        currentPixel.lifeTime = 0;
                    }
                }
            },
            {
                conditionCheck: (pixel, chance) => (pixel.matId == GUN_POWDER_MAT
                    || pixel.matId == OIL_MAT) && chance < 0.9,
                success: (newX, newY) => {
                    const chance = Math.random();
                    transformTo(FIRE_MAT, newX, newY, pixels);
                    transformTo(SMOKE_MAT, x, y, pixels);
                    if (chance < 0.5)
                        return
                    if (pixels[x - 1]) {
                        if (pixels[x - 1][y] == null)
                            pixels[x - 1][y] = pixelFactory.create(SMOKE_MAT);
                        if (pixels[x - 1][y - 1] == null)
                            pixels[x - 1][y - 1] = pixelFactory.create(SMOKE_MAT);
                        if (pixels[x - 1][y + 1] == null)
                            pixels[x - 1][y + 1] = pixelFactory.create(SMOKE_MAT);
                    }
                }
            }
        ];
        const spreaded = spreadInDirection(x, y, pixels, DirectionsOptions.sideMoveDir, moveHandlers);
        if (!spreaded && pixels[x][y].lifeTime > 3) {
            pixels[x][y] = null;
            const awakeDirections = DirectionsOptions.allDirMove;
            awakeNeighbours(x, y, pixels, awakeDirections);
        }
    }

    const Materials = (() => {
        const materials = {};

        materials[WOOD_MAT] = materialFactory.create(WOOD_MAT, 'Wood',
            ['#5a2806', '#7e470b', '#66300b', '#7a4408'], updateSolid);
        materials[ROCK_MAT] = materialFactory.create(ROCK_MAT, 'Rock',
            ['#2d2c2c', '#3a3232', '#493c3c'], updateSolid);
        materials[METAL_MAT] = materialFactory.create(METAL_MAT, 'Metal',
            ['#b5b5b5', '#c6c6c6', '#b5b5b5', '#e7e7e7'], updateSolid);
        materials[GOLD_MAT] = materialFactory.create(GOLD_MAT, 'Gold',
            ['#f7b900', '#f7c93e', '#b9962e'], updateSolid);
        materials[GLASS_MAT] = materialFactory.create(GLASS_MAT, 'Glass',
            ['#dbe1e3', '#d8e4e9', '#a7c7cb'], updateSolid);
        materials[ICE_MAT] = materialFactory.create(ICE_MAT, 'Ice',
            ['#b3e1e3', '#82cfd1', '#b3e1e3', '#82cfd1', '#f7f7f7'], updateSolid);
        materials[PLANT_MAT] = materialFactory.create(PLANT_MAT, 'Plant',
            ['#57a65e', '#338453', '#5fb766'], updateSolid);
        materials[BLOOM_MAT] = materialFactory.create(BLOOM_MAT, 'Bloom',
            ['#db9cbb', '#f0c4e7', '#c26392'], updateSolid);
        materials[SAND_MAT] = materialFactory.create(SAND_MAT, 'Sand',
            ['#e5c69d', '#eacba4', '#e0be91', '#b3a076'], updateGranule);
        materials[GUN_POWDER_MAT] = materialFactory.create(GUN_POWDER_MAT, 'Gun powder',
            ['#575661', '#6a6971'], updateGranule);
        materials[SNOW_MAT] = materialFactory.create(SNOW_MAT, 'Snow',
            ['#f7f2f2', '#f1f1f1', '#e8f2f7'], updateGranule, {
            updateFrequency: 5
        });
        materials[ASH_MAT] = materialFactory.create(ASH_MAT, 'Ash',
            ['#9b9897', '#989586', '#727064'], updateGranule, {
            updateFrequency: 2
        });
        materials[SMOKE_MAT] = materialFactory.create(SMOKE_MAT, 'Smoke',
            ['#595656', '#696767'], updateGas);
        materials[STEAM_MAT] = materialFactory.create(STEAM_MAT, 'Steam',
            ['#dfe6ec', '#d9e0e5'], updateGas);
        materials[WATER_MAT] = materialFactory.create(WATER_MAT, 'Water',
            ['#1ca3ec', '#1692d5'], updateWater);
        materials[ACID_MAT] = materialFactory.create(ACID_MAT, 'Acid',
            ['#aab919', '#c5dc14', '#84e810', '#7de208'], updateAcid);
        materials[LAVA_MAT] = materialFactory.create(LAVA_MAT, 'Lava',
            ['#f72400', '#f76300', '#c90f1f', '#463a31'], updateLava);
        materials[OIL_MAT] = materialFactory.create(OIL_MAT, 'Oil',
            ['#353834'], updateOil);
        materials[RAINBOW_MAT] = materialFactory.create(RAINBOW_MAT, 'Rainbow',
            ['#cb39e0', '#4a058f', '#337ac7', '#23be40', '#dedc3d', '#de7800', '#c8131e'], updateRainbow, {
            specialBehavior: true
        });
        materials[FIRE_MAT] = materialFactory.create(FIRE_MAT, 'Fire',
            ['#f70000', '#f75700', '#f7c800'], updateFire, {
            specialBehavior: true
        });

        return materials;
    })();

    return {
        Materials: Materials
    };
})();