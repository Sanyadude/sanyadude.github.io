import { UIFont } from '../../ui-tool-kit/index.js'

const SMALLER_FONT_STEP = 2;
const LARGER_FONT_STEP = 2;

export const DEFAULT_FONT_SIZE = 12;
export const DEFAULT_FONT_FAMILY = 'system-ui';

const systemUIFontFactory = UIFont.createFactory(DEFAULT_FONT_FAMILY);

export class SystemUIFont {
    static get default() {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE);
    }

    static defaultWith(lineHeight) {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE, lineHeight)
    }

    static get small() {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE - SMALLER_FONT_STEP);
    }

    static smallWith(lineHeight) {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE - SMALLER_FONT_STEP, lineHeight);
    }
    
    static get xSmall() {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE - 2 * SMALLER_FONT_STEP);
    }

    static xSmallWith(lineHeight) {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE - 2 * SMALLER_FONT_STEP, lineHeight);
    }

    static get xxSmall() {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE - 3 * SMALLER_FONT_STEP);
    }

    static xxSmallWith(lineHeight) {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE - 3 * SMALLER_FONT_STEP, lineHeight);
    }

    static get xxxSmall() {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE - 4 * SMALLER_FONT_STEP);
    }

    static xxxSmallWith(lineHeight) {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE - 4 * SMALLER_FONT_STEP, lineHeight);
    }

    static get xxxxSmall() {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE - 5 * SMALLER_FONT_STEP);
    }

    static xxxxSmallWith(lineHeight) {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE - 5 * SMALLER_FONT_STEP, lineHeight);
    }

    static get large() {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE + LARGER_FONT_STEP);
    }

    static largeWith(lineHeight) {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE + LARGER_FONT_STEP, lineHeight);
    }
    
    static get xLarge() {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE + 2 * LARGER_FONT_STEP);
    }

    static xLargeWith(lineHeight) {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE + 2 * LARGER_FONT_STEP, lineHeight);
    }

    static get xxLarge() {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE + 3 * LARGER_FONT_STEP);
    }

    static xxLargeWith(lineHeight) {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE + 3 * LARGER_FONT_STEP, lineHeight);
    }

    static get xxxLarge() {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE + 4 * LARGER_FONT_STEP);
    }

    static xxxLargeWith(lineHeight) {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE + 4 * LARGER_FONT_STEP, lineHeight);
    }

    static get xxxxLarge() {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE + 5 * LARGER_FONT_STEP);
    }

    static xxxxLargeWith(lineHeight) {
        return systemUIFontFactory.create(DEFAULT_FONT_SIZE + 5 * LARGER_FONT_STEP, lineHeight);
    }
}

export default SystemUIFont