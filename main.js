/*JOAN - Domingo 12/03: 
-El local Storage está hecho, y he añadido una frase de promedio y botón para borrar local Storage

-los console logs están "commented out", porque ya hemos comprobado que funcionan, por si pruebes y pienses que pasa algo raro

-he cambiado todos los innerText a innerHTML porque mostraba el simbol &#039 en lugar del apóstrofe en las preguntas y respuestas. Con innerHTML ya funciona.

-Puse los resultados & if/else de las frases dentro de la función "results" que se invoca al clickar botón results, y eliminé "scoreSplash" que sobraba. 

-He acortado un poco las frases divertidas (tenemos el resultado en letras más grandes, ¿y tal vez una imagen más tarde?) Tus frases originales están debajo del todo, commented out, si no te gusta el cambio.

-Eliminé la function de setNextQuestion que era del codigo de Sofi y aquí no lo usamos

*/

//** Traernos los elementos del DOM:

//Buttons
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const clearBtn = document.getElementById("clearBtn")

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
const sentenceDiv = document.getElementById("sentenceDiv");
const clearedMsg = document.getElementById("clearedMsg")

//Event Listeners
nextBtn.addEventListener("click", showQuestion);
restartBtn.addEventListener("click", restartQuiz);
quizBtn.addEventListener("click", showQuestion);
clearBtn.addEventListener("click", clearStorage); //Clears local storage


//MOSTRAR -OCULTAR "PÁGINAS ("Sections")
function reveal(page) {
  home.classList.add("hide");
  quiz.classList.add("hide");
  score.classList.add("hide");
  page.classList.remove("hide");
}

reveal(home);

let quizArray;

axios.get("https://opentdb.com/api.php?amount=10&type=multiple")
  .then(res => {
      quizArray = res.data.results;
      // console.log(quizArray);
       })
   .catch((err) => console.error(err));


//Variables that change:

let qIndex = 0;
let correctAnswer = "";
let counter = 0;

function showQuestion() {
  reveal(quiz);
  resetState();
  nextBtn.classList.remove("hide");
  nextBtn.setAttribute("disabled", "true");
  // console.log(quizArray[qIndex].question);
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

function selectAnswer() {
  if(this.classList.contains("correct")) {
   // console.log("Correct");
   let msg = document.createElement("div");
   msg.innerHTML = "CORRECT";
   answers.appendChild(msg);
     counter +=1 ;
  } else {
   // console.log("incorrect");
   let msg = document.createElement("div");
   msg.innerHTML = `INCORRECT. Correct answer: ${correctAnswer}`
   answers.appendChild(msg);
  }

  if (quizArray.length == qIndex)  {    
   nextBtn.classList.add("hide");
   const resultBtn = document.createElement("button");
   answers.appendChild(resultBtn); 
   resultBtn.innerHTML = "See your score";
   resultBtn.addEventListener("click", results);
 } 

  nextBtn.removeAttribute("disabled");
  
  document.querySelectorAll("#answers button").forEach((button => button.removeEventListener("click", selectAnswer))); //Prevents multiples clicks in answers
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
  saveScore()  //Save in local storage
  counterDiv.innerHTML = `${counter} Points`; //JOAN: HE PUESTO ESTE AQUÍ, así ahorramos líneas de código cuando no lo repetimos en cada "if". Cambié los ifs a "else if".
  if (counter <= 3) {
    sentenceDiv.innerHTML = `You better look for a job at McDonalds!`;  
  } else if (counter > 3 && counter < 5) {
    sentenceDiv.innerHTML = `You're on the path to success!`;
  } else if (counter > 5 && counter < 7) {
    sentenceDiv.innerHTML = `You're on your way to becoming the next Bezos`;
  } else if (counter > 7 && counter <= 9) {
    sentenceDiv.innerHTML = `Your insane points will bring you your dreamed yacht, supercar & private resort in Ibiza`;
  } else {
    sentenceDiv.innerHTML = `Will your points let you into Valhalla? Yes!`
  }
}

function saveScore() {
  const scoreArray = JSON.parse(localStorage.getItem("scores")) || [];
  scoreArray.push(counter);
  localStorage.setItem("scores", JSON.stringify(scoreArray));
  // console.log(scoreArray.length);
  average.innerHTML = `This was your game number ${scoreArray.length}. Your average is:  ${Number(scoreArray.reduce((acc, val) => (acc + val)) / scoreArray.length).toFixed(0)}/10`; //We count the average of the array using "reduce", convert it to number and eliminate decimals with "toFixed"
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


//ORIGINAL PHRASES (with grammar checked):
//  `With ${counter} points you better look for a job at McDonalds`;
//  `Your ${counter} points put you on the path to success!`;
//  `With ${counter} points you are aimed to become the next Bezos`;
//  `These insane ${counter} points will bring you your dreamed yatch, supercar & private resort in Ibiza`; 
//  `Will your ${counter} points let you into Valhalla? Yes!`
