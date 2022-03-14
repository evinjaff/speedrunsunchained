from mimetypes import init
from .models import Game
from .forms import AddGame

from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse, reverse_lazy
from django.views import generic
from django.utils import timezone
from django.views.generic.edit import FormView, CreateView, DeleteView, UpdateView

from .models import Challenge, Game


class IndexView(generic.ListView):
    template_name = 'polls/index.html'
    context_object_name = 'latest_Game_list'

    def get_queryset(self):
        """
        Return the last 20 published Games (not including those set to be
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

class GameCreateView(CreateView):
    model = Game
    fields = [
    'game_title',
	'year_published',
	'console',
	'genre', 
	'ROM', 
	'tagblob'
    ]

    def get_initial(self, *args, **kwargs):
        initial = super().get_initial(**kwargs)
        initial['game_title'] = 'Enter Game Title'
        return initial

    def form_valid(self, form):
        print('form_valid called')
        form.instance.user = self.request.user
        return super(GameCreateView, self).form_valid(form)

    def form_invalid(self, form):
        print('form_invalid called')
        response = super().form_invalid(form)
        return super(GameCreateView, self).form_invalid(form)


class ChallengeCreateView(CreateView):
    model = Challenge
    fields = [
    'game',
	'challenge_title',
	'challenge_description',
	'difficulty', 
    'game_sub_id'
    ]

    def get_initial(self, *args, **kwargs):
        initial = super().get_initial(**kwargs)
        initial['challenge_title'] = 'Enter Game Title'
        return initial

    def form_valid(self, form):
        print('form_valid called')
        form.instance.user = self.request.user
        return super(ChallengeCreateView, self).form_valid(form)

    def form_invalid(self, form):
        print('form_invalid called')
        response = super().form_invalid(form)
        return super(ChallengeCreateView, self).form_invalid(form)




class ChallengeView(generic.DetailView):
    model = Challenge
    template_name = 'polls/challenge.html'

    def get_queryset(self):
        return Challenge.objects

    def custom_page(request, pk, chal):
        #use in view func or pass to template via context
        print("pk {} chal: {}".format(pk, chal))
        print("request {}".format(request))
        queried = Challenge.objects.filter(game_id=pk).filter(game_sub_id=chal)
        print(queried)
        context = {"gameid": pk, "challengeid": chal, "challenge": queried[0]}
        return render(request, 'polls/challenge.html', context=context)


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

def vote_chal(request, Challenge_id):
    return HttpResponseRedirect(reverse('challenge:results', args=(Challenge.id,)))
