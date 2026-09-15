import { Application } from '../../system/application/application.js'
import { STEAM_LOCOMOTIVE_MANIFEST } from './steam-locomotive-manifest.js'
import { 
    DEFAULT_WIDTH, DEFAULT_ROWS, DELAY_MS,
    SKY_PADDING, FLY_DROP_STEP, SMOKE_SPEED_X, DEFAULT_LITTLE_CARS,
    D51, LITTLE, C51, SMOKE, MAN 
} from './config.js'

/**
 * SteamLocomotive - Application for showing a steam locomotive
 * @extends {Application}
 */
export class SteamLocomotive extends Application {
    /**
     * Creates a new SteamLocomotive instance
     */
    constructor() {
        super('steam-locomotive', STEAM_LOCOMOTIVE_MANIFEST);
    }

    /**
     * Executes the `sl` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {Promise<string>} - The result of the sl command execution
     */
    async main(commandLine, context) {
        const options = commandLine.getOptions();
        const model = options['c51'] ? C51 : options['little'] ? LITTLE : D51;
        const cars = model.CAR ? this._carCount(commandLine.getArguments()) : 0;
        const flying = Boolean(options['fly']);
        const accident = Boolean(options['accident']);
        const runtime = context.getRuntime();
        const terminal = context.terminal;
        let width = terminal.getSize().columns || DEFAULT_WIDTH;
        let x = width - 1;
        let drawn = 0;
        terminal.scrollInputToTop();
        terminal.hidePrompt();
        while (true) {
            if (runtime.isAborted()) break;
            const sprite = this._compose(model, x, cars, flying, accident);
            if (x < -this._getLinesMaxWidth(sprite)) break;
            const size = terminal.getSize();
            width = size.columns || DEFAULT_WIDTH;
            const rows = (size.lines || DEFAULT_ROWS) - 2;
            const frame = this._toScreen(sprite, x, width, rows, flying, model.FLY_DIVISOR);
            for (let i = 0; i < drawn; i++) {
                terminal.removeOutputLine();
            }
            frame.forEach(line => terminal.writeOutputLine(line));
            drawn = frame.length;
            await runtime.sleep(DELAY_MS);
            x -= 1;
        }
        return '';
    }

    /**
     * Assembles engine, tender, cars, passengers, and smoke into one sprite
     * @param {object} model - The locomotive model
     * @param {number} x - The left column of the engine on screen
     * @param {number} cars - The number of passenger cars
     * @param {boolean} flying - Whether the locomotive is flying
     * @param {boolean} accident - Whether people cry for help
     * @returns {string[]} - The sprite lines
     */
    _compose(model, x, cars, flying, accident) {
        const wheels = model.WHEELS[this._getValidIndex(model.LENGTH + x, model.PATTERNS)];
        const engine = model.ENGINE.concat(wheels);
        const engineWidth = this._getLinesMaxWidth(engine);
        const coalWidth = this._getLinesMaxWidth(model.COAL);
        const carWidth = this._getLinesMaxWidth(model.CAR);
        const sections = [
            { lines: engine, x: 0, y: 0 },
            { lines: model.COAL, x: engineWidth, y: flying ? FLY_DROP_STEP : 0 },
        ];
        for (let i = 0; i < cars; i++) {
            sections.push({
                lines: model.CAR,
                x: engineWidth + coalWidth + carWidth * i,
                y: flying ? FLY_DROP_STEP * (i + 2) : 0,
            });
        }
        const smoke = this._smoke(model.FUNNEL, x, flying);
        const men = accident
            ? (model.MEN || []).map(man => ({
                x: man.x,
                y: man.y + (flying ? man.drop || 0 : 0),
            }))
            : [];
        const manGlyphWidth = Math.max(0, ...MAN.POSES.flat().map(line => line.length));
        const trainHeight = Math.max(
            ...sections.map(section => section.y + section.lines.length),
            ...men.map(man => man.y + MAN.POSES[0].length),
            0,
        );
        const trainWidth = Math.max(
            ...sections.map(section => section.x + this._getLinesMaxWidth(section.lines)),
            ...men.map(man => man.x + manGlyphWidth),
            0,
        );
        const canvas = this._createCanvas(Math.max(trainWidth, smoke.width, 1), smoke.rise + trainHeight);
        const engineY = smoke.rise;
        sections.forEach(section => this._blit(canvas, section.lines, section.x, engineY + section.y));
        men.forEach(man => this._blitMan(canvas, engineY + man.y, man.x, x));
        smoke.puffs.forEach(puff => this._blit(canvas, [puff.text], puff.x, engineY - 1 + puff.y));
        return canvas.map(row => row.join(''));
    }

