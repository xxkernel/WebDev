from django.shortcuts import render, get_object_or_404
from django.http.response import JsonResponse
from .models import Product, Category

# Create your views here.
def all_products(request):
    products = Product.objects.all()
    products_json = [p.to_json() for p in products]
    # return render(request, 'api/index.html', {'products':products})
    return JsonResponse(products_json, safe = False)

def one_product(request, id):
    product = Product.objects.get(id = id)
    return JsonResponse(product.to_json())

def all_categories(request):
    categories = Category.objects.all()
    categories_json = [c.to_json() for c in categories]
    return JsonResponse(categories_json, safe = False)

def one_category(request, id):
    category = Category.objects.get(id=id)
    return JsonResponse(category.to_json())

def products_by_category(request, category_id):
    category = get_object_or_404(Category,id=category_id)
    products = category.product_set.all()
    data = {'products': list(products.values())}
    return JsonResponse(data)
