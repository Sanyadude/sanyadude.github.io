export const DEFAULT_PROGRAM_FOLDER = 'Program Files';
export const DEFAULT_USERS_FOLDER = 'Users';
export const DEFAULT_PUBLIC_FOLDER = 'Public';
export const DEFAULT_USERS_FOLDERS = Object.freeze(['Desktop', 'Documents', 'Downloads', 'Music', 'Pictures', 'Videos']);

export const DEFAULT_FOLDERS = Object.freeze([{
    type: 'directory',
    name: DEFAULT_USERS_FOLDER,
    entries: [
        {
            type: 'directory',
            name: DEFAULT_PUBLIC_FOLDER,
            entries: DEFAULT_USERS_FOLDERS.map(folder => {
                return {
                    type: 'directory',
                    name: folder,
                    entries: []
                }
            })
        },
    ]
},
{
    type: 'directory',
    name: DEFAULT_PROGRAM_FOLDER,
    entries: []
}
]);
export const DEFAULT_ROOT_DIRECTORY_NAME = 'root';
export const DEFAULT_USER_NAME = 'root';
export const DEFAULT_HOST_NAME = 'localhost';
export const DEFAULT_HOST_ADDRESS = '127.0.0.1';

export const README_FILE = Object.freeze({
    name: 'README.md',
    content: String.raw`# cowsay

This project includes cowfiles (most of cowfiles) from cowsay (https://sources.debian.org/src/cowsay/) so license is included in /licenses/cowsay.txt

Copyright © 1999 Tony Monroe  
Licensed under the Artistic License or GPL (Perl licensing terms).

Some of them are from repository which contains additional cowsay files that are not included in debian cowsay (https://github.com/bkendzior/cowfiles/) without any licenses

# figlet

This project includes fonts from debian figlet (https://sources.debian.org/src/figlet/) so license is included in /licenses/figlet.txt

Copyright (C) 1991, 1993, 1994 Glenn Chappell and Ian Chai
Copyright (C) 1996, 1997, 1998, 1999, 2000, 2001 John Cowan
Copyright (C) 2002 Christiaan Keet
Copyright (C) 2011 Claudio Matsuoka

And some fonts from https://www.figlet.org/

Each font retains its original license as stated in its header.

#fortune

This project includes fortune files from repo (https://github.com/Distrotech/fortune-mod/)`
});

export const LICENSES_FILE = Object.freeze({
    name: 'LICENSE',
    content: String.raw`MIT License

Copyright (c) 2026 Sanyadude

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. `
});

export default {
    DEFAULT_USER_NAME,
    DEFAULT_HOST_NAME,
    DEFAULT_HOST_ADDRESS,
    DEFAULT_ROOT_DIRECTORY_NAME,
    DEFAULT_PROGRAM_FOLDER,
    DEFAULT_USERS_FOLDER,
    DEFAULT_PUBLIC_FOLDER,
    DEFAULT_USERS_FOLDERS,
    DEFAULT_FOLDERS
};