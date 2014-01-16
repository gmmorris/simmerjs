/**
 * @name TEST kanakanak.js
 * @author Gidi Morris (c) 2014
 * @version 0.0.1
 */


// build DOM tree
var DOMString = '<div id="TopContainer"><div class="header"><span id="NavBar"> <ul><Li class="Edge"><a href="./page/link_1">Page #1</a></Li><Li><span>Here:<span id="helper"></span></span><a href="./page/link_2">Page #2</a></Li><Li class="Active"><a href="./page/link_3">Page #3</a></Li><Li><a href="./page/link_4">Page #4 <img src="./image/Pixel.png"/></a></Li><Li class="Edge"><a href="./page/link_5">Page #5</a></Li></ul> </span></div><div id="111"></div><div id="a111a"></div><div id="a111"></div><div id="111aaaaaa"></div><div id="BodyDiv"><div id="NonUniqueDiv"><img src="./image/NoID.png"></div><div><img src="./image/NonUniqueSRC.png"><table><tr><th><a href="non.html">First</a></th><th><a href="second.html">Second</a></th><th><a href="non.html">Third<a/></th></tr><tr><td>1 <span class="sameclass diferentclass1"></span> <span class="diferentclass2"></span> <span class="diferentclass1"></span> <span class="diferentclass1 sameclass"></span> <span class="diferentclass1"></span></td><td>2</td><td>Cell to target!</td></tr><tr><td>A</td><td>B</td><td>C</td></tr></table></div><div id="NonUniqueDiv"><img src="./image/NonUniqueSRC.png"></div></div><div><span><span><span><span><span><p><a href="a">a</a></p></span></span></span></span></span><span><span><span><span><span><p><a href="a" id="placeholderId">a</a></p></span></span></span></span></span><span><span><p><a href="a">a</a></p></span></span></div><div class="invalid_child_tag"><gidi:test><span></span></gidi:test></div><div id="placeholder_4"><div><div class="uniqueClassName"></div></div></div><div id="placeholder_4"><div class="secondLevelUniqueClassName"><div></div></div></div><div id="placeholder_5"><div><div id=":asd" class="invalidIDElement"></div></div></div></div><div><div><div><div><div><div><div><div id="aZROCRDPX41Qkden3aiC3o9Tkl0xqENUjIgNSWbe6pSddw86ogN018T9lD67zAF1YHaLkRngy8YVq88IBfqdvtO9aXZZbD1NsSBiUo6txcv22ufrkRs9AZKkxIkTF1gNAZ3Oh4M6TcYWRARVJqOZwo3dQufTDm904ep3yHZ5vdHqIyFqTFdZYPWYumx5gJBmWn7GbZQ3O3HodzmHYIHhCYg4dCDfSN8iCHzezerdHbzWUKR7pzMDOzvq017a63LSqYkSJ0gWxrgJFj45HR25eJj5szEFmuQlCfkbWpCwYopeNhy1toC9PvSfVCnHpI7EXeqVcspP0aQISflgD0pBMgg2ieITRa5gXRnKoDdem1yXvHjcDBXJFoUy63zDwg6tTtRR6rijcvoxNzGjWCgQhdqzlv6CW2CVgK2aa0VSX9RMSUTSKXmru7mvZUXJxv7RO7n1Zw9meFygwHwgNrZgeRWVYhsXBtEG8Bak7sPQ7x37QXgIgbJRcbhqMK2F5baa"></div></div></div></div></div></div></div></div>';


// add a global accessor for jQuery so that applyDom() will
// keep working even with jQuery hidden
var $$ = window.jQuery;
var $$Sizzle = window.Sizzle;

