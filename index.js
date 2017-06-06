/*global window, document */

import installSimmer from './modules/simmer'
import helpers from './modules/helpers'
import initQueryEngine, { domProto } from './modules/queryEngine'

/** Simmer
 * @author Gidi Morris, 2014
 * @version 0.2.0
 */
installSimmer(window,
  helpers,
  initQueryEngine(window, domProto)
)
