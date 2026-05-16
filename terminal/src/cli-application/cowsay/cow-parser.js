/**
 * CowParser - A class for parsing cow files
 */
export class CowParser {
    /**
     * Parses the cow file and returns the parsed cow body
     * @param {string} cowFile - The cow file content
     * @returns {string} - The parsed cow body
     */
    parse(cowFile) {
        const vars = this._extractVariables(cowFile);
        const body = this._extractBody(cowFile);
        const allowed = ['eye', 'eyes', 'tongue', 'thoughts'];
        const cowBody = body.replace(/\$(\w+)/g, (original, name) => {
            if (vars[name] !== undefined) return vars[name];
            return original;
        }).replace(/\$(\w+)|\$\{(\w+)\}/g, (original, name1, name2) => {
            const name = name1 || name2;
            if (allowed.includes(name)) return `{{${name}}}`;
            return original;
        });
        //normilize escaped characters \@ \$ and \\
        const normalized = cowBody
            .replace(/\\\\/g, '\\')
            .replace(/\\@/g, '@')
            .replace(/\\\$/g, '$');
        return normalized;
    }

    /**
     * Extracts the variables from the cow file
     * @param {string} content - The content of the cow file
     * @returns {Object} - The variables
     */
    _extractVariables(content) {
        const bodyIndex = content.indexOf('$the_cow');
        const header = bodyIndex >= 0 ? content.slice(0, bodyIndex) : content;

        const vars = {};
        const varRegex = /^\s*\$(\w+)\s*=\s*"(.*?)"\s*;/gm;
        let match;
        while ((match = varRegex.exec(header))) {
            const [original, name, value] = match;
            //replace escaped backslashes and escaped escape characters
            vars[name] = value.replace(/\\\\/g, '\\').replace(/\\e/g, '\x1b');
        }
        return vars;
    }

    /**
     * Extracts the body of the cow file
     * @param {string} content - The content of the cow file
     * @returns {string} - The body of the cow file
     */
    _extractBody(content) {
        const heredocRegex = /\$the_cow\s*=\s*<<\s*("?)(\w+)\1\s*;?\s*\n([\s\S]*?)\n\s*\2\b/;
        const match = heredocRegex.exec(content);
        if (!match) throw new Error('No cow found');
        return match[3];
    }
}

export default CowParser