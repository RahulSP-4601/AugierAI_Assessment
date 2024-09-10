# AugierAI_Assessment

* Overview:
    This project is a web application designed with three primary vertical sections. The first section manages outliers, 
    the second section serves as a text editor with customizable formatting options, and the third section integrates a 
    Large Language Model (LLM) using OpenAI's API for generating intelligent responses. The application uses HTML, CSS, 
    JavaScript, React, Python, and JSON for its functionality, ensuring smooth interactions and a user-friendly experience.

* Features
    1. Outlier Management (First Section):
        i. Users can create, name, and switch between multiple outliers.
        ii. Each outlier saves its own state, including text edits and interactions with the LLM.
        iii. Data is stored and persisted using JSON.

    2. Custom Text Editor (Second Section):
        i. A fully functional word-processing area with options to:
            i.i. Change text size, font, and color.
            i.ii. Apply bold, italics, underline, and highlight text.
        ii. Edits are saved for each outlier and persist across sessions.

    3. Large Language Model Integration (Third Section):
        i. The LLM is powered by OpenAI’s API, providing intelligent and context-aware responses based on user inputs.
        ii. Conversations with the LLM are saved and specific to each outlier.
        iii. Note: OpenAI’s free quota has limits, and additional usage may require payment.

* Technology Stack
    1. Frontend:
        i. HTML, CSS, JavaScript

    2. Backend:
        i. Python
    
    3. Database/Data Storage:
        i. JSON (for saving outliers and state data)
    
    4. API Integration:
        i. OpenAI API for Large Language Model functionality

* How to Run the Project
    1. Ensure you have the following installed:
        i. Python 3.x
        ii. pip install Flask openai

    2. Set up the environment:
        i. Navigate to the project directory in your terminal or command prompt.
        ii. Type python app.py
        iii. You will find http://127.0.0.1:5000 link in terminal copy paste in any web browser our project will be hosted locally.
