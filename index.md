Simmer
=========

A pure Javascript reverse CSS selector engine which calculates a DOM element's unique CSS selector on the current page.

You can rad an article about [the process behind the creation of Simmer on Medium.](https://medium.com/@chekofif/how-i-built-a-reverse-css-selector-engine-42cb8062a8be).

### Basic usage

To use Simmer to analyze an element and produce a unique CSS selector for it, all you have to do is call the global
Simmer variable as a function.


```html
<div id="myUniqueElement">
    <span></span>
    <br/>
    <span></span>
</div>
```

```js
var myElement = document.getElementById("#myUniqueElement");

console.log(Simmer(myElement)); // prints "#myUniqueElement"
```

### Configurations

The global Simmer variable has a method called "configuration" which can be used in two way:
1. Simple calling it will return an object which contains the current configuration values:

```js
    // calling
    Simmer.configuration();

    //returns the object:
    {
        depth   :3,
        specifictyThreshold:100,
        queryEngine :null,
        errorHandling    :false,
        selectorMaxLength:512
    }
```

2.  Calling it with an object as a parameter allows you to replace the current configured values with new ones:

```js
    // calling
    Simmer.configuration({
        depth   :5
    });

    //returns the object:
    {
        depth   :5,
        specifictyThreshold:100,
        queryEngine :null,
        errorHandling    :false,
        selectorMaxLength:512
    }
```

These are the different configuration options:
* `depth` - How deep into the DOM hierarchy should Simmer go in order to reach a unique selector. This is a delicate game because the higher the number the more likely you are to reach a unique selector, but it also means a longer and more breakable one. Assuming you want to store this selector to use later, making it longer also means it is more likely to change and loose it's validity.
* `specifictyThreshold` - A minimum specificty level. Once the parser reaches this level it starts verifying the selector after every method is called. This can cut down our execution time by avoiding needless parsing but can also hurt execution times by performing many verifications. Specificity is calculated based on the W3C spec: http://www.w3.org/TR/css3-selectors/#specificity
* `errorHandling` - How to handle errors which occur during the analysis? The default is 'silent'. There are three possible values: 1) 'silent' which means nothing happens. The error is ignored and Simmer continues as usual. 2) 'verbose' which means the error will be thrown and has to be caught by the calling code. 3) A callback function which will be called with the error object as a first parameter and the element being parsed as second parameter.
* `selectorMaxLength` - A maximum length for the CSS selector can be specified - if no specific selector can be found which is shorter than this length then it is treated as if no selector could be found. By default 512 characters.

### Conflict

Just in case you also had the brilliant idea of using a variable called "Simmer", or you wish to move it off of the global object then you can use the noConflict method to receive a reference to the object and remove it from the window.
Calling it will also revert the original value of window.Simmer which was there before loading the simmer.js script (if there was one)

```js
    var mySimmer = Simmer.noConflict();
    mySimmer(myElm);
```

