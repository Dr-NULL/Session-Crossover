export function getValue(cookies: string, name: string) {
    if (cookies == undefined) {
        return null
    }

    let stage1 = cookies.split(";");
    let value = null;
    for (let i = 0; i < stage1.length; i++) {
        let data = stage1[i].split("=");
        if (data[0] == name) {
            let parsed: any
            try {
                parsed = JSON.parse(data[1]);
            } catch {
                parsed = data[1]
            }
            if (parsed == "") {
                parsed = null
            }
            value = parsed;
            break;
        }
    }
    return value;
}