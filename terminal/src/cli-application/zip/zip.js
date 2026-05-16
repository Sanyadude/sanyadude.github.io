import { Application } from '../../system/application/application.js'
import { ZIP_MANIFEST } from './zip-manifest.js'

const ZIP_VERSION = 20; // zip version 2.0
const LOCAL_FILE_HEADER_SIGNATURE = 0x04034b50;
const CENTRAL_DIRECTORY_FILE_HEADER_SIGNATURE = 0x02014b50;
const END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06054b50;

/**
 * Zip - Application for archiving a file or directory
 * @extends {Application}
 */
export class Zip extends Application {
    /**
     * Creates a new Zip instance
     */
    constructor() {
        super('zip', ZIP_MANIFEST);
    }

    /**
     * Executes the `zip` command
     * @param {ShellCommandLine} commandLine - The command line to execute
     * @param {object} context - The context of the command execution
     * @returns {string} - The result of the zip command execution
     */
    main(commandLine, context) {
        const options = commandLine.getOptions();
        const args = commandLine.getArguments();
        const cwd = context.fileSystemExplorer.getCurrentPath();
        if (args.length === 0) return 'Error: No path provided';
        const path = args[0];
        const fullPath = context.fileSystemExplorer.getAbsolutePath(path);
        const overwrite = options['force'] ? true : false;
        if (context.fileSystemManager.directoryExists(fullPath)) {
            const directory = context.fileSystemManager.getDirectory(fullPath);
            const zipContent = this._zipDirectory(fullPath, context);
            if (!zipContent) return 'Error: Failed to zip directory';
            const zipName = `${args[1] ? args[1] : directory.getName()}.zip`;
            context.fileSystemManager.createFile(`${cwd}/${zipName}`, zipContent, overwrite);
            return zipName;
        }
        if (context.fileSystemManager.fileExists(fullPath)) {
            const file = context.fileSystemManager.getFile(fullPath);
            const zipContent = this._zipFile(fullPath, context);
            if (!zipContent) return 'Error: Failed to zip file';
            const zipName = `${args[1] ? args[1] : file.getName()}.zip`;
            context.fileSystemManager.createFile(`${cwd}/${zipName}`, zipContent, overwrite);
            return zipName;
        }
        return 'Error: No file or directory found';
    }

    /**
     * Zips a directory
     * @param {string} fullPath - The full path to the directory to zip
     * @param {object} context - The context of the command execution
     * @returns {Blob} - The zipped directory
     */
    _zipDirectory(fullPath, context) {
        const paths = context.fileSystemManager.getEntryPathsAt(fullPath);
        if (paths.length === 0) return null;
        const lfhChunks = [];
        const processedLFHData = [];
        let lfhOffset = 0;
        // Write LFH + data
        for (const { entry, path } of paths) {
            const isDir = entry.isDirectory();
            const name = new TextEncoder().encode(path);
            const data = isDir ? new Uint8Array(0) : entry.read();
            const crc32 = this._getCRC32(data);
            const { dosTime, dosDate } = this._toDosTimeDate(entry.getModified());
            const lfh = this._createLocalFileHeader(dosTime, dosDate, crc32, data.length, name.length);
            lfhChunks.push(lfh, name, data);
            processedLFHData.push({ entry, name, data, crc32, dosTime, dosDate, lfhOffset });
            lfhOffset += lfh.byteLength + name.length + data.length;
        }
        // Write Central Directory
        const cdfhChunks = [];
        let cdfhSize = 0;
        for (const lfhData of processedLFHData) {
            const { entry, name, data, crc32, dosTime, dosDate, lfhOffset } = lfhData;
            const isDir = entry.isDirectory();
            const externalFileAttributes = isDir ? (0x4000 << 16) | 0x10 : 0x20;
            const cdfh = this._createCentralDirectoryFileHeader(dosTime, dosDate, crc32, data.length, name.length, externalFileAttributes, lfhOffset);
            cdfhChunks.push(cdfh, name);
            cdfhSize += cdfh.byteLength + name.length;
        }
        // Write End of Central Directory
        const cdfhOffset = lfhOffset;
        const eocd = this._createEndOfCentralDirectory(processedLFHData.length, cdfhSize, cdfhOffset);
        return this._mergeBytes([...lfhChunks, ...cdfhChunks, eocd]);
    }

