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

test(`can analyze an element with an ID`, function (t) {
  var elements = compareElementsAndSimmer('#BodyDiv');
  t.notEqual(elements, undefined);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.equal(elements.el, elements.SimmerEl);
  t.end();
});

test(`can analyze an element with classes only (No ID)`, function (t) {
  var elements = compareElementsAndSimmer('.header');
  t.notEqual(elements, undefined);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.equal(elements.el, elements.SimmerEl);
  t.end();
});

test(`can analyze an element which is a child of an element with an ID`, function (t) {
  var elements = compareElementsAndSimmer('#NavBar ul');
  t.notEqual(elements, undefined);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.equal(elements.el, elements.SimmerEl);
  t.end();
});

test(`can analyze anelement which has a class only (no IDs on it or its direct parent)`, function (t) {
  var elements = compareElementsAndSimmer('.Active');
  t.notEqual(elements, undefined);
  t.equal(elements.el, elements.SimmerEl);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.end();
});

test(`can analyze an element with an invalid ID (isn't unique)`, function (t) {
  var elements = compareElementsAndSimmer('#BodyDiv div:nth-child(3)');
  t.equal(elements.el, elements.SimmerEl);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.notEqual(elements, undefined);
  t.end();
});

test(`can analyze an element with an invalid ID (isn't unique) at same level as other element with the same ID`, function (t) {
  var elements = compareElementsAndSimmer('#BodyDiv div:nth-child(1)');
  t.notEqual(elements, undefined);
  t.equal(elements.el, elements.SimmerEl);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.end();
});

test(`can analyze an element with identical siblings (neither unique ID nor class)`, function (t) {
  var elements = compareElementsAndSimmer('.Edge:nth-child(5)');
  t.notEqual(elements, undefined);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.equal(elements.el, elements.SimmerEl);
  t.end();
});

test(`can analyze an element with a parent which has identical siblings`, function (t) {
  var elements = compareParentElementAndSimmer('#helper'); // parent of #helper!
  t.notEqual(elements, undefined);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.equal(elements.el, elements.SimmerEl);
  t.end();
});

test(`can analyze an image who'se paren't has an invalid ID`, function (t) {
  var elements = compareElementsAndSimmer('#BodyDiv div:nth-child(1) img');
  t.notEqual(elements, undefined);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.equal(elements.el, elements.SimmerEl);
  t.end();
});

test(`can analyze an image with a non unique src attribute`, function (t) {
  var elements = compareElementsAndSimmer('#BodyDiv div:nth-child(2) img');
  t.notEqual(elements, undefined);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.equal(elements.el, elements.SimmerEl);
  t.end();
});

test(`can analyze an image with a unique src attribute`, function (t) {
  var elements = compareElementsAndSimmer('img[src="./image/Pixel.png"]');
  t.notEqual(elements, undefined);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.equal(elements.el, elements.SimmerEl);
  t.end();
});

test(`can analyze a child of a hierarchy with identical siblings and no unique IDs`, function (t) {
  var elements = compareElementsAndSimmer('tr:nth-child(2) td:nth-child(3)');
  t.notEqual(elements, undefined);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.equal(elements.el, elements.SimmerEl);
  t.end();
});

test(`can analyze an anchor (link) with a unique href attribute`, function (t) {
  var elements = compareElementsAndSimmer('table tr th:nth-child(2) a');
  t.notEqual(elements, undefined);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.equal(elements.el, elements.SimmerEl);
  t.end();
});

test(`can analyze a link with a non unique href attribute and a heirarchy which has no unique IDs`, function (t) {
  var elements = compareElementsAndSimmer('table tr th:nth-child(3) a');
  t.notEqual(elements, undefined);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.equal(elements.el, elements.SimmerEl);
  t.end();
});

test(`can analyze an element with identical siblings, no IDs and sibling with the same class`, function (t) {
  var elements = compareElementsAndSimmer('td span:nth-child(3)');
  t.notEqual(elements, undefined);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.equal(elements.el, elements.SimmerEl);
  t.end();
});

test(`can analyze an element with identical siblings, no ID and same class as sibling but different class order`, function (t) {
  var elements = compareElementsAndSimmer('td span:nth-child(4)');
  t.notEqual(elements, undefined);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.equal(elements.el, elements.SimmerEl);
  t.end();
});

