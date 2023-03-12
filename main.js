// https://opentdb.com/api.php?amount=10&type=multiple

//** Traernos los elementos del DOM:

//Buttons
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");


//Sections
const home = document.getElementById("home");
const quiz = document.getElementById("quiz");
const score = document.getElementById("score");
//Elementos de la section "Quiz"

//Divs
const question = document.getElementById("question");
const answers = document.getElementById("answers")
const msg = document.getElementById("msg")
const counterDiv = document.getElementById("counterDiv");
const sentenceDiv = document.getElementById("imageDiv");
//Variables


//MOSTRAR -OCULTAR "PÁGINAS ("Sections")

function reveal (page) {
  home.classList.add("hide");
  quiz.classList.add("hide");
  score.classList.add("hide");
  page.classList.remove("hide");
}
reveal(home);

nextBtn.addEventListener("click", showQuestion);
restartBtn.addEventListener("click", restartQuiz);
quizBtn.addEventListener("click", showQuestion);

//Empezamos a pintar cosas...

let quizArray;

axios.get("https://opentdb.com/api.php?amount=10&type=multiple")
  .then(res => {
      quizArray = res.data.results;
      console.log(quizArray);
       })
   .catch((err) => console.error(err));

let qIndex = 0;
let correctAnswer = "";
let counter = 0;

function showQuestion() {
  reveal(quiz);
  resetState();
  nextBtn.classList.remove("hide");
  nextBtn.setAttribute("disabled", "true");
  console.log(quizArray[qIndex].question);
  question.innerText = quizArray[qIndex].question;
  correctAnswer = quizArray[qIndex].correct_answer;
  const options = [...quizArray[qIndex].incorrect_answers, correctAnswer].sort();
  console.log(options);
  options.forEach((option) => {
    const button = document.createElement("button");
    button.innerText = option;
    if (option == correctAnswer) {
      button.classList.add("correct");
    }
    

    button.addEventListener("click", selectAnswer);
    answers.appendChild(button);
  });
  qIndex += 1;
}

function setNextQuestion() {
  resetState();//limpia la pregunta que había
  showQuestion(quizArray[0]);//llamamos la función y le pasamos la pregunta actual
}

function selectAnswer() {
   if(this.classList.contains("correct")) {
    console.log("Correct");
    let msg = document.createElement("div");
    msg.innerText = "CORRECT";
    answers.appendChild(msg);
      counter +=1 ;

console.log(counter);
   } else {
    console.log("incorrect");
    let msg = document.createElement("div");
    msg.innerText = `INCORRECT. Correct answer: ${correctAnswer}`
    answers.appendChild(msg);
   }

   if (quizArray.length == qIndex)  {    
    nextBtn.classList.add("hide");
    const resultBtn = document.createElement("button");
    answers.appendChild(resultBtn); //CHECK
    resultBtn.innerText = "See your score";
    resultBtn.addEventListener("click", results);
  } 

   nextBtn.removeAttribute("disabled");
   
   document.querySelectorAll("#answers button").forEach((button => button.removeEventListener("click", selectAnswer))); //Prevents multiples clicks en las respuestas
 }


function resetState() {
  while (answers.firstChild) {
    answers.removeChild(answers.firstChild);
  }
}

function restartQuiz() {
  qIndex = 0;
  counter = 0;
  reveal(home);
}


function results() {
  reveal(score);
  //muestra resultados , local storage
}
//KAT: No consigo que lo pinte... échale un vistazo porfavor...con la peque entrando cada 2' no me centro mucho...

function scoreSplash() {
  if (counter <= 3) {
    counterDiv.innerText = `${counter} Points`;
    sentenceDiv.innerText = `With ${counter} points you  better look for a job on McDonalds`;
  }
  if (counter > 3 && counter < 5) {
    counterDiv.innerText = `${counter} Points`;
    sentenceDiv.innerText = `Your ${counter} points put you in the path to success!`;
  }
  if (counter > 5 && counter < 7) {
    counterDiv.innerText = `${counter} Points`;
    sentenceDiv.innerText = `With ${counter} points you are aimed to become the next Bezos`;
  }
  if (counter > 7 && counter <= 9) {
    counterDiv.innerText = `${counter} Points`;
    sentenceDiv.innerText = `These insane ${counter} points will bring you your dreamed yatch,supercar & private resort in Ibiza`;
  }
  if (counter == 10) {
    counterDiv.innerText = `${counter} Points`;
    sentenceDiv.innerText = `Are your ${counter} points ging to allow you to entry in the Valhalla? Yes!`
  }
}
scoreSplash()

//Lo he probado en otro proyecyo y pintaba sin problema...
