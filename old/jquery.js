import $ from 'jquery';
import { setQueryFunction } from './testUtils';
import { test } from 'tape';

setQueryFunction((...args) => {
  let elm = $(...args);
  if(elm && elm.length){
    if(elm.length === 1) {
      return elm[0];
    }
    throw(`Invalid number of elements returned for query: ${elm.join()}`)
  }
  return elm;
}, 'jQuery');

require('./simmer.spec');