    /**
     * Zips a file
     * @param {string} fullPath - The full path to the file to zip
     * @param {object} context - The context of the command execution
     * @returns {Uint8Array} - The zipped file
     */
    _zipFile(fullPath, context) {
        const file = context.fileSystemManager.getFile(fullPath);
        if (!file) return null;
        const name = new TextEncoder().encode(file.getName());
        const data = file.read();
        const crc32 = this._getCRC32(data);
        const { dosTime, dosDate } = this._toDosTimeDate(file.getModified());
        // Local File Header
        const lfh = this._createLocalFileHeader(dosTime, dosDate, crc32, data.length, name.length);
        // Central Directory File Header
        const cdfh = this._createCentralDirectoryFileHeader(dosTime, dosDate, crc32, data.length, name.length, 0, 0);
        const cdfhSize = cdfh.byteLength + name.length;
        const cdfhOffset = lfh.byteLength + name.length + data.length;
        // End of Central Directory
        const eocd = this._createEndOfCentralDirectory(1, cdfhSize, cdfhOffset);
        return this._mergeBytes([lfh, name, data, cdfh, name, eocd]);
    }

    /**
     * Merges bytes into a single Uint8Array
     * @param {ArrayBufferLike[]} parts - The parts to merge
     * @returns {Uint8Array} - The merged bytes
     */
    _mergeBytes(parts) {
        const uint8Arrays = parts.map(chunk => new Uint8Array(chunk.buffer));
        const totalSize = uint8Arrays.reduce((sum, p) => sum + p.length, 0);
        const output = new Uint8Array(totalSize);
        let offset = 0;
        for (const p of uint8Arrays) {
            output.set(p, offset);
            offset += p.length;
        }
        return output;
    }

    /**
     * Creates the Local File Header
     * @param {number} dosTime - The DOS time
     * @param {number} dosDate - The DOS date
     * @param {number} crc32 - The CRC32
     * @param {number} dataLength - The length of the data
     * @param {number} nameLength - The length of the name
     * @returns {DataView<ArrayBuffer>} - The Local File Header
     */
    _createLocalFileHeader(dosTime, dosDate, crc32, dataLength, nameLength) {
        const lfh = new DataView(new ArrayBuffer(30));
        let p = 0;
        lfh.setUint32(p, LOCAL_FILE_HEADER_SIGNATURE, true); p += 4; // signature
        lfh.setUint16(p, ZIP_VERSION, true); p += 2; // version needed
        lfh.setUint16(p, 0, true); p += 2; // flags
        lfh.setUint16(p, 0, true); p += 2; // compression method (0 = store)
        lfh.setUint16(p, dosTime, true); p += 2; // last mod time
        lfh.setUint16(p, dosDate, true); p += 2; // last mod date
        lfh.setUint32(p, crc32, true); p += 4; // CRC32
        lfh.setUint32(p, dataLength, true); p += 4; // compressed size
        lfh.setUint32(p, dataLength, true); p += 4; // uncompressed size
        lfh.setUint16(p, nameLength, true); p += 2; // name length
        lfh.setUint16(p, 0, true); p += 2; // extra field length
    
        return lfh;
    }

