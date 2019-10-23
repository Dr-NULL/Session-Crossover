import { File } from "../tool/file"
import { encrypt } from "..";
import { Options } from "./options";

export let getFile = (id: string, path: string) => {
    //Make Paths
    path = path.replace(/\\/gi, "/")
    if (path.substr(path.length - 1, 1) != "/") {
        path += "/"
    }
    path += id + ".json"

    //Return File Instance
    return new File(path)
}