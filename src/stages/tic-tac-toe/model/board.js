export default function () {
  let boardState
  let turnCount
  let gameover
  resetBoard()

  // position is from 0 to 8, 0-1-2 is first row, 3-4-5 is second row osv
  function move (piece, position) {
    boardState[position] = piece
    turnCount++

    console.log(boardState)

    if (winnerFound(piece)) return 'won'
    if (isDraw()) return 'draw'
  }

  function isMoveLegal (piece, position) {
    let pieceNo = piece === 'X' ? 0 : 1
    if (!gameover && turnCount % 2 === pieceNo && boardState[position] === null) {
      return true
    }
    return false
  }

  function winnerFound (piece) {
    // check horizontal
    for (let y = 0; y < 3; y++) if (checkHorizontal(piece, y)) gameover = true
    for (let x = 0; x < 3; x++) if (checkVertical(piece, x)) gameover = true
    if (checkCrosses(piece)) gameover = true
    return gameover
  }

  function checkHorizontal (piece, y) {
    if (boardState[y * 3 + 0] !== piece) return false
    if (boardState[y * 3 + 1] !== piece) return false
    if (boardState[y * 3 + 2] !== piece) return false
    return true
  }

  function checkVertical (piece, x) {
    if (boardState[x + 3 * 0] !== piece) return false
    if (boardState[x + 3 * 1] !== piece) return false
    if (boardState[x + 3 * 2] !== piece) return false
    return true
  }

  function checkCrosses (piece) {
    if (boardState[4] !== piece) return false
    if (boardState[0] === piece && boardState[8] === piece) return true
    if (boardState[2] === piece && boardState[6] === piece) return true
    return false
  }

  function isDraw () {
    for (let t in boardState) {
      if (boardState[t] === null) return false
    }
    gameover = true
    return true
  }

  function getBoard () {
    return boardState
  }

  function resetBoard () {
    setBoard([
      null, null, null,
      null, null, null,
      null, null, null
    ], 0)
    gameover = false
  }

  function setBoard (newBoardState, newTurnCount) {
    boardState = newBoardState
    turnCount = newTurnCount
  }

  return {
    move,
    isMoveLegal,
    getBoard,
    resetBoard,
    setBoard
  }
}
