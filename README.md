Simmer JS [![Build Status](https://travis-ci.org/gmmorris/simmerjs.svg?branch=master)](https://travis-ci.org/gmmorris/simmerjs) [![Code Climate](https://codeclimate.com/github/gmmorris/simmerjs/badges/gpa.svg)](https://codeclimate.com/github/gmmorris/simmerjs)
=========

# Warning!
For the first time in 6 years I'm actually taking back ownership of this code, cleaning it up, refactoring etc.
The API is likely to change in the near future, along with a Major Version bump, so if you're taking an interest in it - talk to me.

## Docs

A pure Javascript reverse CSS selector engine which calculates a DOM element's unique CSS selector on the current page.

## Installation
Simmer is now meant to be consumed as a module via npm and is no longer meant as a drop in script into the browser.
That said, we still build a version meant to be dropped into the browser which resides on *window.Simmer* as before.

We highly recommend you consume Simmer in the following manner, but in the interest of supporting exosting users we've retained the previous API.

```bash
npm i --save simmerjs
```

And then in your code:
```js
import Simmer from 'simmerjs'

const simmer = new Simmer()

const el =  document.getElementById('#SomeElement')

expect(
    simmer(el)
).to.equal(
    '#SomeElement'
)

```

When using the distribution located in the repo under **dist/simmer.js** a global *Simmer* function will be exposed on the **window**.
This is **not** the constructor, but rather a default instance which has exposed itself on the window wit ha default configuration.
This is not an idea API and is meant to maintain the original API dating back to 2011 when this library was originally written.

### Basic usage

To use Simmer to analyze an element and produce a unique CSS selector for it, all you have to do is instansiate a simmer query engine and pass it an element on the page.
Usually you'd create a single instance which you would then use multiple times.


```html
<div id="myUniqueElement">
    <span></span>
    <br/>
    <span></span>
</div>
```

```js
import Simmer from 'simmerjs'

const simmer = new Simmer(window, { /* some custom configuration */ })
var myElement = document.getElementById("#myUniqueElement");

console.log(simmer(myElement)); // prints "#myUniqueElement"
```
## API

### Simmer
```js
    Simmer([Scope], [Options], [query])
```

#### Scope
When you create an instance of Simmer its first argument is the context in which Simmer should query for elements.
Generally speaking this would be the **window**, which is the default value, but it would be overriden in a situation where you might be using Simmer against a Virtual Dom implementation.
If you _are_ using a Virtual DOM, you should provide the Window object of the Virtual DOM

#### Options
The second argument is an Options object allowing you to override the default configuration for Simmer's behaviour.

The options are:

| Option | Default |
| ------ | ------- |
| **specificityThreshold** - A minimum specificty level. Once the parser reaches this level it starts verifying the selector after every method is called. This can cut down our execution time by avoiding needless parsing but can also hurt execution times by performing many verifications. Specificity is calculated based on the W3C spec: http://www.w3.org/TR/css3-selectors/#specificity |  100 |
| **depth** - How deep into the DOM hierarchy should Simmer go in order to reach a unique selector. This is a delicate game because the higher the number the more likely you are to reach a unique selector, but it also means a longer and more breakable one. Assuming you want to store this selector to use later, making it longer also means it is more likely to change and loose it's validity. | 3 | |
| **errorHandling** - How to handle errors which occur during the analysis <br/><br/>Valid Options<br/><ul><li>_false_: errors are ignored by Simmer</li><li>_true_: errors rethrown and expected to be caught by the user</li><li>_a function callback will be called with two parameters: the exception and the element being analyzed</li></ul> | false |
| **selectorMaxLength** - A maximum length for the CSS selector can be specified - if no specific selector can be found which is shorter than this length then it is treated as if no selector could be found. | 520 |

#### query
The third argument is a query engine you wish Simmer to use when evaluating generated selectors.
By default Simmer uses the **window.document.querySelectorAll** function and if you provide a window to the scope, Simmer will assume that you want it to use the **document.querySelectorAll** on that **window**.
But if you wish Simmer to use another custom function, such as your own tweaked version of jQuery, you can do so by passing the third argument to the Simmer constructor.

The signature the query function should provide is this:

##### query(selector: String, onError: Error => {}) : Array(DomElements)
What this means is that the function you provide should expect to receive a string CSS selector and a function.
It should them query for elements matching the selector and return an array of the results (even if there is only one result, it should be returned in an Array.).

The second argument is a function which should be called if any error is encountered when querying for the elements.
If an error occurs or a problem is encountered, instead of throwing, you should call the function and pass the error object to it. Simmer will then handle the error as per its configuration.

### Reconfiguring
If you have an existing instance of Simmer, you can use its **configure** method to instanciate a new Simmer which has the same scope and configuration as the existing one, with any new configuration you wish to apply.

So, for example, in the browser, you can replace the global Simmer wit ha newly configured version:
```js

window.Simmer = window.Simmer.configure({
    depth: 10
})
```

And in Node:
```js
import Simmer from 'simmerjs'

const virtualWindow = new JSDom()

const simmer = new Simmer(virtualWindow)

const reconfiguredSimmer = simmer.configure({ /* some custom configuration */ })

```

### Conflict
When the Simmer browser dist located at **dist/simmer.js** is injected in to the browser it adds the noConflict function on itself.
This is not relevant in a Node environment and isn't available there.

Just in case you also had the brilliant idea of using a variable called "Simmer", or you wish to move it off of the global object then you can use the noConflict method to receive a reference to the object and remove it from the window.
Calling it will also revert the original value of window.Simmer which was there before loading the Simmer.js script (if there was one)

```js
    var mySimmer = Simmer.noConflict();
    mySimmer(myElm);
```