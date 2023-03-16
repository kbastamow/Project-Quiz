//Dom Variables

//Sections
const home = document.getElementById("home");
const quiz = document.getElementById("quiz");
const score = document.getElementById("score");

//Buttons
const quizBtn = document.getElementById("quizBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const clearBtn = document.getElementById("clearBtn")
const reviewBtn =document.getElementById("reviewBtn")


//Divs
const question = document.getElementById("question");
const answers = document.getElementById("answers")
const counterDiv = document.getElementById("counterDiv");
const sentenceDiv = document.getElementById("sentenceDiv");
const image = document.getElementById("image");
const clearedMsg = document.getElementById("clearedMsg");
const questionsPopup = document.getElementById("questionsPopup");
const chartDiv = document.getElementById("chartDiv")


//Global Variables that change round by round
let quizArray;
let qIndex = 0;
let correctAnswer = "";
let counter = 0;
let scoreArray = [];

//Functions
async function startQuiz(e) {
  e.preventDefault();
  try {
    const res = await axios.get("https://opentdb.com/api.php?amount=10&type=multiple");
    quizArray = res.data.results;
    showQuestion(e) 
  } catch (error) {
      console.error(error) 
    }
}

function showQuestion(e) {
  e.preventDefault();
  reveal(quiz);
  resetState(answers);
  nextBtn.classList.remove("hide");
  nextBtn.setAttribute("disabled", "true");
  correctAnswer = quizArray[qIndex].correct_answer;
  const options = [...quizArray[qIndex].incorrect_answers, correctAnswer].sort();
  
  question.innerHTML = quizArray[qIndex].question;
  options.forEach((option) => {
    const button = document.createElement("button");
    button.setAttribute("class","col-12 col-md-7 btn btn-outline-warning border-2 text-dark shadow"); 
    button.innerHTML = option;
    if (option == correctAnswer) {
      button.classList.add("correct");
    }
    button.addEventListener("click", selectAnswer);
    answers.appendChild(button);
  });
  qIndex += 1;
}

function selectAnswer(e) {
  e.preventDefault();
  nextBtn.removeAttribute("disabled");
  document.querySelectorAll("#answers button").forEach((button => button.removeEventListener("click", selectAnswer))); 
  const selectedStyle = this.getAttribute("class").replace("btn-outline-warning", "btn-warning");
  this.setAttribute("class", selectedStyle);

  if(this.classList.contains("correct")) {
   let msg = document.createElement("div");
   msg.innerHTML = `<p class="alert alert-success border-0 fw-bold">CORRECT</p>` 
   answers.appendChild(msg);
     counter +=1 ;
  } else {
   let msg = document.createElement("div");
   msg.innerHTML = `<p class="alert alert-danger border-0 fw-bold"><span class="fw-bold">INCORRECT.</span> Correct answer: ${correctAnswer}</p>` //NEW
   answers.appendChild(msg);
  }

  if (quizArray.length == qIndex)  {    
   nextBtn.classList.add("hide");
   const resultBtn = document.createElement("button");
   resultBtn.setAttribute("class", "btn btn-dark shadow col-md-7 mb-1 px-5")
   resultBtn.innerHTML = "See your score";
   resultBtn.addEventListener("click", results);
   answers.appendChild(resultBtn); 
 } 
}

function results(e) {
  e.preventDefault();
  saveScore();  
  reveal(score);
  counterDiv.innerHTML = `${counter} Points`;
  if (counter <= 3) {
    image.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/McDonald%27s_logo.svg/220px-McDonald%27s_logo.svg.png")
    sentenceDiv.innerHTML = `You better look for a job at McDonalds!`;
  } else if (counter > 3 && counter <= 5) {
    image.setAttribute("src", "https://media.istockphoto.com/id/1186712099/photo/walking-into-the-abyss-while-using-smartphone.jpg?s=170667a&w=0&k=20&c=-I2on4piBRgMXFPLHRxZKv5TLUNKT3_lyxKsYaZR9kg=")
    sentenceDiv.innerHTML = `You're on the path to success!`;
  } else if (counter > 5 && counter <= 7) {
    image.setAttribute("src", "https://imageio.forbes.com/specials-images/imageserve/5bb22ae84bbe6f67d2e82e05/0x0.jpg?format=jpg&crop=1012,1013,x627,y129,safe&height=416&width=416&fit=bounds")
    sentenceDiv.innerHTML = `You're on your way to becoming the next Bezos`;
  } else if (counter > 7 && counter <= 9) {
    image.setAttribute("src", "https://jingdaily.com/wp-content/uploads/2013/10/Screen-Shot-2013-10-09-at-2.54.19-AM.jpg")
    sentenceDiv.innerHTML = `Your insane points will bring you your dreamed yacht, supercar & private resort in Ibiza`;
  } else {
    image.setAttribute("src", "https://t3.ftcdn.net/jpg/05/64/37/30/360_F_564373014_pREjFn0SL1hd1TwRAcFfiQqNvD2RmhnT.jpg")
    sentenceDiv.innerHTML = `Will your points let you into Valhalla? Yes!`
  }
}

function saveScore() {
  scoreArray.push(counter);
  localStorage.setItem("scores", JSON.stringify(scoreArray));
}

function clearStorage() {
  if (!clearBtn.classList.contains("clickedOnce")) {  //=If false (!)
    clearBtn.classList.add("clickedOnce");  
    clearBtn.innerHTML = "ARE YOU SURE?";
  } else {
    localStorage.clear();
    scoreArray = [];
    resetState(chartDiv);
    clearBtn.classList.remove("clickedOnce");
    clearBtn.innerHTML = "Clear game history"
    clearedMsg.innerHTML = `<p class="text-danger fw-bold">Evidence destroyed</p>`
    setTimeout(() => clearedMsg.innerHTML = "", 4000);
  }
}

function studyQs() {
  quizArray.forEach(item => {
    const question = document.createElement("div");
    questionsPopup.appendChild(question);
    question.innerHTML += `<p class="fw-bold mb-0">${item.question}</p>
                           <p>${item.correct_answer}</p>`
  })
}

function restartQuiz(e) {
  e.preventDefault();
  questionsPopup.innerHTML = "";
  qIndex = 0;
  counter = 0;
  image.setAttribute("src", "");
  showStats(); 
  reveal(home);
}

function showStats() {
  scoreArray = JSON.parse(localStorage.getItem("scores")) || [];
  if(scoreArray.length == 0) {
    average.innerHTML = "No game history";
  }else {
    average.innerHTML = `You've played ${scoreArray.length} time(s). Your average is:  ${Number(scoreArray.reduce((acc, val) => (acc + val)) / scoreArray.length).toFixed(0)}/10`;
    chartDiv.innerHTML = `<canvas id="chart"></canvas>`;
    createChart();
  }
  }

  function reveal(page) {
    home.classList.add("hide");
    quiz.classList.add("hide");
    score.classList.add("hide");
    page.classList.remove("hide");
  }

  function resetState(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function createChart () {
    let xValues = scoreArray.map((game,index) => "game no " + (index + 1));
    let yValues = scoreArray.map(game => game);
    const barColors = "black";
    new Chart("chart", {
      type: "bar",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues,
          barPercentage: 0.2
        }]
      },
      options: {
        legend: {display: false},
        title: {
          display: true,
          text: "Evolution of games"
        },
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              max: 10
            }
          }]
        }
      }
    });
    }
  

//Event Listeners
nextBtn.addEventListener("click", showQuestion);
restartBtn.addEventListener("click", restartQuiz);
quizBtn.addEventListener("click", startQuiz);   
clearBtn.addEventListener("click", clearStorage); 
reviewBtn.addEventListener("click", studyQs);


// Called on initiation
reveal(home);
showStats(); 

