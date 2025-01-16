// spellingBee.js

const letters = ['B', 'L', 'Y', 'O', 'T', 'A', 'N']; // Lettere di esempio
const centralLetter = letters[0]; //'A'; // Lettera centrale obbligatoria
let outerLetters = letters.slice(1);
// const validWords = ['AB', 'AC', 'AD', 'AE', 'AF', 'AG']; // Parole valide di esempio
const foundWords = []; // Array per salvare le parole trovate
let points = 0; // Variabile per i punti

// Carica il dizionario quando la pagina viene caricata
window.onload = async function() {
    const response = await fetch('dictionary.json');
    validWords = await response.json();
    console.log('Dizionario caricato:', validWords.length);
};

letters.forEach((letter, index) => {
    const hexElement = document.getElementById(`hex${index}`);
    hexElement.innerText = letter;
    hexElement.addEventListener('click', () => {
        addLetterToInput(letter);
    });
});

function deleteLastLetter() {
    const input = document.getElementById('wordInput');
    input.value = input.value.slice(0, -1); // Rimuove l'ultima lettera
}

function shuffleLetters() {
    // const outerLetters = letters.slice(1); // Prendi le lettere esterne
    for (let i = outerLetters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [outerLetters[i], outerLetters[j]] = [outerLetters[j], outerLetters[i]]; // Scambia le lettere
    }
    outerLetters.forEach((letter, index) => {
        const hexElement = document.getElementById(`hex${index + 1}`);
        hexElement.innerText = letter;
        hexElement.replaceWith(hexElement.cloneNode(true)); // Rimuove tutti gli event listener
        const newHexElement = document.getElementById(`hex${index + 1}`);
        newHexElement.addEventListener('click', () => {
            addLetterToInput(letter);
        });
    });
}

function addLetterToInput(letter) {
    const input = document.getElementById('wordInput');
    input.value += letter;
}

document.getElementById('wordInput').addEventListener('input', (event) => {
    const input = event.target;
    const value = input.value.toUpperCase();
    const lastChar = value[value.length - 1];
    if (!letters.includes(lastChar)) {
        input.value = value.slice(0, -1); // Rimuove l'ultima lettera se non è tra le 7 scelte
    }
});

function checkWord() {
    const word = document.getElementById('wordInput').value.toUpperCase();

    if (!word.includes(centralLetter)) {
        document.getElementById('result').innerText = 'Manca la lettera centrale';
        document.getElementById('wordInput').value = '';
    }

    else if (word.length < 4) {
        document.getElementById('result').innerText = 'Parola troppo corta';
        document.getElementById('wordInput').value = '';
    }

    else if (foundWords.includes(word)) {
        document.getElementById('result').innerText = 'Parola già trovata';
        document.getElementById('wordInput').value = '';
    }

    else if (word.includes(centralLetter) && validWords.includes(word.toLowerCase()) && !foundWords.includes(word)) {
        const containsAllLetters = letters.every(letter => word.includes(letter));
        if (containsAllLetters) {
            document.getElementById('result').innerText = 'Spangram!';
            document.getElementById('wordInput').value = '';
        }
        else {
            document.getElementById('result').innerText = 'Parola valida!';
            document.getElementById('wordInput').value = '';
        }
        foundWords.push(word);
        updateWordsList();
        updatePoints(word);
    } 
    
    else {
        document.getElementById('result').innerText = 'Parola non valida';
        document.getElementById('wordInput').value = '';
    }

    const resultElement = document.getElementById('result');
    resultElement.style.opacity = 1;
    setTimeout(() => {
        resultElement.style.opacity = 0;
    }, 1000);
}

function updateWordsList() {
    const wordsList = document.getElementById('wordsList');
    wordsList.innerHTML = '';
    foundWords.forEach(word => {
        const listItem = document.createElement('li');
        listItem.innerText = word;
        wordsList.appendChild(listItem);
    });
}

function updatePoints(word) {
    let wordPoints = 0;
    if (word.length === 4) {
        wordPoints = 1;
    } else if (word.length > 4) {
        wordPoints = word.length;
    }
    // Verifica se la parola contiene tutte le 7 lettere
    const containsAllLetters = letters.every(letter => word.includes(letter));
    if (containsAllLetters) {
        wordPoints += 7; // Bonus per aver usato tutte le 7 lettere
    }
    points += wordPoints;
    document.getElementById('points').innerText = points;
}