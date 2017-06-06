const { JSDOM } = require('jsdom')
import fixture from './fixture'
import { NoResult, compareParentElementAndSimmer, compareElementsAndSimmer } from './utils'

import installSimmer from '../modules/simmer'
import helpers from '../modules/helpers'
import initQueryEngine, { domProto } from '../modules/queryEngine'

const installSimmerOnWindow = windowScope => {
  installSimmer(windowScope,
    helpers,
    initQueryEngine(windowScope, domProto)
  )

  windowScope.Simmer.configuration({
    errorHandling : e => console.log(e)
  })
  
  return windowScope
}

const createWindow = (dom = '') => installSimmerOnWindow(new JSDOM(`<body>${dom}</body>`).window)
const firstChildInBody = window => window.document.body.children[0]

test('takes an element and returns a matching selector', () => {
  const window = createWindow(fixture)

  var elements = compareElementsAndSimmer(window, '#BodyDiv');

  console.log({ elements })

  expect(
    elements
  ).not.toBe(
    undefined
  )

  expect(
    elements.SimmerEl
  ).not.toBe(
    undefined
  )

  expect(
    elements.el
  ).not.toBe(
    undefined
  )

  expect(
    elements.el
  ).toBe(
    elements.SimmerEl
  )
})


