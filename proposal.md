# PyLapse

## High-Level Product:
The PyLapse web-app will provide user with a web interface to access, add,
remove, monitor public or private network/IP camera(s). Will include the
ability to take snapshots at a specified interval for a specified duration
and then combine the images into a time-lapse video upon completion. User
can choose to playback in browser and/or download.

## Minimum Viable Product:
Support creating and storing snapshots from videos streams configured by
the user. App will provide the user with a method of displaying stored
snapshots.

## Specific Functionality:
+ Main page
  * Provide User with Navigation Options
    * Monitor Cameras
      * Video streams with nav bar
    * Manage Cameras
      * Add Camera
        * Pop-up window
          * Enable/disable camera stream
          * Select whether camera stream is public or private
          * Enter camera url(IP/Hostname with Port)
          * Enter user-name(grayed out unless private)
          * Enter password(grayed out unless private)
          * Option to enable snapshots for time-lapse
          * Select from predefined snapshot intervals
          * Select/choose day or night time window of time-lapse (or select from predefined options)
          * Select schedule(date calendar)
          * Enter duration of time-lapse (or select from predefined options)
          * Option to cancel/go back
      * Edit Camera
        * Pop-up window
          * Enable/disable camera stream
          * View/edit whether camera stream is public or private
          * View/edit camera url(IP/Hostname with Port)
          * View/edit user-name(grayed out unless private)
          * View/edit password(grayed out unless private)
          * View/edit option to enable/disable snapshots
          * View/edit predefined snapshot intervals
          * View/edit daily duration of time-lapse (or select from predefined options)
          * View/edit schedule(date calendar)
          * Option to remove camera
            * Prompt to delete project directory
          * Option to cancel/go back
    * Playback Video/Display Snapshots
      * View Snapshots:
        * List of project directories sorted by project name
          * List of snapshot directories sorted by record date('%m.%d.%Y')
            * Thumbnails/tiles of snapshot images sorted by time('%H.%M.%S')
              * Thumbnails to open into a 'pop-up' and/or gallery viewing solution using CSS/HTML/JavaScript/JQuery
    * Playback Video:
      * Provide user with list of completed time-lapse videos
        * Pop-up window on snapshot thumbnail click
          * Automatically start playing associated video
          * Option to download video
          * Option to delete video
          * Option to cancel/go back
    * Exit/Go back

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
  * To enlarge low resolution stream(s) to full/higher resolution streams (pop-up and pause main page streams)
+ HTML/CSS and/or JavaScript
  * Configuration settings for camera's network info(i.e. IP, user name, password, ports).
  * Interface to monitor video streams and edit configuration settings, as well as search for recordings.

## Timeline:
1. Writing the Python module to record and store snapshots and combine into video. - primary focus until solved
1. Provide user with ability to view recorded video.
1. Build a database solution to store and retrieve video/images along with configuration settings.
1. Develop a user interface using HTML, CSS, and JavaScript once the above tasks have been completed.
