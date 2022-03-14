from django.urls import path

from . import views

app_name = 'polls'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('addgame/', views.GameCreateView.as_view(), name='game-add'),
    path('<int:pk>/', views.DetailView.as_view(), name='detail'),
    path('<int:pk>/results/', views.ResultsView.as_view(), name='results'),
    path('<int:question_id>/vote/', views.vote, name='vote'),
    path('<int:pk>/challenges/<int:chal>', views.ChallengeView.custom_page, name='custom_page'),
    path('<int:pk>/add_chal', views.ChallengeCreateView.as_view(), name='custom_chal_page'),
    path('<int:pk>/challenges/<int:chal>/vote_chal', views.vote_chal, name='vote_chal'),
]