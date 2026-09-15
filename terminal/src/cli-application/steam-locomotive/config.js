export const DEFAULT_WIDTH = 80;
export const DEFAULT_ROWS = 24;
export const SKY_PADDING = 10;
export const FLY_DROP_STEP = 2;
export const DELAY_MS = 40;
export const SMOKE_SPEED_X = 4;
export const DEFAULT_LITTLE_CARS = 2;

export const D51_HEIGHT = 10;
export const D51_FUNNEL = 7;
export const D51_LENGTH = 83;
export const D51_PATTERNS = 6;

export const D51_ENGINE1 = "      ====        ________                ___________ ";
export const D51_ENGINE2 = "  _D _|  |_______/        \\__I_I_____===__|_________| ";
export const D51_ENGINE3 = "   |(_)---  |   H\\________/ |   |        =|___ ___|   ";
export const D51_ENGINE4 = "   /     |  |   H  |  |     |   |         ||_| |_||   ";
export const D51_ENGINE5 = "  |      |  |   H  |__--------------------| [___] |   ";
export const D51_ENGINE6 = "  | ________|___H__/__|_____/[][]~\\_______|       |   ";
export const D51_ENGINE7 = "  |/ |   |-----------I_____I [][] []  D   |=======|__ ";

export const D51_WHEEL11 = "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__ ";
export const D51_WHEEL12 = " |/-=|___|=    ||    ||    ||    |_____/~\\___/        ";
export const D51_WHEEL13 = "  \\_/      \\O=====O=====O=====O_/      \\_/            ";

export const D51_WHEEL21 = "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__ ";
export const D51_WHEEL22 = " |/-=|___|=O=====O=====O=====O   |_____/~\\___/        ";
export const D51_WHEEL23 = "  \\_/      \\__/  \\__/  \\__/  \\__/      \\_/            ";

export const D51_WHEEL31 = "__/ =| o |=-O=====O=====O=====O \\ ____Y___________|__ ";
export const D51_WHEEL32 = " |/-=|___|=    ||    ||    ||    |_____/~\\___/        ";
export const D51_WHEEL33 = "  \\_/      \\__/  \\__/  \\__/  \\__/      \\_/            ";

export const D51_WHEEL41 = "__/ =| o |=-~O=====O=====O=====O\\ ____Y___________|__ ";
export const D51_WHEEL42 = " |/-=|___|=    ||    ||    ||    |_____/~\\___/        ";
export const D51_WHEEL43 = "  \\_/      \\__/  \\__/  \\__/  \\__/      \\_/            ";

export const D51_WHEEL51 = "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__ ";
export const D51_WHEEL52 = " |/-=|___|=   O=====O=====O=====O|_____/~\\___/        ";
export const D51_WHEEL53 = "  \\_/      \\__/  \\__/  \\__/  \\__/      \\_/            ";

export const D51_WHEEL61 = "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__ ";
export const D51_WHEEL62 = " |/-=|___|=    ||    ||    ||    |_____/~\\___/        ";
export const D51_WHEEL63 = "  \\_/      \\_O=====O=====O=====O/      \\_/            ";

export const COAL1 = "                              ";
export const COAL2 = "    _________________         ";
export const COAL3 = "   _|                \\_____A  ";
export const COAL4 = " =|                        |  ";
export const COAL5 = " -|                        |  ";
export const COAL6 = "__|________________________|_ ";
export const COAL7 = "|__________________________|_ ";
export const COAL8 = "   |_D__D__D_|  |_D__D__D_|   ";
export const COAL9 = "    \\_/   \\_/    \\_/   \\_/    ";

export const D51 = Object.freeze({
    HEIGHT: D51_HEIGHT,
    FUNNEL: D51_FUNNEL,
    LENGTH: D51_LENGTH,
    PATTERNS: D51_PATTERNS,
    FLY_DIVISOR: 7,
    ENGINE: [D51_ENGINE1, D51_ENGINE2, D51_ENGINE3, D51_ENGINE4, D51_ENGINE5, D51_ENGINE6, D51_ENGINE7],
    WHEELS: [
        [D51_WHEEL11, D51_WHEEL12, D51_WHEEL13],
        [D51_WHEEL21, D51_WHEEL22, D51_WHEEL23],
        [D51_WHEEL31, D51_WHEEL32, D51_WHEEL33],
        [D51_WHEEL41, D51_WHEEL42, D51_WHEEL43],
        [D51_WHEEL51, D51_WHEEL52, D51_WHEEL53],
        [D51_WHEEL61, D51_WHEEL62, D51_WHEEL63],
    ],
    COAL: [COAL1, COAL1, COAL2, COAL3, COAL4, COAL5, COAL6, COAL7, COAL8, COAL9],
    MEN: [
        { x: 43, y: 2 },
        { x: 47, y: 2 },
    ],
});

