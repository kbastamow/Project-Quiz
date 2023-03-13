
//** Traernos los elementos del DOM:

//Buttons
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const clearBtn = document.getElementById("clearBtn")
const reviewBtn =document.getElementById("reviewBtn")

//Sections
const home = document.getElementById("home");
const quiz = document.getElementById("quiz");
const score = document.getElementById("score");

//Divs
const question = document.getElementById("question");
const answers = document.getElementById("answers")
const msg = document.getElementById("msg")
const counterDiv = document.getElementById("counterDiv");
const sentenceDiv = document.getElementById("sentenceDiv");
const clearedMsg = document.getElementById("clearedMsg");
const questionsPopup = document.getElementById("questionsPopup");
const image = document.getElementById("image");


//Global Variables - change round by round
let quizArray;
let qIndex = 0;
let correctAnswer = "";
let counter = 0;

function reveal(page) {
  home.classList.add("hide");
  quiz.classList.add("hide");
  score.classList.add("hide");
  page.classList.remove("hide");
}

async function startQuiz(e) {
  try {
    const res = await axios.get("https://opentdb.com/api.php?amount=10&type=multiple");
    quizArray = res.data.results;
    showQuestion() 
  } catch (error) {
      console.error(error) 
    }
}

function showQuestion() {
  reveal(quiz);
  resetState();
  nextBtn.classList.remove("hide");
  nextBtn.setAttribute("disabled", "true");
  question.innerHTML = quizArray[qIndex].question;
  correctAnswer = quizArray[qIndex].correct_answer;
  const options = [...quizArray[qIndex].incorrect_answers, correctAnswer].sort();
  // console.log(options);
  options.forEach((option) => {
    const button = document.createElement("button");
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
  document.querySelectorAll("#answers button").forEach((button => button.removeEventListener("click", selectAnswer))); //Prevents multiples clicks in answers
  if(this.classList.contains("correct")) {
   let msg = document.createElement("div");
   msg.innerHTML = "CORRECT";
   answers.appendChild(msg);
     counter +=1 ;
  } else {
   let msg = document.createElement("div");
   msg.innerHTML = `INCORRECT. Correct answer: ${correctAnswer}`
   answers.appendChild(msg);
  }

  if (quizArray.length == qIndex)  {    
   nextBtn.classList.add("hide");
   const resultBtn = document.createElement("button");
   resultBtn.innerHTML = "See your score";
   resultBtn.addEventListener("click", results);
   answers.appendChild(resultBtn); 
 } 
}

function resetState() {
  while (answers.firstChild) {
    answers.removeChild(answers.firstChild);
  }
}

function restartQuiz(e) {
  e.preventDefault();
  questionsPopup.innerHTML = "";
  qIndex = 0;
  counter = 0;
  reveal(home);
}

function results(e) {
  e.preventDefault();
  saveScore();  //Save in local storage
  reveal(score);
  counterDiv.innerHTML = `${counter} Points`;
  if (counter <= 3) {
    image.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/McDonald%27s_logo.svg/220px-McDonald%27s_logo.svg.png")
    sentenceDiv.innerHTML = `You better look for a job at McDonalds!`;
  } else if (counter > 3 && counter < 5) {
    image.setAttribute("src", "https://media.istockphoto.com/id/1186712099/photo/walking-into-the-abyss-while-using-smartphone.jpg?s=170667a&w=0&k=20&c=-I2on4piBRgMXFPLHRxZKv5TLUNKT3_lyxKsYaZR9kg=")
    sentenceDiv.innerHTML = `You're on the path to success!`;
  } else if (counter > 5 && counter < 7) {
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

function studyQs() {
  quizArray.forEach(item => {
    const question = document.createElement("div");
    questionsPopup.appendChild(question);
    question.innerHTML += `<p>${item.question}</p>
                          <p>${item.correct_answer}</p>`
  })
}

function saveScore() {
  const scoreArray = JSON.parse(localStorage.getItem("scores")) || [];
  scoreArray.push(counter);
  localStorage.setItem("scores", JSON.stringify(scoreArray));
  average.innerHTML = `This was your game number ${scoreArray.length}. Your average is:  ${Number(scoreArray.reduce((acc, val) => (acc + val)) / scoreArray.length).toFixed(0)}/10`; //Count the average of the array using "reduce", convert to number and eliminate decimals with "toFixed"
}

function clearStorage() {
  if (clearBtn.classList.contains("clickedOnce")){         
    localStorage.clear();
    clearBtn.classList.remove("clickedOnce");
    clearBtn.innerHTML = "Clear game history"
    clearedMsg.innerHTML = "Evidence destroyed"
    setTimeout(()=> clearedMsg.innerHTML = "", 4000);    
  } else {         //Adds a class to button to show it's been clicked once to get confirmation from user
    clearBtn.classList.add("clickedOnce");
    clearBtn.innerHTML = "ARE YOU SURE?"
  }
}

//Event Listeners
nextBtn.addEventListener("click", showQuestion);
restartBtn.addEventListener("click", restartQuiz);
quizBtn.addEventListener("click", startQuiz);   
clearBtn.addEventListener("click", clearStorage); 
reviewBtn.addEventListener("click", studyQs);



reveal(home);