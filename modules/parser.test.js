import Parser from './parser'

describe('Parser', () => {
  describe('next', () => {
    test(`calls the next function in the queue with the supplied arguments`, function () {
      const returnValue = { some: 0 }
      const method = jest.fn(() => returnValue)
      const parser = new Parser({
        getMethods: () => [method]
      })

      expect(parser.next(1, 2, 3)).toBe(returnValue)

      expect(method.mock.calls[0]).toMatchObject([1, 2, 3])
    })
    test(`removes the called method`, function () {
      const first = jest.fn(val => val)
      const second = jest.fn(val => val)
      const parser = new Parser({
        getMethods: () => [first, second]
      })

      expect(parser.next(1, 2, 3, 4, 5, 6)).toBe(1)

      expect(parser.next(6, 5, 4, 3, 2, 1)).toBe(6)

      expect(second.mock.calls[0]).toMatchObject([6, 5, 4, 3, 2, 1])
    })
    test(`returns false if no more methods are left`, function () {
      const parser = new Parser({
        getMethods: () => [val => val]
      })

      parser.next(1, 2, 3, 4, 5, 6)

      expect(parser.next(6, 5, 4, 3, 2, 1)).toBe(false)
    })
  })
  describe('finish', () => {
    test(`returns true if no methods are left in the queue`, function () {
      const parser = new Parser({
        getMethods: () => []
      })

      expect(parser.finished()).toBe(true)
    })
    test(`returns false if there are methods left in the queue`, function () {
      const parser = new Parser({
        getMethods: () => [() => 123]
      })

      expect(parser.finished()).toBe(false)
    })
  })
})