    /**
     * Creates the Central Directory File Header
     * @param {number} dosTime - The DOS time
     * @param {number} dosDate - The DOS date
     * @param {number} crc32 - The CRC32
     * @param {number} dataLength - The length of the data
     * @param {number} nameLength - The length of the name
     * @param {number} externalFileAttributes - The external file attributes
     * @param {number} localFileHeaderOffset - The offset of the local file header
     * @returns {DataView<ArrayBuffer>} - The Central Directory File Header
     */
    _createCentralDirectoryFileHeader(dosTime, dosDate, crc32, dataLength, nameLength, externalFileAttributes, localFileHeaderOffset) {
        const cdfh = new DataView(new ArrayBuffer(46));
        let p = 0;
        cdfh.setUint32(p, CENTRAL_DIRECTORY_FILE_HEADER_SIGNATURE, true); p += 4; // signature
        cdfh.setUint16(p, ZIP_VERSION, true); p += 2; // version made by
        cdfh.setUint16(p, ZIP_VERSION, true); p += 2; // version needed to extract
        cdfh.setUint16(p, 0, true); p += 2; // general purpose bit flag
        cdfh.setUint16(p, 0, true); p += 2; // compression method
        cdfh.setUint16(p, dosTime, true); p += 2; // last mod time
        cdfh.setUint16(p, dosDate, true); p += 2; // last mod date
        cdfh.setUint32(p, crc32, true); p += 4; // CRC32
        cdfh.setUint32(p, dataLength, true); p += 4; // compressed size
        cdfh.setUint32(p, dataLength, true); p += 4; // uncompressed size
        cdfh.setUint16(p, nameLength, true); p += 2; // name length
        cdfh.setUint16(p, 0, true); p += 2; // extra field length
        cdfh.setUint16(p, 0, true); p += 2; // file comment length
        cdfh.setUint16(p, 0, true); p += 2; // disk number start
        cdfh.setUint16(p, 0, true); p += 2; // internal file attributes
        cdfh.setUint32(p, externalFileAttributes, true); p += 4; // external file attributes
        cdfh.setUint32(p, localFileHeaderOffset, true); p += 4;// offset of local header

        return cdfh;
    }

    /**
     * Creates the End of Central Directory
     * @param {number} count - The number of entries in the central directory
     * @param {number} centralDirectorySize - The size of the central directory
     * @param {number} centralDirectoryOffset - The offset of the central directory
     * @returns {DataView<ArrayBuffer>} - The End of Central Directory
     */
    _createEndOfCentralDirectory(count, centralDirectorySize, centralDirectoryOffset) {
        const eocd = new DataView(new ArrayBuffer(22));
        let p = 0;
        eocd.setUint32(p, END_OF_CENTRAL_DIRECTORY_SIGNATURE, true); p += 4; // signature
        eocd.setUint16(p, 0, true); p += 2; // # disk
        eocd.setUint16(p, 0, true); p += 2; // # start disk
        eocd.setUint16(p, count, true); p += 2; // # entries on disk
        eocd.setUint16(p, count, true); p += 2; // # total entries
        eocd.setUint32(p, centralDirectorySize, true); p += 4;
        eocd.setUint32(p, centralDirectoryOffset, true); p += 4;
        eocd.setUint16(p, 0, true); // no comment

        return eocd;
    }

    /**
     * Converts a timestamp to DOS time and date
     * @param {number} timestamp - The timestamp
     * @returns {Object} - The DOS time and date { dosTime, dosDate }
     */
    _toDosTimeDate(timestamp = Date.now()) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = Math.floor(date.getSeconds() / 2);
        const dosTime =
            (hours << 11) |
            (minutes << 5) |
            seconds;
        const dosDate =
            ((year - 1980) << 9) |
            (month << 5) |
            day;
        return { dosTime, dosDate };
    }

    /**
     * Makes the CRC table
     * @returns {Array} - The CRC table
     */
    _makeCRCTable() {
        let c;
        const crcTable = [];
        for (let n = 0; n < 256; n++) {
            c = n;
            for (let k = 0; k < 8; k++) {
                c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
            }
            crcTable[n] = c;
        }
        return crcTable;
    }

    /**
     * Gets the CRC32 of the data
     * @param {Uint8Array} data - The data to get the CRC32 of
     * @returns {number} - The CRC32 of the data
     */
    _getCRC32(data) {
        const crcTable = this._makeCRCTable();
        let crc = 0 ^ (-1); // Initialize CRC with all bits set to 1
        for (let i = 0; i < data.length; i++) {
            crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xFF];
        }
        return (crc ^ (-1)) >>> 0; // Final XOR and convert to unsigned 32-bit integer
    }
}