$( document ).ready(function() {
    // getting localstorage highscore if its exists, if it doesn't make blank array
    let highscores = JSON.parse(localStorage.getItem("highscores"||[]));
    if (highscores === null) {
        highscores = [
            {
                'name':'',
                'score': ''            
            },
            {
                'name':'',
                'score': ''            
            },
            {
                'name':'',
                'score': ''            
            },
            {
                'name':'',
                'score': ''            
            },
            {
                'name':'',
                'score': ''            
            },
        ];
    }
    let questionNumber = 0;
    let timer = 50;
    let startTimer = null;
    let optionSelected = false;
    let isHighscore = false;

// event listener to for highscore button where it will clear the main display and then 
// display the highscores in the highscore array
    $('.highscore').on('click',function() {
        showHighscores();
    })

    let showHighscores = function() {
        clearInterval(startTimer);
        $('#display').empty();
        $('#display').append("<div class=\"highscore-display\"> <h2>Highscores</h2> </div>");

        for (let i = 0; i < 5; i++) {
            let j = i+1
            let showHighscores = 
            `<table class="center" style="width:100%">
            <tr>
                <th>#${j}</th>
                <th id="first">${highscores[i].name}</th> 
                <th id="first">${highscores[i].score}</th> 
            </table>`
            $('.highscore-display').append(showHighscores)
        }

        $('.highscore-display').append(homeButton)
        $('.container').attr('style','background:gray')
        $('.home').on('click', function() {
            window.location.reload();
        });
    }
    
    let reset = function() {
        $('#display').empty();
        $('#display').attr("style","text-align:center")
        $('#display').append(startUp)
    }

    
    let startUp = 
        `
        <h1>
            Welcome to the Office quiz?
        </h1> 
        <div>
            <button id="startquiz" class="rounded" style="background:white;width:200px;height:50px;">
            START QUIZ
            </button>
            </div>
            `
            
    reset();
            
    
    $('#startquiz').on('click', function() {
        randomizeQuestions();
        displayQuestion();
        startTimer = setInterval(function() {
        timer--;
        $('#timer').text(`Timer: ${timer}`)
        if (timer < 1) {
            $('#timer').attr('style','color:red;')
            timeOut();
            clearInterval(startTimer);
        }}, 1000); 
        
        })
        
        let randomizeQuestions = function() {
            //set timer and questionNumber
            questionNumber = 0;
            timer = 50;
            //randomize the questions
            for (let i = 0; i < theOfficeQuiz.length; i++) {
                let random = Math.random();
                theOfficeQuiz[i].order = random;
            }
            // sorting the questions based on random number
            theOfficeQuiz = theOfficeQuiz.sort(function(a, b) {
                return a.order - b.order
            });
        }
        //function for starting the game
        //it should display the question and options. 
        
        // loop that will go go through that object that all the questions. 
        // it should display one question at a time. then once an option is submitted, 
        
        let displayQuestion = function() {
            $('#display').empty();
            optionSelected = false;
            let singleQuestion = 
            `
            <div id="singleQuestion">
            <h3>${theOfficeQuiz[questionNumber].questions}</h3>
            <form id="options">
            <input type="radio" name="option" id="${theOfficeQuiz[questionNumber].options[0]}" class="option"/> ${theOfficeQuiz[questionNumber].options[0]}<br>
            <input type="radio" name="option" id="${theOfficeQuiz[questionNumber].options[1]}" class="option"/> ${theOfficeQuiz[questionNumber].options[1]}<br>
            <input type="radio" name="option" id="${theOfficeQuiz[questionNumber].options[2]}" class="option"/> ${theOfficeQuiz[questionNumber].options[2]}<br>
            <input type="radio" name="option" id="${theOfficeQuiz[questionNumber].options[3]}" class="option"/> ${theOfficeQuiz[questionNumber].options[3]}<br>
            </form>
            <button class="rounded" id="submitBtn" data-answer="${theOfficeQuiz[questionNumber].answer}">SUBMIT</button>
            <div>
            `
            $('#display').append(singleQuestion)
            $('.option').on('click', function() {
                optionSelected = true;
            });
            $('#submitBtn').on('click', function() {
                // if option selected's data-option is the same of the data-answer of the button that was clicked, then show "correct!" 
                // also add that 10 to timer 
                if (optionSelected === false) {
                    alert('Please select an answer')
                return
            }
            $('#submitBtn').remove();
            if (document.getElementById(theOfficeQuiz[questionNumber].answer).checked === true) {
                // if correct, give more time and show that answer was correct. 
                timer += 10;
                $('#singleQuestion').append(nextQuestion)
                $('#singleQuestion').append(correct)
            } else {
                //penalty for wrong answer and show answer
                timer -= 5;
                $('#singleQuestion').append(nextQuestion)
                $('#singleQuestion').append(incorrect)
                $('#singleQuestion').append(`Answer: ${theOfficeQuiz[questionNumber].answer}`)
            }
            let x = document.getElementById(theOfficeQuiz[questionNumber].answer).checked

        $('#next-question').on('click', function() {
            questionNumber++;
            if (questionNumber < 10) {
                displayQuestion();
                // gifs pf michael scott as distractions. 
                let characterArray = ["michael scott", "dwight schrute", "jim halpert", "kevin malone",
                 "kelly kapoor", "pam halpert", "angela martin", "andrew bernard", "stanley hudson"];
                let officeCharacter = characterArray[Math.floor(Math.random() * 9)];
                fetch(`https://api.giphy.com/v1/gifs/search?q=${officeCharacter}&api_key=CYTnnrinoJOLTaSgZGzrsVBsuLwFpXMB&limit=25"`)
                .then((response) => {
                    return response.json()
                }).then((json) => {
                    let randomNum = Math.floor(Math.random() * 25);
                    let gifURL = json.data[randomNum].images.original.url
                    $('body').attr('style', `background-image:url('${gifURL}'); background-repeat:repeat;`)
                })
            } else {
                endGame();
            }
        })
        });
    }


    let endGame = function() {
        $('#display').empty();
        clearInterval(startTimer)
        $('#display').append(`
        <h1>QUIZ COMPLETE</h1>
        Your score is ${timer}!`)
        // check if score is higher than any of the entries in the array 
        // if it is higher than top 5 ask for Initials 
        for (let i = 0; i < 4; i++) {
            if (isHighscore === false) {
                if (timer > highscores[i].score) {
                    isHighscore = true;
                }
            }
        }
        // if score was a high score show high school button to admire prowess, if not show home button
        if (isHighscore) {
            let newHighscoreName = prompt('Congratulations! You got a highscore! Add your name to go the highscores.');
            let newHighscoreInfo = 
                {
                    'name': newHighscoreName,
                    'score': timer
                }
            highscores.push(newHighscoreInfo);
            // sort the highscores again. 
            highscores = highscores.sort(function(a, b) {
                return b.score - a.score
            });
            localStorage.setItem('highscores', JSON.stringify(highscores))
            $('#display').append(highscoreBtn)
            $('.highscore').on('click', () => showHighscores())
        } else {
            $('#display').append(homeButton)
            $('.home').on('click', () => {
                window.location.reload();
            });
        }
    }

    let timeOut = function() {
        $('#display').empty();
        $('#display').append(`
        <h1> TIME'S UP!<h1>
        <h1> GAME OVER</h1>
        <button class="home rounded">GO BACK HOME</button>
        `)
        $('.home').on('click', function() {
            // $('#display').empty();
            // $('#display').attr("style","text-align:center")
            // $('#display').append(startUp)
            window.location.reload();
        });
    }
})

