/**
 * @name TEST Simmer.js
 * @author Gidi Morris (c) 2014
 * @version 0.0.1
 */

// helper method
var compareElementsAndSimmer = function (elementSelector, parentOfSelected) {
    var element;
    if (typeof(elementSelector) == 'string') {
        element = $$(elementSelector)[0];
        if (parentOfSelected) {
            element = element.parentNode;
        }
    } else {
        element = elementSelector;
    }

    if (!element) {
        return {
            el:undefined,
            SimmerEl:false
        };
    }

    var selector = Simmer(element);
    if (selector === false) {
        // if failed return false
        return selector;
    }

    var returnedFromSimmerSelector = $$(selector)[0];

//    log((parentOfSelected ? 'PARENT OF: ' + elementSelector : elementSelector), selector);

    return {
        el:element,
        SimmerEl:returnedFromSimmerSelector, selector:selector
    };
};

var log = function(from, to) {
    if (from && to) {
        var spacesForFrom = "";
        for (var index = (35 - from.length); index > 0; index--) {
            spacesForFrom += " ";
        }
        var spacesForTo = "";
        for (var index = (100 - to.length); index > 0; index--) {
            spacesForTo += " ";
        }

        if (window.console) {
            window.console.log('Converted     ' + from + spacesForFrom + '    to       ' + to + spacesForTo);
        }
    }
};

