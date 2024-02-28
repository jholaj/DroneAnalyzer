from django.shortcuts import render

# Create your views here.
def homepage_view(request):
    if request.method == "POST":
        telemetry_data = request.FILES.get('telemetry_data')
        status_data = request.FILES.get('status_data')

        context = {
           
        }

        return render(request, "index.html", context)

    if request.method == "GET":
        context = {

        }

        return render(request, "index.html", context)