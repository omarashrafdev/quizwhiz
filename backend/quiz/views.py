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


class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)


class QuizCreateView(generics.CreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]


class QuizJoinView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        id = request.data.get('id')
        password = request.data.get('password')
        try:
            quiz = Quiz.objects.get(id=id)
            if quiz.password and quiz.password != password:
                return Response({'error': 'Incorrect password'}, status=status.HTTP_403_FORBIDDEN)
            # Logic for adding the user to the quiz participants
            return Response({'message': 'Successfully joined the quiz'}, status=status.HTTP_200_OK)
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


class QuizDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Quiz.objects.filter(creator=self.request.user)
