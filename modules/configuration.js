// Configuration
export const DEFAULT_CONFIGURATION = {
  // A function for calling an external query engine for testing CSS selectors such as jQuery or Sizzle
  // (If you have jQuery or Sizzle on the page, you have no need to supply such a function as Simmer will detect
  // these and use them if they are available. this will not work if you have these libraries in noConflict mode.
  queryEngine: null,
  // A minimum specificty level. Once the parser reaches this level it starts verifying the selector after every method is called
  // This can cut down our execution time by avoiding needless parsing but can also hurt execution times by performing many
  // verifications. This number will have to be tweeked here and there as we use the component...
  specificityThreshold: 100,
  // How deep into the DOM hierarchy should Simmer go in order to reach a unique selector.
  // This is a delicate game because the higher the number the more likely you are to reach a unique selector,
  // but it also means a longer and more breakable one. Assuming you want to store this selector to use later,
  // making it longer also means it is more likely to change and loose it's validity.
  depth: 3,
  // Handling errors in the Simmer analysis process.
  // true / false / callback
  // false: errors are ignored by Simmer
  // true: errors rethrown by the process
  // a function callback will be called with two parameters: the exception and the element being analyzed
  errorHandling: false,
  // A maximum length for the CSS selector can be specified - if no specific selector can be found which is shorter than this length
  // then it is treated as if no selector could be found
  selectorMaxLength: 512
}

export function configure (config = {}) {
  return {
    ...DEFAULT_CONFIGURATION,
    ...config
  }
}
