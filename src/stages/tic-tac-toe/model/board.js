function createBoard () {
  let boardState = [
    -1, -1, -1,
    -1, -1, -1,
    -1, -1, -1
  ]
  let turnCount = 0

  // piece is 0 for X and 1 for O
  // position is from 0 to 8, 0-1-2 is first row, 3-4-5 is second row osv
  // return if it was a legal move and if the game is over
  function move (piece, position) {
    let pieceNo = piece === 'X' ? 0 : 1
    if (turnCount % 2 === pieceNo && boardState[position] === -1) {
      boardState[position] = pieceNo
      turnCount++

      if (winnerFound(pieceNo)) return 'won'
      if (isDraw()) return 'draw'

      return 'legal'
    }
    return 'illigal'
  }

  function winnerFound (pieceNo) {
    // check horizontal
    for (let y = 0; y < 3; y++) if (checkHorizontal(pieceNo, y)) return true
    for (let x = 0; x < 3; x++) if (checkVertical(pieceNo, x)) return true
    if (checkCrosses()) return true
    return false
  }

  function checkHorizontal (pieceNo, y) {
    if (boardState[y * 3 + 0] !== pieceNo) return false
    if (boardState[y * 3 + 1] !== pieceNo) return false
    if (boardState[y * 3 + 2] !== pieceNo) return false
    return true
  }

  function checkVertical (pieceNo, x) {
    if (boardState[x + 3 * 0] !== pieceNo) return false
    if (boardState[x + 3 * 1] !== pieceNo) return false
    if (boardState[x + 3 * 2] !== pieceNo) return false
    return true
  }

  function checkCrosses (pieceNo) {
    if (boardState[4] !== pieceNo) return false
    if (boardState[0] === pieceNo && boardState[8] === pieceNo) return true
    if (boardState[2] === pieceNo && boardState[6] === pieceNo) return true
    return false
  }

  function isDraw () {
    for (let t in boardState) {
      if (boardState[t] === -1) return false
    }
    return true
  }

  function getBoard () {
    return boardState
  }

  function setBoard (newBoardState, newTurnCount) {
    boardState = newBoardState
    turnCount = newTurnCount
  }

  return {
    move,
    getBoard,
    setBoard
  }
}

export const board = createBoard()
