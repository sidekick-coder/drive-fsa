export function encode(value: any) {
    return new TextEncoder().encode(value)
}

export function decode(value: any) {
    return new TextDecoder().decode(value)
}
