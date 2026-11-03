export const SHELL_NAME = 'shell';
export const SHELL_TYPE = 'myshell';
export const SHELL_VERSION = '0.1.0';

export const SHELL_STARTUP_LINES = [
    'Command Line Interface v$TERM_PROGRAM_VERSION', 
    'Type "help" for available commands',
    '',
];

export const VARIABLES = Object.freeze({
    USER: 'USER',
    HOSTNAME: 'HOSTNAME',
    PWD: 'PWD',
    OLDPWD: 'OLDPWD',
    TERM: 'TERM',
    SHELL: 'SHELL',
    COLORTERM: 'COLORTERM',
    TERM_PROGRAM: 'TERM_PROGRAM',
    TERM_PROGRAM_VERSION: 'TERM_PROGRAM_VERSION',
});

export const ALIASES_DEPTH_MAX = 10;

export const PROMPT_COLORS = Object.freeze({
    HOST: '32',
    PATH: '34',
});

export const DEFAULT_PROMPT_TYPE = 'windows';

export default {
    SHELL_NAME,
    SHELL_TYPE,
    SHELL_VERSION,
    SHELL_STARTUP_LINES,
    VARIABLES,
    ALIASES_DEPTH_MAX,
    PROMPT_COLORS,
    DEFAULT_PROMPT_TYPE,
}