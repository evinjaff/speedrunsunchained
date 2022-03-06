from django.contrib import admin

from .models import Challenges, Game


class ChallengesInline(admin.StackedInline):
    model = Challenges
    extra = 3


class GameAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,               {'fields': ['game_title', 'year_published', 'console', 'genre', 'ROM', 'tagblob']}),
        ('Date information', {'fields': ['pub_date'], 'classes': ['collapse']}),
    ]
    inlines = [ChallengesInline]

admin.site.register(Game, GameAdmin)