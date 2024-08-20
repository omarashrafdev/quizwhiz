import random
import string
from django.utils import timezone
from datetime import timedelta

def generate_invitation_code():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=8))

def default_expiration():
    return timezone.now() + timedelta(days=7)