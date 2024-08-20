# QuizWhiz

QuizWhiz is an online quiz maker application that allows users to create, join, and manage quizzes. The platform supports various question types, user authentication, and authorization, and features like quiz invitations with expiration.

## Features

- User registration and authentication
- Create, view, update, and delete quizzes
- Create, view, update, and delete questions within quizzes
- Create, view, update, and delete choices within questions
- Join quizzes using a unique invitation code
- Invitation links with customizable expiration times and maximum join counts

## Development

### Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/omarahsrafdev/quizwhiz.git
    cd quizwhiz
    cd backend
    ```

2. **Create and activate a virtual environment:**

    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

3. **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4. **Run migrations:**

    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

5. **Create a superuser:**

    ```bash
    python manage.py createsuperuser
    ```

6. **Start the development server:**

    ```bash
    python manage.py runserver
    ```

### Models

- **CustomUser:** Extends the default Django user model.
- **Quiz:** Represents a quiz.
- **Question:** Represents a question in a quiz.
- **Choice:** Represents a choice in a question.
- **UserQuiz:** Tracks user participation in quizzes.
- **QuizInvitation:** Manages invitation links for quizzes.

### Permissions

- Only the creator of a quiz can add, update, or delete questions and choices in that quiz.

### API Documentation

#### Authentication

- **Register:** `POST /api/v1/register/`
  - Request:
    ```json
    {
      "name": "User Name",
      "email": "user@example.com",
      "username": "username",
      "password": "password"
    }
    ```

- **Login:** `POST /api/v1/login/`
  - Request:
    ```json
    {
      "email": "user@example.com",
      "password": "password"
    }
    ```

#### User Profile

- **Get and Update Profile:** `GET/PUT /api/v1/profile/`
  - Request (for update):
    ```json
    {
      "name": "New Name",
      "username": "newusername"
    }
    ```

#### Quiz

- **Create Quiz:** `POST /api/v1/quiz/create/`
  - Request:
    ```json
    {
      "title": "Quiz Title",
      "description": "Quiz Description",
      "password": "optional_password",
      "start_time": "2024-08-01T12:00:00Z",
      "duration": "00:30:00"
    }
    ```

- **List Quizzes:** `GET /api/v1/quiz/`
  - Response:
    ```json
    [
      {
        "id": 1,
        "title": "Quiz Title",
        "description": "Quiz Description",
        "start_time": "2024-08-01T12:00:00Z",
        "duration": "00:30:00"
      }
    ]
    ```

- **Quiz Details:** `GET/PUT/DELETE /api/v1/quiz/{id}/`
  - Request (for update):
    ```json
    {
      "title": "Updated Quiz Title",
      "description": "Updated Quiz Description"
    }
    ```

#### Question

- **Create Question:** `POST /api/v1/quiz/{quiz_id}/question/`
  - Request:
    ```json
    {
      "content": "Question content",
      "type": "MCQ",
      "correct_choice": 1
    }
    ```

- **List Questions:** `GET /api/v1/quiz/{quiz_id}/question/`
  - Response:
    ```json
    [
      {
        "id": 1,
        "content": "Question content",
        "type": "MCQ",
        "correct_choice": 1
      }
    ]
    ```

- **Question Details:** `GET/PUT/DELETE /api/v1/quiz/{quiz_id}/question/{id}/`
  - Request (for update):
    ```json
    {
      "content": "Updated Question content",
      "type": "MCQ"
    }
    ```

#### Choice

- **Create Choice:** `POST /api/v1/question/{question_id}/choice/`
  - Request:
    ```json
    {
      "content": "Choice content"
    }
    ```

- **List Choices:** `GET /api/v1/question/{question_id}/choice/`
  - Response:
    ```json
    [
      {
        "id": 1,
        "content": "Choice content"
      }
    ]
    ```

- **Choice Details:** `GET/PUT/DELETE /api/v1/question/{question_id}/choice/{id}/`
  - Request (for update):
    ```json
    {
      "content": "Updated Choice content"
    }
    ```

#### Quiz Invitation

- **Create Invitation:** `POST /api/v1/quiz/{quiz_id}/create-invitation/`
  - Request:
    ```json
    {
      "expires_at": "2024-08-08T12:00:00Z",
      "max_joins": 5
    }
    ```

- **Join Quiz with Invitation:** `POST /api/v1/quiz/join/{code}/`
  - Request:
    ```json
    {
      "password": "optional_password"
    }
    ```


## License

This project is licensed under the MIT License - see the [MIT License](https://opensource.org/license/mit) for details.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## Contact

For any inquiries, please contact [omar.ashraf.dev@gmail.com](mailto:omar.ashraf.dev@gmail.com).
