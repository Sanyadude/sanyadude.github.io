export const LIST_MANIFEST = {
    name: 'list',
    version: '0.1.0',
    description: 'Lists directory contents',
    type: 'cli',
    dependencies: ['fileSystemExplorer', 'fileSystemManager'],
    programs: [{
        name: 'ls',
        options: [
            {
                name: 'all', short: 'a', long: 'all',
                description: 'Do not ignore entries starting with .',
            },
            {
                name: 'author', long: 'author',
                description: 'With -l, print the author of each file',
            },
            {
                name: 'escape', short: 'b', long: 'escape',
                description: 'Print C-style escapes for nongraphic characters',
            },
            {
                name: 'block-size', long: 'block-size', value: { name: 'block_size', required: true },
                description: 'With -l, scale sizes by <block_size> when printing them: K,M,G,T,P,E,Z,Y,R,Q (powers of 1024), KB,MB,GB,TB,PB,EB,ZB,YB,RB,QB (powers of 1000)',
            },
            {
                name: 'ignore-backups', short: 'B', long: 'ignore-backups',
                description: 'Do not list entries ending with ~',
            },
            {
                name: 'ctime', short: 'c',
                description: 'With -lt, sort by and show entry ctime (time of last change of file status information)',
            },
            {
                name: 'columns', short: 'C',
                description: 'List entries by columns',
            },
            {
                name: 'color', long: 'color', value: { name: 'when', required: true },
                description: 'Colorize the output <when>: always, never, or auto',
            },
            {
                name: 'unsorted', short: 'f',
                description: 'Same as -a -U',
            },
            {
                name: 'classify', short: 'F',
                description: 'Append a indicator to the entries based on the file type',
            },
            {
                name: 'file-type', long: 'file-type',
                description: 'Append a file type indicator to the entries',
            },
            {
                name: 'full-time', long: 'full-time',
                description: 'Like -l --time-style=full-iso',
            },
            {
                name: 'format', long: 'format', value: { name: 'format', required: true },
                description: 'Set output format to <format>: across, horizontal (-x), commas (-m), long (-l), single-column (-1), verbose (-l), or vertical (-C)',
            },
            {
                name: 'no-owner', short: 'g',
                description: 'Like -l, but do not list owner',
            },
            {
                name: 'group-directories-first', long: 'group-directories-first',
                description: 'Group directories before files',
            },
            {
                name: 'no-group', short: 'G', long: 'no-group',
                description: 'In a long listing, do not print group names',
            },
            {
                name: 'human-readable', short: 'h', long: 'human-readable',
                description: 'With -l and -s, print sizes like 1K 234M 2G etc.',
            },
            {
                name: 'si', long: 'si',
                description: 'Likewise, but use powers of 1000 not 1024',
            },
            {
                name: 'hide', long: 'hide', value: { name: 'pattern', required: true },
                description: 'Do not list implied entries matching shell <pattern> (overridden by -a)',
            },
            {
                name: 'indicator-style', long: 'indicator-style', value: { name: 'indicator_style', required: true },
                description: 'Append an indicator using the specified <indicator_style>: none, slash (-p), file-type (--file-type), or classify (-F)',
            },
            {
                name: 'ignore', short: 'I', long: 'ignore', value: { name: 'pattern', required: true },
                description: 'Do not list implied entries matching shell <pattern>',
            },
            {
                name: 'long', short: 'l',
                description: 'Use a long listing format',
            },
            {
                name: 'commas', short: 'm',
                description: 'Fill the output width with a comma-separated list of entries',
            },
            {
                name: 'literal', short: 'N', long: 'literal',
                description: 'Print entry names without quoting',
            },
            {
                name: 'long-no-group', short: 'o',
                description: 'Like -l, but do not list group information',
            },
            {
                name: 'slash', short: 'p',
                description: 'append / indicator to directories',
            },
            {
                name: 'hide-control-chars', short: 'q', long: 'hide-control-chars',
                description: 'Print ? instead of nongraphic characters',
            },
            {
                name: 'quote-name', short: 'Q', long: 'quote-name',
                description: 'Enclose entry names in double quotes',
            },
            {
                name: 'quoting-style', long: 'quoting-style', value: { name: 'quoting_style', required: true },
                description: 'Use quoting style <quoting_style> for entry names: literal, locale, shell, shell-always, shell-escape, shell-escape-always, c, escape',
            },
            {
                name: 'reverse', short: 'r', long: 'reverse',
                description: 'Reverse the order while sorting',
            },
            {
                name: 'recursive', short: 'R', long: 'recursive',
                description: 'List subdirectories recursively',
            },
            {
                name: 'sort-size', short: 'S',
                description: 'Sort by file size, largest first',
            },
            {
                name: 'sort', long: 'sort', value: { name: 'sort_type', required: true },
                description: 'Sort entries by <sort_type>: none (-U), size (-S), time (-t), version (-v), extension (-X), name, or width',
            },
            {
                name: 'time', long: 'time', value: { name: 'time_type', required: true },
                description: 'Select which timestamp used to display or sort; access time (-u): atime, access, use; metadata change time (-c): ctime, status; modified time (default): mtime, modification; birth time: birth, creation; with -l, <time_type> determines which time to show; with --sort=time, sort by <time_type> (newest first)'
            },
            {
                name: 'time-style', long: 'time-style', value: { name: 'time_style', required: true },
                description: 'Time/date format with -l: full-iso, long-iso, iso, locale or format starting with +',
            },
            {
                name: 'sort-time', short: 't',
                description: 'Sort by time, newest first',
            },
            {
                name: 'access-time', short: 'u',
                description: 'With -lt: sort by and show access time in long listing format',
            },
            {
                name: 'no-sort', short: 'U',
                description: 'Do not sort directory entries',
            },
            {
                name: 'version-sort', short: 'v',
                description: 'Natural sort of version numbers within text',
            },
            {
                name: 'width', short: 'w', long: 'width', value: { name: 'width', required: true },
                description: 'Set output width to <width>; 0 means no limit',
            },
            {
                name: 'horizontal', short: 'x',
                description: 'List entries by lines instead of columns',
            },
            {
                name: 'sort-extension', short: 'X',
                description: 'Sort alphabetically by entry extension',
            },
            {
                name: 'zero', long: 'zero',
                description: 'End each output line with NUL (ASCII 0) character instead of newline',
            },
            {
                name: 'single-column', short: '1',
                description: 'List one file per line',
            }
        ],
        arguments: [
            { 
                name: 'path', required: false,
                description: 'The path to directory',
            }
        ]
    }]
}

export default LIST_MANIFEST