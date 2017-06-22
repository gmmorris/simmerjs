export default function Parser (parsingMethods) {
  const queue = parsingMethods.getMethods()
  return {
    finished () {
      return queue.length === 0
    },
    next (...args) {
      if (this.finished()) {
        return false
      }
      return queue.shift()(...args)
    }
  }
}
