export const firstUpper = string => string.charAt(0).toUpperCase() + string.slice(1)
const getOr = (pathString, alternative, obj) => {
  const paths = pathString.split('.')
  let val = obj
  let idx = 0
  while (idx < paths.length) {
    if (val == null) {
      return
    }
    val = val[paths[idx]]
    idx += 1
  }
  return val == null || val !== val ? alternative : val
}
export const pipe = (a, b) => arg => a(b(arg))
export const selectValue = e => getOr('target.value', '', e)
const emailRegex = /^.+@.+\..+$/i
export const isEmail = value => emailRegex.test(value)