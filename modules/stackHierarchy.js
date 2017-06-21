/**
 * Retireve the element's ancestors up to the configured level.
 * This is an internal function and is not to be used from the outside (nor can it, it is private)
 * @param element (Object) The elemen't whose ancestry we want to retrieve
 * @param depth (number) How deep to into the heirarchy to collect elements
 */
export default function stackHierarchy (element, depth) {
  const hierarchy = []

  for (let index = 0; index < depth && element !== null; index += 1) {
    hierarchy[index] = element
    element = hierarchy[index].parent()
  }

  return hierarchy
}
