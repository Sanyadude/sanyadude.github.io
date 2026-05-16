/**
 * TextSegment class - represents a segment of text
 */
export class TextSegment {
    /**
     * Creates a new TextSegment instance
     * @param {string} text - The text of the segment
     * @param {string|null} format - The format of the segment
     * @param {number} start - The start index of the segment
     * @param {number} end - The end index of the segment
     */
    constructor(text, format, start, end) {
        this.text = text;
        this.format = format;
        this.start = start;
        this.end = end;
    }
}

export default TextSegment