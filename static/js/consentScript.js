function takeToGamePage() {
    // check if the user has signed the consent form
    // if yes then take them to the game page
    // if not then ask them for it again or end the game ???

    var userHasAgreed = document.getElementById("consent-agreement-button").checked;

    if (userHasAgreed) {
        // redirect them to training.html
        sessionStorage.setItem("userHasAgreed", "Yes");
        location.href = "training";
    }
    else {
        // display an error message to alert the users that they have to tick the box before proceeding to play the game
        document.querySelector(".consent-error").innerHTML = "** Please tick the checkbox to continue";
    }


}