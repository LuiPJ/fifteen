const containerNode = document.getElementById('fifteen');
const itemNodes = Array.from(containerNode.querySelectorAll('.item'));
countitems = 16;

if (itemNodes.length !== 16) {
  throw new Error(`Должно быть ровно ${countitems}  items in HTML`);
}

itemNodes[countitems - 1].style.display = 'none';

let matrix = getMatrix(itemNodes.map((item) => Number(item.dataset.matrixId)));
setPositionItems(matrix);

document.getElementById('shuffle').addEventListener('click', () => {
  const shuffledArray = shuffleArray(matrix.flat());
  matrix = getMatrix(shuffledArray);
  setPositionItems(matrix);
});

const blankNumber = 16;
containerNode.addEventListener('click', (event) => {
  const buttonNode = event.target.closest('button');
  if (!buttonNode) {
    return;
  }
  const buttonNumber = Number(buttonNode.dataset.matrixId);
  const buttonCoords = findCoordinatesByNumber(buttonNumber, matrix);
  const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
  const isValid = isValidForSwap(buttonCoords, blankCoords);
  console.log(isValid);

  if(isValid) {
    swap(blankCoords, buttonCoords, matrix);
    setPositionItems(matrix);
  }


});


function getMatrix(arr) {
  const matrix = [[], [], [], []];
  let y = 0;
  let x = 0;

  for (let i = 0; i < arr.length; i++) {
    if (x >= 4) {
      y++;
      x = 0;
    }
    matrix[y][x] = arr[i];
    x++;
  }
  return matrix;
}

function setPositionItems(matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const value = matrix[y][x];
      const node = itemNodes[value - 1];
      setNodeStyles(node, x, y);
    }
  }
}

function setNodeStyles(node, x, y) {
  const shiftPs = 100;
  node.style.transform = `translate3D(${x * shiftPs}%, ${y * shiftPs}%,0)`;
}

function shuffleArray(arr) {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function findCoordinatesByNumber(number, matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === number) {
        return { x, y };
      }
    }
  }
  return null;
}

function isValidForSwap(coord1, coord2) {
  const diffX = Math.abs(coord1.x - coord2.x);
  const diffY = Math.abs(coord1.y - coord2.y);

  return (
    (diffX === 1 || diffY === 1) &&
    (coord1.x === coord2.x || coord1.y === coord2.y)
  );
}

function swap(coord1, coord2, matrix) {
  const coords1Number = matrix[coord1.y][coord1.x];
  matrix[coord1.y][coord1.x] = matrix[coord2.y][coord2.x];
  matrix[coord2.y][coord2.x] = coords1Number;
}
