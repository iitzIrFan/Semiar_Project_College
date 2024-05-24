const questions = [
  {
    que: "1) What is the main purpose of a firewall in computer networking?",
    a: "To block unauthorized access to a network",
    b: "To increase internet speed",
    c: "To improve computer graphics",
    d: "To enhance sound quality",
    correct: "a",
  },
  {
    que: "2) Which programming language is commonly used for building web applications?",
    a: " Python",
    b: "Java",
    c: "HTML ",
    d: " Swift",
    correct: "c",
  },
  {
    que: "3) What does the acronym URL stand for in the context of the internet?",
    a: "Universal Resource Locator",
    b: "Uniform Resource Locator",
    c: "Unified Resource Locator",
    d: "United Resource Locator",
    correct: "b",
  },
  {
    que: "4) What is the purpose of an SSD (Solid State Drive) in a computer?",
    a: "To store and retrieve data",
    b: "To cool down the CPU",
    c: "To increase screen resolution",
    d: "To provide power to the motherboard",
    correct: "a",
  },
  {
    que: "5) Which of the following is not a type of computer virus?",
    a: "Trojan Horse",
    b: "Worm",
    c: "Spyware",
    d: "Java",
    correct: "d",
  },
];

const quesBox = document.getElementById("quesBox");
const lastMessage = document.querySelector("#options");
const submit = document.querySelector(".btn");
const radioButtons = document.querySelectorAll('input[type="radio"][name="option"]');
const questionLabels = document.querySelectorAll(".option span");
const answershow = document.getElementById("answer-result");
const scoreShow = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const timeTakenDisplay = document.getElementById("time-taken");
const suggestionsDisplay = document.getElementById("suggestions");

let index = 0;
let score = 0;
let totalSeconds = 0;
let questionStartTime;
let timer;
let wrongAnswers = [];

function loadQuestions() {
  const data = questions[index];
  quesBox.innerText = data.que;
  questionLabels[0].innerText = data.a;
  questionLabels[1].innerText = data.b;
  questionLabels[2].innerText = data.c;
  questionLabels[3].innerText = data.d;
  resetTimer();
  questionStartTime = new Date().getTime();
}

function startTimer() {
  timerDisplay.innerText = `Time Left: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 30; // Reset timer to 30 seconds
  startTimer();
}

function calculateTimeTaken() {
  const now = new Date().getTime();
  const timeTaken = Math.floor((now - questionStartTime) / 1000);
  totalSeconds += timeTaken;
  return timeTaken;
}

loadQuestions();

submit.addEventListener("click", () => {
  let radioChecked = false;
  radioButtons.forEach((radioButton) => {
    if (radioButton.checked) {
      radioChecked = true;
    }
  });
  if (radioChecked) {
    nextQuestion();
  } else {
    setTimeout(() => {
      answershow.innerText = "";
    }, 2000);
    answershow.innerText = "Please Select an answer";
  }
});

function nextQuestion() {
  const timeTaken = calculateTimeTaken();
  const wasCorrect = radioIsChecked();
  if (!wasCorrect) {
    wrongAnswers.push({
      question: questions[index].que,
      correctAnswer: questions[index][questions[index].correct],
    });
  }
  index++;
  if (index < questions.length) {
    loadQuestions();
  } else {
    showFinalResult(timeTaken);
  }
  uncheckRadioButtons();
}

function radioIsChecked() {
  let isCorrect = false;
  radioButtons.forEach((radioButton) => {
    if (radioButton.checked) {
      if (radioButton.value === questions[index].correct) {
        score++;
        isCorrect = true;
        answershow.innerText = "Correct!!";
        console.log("Selected answer is Correct");
        answershow.style.color = "green";
      } else {
        answershow.innerText = "Wrong..";
        console.log("Selected answer is Wrong");
        answershow.style.color = "red";
      }
      scoreShow.innerText = `Your score is ${score}/${questions.length}`;
      setTimeout(() => {
        answershow.innerText = "";
      }, 2000);
    }
  });
  return isCorrect;
}

function uncheckRadioButtons() {
  radioButtons.forEach((radio) => {
    radio.checked = false;
  });
}

function showFinalResult(timeTaken) {
  clearInterval(timer);
  timerDisplay.style.display = 'none'; // Hide the timer

  const averageTime = totalSeconds / questions.length;
  let suggestion;

  if (score > questions.length / 2 && averageTime <= 15) {
    suggestion = "Good work! wow you were fast.";
  } else if (score > questions.length / 2 && averageTime > 15) {
    suggestion = "Good work! but Slow.";
  } else if (score <= questions.length / 2 && averageTime <= 15) {
    suggestion = "Take your time, score can be improved.";
  } else {
    suggestion = "Need to work a lot.";
  }

  quesBox.innerText = "Quiz Completed! Summary";
  lastMessage.innerHTML = "";

  let wrongAnswersHtml = "<h3>Review your wrong answers:</h3><ul>";
  wrongAnswers.forEach((item) => {
    wrongAnswersHtml += `<li>Question: ${item.question}<br>Correct Answer: ${item.correctAnswer}</li>`;
  });
  wrongAnswersHtml += "</ul>";

  lastMessage.innerHTML = wrongAnswersHtml;
  timeTakenDisplay.innerText = `Total Time Taken: ${totalSeconds}s`;
  suggestionsDisplay.innerText = suggestion;
  submit.innerText = "Play Again";
  submit.addEventListener("click", () => {
    location.reload();
  });
}
