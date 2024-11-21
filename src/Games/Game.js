// Dynamically generate the HTML structure
document.body.innerHTML = `
    <div id="timer" class="timer">Time: 0s</div>

    <header class="header">
        <h1>FINANCE BINGO</h1>
    </header>

    <!-- Question display area -->
    <div id="question-container">
        <p id="question-number"></p>
        <p id="question-text"></p>
        <div id="answer-buttons"></div>
    </div>

    <div class="container">
        <table id="tblBingo"></table>
    </div>

    <div class="letter-div">
        <table id="tblLetter">
            <tr>
                <td class="letters-bingo">B</td>
                <td class="letters-bingo">I</td>
                <td class="letters-bingo">N</td>
                <td class="letters-bingo">G</td>
                <td class="letters-bingo">O</td>
            </tr>
        </table>
    </div>

    <!-- Buttons Section -->
    <div class="action-buttons">
        <button id="back-button" class="action-button">Back</button>
        <button id="restart-button" class="action-button">Restart</button>
    </div>
`;

// Dynamically add the CSS file to the document
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "src/Games/Game.css"; 
document.head.appendChild(link);

// Bingo game logic starts here
const table = document.querySelector("#tblBingo");
const letter = document.querySelectorAll(".letters-bingo");
const questionContainer = document.querySelector("#question-container");
const questionNumber = document.querySelector("#question-number");
const questionText = document.querySelector("#question-text");
const answerButtons = document.querySelector("#answer-buttons");
const restartButton = document.getElementById("restart-button");
const backButton = document.getElementById("back-button");
const timerElement = document.getElementById("timer");

const arr = Array.from({ length: 25 }, (_, i) => i + 1);
const winningPositions = [
    [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24]
];
const questions = [
    { question: "Did you save 10 rupees today?", type: "yesno" },
    { question: "Do you know the meaning of TDS?", type: "yesno" },
    { question: "Have you set a monthly budget?", type: "yesno" },
    { question: "What is the meaning of TDS?", type: "mcq", options: ["Tax Deducted at Source", "Total Debt Security", "Term Deposit Scheme", "Transaction Data Security"] }
];

let iterator = 0;
let questionIndex = 0;
let winningIterator = 0;
let completedCombinations = new Set();
let timer = 0;

// Create Bingo table
for (let i = 0; i < 5; i++) {
    let tr = document.createElement("tr");
    table.appendChild(tr);
    for (let j = 0; j < 5; j++) {
        let td = document.createElement("td");
        td.id = arr[iterator].toString();
        td.classList.add("main-table-cell");
        let div = document.createElement("div");
        div.classList.add("cell-format");
        div.textContent = arr[iterator].toString();
        td.appendChild(div);
        tr.appendChild(td);
        iterator++;
    }
}

const cell = document.querySelectorAll(".main-table-cell");

function displayNextQuestion() {
    if (questionIndex < questions.length) {
        const questionData = questions[questionIndex];
        questionNumber.textContent = `${questionIndex + 1}`;
        questionText.textContent = questionData.question;
        answerButtons.innerHTML = "";

        if (questionData.type === "yesno") {
            createButton("Yes", () => handleAnswer(true));
            createButton("No", () => handleAnswer(false));
        } else if (questionData.type === "mcq") {
            questionData.options.forEach(option => {
                createButton(option, () => handleAnswer(option === questionData.options[0]));
            });
        }
    } else {
        alert("You've completed all questions! Refresh to play again.");
    }
}

function createButton(text, callback) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add("answer-button");
    button.onclick = callback;
    answerButtons.appendChild(button);
}

function matchWin() {
    for (const combination of winningPositions) {
        if (completedCombinations.has(combination.toString())) continue;
        const isWinningCombination = combination.every(index => cell[index].classList.contains("strickout"));
        if (isWinningCombination) {
            completedCombinations.add(combination.toString());
            return true;
        }
    }
    return false;
}

function handleAnswer(isCorrect) {
    if (isCorrect) {
        const cellElement = cell[questionIndex];
        cellElement.classList.add("strickout");

        if (matchWin()) {
            if (winningIterator < letter.length) {
                letter[winningIterator].classList.add("show-bingo");
                winningIterator++;
            }
            if (winningIterator === 5) {
                alert("B I N G O");
                location.reload();
            }
        }
    }
    questionIndex++;
    displayNextQuestion();
}

setInterval(() => {
    timer++;
    timerElement.textContent = `Time: ${timer}s`;
}, 1000);

restartButton.addEventListener("click", () => location.reload());
backButton.addEventListener("click", () => {
    window.location.href = "landing_page.html"; // Replace with actual URL
});

displayNextQuestion();
