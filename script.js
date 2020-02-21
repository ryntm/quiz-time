$( document ).ready(function() {
    var highscore = JSON.parse(localStorage.getItem(highscore));
    if (highscore === null) {
        highscore = ['', '', 'test', '', ''];
    }
    var questionNumber = 0;
    var timer = 50;
    var startTimer = null;
    var optionSelected = false;


    $('.highscore').on('click',function() {
        $('#display').empty();
        $('#display').append("<div class=\"highscore-display\"> <h2>Highscores</h2> </div>");

        for (var i = 0; i < highscore.length; i++) {
            var j = i+1
            var showHighscores = 
            `<table class="center" style="width:50%">
            <tr>
                <th>#${j}</th>
                <th id="first">${highscore[i]}</th> 
            </table>`
            $('.highscore-display').append(showHighscores)
        }

        $('.highscore-display').append(homeButton)
        $('.container').attr('style','background:gray')
        $('.home').on('click', function() {
            $('#display').empty();
            $('#display').attr("style","text-align:center")
            $('#display').append(startUp)
        });
    })
    
    
    var reset = function() {
        $('#display').empty();
        $('#display').attr("style","text-align:center")
        $('#display').append(startUp)
    }

    
    var startUp = 
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
            $('#timer').text(`Timer: ${timer}`)
            timer--;}
            , 1000); 
        if (timer < 1) {
            timeOut()
            clearInterval(startTimer)
        }
        })
        
        var randomizeQuestions = function() {
            //set timer and questionNumber
            questionNumber = 0;
            timer = 5;
            //randomize the questions
            for (let i = 0; i < theOfficeQuiz.length; i++) {
                let random = Math.random();
                theOfficeQuiz[i].order = random;
            }
            console.log(theOfficeQuiz);
            // sorting the questions based on random number
            theOfficeQuiz = theOfficeQuiz.sort(function(a, b){return a.order - b.order});
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
            console.log(x)
        $('#next-question').on('click', function() {
            questionNumber++;
            console.log(questionNumber);
            if (questionNumber < 3) {
                displayQuestion();
            } else {
                endGame();
                // stopTimer();
            }
        })

        });
    }


    let endGame = function() {
        $('#display').empty();
        clearInterval(startTimer)
        $('#display').append(`Your score is ${timer}!`)
    }



})

// let startTimer = setInterval(() => {
//     timer--
// }, 1000);
let timeOut = function() {
    $('#display').empty();
    $('#display').append(`
    <h1> TIME'S UP!<h1>
    <h1> GAME OVER<h1>
    `)
}

let stopTimer = function() {
    clearInterval(startTimer)
}

let homeButton = 
`<br>
<div>
    <button class="home">
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
    options: ["Greensleeves", "Shot through the Heart", "Every Breath you Take", "You Give Love a Bad Name"],
    answer: "Shot through the Heart",
    order: ""
    },
    {
    questions: "On the episode ‘Diversity Day,’ which \"Character\" and \"Ethnicity card\" do NOT match?",
    options: ["Michael: Martin Luther King Jr.", "Angela: Jamaican", "Stanley: Black", "Pam: Asian"],
    answer: "Pam: Asian",
    order: ""
    }
    ]
    
    