$$(document).ready(function () {
    var domCache,
        applyDom = function () {
            if(!domCache){
                domCache = $$('#fixture').clone();
            }
            $$('#fixture').remove();
            $$('body').append(domCache.clone());
    };

    // run first time
    applyDom();

    // set as reset function so that it is run every time a test is completed
    QUnit.reset = applyDom;

    /**
     * We want to test Simmer from all directions - with Sizzle on the page, jQuery on the page and no query engine on the page
     * So we'll define a function which executes all the tests and reset the page's state for each module
     */


    window.executeTests = function(){


        test('can analyze an element with an ID', function () {
            var elements = compareElementsAndSimmer('#BodyDiv');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
        });

        test('can analyze an element with classes only (No ID)', function () {
            var elements = compareElementsAndSimmer('.header');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
        });

        test('can analyze an element which is a child of an element with an ID', function () {
            var elements = compareElementsAndSimmer('#NavBar ul');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
        });

        test('can analyze anelement which has a class only (no IDs on it or its direct parent)', function () {
            var elements = compareElementsAndSimmer('.Active');
            notEqual(elements, undefined);
            equal(elements.el, elements.SimmerEl);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
        });

        test('can analyze an element with an invalid ID (isn\'t unique)', function () {
            var elements = compareElementsAndSimmer('#BodyDiv div:nth-child(3)');
            equal(elements.el, elements.SimmerEl);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            notEqual(elements, undefined);
        });

        test('can analyze an element with an invalid ID (isn\'t unique) at same level as other element with the same ID', function () {
            var elements = compareElementsAndSimmer('#BodyDiv div:nth-child(1)');
            notEqual(elements, undefined);
            equal(elements.el, elements.SimmerEl);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
        });

        test('can analyze an element with identical siblings (neither unique ID nor class)', function () {
            var elements = compareElementsAndSimmer('.Edge:nth-child(5)');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
        });

        test('can analyze an element with a parent which has identical siblings', function () {
            var elements = compareElementsAndSimmer('#helper', true); // parent of #helper!
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
        });

        test('can analyze an image who\'se paren\'t has an invalid ID', function () {
            var elements = compareElementsAndSimmer('#BodyDiv div:nth-child(1) img');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
        });

        test('can analyze an image with a non unique src attribute', function () {
            var elements = compareElementsAndSimmer('#BodyDiv div:nth-child(2) img');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
        });

        test('can analyze an image with a unique src attribute', function () {
            var elements = compareElementsAndSimmer('img[src="./image/Pixel.png"]');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
        });

        test('can analyze a child of a hierarchy with identical siblings and no unique IDs', function () {
            var elements = compareElementsAndSimmer('tr:nth-child(2) td:nth-child(3)');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
        });

        test('can analyze an anchor (link) with a unique href attribute', function () {
            var elements = compareElementsAndSimmer('table tr th:nth-child(2) a');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
        });

        test('can analyze a link with a non unique href attribute and a heirarchy which has no unique IDs', function () {
            var elements = compareElementsAndSimmer('table tr th:nth-child(3) a');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
        });

        test('can analyze an element with identical siblings, no IDs and sibling with the same class', function () {
            var elements = compareElementsAndSimmer('td span:nth-child(3)');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
        });

        test('can analyze an element with identical siblings, no ID and same class as sibling but different class order', function () {
            var elements = compareElementsAndSimmer('td span:nth-child(4)');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
        });

        test('can analyze an element with identical siblings, no ID and different classes completely', function () {
            var elements = compareElementsAndSimmer('td span:nth-child(2)');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
        });

        test('cannot parse an element with an identical hierarchy whithin the Simmer\'s default configured depth', function () {
            var placeHolder = $$('#placeholderId');
            placeHolder.removeAttr('id');
            var elements = compareElementsAndSimmer(placeHolder[0]);
            notEqual(elements, undefined);
            deepEqual(elements, false);
        });

        test('can analyze an element with a parent which has an invalid Tag name', function () {
            var elements = compareElementsAndSimmer('.invalid_child_tag span');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
        });

        test('can analyze an element based only on child elements when specific enough at level 1', function () {
            var elements = compareElementsAndSimmer('.uniqueClassName');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
            // make sure the selector is one level deep
            equal(elements.selector.split('>').length, 1);
        });

        test('can analyze an element based only on child elements when specific enough at level 2', function () {
            var elements = compareElementsAndSimmer('.secondLevelUniqueClassName div');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
            // make sure the selector is one level deep
            equal(elements.selector.split('>').length, 2);
        });

        test('can analyze an element with a valid ID that has only numbers in it\'s ID', function () {
            var elements = compareElementsAndSimmer('#111');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
            // make sure the selector is one level deep
            ok(elements.selector.match('111'), "expected ID 111 as selector");
        });

        test('can analyze an element with a valid ID that has numbers and then letters in it\'s ID', function () {
            var elements = compareElementsAndSimmer('#111aaaaaa');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
            // make sure the selector is one level deep
            ok(elements.selector.match('111aaaaaa'), "expected ID 111aaaaaa as selector");
        });

        test('can analyze an element with a valid ID that ends with numbers in it\'s ID', function () {
            var elements = compareElementsAndSimmer('#a111');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
            // make sure the selector is one level deep
            ok(elements.selector.match('a111'), "expected ID a111 as selector");
        });

        test('can analyze an element with a valid ID that has numbers in the middle of it\'s ID', function () {
            var elements = compareElementsAndSimmer('#a111a');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
            // make sure the selector is one level deep
            ok(elements.selector.match('a111a'), "expected ID a111a as selector");
        });

        test('can analyze an element with an invalid ID (not unique)', function () {
            var elements = compareElementsAndSimmer('.invalidIDElement');
            notEqual(elements, undefined);
            notEqual(elements.SimmerEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.SimmerEl);
            // make sure the selector is one level deep
            equal(elements.selector.match(':asd'), null);
        });

        test('can\'t analyze an element which is longer than the selectorMaxLength chars', function () {
            var placeHolder = $$('#aZROCRDPX41Qkden3aiC3o9Tkl0xqENUjIgNSWbe6pSddw86ogN018T9lD67zAF1YHaLkRngy8YVq88IBfqdvtO9aXZZbD1NsSBiUo6txcv22ufrkRs9AZKkxIkTF1gNAZ3Oh4M6TcYWRARVJqOZwo3dQufTDm904ep3yHZ5vdHqIyFqTFdZYPWYumx5gJBmWn7GbZQ3O3HodzmHYIHhCYg4dCDfSN8iCHzezerdHbzWUKR7pzMDOzvq017a63LSqYkSJ0gWxrgJFj45HR25eJj5szEFmuQlCfkbWpCwYopeNhy1toC9PvSfVCnHpI7EXeqVcspP0aQISflgD0pBMgg2ieITRa5gXRnKoDdem1yXvHjcDBXJFoUy63zDwg6tTtRR6rijcvoxNzGjWCgQhdqzlv6CW2CVgK2aa0VSX9RMSUTSKXmru7mvZUXJxv7RO7n1Zw9meFygwHwgNrZgeRWVYhsXBtEG8Bak7sPQ7x37QXgIgbJRcbhqMK2F5baa');
            var elements = compareElementsAndSimmer(placeHolder[0]);
            notEqual(elements, undefined);
            deepEqual(elements, false);
        });
    };
})