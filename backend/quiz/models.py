from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.db import models
from django.conf import settings
from .choices import question_type
from .utils import default_expiration, generate_invitation_code


class CustomUser(AbstractUser):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']

    def __str__(self):
        return self.email


class Quiz(models.Model):
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


class UserQuiz(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    completed = models.BooleanField(default=False)
    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.quiz.title}"
    

class QuizInvitation(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    code = models.CharField(max_length=8, unique=True, default=generate_invitation_code)
    expires_at = models.DateTimeField(default=default_expiration)
    max_joins = models.IntegerField(default=1)
    join_count = models.IntegerField(default=0)

    def is_valid(self):
        return self.join_count < self.max_joins and timezone.now() < self.expires_at

    def __str__(self):
        return f"{self.quiz.title} - {self.code}"