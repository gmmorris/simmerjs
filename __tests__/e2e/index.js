// var config = require('../../nightwatch.conf.js')

const compareElementsAndSimmer = (
  browser,
  selector,
  onFinish = () => browser.end()
) => {
  browser.execute(
    function (selector) {
      var el = document.querySelector(selector)
      var simmerSelector = window.Simmer(el)
      var simmerEl = document.querySelector(simmerSelector)

      return {
        simmerSelector,
        didTheyMatch: el === simmerEl
      }
    },
    [selector],
    function (result) {
      browser.assert.equal(result.value.didTheyMatch, true)
      onFinish(result.value.simmerSelector)
    }
  )
}

let server
module.exports = {
  before: function (browser, done) {
    server = require('../server')(done) // done is a callback that executes when the server is started
  },

  after: function () {
    server.close()
  },

  'can analyze an element with an ID': function (browser) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, '#BodyDiv')
  },

  'can analyze an element with classes only (No ID)': function (browser) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, '.header')
  },

  'can analyze an element which is a child of an element with an ID': function (
    browser
  ) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, '#NavBar ul')
  },

  'can analyze anelement which has a class only (no IDs on it or its direct parent)': function (
    browser
  ) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, '.Active')
  },

  'can analyze an element with an invalid ID (isnt unique)': function (browser) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, '#BodyDiv div:nth-child(3)')
  },

  'can analyze an element with an invalid ID (isnt unique) at same level as other element with the same ID': function (
    browser
  ) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, '#BodyDiv div:nth-child(1)')
  },

  'can analyze an element with identical siblings (neither unique ID nor class)': function (
    browser
  ) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, '.Edge:nth-child(5)')
  },

  'can analyze an element with a parent which has identical siblings': function (
    browser
  ) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, '#helper') // parent of #helper!
  },

  'can analyze an image whose parent has an invalid ID': function (browser) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, '#BodyDiv div:nth-child(1) img')
  },

  'can analyze an image with a non unique src attribute': function (browser) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, '#BodyDiv div:nth-child(2) img')
  },

  'can analyze an image with a unique src attribute': function (browser) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, 'img[src="./image/Pixel.png"]')
  },

  'can analyze a child of a hierarchy with identical siblings and no unique IDs': function (
    browser
  ) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, 'tr:nth-child(2) td:nth-child(3)')
  },

  'can analyze an anchor (link) with a unique href attribute': function (
    browser
  ) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, 'table tr th:nth-child(2) a')
  },

  'can analyze a link with a non unique href attribute and a heirarchy which has no unique IDs': function (
    browser
  ) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, 'table tr th:nth-child(3) a')
  },

  'can analyze an element with identical siblings, no IDs and sibling with the same class': function (
    browser
  ) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, 'td span:nth-child(3)')
  },

  'can analyze an element with identical siblings, no ID and same class as sibling but different class order': function (
    browser
  ) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, 'td span:nth-child(4)')
  },

  'can analyze an element with identical siblings, no ID and different classes completely': function (
    browser
  ) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, 'td span:nth-child(2)')
  },

  'cannot parse an element with an identical hierarchy whithin the Simmers default configured depth': function (
    browser
  ) {
    // const windowScope = createWindow(fixture);
    // var placeHolder = queryEngine(windowScope.document).query('#placeholderId'), elements;
    // placeHolder.removeAttribute('id');
    // elements = compareElementsAndSimmer(windowScope, placeHolder[0]);
    // expect(elements).not.toBe(undefined);
    // expect(elements).toEqual(NoResult);
  },

  'can analyze an element with a parent which has an invalid Tag name': function (
    browser
  ) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, '.invalid_child_tag span')
  },

  'can analyze an element based only on child elements when specific enough at level 1': function (
    browser
  ) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, '.uniqueClassName', selector => {
      // make sure the selector is one level deep
      browser.assert.equal(selector.split('>').length, 1)
      browser.end()
    })
  },

  'can analyze an element based only on child elements when specific enough at level 2': function (
    browser
  ) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(
      browser,
      '.secondLevelUniqueClassName div',
      selector => {
        // make sure the selector is one level deep
        browser.assert.equal(selector.split('>').length, 2)
        browser.end()
      }
    )
  },

  'can analyze an element with a valid ID that ends with numbers in its ID': function (
    browser
  ) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, '#a111', selector => {
      browser.assert.equal(selector.match('a111')[0], 'a111')
      browser.end()
    })
  },

  'can analyze an element with a valid ID that has numbers in the middle of its ID': function (
    browser
  ) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, '#a111a', selector => {
      browser.assert.equal(selector.match('a111a')[0], 'a111a')
      browser.end()
    })
  },

  'can analyze an element with an invalid ID (not unique)': function (browser) {
    browser
      .url('localhost:3993') // visit the local url
      .waitForElementVisible('body') // wait for the body to be rendered

    compareElementsAndSimmer(browser, '.invalidIDElement', selector => {
      // make sure the invalid ID is ommited
      browser.assert.equal(selector.match(':asd'), null)
      browser.end()
    })
  },

  'cant analyze an element which is longer than the selectorMaxLength chars': function (
    browser
  ) {
    // const windowScope = createWindow(fixture);
    // var placeHolder = queryEngine(windowScope.document).query('#aZROCRDPX41Qkden3aiC3o9Tkl0xqENUjIgNSWbe6pSddw86ogN018T9lD67zAF1YHaLkRngy8YVq88IBfqdvtO9aXZZbD1NsSBiUo6txcv22ufrkRs9AZKkxIkTF1gNAZ3Oh4M6TcYWRARVJqOZwo3dQufTDm904ep3yHZ5vdHqIyFqTFdZYPWYumx5gJBmWn7GbZQ3O3HodzmHYIHhCYg4dCDfSN8iCHzezerdHbzWUKR7pzMDOzvq017a63LSqYkSJ0gWxrgJFj45HR25eJj5szEFmuQlCfkbWpCwYopeNhy1toC9PvSfVCnHpI7EXeqVcspP0aQISflgD0pBMgg2ieITRa5gXRnKoDdem1yXvHjcDBXJFoUy63zDwg6tTtRR6rijcvoxNzGjWCgQhdqzlv6CW2CVgK2aa0VSX9RMSUTSKXmru7mvZUXJxv7RO7n1Zw9meFygwHwgNrZgeRWVYhsXBtEG8Bak7sPQ7x37QXgIgbJRcbhqMK2F5baa'),
    //   elements = compareElementsAndSimmer(windowScope, placeHolder[0]);
    // expect(elements).not.toBe(undefined);
    // expect(elements).toEqual(NoResult);
  }
}
