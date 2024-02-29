from django.shortcuts import render
import csv
import io
import json

# Create your views here.
def homepage_view(request):
    if request.method == "POST":
        telemetry_form = request.FILES.get('telemetry_data')
        status_form = request.FILES.get('status_data')

        telemetry_data = load_csv(telemetry_form)
        status_data = load_csv(status_form)
        ########## what to measure ###########
        ### latency
        ### LTE cells switching
        ### intervals between receiving next data on server
        ### 


        context = {
           
        }

        return render(request, "index.html", context)

    if request.method == "GET":
        context = {

        }

        return render(request, "index.html", context)

def load_csv(csv_file):
    if csv_file is not None:
        csv_text = csv_file.read().decode('utf-8')

        data_reader = csv.DictReader(io.StringIO(csv_text))
        
        data = []
        
        for row in data_reader:
            # all columns
            data_row = {}
            for column, value in row.items():
                data_row[column] = value
            data.append(data_row)

        json_data = json.dumps(data)

        return json_data