// helper method
var compareElementsAndKanakanaK = function (elementSelector, parentOfSelected) {
    var element;
    if (typeof(elementSelector) == 'string') {
        element = $$Sizzle(elementSelector)[0];
        if (parentOfSelected) {
            element = element.parentNode;
        }
    } else {
        element = elementSelector;
    }

    if (!element) {
        return {el:undefined, kanakanakEl:false};
    }

    var selector = KanakanaK(element);
    if (selector === false) {
        // if failed return false
        return selector;
    }

    var returnedFromkanakanakSelector = $$Sizzle(selector)[0];

//    log((parentOfSelected ? 'PARENT OF: ' + elementSelector : elementSelector), selector);

    return {el:element, kanakanakEl:returnedFromkanakanakSelector, selector:selector};
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


    var applyDom = function () {
        $$('#fixture').remove();
        $$('body').append('<div id="fixture" style="display:none">' + DOMString + '</div>');
    };

    // run first time
    applyDom();

    // set as reset function so that it is run every time a test is completed
    QUnit.reset = applyDom;

    /**
     * We want to test KanakanaK from all directions - with Sizzle on the page, jQuery on the page and no query engine on the page
     * So we'll define a function which executes all the tests and reset the page's state for each module
     */


    var executeTests = function(){


        test('can analyze an element with an ID', function () {
            var elements = compareElementsAndKanakanaK('#BodyDiv');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
        });

        test('can analyze an element with classes only (No ID)', function () {
            var elements = compareElementsAndKanakanaK('.header');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
        });

        test('can analyze an element which is a child of an element with an ID', function () {
            var elements = compareElementsAndKanakanaK('#NavBar ul');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
        });

        test('can analyze anelement which has a class only (no IDs on it or its direct parent)', function () {
            var elements = compareElementsAndKanakanaK('.Active');
            notEqual(elements, undefined);
            equal(elements.el, elements.kanakanakEl);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
        });

        test('can analyze an element with an invalid ID (isn\'t unique)', function () {
            var elements = compareElementsAndKanakanaK('#BodyDiv div:nth-child(3)');
            equal(elements.el, elements.kanakanakEl);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            notEqual(elements, undefined);
        });

        test('can analyze an element with an invalid ID (isn\'t unique) at same level as other element with the same ID', function () {
            var elements = compareElementsAndKanakanaK('#BodyDiv div:nth-child(1)');
            notEqual(elements, undefined);
            equal(elements.el, elements.kanakanakEl);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
        });

        test('can analyze an element with identical siblings (neither unique ID nor class)', function () {
            var elements = compareElementsAndKanakanaK('.Edge:nth-child(5)');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
        });

        test('can analyze an element with a parent which has identical siblings', function () {
            var elements = compareElementsAndKanakanaK('#helper', true); // parent of #helper!
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
        });

        test('can analyze an image who\'se paren\'t has an invalid ID', function () {
            var elements = compareElementsAndKanakanaK('#BodyDiv div:nth-child(1) img');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
        });

        test('can analyze an image with a non unique src attribute', function () {
            var elements = compareElementsAndKanakanaK('#BodyDiv div:nth-child(2) img');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
        });

        test('can analyze an image with a unique src attribute', function () {
            var elements = compareElementsAndKanakanaK('img[src="./image/Pixel.png"]');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
        });

        test('can analyze a child of a hierarchy with identical siblings and no unique IDs', function () {
            var elements = compareElementsAndKanakanaK('tr:nth-child(2) td:nth-child(3)');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
        });

        test('can analyze an anchor (link) with a unique href attribute', function () {
            var elements = compareElementsAndKanakanaK('table tr th:nth-child(2) a');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
        });

        test('can analyze a link with a non unique href attribute and a heirarchy which has no unique IDs', function () {
            var elements = compareElementsAndKanakanaK('table tr th:nth-child(3) a');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
        });

        test('can analyze an element with identical siblings, no IDs and sibling with the same class', function () {
            var elements = compareElementsAndKanakanaK('td span:nth-child(3)');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
        });

        test('can analyze an element with identical siblings, no ID and same class as sibling but different class order', function () {
            var elements = compareElementsAndKanakanaK('td span:nth-child(4)');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
        });

        test('can analyze an element with identical siblings, no ID and different classes completely', function () {
            var elements = compareElementsAndKanakanaK('td span:nth-child(2)');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
        });

        test('cannot parse an element with an identical hierarchy whithin the kanakanak\'s default configured depth', function () {
            var placeHolder = $$('#placeholderId');
            placeHolder.removeAttr('id');
            var elements = compareElementsAndKanakanaK(placeHolder[0]);
            notEqual(elements, undefined);
            deepEqual(elements, false);
        });

        test('can analyze an element with a parent which has an invalid Tag name', function () {
            var elements = compareElementsAndKanakanaK('.invalid_child_tag span');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
        });

        test('can analyze an element based only on child elements when specific enough at level 1', function () {
            var elements = compareElementsAndKanakanaK('.uniqueClassName');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
            // make sure the selector is one level deep
            equal(elements.selector.split('>').length, 1);
        });

        test('can analyze an element based only on child elements when specific enough at level 2', function () {
            var elements = compareElementsAndKanakanaK('.secondLevelUniqueClassName div');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
            // make sure the selector is one level deep
            equal(elements.selector.split('>').length, 2);
        });

        test('can analyze an element with a valid ID that has only numbers in it\'s ID', function () {
            var elements = compareElementsAndKanakanaK('#111');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
            // make sure the selector is one level deep
            ok(elements.selector.match('111'), "expected ID 111 as selector");
        });

        test('can analyze an element with a valid ID that has numbers and then letters in it\'s ID', function () {
            var elements = compareElementsAndKanakanaK('#111aaaaaa');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
            // make sure the selector is one level deep
            ok(elements.selector.match('111aaaaaa'), "expected ID 111aaaaaa as selector");
        });

        test('can analyze an element with a valid ID that ends with numbers in it\'s ID', function () {
            var elements = compareElementsAndKanakanaK('#a111');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
            // make sure the selector is one level deep
            ok(elements.selector.match('a111'), "expected ID a111 as selector");
        });

        test('can analyze an element with a valid ID that has numbers in the middle of it\'s ID', function () {
            var elements = compareElementsAndKanakanaK('#a111a');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
            // make sure the selector is one level deep
            ok(elements.selector.match('a111a'), "expected ID a111a as selector");
        });

        test('can analyze an element with an invalid ID (not unique)', function () {
            var elements = compareElementsAndKanakanaK('.invalidIDElement');
            notEqual(elements, undefined);
            notEqual(elements.kanakanakEl, undefined);
            notEqual(elements.el, undefined);
            equal(elements.el, elements.kanakanakEl);
            // make sure the selector is one level deep
            equal(elements.selector.match(':asd'), null);
        });

        test('can\'t analyze an element which is longer than the selectorMaxLength chars', function () {
            var placeHolder = $$('#aZROCRDPX41Qkden3aiC3o9Tkl0xqENUjIgNSWbe6pSddw86ogN018T9lD67zAF1YHaLkRngy8YVq88IBfqdvtO9aXZZbD1NsSBiUo6txcv22ufrkRs9AZKkxIkTF1gNAZ3Oh4M6TcYWRARVJqOZwo3dQufTDm904ep3yHZ5vdHqIyFqTFdZYPWYumx5gJBmWn7GbZQ3O3HodzmHYIHhCYg4dCDfSN8iCHzezerdHbzWUKR7pzMDOzvq017a63LSqYkSJ0gWxrgJFj45HR25eJj5szEFmuQlCfkbWpCwYopeNhy1toC9PvSfVCnHpI7EXeqVcspP0aQISflgD0pBMgg2ieITRa5gXRnKoDdem1yXvHjcDBXJFoUy63zDwg6tTtRR6rijcvoxNzGjWCgQhdqzlv6CW2CVgK2aa0VSX9RMSUTSKXmru7mvZUXJxv7RO7n1Zw9meFygwHwgNrZgeRWVYhsXBtEG8Bak7sPQ7x37QXgIgbJRcbhqMK2F5baa');
            var elements = compareElementsAndKanakanaK(placeHolder[0]);
            notEqual(elements, undefined);
            deepEqual(elements, false);
        });
    };

    /**
     * Execute the different modules
     */

    module("KanakanaK using Sizzle", {
        setup: function() {
            // hide jQuery from page, just incase
            window.loadedjQuery = window.jQuery.noConflict();
            $ = null;
        },
        teardown: function() {
            // return jQuery to it's rightful place
            $ = window.loadedjQuery;
            window.jQuery = $;
        }
    });

    executeTests();

    module("KanakanaK using jQuery", {
        setup: function() {
            // hide Sizzle from page, just incase
            window.loadedSizzle = Sizzle;
            window.Sizzle = null;
        },
        teardown: function() {
            // return Sizzle to it's rightful place
            window.Sizzle = window.loadedSizzle;
        }
    });

    executeTests();

    module("KanakanaK using document.querySelectorAll", {
        setup: function() {
            // hide Sizzle from page, just incase
            window.loadedSizzle = Sizzle;
            window.Sizzle = null;

            // hide jQuery from page, just incase
            window.loadedjQuery = window.jQuery.noConflict();
            window.$ = null;
            window.jQuery = null;

//
//            // initialize KanakanaK to use Sizzle
//            KanakanaK.configuration({
//                depth:6,
//                specifictyThreshold:50
//            });
        },
        teardown: function() {
            // return Sizzle to it's rightful place
            window.Sizzle = window.loadedSizzle;
            // return jQuery to it's rightful place
            $ = window.loadedjQuery;
            window.jQuery = $;
        }
    });

    executeTests();


})