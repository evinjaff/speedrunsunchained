# Generated by Django 4.0.2 on 2022-03-06 06:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0002_challenges_game_delete_choice_delete_question_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='console',
            field=models.CharField(default='N/A', max_length=100),
        ),
    ]
