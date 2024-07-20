from django.urls import path
from .views import CreatedQuizzesView, QuizCreateView, QuizDetailView, RegisterView, CustomTokenObtainPairView, TakenQuizzesView, UserProfileView, QuizJoinView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    
    path('quiz/create/', QuizCreateView.as_view(), name='quiz-create'),
    path('quiz/<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),

    path('quiz/join/', QuizJoinView.as_view(), name='quiz-join'),
    path('quiz/created/', CreatedQuizzesView.as_view(), name='created-quizzes'),
    path('quiz/taken/', TakenQuizzesView.as_view(), name='taken-quizzes'),
]
