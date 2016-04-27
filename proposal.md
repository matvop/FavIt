# PyCamZ

## Functionality:
    The PyCamZ web-app will provide user with a secure web interface to
    add, remove, monitor, record/playback network/IP camera(s).

## Technical Components:
+ Database(s)
  * Required to store web user login info, store camera url(s), camera login info, video/images with search-able string
+ Django
  * Use to communicate input from the user into the database
+ Python
  * Use to record full motion video from camera(s) and/or save snapshots on an interval or click.
  * Generate 5 minute clips instead of long massive files
  * Generate search-able string to store with media in database(date/time)
+ HTML5
  * Use to playback video files
+ JavaScript
  * To enlarge low resolution MJPEG stream(s) to full/higher resolution streams (pop-up and pause main page streams)
+ HTML/CSS and/or JavaScript
  * Prompt user for login and password
  * Configuration settings for camera's network info(i.e. IP, user name, password, ports).
  * Interface to monitor video streams and edit configuration settings, as well as search for recordings.

## Timeline:
1. Writing the Python module to record the camera(s). - primary focus until solved
1. Provide user with ability to search/view recorded video. - secondary since full motion video rec/play may not be possible(snapshots are a fall-back)
1. Build a database solution to store and retrieve video/images along with configuration settings.
1. Develop a user interface using HTML, CSS, and JavaScript will follow once the above tasks have been completed.
