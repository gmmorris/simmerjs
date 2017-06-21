/* global window, document */

import installSimmer from './simmer'
import initQueryEngine from './queryEngine'

/** Simmer
 * @author Gidi Morris, 2014
 * @version 0.2.0
 */
installSimmer(window, initQueryEngine(window))
