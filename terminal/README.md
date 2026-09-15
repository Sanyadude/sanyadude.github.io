# Sanyadude Terminal Project

A browser-based terminal that behaves like a tiny operating system shell.

Open `index.html` in a modern browser and you get a full-screen command line with its own file system and a set of Unix-style CLI tools — all implemented in plain JavaScript ES modules.

## What it does

The project boots a small in-browser “OS” around a custom terminal UI:

- **Shell** — parses and runs commands with pipes (`|`), redirection, aliases, and variables. Supports both POSIX and DOS-style syntax.
- **Virtual file system** — hierarchical in-memory tree (`Users`, `Program Files`, and so on).
- **Process & application layer** — installs CLI apps into the shell and tracks them through a simple process manager.
- **Terminal UI** — custom text buffer, viewport, themes, history, tab completion, and selection.
- **Built-in commands** — filesystem utilities, text tools, and fun classics like `cowsay`, `figlet`, and `fortune`.

Think of it as a playground / learning OS shell that runs entirely in the browser tab.

## Quick start

1. Serve the project root over HTTP (ES modules need a local server; opening the file via `file://` may fail).
  ```bash
   # example with Python
   python -m http.server 8080
  ```
2. Open `http://localhost:8080` in your browser.
3. Type `help` in the terminal to list available commands.

There is no install step and no `package.json` — the browser loads `src/index.js` directly as a module.

## Architecture (high level)

```
index.html
  └─ src/index.js
       └─ BootLoader
            ├─ Core services (logger, app & process managers, shell)
            ├─ Virtual file system
            ├─ Terminal
            └─ CLI applications
```


| Layer    | Location                     | Role                                           |
| -------- | ---------------------------- | ---------------------------------------------- |
| Entry    | `index.html`, `src/index.js` | Mount `#root` and boot                         |
| Core     | `src/core/`                  | Browser API helpers, events, IndexedDB adapter |
| Config   | `src/config/`                | Defaults, DB settings, CLI app registry        |
| System   | `src/system/`                | Shell, FS, processes, apps, logger, scheduler  |
| Terminal | `src/application/terminal/`  | UI, input handling, rendering                  |
| CLI apps | `src/cli-application/`       | Individual commands                            |




## Example commands

```text
help
whoami
dir
cd Users/root
mkdir Documents/notes
echo "hello" > Documents/notes/hi.txt
type Documents/notes/hi.txt
cowsay "moo"
figlet Hello
fortune | lolcat
calc 2 + 2 * 10
```

Use `help` (or `help <command>`) for details on a specific program.

## Project layout

```text
├── index.html              # App entry page
├── src/
│   ├── index.js            # Boots the system
│   ├── core/               # Low-level browser utilities
│   ├── config/             # System defaults and app registry
│   ├── system/             # Shell, FS, processes, bootstrap
│   ├── application/        # Terminal UI
│   └── cli-application/    # Built-in CLI tools
├── licenses/               # Third-party asset licenses
└── README.md
```



## License

This project is licensed under the MIT License (Copyright © 2026 Sanyadude).

---



## Third-party assets



### cowsay

This project includes cowfiles (most of cowfiles) from cowsay ([https://sources.debian.org/src/cowsay/](https://sources.debian.org/src/cowsay/)), license is included in `/licenses/cowsay.txt`.

Copyright © 1999 Tony Monroe  
Licensed under the Artistic License or GPL (Perl licensing terms).

Some of them are from a repository which contains additional cowsay files that are not included in debian cowsay ([https://github.com/bkendzior/cowfiles/](https://github.com/bkendzior/cowfiles/)) without any licenses.

### figlet

This project includes fonts from debian figlet ([https://sources.debian.org/src/figlet/](https://sources.debian.org/src/figlet/)), license is included in `/licenses/figlet.txt`.

Copyright (C) 1991, 1993, 1994 Glenn Chappell and Ian Chai  
Copyright (C) 1996, 1997, 1998, 1999, 2000, 2001 John Cowan  
Copyright (C) 2002 Christiaan Keet  
Copyright (C) 2011 Claudio Matsuoka

And some fonts from [https://www.figlet.org/](https://www.figlet.org/)

Each font retains its original license as stated in its header.

### fortune

This project includes fortune files from [https://github.com/Distrotech/fortune-mod/](https://github.com/Distrotech/fortune-mod/). Original fortune license is included in `/licenses/fortune.txt` from [https://svnweb.freebsd.org/base/head/usr.bin/fortune/](https://svnweb.freebsd.org/base/head/usr.bin/fortune/)

### sl

This project includes ASCII trains from sl [https://github.com/mtoyoda/sl/](https://github.com/mtoyoda/sl/). License is included in `/licenses/sl.txt`