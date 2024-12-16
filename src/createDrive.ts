import { destroyEntry } from './destroyEntry'
import { findEntry } from './findEntry'
import { ListEntriesOptions, listEntries } from './listEntries'
import { makeDirectoryEntry, MakeDirectoryEntryOptions } from './makeDirectoryEntry'
import { moveEntry } from './moveEntry'
import {
    readEntry,
    ReadEntryOptions,
    ReadEntryOptionsJSON,
    ReadEntryOptionsText,
    ReadEntryOptionsUint8Array,
} from './readEntry'
import { writeEntry, WriteEntryOptions } from './writeEntry'

export interface CreateDriveOptions {
    debug?: boolean
}

export function createDrive(rootHandle: FileSystemDirectoryHandle, options?: CreateDriveOptions) {
    const logger = {
        debug: options?.debug ? console.debug : () => {},
    }

    function list(path: string, options?: ListEntriesOptions) {
        logger.debug('[drive-fs-api] list', path)

        return listEntries(rootHandle, path, options)
    }

    function find(path: string) {
        logger.debug('[drive-fs-api] find', path)

        return findEntry(rootHandle, path)
    }

    // Overloads for `read`
    function read(path: string, options: ReadEntryOptionsText): Promise<string>
    function read(path: string, options: ReadEntryOptionsJSON): Promise<Record<string, any>>
    function read(path: string, options: ReadEntryOptionsUint8Array): Promise<Uint8Array>
    function read(path: string, options?: undefined): Promise<Uint8Array>

    // Implementation of `read`
    function read(path: string, options?: ReadEntryOptions) {
        logger.debug('[drive-fs-api] read', path)

        return readEntry(rootHandle, path, options) as any
    }

    function write(path: string, content: Uint8Array, options?: WriteEntryOptions) {
        logger.debug('[drive-fs-api] write', path)

        return writeEntry(rootHandle, path, content, options)
    }

    function destroy(path: string) {
        logger.debug('[drive-fs-api] destroy', path)

        return destroyEntry(rootHandle, path)
    }

    function move(from: string, to: string) {
        logger.debug('[drive-fs-api] move', { from, to })

        return moveEntry(rootHandle, from, to)
    }

    function mkdir(path: string, options?: MakeDirectoryEntryOptions) {
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
        mkdir,
    }
}
