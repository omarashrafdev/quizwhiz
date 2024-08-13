import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from .choices import question_type, quiz_state


class CustomUser(AbstractUser):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']

    def __str__(self):
        return self.email


class Quiz(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) 
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    password = models.CharField(max_length=50, blank=True, null=True)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    start_time = models.DateTimeField(null=True, blank=True)
    duration = models.DurationField(null=True, blank=True)

    def __str__(self):
        return self.title


class Question(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
    content = models.TextField()
    type = models.CharField(max_length=9, choices=question_type)
    correct_choice = models.ForeignKey('Choice', on_delete=models.CASCADE, related_name='correct_choice', null=True, blank=True)

    def __str__(self):
        return self.content


class Choice(models.Model):
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    content = models.TextField()

    def __str__(self):
        return self.content


class QuizSubmission(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) 
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    joined_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)
    end_at = models.DateTimeField(null=True, blank=True)
    time_spent = models.IntegerField(null=True, blank=True)

    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    score_before_regrade = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    state = models.CharField(choices=quiz_state, max_length=14)
    has_seen_results = models.BooleanField(null=True, blank=True)

    def __str__(self):
        return f"[{self.state}] {self.quiz.title} - {self.user.email} ({self.score})"
    

class Answer(models.Model):
    submission = models.ForeignKey(QuizSubmission, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE)
    is_correct = models.BooleanField(null=True, blank=True)

    def __str__(self):
        return f"{self.submission.user.email} - {self.submission.quiz.title} - {self.question.content}"
    