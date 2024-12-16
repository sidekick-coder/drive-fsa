import { findBasename } from "./findBasename"
import { findDirname } from "./findDirname"
import { findHandle } from "./findHandle"
import { makeDirectoryEntry } from "./makeDirectoryEntry"

export interface WriteEntryOptions {
    recursive?: boolean
    contentType?: 'text' | 'uint8array' | 'json'
}

export type WriteEntryContent = string | Uint8Array | Object

export async function writeEntry(rootHandle: FileSystemDirectoryHandle, path: string, content: WriteEntryContent, options?: WriteEntryOptions) {

    const dirname = findDirname(path)
    const basename = findBasename(path)

    if (options?.recursive && (await findHandle(rootHandle, dirname)) === null) {
        await makeDirectoryEntry(rootHandle, dirname, {
            recursive: true
        })
    }


    const folder = await findHandle(rootHandle, dirname)

    if (folder instanceof FileSystemDirectoryHandle === false) {
        throw new Error('Invalid path')
    }

    const handle = await folder.getFileHandle(basename, {
        create: true
    })

    if (handle instanceof FileSystemFileHandle === false) {
        throw new Error('Invalid path')
    }

    let uint8array: Uint8Array | null = null

    if (options?.contentType === 'text' && typeof content === 'string') {
        uint8array = new TextEncoder().encode(content)
    }

    if (options?.contentType === 'uint8array' && content instanceof Uint8Array) {
        uint8array = content
    }

    if (options?.contentType === 'json' && typeof content === 'object') {
        uint8array = new TextEncoder().encode(JSON.stringify(content, null, 4))
    }

    if (!options?.contentType && content instanceof Uint8Array) {
        uint8array = content
    }

    if (!uint8array) {
        throw new Error('Invalid  content')
    }

    const writable = await handle.createWritable()

    await writable.write(uint8array)

    await writable.close()
}
