from django.contrib import admin
from .models import Quiz, Question, Choice, QuizSubmission

admin.site.register(Quiz)
admin.site.register(QuizSubmission)
admin.site.register(Question)
admin.site.register(Choice)