export const LITTLE_HEIGHT = 6;
export const LITTLE_FUNNEL = 4;
export const LITTLE_LENGTH = 84;
export const LITTLE_PATTERNS = 6;

export const LITTLE_ENGINE1 = "     ++      +------ ";
export const LITTLE_ENGINE2 = "     ||      |+-+ |  ";
export const LITTLE_ENGINE3 = "   /---------|| | |  ";
export const LITTLE_ENGINE4 = "  + ========  +-+ |  ";

export const LITTLE_WHEEL11 = " _|--O========O~\\-+  ";
export const LITTLE_WHEEL12 = "//// \\_/      \\_/    ";

export const LITTLE_WHEEL21 = " _|--/O========O\\-+  ";
export const LITTLE_WHEEL22 = "//// \\_/      \\_/    ";

export const LITTLE_WHEEL31 = " _|--/~O========O-+  ";
export const LITTLE_WHEEL32 = "//// \\_/      \\_/    ";

export const LITTLE_WHEEL41 = " _|--/~\\------/~\\-+  ";
export const LITTLE_WHEEL42 = "//// \\_O========O    ";

export const LITTLE_WHEEL51 = " _|--/~\\------/~\\-+  ";
export const LITTLE_WHEEL52 = "//// \\O========O/    ";

export const LITTLE_WHEEL61 = " _|--/~\\------/~\\-+  ";
export const LITTLE_WHEEL62 = "//// O========O_/    ";

export const LITTLE_COAL1 = "____                 ";
export const LITTLE_COAL2 = "|   \\@@@@@@@@@@@     ";
export const LITTLE_COAL3 = "|    \\@@@@@@@@@@@@@_ ";
export const LITTLE_COAL4 = "|                  | ";
export const LITTLE_COAL5 = "|__________________| ";
export const LITTLE_COAL6 = "   (O)       (O)     ";

export const LITTLE_CAR1 = "____________________ ";
export const LITTLE_CAR2 = "|  ___ ___ ___ ___ | ";
export const LITTLE_CAR3 = "|  |_| |_| |_| |_| | ";
export const LITTLE_CAR4 = "|__________________| ";
export const LITTLE_CAR5 = "|__________________| ";
export const LITTLE_CAR6 = "   (O)        (O)    ";

export const LITTLE = Object.freeze({
    HEIGHT: LITTLE_HEIGHT,
    FUNNEL: LITTLE_FUNNEL,
    LENGTH: LITTLE_LENGTH,
    PATTERNS: LITTLE_PATTERNS,
    FLY_DIVISOR: 6,
    ENGINE: [LITTLE_ENGINE1, LITTLE_ENGINE2, LITTLE_ENGINE3, LITTLE_ENGINE4],
    WHEELS: [
        [LITTLE_WHEEL11, LITTLE_WHEEL12],
        [LITTLE_WHEEL21, LITTLE_WHEEL22],
        [LITTLE_WHEEL31, LITTLE_WHEEL32],
        [LITTLE_WHEEL41, LITTLE_WHEEL42],
        [LITTLE_WHEEL51, LITTLE_WHEEL52],
        [LITTLE_WHEEL61, LITTLE_WHEEL62],
    ],
    COAL: [LITTLE_COAL1, LITTLE_COAL2, LITTLE_COAL3, LITTLE_COAL4, LITTLE_COAL5, LITTLE_COAL6],
    CAR: [LITTLE_CAR1, LITTLE_CAR2, LITTLE_CAR3, LITTLE_CAR4, LITTLE_CAR5, LITTLE_CAR6],
    MEN: [
        { x: 14, y: 1 },
        { x: 45, y: 1, drop: 4 },
        { x: 53, y: 1, drop: 4 },
        { x: 66, y: 1, drop: 6 },
        { x: 74, y: 1, drop: 6 },
    ],
});

