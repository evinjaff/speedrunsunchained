# Generated by Django 4.0.2 on 2022-03-12 03:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0007_rename_challenges_challenge'),
    ]

    operations = [
        migrations.AddField(
            model_name='challenge',
            name='difficulty',
            field=models.IntegerField(default=0),
        ),
    ]
