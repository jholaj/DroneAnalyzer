from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import csv
import io
import json
from datetime import datetime
##################################
##### AUTHOR: JAROSLAV HOLAJ #####
#####   TIME SPENT: 17h 00m  #####
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
            ######### BASIC MAP INFO ##############
            ### time        
            ### latitude    
            ### longtitude  
            longitude_latitude_data = [{'longitude': entry['longitude'],
                'latitude': entry['latitude'],
                'time': entry['time']} 
                for entry in telemetry_data]

            # show some basic info?
            print("MAP DATA LOADED...")
            ######## SIGNAL STRENGTH ##############
            ## signal strength
            ### latency
            ### intervals between receiving next data on server
            ### strength of signal (x - time, y - RSRP)
            ### number of satellites (x - time, y - number of satellites)
            ### quality of signal (x - time, y - RSRQ)
            ### noise ratio (x - time, y - SNR)
            ### -------------------
            ### add lte cell id?
            signal_strength_data = []
            for i in range(1, len(status_data)):
                current_entry = status_data[i]
                previous_entry = status_data[i - 1]

                current_time = datetime.strptime(current_entry['time_received'].split('+')[0], '%Y-%m-%d %H:%M:%S.%f')
                previous_time = datetime.strptime(previous_entry['time_received'].split('+')[0], '%Y-%m-%d %H:%M:%S.%f')
                start_time = datetime.strptime(status_data[0]['time_received'].split('+')[0], '%Y-%m-%d %H:%M:%S.%f')

                latency = (current_time - previous_time).total_seconds()
                interval = (current_time - start_time).total_seconds()

                signal_strength_data.append({
                    'latency': latency,
                    'interval': interval,
                    'signal_strength': current_entry['rsrp'],
                    'num_satellites': current_entry['satellites'],
                    'signal_quality': current_entry['rsrq'],
                    'noise_ratio': current_entry['snr'],
                    'time': current_entry['time']
                })
            print("SIGNAL DATA LOADED...")
            ######## ACCURACY ##########
            ## accuracy
            ### horizontal accuracy (x - time, y - horizontal accuracy)
            ### vertical accuracy (x - time, y - vertical accuracy)
            ### speed accuracy
            accuracy_data = [{
                'horizontal_accuracy': entry['horizontal_accuracy'],
                'vertical_accuracy': entry['vertical_accuracy'],
                'speed_accuracy':entry['speed_accuracy'],
                'time': entry['time']} 
                for entry in telemetry_data]

            print("ACCURACY DATA LOADED...")
            ######## BASIC INFO #########
            ### altitude (x - time, y - altitude) + geo_altitude, height
            ### velocity (x,y,z)
            ### pressure
            ### battery voltage
            basic_data = [{
                'time': entry['time'],
                'altitude': entry['altitude'],
                'geo_altitude': entry['geo_altitude'],
                'velocity_x': entry['velocity_x'],
                'velocity_y': entry['velocity_y'],
                'velocity_z': entry['velocity_z'],
                'height': entry['height'],
                'pressure': entry['pressure'],
            } for entry in telemetry_data] 

            battery_data = [{
                'time': entry['time'],
                'battery': entry['battery'],
                'charging': entry['charging']
            } for entry in status_data]

            return JsonResponse(
                    {'longitude_latitude_data': longitude_latitude_data,
                     'accuracy_data':accuracy_data,
                     'signal_strength_data':signal_strength_data,
                     'basic_data':basic_data,
                     'battery_data':battery_data})
        except Exception as e:
            return JsonResponse({'error': f"Error processing data: {str(e)}"}, status=500)

    return render(request, "index.html", {})

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