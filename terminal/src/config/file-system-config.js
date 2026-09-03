export const DEFAULT_ROOT_DIRECTORY_NAME = 'root';

export const DEFAULT_PROGRAM_FOLDER = 'Program Files';
export const DEFAULT_USERS_FOLDER = 'Users';
export const DEFAULT_PUBLIC_FOLDER = 'Public';
export const DEFAULT_USERS_FOLDERS = Object.freeze(['Desktop', 'Documents', 'Downloads', 'Music', 'Pictures', 'Videos']);

export const DEFAULT_FOLDERS = Object.freeze([
    {
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

export const README_FILE = Object.freeze({
    name: 'README.md',
    url: new URL('../../README.md', import.meta.url),
});
export const LICENSE_FILE = Object.freeze({
    name: 'LICENSE',
    url: new URL('../../LICENSE', import.meta.url),
});

export const FILE_SYSTEM_STORE_NAME = 'file-system';
export const FILE_SYSTEM_STORE_VALUE_KEY = 'file-system';

export default {
    DEFAULT_ROOT_DIRECTORY_NAME,
    DEFAULT_PROGRAM_FOLDER,
    DEFAULT_USERS_FOLDER,
    DEFAULT_PUBLIC_FOLDER,
    DEFAULT_USERS_FOLDERS,
    DEFAULT_FOLDERS,
    README_FILE,
    LICENSE_FILE,
    FILE_SYSTEM_STORE_NAME,
    FILE_SYSTEM_STORE_VALUE_KEY
};