function convertPositionToIndex(row, column) {
  return row * PLAYFIELDS_COLUMNS + column;
}

function getRandomElement(arr) {
  const randomIndex = Math.round(Math.random() * (arr.length - 1));
  return arr[randomIndex];
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
  const name = getRandomElement(TETROMINO_NAMES);
  const matrix = TETROMINOES[name];
  // console.log(matrix.length);
  const column = Math.floor((PLAYFIELDS_COLUMNS - matrix.length) / 2);
  const rowTetro = -2;

  tetromino = {
    name,
    matrix,
    row: rowTetro,
    column,
  };
}

function placeTetromino() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (tetromino.matrix[row][column]) {
        playfield[tetromino.row + row][tetromino.column + column] =
          tetromino.name;
      }
    }
  }
  generateTetromino();
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
      cells[cellIndex].classList.add(name);
    }
  }
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
      // cells[cellIndex].innerHTML = showRotated[row][column];
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

// let showRotated = [
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9],
// ];

function rotateTetromino() {
  const oldMatrix = tetromino.matrix;
  const rotatedMatrix = rotateMatrix(tetromino.matrix);
  // showRotated = rotateMatrix(showRotated);

  tetromino.matrix = rotatedMatrix;
  if (!isValid()) {
    tetromino.matrix = oldMatrix;
  }
}

draw();

function rotate() {
  rotateTetromino();
  draw();
}

document.addEventListener("keydown", onKeyDown);
function onKeyDown(e) {
  switch (e.key) {
    case "ArrowUp":
      rotate();
      break;
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

function rotateMatrix(matrixTetromino) {
  const N = matrixTetromino.length;
  const rotateMatrix = [];
  for (let i = 0; i < N; i++) {
    rotateMatrix[i] = [];
    for (let j = 0; j < N; j++) {
      rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
    }
  }
  return rotateMatrix;
}

function moveTetrominoDown() {
  tetromino.row += 1;
  if (!isValid()) {
    tetromino.row -= 1;
    placeTetromino();
  }
}

function moveTetrominoLeft() {
  tetromino.column -= 1;
  if (!isValid()) {
    tetromino.column += 1;
  }
}
function moveTetrominoRight() {
  tetromino.column += 1;
  if (!isValid()) {
    tetromino.column -= 1;
  }
}

function isValid() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      // if (tetromino.matrix[row][column]) continue;
      if (isOutsideOfGameboard(row, column)) {
        return false;
      }
      if (hasCollisions(row, column)) {
        return false;
      }
    }
  }
  return true;
}

function isOutsideOfGameboard(row, column) {
  return (
    tetromino.matrix[row][column] &&
    (tetromino.column + column < 0 ||
      tetromino.column + column >= PLAYFIELDS_COLUMNS ||
      tetromino.row + row >= playfield.length)
  );
}

function hasCollisions(row, column) {
  return (
    tetromino.matrix[row][column] &&
    playfield[tetromino.row + row][tetromino.column + column]
  );
}
