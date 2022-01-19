# Experiment 2 - Functional Multi-Armed Bandits


## Study of Exploration-Exploitation tendency
This repo consists of the files necessary for conducting the study

## Architecture of the application
static folder - contains the folders that contain style sheets (i.e., CSS) and also the javascript files adding the functionality
templates folder - contains the HTML files including the base HTML files and also the files that render different pages in the application
app.py - This python script contains the routes that are implemented in the application
requirements.txt - This text file contains all the libraries that are needed for the application to run


## Individual templates within the templates folder
1) index.html - It is the html document that is first show to the users
2) consent.html - It is the html document that displays the consent form and asks the user to accept the form to move ahead to the training.html
3) training.html - This html document will be similar to the main game except for the fact that only one of the gamescreens will be playable
4) game.html - It is the html document that contains the main game screen (currently sequenced to appear after the index.html)
5) duplicate.html - Originally planned to show this page upon detection of duplicate attempt by Prolific user (might change as the project progresses)


## Individual scripts in the js subfolder of static folder
1) indexScript.js - This script handles the functionality of the index.html
2) consentScript.js - This script checks if the user has agreed to the consent form and takes the user to the training.html
3) commonScript.js - This script contains all the common functionality for both the training and the game phases
4) trainingScript.js - This contains the code that is specific to the training phase
5) gameScript.html - This contains the code that is specific to the game phase

## Style sheets in the css subfolder of static folder
1) styles.css - Responsible for styling all the html pages



## INSTRUCTIONS ON HOW TO LAUNCH THE APP (on localhost)
Since the dependencies are specific to this app, I recommend using a virtual environment.

__To create a virtual environment in Windows:__
1) Open your command prompt/terminal
2) Navigate to the directory where you want to create your virtual env
3) Use the command `python -m venv your_env_name` to create virtual env
4) Then run the command `your_env_name\Scripts\activate` to activate the env
5) Download all the files in this repo to your project directory
6) Run the command `pip install -r requirements.txt` to install all the required libraries
7) Now you have your virtual env configured to run the web app
8) Run the command `python app.py` to launch the app
9) Use the local host address shown in the terminal to see the app in action
10) Press `CTRL + C` to stop the server in your terminal
11) To deactivate the virtual environment run `your_env_name\Scripts\deactivate.bat` in your terminal

_Note: Above instructions works for Windows, for MacOS or Linux the commands might be slightly different_


## People:
- Researcher - Luke Strickland
- Programmer - Akhil Eaga
