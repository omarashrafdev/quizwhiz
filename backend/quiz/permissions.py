from rest_framework import permissions
from .models import Quiz, Question

class IsCreator(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Quiz):
            return obj.creator == request.user
        if isinstance(obj, Question):
            return obj.quiz.creator == request.user
        if hasattr(obj, 'question'):
            return obj.question.quiz.creator == request.user
        return False

    def has_permission(self, request, view):
        quiz_id = view.kwargs.get('quiz_id')
        question_id = view.kwargs.get('question_id')

        if quiz_id:
            quiz = Quiz.objects.get(id=quiz_id)
            return quiz.creator == request.user
        elif question_id:
            question = Question.objects.get(id=question_id)
            return question.quiz.creator == request.user

        return True