export const C51_HEIGHT = 11;
export const C51_FUNNEL = 7;
export const C51_LENGTH = 87;
export const C51_PATTERNS = 6;

export const C51_ENGINE1 = "        ___                                            ";
export const C51_ENGINE2 = "       _|_|_  _     __       __             ___________";
export const C51_ENGINE3 = "    D__/   \\_(_)___|  |__H__|  |_____I_Ii_()|_________|";
export const C51_ENGINE4 = "     | `---'   |:: `--'  H  `--'         |  |___ ___|  ";
export const C51_ENGINE5 = "    +|~~~~~~~~++::~~~~~~~H~~+=====+~~~~~~|~~||_| |_||  ";
export const C51_ENGINE6 = "    ||        | ::       H  +=====+      |  |::  ...|  ";
export const C51_ENGINE7 = "|    | _______|_::-----------------[][]-----|       |  ";

export const C51_WHEEL11 = "| /~~ ||   |-----/~~~~\\  /[I_____I][][] --|||_______|__";
export const C51_WHEEL12 = "------'|oOo|=[]=-      ||      ||      |  ||=======_|__";
export const C51_WHEEL13 = "/~\\____|___|/~\\_|  O=======O=======O   |__|+-/~\\_|     ";
export const C51_WHEEL14 = "\\_/         \\_/  \\____/  \\____/  \\____/      \\_/       ";

export const C51_WHEEL21 = "| /~~ ||   |-----/~~~~\\  /[I_____I][][] --|||_______|__";
export const C51_WHEEL22 = "------'|oOo|=[]=- O=======O=======O    |  ||=======_|__";
export const C51_WHEEL23 = "/~\\____|___|/~\\_|      ||      ||      |__|+-/~\\_|     ";
export const C51_WHEEL24 = "\\_/         \\_/  \\____/  \\____/  \\____/      \\_/       ";

export const C51_WHEEL31 = "| /~~ ||   |-----/~~~~\\  /[I_____I][][] --|||_______|__";
export const C51_WHEEL32 = "------'|oOo|==[]=- O=======O=======O   |  ||=======_|__";
export const C51_WHEEL33 = "/~\\____|___|/~\\_|      ||      ||      |__|+-/~\\_|     ";
export const C51_WHEEL34 = "\\_/         \\_/  \\____/  \\____/  \\____/      \\_/       ";

export const C51_WHEEL41 = "| /~~ ||   |-----/~~~~\\  /[I_____I][][] --|||_______|__";
export const C51_WHEEL42 = "------'|oOo|===[]=- O=======O=======O  |  ||=======_|__";
export const C51_WHEEL43 = "/~\\____|___|/~\\_|      ||      ||      |__|+-/~\\_|     ";
export const C51_WHEEL44 = "\\_/         \\_/  \\____/  \\____/  \\____/      \\_/       ";

export const C51_WHEEL51 = "| /~~ ||   |-----/~~~~\\  /[I_____I][][] --|||_______|__";
export const C51_WHEEL52 = "------'|oOo|===[]=-    ||      ||      |  ||=======_|__";
export const C51_WHEEL53 = "/~\\____|___|/~\\_|    O=======O=======O |__|+-/~\\_|     ";
export const C51_WHEEL54 = "\\_/         \\_/  \\____/  \\____/  \\____/      \\_/       ";

export const C51_WHEEL61 = "| /~~ ||   |-----/~~~~\\  /[I_____I][][] --|||_______|__";
export const C51_WHEEL62 = "------'|oOo|==[]=-     ||      ||      |  ||=======_|__";
export const C51_WHEEL63 = "/~\\____|___|/~\\_|   O=======O=======O  |__|+-/~\\_|     ";
export const C51_WHEEL64 = "\\_/         \\_/  \\____/  \\____/  \\____/      \\_/       ";

