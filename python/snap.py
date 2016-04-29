import urllib.request
import requests
from requests.auth import HTTPBasicAuth
import datetime
import os

# use the method below to retrieve recorded byte file and playback
# in place of the stream url
# '.cgi?date=1&clock=1&resolution=[640]x[360]'
# stream = urllib.request.urlopen('http://50.73.56.89/axis-cgi/mjpg/video.cgi?date=1&clock=1&resolution=640x400&compression=15')
# stream = urllib.request.urlopen('http://esoteric.ddns.net:8181/axis-cgi/mjpg/video.cgi?date=1&clock=1&resolution=640x400&compression=15')

def create_file(date_and_time, project_num):
    directory = ('C:\\Users\\Matt\\capstone\\python\\' + 'project_' +
             project_num + '\\' + str(date_and_time.strftime('%m.%d.%Y')) + '\\')
    if not os.path.exists(directory):
        os.makedirs(directory)
    return directory + str(
           date_and_time.strftime('%H.%M.%S')) + '.jpg'

def take_snapshot(project_num):
    url = 'http://esoteric.ddns.net:8181/axis-cgi/jpg/image.cgi?date=0&clock=0'
    now = datetime.datetime.now()
    file_name = create_file(now, project_num)
    with open(file_name, 'wb') as image:
            response = requests.get(url, auth=('sudo', '281281'))
            if not response.ok:
                print(response)
            for block in response.iter_content(1024):
                if not block:
                    break
                image.write(block)

project_num = '1'
take_snapshot(project_num)
