# Generated by Django 3.2.5 on 2022-03-28 02:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0017_game_publisher'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='game',
            name='franchise',
        ),
    ]