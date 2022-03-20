# Generated by Django 4.0.2 on 2022-03-17 07:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0012_alter_game_rom_alter_game_pub_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='challenge',
            name='duration',
            field=models.CharField(default='N/A', max_length=20),
        ),
        migrations.AlterField(
            model_name='game',
            name='genre',
            field=models.CharField(default='N/A', max_length=100),
        ),
        migrations.AlterField(
            model_name='game',
            name='year_published',
            field=models.CharField(default=0, max_length=5),
        ),
    ]