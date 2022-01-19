// --------------------------------------------------
// COMMON FUNCTIONS IN BOTH TRAINING AND GAME PHASES
// --------------------------------------------------

// Global variable declarations
// temp data stores the bandit related data for each click temporarily before reset 
var tempData = [];


// generates the html for the game screens and inserts in the DOM
function renderScreens(numberOfScreens) {
    // get a hold of the game container
    var gameContainer = document.querySelector(".game-container");
    var innerHTML = "";
    for (var i = 0; i < numberOfScreens; i++) {
        innerHTML = innerHTML + '<div class ="gamescreen" id= "gamescreen' + (i + 1) + '" text-center"></div>';
    }

    gameContainer.innerHTML = innerHTML;
}

// generates the html for the bandits and inserts in the DOM
function renderBandits(numberOfBandits) {
    // get a hold of all the game screens
    var gameScreens = document.querySelectorAll(".gamescreen");

    var banditIdCounter = 1;
    // loop through each game screen 
    for (var i = 0; i < gameScreens.length; i++) {
        var innerHTML = '<div class="game-number-heading text-center">Game ' + (i + 1) + '</div>';
        for (var j = 0; j < Math.floor(numberOfBandits / 2); j++) {
            innerHTML = innerHTML +
                `<div class="bandit-row text-center">
                <div class="bandit" id="bandit` + (banditIdCounter++) + `">
                    <div class="bandit-score hide-score">
                        <p>+ 100 XP</p>
                    </div>
                    <div class="bandit-content" onclick="hubFunction(this)">
                        <div class="bandit-arms bandit-arm-1">
                        
                        </div>

                        <!-- newly added bandit arms for testing -->
                        <div class="bandit-arms bandit-arm-2">
                        
                        </div>
                    </div>
                </div>
                <div class="bandit" id="bandit` + (banditIdCounter++) + `">
                    <div class="bandit-score hide-score">
                        <p>+ 100 XP</p>
                    </div>
                    <div class="bandit-content" onclick="hubFunction(this)">
                        <div class="bandit-arms bandit-arm-1">

                        </div>

                        <!-- newly added bandit arms for testing -->
                        <div class="bandit-arms bandit-arm-2">
                        
                        </div>
                    </div>
                </div>
            </div>`;
        }
        // used when the bandits number is odd as the above loop will only create a pair of bandits in a row at once
        if (numberOfBandits % 2 != 0) {
            // this means the number of bandits is odd
            innerHTML = innerHTML +
                `<div class="bandit-row text-center">
                <div class="bandit" id="bandit` + (banditIdCounter++) + `">
                    <div class="bandit-score hide-score">
                        <p>+ 100 XP</p>
                    </div>
                    <div class="bandit-content" onclick="hubFunction(this)">
                        <div class="bandit-arms bandit-arm-1">
                        
                        </div>
                        <div class="bandit-arms bandit-arm-2">
                        
                        </div>
                    </div>
                </div
            </div>`;
        }
        gameScreens[i].innerHTML = innerHTML;
    }
}

// renders the bandit arms of varying lengths
function renderBanditArms() {
    // getting hold of all the game screens
    var gameScreens = document.querySelectorAll(".gamescreen");

    // getting hold of all bandits in each gamescreen
    for (var i = 0; i < gameScreens.length; i++) {
        var bandits = gameScreens[i].querySelectorAll(".bandit-arms");

        // looping over each bandit to set the arm lengths
        // for (var j = 0; j < bandits.length; j++) {
        //     var height = randomLengthGenerator();
        //     var width = randomLengthGenerator();
        //     bandits[j].style.height = height.toString() + "%";
        //     bandits[j].style.width = width.toString() + "%";
        // }


        // testing this code by commenting the above code
        for (var j = 0; j < bandits.length; j = j + 2) {
            var height_1 = randomLengthGenerator();
            var height_2 = randomLengthGenerator();
            bandits[j].style.height = height_1.toString() + "%";
            bandits[j + 1].style.height = height_2.toString() + "%";
        }
    }
}

// generates random numbers in the range of 0 and 80 which are used to set the bandit arm lengths
// Math.random() generates values in the range of 0.0 (inclusive) and 1.0 (exclusive) and closely follows uniform distribution
function randomLengthGenerator() {
    var min = 10;
    var max = 90; // but 90 will not be achieved because of the floor function
    // MIN VALUE ACHIEVED IS 10 AND MAX VALUE ACHIEVED WILL BE 80 BECAUSE OF THE FLOOR FUNCTION USED
    // the variable "max" is set to 90 so that 80 can be produced as the MAX value of the height or width (basically the lengths of the arms in the bandit)
    var randomLength = min + Math.random() * (max - min);
    randomLength = Math.floor(randomLength / 10) * 10;
    return randomLength;
}

