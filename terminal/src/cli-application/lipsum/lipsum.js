import { Application } from '../../system/application/application.js'
import { LIPSUM_MANIFEST } from './lipsum-manifest.js'
import { DEFAULT_PARAGRAPHS, DEFAULT_WORDS, DEFAULT_WORDS_PER_PARAGRAPH, FIRST_SENTENCE, MIN_SENTENCE_WORD_COUNT, LIPSUM_WORDS } from './config.js'

/**
 * Lipsum - Application for generating dummy text
 * @extends {Application}
 */
export class Lipsum extends Application {
    /**
     * Creates a new Lipsum instance
     */
    constructor() {
        super('lipsum', LIPSUM_MANIFEST);
    }

    /**
     * Executes the `lipsum` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @returns {string} - The result of the lipsum command execution
     */
    main(commandLine) {
        const options = commandLine.getOptions();
        return this._generateLipsumText(options);
    }

    /**
     * Generates the lorem ipsum text
     * @param {object} options - The options object
     * @returns {string} - The lorem ipsum text
     */
    _generateLipsumText(options = {}) {
        if (options['paragraphs'] !== undefined) {
            const paragraphs = !isNaN(options['paragraphs']) ? Number(options['paragraphs']) : DEFAULT_PARAGRAPHS;
            return this._generateParagraphs(paragraphs).map(paragraph => paragraph.join(' ')).join('\n\n');
        }
        if (options['words'] !== undefined) {
            const words = !isNaN(options['words']) ? Number(options['words']) : DEFAULT_WORDS;
            return this._generateFirstParagraphWords(words).join(' ');
        }
        return this._generateFirstParagraphWords().join(' ');
    }

    /**
     * Generates paragraphs of lorem ipsum text
     * @param {number} paragraphs - The number of paragraphs to generate
     * @param {number} wordsPerParagraph - The number of words per paragraph
     * @returns {string[][]} - The generated paragraphs with words
     */
    _generateParagraphs(paragraphs = DEFAULT_PARAGRAPHS, wordsPerParagraph = DEFAULT_WORDS_PER_PARAGRAPH) {
        if (paragraphs <= 0) return [];
        const output = [];
        for (let p = 0; p < paragraphs; p++) {
            // Calculate random words count for paragraph (±20% variation)
            const variation = Math.floor(wordsPerParagraph * 0.2);
            const paragraphWords = wordsPerParagraph + this._rand(-variation, variation);
            if (p === 0) {
                output.push(this._generateFirstParagraphWords(paragraphWords));
                continue;
            }
            output.push(this._generateWords(paragraphWords));
        }
        return output;
    }

    /**
     * Generates the first paragraph words
     * @param {number} words - The number of words to generate
     * @returns {string[]} - The generated first paragraph words
     */
    _generateFirstParagraphWords(words = DEFAULT_WORDS) {
        if (words <= 0) return [];
        const startWords = this._generateFirstSentenceWords(words);
        const remainingWords = this._generateWords(words - startWords.length);
        // Update punctuation of start and remaining words if needed
        if (remainingWords.length > 0 && remainingWords.length < MIN_SENTENCE_WORD_COUNT) {
            startWords[startWords.length - 1] = startWords[startWords.length - 1].replace('.', '');
            remainingWords[0] = remainingWords[0][0].toLowerCase() + remainingWords[0].slice(1);
        }
        return [...startWords, ...remainingWords];
    }

    /**
     * Generates the first sentence of lorem ipsum text
     * @param {number} words - The number of words to generate from the first sentence
     * @returns {string[]} - The generated first sentence words
     */
    _generateFirstSentenceWords(words = DEFAULT_WORDS) {
        if (words <= 0) return [];
        const output = [];
        const firstSentenceWords = FIRST_SENTENCE.split(' ');
        const commaPosition = 4;
        for (let i = 0; i < firstSentenceWords.length; i++) {
            if (i >= words) break;
            output.push(firstSentenceWords[i]);
            if (words > commaPosition + MIN_SENTENCE_WORD_COUNT && i === commaPosition) {
                output[output.length - 1] += ',';
            }
        }
        output[output.length - 1] += '.';
        return output;
    }

    /**
     * Generate words of lorem ipsum text
     * @param {number} words - The number of words to generate
     * @returns {string[]} - The generated words with punctuation
     */
    _generateWords(words = DEFAULT_WORDS) {
        if (words <= 0) return [];
        const output = [];
        let remaining = words;
        let sentenceLength = this._rand(6, 14);
        let sentenceCount = 0;
        let commaCount = 0;
        // Generate remaining words
        while (remaining > 0) {
            let word = LIPSUM_WORDS[this._rand(0, LIPSUM_WORDS.length - 1)];
            // Capitalize start of sentence
            if (sentenceCount === 0) {
                word = word[0].toUpperCase() + word.slice(1);
                sentenceLength = this._rand(6, 14);
            }
            output.push(word);
            remaining--;
            sentenceCount++;
            // Comma chance (not near end)
            let commaChance = 0.2 - commaCount * 0.02;
            if (remaining > MIN_SENTENCE_WORD_COUNT
                && sentenceCount > MIN_SENTENCE_WORD_COUNT
                && sentenceLength - sentenceCount > MIN_SENTENCE_WORD_COUNT
                && Math.random() < commaChance) {
                output[output.length - 1] += ',';
                commaCount++;
            }
            // End sentence
            if (sentenceCount >= sentenceLength && remaining > MIN_SENTENCE_WORD_COUNT) {
                output[output.length - 1] += '.';
                sentenceCount = 0;
            }
        }
        // Ensure final punctuation
        output[output.length - 1] += '.';
        return output;
    }

    /**
     * Generates a random number between a minimum and maximum value
     * @param {number} min - The minimum value
     * @param {number} max - The maximum value
     * @returns {number} - The random number
     */
    _rand(min = 0, max = 1) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}