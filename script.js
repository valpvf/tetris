// const PLAYFIELDS_COLUMNS = 10;
// const PLAYFIELDS_ROWS = 20;
// const TETROMINO_NAMES = ["O", "J"];

// const TETROMINOES = {
//   O: [
//     [1, 1],
//     [1, 1],
//   ],
//   J: [
//     [1, 0, 0],
//     [1, 1, 1],
//     [0, 0, 0],
//   ],
// };

function convertPositionToIndex(row, column) {
  return row * PLAYFIELDS_COLUMNS + column;
}

let playfield;
let tetromino;

function generatePlayField() {
  for (let i = 0; i < PLAYFIELDS_COLUMNS * PLAYFIELDS_ROWS; i++) {
    const div = document.createElement("div");
    document.querySelector(".grid").append(div);
  }
  playfield = new Array(PLAYFIELDS_ROWS)
    .fill()
    .map(() => new Array(PLAYFIELDS_COLUMNS).fill(0));
  // console.log(playfield);
}

function generateTetromino() {
  const type = Math.round(
    Math.random() * (TETROMINO_NAMES.length - 1)
  );
  const name = TETROMINO_NAMES[type];
  const matrix = TETROMINOES[name];
  // console.log(matrix.length);
  const column = Math.floor((PLAYFIELDS_COLUMNS - matrix.length) / 2);

  tetromino = {
    name,
    matrix,
    row: 0,
    column,
  };
}

generatePlayField();
generateTetromino();
const cells = document.querySelectorAll(".grid div");

function drawPlayField() {
  for (let row = 0; row < PLAYFIELDS_ROWS; row++) {
    for (let column = 0; column < PLAYFIELDS_COLUMNS; column++) {
      if (playfield[row][column] == 0) continue;
      const name = playfield[row][column];
      const cellIndex = convertPositionToIndex(row, column);
      // console.log(cellIndex);
    }
  }
  // cells[cellIndex].classList.add("O");
}

function drawTetromino() {
  const name = tetromino.name;
  const tetrominoMatrixSize = tetromino.matrix.length;

  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (!tetromino.matrix[row][column]) continue;
      const cellIndex = convertPositionToIndex(
        tetromino.row + row,
        tetromino.column + column
      );
      // console.log(cellIndex);
      cells[cellIndex].classList.add(name);
    }
    //column
  }
  //row
}

// drawTetromino();
// drawPlayField();

function draw() {
  cells.forEach((cell) => cell.removeAttribute("class"));
  drawTetromino();
  drawPlayField();
}

draw();

document.addEventListener("keydown", onKeyDown);
function onKeyDown(e) {
  switch (e.key) {
    case "ArrowDown":
      moveTetrominoDown();
      break;
    case "ArrowLeft":
      moveTetrominoLeft();
      break;
    case "ArrowRight":
      moveTetrominoRight();
      break;
  }
  draw();
}

function moveTetrominoDown() {
  tetromino.row += 1;
}

function moveTetrominoLeft() {
  tetromino.column -= 1;
}
function moveTetrominoRight() {
  tetromino.column += 1;
}
