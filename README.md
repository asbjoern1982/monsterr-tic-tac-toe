# monsterr-tic-tac-toe
Example game for the monsterr framework

Tic-tac-toe goes back to the ancient egypt and was played all over the roman empire, it's a true classic. No gamingframework would be complete without an example of this game.

## Communication
In this examplegame a more complicated model where only a single move is sendt over the network compared to the complete boardstate in monsterr-chess.

The server and the client shares a model with a board-object with a number of functions
```Javascript
return {
  move,
  isMoveLegal,
  getBoard,
  resetBoard,
  setBoard
}
```
When a player picks a position it is sent to the server
```Javascript
client.getCanvas().on('mouse:down', (event) => {
  let position = view.getIndex({x: event.e.clientX, y: event.e.clientY})
  if (position > -1) {
    if (board.isMoveLegal(iAm, position)) {
      client.send('move', position)
    }
  }
})
```
The server then validates it, moves the piece and check for gameover-conditions, and informs the clients. The clients then updates it own model with the move and redraws the canvas
```Javascript
'move': (client, move) => {
  board.move(move.piece, move.position)
  view.draw(client.getCanvas(), board.getBoard(), boardSize)
},
```

## Bots
It is also a greate way to demonstrate how to use bots in monsterr.
