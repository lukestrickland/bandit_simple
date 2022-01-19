// TRAINING PHASE GLOBAL VARIABLES

// Training game layout parameters
var gameScreensCount = 3;
var banditsCount = 6; // represent the number of bandits in each game screen

// Trial counters
var runningNumberOfTrials = 0;
var totalNumberOfTrials = 10;

// Reward Counters
var totalRewardScored = 0; // 0 because the total reward is zero when the game starts
var isCompleteFlag = false; // used to stop updating reward when the user exhausts his trials

// Timer related variables
var trialClickDelayDuration = 1; // this is in milliseconds

// window loading time
var startTime = 0;

// Array to store each bandit trial data in the training phase
var trainingData = [];

// trial counts at which you want to ask some questions
var questionPoints = [3, 6, 9];
var questionsList = ["How much do you like this game?", "How often do you take surveys?", "How much do you enjoy taking surveys?"];

// -----------------------------------------------------------------------------------------------

window.onload = function () {
    // Checking if the user has accessed this page from correctly after accessing the consent form
    if (sessionStorage.getItem("userId") === null || sessionStorage.getItem("userAge") === null || sessionStorage.getItem("userGender") === null) {
        location.href = "index"
        return;
    }

    if (sessionStorage.getItem("userHasAgreed") === null) {
        location.href = "consent";
        return;
    }

    // The above if blocks are strategically positioned at the beginning of the window load function call because we dont want the user to see the rendered front end, instead we want to take them to the relevant page if pages are accessed incorrectly


    // ------ FRONT END RENDERING ---------

    // setting the initial "total trials count"
    document.querySelector(".total-trial-count").innerHTML = totalNumberOfTrials.toString();
    // setting the initial "running-trial-count"
    document.querySelector(".running-trial-count").innerHTML = runningNumberOfTrials.toString();
    // setting the initial "running-reward-count"
    document.querySelector(".running-reward-count").innerHTML = totalRewardScored.toString();


    // gamescreen rendering
    renderScreens(gameScreensCount);
    // bandits rendering in each screen
    renderBandits(banditsCount);
    // arms rendering in each bandit
    renderBanditArms();

    // make every screen unclickable except for one gamescreen of the given number
    var clickableScreenNumber = 2;
    makeScreensUnclickable(clickableScreenNumber);

    // check if a question needs to be asked at window load !!
    // here we are checking because we might want to ask a question at the very beginning of the experiment
    checkQuestionPoints();


    // set the start time
    startTime = Date.now();
}

// this adds a class "unclickable" to all the gamescreens except the one passed as parameter
// if nothing is passed then all the screens are make unclickable
function makeScreensUnclickable(clickableScreenNumber = -1) {
    // get a hold of all the game screens
    var clickableScreenIndex = clickableScreenNumber - 1;
    var gameScreens = document.querySelectorAll(".gamescreen");

    for (var i = 0; i < gameScreens.length; i++) {
        if (i != clickableScreenIndex) {
            // make the screen unclickable
            gameScreens[i].classList.add("unclickable");
        }
    }
}

// this is called when clicked anywhere on the overlay once it comes up on the screen after exhausting the trials
function turnOffOverlay() {
    document.getElementById("overlay").style.display = "none";

    // before redirecting to the next page, save the training data to localStorage so it can be accessed later
    sessionStorage.setItem("trainingData", JSON.stringify(trainingData));

    // redirect to the game.html page
    location.href = "game";
}

// -------------------------------- HUB FUNCTION --------------------------------------

// this function is invoked when any bandit in the training.html is clicked
function hubFunction(element) {

    // collects the data related to the clicked bandit
    dataCollector(element);

    // update the trial count when a bandit is clicked
    updateTrialCounter();

    // at this point check if you need to ask a question
    checkQuestionPoints();

    // calling this function to calculate reward and subsequently display it in the reward pop-up
    var clickedBandit = element.parentElement.id;
    calculateReward(clickedBandit);


    // REMOVE THE CONSOLE LOGS AFTER FINALISING THE DATA COLLECTION
    trainingData.push(tempData);
    tempData = []; // resetting the temp data to an empty array to make it available for the next trial


    // ------- COMMENTING THIS OUT TEMPORARILY TO IMPLEMENT DELAY OF 500ms ------------------
    // UPDATE: The delay and re-rendering of bandit arms is already taken care towards the end of this function 
    // renderBanditArms is called every time a bandit is clicked to randomize the arm lengths
    // renderBanditArms();


    // AT THIS POINT CHECK IF THE RUNNING NUMBER OF TRIALS IS MATCHING WITH ANY QUESTIONS POINTS TO ASK A QUESTION
    // if (questionPoints.includes(runningNumberOfTrials)) {
    //     console.log("You trial count matched with question points ", runningNumberOfTrials);
    // }

    // code to redirect to the submission page at the end of the survey. (WORK ON IT LATER)
    if (runningNumberOfTrials == totalNumberOfTrials) {
        // blocking the user from clicking after trials are completed by showing a overlay effect
        // can also block the pointer events when the trial count is exhauted to prevent further clicking
        turnOnOverlay();
        // location.href = "game.html";
    }

    // ----------------------------- DELAY IMPLEMENTATION --------------------------

    // IMPLEMENTING THE DELAY OF 500ms AFTER EACH CLICK AND THIS CAN BE DONE IN 2 WAYS
    // 1) DISABLING THE POINTER EVENTS (MAKING EVERYTHING UNCLICKABLE) FOR DELAY DURATION
    // 1.1) CAN SHOW A DIFFERENT STYLE OF CURSOR DURING THAT TIME
    // 2) CAN STOP THE EXECUTION OF THE PROGRAM FOR DELAY DURATION WITH NO VISIBLE CHANGES


    // the call to renderBanditArms() can be delay by 500ms along with dropping and reinstating the pointer events can take care of this !
    // setTimeout(function(){
    //     renderBanditArms();
    // }, 2000);

    // ------------ STEPS ------------
    // 1) stop the pointer events after the reward is displayed
    togglePointerEvents();
    // 2) show that the game play is blocked for some time by changing the pointer
    toggleCursorStyle();
    // can add more visual affects here to make the user feel that the next click needs to be waited
    // 3) now use the setTimeout function with the actual delay duration to re-render the bandit arms
    setTimeout(function () {
        renderBanditArms();
        togglePointerEvents();
        toggleCursorStyle();
    }, trialClickDelayDuration);

}