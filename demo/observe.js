function observe(data) {
  if (data && typeof data === "object") {
    Object.keys(data).forEach(function (key) {
      defineReactive(data, key, data[key])
    })
  }
  return
}