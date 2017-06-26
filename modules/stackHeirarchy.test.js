import { wrap } from './queryEngine'
import stackHierarchy from './stackHierarchy'
const { JSDOM } = require('jsdom')

const createElementHeirarchy = (dom = '', selector) =>
  new JSDOM(`<body>${dom}</body>`).window.document.querySelector(selector)

describe('stackHierarchy', () => {
  test(`takes a wrapped element and a depth and returns the element heirarchy up tp that depth`, function () {
    const child = createElementHeirarchy(
      `
        <div id="el1">
          <div id="el2">
            <div id="el3">
              <div id="leaf">
              </div>
            </div>
          </div>
        </div>
      `,
      `#leaf`
    )
    const stackedHeirarchy = stackHierarchy(wrap(child), 3)

    expect(stackedHeirarchy[0].el).toBe(child)
    expect(stackedHeirarchy[1].el).toBe(child.parentNode)
    expect(stackedHeirarchy[2].el).toBe(child.parentNode.parentNode)
    expect(stackedHeirarchy.length).toBe(3)
  })

  test(`throws an error if the depth is invalid`, function () {
    const child = createElementHeirarchy(
      `
        <div id="el1">
          <div id="el2">
            <div id="el3">
              <div id="leaf">
              </div>
            </div>
          </div>
        </div>
      `,
      `#leaf`
    )

    expect(() => stackHierarchy(wrap(child), 0)).toThrowError(
      /An invalid depth of/
    )

    expect(() => stackHierarchy(wrap(child), -5)).toThrowError(
      /An invalid depth of/
    )
  })

  test(`returns a partial heirarchy if the depth is higher than what is available on the DOM`, function () {
    const child = createElementHeirarchy(
      `
        <div id="el1">
          <div id="leaf">
          </div>
        </div>
      `,
      `#leaf`
    )

    const stackedHeirarchy = stackHierarchy(wrap(child), 10)

    expect(stackedHeirarchy[0].el).toBe(child)
    expect(stackedHeirarchy[1].el).toBe(child.parentNode)
    // Body
    expect(stackedHeirarchy[2].el).toBe(child.parentNode.parentNode)
    /// HTML
    expect(stackedHeirarchy[3].el).toBe(child.parentNode.parentNode.parentNode)
    // Document
    expect(stackedHeirarchy[4].el).toBe(
      child.parentNode.parentNode.parentNode.parentNode
    )

    expect(stackedHeirarchy.length).toBe(5)
  })
})
