const grid = document.querySelector('.grid')
const flagsLeft = document.querySelector('#flags-left')
const totalFlags = document.querySelector('#total-flags')
const result = document.querySelector('#result')
let width = 10
let bombAmount = 2 // TODO niveles
let flags = 0
let squares = []
let isGameOver = false
let shield = false // saves you in case you explode a bomb, deactivates before a use

// game
createBoard()
document.addEventListener("keydown", hacks)

// hacks
function hacks(e) {
  if (e.key == 'b') {
    // view all the bombs for a few time
    showBombs()
    setTimeout(hideBombs, 300)
  } else if (e.key == 's') {
    // activate shield
    shield = true
  }
}

//create Board
function createBoard() {
  flagsLeft.innerHTML = bombAmount
  totalFlags.innerHTML = bombAmount

  //get shuffled game array with random bombs
  const bombsArray = Array(bombAmount).fill('bomb')
  const emptyArray = Array(width*width - bombAmount).fill('valid')
  const gameArray = emptyArray.concat(bombsArray)
  const shuffledArray = gameArray.sort(() => Math.random() -0.5)

  for(let i = 0; i < width*width; i++) {
    const square = document.createElement('div')
    square.setAttribute('id', i)
    square.classList.add(shuffledArray[i])
    grid.appendChild(square)
    squares.push(square)

    //normal click
    square.addEventListener('click', function(e) {
      click(square)
    })

    //cntrl and left click
    square.oncontextmenu = function(e) {
      e.preventDefault()
      addFlag(square)
    }
  }

  //add numbers
  for (let i = 0; i < squares.length; i++) {
    let total = 0
    const isLeftEdge = (i % width === 0)
    const isRightEdge = (i % width === width -1)

    if (squares[i].classList.contains('valid')) {
      if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total ++
      if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total ++
      if (i > 10 && squares[i -width].classList.contains('bomb')) total ++
      if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total ++
      if (i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) total ++
      if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total ++
      if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total ++
      if (i < 89 && squares[i +width].classList.contains('bomb')) total ++
      squares[i].setAttribute('data', total)
    }
  }
}

//add Flag with right click
function addFlag(square) {
  if (isGameOver) return
  if (!square.classList.contains('checked') && (flags < bombAmount)) {
    if (!square.classList.contains('flag')) {
      square.classList.add('flag')
      square.innerHTML = ' 🚩'
      flags ++
      flagsLeft.innerHTML = bombAmount- flags
      checkForWin()
    } else {
      square.classList.remove('flag')
      square.innerHTML = ''
      flags --
      flagsLeft.innerHTML = bombAmount- flags
    }
  }
}

//click on square actions
function click(square) {
  if (isGameOver) return
  if (square.classList.contains('checked') || square.classList.contains('flag')) return
  if (square.classList.contains('bomb')) {
    if (shield)
    {
      alert("🥷🏻 beware, there's a bomb")
      shield = false
      return
    }
    else
      gameOver(square)
  } else {
    let total = square.getAttribute('data')
    if (total !=0) {
      square.classList.add('checked')
      if (total == 1) square.classList.add('one')
      if (total == 2) square.classList.add('two')
      if (total == 3) square.classList.add('three')
      if (total == 4) square.classList.add('four')
      square.innerHTML = total
      return
    }
    checkSquare(square)
  }
  square.classList.add('checked')
}

//check neighboring squares once square is clicked
function checkSquare(square) {
  const id = parseInt(square.id)
  const isLeftEdge = (id % width === 0)
  const isRightEdge = (id % width === width -1)

  setTimeout(() => {
    if (id > 0 && !isLeftEdge)
      clickNewSquare(id -1)
    if (id > 9 && !isRightEdge)
      clickNewSquare(id +1 -width)
    if (id > 10)
      clickNewSquare(id -width)
    if (id > 11 && !isLeftEdge)
      clickNewSquare(id -1 -width)
    if (id < 98 && !isRightEdge)
      clickNewSquare(id +1)
    if (id < 90 && !isLeftEdge)
      clickNewSquare(id -1 +width)
    if (id < 88 && !isRightEdge)
      clickNewSquare(id +1 +width)
    if (id < 90)
      clickNewSquare(id +width)
  }, 10)
}

function clickNewSquare(newId) {
  const newSquare = document.getElementById(squares[newId].id)
  click(newSquare)
}

//game over
function gameOver() {
  result.innerHTML = 'BOOM! Game Over!'
  isGameOver = true
  showBombs()
}

function showBombs() {
  squares.forEach(square => {
    if (square.classList.contains('bomb')) {
      square.innerHTML = '💣'
      square.classList.remove('bomb')
      square.classList.add('checked')
    }
  })
}

function hideBombs() {
  squares.forEach(square => {
    if (square.innerHTML == '💣') {
      square.innerHTML = ''
      square.classList.add('bomb')
      square.classList.remove('checked')
    }
  })
}

//check for win
function checkForWin() {
  ///simplified win argument
  let matches = 0

  for (let i = 0; i < squares.length; i++) {
    if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
      matches ++
      if (matches === bombAmount) {
        result.innerHTML = 'YOU WIN!'
        isGameOver = true
        return
      }
    }
  }
}
