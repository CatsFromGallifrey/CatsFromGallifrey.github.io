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
    // declare shuffle function 
    const shuffle = (array) => { 
        for (let i = array.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]]; 
        } 
        return array; 
    };

    outerLetters = shuffle(outerLetters);
    outerLetters.forEach((letter, index) => {
        document.getElementById(`hex${index + 1}`).innerText = letter; // Aggiorna gli esagoni
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

    if (word.length < 4) {
        document.getElementById('result').innerText = 'Parola troppo corta';
    }

    else if (foundWords.includes(word)) {
        document.getElementById('result').innerText = 'Parola già trovata';
    }

    else if (word.includes(centralLetter) && validWords.includes(word.toLowerCase()) && !foundWords.includes(word)) {
        const containsAllLetters = letters.every(letter => word.includes(letter));
        if (containsAllLetters) {
            document.getElementById('result').innerText = 'Spangram!';
        }
        else {
            document.getElementById('result').innerText = 'Parola valida!';
        }
        foundWords.push(word);
        updateWordsList();
        updatePoints(word);
    } 
    
    else {
        document.getElementById('result').innerText = 'Parola non valida';
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