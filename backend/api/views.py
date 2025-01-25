from django.shortcuts import render

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView

from rest_framework import generics , status, serializers
from .serializers import UserSerializer, StockEntrySerializer, WatchlistSerializer

from rest_framework.response import Response
from django.http import JsonResponse

from django.contrib.auth.models import User 
from .models import Stock, Watchlist
import yfinance as yf
import requests, logging

logger = logging.getLogger(__name__)

#create class based view which allows us to to implement creating a new user (registration form)
class CreateUserView(generics.CreateAPIView):  #generic view built into django 
    queryset = User.objects.all() 
    serializer_class = UserSerializer #tells the view what kind data we need to accept to create new user (user, pw)
    permission_classes = [AllowAny] #specifies who can call this (anyone, even unauthenticated)s



def get_stock(request): 
    ticker = request.GET.get("ticker")
    if not ticker:
        return JsonResponse({"error": "Ticker parameter is required" }, status = 400)
    
    stock = yf.Ticker(ticker)
    try: 
        data = stock.info
        if not data or "longName" not in data: 
            raise ValueError ("Ticker not found")
        return JsonResponse({
            "name": data.get("longName"),
            "ticker": ticker.upper(),
            "price": data.get("currentPrice"),
            "marketCap": data.get("marketCap"),
        })
    except Exception: 
        return JsonResponse({
            "error": f"{ticker} is not a valid ticker"
        }, status = 400)#
    

    
class WatchlistCreate(generics.ListCreateAPIView):
    serializer_class = WatchlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user #gets all watchlists under user
        return Watchlist.objects.filter(user=user)
    
    def perform_create(self,serializer): #create new watchlist 
        if serializer.is_valid():
            serializer.save(user = self.request.user) #makes new version of watchlist. author must be passed in bc it was set as read_only in serializer
        else: 
            print(serializer.errors)

class WatchlistDelete(generics.DestroyAPIView):
    serializer_class = WatchlistSerializer 
    permission_classes = [IsAuthenticated]

    def get_queryset(self): #gets valid notes that can be deleted (only user's notes)
        user = self.request.user
        return Watchlist.objects.filter(user=user)
    
   
class StockEntryCreate(generics.ListCreateAPIView):
    serializer_class = StockEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        watchlist_id = self.kwargs.get('watchlist_id')
        return Stock.objects.filter(watchlists__id=watchlist_id, watchlists__user=self.request.user)

    def perform_create(self, serializer):
        watchlist_id = self.kwargs.get('watchlist_id')
        symbol = self.request.data.get('symbol')
        name = self.request.data.get('name')
        current_price = self.request.data.get('current_price')

        logging.info(f"Received data: {self.request.data}")
        logging.info(f"watchlist_id: {watchlist_id}, symbol: {symbol}, name: {name}, current_price: {current_price}")

        try:
            watchlist = Watchlist.objects.get(id=watchlist_id, user=self.request.user)
            serializer.save(
                watchlists=[watchlist],
                symbol=symbol,
                name=name,
                current_price=current_price,
            )
        except Watchlist.DoesNotExist:
            raise serializers.ValidationError({"error": "Watchlist not found"})

 

class StockEntryDelete(generics.DestroyAPIView):
    serializer_class = StockEntrySerializer
    permission_classes =[IsAuthenticated]

    def get_queryset(self):
        watch_id = self.kwargs.get('watchlist_id')
        return Stock.objects.filter(watchlists__id = watch_id, watchlists__user = self.request.user)