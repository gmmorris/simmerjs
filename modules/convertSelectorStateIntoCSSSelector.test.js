import convertSelectorStateIntoCSSSelector from './convertSelectorStateIntoCSSSelector'

describe.only('convertSelectorStateIntoCSSSelector', () => {
  test(`converts an empty stack into a "select all" selector`, function () {
    expect(
      convertSelectorStateIntoCSSSelector({
        stack: [[]]
      })
    ).toBe('*')
  })

  test(`converts an one level stack with one selector into that selector`, function () {
    expect(
      convertSelectorStateIntoCSSSelector({
        stack: [['DIV']]
      })
    ).toBe('DIV')
  })

  test(`converts an one level stack with multiple selectors into a merged selector`, function () {
    expect(
      convertSelectorStateIntoCSSSelector({
        stack: [['DIV', '.className']]
      })
    ).toBe('DIV.className')
  })

  test(`converts an multi level stack with multiple selectors into a merged selector`, function () {
    expect(
      convertSelectorStateIntoCSSSelector({
        stack: [['span'], ['DIV', '#someId'], ['DIV', '.className']]
      })
    ).toBe('DIV.className > DIV#someId > span')
  })

  test(`converts an empty selector in a multi level stack into a "select all" selector`, function () {
    expect(
      convertSelectorStateIntoCSSSelector({
        stack: [['span'], [], ['DIV', '.className']]
      })
    ).toBe('DIV.className > * > span')
  })

  test(`omits "select all" selectors from the parent levels`, function () {
    expect(
      convertSelectorStateIntoCSSSelector({
        stack: [['span'], [], ['DIV', '.className'], [], []]
      })
    ).toBe('DIV.className > * > span')
  })

  test(`takes a depth level which will omit any selectors beyond that depth`, function () {
    expect(
      convertSelectorStateIntoCSSSelector(
        {
          stack: [
            ['span'],
            [],
            ['DIV', '.className'],
            [],
            ['DIV', '#someId'],
            ['ARTICLE'],
            []
          ]
        },
        3
      )
    ).toBe('DIV.className > * > span')
  })
})
