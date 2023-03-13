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
const reviewBtn =document.getElementById("reviewBtn")

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
const clearedMsg = document.getElementById("clearedMsg");
const questionsPopup = document.getElementById("questionsPopup");


const image = document.getElementById("image");

//MOSTRAR -OCULTAR "PÁGINAS ("Sections")
function reveal(page) {
  home.classList.add("hide");
  quiz.classList.add("hide");
  score.classList.add("hide");
  page.classList.remove("hide");
}

reveal(home);

let quizArray;
let qIndex = 0;
let correctAnswer = "";
let counter = 0;


async function startQuiz(e) {
  e.preventDefault();
  try {
    const res = await axios.get("https://opentdb.com/api.php?amount=10&type=multiple");
    quizArray = res.data.results;
    showQuestion() 
  } catch (error) {
      console.error(error) 
    }
}

//Variables that change:

function showQuestion() {
  console.log(quizArray);    
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
  questionsPopup.innerHTML = "";
}


function results() {
  reveal(score);
  saveScore()  //Save in local storage
  counterDiv.innerHTML = `${counter} Points`; //JOAN: HE PUESTO ESTE AQUÍ, así ahorramos líneas de código cuando no lo repetimos en cada "if". Cambié los ifs a "else if".
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

//Event Listeners
nextBtn.addEventListener("click", showQuestion);
restartBtn.addEventListener("click", restartQuiz);
quizBtn.addEventListener("click", startQuiz);   //CHANGED THIS 
clearBtn.addEventListener("click", clearStorage); //Clears local storage
reviewBtn.addEventListener("click", studyQs);




//ORIGINAL PHRASES (with grammar checked):
//  `With ${counter} points you better look for a job at McDonalds`;
//  `Your ${counter} points put you on the path to success!`;
//  `With ${counter} points you are aimed to become the next Bezos`;
//  `These insane ${counter} points will bring you your dreamed yatch, supercar & private resort in Ibiza`; 
//  `Will your ${counter} points let you into Valhalla? Yes!`
