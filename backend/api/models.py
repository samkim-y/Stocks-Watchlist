from django.db import models
from django.contrib.auth.models import User 
from django.core.exceptions import ValidationError

# Create your models here.


class Stock(models.Model): 
    symbol = models.CharField(max_length=10)
    name = models.CharField(max_length=100)
    current_price = models.FloatField()

    def __str__(self):
        return self.symbol 

class Watchlist(models.Model):
    name = models.CharField(max_length = 100)
    user = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "watchlists")
    stocks = models.ManyToManyField('Stock',  related_name="watchlists", blank = True)

    def __str__(self):
        return f"{self.user.username}'s {self.name} Watchlist"
    
    def clean(self):
        # Ensure no duplicate stock is added to this watchlist
        if self.stocks.count() != len(self.stocks.all()):
            raise ValidationError("A stock can only be added to a watchlist once.")

    def add_stock(self, stock):
        # Check if the stock is already in the watchlist
        if self.stocks.filter(id=stock.id).exists():
            raise ValidationError(f"{stock.name} is already in the watchlist!")
        self.stocks.add(stock)
    
    class Meta: 
        unique_together = ('name','user')



    
