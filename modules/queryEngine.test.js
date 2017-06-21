import initQueryEngine, { isUniqueElementID } from './queryEngine'
const { JSDOM } = require('jsdom')
const createElement = (dom = '') =>
  new JSDOM(`<body><div></div></body>`).window.document.querySelector('div')
/// HTMLElement
describe('QueryEngine', () => {
  describe('attachQueryEngine', () => {
    test(`defaults to using the document.querySelectorAll as queryEngine`, function () {
      const returnValue = [{ tagName: 'div' }, { tagName: 'div' }]
      const querySelectorAll = jest.fn(() => returnValue)

      const QueryEngine = initQueryEngine({
        document: {
          querySelectorAll
        }
      })

      const $ = new QueryEngine()
      $.attachQueryEngine()

      expect($.query('div')).toBe(returnValue)

      expect(querySelectorAll.mock.calls[0][0]).toBe('div')
    })

    test(`takes a query engine and uses it to query`, function () {
      const returnValue = [{ tagName: 'div' }, { tagName: 'div' }]
      const customQueryEngine = jest.fn(() => returnValue)
      const querySelectorAll = jest.fn(() => [])

      const QueryEngine = initQueryEngine({
        document: {
          querySelectorAll
        }
      })

      const $ = new QueryEngine()
      $.attachQueryEngine(customQueryEngine)

      expect($.query('div')).toBe(returnValue)

      expect(querySelectorAll.mock.calls.length).toBe(0)
      expect(customQueryEngine.mock.calls[0][0]).toBe('div')
    })
  })

  describe('isUniqueElementID', () => {
    test(`takes a query engine and an id and returns true if the query engine has only one result for that id`, function () {
      const query = jest.fn(() => [createElement()])

      expect(isUniqueElementID({ query }, 'uniqueId')).toBe(true)

      expect(query.mock.calls[0][0]).toBe(`[id="uniqueId"]`)
    })

    test(`takes a query engine and an id and returns false if the query engine has no result for that id`, function () {
      const query = jest.fn(() => [])

      expect(isUniqueElementID({ query }, 'uniqueId')).toBe(false)

      expect(query.mock.calls[0][0]).toBe(`[id="uniqueId"]`)
    })

    test(`takes a query engine and an id and returns false if the query engine returns multiple result for that id`, function () {
      const query = jest.fn(() => [createElement(), createElement()])

      expect(isUniqueElementID({ query }, 'uniqueId')).toBe(false)

      expect(query.mock.calls[0][0]).toBe(`[id="uniqueId"]`)
    })
  })
})
