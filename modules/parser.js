export default function Parser (parsingMethods) {
  const queue = parsingMethods.getMethods()
  return {
    finished () {
      return queue.length === 0
    },
    next (hierarchy, selectorState, config, validateSelector, query, onError) {
      if (this.finished()) {
        return false
      }
      return queue.shift()(
        hierarchy,
        selectorState,
        config,
        validateSelector,
        query,
        onError
      )
    }
  }
}
