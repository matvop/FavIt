# PyCamZ

## Functionality:
    The PyCamZ web-app will provide user with a web interface to access, add,
    remove, monitor public or private network/IP camera(s). Will include the
    ability to take snapshots at a specified interval for a specified duration
    and then combine the images into a time-lapse video upon completion. User
    can choose to playback in browser and/or download.

## Technical Components:
+ Database(s)
  * Required to store web user login info, store camera url(s), camera login info, video/images with search-able string
+ Django
  * Use to communicate input from the user into the database
+ Python
  * Save snapshots on a specified interval
  * Combine images to create time-lapse video.
  * Generate search-able string to store with media in database(date/time)
+ HTML5
  * Use to playback video files
+ JavaScript
  * To enlarge low resolution MJPEG stream(s) to full/higher resolution streams (pop-up and pause main page streams)
+ HTML/CSS and/or JavaScript
  * Prompt user for login and password
  * Configuration settings for camera's network info(i.e. IP, user name, password, ports).
  * Interface to monitor video streams and edit configuration settings, as well as search for recordings.
+ Front-End Structure
  * Main page
    * Provide User with Navigation Options
      * Monitor Cameras
        * Video streams with nav bar
      * Manage Cameras
        * Add Camera
          * Pop-up window
            * Enter camera url(IP/Hostname with Port)
            * Enter username
            * Enter password
            * Option to enable snapshots for time-lapse
            * Select from pre-defined snapshot intervals
            * Enter duration of time-lapse (or select from pre-defined options)
            * Option to cancel/go back
        * Edit Camera
          * Pop-up window
            * Enter camera url(IP/Hostname with Port)
            * Enter username
            * Enter password
            * Option to enable snapshots for time-lapse
            * Select from pre-defined snapshot intervals
            * Enter duration of time-lapse (or select from pre-defined options)
            * Option to remove camera
            * Option to cancel/go back
        * Exit/Go back
      * Playback
        * Provide user with list of completed time-lapse videos
          * Pop-up window on thumbnail click
            * Automatically start playing associated video
            * Option to download video
            * Option to delete video
            * Option to cancel/go back
      * Exit/Go back

## Timeline:
1. Writing the Python module to record and store snapshots and combine into video. - primary focus until solved
1. Provide user with ability to view recorded video.
1. Build a database solution to store and retrieve video/images along with configuration settings.
1. Develop a user interface using HTML, CSS, and JavaScript will follow once the above tasks have been completed.
