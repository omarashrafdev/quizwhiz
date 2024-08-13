from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Choice, CustomUser, Question, Quiz, QuizSubmission
from .serializers import AnswerSerializer, ChoiceSerializer, QuestionSerializer, QuizListSerializer, RegisterSerializer, CustomTokenObtainPairSerializer, QuizSubmissionSerializer, UserSerializer, QuizSerializer
from .permissions import IsCreator


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
    permission_classes = [permissions.IsAuthenticated, IsCreator]

    def get_queryset(self):
        return Quiz.objects.filter(creator=self.request.user)

class QuestionView(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated, IsCreator]

    def get_queryset(self):
        quiz_id = self.kwargs['quiz_id']
        return Question.objects.filter(quiz__id=quiz_id, quiz__creator=self.request.user)

    def perform_create(self, serializer):
        quiz_id = self.kwargs['quiz_id']
        quiz = Quiz.objects.get(id=quiz_id, creator=self.request.user)
        serializer.save(quiz=quiz)

class QuestionDetailsView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated, IsCreator]

    def get_queryset(self):
        quiz_id = self.kwargs['quiz_id']
        return Question.objects.filter(quiz__id=quiz_id, quiz__creator=self.request.user)

class ChoiceView(generics.ListCreateAPIView):
    serializer_class = ChoiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsCreator]

    def get_queryset(self):
        question_id = self.kwargs['question_id']
        return Choice.objects.filter(question__id=question_id)

    def perform_create(self, serializer):
        question_id = self.kwargs['question_id']
        question = Question.objects.get(id=question_id)
        serializer.save(question=question)


class ChoiceDetailsView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsCreator]

    def get_queryset(self):
        question_id = self.kwargs['question_id']
        return Choice.objects.filter(question__id=question_id, question__quiz__creator=self.request.user)


class JoinQuizView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(id=quiz_id)

            if quiz.password:
                password = request.data.get('password')
                print(password)
                if not password:
                    return Response({'error': 'Quiz password is required'}, status=status.HTTP_403_FORBIDDEN)
                if quiz.password != password:
                    return Response({'error': 'Invalid password'}, status=status.HTTP_403_FORBIDDEN)

            quiz_submission, created = QuizSubmission.objects.get_or_create(user=request.user, quiz=quiz)
            if created:
                return Response({'message': 'Successfully joined the quiz'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Already joined this quiz'}, status=status.HTTP_200_OK)
        except Quiz.DoesNotExist:
            return Response({'error': 'Invalid invitation link'}, status=status.HTTP_404_NOT_FOUND)


class QuizSubmissionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, quiz_id, submission_id):
        try:
            submission = QuizSubmission.objects.get(id=submission_id, quiz=quiz_id, user=request.user)
        except QuizSubmission.DoesNotExist:
            return Response({'error': 'You have not joined this quiz or invalid link.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            question = Question.objects.get(id=request.data.get('question'), quiz=quiz_id)
        except Question.DoesNotExist:
            return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            choice = Choice.objects.get(id=request.data.get('choice'), question=question)
        except Choice.DoesNotExist:
            return Response({'error': 'Choice not found'}, status=status.HTTP_404_NOT_FOUND)

        answer_data = {
            'submission': submission.id,
            'question': question.id,
            'choice': choice.id,
        }

        serializer = AnswerSerializer(data=answer_data, context={'request': request})
        if serializer.is_valid():
            answer_instance = serializer.save()
            # Check if the answer is correct for MCQs
            if question.type == 'MCQ' and answer_instance.choice == str(question.correct_choice.id):
                answer_instance.is_correct = True
            else:
                answer_instance.is_correct = False
            answer_instance.save()

            return Response({'message': 'Submitted successfully', 'is_correct': answer_instance.is_correct}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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
        taken_quizzes = QuizSubmission.objects.filter(user=self.request.user).values_list('quiz', flat=True)
        return Quiz.objects.filter(id__in=taken_quizzes)



class QuizSubmissionGetView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = QuizSubmissionSerializer

    def get_queryset(self):
        user = self.request.user
        created_quizzes = Quiz.objects.filter(creator=user)
        participated_quizzes = QuizSubmission.objects.filter(user=user)
        return {
            'created': created_quizzes,
            'participated': participated_quizzes
        }

    def list(self, request, *args, **kwargs):
        response = {}
        created_quizzes = self.get_queryset()['created']
        participated_quizzes = self.get_queryset()['participated']

        response['created'] = QuizSerializer(created_quizzes, many=True).data
        response['participated'] = QuizSubmissionSerializer(participated_quizzes, many=True).data

        return Response(response)