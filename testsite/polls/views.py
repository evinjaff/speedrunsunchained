from .models import Game

from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views import generic
from django.utils import timezone

from .models import Challenge, Game


class IndexView(generic.ListView):
    template_name = 'polls/index.html'
    context_object_name = 'latest_Game_list'

    def get_queryset(self):
        """
        Return the last five published Games (not including those set to be
        published in the future).
        """
        return Game.objects.filter(
            pub_date__lte=timezone.now()
        ).order_by('-pub_date')[:20]


class DetailView(generic.DetailView):
    model = Game
    template_name = 'polls/detail.html'

    def get_queryset(self):
        """
        Excludes any Games that aren't published yet.
        """
        return Game.objects.filter(pub_date__lte=timezone.now())


class ResultsView(generic.DetailView):
    model = Game
    template_name = 'polls/results.html'

def vote(request, Game_id):
    Game = get_object_or_404(Game, pk=Game_id)
    try:
        selected_Challenges = Game.Challenges_set.get(pk=request.POST['Challenges'])
    except (KeyError, Challenges.DoesNotExist):
        # Redisplay the Game voting form.
        return render(request, 'polls/detail.html', {
            'Game': Game,
            'error_message': "You didn't select a Challenges.",
        })
    else:
        selected_Challenges.votes += 1
        selected_Challenges.save()
        # Always return an HttpResponseRedirect after successfully dealing
        # with POST data. This prevents data from being posted twice if a
        # user hits the Back button.
        return HttpResponseRedirect(reverse('polls:results', args=(Game.id,)))
