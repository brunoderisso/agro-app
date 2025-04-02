class Polygon {
  convertAreaToHa(area) {
    let finalArea = ""

    if (area) {
      finalArea = (area / 10000).toFixed(2)
    } else {
      finalArea = "0"
    }

    return finalArea
  }

  formatToHa(area) {
    return `${area.toString().replace(".", ",")} ha.`
  }

  convertAreaToMeter(area) {
    let finalArea = 0

    if (area) {
      finalArea = area * 10000
    }

    return finalArea
  }
}

const polygonUtils = new Polygon()
export default polygonUtils