// GAMING PHASE GLOBAL VARIABLES

// Game layout parameters
var gameScreensCount = 3;
var banditsCount = 6; // represent the number of bandits in each game screen

// Trial counters
var runningNumberOfTrials = 0;
var totalNumberOfTrials = 10;

// Reward Counters
var totalRewardScored = 0; // 0 because the total reward is zero when the game starts
var isCompleteFlag = false; // used to stop updating reward when the user exhausts his trials

// Timer related variables
var gameClickDelayDuration = 1; // this is in milliseconds

// Array to store each bandit trial data in the GAME phase
var gameData = [];

// trial counts at which you want to ask some questions
var questionPoints = [3, 6, 9];
var questionsList = ["Game phase question 1?", "Game phase question 2?", "Game phase question 3?"];


window.onload = function () {
    // Checking if the user has accessed this page from correctly after accessing the consent form
    if (sessionStorage.getItem("userId") === null || sessionStorage.getItem("userAge") === null || sessionStorage.getItem("userGender") === null) {
        location.href = "index";
        return;
    }

    if (sessionStorage.getItem("userHasAgreed") === null) {
        location.href = "index";
        return;
    }

    if (sessionStorage.getItem("trainingData") === null) {
        // reaching this if conditional means that the user has provided his data but didnt go through the training stage
        location.href = "training";
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

    // check if a question needs to be asked at window load !!
    // here we are checking because we might want to ask a question at the very beginning of the experiment
    checkQuestionPoints();

    // set the start time
    startTime = Date.now();
}

// turns off the overlay that is showed at the end both training and game phase
function turnOffOverlay() {
    document.getElementById("overlay").style.display = "none";

    // save the gameData to the localStorage
    sessionStorage.setItem("gameData", JSON.stringify(gameData));

    // MAKE CONNECTION TO THE FIREBASE RDS AND SAVE IT UP THERE ALONG WITH THE USER ID
    // CHANGE THE NAME IF FIREBASE IS NOT USED FOR SAVING THE DATA
    // uploadDataToDatabase();

    // ---------------------------------------------------------------------------------------------------------
    // after submitting the data to the database, display a thank you page along with a randomly generated code
    // this code should be submitted back in the MTurk worker page to get the incentive
    // ---------------------------------------------------------------------------------------------------------

    location.href = "thankyou";
}


// this function is invoked when any bandit in the game.html is clicked
function hubFunction(element) {

    dataCollector(element);

    // update the trial count when a bandit is clicked
    updateTrialCounter();

    // at this point check if you need to ask a question
    checkQuestionPoints();

    // calling this function to calculate reward and subsequently display it in the reward pop-up
    var clickedBandit = element.parentElement.id;
    calculateReward(clickedBandit);

    // pushing each bandit data into the gameData
    gameData.push(tempData);
    tempData = [];

    // code to redirect to the submission page at the end of the survey. (WORK ON IT LATER)
    if (runningNumberOfTrials == totalNumberOfTrials) {
        // this overlay will show a message 
        turnOnOverlay();
    }

    // INSERTING THE DELAY AFTER EACH CLICK
    togglePointerEvents();
    toggleCursorStyle();
    setTimeout(function () {
        togglePointerEvents();
        toggleCursorStyle();
    }, gameClickDelayDuration);
}
