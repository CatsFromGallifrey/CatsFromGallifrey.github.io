// get element from html
const gameBoard = document.querySelector('#gameboard');
const redPanel = document.querySelector('#redpanel');
const whitePanel = document.querySelector('#whitepanel');

// // define pieces
// const Villain = `<div class="piece villain"><svg class="red"></svg></div>`
// const Hero = `<div class="piece hero"><svg class="white"></svg></div>`

// define pieces
const Villain = `<div class="piece squared villain"></div>`
const Hero = `<div class="piece circled hero"></div>`

// RULES FOR COLORS
// pieces become their own color on squares with spin 0
// this way, on the same square, different pieces have different colors
// heros become white on squares with spin 0, and red on squares with spin 1
// villains become red on squares with spin 0, and white on squares with spin 1

// define set of spins (0 or 1)
let spinSet = []
for (let i = 0; i < 12; i++) {
    spinSet.push(0);
    spinSet.push(1);
}
// there are 25 squares, so we define the last one randomly
spinSet.push(Math.round(Math.random()));
// now shuffle the set of colors
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
spinSet = shuffle(spinSet);

// create board
function createBoard() {

    // create the red panel to the left (Villains)
    for (let i = 0; i < 7; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.setAttribute('square-id', i);
        square.setAttribute('square-spin', 0);
        // add a Villain piece except for the central square
        if (i != 3)
            square.innerHTML = Villain;

        redPanel.append(square);
    }

    for (let i = 0; i < 25; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.setAttribute('square-id', i);
        square.setAttribute('square-spin', spinSet[i]);

        gameBoard.append(square);
    }

    // create the white panel to the right (Heros)
    for (let i = 0; i < 7; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.setAttribute('square-id', i);
        square.setAttribute('square-spin', 0);
        // add a Hero piece except for the central square
        if (i != 3)
            square.innerHTML = Hero;

        whitePanel.append(square);
    }
};

createBoard();



// define events for click on pieces and squares

const allSquares = document.querySelectorAll('.square');

allSquares.forEach(square => {
    square.addEventListener('click', clickEvent);
});

let selected = false;
let selectedPiece;
let startPositionID;

function clickEvent(e) {
    e.stopPropagation();

    if (e.target.classList.contains('piece')) {

        const piece = e.target;
        startPositionID = piece.parentNode.getAttribute('square-id');

        // console.log(e);
        // console.log(e.target);
        // console.log(startPositionID);

        if (!selected) {
            piece.classList.add('selected');
            selectedPiece = piece;
            selected = true;
        }
        else {
            selectedPiece.classList.remove('selected');
            piece.classList.add('selected');
            selectedPiece = piece;
            selected = true;
        }

        return;
    }

    if (!selected)
        return;

    // get the previous and future position for the selected piece
    let currentSqaure = e.target;
    let previousSquare = selectedPiece.parentNode;

    // move the piece from one square to the other
    // the function appendChild already remove the child from the previous node
    currentSqaure.appendChild(selectedPiece);

    // get the current square spin to determine the piece color
    // based on the shape (hero vs villain)
    let spin = currentSqaure.getAttribute('square-spin');
    let type = selectedPiece.classList.contains('hero') ? 'hero' : 'villain';

    // the color is given to the ......
    if (spin == 0 && type == 'hero') {
        selectedPiece.classList.remove('villain');
        selectedPiece.classList.add('hero');
    }
    if (spin == 0 && type == 'villain') {
        selectedPiece.classList.remove('hero');
        selectedPiece.classList.add('villain');
    }
    if (spin == 1 && type == 'hero') {
        selectedPiece.classList.remove('hero');
        selectedPiece.classList.add('villain');
    }
    if (spin == 1 && type == 'villain') {
        selectedPiece.classList.remove('villain');
        selectedPiece.classList.add('hero');
    }


    // deselect the piece
    selectedPiece.classList.remove('selected');
    selectedPiece = undefined;
    selected = false;
}