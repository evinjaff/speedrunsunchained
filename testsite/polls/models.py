from email.policy import default
from pyexpat import model
from django.db import models
import datetime

from django.utils import timezone

from django.urls import reverse

from time import time

def get_upload_file_name(instance, filename):
    return "uploaded_files/%s_%s" % (str(time()).replace('.','_'), filename)

# This will be the game submitted
class Game(models.Model):
	game_title = models.CharField(max_length=100)
	pub_date = models.DateTimeField('date published', default=timezone.now)
	year_published = models.CharField(max_length=5)
	console = models.CharField(default="N/A", max_length=100)
	genre = models.CharField(max_length=100)
	ROM = models.FileField(upload_to=get_upload_file_name, null=True)
	tagblob = models.TextField(default="None", max_length=400)

	def get_absolute_url(self):
		return reverse('polls:detail', kwargs={'pk': self.pk})

	
	def __str__(self):
		return self.game_title

	def was_published_recently(self):
		now = timezone.now()
		return now - datetime.timedelta(days=1) <= self.pub_date <= now


class Challenge(models.Model):
	game = models.ForeignKey(Game, on_delete=models.CASCADE)
	game_sub_id = models.IntegerField(default=1)
	
	challenge_title = models.CharField(max_length=200, default="")
	challenge_description = models.CharField(max_length=5000, default="")
	upvotes = models.IntegerField(default=0)
	downvotes = models.IntegerField(default=0)
	difficulty = models.IntegerField(default=0)
	commentblob = models.TextField(default="Automod; 'Remember, no hate '\n Automod: 'Remember, be on-topic' ", max_length=400)

	


	file = models.FileField(upload_to=get_upload_file_name, null=True, blank=True)
	
	def __str__(self):
		return '{}: {}'.format(self.game.game_title, self.challenge_title)

	def has_negative_upvotes(self):
		return self.downvotes > self.upvotes

	def get_absolute_url(self):
		return reverse('polls:custom_page', kwargs={'pk': self.pk, 'chal': self.chal})