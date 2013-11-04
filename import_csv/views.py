from django.http import HttpResponse
from django.shortcuts import render
from import_csv.models import MyCSvModel

DEMO_MAPPING = 'resource_files/demo_mapping.txt'


def get_csv(request):
    csv_list = MyCSvModel.import_data(data=open(DEMO_MAPPING))
    first_line = csv_list[4]

    response = HttpResponse(content_type='text/html')
    # response['Content-Disposition'] = 'attachment; filename="somefilename.csv"'
    # writer = csv.writer(response)

    # with open(DEMO_MAPPING) as f:
    #     reader = csv.reader(f)
    #     for row in reader:
    #         writer.writerow(row)
    #         _, created = DataSource.objects.get_or_create(
    #             id=row[0],
    #             age_groups=row[1],
    #         )

    response.content = first_line.mapped_age_groups

    # return response
    # return render(request, 'import_csv/csv.html', {'csv_list': csv_list})
    return render(request, 'import_csv/csv.html')
