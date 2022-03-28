# Generated by Django 4.0.2 on 2022-03-27 18:43

from django.db import migrations, models
import polls.models


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0015_comment_tripcode'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='franchise',
            field=models.CharField(default='Unknown', max_length=200),
        ),
        migrations.AlterField(
            model_name='game',
            name='ROM',
            field=models.FileField(default='Hello.txt', null=True, upload_to=polls.models.get_upload_file_name),
        ),
    ]