test(`can analyze an element with identical siblings, no ID and different classes completely`, function (t) {
  var elements = compareElementsAndSimmer('td span:nth-child(2)');
  t.notEqual(elements, undefined);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.equal(elements.el, elements.SimmerEl);
  t.end();
});

test(`cannot parse an element with an identical hierarchy whithin the Simmer's default configured depth`, function (t) {
  var placeHolder = queryEngine.query('#placeholderId'), elements;
  placeHolder.removeAttribute('id');
  elements = compareElementsAndSimmer(placeHolder[0]);
  t.notEqual(elements, undefined);
  t.deepEqual(elements, NoResult);
  t.end();
});

test(`can analyze an element with a parent which has an invalid Tag name`, function (t) {
  var elements = compareElementsAndSimmer('.invalid_child_tag span');
  t.notEqual(elements, undefined);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.equal(elements.el, elements.SimmerEl);
  t.end();
});

test(`can analyze an element based only on child elements when specific enough at level 1`, function (t) {
  var elements = compareElementsAndSimmer('.uniqueClassName');
  t.notEqual(elements, undefined);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.equal(elements.el, elements.SimmerEl);
  // make sure the selector is one level deep
  t.equal(elements.selector.split('>').length, 1);
  t.end();
});

test(`can analyze an element based only on child elements when specific enough at level 2`, function (t) {
  var elements = compareElementsAndSimmer('.secondLevelUniqueClassName div');
  t.notEqual(elements, undefined);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.equal(elements.el, elements.SimmerEl);
  // make sure the selector is one level deep
  t.equal(elements.selector.split('>').length, 2);
  t.end();
});

test(`can analyze an element with a valid ID that ends with numbers in it's ID`, function (t) {
  var elements = compareElementsAndSimmer('#a111');
  t.notEqual(elements, undefined);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.equal(elements.el, elements.SimmerEl);
  // make sure the selector is one level deep
  t.ok(elements.selector.match('a111'), "expected ID a111 as selector");
  t.end();
});

test(`can analyze an element with a valid ID that has numbers in the middle of it's ID`, function (t) {
  var elements = compareElementsAndSimmer('#a111a');
  t.notEqual(elements, undefined);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.equal(elements.el, elements.SimmerEl);
  // make sure the selector is one level deep
  t.ok(elements.selector.match('a111a'), "expected ID a111a as selector");
  t.end();
});

test(`can analyze an element with an invalid ID (not unique)`, function (t) {
  var elements = compareElementsAndSimmer('.invalidIDElement');
  t.notEqual(elements, undefined);
  t.notEqual(elements.SimmerEl, undefined);
  t.notEqual(elements.el, undefined);
  t.equal(elements.el, elements.SimmerEl);
  // make sure the selector is one level deep
  t.equal(elements.selector.match(':asd'), null);
  t.end();
});

test(`can't analyze an element which is longer than the selectorMaxLength chars`, function (t) {
  var placeHolder = queryEngine.query('#aZROCRDPX41Qkden3aiC3o9Tkl0xqENUjIgNSWbe6pSddw86ogN018T9lD67zAF1YHaLkRngy8YVq88IBfqdvtO9aXZZbD1NsSBiUo6txcv22ufrkRs9AZKkxIkTF1gNAZ3Oh4M6TcYWRARVJqOZwo3dQufTDm904ep3yHZ5vdHqIyFqTFdZYPWYumx5gJBmWn7GbZQ3O3HodzmHYIHhCYg4dCDfSN8iCHzezerdHbzWUKR7pzMDOzvq017a63LSqYkSJ0gWxrgJFj45HR25eJj5szEFmuQlCfkbWpCwYopeNhy1toC9PvSfVCnHpI7EXeqVcspP0aQISflgD0pBMgg2ieITRa5gXRnKoDdem1yXvHjcDBXJFoUy63zDwg6tTtRR6rijcvoxNzGjWCgQhdqzlv6CW2CVgK2aa0VSX9RMSUTSKXmru7mvZUXJxv7RO7n1Zw9meFygwHwgNrZgeRWVYhsXBtEG8Bak7sPQ7x37QXgIgbJRcbhqMK2F5baa'),
    elements = compareElementsAndSimmer(placeHolder[0]);
  t.notEqual(elements, undefined);
  t.deepEqual(elements, NoResult);
  t.end();
});
