from django.db import models

# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=150)
    price = models.FloatField()
    description = models.TextField()
    count = models.IntegerField()
    is_active = models.BooleanField(max_length=150)

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'description': self.description,
            'count': self.count,
            'category': self.category,
            'is_active': self.is_active 
        }
    
    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = 'Single'
        verbose_name_plural = 'Plural'

class Category(models.Model):
    name = models.CharField(max_length=150)
    def to_json(self):
        return {
            'id': self.id,
            'name': self.name
        }
    
    def __str__(self):
        return self.title