export let makeId = (ip: string) => {
    let now = new Date(Date.now())
    
    //get values
    let year = now.getFullYear()
    let month = now.getMonth()
    let day = now.getDay()
    let hour = now.getHours()
    let minute = now.getMinutes()
    let second = now.getSeconds()
    let milisec = now.getMilliseconds()

    //Add zeros
    let id = String(year)
    id += (month < 10) ? `0${month}` : String(month)
    id += (day < 10) ? `0${day}` : String(day)
    id += (hour < 10) ? `0${hour}` : String(hour)
    id += (minute < 10) ? `0${minute}` : String(minute)
    id += (second < 10) ? `0${second}` : String(second)
    id += (milisec < 10) ? `00${milisec}` : (milisec < 100) ? `0${milisec}` : String(milisec)

    //Add IP
    let ipNum = ip.match(/[0-9]/gi)
    let ipStr = ""
    ipNum.forEach(n => { ipStr += n })
    id = ipStr + id

    return id
}