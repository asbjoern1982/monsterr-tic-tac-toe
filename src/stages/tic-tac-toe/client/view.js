export function createView () {
  let ts
  let padding
  function draw (canvas, board, boardSize) {
    ts = boardSize / 3
    padding = boardSize / 12
    canvas.clear()
    canvas.backgroundColor = 'lightgrey'

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        let fill = (x % 2 + y % 2 === 1) ? 'grey' : 'white'
        let tile = new fabric.Rect({
          width: ts,
          height: ts,
          fill: fill,
          left: x * ts + padding,
          top: y * ts + padding,
          selectable: false
        })
        canvas.add(tile)
      }
    }

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (board[x * 3 + y] > -1) {
          let peiceStr = board[x * 3 + y] ? 'O' : 'X'
          let piece = new fabric.Text(peiceStr, {
            left: x * ts + padding + ts / 8,
            top: y * ts + padding,
            fontSize: ts,
            hasControls: false
          })
          canvas.add(piece)
        }
      }
    }
  }

  function getIndex (point) {
    if (point.x > padding && point.x < padding + ts * 3 &&
        point.y > padding && point.y < padding + ts * 3) {
      let x = Math.floor((point.x - padding) / ts)
      let y = Math.floor((point.y - padding) / ts)
      return x * 3 + y
    }
    return -1
  }

  return {
    draw,
    getIndex
  }
}

export const view = createView()
