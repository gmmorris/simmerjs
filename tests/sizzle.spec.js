import sizzle from 'sizzle';
import { setQueryFunction } from './testUtils';
import { test } from 'tape';

setQueryFunction((...args) => {
  let elm = sizzle(...args);
  if(elm && elm.length){
    if(elm.length === 1) {
      return elm[0];
    }
    throw(`Invalid number of elements returned for query: ${elm.join()}`)
  }
  return elm;
}, 'Sizzle');

require('./simmer.spec');
