# Generated by Django 5.1.4 on 2025-01-20 14:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_stock_current_price_alter_stock_symbol_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stock',
            name='symbol',
            field=models.CharField(max_length=10),
        ),
    ]
