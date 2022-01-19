// makes an HTTP GET request to the server and bring the latest data to the front end
function exportToCSV() {
    $.get("admin_data_download", function (data, status) {
        if (status == "success") {
            console.log(data);
            console.log(JSON.parse(data[0][3]));

            // exporting data to CSV format

            let csvContent = "data:text/csv;charset=utf-8,";

            // setting the column names
            var columns = ["userId", "gender", "age", "trainingData", "gameData", "userAnswers", "submissionCode"];

            // adding column names to csvContent
            csvContent = csvContent + columns.join(",") + "\r\n";
            var length = data.length;
            for (var index = 0; index < length; index++) {

                data[index][3] = data[index][3].replaceAll(",", ";");
                data[index][4] = data[index][4].replaceAll(",", ";");

                var eachUserData = data[index].join(",");

                csvContent = csvContent + eachUserData + "\r\n";
            }

            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            var today = new Date();
            today = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
            var filename = "userdata" + "-" + today + ".csv";
            link.setAttribute("download", filename);
            link.click();
        }
    });
}


