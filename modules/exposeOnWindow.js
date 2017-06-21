export default function (windowScope, simmerInstance) {
  // Save the previous value of the `simmer` variable.
  let conflictedSimmer = windowScope.Simmer
  windowScope.Simmer = simmerInstance

  /**
   * Revert the global window.simmer variable to it's original value and return this simmer object.
   * This allows users to include multiple versions of Simmer objects on a single page.
   * @example
   <code><pre>
   Simmer.noConflict();
   </pre></code>
   */
  simmerInstance.noConflict = function () {
    windowScope.Simmer = conflictedSimmer
    return simmerInstance
  }
}
