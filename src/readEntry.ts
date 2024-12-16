import { decode } from './decodeAndEncode'
import { findHandle } from './findHandle'

export interface ReadEntryOptionsText {
    contentType: 'text'
}

export interface ReadEntryOptionsUint8Array {
    contentType: 'uint8array'
}

export interface ReadEntryOptionsJSON {
    contentType: 'json'
}

export type ReadEntryOptions =
    | ReadEntryOptionsText
    | ReadEntryOptionsUint8Array
    | ReadEntryOptionsJSON

// Overloads signatures
export function readEntry(
    rootHandle: FileSystemDirectoryHandle,
    path: string,
    options: ReadEntryOptionsText
): Promise<string>

export function readEntry(
    rootHandle: FileSystemDirectoryHandle,
    path: string,
    options: ReadEntryOptionsJSON
): Promise<Record<string, any>>

export function readEntry(
    rootHandle: FileSystemDirectoryHandle,
    path: string,
    options: ReadEntryOptionsUint8Array
): Promise<Uint8Array>

export function readEntry(
    rootHandle: FileSystemDirectoryHandle,
    path: string,
    options?: undefined
): Promise<Uint8Array>

export function readEntry(
    rootHandle: FileSystemDirectoryHandle,
    path: string,
    options?: ReadEntryOptions
): Promise<Uint8Array>

// Implementation
export async function readEntry(
    rootHandle: FileSystemDirectoryHandle,
    path: string,
    options?: ReadEntryOptions
): Promise<any> {
    const handle = await findHandle(rootHandle, path)

    if (!handle) {
        throw new Error('Not found')
    }

    if (handle instanceof FileSystemFileHandle === false) {
        throw new Error('Not a file')
    }

    const file = await handle.getFile()

    const contents = await file.arrayBuffer()

    const uint8 = new Uint8Array(contents)

    if (options?.contentType === 'text') {
        return decode(uint8) as any
    }

    if (options?.contentType === 'json') {
        return JSON.parse(decode(uint8))
    }

    return uint8 as any
}
