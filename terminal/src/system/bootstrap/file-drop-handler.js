/**
 * FileDropHandler - Writes dropped files into the current directory
 */
export class FileDropHandler {
    /**
     * Creates a new FileDropHandler instance
     * @param {FileSystemExplorer} fileSystemExplorer The file system explorer
     * @param {FileSystemManager} fileSystemManager The file system manager
     * @param {Logger|null} logger The logger
     */
    constructor(fileSystemExplorer, fileSystemManager, logger = null) {
        this._fileSystemExplorer = fileSystemExplorer;
        this._fileSystemManager = fileSystemManager;
        this._logger = logger;
    }

    /**
     * Creates a file in the current directory for each dropped file
     * @param {DragEvent} event The drop event
     */
    handle(event) {
        const files = event.dataTransfer?.files;
        if (!files) return;
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                try {
                    const content = new Uint8Array(loadEvent.target.result);
                    const path = this._fileSystemExplorer.getAbsolutePath(file.name);
                    this._fileSystemManager.createFile(path, content, true);
                } catch (error) {
                    this._logger?.error(error);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    }
}

export default FileDropHandler