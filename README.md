# CalmDay

This project follows the development of a task management full stack web application aiming to streamline the organisation of a daily schedule while maintaining wellbeing and productivity. An intuitive, accessible and simple interface is implemented to allow users to manage their tasks effectively and address the issue of cognitive overload in the context of task management. Django was implemented in the backend and React in the frontend; therefore, the core functionality was implemented through Python, HTML, CSS and JavaScript. Authentication, wellbeing tools, task creation and automatic task scheduling are some of the features presented by this system. Aimed for all users, targeted at students and a focus on being accessible for those neurodivergent. 

# Installation and running the code for Windows:
1. Clone the repository then install Python and Node.js
2. Open this in the IDE of your choice(visual studio code recommended) and open the terminal.
3. Create a .env file in the frontend file and write VITE_BASE_URL="http://127.0.0.1:8000".
4. Navigate to settings.py and uncomment the local development database and comment out the deployment database.
5. In the terminal:
    1. cd backend
    2. python -m venv venv
    3. source venv\scripts\activate
    4. pip install -r requirements.txt
    5. python manage.py migrate
    6. python manage.py runserver
6. Make another Terminal:
    1. cd frontend
    2. npm install
    3. npm run dev
This should start the development server at localhost:5173.
