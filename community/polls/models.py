from email.policy import default
from pyexpat import model
from django.db import models
import datetime

from django.utils import timezone

from django.urls import reverse, reverse_lazy

from time import time

def get_upload_file_name(instance, filename):
    return "uploaded_files/%s_%s" % (str(time()).replace('.','_'), filename)

# This will be the game submitted
class Game(models.Model):
	game_title = models.CharField(max_length=100)
	pub_date = models.DateTimeField('date published', default=timezone.now)
	year_published = models.CharField(default=0,max_length=5)
	console = models.CharField(default="N/A", max_length=100)
	genre = models.CharField(default="N/A", max_length=100)
	ROM = models.FileField(upload_to=get_upload_file_name, null=True, default="Hello.txt")
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
	duration = models.CharField(default="N/A", max_length=20)
	commentblob = models.TextField(default="Automod; 'Remember, no hate '\n Automod: 'Remember, be on-topic' ", max_length=400)

	


	file = models.FileField(upload_to=get_upload_file_name, null=True, blank=True)
	
	def get_absolute_url(self):
		print("called get_absolute_url")
		print('pk: {} chal: {}'.format(self.pk, self.chal))
		return reverse('polls:challenge-add', kwargs={'pk': self.pk, 'chal': self.game_sub_id})

	def __str__(self):
		return '{}: {}'.format(self.game.game_title, self.challenge_title)

	def has_negative_upvotes(self):
		return self.downvotes > self.upvotes

#Python model for comments on each speedrun challenge. Should link to foreign key and have stuff going on
class Comment(models.Model):
	challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)

	# INSERT INTO  polls_comment ( upvotes, downvotes, challenge_id, commentblob, tripcode) VALUES ( 20, 10, 4, "hello", "Hello")

	upvotes = models.IntegerField(default=0)
	downvotes = models.IntegerField(default=0)

	tripcode = models.CharField(max_length=50, default="0")

	commentblob = models.TextField(max_length=500)



	