// calculates the reward by extracting the arm lengths and adding the gaussian noise
// makes a call to updateRewardCounter() and displayReward() functions
function calculateReward(elementId) {
    var bandit = document.getElementById(elementId);

    // extracting the arm lengths
    // var height = bandit.querySelector(".bandit-arms").style.height;
    // var width = bandit.querySelector(".bandit-arms").style.width;

    var height = bandit.querySelector(".bandit-arm-1").style.height;
    var width = bandit.querySelector(".bandit-arm-2").style.height;

    // converting strings into numbers
    height_1 = parseInt(height); // ranges from 10 - 80 (depends on the min and max setting in the randomLengthGenerator function)
    height_2 = parseInt(width); // ranges from 10 - 80 (depends on the min and max setting in the randomLengthGenerator function)

    // SCALING OF THE TOTAL LENGTH AND GAUSSIAN NOISE SHOULD BE FOUND FROM LUKE
    var totalLength = height_1 + height_2; // ranges between 20 - 160
    var gaussianNoise = gaussianNoiseGenerator(0, 10); // gaussianNoiseGenerator needs min and max values to output noise
    var currentReward = totalLength + gaussianNoise;

    // ---------------------------------------------------------------------
    // console.log("Base Score is ", totalLength);
    tempData.push(totalLength);
    console.log("Height-1 is ", height_1, " Height-2 is ", height_2)
    // console.log("Gaussian Noise " , gaussianNoise);
    tempData.push(gaussianNoise);
    console.log("Gaussian Noise is ", gaussianNoise);
    // console.log("Total Reward ", currentReward);
    tempData.push(currentReward);
    console.log("Total is ", currentReward);
    // ---------------------------------------------------------------------


    // update the global reward counter by updating the totalRewardScored variable
    updateRewardCounter(currentReward);

    // passing the calculated reward and the id of the bandit to display the score
    displayReward(currentReward, elementId);
}

// generates the gaussian noise to be added to the previous score (based on arm lengths) 
function gaussianNoiseGenerator(min, max, skew = 1) {
    // Source: https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve

    let u = 0, v = 0;
    while (u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random()
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)

    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0)
        num = gaussianNoiseGenerator(min, max, skew) // resample between 0 and 1 if out of range

    else {
        num = Math.pow(num, skew) // Skew
        num *= max - min // Stretch to fill range
        num += min // offset to min
    }

    // -----------------------------------------------------------------------------------------------------
    // MATH.ROUND IS USED TO ADJUST THE REWARD NUMBER DISPLAY. TO BE CHANGED WHEN SCALE OF REWARD IS DECIDED
    // -----------------------------------------------------------------------------------------------------
    return Math.round(num, 2);
}

// displays the reward on the elementId passed as parameters to this function
function displayReward(reward, elementId) {
    var bandit = document.getElementById(elementId)
    var scoreCard = bandit.querySelector(".bandit-score");

    // grabbing the <p> element in the score card element and injecting the score as the innerHTML
    scoreCard.querySelector("p").innerHTML = reward;

    // making the score card appear by toggling the hide-score OFF
    scoreCard.classList.toggle("hide-score");

    // making the score card disappear by toggling the hide-score ON
    // 500 is basically 500 milliseconds after which the reward popup disappear
    setTimeout(function () {
        scoreCard.classList.toggle("hide-score");
    }, 500);
}

// this function updates the reward counter
function updateRewardCounter(incrementAmount) {
    if (runningNumberOfTrials <= totalNumberOfTrials && !isCompleteFlag) {
        totalRewardScored = totalRewardScored + incrementAmount;
        document.querySelector(".running-reward-count").innerHTML = totalRewardScored.toString();
        if (runningNumberOfTrials === totalNumberOfTrials) {
            isCompleteFlag = true;
        }
    }
    else {
        // dont increment the reward as the user has exhausted their trials
    }

}

// this function updates the trials counter
function updateTrialCounter() {
    if (runningNumberOfTrials < totalNumberOfTrials) {
        document.querySelector(".running-trial-count").innerHTML = (++runningNumberOfTrials).toString();
    }
    else {
        // You have exhausted your trials
        // potentially a modal pops up and displays "you have exhausted your trials"
        // alert("You have exhausted the trials !!");
    }
}