    /**
     * Places the sprite in a padded viewport and clips it to the terminal
     * @param {string[]} sprite - The sprite lines
     * @param {number} x - The left column of the engine on screen
     * @param {number} width - The terminal width
     * @param {number} rows - The terminal height
     * @param {boolean} flying - Whether the locomotive is flying
     * @param {number} flyDivisor - Columns per row of lift in fly mode
     * @returns {string[]} - Visible lines
     */
    _toScreen(sprite, x, width, rows, flying, flyDivisor) {
        const sky = Math.max(SKY_PADDING, Math.floor(rows / 2) - 5);
        const viewportHeight = flying
            ? Math.max(sprite.length + sky, rows)
            : sprite.length + sky;
        let y = sky;
        if (flying) {
            y = Math.trunc(x / flyDivisor) + viewportHeight - Math.trunc(width / flyDivisor) - sprite.length;
        }
        const frame = [];
        for (let row = 0; row < viewportHeight; row++) {
            const spriteRow = row - y;
            const line = spriteRow >= 0 && spriteRow < sprite.length ? sprite[spriteRow] : '';
            if (x >= width) {
                frame.push('');
                continue;
            }
            const start = x < 0 ? -x : 0;
            const column = Math.max(0, x);
            if (start >= line.length) {
                frame.push('');
                continue;
            }
            frame.push(' '.repeat(column) + line.slice(start, start + width - column));
        }
        return frame;
    }

    /**
     * Draws a waving passenger; pose flips every 12 screen columns
     * @param {string[][]} canvas - The canvas
     * @param {number} y - The top row of the passenger
     * @param {number} manX - The passenger column on the sprite
     * @param {number} engineX - The left column of the engine on screen
     */
    _blitMan(canvas, y, manX, engineX) {
        const pose = MAN.POSES[this._getValidIndex(Math.trunc((MAN.LENGTH + engineX + manX) / MAN.FRAME_DIVISOR), 2)];
        pose.forEach((line, row) => {
            if (line) this._blit(canvas, [line], manX, y + row);
        });
    }

    /**
     * Builds the smoke trail from the funnel
     * @param {number} funnelX - The funnel column
     * @param {number} engineX - The left column of the engine on screen
     * @param {boolean} flying - Whether smoke drifts upward
     * @returns {{puffs: {x: number, y: number, text: string}[], width: number, rise: number}}
     */
    _smoke(funnelX, engineX, flying) {
        const tick = Math.abs(engineX);
        const driftY = flying ? -1 : 0;
        const kind = Math.floor(tick / SMOKE_SPEED_X) % 2;
        let x = funnelX + tick % SMOKE_SPEED_X;
        let y = 0;
        let minY = 0;
        let width = x;
        const puffs = [];
        for (let i = 0; i < SMOKE.PATTERNS; i++) {
            const text = (kind + i) % 2 === 0 ? SMOKE.NORMAL[i] : SMOKE.ALTERNATE[i];
            puffs.push({ x, y, text });
            width = Math.max(width, x + text.length);
            x += SMOKE.DX[i] + SMOKE_SPEED_X;
            y -= SMOKE.DY[i] + (i % 2 === 0 ? driftY : 0);
            minY = Math.min(minY, y);
        }
        return { puffs, width, rise: 1 - minY };
    }

    /**
     * Blits string lines onto the canvas
     * @param {string[][]} canvas - The canvas
     * @param {string[]} lines - The lines to blit
     * @param {number} x - The left column
     * @param {number} y - The top row
     */
    _blit(canvas, lines, x, y) {
        if (!lines) return;
        for (let row = 0; row < lines.length; row++) {
            const targetY = y + row;
            if (targetY < 0 || targetY >= canvas.length) continue;
            const line = lines[row];
            for (let column = 0; column < line.length; column++) {
                const targetX = x + column;
                if (targetX < 0 || targetX >= canvas[targetY].length) continue;
                canvas[targetY][targetX] = line[column];
            }
        }
    }

    /**
     * Creates a space-filled character canvas
     * @param {number} width - The canvas width
     * @param {number} height - The canvas height
     * @returns {string[][]} - The canvas
     */
    _createCanvas(width, height) {
        return Array.from({ length: height }, () => Array.from({ length: width }, () => ' '));
    }

    /**
     * Parses the optional passenger-car count
     * @param {string[]} args - The command arguments
     * @returns {number} - The number of cars
     */
    _carCount(args) {
        const parsed = parseInt(args[0], 10);
        if (Number.isNaN(parsed) || parsed < 0) return DEFAULT_LITTLE_CARS;
        return parsed;
    }

    /**
     * Returns a wrapped non-negative index
     * @param {number} value - The value to wrap
     * @param {number} size - The cycle length
     * @returns {number} - The wrapped index
     */
    _getValidIndex(value, size) {
        return ((value % size) + size) % size;
    }

    /**
     * Returns the longest string length in a list
     * @param {string[]} lines - The lines
     * @returns {number} - The maximum length
     */
    _getLinesMaxWidth(lines) {
        if (!lines || lines.length === 0) return 0;
        return lines.reduce((max, line) => Math.max(max, line.length), 0);
    }
}

export default SteamLocomotive
