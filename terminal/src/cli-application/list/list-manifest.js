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
                name: '-a, --all',
                description: 'Do not ignore entries starting with .',
            },
            {
                name: '--author',
                description: 'With -l, print the author of each file',
            },
            {
                name: '-b, --escape',
                description: 'Print C-style escapes for nongraphic characters',
            },
            {
                name: '--block-size <block_size>',
                description: 'With -l, scale sizes by <block_size> when printing them: K,M,G,T,P,E,Z,Y,R,Q (powers of 1024), KB,MB,GB,TB,PB,EB,ZB,YB,RB,QB (powers of 1000)',
            },
            {
                name: '-B, --ignore-backups',
                description: 'Do not list entries ending with ~',
            },
            {
                name: '-c',
                description: 'With -lt, sort by and show entry ctime (time of last change of file status information)',
            },
            {
                name: '-C',
                description: 'List entries by columns',
            },
            {
                name: '--color <when>',
                description: 'Colorize the output <when>: always, never, or auto',
            },
            {
                name: '-f',
                description: 'Same as -a -U',
            },
            {
                name: '-F',
                description: 'Append a indicator to the entries based on the file type',
            },
            {
                name: '--file-type',
                description: 'Append a file type indicator to the entries',
            },
            {
                name: '--full-time',
                description: 'Like -l --time-style=full-iso',
            },
            {
                name: '--format <format>',
                description: 'Set output format to <format>: across, horizontal (-x), commas (-m), long (-l), single-column (-1), verbose (-l), or vertical (-C)',
            },
            {
                name: '-g',
                description: 'Like -l, but do not list owner',
            },
            {
                name: '--group-directories-first',
                description: 'Group directories before files',
            },
            {
                name: '-G, --no-group',
                description: 'In a long listing, do not print group names',
            },
            {
                name: '-h, --human-readable',
                description: 'With -l and -s, print sizes like 1K 234M 2G etc.',
            },
            {
                name: '--si',
                description: 'Likewise, but use powers of 1000 not 1024',
            },
            {
                name: '--hide <pattern>',
                description: 'Do not list implied entries matching shell <pattern> (overridden by -a)',
            },
            {
                name: '--indicator-style <indicator_style>',
                description: 'Append an indicator using the specified <indicator_style>: none, slash (-p), file-type (--file-type), or classify (-F)',
            },
            {
                name: '-I, --ignore <pattern>',
                description: 'Do not list implied entries matching shell <pattern>',
            },
            {
                name: '-l',
                description: 'Use a long listing format',
            },
            {
                name: '-m',
                description: 'Fill the output width with a comma-separated list of entries',
            },
            {
                name: '-N, --literal',
                description: 'Print entry names without quoting',
            },
            {
                name: '-o',
                description: 'Like -l, but do not list group information',
            },
            {
                name: '-p',
                description: 'append / indicator to directories',
            },
            {
                name: '-q, --hide-control-chars',
                description: 'Print ? instead of nongraphic characters',
            },
            {
                name: '-Q, --quote-name',
                description: 'Enclose entry names in double quotes',
            },
            {
                name: '--quoting-style <quoting_style>',
                description: 'Use quoting style <quoting_style> for entry names: literal, locale, shell, shell-always, shell-escape, shell-escape-always, c, escape',
            },
            {
                name: '-r, --reverse',
                description: 'Reverse the order while sorting',
            },
            {
                name: '-R, --recursive',
                description: 'List subdirectories recursively',
            },
            {
                name: '-S',
                description: 'Sort by file size, largest first',
            },
            {
                name: '--sort <sort_type>',
                description: 'Sort entries by <sort_type>: none (-U), size (-S), time (-t), version (-v), extension (-X), name, or width',
            },
            {
                name: '--time <time_type>',
                description: 'Select which timestamp used to display or sort; access time (-u): atime, access, use; metadata change time (-c): ctime, status; modified time (default): mtime, modification; birth time: birth, creation; with -l, <time_type> determines which time to show; with --sort=time, sort by <time_type> (newest first)'
            },
            {
                name: '--time-style <time_style>',
                description: 'Time/date format with -l: full-iso, long-iso, iso, locale or format starting with +',
            },
            {
                name: '-t',
                description: 'Sort by time, newest first',
            },
            {
                name: '-u',
                description: 'With -lt: sort by and show access time in long listing format',
            },
            {
                name: '-U',
                description: 'Do not sort directory entries',
            },
            {
                name: '-v',
                description: 'Natural sort of version numbers within text',
            },
            {
                name: '-w, --width <width>',
                description: 'Set output width to <width>; 0 means no limit',
            },
            {
                name: '-x',
                description: 'List entries by lines instead of columns',
            },
            {
                name: '-X',
                description: 'Sort alphabetically by entry extension',
            },
            {
                name: '--zero',
                description: 'End each output line with NUL (ASCII 0) character instead of newline',
            },
            {
                name: '-1',
                description: 'List one file per line',
            }
        ],
        arguments: [
            { 
                name: '[<path>]',
                description: 'The path to directory',
            }
        ]
    }]
}

export default LIST_MANIFEST