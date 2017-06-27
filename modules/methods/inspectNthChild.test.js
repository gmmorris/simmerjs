import { analyzeElementSiblings } from './inspectNthChild'

describe('analyzeElementSiblings', () => {
  test(`takes an only child with no classes and identifies it as having a unique tag / class`, function () {
    expect(
      analyzeElementSiblings(
        { el: { nodeName: 'DIV' }, getClasses: () => [] },
        []
      )
    ).toBe(true)
  })

  test(`takes an only child with classes and identifies it as having a unique tag / class`, function () {
    expect(
      analyzeElementSiblings(
        { el: { nodeName: 'DIV' }, getClasses: () => ['someClass'] },
        []
      )
    ).toBe(true)
  })

  test(`takes an child with a sibling and identifies it as having a unique tag`, function () {
    expect(
      analyzeElementSiblings(
        { el: { nodeName: 'DIV' }, getClasses: () => ['someClass'] },
        [{ el: { nodeName: 'P' }, getClasses: () => [] }]
      )
    ).toBe(true)
  })

  test(`takes an child with a sibling and identifies it as having a unique class`, function () {
    expect(
      analyzeElementSiblings(
        { el: { nodeName: 'DIV' }, getClasses: () => ['someClass'] },
        [{ el: { nodeName: 'DIV' }, getClasses: () => [] }]
      )
    ).toBe(true)
  })

  test(`takes an child with a sibling and identifies it as having a unique class among matching classes`, function () {
    expect(
      analyzeElementSiblings(
        {
          el: { nodeName: 'DIV' },
          getClasses: () => ['someAClass', 'someUniqueClass', 'someBClass']
        },
        [
          {
            el: { nodeName: 'DIV' },
            getClasses: () => ['someAClass', 'someBClass']
          }
        ]
      )
    ).toBe(true)
  })

  test(`takes an child with multiple sibling and identifies it as having a unique class among matching classes`, function () {
    expect(
      analyzeElementSiblings(
        {
          el: { nodeName: 'DIV' },
          getClasses: () => ['someAClass', 'someUniqueClass', 'someBClass']
        },
        [
          {
            el: { nodeName: 'DIV' },
            getClasses: () => ['someAClass', 'someBClass']
          },
          { el: { nodeName: 'DIV' }, getClasses: () => ['someBClass'] },
          { el: { nodeName: 'DIV' }, getClasses: () => ['someBClass'] },
          { el: { nodeName: 'DIV' }, getClasses: () => ['someDClass'] }
        ]
      )
    ).toBe(true)
  })

  test(`takes an child with multiple sibling and identifies it as having no unique class`, function () {
    expect(
      analyzeElementSiblings(
        {
          el: { nodeName: 'DIV' },
          getClasses: () => ['someAClass', 'someBClass']
        },
        [
          {
            el: { nodeName: 'DIV' },
            getClasses: () => ['someAClass', 'someBClass']
          },
          { el: { nodeName: 'DIV' }, getClasses: () => ['someBClass'] },
          { el: { nodeName: 'DIV' }, getClasses: () => ['someBClass'] },
          { el: { nodeName: 'DIV' }, getClasses: () => ['someDClass'] }
        ]
      )
    ).toBe(false)
  })

  test(`takes an child with multiple sibling and identifies it as having no unique tag`, function () {
    expect(
      analyzeElementSiblings(
        { el: { nodeName: 'DIV' }, getClasses: () => [] },
        [
          { el: { nodeName: 'DIV' }, getClasses: () => [] },
          { el: { nodeName: 'DIV' }, getClasses: () => [] }
        ]
      )
    ).toBe(false)
  })
})
