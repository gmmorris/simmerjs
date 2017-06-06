/*global window, document */

import installSimmer from './simmer'
import helpers from './helpers'
import initQueryEngine, { domProto } from './queryEngine'

/** Simmer
 * @author Gidi Morris, 2014
 * @version 0.2.0
 */
installSimmer(window,
  helpers,
  initQueryEngine(window, domProto)
)
