from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import csv
import io
import json

##################################
##### AUTHOR: JAROSLAV HOLAJ #####
#####   TIME SPENT: 7h 30m   #####
##################################

# Create your views here.
@csrf_exempt
def homepage_view(request):
    if request.method == "POST":
        telemetry_form = request.FILES.get('telemetry_data')
        status_form = request.FILES.get('status_data')

        if not any([telemetry_form, status_form]):
            return JsonResponse({'error': "Please upload both telemetry and status data."}, status=400)

        try:
            telemetry_data = load_csv(telemetry_form)
            status_data = load_csv(status_form)

            longitude_latitude_data = [{'longitude': entry['longitude'], 'latitude': entry['latitude'], 'time': entry['time']} for entry in telemetry_data]
            
            return JsonResponse({'longitude_latitude_data': longitude_latitude_data})
        except Exception as e:
            return JsonResponse({'error': f"Error processing data: {str(e)}"}, status=500)

    return render(request, "index.html", {})
        ########## what to measure ###########
        ## add map
        ### time
        ### latitude
        ### longtitude

        ## basic info
        ### altitude (x - time, y - altitude) + geo_altitude
        ### height
        ### pressure
        ### battery voltage
        ### LTE cells switching

        ## accuracy
        ### horizontal accuracy (x - time, y - horizontal accuracy)
        ### vertical accuracy (x - time, y - vertical accuracy)
        ### speed accuracy
        ### 

        ## signal strength
        ### latency
        ### intervals between receiving next data on server
        ### strength of signal (x - time, y - RSRP)
        ### number of satellites (x - time, y - number of satellites)
        ### quality of signal (x - time, y - RSRQ)
        ### noise ratio (x - time, y - SNR)

    if request.method == "GET":
        context = {

        }

        return render(request, "index.html", context)

def load_csv(csv_file):
    if csv_file is not None:
        csv_text = csv_file.read().decode('utf-8')

        data_reader = csv.DictReader(io.StringIO(csv_text))
        
        data = [row for row in data_reader]

        return data