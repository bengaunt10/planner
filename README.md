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

# Technologies used:
- Bootstrap: https://getbootstrap.com/
- FullCalendar API: https://fullcalendar.io/
- Vite: https://vite.dev/
- React official documentation: https://react.dev/
- Django Rest Framework official documentation: https://www.django-rest-framework.org/
- Django official documentation: https://docs.djangoproject.com/en/5.1/
- Conda environment: https://anaconda.org/anaconda/conda
- VS Code: https://code.visualstudio.com/
- All code implemented by me, GitHub Copilot (integrated within visual studio), occasionally assisted with some syntax and scaffolding tests. All this was reviewed, understood and adapted by me.
- React Testing Library: https://testing-library.com/
- Vitest: https://vitest.dev/
- Icons: https://fontawesome.com/
- Authentication system understood and adapted from: https://www.youtube.com/watch?v=WuyKxdLcw3w&list=WL&index=3&t=2233s
- Background animation adapted from: https://codepen.io/osorina/pen/PQdMOO
- Breathing animation adapted from: https://vmar76.medium.com/using-css-animations-to-visualize-breathing-techniques-7a20ee0aed5a
- Pomodoro Timer adapted from: https://www.youtube.com/watch?v=9z1qBcFwdXg&list=WL&index=2&t=11s
- Loading animation in code adapted from: https://css-loaders.com/
