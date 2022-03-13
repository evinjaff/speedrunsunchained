from django import forms

class AddGame(forms.Form):
    game_title = forms.CharField(max_length=100)
    pub_date = forms.DateTimeField()
    year_published = forms.CharField(max_length=5)
    console = forms.CharField(max_length=100)
    genre = forms.CharField(max_length=100)
    tagblob = forms.CharField(required=False, widget=forms.Textarea)