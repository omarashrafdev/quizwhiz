from django.urls import path
from .views import ChoiceDetailsView, ChoiceView, CreateQuizInvitationView, CreatedQuizzesView, JoinQuizWithInvitationView, QuestionDetailsView, QuestionView, QuizCreateView, QuizDetailView, RegisterView, CustomTokenObtainPairView, TakenQuizzesView, UserProfileView, QuizJoinView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    
    path('quiz/create/', QuizCreateView.as_view(), name='quiz-create'),
    path('quiz/<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),

    path('quiz/<int:quiz_id>/question/', QuestionView.as_view(), name='question-list-create'),
    path('quiz/<int:quiz_id>/question/<int:pk>/', QuestionDetailsView.as_view(), name='question-detail'),
    
    path('question/<int:question_id>/choice/', ChoiceView.as_view(), name='choice-list-create'),
    path('question/<int:question_id>/choice/<int:pk>/', ChoiceDetailsView.as_view(), name='choice-detail'),

    path('quiz/<int:quiz_id>/create-invitation/', CreateQuizInvitationView.as_view(), name='create-quiz-invitation'),
    path('quiz/join/<str:code>/', JoinQuizWithInvitationView.as_view(), name='join-quiz-invitation'),
    
    path('quiz/created/', CreatedQuizzesView.as_view(), name='created-quizzes'),
    path('quiz/taken/', TakenQuizzesView.as_view(), name='taken-quizzes'),
]
