from datetime import timedelta
from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Answer, Choice, CustomUser, Question, Quiz, QuizSubmission


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('id', 'name', 'email', 'username', 'password')

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            name=validated_data['name'],
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['name'] = user.name
        token['email'] = user.email
        token['username'] = user.username
        return token


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'name', 'email', 'username')
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        instance.save()
        return instance


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'content']

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'quiz', 'content', 'type', 'correct_choice', 'choices']
        read_only_fields = ['quiz']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'password', 'creator', 'start_time', 'duration', 'questions']
        read_only_fields = ['creator']

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        validated_data['creator'] = user
        return super().create(validated_data)

class QuizListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'start_time', 'duration']


class QuizSubmissionSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    quiz = QuizSerializer(read_only=True)

    class Meta:
        model = QuizSubmission
        fields = ['id', 'user', 'quiz', 'quiz_title', 'joined_at', 'score', 'score_before_regrade', 'state', 'has_seen_results', 'started_at', 'finished_at', 'end_at', 'time_spent']
        read_only_fields = ['user', 'joined_at', 'time_spent']


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['submission', 'question', 'choice', 'is_correct']

    def create(self, validated_data):
        # Remove 'user' from validated_data if it exists
        validated_data.pop('user', None)
        return Answer.objects.create(**validated_data)


class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        exclude = ['correct_choice']