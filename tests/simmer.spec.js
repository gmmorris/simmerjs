// this will be rewritten once these tests are working and Simmer
// is turned into an ES6 module
require('../simmer.js');

import { describe, applyDOM, queryEngine, NoResult, compareParentElementAndSimmer, compareElementsAndSimmer } from './testUtils'
import { test } from 'tape';

// create the DOM fixture for  the tests.
// this is temporary and will be split into multiple different fixtures for clearer tests
applyDOM();

if(queryEngine.default) {
  describe(`Simmer tests using the browser's document.querySelectorAll selector engine`);
}

test(`can analyze an element with an ID`, function (assert) {
  var elements = compareElementsAndSimmer('#BodyDiv');
  assert.notEqual(elements, undefined);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  assert.end();
});

test(`can analyze an element with classes only (No ID)`, function (assert) {
  var elements = compareElementsAndSimmer('.header');
  assert.notEqual(elements, undefined);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  assert.end();
});

test(`can analyze an element which is a child of an element with an ID`, function (assert) {
  var elements = compareElementsAndSimmer('#NavBar ul');
  assert.notEqual(elements, undefined);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  assert.end();
});

test(`can analyze anelement which has a class only (no IDs on it or its direct parent)`, function (assert) {
  var elements = compareElementsAndSimmer('.Active');
  assert.notEqual(elements, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.end();
});

test(`can analyze an element with an invalid ID (isn't unique)`, function (assert) {
  var elements = compareElementsAndSimmer('#BodyDiv div:nth-child(3)');
  assert.equal(elements.el, elements.SimmerEl);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.notEqual(elements, undefined);
  assert.end();
});

test(`can analyze an element with an invalid ID (isn't unique) at same level as other element with the same ID`, function (assert) {
  var elements = compareElementsAndSimmer('#BodyDiv div:nth-child(1)');
  assert.notEqual(elements, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.end();
});

test(`can analyze an element with identical siblings (neither unique ID nor class)`, function (assert) {
  var elements = compareElementsAndSimmer('.Edge:nth-child(5)');
  assert.notEqual(elements, undefined);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  assert.end();
});

test(`can analyze an element with a parent which has identical siblings`, function (assert) {
  var elements = compareParentElementAndSimmer('#helper'); // parent of #helper!
  assert.notEqual(elements, undefined);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  assert.end();
});

test(`can analyze an image who'se paren't has an invalid ID`, function (assert) {
  var elements = compareElementsAndSimmer('#BodyDiv div:nth-child(1) img');
  assert.notEqual(elements, undefined);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  assert.end();
});

test(`can analyze an image with a non unique src attribute`, function (assert) {
  var elements = compareElementsAndSimmer('#BodyDiv div:nth-child(2) img');
  assert.notEqual(elements, undefined);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  assert.end();
});

test(`can analyze an image with a unique src attribute`, function (assert) {
  var elements = compareElementsAndSimmer('img[src="./image/Pixel.png"]');
  assert.notEqual(elements, undefined);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  assert.end();
});

test(`can analyze a child of a hierarchy with identical siblings and no unique IDs`, function (assert) {
  var elements = compareElementsAndSimmer('tr:nth-child(2) td:nth-child(3)');
  assert.notEqual(elements, undefined);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  assert.end();
});

test(`can analyze an anchor (link) with a unique href attribute`, function (assert) {
  var elements = compareElementsAndSimmer('table tr th:nth-child(2) a');
  assert.notEqual(elements, undefined);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  assert.end();
});

test(`can analyze a link with a non unique href attribute and a heirarchy which has no unique IDs`, function (assert) {
  var elements = compareElementsAndSimmer('table tr th:nth-child(3) a');
  assert.notEqual(elements, undefined);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  assert.end();
});

test(`can analyze an element with identical siblings, no IDs and sibling with the same class`, function (assert) {
  var elements = compareElementsAndSimmer('td span:nth-child(3)');
  assert.notEqual(elements, undefined);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  assert.end();
});

test(`can analyze an element with identical siblings, no ID and same class as sibling but different class order`, function (assert) {
  var elements = compareElementsAndSimmer('td span:nth-child(4)');
  assert.notEqual(elements, undefined);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  assert.end();
});

test(`can analyze an element with identical siblings, no ID and different classes completely`, function (assert) {
  var elements = compareElementsAndSimmer('td span:nth-child(2)');
  assert.notEqual(elements, undefined);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  assert.end();
});

test(`cannot parse an element with an identical hierarchy whithin the Simmer's default configured depth`, function (assert) {
  var placeHolder = queryEngine.query('#placeholderId'), elements;
  placeHolder.removeAttribute('id');
  elements = compareElementsAndSimmer(placeHolder[0]);
  assert.notEqual(elements, undefined);
  assert.deepEqual(elements, NoResult);
  assert.end();
});

test(`can analyze an element with a parent which has an invalid Tag name`, function (assert) {
  var elements = compareElementsAndSimmer('.invalid_child_tag span');
  assert.notEqual(elements, undefined);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  assert.end();
});

test(`can analyze an element based only on child elements when specific enough at level 1`, function (assert) {
  var elements = compareElementsAndSimmer('.uniqueClassName');
  assert.notEqual(elements, undefined);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  // make sure the selector is one level deep
  assert.equal(elements.selector.split('>').length, 1);
  assert.end();
});

test(`can analyze an element based only on child elements when specific enough at level 2`, function (assert) {
  var elements = compareElementsAndSimmer('.secondLevelUniqueClassName div');
  assert.notEqual(elements, undefined);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  // make sure the selector is one level deep
  assert.equal(elements.selector.split('>').length, 2);
  assert.end();
});

test(`can analyze an element with a valid ID that ends with numbers in it's ID`, function (assert) {
  var elements = compareElementsAndSimmer('#a111');
  assert.notEqual(elements, undefined);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  // make sure the selector is one level deep
  assert.ok(elements.selector.match('a111'), "expected ID a111 as selector");
  assert.end();
});

test(`can analyze an element with a valid ID that has numbers in the middle of it's ID`, function (assert) {
  var elements = compareElementsAndSimmer('#a111a');
  assert.notEqual(elements, undefined);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  // make sure the selector is one level deep
  assert.ok(elements.selector.match('a111a'), "expected ID a111a as selector");
  assert.end();
});

test(`can analyze an element with an invalid ID (not unique)`, function (assert) {
  var elements = compareElementsAndSimmer('.invalidIDElement');
  assert.notEqual(elements, undefined);
  assert.notEqual(elements.SimmerEl, undefined);
  assert.notEqual(elements.el, undefined);
  assert.equal(elements.el, elements.SimmerEl);
  // make sure the selector is one level deep
  assert.equal(elements.selector.match(':asd'), null);
  assert.end();
});

test(`can't analyze an element which is longer than the selectorMaxLength chars`, function (assert) {
  var placeHolder = queryEngine.query('#aZROCRDPX41Qkden3aiC3o9Tkl0xqENUjIgNSWbe6pSddw86ogN018T9lD67zAF1YHaLkRngy8YVq88IBfqdvtO9aXZZbD1NsSBiUo6txcv22ufrkRs9AZKkxIkTF1gNAZ3Oh4M6TcYWRARVJqOZwo3dQufTDm904ep3yHZ5vdHqIyFqTFdZYPWYumx5gJBmWn7GbZQ3O3HodzmHYIHhCYg4dCDfSN8iCHzezerdHbzWUKR7pzMDOzvq017a63LSqYkSJ0gWxrgJFj45HR25eJj5szEFmuQlCfkbWpCwYopeNhy1toC9PvSfVCnHpI7EXeqVcspP0aQISflgD0pBMgg2ieITRa5gXRnKoDdem1yXvHjcDBXJFoUy63zDwg6tTtRR6rijcvoxNzGjWCgQhdqzlv6CW2CVgK2aa0VSX9RMSUTSKXmru7mvZUXJxv7RO7n1Zw9meFygwHwgNrZgeRWVYhsXBtEG8Bak7sPQ7x37QXgIgbJRcbhqMK2F5baa'),
    elements = compareElementsAndSimmer(placeHolder[0]);
  assert.notEqual(elements, undefined);
  assert.deepEqual(elements, NoResult);
  assert.end();
});
