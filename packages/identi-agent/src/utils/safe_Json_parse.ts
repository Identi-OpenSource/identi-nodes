function safeJsonParse(value: string, returnValue: boolean = true) {
  try {
    return JSON.parse(value)
  } catch (error) {
    if (returnValue) return value
    throw error
  }
}

export default safeJsonParse
