const easyWords = [
    "apple", "banana", "cat", "dog", "elephant", "fish", "grape", "horse", "jacket", "kiwi", "lemon", "mouse", "orange", "pencil", "rabbit", "table", "umbrella", "vanilla", "watermelon", "xylophone"
];

const mediumWords = [
    "balloon", "candle", "dolphin", "elevator", "guitar", "hamburger", "kangaroo", "landscape", "mountain", "notebook", "octopus", "parachute", "question", "robotics", "sunflower", "telephone", "volcano", "wonderful", "xylograph", "yesterday"
];

const hardWords = [
    "boulevard", "catastrophe", "dissonance", "eccentricity", "facetious", "garrulous", "haphazardly", "inexorable", "juxtaposition", "kaleidoscope", "labyrinthine", "mellifluous", "obfuscate", "paradoxical", "quixotic", "recumbentibus", "sycophant", "ubiquitous", "vexatious", "zygomorphic"
];

const allWords = [...easyWords, ...mediumWords, ...hardWords];
let currentGameID = null;
let availableWords = [...allWords];
let userScore = 0;
let missedWords = 0;
function createRandomWord() {
    if (availableWords.length === 0) {
        availableWords = [...allWords];
    }

    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const randomWord = availableWords.splice(randomIndex, 1)[0];
    let offsetWidth = document.getElementById("randomWordsContainer").offsetWidth;
    const randomX = Math.random() * (offsetWidth - 100);
    const wordElement = document.createElement("div");

    wordElement.textContent = randomWord;
    wordElement.setAttribute("id", randomWord);
    wordElement.setAttribute("class", "word-bubble");
    wordElement.style.position = "absolute";
    wordElement.style.left = `${randomX}px`;
    wordElement.style.top = 0;

    document.getElementById("randomWordsContainer").appendChild(wordElement);
    return wordElement;
}
function restartGame() {
    $('#gameOverModal').hide();
    startGame();
}

function endGame() {
    $('#finalScore').html(userScore);
    $('#gameOverModal').show();
}

function updateWordPosition(wordElement, updateWordId) {
    const currentTop = parseInt(wordElement.style.top, 10);
    const newTop = currentTop + 3;
    let offsetHeight = document.getElementById(
        "randomWordsContainer"
    ).offsetHeight;

    if (newTop > offsetHeight) {
        if (document.body.contains(wordElement)) {

            missedWords++;
            $("#missedNumber").html(missedWords);
            wordElement.remove();
            clearTimeout(updateWordId)
            if (missedWords >= 5) {
                const existingWords = document.querySelectorAll(".word-bubble");
                existingWords.forEach((wordElement) => wordElement.remove());
                clearInterval(currentGameID)
                endGame();
            }
        }
    } else {
        wordElement.style.top = `${newTop}px`;
    }

}
function displayRandomWord() {
    const wordElement = createRandomWord();
    let updateWordId = setInterval(() => updateWordPosition(wordElement, updateWordId), 100);
}

function startGame() {
    if (currentGameID != null) {
        clearInterval(currentGameID);
    }
    const existingWords = document.querySelectorAll(".word-bubble");
    existingWords.forEach((wordElement) => wordElement.remove());
    userScore = 0;
    missedWords = 0;
    $("#scoreNumber").html(0);
    $("#missedNumber").html(0);
    $("#startButton").html("Restart");
    currentGameID = setInterval(displayRandomWord, 2000);
    document.addEventListener("keydown", handleKeyPress);
}

let wordFound = false;
let currentWord = "";
let currentWordLength = 0;
let remainingWord = "";
function handleKeyPress(event) {
    const pressedKey = String.fromCharCode(event.keyCode).toLowerCase();
    if (!wordFound) {
        const existingWordsInDOM = document.querySelectorAll(".word-bubble")
        const presentWords = Array.from(existingWordsInDOM).map(word => word.textContent);

        const matchingWords = presentWords.filter((word) =>
            word.startsWith(pressedKey)
        );
        if (matchingWords.length > 0) {
            wordFound = true;
            currentWord = matchingWords[0];
            currentWordLength = currentWord.length - 1;
            remainingWord = currentWord.slice(1);

            $(`#${currentWord}`).css("background-color", "yellow");
            $(`#${currentWord}`).html(remainingWord);
        }
    } else {
        if (remainingWord.length > 0) {
            if (pressedKey === remainingWord.charAt(0)) {
                remainingWord = remainingWord.slice(1);
                console.log($(`#${currentWord}`).css("background-color"))
                $(`#${currentWord}`).css("background-color", "yellow");
                $(`#${currentWord}`).html(remainingWord);
                if (remainingWord.length === 0) {
                    userScore++;
                    wordFound = false;
                    $("#scoreNumber").html(userScore);
                    $(`#${currentWord}`).remove();
                }
            }
        }
    }
}
