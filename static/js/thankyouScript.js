window.onload = function () {
    // Checking if the user has accessed this page from correctly after accessing the consent form
    if (sessionStorage.getItem("userId") === null || sessionStorage.getItem("userAge") === null || sessionStorage.getItem("userGender") === null) {
        location.href = "index";
        return;
    }

    if (sessionStorage.getItem("userHasAgreed") === null) {
        location.href = "index";
    }

    if (sessionStorage.getItem("trainingData") === null) {
        // reaching this if conditional means that the user has provided his data but didnt go through the training stage
        location.href = "training";
        return;
    }

    if (sessionStorage.getItem("gameData") === null) {
        // reaching this if conditional means that the user has provided his data and took the training but did not actually go through the game phase
        location.href = "game"
        return;
    }

    // The above if conditional blocks are strategically positioned at the beginning of the window load function call because we dont want the user to see the rendered front end, instead we want to take them to the relevant page if pages are accessed incorrectly


    // uploads the data to the database and gets back the submissionCode
    try {
        uploadDataToDatabase();
    }
    catch (e) {
        location = "/error";
    }

}

// IT MAY NOT BE FIREBASE AT THE END - SO DECIDE ACCORDINGLY THE NAME OF THE FUCNTION
function uploadDataToDatabase() {
    // collect all the data from the sessionStorage into one JSON object
    var fullData = {};
    fullData["userId"] = sessionStorage.getItem("userId");
    fullData["userGender"] = sessionStorage.getItem("userGender");
    fullData["userAge"] = sessionStorage.getItem("userAge");
    fullData["trainingData"] = sessionStorage.getItem("trainingData");
    fullData["gameData"] = sessionStorage.getItem("gameData");
    fullData["userAnswers"] = sessionStorage.getItem("userAnswers");

    // saving the fullData object into the session storage just for safety
    sessionStorage.setItem("fullData", JSON.stringify(fullData));


    // UPLOAD THE FULL DATA TO DATABASE WITH USER ID AS THE KEY AND THE "fullData" AS THE VALUE
    // check if the upload is successful or not somehow
    // delete the sessionstorage used for storing the data
    // return the function control to the turnOffOverlay function

    // making an AJAX request to the thank you page
    console.log("Making the AJAX request")
    $.ajax({
        type: "POST",
        url: "/thankyou",
        data: JSON.stringify(fullData),
        dataType: 'json'
    }).done(function (response) {
        console.log("Response received");
        console.log(response['submissionCode']);
        document.getElementById("submission-code").innerHTML = response['submissionCode'];
    });

    // clearing the entire session storage
    sessionStorage.clear();
    console.log("Session storage cleared");
}