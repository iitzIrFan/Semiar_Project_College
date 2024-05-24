const questions = [
    {
        que: "1) Which planet is known as the Red Planet",
        a: "Venus",
        b: "Mars",
        c: "Jupyter",
        d: "Saturn",
        correct: "b",
    },
    {
        que: "2) Who painted the Mona Lisa?",
        a: "Vincent van Gogh",
        b: "Leonardo da Vinci",
        c: "Pablo Picasso",
        d: "Michelangelo",
        correct: "b",
    },
    {
        que: "3) Which ocean is the largest?",
        a: "Atlantic Ocean",
        b: "Indian Ocean",
        c: "Arctic Ocean",
        d: "Pacific Ocean",
        correct: "d",
    },
    {
        que: "4) What is the capital of France?",
        a: "Berlin",
        b: "Madrid",
        c: "Paris",
        d: "Rome",
        correct: "c",
    },
    {
        que: "5)  Who wrote To Kill a Mockingbird",
        a: "Harper Lee",
        b: "Mark Twain",
        c: "Ernest Hemingway",
        d: "J.K.Rowling",
        correct: "a",
    }           
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
  