let highscoreBtn = 
    `
    <br>
    <br>
    <button class="highscore rounded">GO TO HIGHSCORES</button>
    `;

let stopTimer = function() {
    clearInterval(startTimer)
}

let homeButton = 
`<br>
<div>
    <button class="home rounded">
        Back to Home
    </button>
</div>
`

let correct = 
    `
    <p id="correct">CORRECT!</p>
    `

let incorrect =
    `
    <p id="incorrect">WRONG!</p>
    `
let nextQuestion = 
    `
    <button class="rounded" id="next-question">NEXT>></button>
    `

let theOfficeQuiz = [ 
    {
    questions: "What is Michael Scott’s middle name?",
    options: ["Kurt", "Gary", "Russel", "Hudson"],
    answer: "Gary",
    order: ""
    },
    {
    questions: "For at least one of his birthdays, who gifts Michael a hockey jersey?",
    options: ["Michael’s mom", "The whole office", "Dwight", "Jan"],
    answer: "Dwight",
    order: ""
    },
    {
    questions: "How many brothers does Jim have",
    options: ["1", "2", "3", "3.5"],
    answer: "2",
    order: ""
    },
    {
    questions: "What kind of car did Michael and Jan exchange both of their cars for?",
    options: ["Ferarri", "BMW", "Porche", "Mustang"],
    answer: "Porche",
    order: ""
    },
    {
    questions: "What was Roy\'s, Pam\'s ex-fiance, last name?",
    options: ["Sanderson", "Anderson", "Osmond", "Andrews"],
    answer: "Anderson",
    order: ""
    },
    {
    questions: "What kind of shoes did Pam win the Whitest-Shoes Dundie with?",
    options: ["K-Swiss", "Adidas", "Converse", "Keds"],
    answer: "Keds",
    order: ""
    },
    {
    questions: "What was the name of the cat that Angel told Oscar to save?",
    options: ["Sprinkles", "Garbage", "Bandit", "Comstock"],
    answer: "Bandit",
    order: ""
    },
    {
    questions: "What brand of car do we NOT see Jim driving?",
    options: ["Saab", "Toyota", "Subaru", "Volkswagen"],
    answer: "Volkswagen",
    order: ""
    },
    {
    questions: "What song was Dwight playing the recorder after he broke up with Angela?",
    options: ["Greensleeves", "You Give Love a Bad Name", "Every Breath you Take", "Never Gonna You Up"],
    answer: "You Give Love a Bad Name",
    order: ""
    },
    {
    questions: "On the episode ‘Diversity Day,’ which \"Character\" and \"Ethnicity card\" do NOT match?",
    options: ["Michael: Martin Luther King Jr.", "Angela: Jamaican", "Stanley: Black", "Pam: Asian"],
    answer: "Pam: Asian",
    order: ""
    }
    ]
    
    