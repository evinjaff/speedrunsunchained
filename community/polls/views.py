from enum import unique
from mimetypes import init
from .models import Game
from .forms import AddGame

from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse, reverse_lazy
from django.views import generic
from django.utils import timezone
from django.views.generic.edit import FormView, CreateView, DeleteView, UpdateView

from .models import Challenge, Game, Comment


class IndexView(generic.ListView):

    # Potential solution to the for loop problem:
    # https://stackoverflow.com/questions/2466496/select-distinct-values-from-a-table-field
    template_name = 'polls/frontpage.html'
    context_object_name = 'latest_Game_list'

    def get_context_data(self,*args, **kwargs):
        context = super().get_context_data(*args,**kwargs)

        # Incoming jank code to make a set of types

        genre_set = set()
        console_set = set()

        # print()

        for game in Game.objects.filter():
            genre_set.add(game.genre)
            console_set.add(game.console)

        context['genre_set'] = genre_set
        context['console_set'] = console_set
        
        
        return context

    def get_queryset(self):
        """
        Return the last 200 published Games (not including those set to be
        published in the future).
        """
        return Game.objects.filter(
            pub_date__lte=timezone.now()
        ).order_by('-pub_date')[:20]

class GameSearchView(generic.ListView):
    template_name = 'polls/search.html'
    context_object_name = 'latest_Game_list'

    def get_context_data(self,*args, **kwargs):
        context = super().get_context_data(*args,**kwargs)

        # Incoming jank code to make a set of types

        genre_set = set()
        console_set = set()

        # print()

        for game in Game.objects.filter():
            genre_set.add(game.genre)
            console_set.add(game.console)

        context['genre_set'] = genre_set
        context['console_set'] = console_set
        
        return context

    

    def get_queryset(self):
        """
        Return the last 200 published Queried games (with the string).
        """
        print(self.__dict__.keys())

        print(self.kwargs)

        print(self.request.GET)

        print(self.request.GET['genre'])

        print(self.request.GET['console'])
        # Don't filter
        if self.request.GET['genre'] == "None_Selected" and self.request.GET['console'] == "None_Selected":
            return Game.objects.filter(
            pub_date__lte=timezone.now(), game_title__contains=self.kwargs['search_string'],
        ).order_by('-pub_date')[:200]

        #Filter just genre
        elif self.request.GET['genre'] != "None_Selected":
             return Game.objects.filter(
            pub_date__lte=timezone.now(), game_title__contains=self.kwargs['search_string'],
            genre=self.request.GET['genre']
        ).order_by('-pub_date')[:200]

        # Filter just console
        elif self.request.GET['console'] != "None_Selected":
            return Game.objects.filter(
            pub_date__lte=timezone.now(), game_title__contains=self.kwargs['search_string'],
            console=self.request.GET['console']
        ).order_by('-pub_date')[:200]

        # Filter Both
        else:
            return Game.objects.filter(
            pub_date__lte=timezone.now(), game_title__contains=self.kwargs['search_string'],
            console=self.request.GET['console'], genre=self.request.GET['genre']
        ).order_by('-pub_date')[:200]

       




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
        print('get_initial called')
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
	'challenge_title',
	'challenge_description',
	'difficulty'
    ]

    pk = 1

    unique_challenge_id = 1

    def get_success_url(self):
         print('get_success_url called')
         return reverse('polls:challenge-add', kwargs={'pk': self.pk, 'chal': self.unique_challenge_id})

    def get_initial(self, *args, **kwargs):
        print('get_initial called')
        print(self.kwargs)

        self.pk = self.kwargs['pk']

        initial = super().get_initial(**kwargs)
        initial['challenge_title'] = 'Enter Game Title'
        return initial

    def form_valid(self, form):
        print('form_valid called')

        print(Challenge.objects.filter(game_id=self.pk))

        form.instance.game_id = self.pk

        # self.pk = Game.objects.filter(game_title=form.instance.game.game_title)[0].id

        self.unique_challenge_id = len(Challenge.objects.filter(game=self.pk)) + 1

        print("pk {} chal: {}".format(self.pk, self.unique_challenge_id))

        form.instance.game_sub_id = self.unique_challenge_id

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
        # print("pk {} chal: {}".format(pk, chal))
        # print("request {}".format(request))
        queried = Challenge.objects.filter(game_id=pk).filter(game_sub_id=chal)

        # get the raw challenge id
        #print("challenge_id: ", queried[0].id)

        queried_comments = Comment.objects.filter(challenge=queried[0].id)

        print(queried_comments)



        
        
        # print(queried)
        context = {"gameid": pk, "challengeid": chal, "challenge": queried[0], "comments": queried_comments}
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
