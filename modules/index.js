/* global window, document */
import simmer from './simmer'
import exposeOnWindow from './exposeOnWindow'

exposeOnWindow(window, simmer(window))
