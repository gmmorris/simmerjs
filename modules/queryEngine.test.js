import initQueryEngine, { domProto } from './queryEngine'

describe('QueryEngine', () => {
  describe('attachQueryEngine', () => {
    test(`defaults to using the document.querySelectorAll as queryEngine`, function () {
      const returnValue = [{ tagName: 'div' }, { tagName: 'div' }]
      const querySelectorAll = jest.fn(() => returnValue)

      const QueryEngine = initQueryEngine({
        document: {
          querySelectorAll
        }
      });

      const $ = new QueryEngine();
      $.attachQueryEngine();

      expect(
        $.query('div')
      ).toBe(
        returnValue
      )

      expect(
        querySelectorAll.mock.calls[0][0]
      ).toBe(
        'div'
      )
    });

    test(`takes a query engine and uses it to query`, function () {
      const returnValue = [{ tagName: 'div' }, { tagName: 'div' }]
      const customQueryEngine = jest.fn(() => returnValue);
      const querySelectorAll = jest.fn(() => []);

      const QueryEngine = initQueryEngine({
        document: {
          querySelectorAll
        }
      });

      const $ = new QueryEngine();
      $.attachQueryEngine(customQueryEngine);

      expect(
        $.query('div')
      ).toBe(
        returnValue
      )

      expect(
        querySelectorAll.mock.calls.length
      ).toBe(
        0
      )
      expect(
        customQueryEngine.mock.calls[0][0]
      ).toBe(
        'div'
      )
    });

  });
});