// this function will put an overlay on the existing webpage and will go away when clicked anywhere on the overlay
function turnOnOverlay() {
    // the message that appears on the overlay comes from the html div elment within the body tag
    document.getElementById("overlay").style.display = "block";
}


// QUESTION OVERLAY FUNCTIONS

// function that checks if the current trial count is matching with any of question points
// if the current trial count matches, then a matching question is shown in a modal
function checkQuestionPoints() {
    console.log("CHECKER HAS BEEN INVOKED");
    if (questionPoints.includes(runningNumberOfTrials)) {
        console.log("A matching point is found by the checker at ", runningNumberOfTrials);
        // start the overlay
        displayQuestionOverlay();
    }
}

// displays a question overlay when called and 
// uses the runningNumberOfTrials variable to get the right question from the questions array
function displayQuestionOverlay() {
    // start the question overlay
    document.getElementById("question-overlay").style.display = "block";
    // populate the question
    var question = document.querySelector(".question");
    if (questionPoints.indexOf(runningNumberOfTrials) < questionsList.length) {
        question.innerHTML = questionsList[questionPoints.indexOf(runningNumberOfTrials)];
    }
    // populate the options
    // @ todo - create function that takes in number range to populate the answer options
    var answer = document.querySelector(".answer-options");
    answer.innerHTML = `<div class="slider-container">
                            <input type="range" min="0" max="10" value="5" class="slider" id="myRange">
                            <p>You chose: <span id="demo"></span> / 10</p>
                        </div>`

    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    output.innerHTML = slider.value;

    slider.oninput = function () {
        output.innerHTML = this.value;
    }
    // make choosing an answer mandatory

}

// hides the question overlay when the function is invoked
// before hiding the question overlay, it collects the answer and should save it to database
function hideQuestionOverlay() {
    // extract the answer the user has given in the slider element
    var answer = document.querySelector(".slider").value;
    console.log("The user selected the value ", answer);
    // save it in db
    if (sessionStorage.getItem("userAnswers") == null) {
        // means the userAnswers key is not present in the session storage
        // so create the key and set its value to the answer collected above
        sessionStorage.setItem("userAnswers", answer);
    }
    else {
        // userAnswers basically is concatenated version of all the answers the user had provided to all the questions during the training and game phases.
        // userAnswers are stored in the same sequence of the questions and the number of answers in this variable after splitting using the semicolon separator would be equal to the sum of questions in both training and game phases
        sessionStorage.setItem("userAnswers", sessionStorage.getItem("userAnswers") + ";" + answer);
    }
    // then hide the question overlay
    document.getElementById("question-overlay").style.display = "none";
}

// this function toggles the pointer events for all the gamescreens
function togglePointerEvents() {
    var gameScreens = document.querySelectorAll(".gamescreen");
    for (var i = 0; i < gameScreens.length; i++) {
        // drop the pointer events on all of them
        gameScreens[i].classList.toggle("togglePointerEvents");
    }
}

// this function toggles the cursor style for the whole body element
// this has to be done to a parent element of the element on which the pointer events are being toggled
function toggleCursorStyle() {
    document.getElementsByTagName("BODY")[0].classList.toggle("toggleCursorStyle");
}

// populates the data into the temp data array
function dataCollector(element) {
    // console.log("Bandit number is", element.parentElement.id);
    tempData.push(element.parentElement.id);
    // console.log("Gamescreen is", element.parentElement.parentElement.parentElement.id);
    tempData.push(element.parentElement.parentElement.parentElement.id);
    // console.log(element.parentElement.id, "is clicked after", (Date.now() - startTime), "ms since start");
    tempData.push((Date.now() - startTime));
    // // console.log("Bandit Arm Height (L1)", parseInt(element.querySelector(".bandit-arms").style.height));
    // tempData.push(parseInt(element.querySelector(".bandit-arms").style.height));
    // // console.log("Bandit Arm Width (L2)", parseInt(element.querySelector(".bandit-arms").style.width));
    // tempData.push(parseInt(element.querySelector(".bandit-arms").style.width));

    // console.log("Bandit Arm Height (L1)", parseInt(element.querySelector(".bandit-arms").style.height));
    tempData.push(parseInt(element.querySelector(".bandit-arm-1").style.height));
    // console.log("Bandit Arm Width (L2)", parseInt(element.querySelector(".bandit-arms").style.width));
    tempData.push(parseInt(element.querySelector(".bandit-arm-2").style.height));
}

