# Drive FSA

A simple wrapper to use browser File System Access API in a more convenient way.


## Installation

```bash 
npm install drive-fsa
```

## createDrive

Helper function to create a drive object from a directory handle

```ts
import { createDrive } from 'drive-fsa';

const handle = await window.showDirectoryPicker();

const drive = createDrive(handle);

// list all files in the root directory
const entries = await drive.list('/');

// list all files in a subdirectory
const entries = await drive.list('/subdir1/subdir2');

// get individual file
const entry = await drive.get('/file.txt');

// read file, returns a Uint8Array
const uint8 = await drive.read('/file.txt');

// read file as text
const text = await drive.read('/file.txt', { contentType: 'text' });

// read file as json 
const json = await drive.read('/file.txt', { contentType: 'json' });

// write to file Uint8Array
await drive.write('/file.txt', new TextEncoder().encode('Hello, World!'));

// write to file text 
await drive.write('/file.txt', 'Hello, World!', { contentType: 'text' });

// write to file json 
await drive.write('/file.txt', { hello: 'world' }, { contentType: 'json' });

// delete file 
await drive.destroy('/file.txt');
```

## findEntry 

Get an entry by path

```ts
import { findEntry } from 'drive-fsa';

const handle = await window.showDirectoryPicker();

const entry = await findEntry(handle, '/file.txt');
```

## listEntries

List all entries in a directory

```ts 
import { listEntries } from 'drive-fsa';

const handle = await window.showDirectoryPicker();

const entries = await listEntries(handle, '/');
```

## readEntry

Read the content of a file

```ts 
import { readEntry } from 'drive-fsa';

const handle = await window.showDirectoryPicker();

const data = await readEntry(handle, '/file.txt'); // Promise<Uint8Array>
```

Use options to specify the content type

```ts 
readEntry(handle, '/file.txt', { contentType: 'text' }); // Promise<string>
readEntry(handle, '/file.txt', { contentType: 'json' }); // Promise<Record<string, any>>
readEntry(handle, '/file.txt', { contentType: 'uint8array' }); // Promise<Uint8Array>
```

## makeDirectoryEntry

Create a directory

```ts 
import { makeDirectoryEntry } from 'drive-fsa'; 

const handle = await window.showDirectoryPicker();

await makeDirectoryEntry(handle, '/subdir1/subdir2');
```
Create a directory recursively

```ts 
makeDirectoryEntry(handle, '/subdir1/subdir2', { recursive: true });
```

## writeEntry 

Write to a file

```ts 
import { writeEntry, encode } from 'drive-fsa';

const handle = await window.showDirectoryPicker();

await writeEntry(handle, '/file.txt', encode('Hello, World!'));
```

Use options to specify the content type

```ts 
writeEntry(handle, '/file.txt', 'Hello, World!', { contentType: 'text' });
writeEntry(handle, '/file.txt', { hello: 'world' }, { contentType: 'json' });
writeEntry(handle, '/file.txt', new Uint8Array([1, 2, 3]), { contentType: 'uint8array' });
```

Recursive write

```ts 
writeEntry(handle, '/subdir1/subdir2/file.txt', 'Hello, World!', { recursive: true });
```

## destroyEntry 

Delete a file or a directory

```ts
import { destroyEntry } from 'drive-fsa';

const handle = await window.showDirectoryPicker();

await destroyEntry(handle, '/file.txt');
```

## findHandle

Get a handle by path

Can be used to get a deep handle of a file or a directory

```ts
import { findHandle } from 'drive-fsa';

const handle = await window.showDirectoryPicker();

const fileHandle = await findHandle(handle, '/file.txt');

const dirHandle = await findHandle(handle, '/subdir1/subdir2');
```