export const C51 = Object.freeze({
    HEIGHT: C51_HEIGHT,
    FUNNEL: C51_FUNNEL,
    LENGTH: C51_LENGTH,
    PATTERNS: C51_PATTERNS,
    FLY_DIVISOR: 7,
    ENGINE: [C51_ENGINE1, C51_ENGINE2, C51_ENGINE3, C51_ENGINE4, C51_ENGINE5, C51_ENGINE6, C51_ENGINE7],
    WHEELS: [
        [C51_WHEEL11, C51_WHEEL12, C51_WHEEL13, C51_WHEEL14],
        [C51_WHEEL21, C51_WHEEL22, C51_WHEEL23, C51_WHEEL24],
        [C51_WHEEL31, C51_WHEEL32, C51_WHEEL33, C51_WHEEL34],
        [C51_WHEEL41, C51_WHEEL42, C51_WHEEL43, C51_WHEEL44],
        [C51_WHEEL51, C51_WHEEL52, C51_WHEEL53, C51_WHEEL54],
        [C51_WHEEL61, C51_WHEEL62, C51_WHEEL63, C51_WHEEL64],
    ],
    COAL: [COAL1, COAL1, COAL1, COAL2, COAL3, COAL4, COAL5, COAL6, COAL7, COAL8, COAL9],
    MEN: [
        { x: 45, y: 3 },
        { x: 49, y: 3 },
    ],
});

export const SMOKEPATTERNS = 16;

export const SMOKE01 = "(   )";
export const SMOKE02 = "(    )";
export const SMOKE03 = "(    )";
export const SMOKE04 = "(   )";
export const SMOKE05 = "(  )";
export const SMOKE06 = "(  )";
export const SMOKE07 = "( )";
export const SMOKE08 = "( )";
export const SMOKE09 = "()";
export const SMOKE10 = "()";
export const SMOKE11 = "O";
export const SMOKE12 = "O";
export const SMOKE13 = "O";
export const SMOKE14 = "O";
export const SMOKE15 = "O";
export const SMOKE16 = " ";

export const SMOKE01A = "(@@@)";
export const SMOKE02A = "(@@@@)";
export const SMOKE03A = "(@@@@)";
export const SMOKE04A = "(@@@)";
export const SMOKE05A = "(@@)";
export const SMOKE06A = "(@@)";
export const SMOKE07A = "(@)";
export const SMOKE08A = "(@)";
export const SMOKE09A = "@@";
export const SMOKE10A = "@@";
export const SMOKE11A = "@";
export const SMOKE12A = "@";
export const SMOKE13A = "@";
export const SMOKE14A = "@";
export const SMOKE15A = "@";
export const SMOKE16A = " ";

export const SMOKEDY = [2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
export const SMOKEDX = [-2, -1, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3];

export const SMOKE = Object.freeze({
    PATTERNS: SMOKEPATTERNS,
    NORMAL: [SMOKE01, SMOKE02, SMOKE03, SMOKE04, SMOKE05, SMOKE06, SMOKE07, SMOKE08, SMOKE09, SMOKE10, SMOKE11, SMOKE12, SMOKE13, SMOKE14, SMOKE15, SMOKE16],
    ALTERNATE: [SMOKE01A, SMOKE02A, SMOKE03A, SMOKE04A, SMOKE05A, SMOKE06A, SMOKE07A, SMOKE08A, SMOKE09A, SMOKE10A, SMOKE11A, SMOKE12A, SMOKE13A, SMOKE14A, SMOKE15A, SMOKE16A],
    DY: SMOKEDY,
    DX: SMOKEDX,
});

export const MAN_LENGTH = 84;
export const MAN_FRAME_DIVISOR = 12;
export const MAN_POSES = Object.freeze([
    ['', '(O)'],
    ['Help!', '\\O/'],
]);

export const MAN = Object.freeze({
    LENGTH: MAN_LENGTH,
    FRAME_DIVISOR: MAN_FRAME_DIVISOR,
    POSES: MAN_POSES,
});

export const CONFIG = Object.freeze({
    DEFAULT_WIDTH,
    DEFAULT_ROWS,
    SKY_PADDING,
    FLY_DROP_STEP,
    DELAY_MS,
    SMOKE_SPEED_X,
    DEFAULT_LITTLE_CARS,
    D51: D51,
    LITTLE: LITTLE,
    C51: C51,
    SMOKE: SMOKE,
    MAN: MAN,
});

export default CONFIG