export function getValue(cookies: string, name: string) {
    let stage1 = cookies.split(";");
    let value = null;
    for (let i = 0; i < stage1.length; i++) {
        let data = stage1[i].split("=");
        if (data[0] == name) {
            let parsed = JSON.parse(atob(data[1])).d;
            if (parsed == null) {
                parsed = data[1];
            }
            value = parsed;
            break;
        }
    }
    return value;
}