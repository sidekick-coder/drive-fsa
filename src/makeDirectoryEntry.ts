import { findBasename } from "./findBasename"
import { findDirname } from "./findDirname"
import { findHandle } from "./findHandle"

export interface MakeDirectoryEntryOptions {
    recursive?: boolean
}

export async function makeDirectoryEntry(rootHandle: FileSystemDirectoryHandle, path: string, options?: MakeDirectoryEntryOptions) {
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

    await folder.getDirectoryHandle(basename, {
        create: true
    })    
}
