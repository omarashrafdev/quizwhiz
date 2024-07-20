from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser, Quiz, UserQuiz
from .serializers import QuizListSerializer, RegisterSerializer, CustomTokenObtainPairSerializer, UserSerializer, QuizSerializer


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class QuizCreateView(generics.ListCreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]


class QuizDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Quiz.objects.filter(creator=self.request.user)



class QuizJoinView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        quiz_id = request.data.get('quiz_id')
        password = request.data.get('password')
        try:
            quiz = Quiz.objects.get(id=quiz_id)
            if quiz.password and quiz.password != password:
                return Response({'error': 'Incorrect password'}, status=status.HTTP_403_FORBIDDEN)

            user_quiz, created = UserQuiz.objects.get_or_create(user=request.user, quiz=quiz)

            if created:
                return Response({'message': 'Successfully joined the quiz'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Already joined this quiz'}, status=status.HTTP_200_OK)
        except Quiz.DoesNotExist:
            return Response({'error': 'Quiz not found'}, status=status.HTTP_404_NOT_FOUND)


class CreatedQuizzesView(generics.ListAPIView):
    serializer_class = QuizListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Quiz.objects.filter(creator=self.request.user)


class TakenQuizzesView(generics.ListAPIView):
    serializer_class = QuizListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Assuming there's a model to track taken quizzes
        taken_quizzes = UserQuiz.objects.filter(user=self.request.user).values_list('quiz', flat=True)
        return Quiz.objects.filter(id__in=taken_quizzes)
