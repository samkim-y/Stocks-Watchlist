from django.urls import path
from . import views 



urlpatterns = [
    path('getstock/', views.get_stock, name ='get_stock'),
    path('watchlist/<int:watchlist_id>/stocks/',views.StockEntryCreate.as_view(), name = 'add-stock'),
    path('watchlist/<int:watchlist_id>/stocks/delete/<int:pk>/',views.StockEntryDelete.as_view(), name ='delete-stock'),
    path('watchlist/', views.WatchlistCreate.as_view(), name = 'watchlist'),
    path('watchlist/delete/<int:pk>/', views.WatchlistDelete.as_view(), name = 'watchlist-delete'),
]