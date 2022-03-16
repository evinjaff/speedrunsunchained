from email.policy import default
from time import timezone
from django import forms

from django.utils import timezone

class AddGame(forms.Form):
    game_title = forms.CharField(max_length=100)
    pub_date = forms.DateTimeField()
    year_published = forms.CharField(max_length=5)
    console = forms.CharField(max_length=100)
    genre = forms.CharField(max_length=100)
    tagblob = forms.CharField(required=False, widget=forms.Textarea)


class AddChallenge(forms.Form):
    game_title = forms.CharField(max_length=100)
    pub_date = forms.DateTimeField()
    year_published = forms.CharField(max_length=5)
    console = forms.CharField(max_length=100)
    genre = forms.CharField(max_length=100)
    tagblob = forms.CharField(required=False, widget=forms.Textarea)