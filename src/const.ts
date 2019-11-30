import Secret from "./tool/secret"
export let encrypt = new Secret()
export let clocks: Array<{ id: string; timer: NodeJS.Timer }> = []