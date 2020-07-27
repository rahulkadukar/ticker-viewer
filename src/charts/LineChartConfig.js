const createProperty = (name, type, desc, value) => {
  return {
    name,
    type,
    desc,
    value,
  }
}

const generateData = (n) => {
  const data = []
  let d = new Date()
  for (let i = 0; i < n; ++i) {
    data.push({
      k: d.toISOString().slice(0,10),
      v: i + Math.floor(Math.random() * 205)
    })
    d.setTime(d.getTime() + (864e2 * 1e3))
  }
  return data
}

const data = generateData(1000)

const config = {
  "docs": [
    createProperty("barPadding", "Numeric",
        "Adjust distance between two adjacent bars.", 10),
    createProperty("barWidth", "Numeric",
        "Adjust the width of each bar. Default 50", 50),
    createProperty("heightChart", "Numeric",
        "Height of the chart. Default 500", 600),
    createProperty("marginBottom", "Numeric",
        "The margin from the bottom of the element", 40),
    createProperty("marginLeft", "Numeric",
        "The margin from the left of the element", 20),
    createProperty("marginRight", "Numeric",
        "The margin from the right of the element", 40),
    createProperty("marginTop", "Numeric",
        "The margin from the top of the element", 20),
    createProperty("slidingWindow", "Boolean",
        "Display a sliding window for using the Brush", true),
    createProperty("slidingWindowHeight", "Numeric",
        "Sliding window height", 160),
    createProperty("title", "Text",
        "The title to display on the chart", "Title")
  ]
}

module.exports = {
  config,
  data,
}