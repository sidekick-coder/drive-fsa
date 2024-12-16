import { decode } from './decodeAndEncode'
import { findHandle } from './findHandle'

interface ReadEntryOptionsText {
    contentType: 'text'
}

interface ReadEntryOptionsUint8Array {
    contentType: 'uint8array'
}

interface ReadEntryOptionsJSON {
    contentType: 'json'
}

export type ReadEntryOptions =
    | ReadEntryOptionsText
    | ReadEntryOptionsUint8Array
    | ReadEntryOptionsJSON

export type ReadEntryResponse<T extends ReadEntryOptions> = T extends ReadEntryOptionsText
    ? string
    : T extends ReadEntryOptionsJSON
      ? Record<string, any>
      : T extends ReadEntryOptionsUint8Array
        ? Uint8Array
        : Uint8Array

export async function readEntry<T extends ReadEntryOptions>(
    rootHandle: FileSystemDirectoryHandle,
    path: string,
    options?: T
): Promise<ReadEntryResponse<T>> {
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
