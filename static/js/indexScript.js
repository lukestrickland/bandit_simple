// GLOBAL VARIABLE DECLARATIONS
var userId = "";
var userGender = "";
var userAge = "";
var search = ""; // represents the search params in the URL


// extracts the user's  id, session id and study id
window.onload = function () {
    // populating the age group options with the first parameter as lower bound and second as the upper bound for age (both inclusive)
    populateAgeOptions(15, 100);

    // prepopulating the form data if the user was shown the index screen once
    if (sessionStorage.getItem("userId") !== null) {
        document.getElementById("userid").value = sessionStorage.getItem("userId");
        document.getElementById("userid").setAttribute("readonly", "true");
    }
    if (sessionStorage.getItem("userGender") !== null) {
        document.getElementById("gender").value = sessionStorage.getItem("userGender");
    }
    // this if block needs to come after the age options are populated
    if (sessionStorage.getItem("userAge") !== null) {
        document.getElementById("age").value = parseInt(sessionStorage.getItem("userAge"));
    }

    // search parameters from the URL
    search = location.search;


    // making a textfield available if there is no MTurk ID or search params in the URL
    if (search !== "") {
        // populate the userId on the index.html page
        var params = search.split("?");

        if (params[1].includes("MID")) {
            userId = params[1].split("=")[1];
            // document.getElementById("userid").classList.toggle("hide");
            document.getElementById("userid").value = userId;
            document.getElementById("userid").setAttribute("readonly", "true");
        }
    }
}

// takes in the min and max age as input parameters and populates them as age options in the index page age dropdown
function populateAgeOptions(minAge, maxAge) {
    var age = document.getElementById("age");
    var optionsList = "<option value = ''>Select an option</option>";
    for (var i = minAge; i <= maxAge; i++) {
        optionsList = optionsList + "<option value= " + i + ">" + i + "</option>";
    }
    age.innerHTML = optionsList;
}