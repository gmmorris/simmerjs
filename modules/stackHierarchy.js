function push (arr, val) {
  arr.push(val)
  return arr
}

function tail (arr) {
  return arr[arr.length - 1]
}
/**
 * Retireve the element's ancestors up to the configured level.
 * This is an internal function and is not to be used from the outside (nor can it, it is private)
 * @param element (Object) The elemen't whose ancestry we want to retrieve
 * @param depth (number) How deep to into the heirarchy to collect elements
 */
export default function stackHierarchy (element, depth) {
  if (depth <= 0) {
    throw new Error(`Simmer: An invalid depth of ${depth} has been specified`)
  }
  return Array(depth - 1)
    .fill()
    .reduce(
      (acc, val) => (tail(acc).parent() ? push(acc, tail(acc).parent()) : acc),
      [element]
    )
}
