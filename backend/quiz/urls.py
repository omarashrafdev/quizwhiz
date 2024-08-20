from django.urls import path
from .views import ChoiceDetailsView, ChoiceView, CreatedQuizzesView, JoinQuizView, QuestionDetailsView, QuestionView, QuizCreateView, QuizDetailView, QuizQuestions, RegisterView, CustomTokenObtainPairView, QuizSubmissionView, StartSubmissionSessionView, TakenQuizzesView, UserProfileView, QuizSubmissionGetView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('user/quizzes/', QuizSubmissionGetView.as_view(), name='user-quizzes'),
    
    path('quiz/create/', QuizCreateView.as_view(), name='quiz-create'),
    path('quiz/<uuid:pk>/', QuizDetailView.as_view(), name='quiz-detail'),

    path('quiz/<uuid:quiz_id>/question/', QuestionView.as_view(), name='question-list-create'),
    path('quiz/<uuid:quiz_id>/question/<int:pk>/', QuestionDetailsView.as_view(), name='question-detail'),
    
    path('question/<int:question_id>/choice/', ChoiceView.as_view(), name='choice-list-create'),
    path('question/<int:question_id>/choice/<int:pk>/', ChoiceDetailsView.as_view(), name='choice-detail'),

    path('quiz/<uuid:quiz_id>/join/', JoinQuizView.as_view(), name='join-quiz'),
    path('quiz/<uuid:quiz_id>/submit/<uuid:submission_id>/start/', StartSubmissionSessionView.as_view(), name='start-submission-session'),
    path('quiz/<uuid:quiz_id>/submit/<uuid:submission_id>/questions/', QuizQuestions.as_view(), name='show-quiz-question'),
    path('quiz/<uuid:quiz_id>/submit/<uuid:submission_id>/', QuizSubmissionView.as_view(), name='submit-answer'),
    
    path('quiz/created/', CreatedQuizzesView.as_view(), name='created-quizzes'),
    path('quiz/taken/', TakenQuizzesView.as_view(), name='taken-quizzes'),
]
