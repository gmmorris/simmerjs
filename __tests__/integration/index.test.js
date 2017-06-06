const { JSDOM } = require('jsdom')
import fixture from './fixture'
import { queryEngine, NoResult, compareParentElementAndSimmer, compareElementsAndSimmer } from './utils'

import installSimmer from '../../modules/simmer'
import helpers from '../../modules/helpers'
import initQueryEngine from '../../modules/queryEngine'

const installSimmerOnWindow = windowScope => {
  installSimmer(windowScope,
    helpers,
    initQueryEngine(windowScope)
  )
  return windowScope
}

const createWindow = (dom = '') => installSimmerOnWindow(new JSDOM(`<body>${dom}</body>`).window)
const firstChildInBody = windowScope => windowScope.document.body.children[0]

test(`can analyze an element with an ID`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, '#BodyDiv');
  expect(elements).not.toBe(undefined);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
});

test(`can analyze an element with classes only (No ID)`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, '.header');
  expect(elements).not.toBe(undefined);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
});

test(`can analyze an element which is a child of an element with an ID`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, '#NavBar ul');
  expect(elements).not.toBe(undefined);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
});

test(`can analyze anelement which has a class only (no IDs on it or its direct parent)`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, '.Active');
  expect(elements).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
});

test(`can analyze an element with an invalid ID (isn't unique)`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, '#BodyDiv div:nth-child(3)');
  expect(elements.el).toBe(elements.SimmerEl);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements).not.toBe(undefined);
});

test(`can analyze an element with an invalid ID (isn't unique) at same level as other element with the same ID`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, '#BodyDiv div:nth-child(1)');
  expect(elements).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
});

test(`can analyze an element with identical siblings (neither unique ID nor class)`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, '.Edge:nth-child(5)');
  expect(elements).not.toBe(undefined);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
});

test(`can analyze an element with a parent which has identical siblings`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareParentElementAndSimmer(windowScope, '#helper'); // parent of #helper!
  expect(elements).not.toBe(undefined);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
});

test(`can analyze an image who'se paren't has an invalid ID`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, '#BodyDiv div:nth-child(1) img');
  expect(elements).not.toBe(undefined);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
});

test(`can analyze an image with a non unique src attribute`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, '#BodyDiv div:nth-child(2) img');
  expect(elements).not.toBe(undefined);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
});

test(`can analyze an image with a unique src attribute`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, 'img[src="./image/Pixel.png"]');
  expect(elements).not.toBe(undefined);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
});

test(`can analyze a child of a hierarchy with identical siblings and no unique IDs`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, 'tr:nth-child(2) td:nth-child(3)');
  expect(elements).not.toBe(undefined);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
});

test(`can analyze an anchor (link) with a unique href attribute`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, 'table tr th:nth-child(2) a');
  expect(elements).not.toBe(undefined);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
});

test(`can analyze a link with a non unique href attribute and a heirarchy which has no unique IDs`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, 'table tr th:nth-child(3) a');
  expect(elements).not.toBe(undefined);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
});

test(`can analyze an element with identical siblings, no IDs and sibling with the same class`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, 'td span:nth-child(3)');
  expect(elements).not.toBe(undefined);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
});

test(`can analyze an element with identical siblings, no ID and same class as sibling but different class order`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, 'td span:nth-child(4)');
  expect(elements).not.toBe(undefined);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
});

test(`can analyze an element with identical siblings, no ID and different classes completely`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, 'td span:nth-child(2)');
  expect(elements).not.toBe(undefined);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
});

test(`cannot parse an element with an identical hierarchy whithin the Simmer's default configured depth`, function () {
  const windowScope = createWindow(fixture);
  var placeHolder = queryEngine(windowScope.document).query('#placeholderId'), elements;
  placeHolder.removeAttribute('id');
  elements = compareElementsAndSimmer(windowScope, placeHolder[0]);
  expect(elements).not.toBe(undefined);
  expect(elements).toEqual(NoResult);
});

test(`can analyze an element with a parent which has an invalid Tag name`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, '.invalid_child_tag span');
  expect(elements).not.toBe(undefined);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
});

test(`can analyze an element based only on child elements when specific enough at level 1`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, '.uniqueClassName');
  expect(elements).not.toBe(undefined);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
  // make sure the selector is one level deep
  expect(elements.selector.split('>').length).toBe(1);
});

test(`can analyze an element based only on child elements when specific enough at level 2`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, '.secondLevelUniqueClassName div');
  expect(elements).not.toBe(undefined);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
  // make sure the selector is one level deep
  expect(elements.selector.split('>').length).toBe(2);
});

test(`can analyze an element with a valid ID that ends with numbers in it's ID`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, '#a111');
  expect(elements).not.toBe(undefined);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
  // make sure the selector is one level deep
  expect(elements.selector.match('a111')).toBeTruthy();
});

test(`can analyze an element with a valid ID that has numbers in the middle of it's ID`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, '#a111a');
  expect(elements).not.toBe(undefined);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
  // make sure the selector is one level deep
  expect(elements.selector.match('a111a')).toBeTruthy();
});

test(`can analyze an element with an invalid ID (not unique)`, function () {
  const windowScope = createWindow(fixture);
  var elements = compareElementsAndSimmer(windowScope, '.invalidIDElement');
  expect(elements).not.toBe(undefined);
  expect(elements.SimmerEl).not.toBe(undefined);
  expect(elements.el).not.toBe(undefined);
  expect(elements.el).toBe(elements.SimmerEl);
  // make sure the selector is one level deep
  expect(elements.selector.match(':asd')).toBe(null);
});

test(`can't analyze an element which is longer than the selectorMaxLength chars`, function () {
  const windowScope = createWindow(fixture);
  var placeHolder = queryEngine(windowScope.document).query('#aZROCRDPX41Qkden3aiC3o9Tkl0xqENUjIgNSWbe6pSddw86ogN018T9lD67zAF1YHaLkRngy8YVq88IBfqdvtO9aXZZbD1NsSBiUo6txcv22ufrkRs9AZKkxIkTF1gNAZ3Oh4M6TcYWRARVJqOZwo3dQufTDm904ep3yHZ5vdHqIyFqTFdZYPWYumx5gJBmWn7GbZQ3O3HodzmHYIHhCYg4dCDfSN8iCHzezerdHbzWUKR7pzMDOzvq017a63LSqYkSJ0gWxrgJFj45HR25eJj5szEFmuQlCfkbWpCwYopeNhy1toC9PvSfVCnHpI7EXeqVcspP0aQISflgD0pBMgg2ieITRa5gXRnKoDdem1yXvHjcDBXJFoUy63zDwg6tTtRR6rijcvoxNzGjWCgQhdqzlv6CW2CVgK2aa0VSX9RMSUTSKXmru7mvZUXJxv7RO7n1Zw9meFygwHwgNrZgeRWVYhsXBtEG8Bak7sPQ7x37QXgIgbJRcbhqMK2F5baa'),
    elements = compareElementsAndSimmer(windowScope, placeHolder[0]);
  expect(elements).not.toBe(undefined);
  expect(elements).toEqual(NoResult);
});

