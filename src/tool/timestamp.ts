import { randomBytes } from 'crypto';

export function timestamp(length: number) {
  let name = 
      getDate()
    + getTime()
    + getRand(length)

  if (length < 17) {
    name = name.substr(0, length)
  }

  return name
}

function getDate() {
  const now = new Date()
  return addZero(now.getFullYear(), 4)
    + addZero(now.getMonth() + 1, 2)
    + addZero(now.getDate(), 2)
}

function getTime() {
  const now = new Date()
  return addZero(now.getHours(), 2)
    + addZero(now.getMinutes(), 2)
    + addZero(now.getSeconds(), 2)
    + addZero(now.getMilliseconds(), 3)
}

function getRand(length?: number) {
  if (length == null) {
    return ''
  } else if (length <= 17) {
    return ''
  } else {
    length -= 17
  }

  const bytes = randomBytes(length)
  let i = 0
  let out = ''
  let con = ''
  while (
    (out.length < length) &&
    (i < bytes.length)
  ) {
    if (con.length === 0) {
      con = bytes[i].toString()
      i++
    }

    out += con.substr(0, 1);
    con = con.substr(1, con.length - 1)
  }

  return out
}

function addZero(input: string | number, length: number) {
  let out = String(input)
  while (out.length < length) {
    out = '0' + out
  }

  return out
}