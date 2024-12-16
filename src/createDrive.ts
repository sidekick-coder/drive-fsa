import { destroyEntry } from "./destroyEntry"
import { findEntry } from "./findEntry"
import { ListEntriesOptions, listEntries } from "./listEntries"
import { makeDirectoryEntry, MakeDirectoryEntryOptions } from "./makeDirectoryEntry"
import { moveEntry } from "./moveEntry"
import { readEntry, ReadEntryOptions } from "./readEntry"
import { writeEntry, WriteEntryOptions } from "./writeEntry"

export interface CreateDriveOptions {
    debug?: boolean
}

export function createDrive(rootHandle: FileSystemDirectoryHandle, options?: CreateDriveOptions) {

    const logger = {
        debug: options?.debug ? console.debug : () => {}
    }

    function list(path: string, options?: ListEntriesOptions){
        logger.debug('[drive-fs-api] list', path)

        return listEntries(rootHandle, path, options)
    }

    function find(path: string){
        logger.debug('[drive-fs-api] find', path)

        return findEntry(rootHandle, path)
    }

    function read<T extends ReadEntryOptions>(path: string, options?: T){
        logger.debug('[drive-fs-api] read', path)

        return readEntry(rootHandle, path, options)
    }

    function write(path: string, content: Uint8Array, options?: WriteEntryOptions){
        logger.debug('[drive-fs-api] write', path)

        return writeEntry(rootHandle, path, content, options)
    }

    function destroy(path: string){
        logger.debug('[drive-fs-api] destroy', path)

        return destroyEntry(rootHandle, path)
    }

    function move(from: string, to: string){
        logger.debug('[drive-fs-api] move', { from, to })

        return moveEntry(rootHandle, from, to)
    }

    function mkdir(path: string, options?: MakeDirectoryEntryOptions){
        logger.debug('[drive-fs-api] mkdir', path)

        return makeDirectoryEntry(rootHandle, path, options)
    }

    return {
        list,
        find,
        read,
        write,
        destroy,
        move,
        mkdir
    }
}
