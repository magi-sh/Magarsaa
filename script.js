let gridSize = 3; 
let tiles = [];
let emptyPos = { row: 0, col: 0 };

const gameContainer = document.getElementById('gameContainer');
const statusDiv = document.getElementById('status');
const levelDiv = document.getElementById('levelInfo');
const restartBtn = document.getElementById('restartBtn');

function init() {
  generatePuzzle(gridSize);
  levelDiv.innerText = `Level: ${gridSize}x${gridSize}`;
  statusDiv.innerText = '';
}

function generatePuzzle(size) {
  tiles = [];
  for (let i = 1; i < size * size; i++) {
    tiles.push(i);
  }
  tiles.push(null);
  do {
    shuffleArray(tiles);
  } while (!isSolvable(tiles, size));

  const emptyIndex = tiles.indexOf(null);
  emptyPos.row = Math.floor(emptyIndex / size);
  emptyPos.col = emptyIndex % size;

  renderGrid();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function isSolvable(tilesArray, size) {
  // Count inversions
  const arr = tilesArray.filter(tile => tile !== null);
  let inversions = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) inversions++;
    }
  }

  if (size % 2 === 1) {
    // odd grid
    return inversions % 2 === 0;
  } else {
    // even grid
    const emptyRowFromBottom = size - Math.floor(tilesArray.indexOf(null) / size);
    if (emptyRowFromBottom % 2 === 0) {
      return inversions % 2 === 1;
    } else {
      return inversions % 2 === 0;
    }
  }
}

function renderGrid() {
  gameContainer.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;
  gameContainer.innerHTML = '';

  for (let i = 0; i < tiles.length; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    const value = tiles[i];
    if (value === null) {
      tile.innerText = '';
      tile.style.backgroundColor = '#e8a005'; // empty space color
    } else {
      tile.innerText = value;
    }

    const row = Math.floor(i / gridSize);
    const col = i % gridSize;

    tile.addEventListener('click', () => {
      moveTile(row, col);
    });

    gameContainer.appendChild(tile);
  }
}

function moveTile(row, col) {
  if (
    (Math.abs(row - emptyPos.row) === 1 && col === emptyPos.col) ||
    (Math.abs(col - emptyPos.col) === 1 && row === emptyPos.row)
  ) {
    const index = row * gridSize + col;
    const emptyIndex = emptyPos.row * gridSize + emptyPos.col;
    [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];

    emptyPos.row = row;
    emptyPos.col = col;

    renderGrid();

    if (checkWin()) {
      statusDiv.innerText = 'Congratulations! Moving to next level!';
      setTimeout(nextLevel, 1500);
    }
  }
}

function checkWin() {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return tiles[tiles.length - 1] === null;
}

function nextLevel() {
  if (gridSize < 6) {
    gridSize++;
  } else {
    alert("Congratulations!!! You have completed all levels!");
    alert("Congratulations Again!!");
    gridSize = 3; // Reset to initial level
  }
  levelDiv.innerText = `Level: ${gridSize}x${gridSize}`;
  generatePuzzle(gridSize);
  statusDiv.innerText = '';
}

restartBtn.addEventListener('click', () => {
  gridSize = 3;
  init();
});

// Initialize the game
init();