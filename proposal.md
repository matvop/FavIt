# FavIt

The FavIt web-app will provide users with a web interface to build a shared
gallery of favorite images and videos from around the Internet. Users must be
logged into their account in order to add content. Anonymous users are
allowed to view the landing page, which displays user submitted Favs.
Users can add content from Imgur, Vimeo, and YouTube via URL.

## Specific Functionality:
+ Main page
  * Provide User with Navigation Options and show all user submitted Favs
    * Navigation
      * Register form
      * Login form
        * User Profile
          * All
          * Submit
          * Profile
          * Logout(avail only to logged in users)

## Technical Components:
+ Database
  * Stores user authentication information along with Favs
    * User:
      * username
      * password
    * Fav:
      * username
      * datetime
      * url
      * comment (optional field)
+ Python/Django
  * Use to render and serve HTML to the user
  * Communicate Favs from the user to the database
  * Authenticate user login information in the database
+ JavaScript
  * Dynamically create and load Fav HTML objects using JQuery
  * Communicate with server APIs using AJAX
  * Provide input validation using Regular Expressions
+ CSS
  * Used to provide style and layout for HTML elements
  * Provide a visually appealing method of viewing Favs via pop-up style animations

## MVP Timeline:
1. Determine user input that should be saved for Fav creation
1. Create models to save into the database
1. Write logic to allow users to register and login
1. Write view that renders all the Favs for the user once signed in
1. Create functions in JavaScript using JQuery that dynamically display Fav objects
1. Write CSS that provides a visually appealing method of viewing Favs
1. Integrate Vimeo, YouTube, and Imgur data api's using AJAX for media information(title/descrip) and thumbnail images
1. Break apart JQuery Fav object creation code, so that each media type uses the same function to get an empty Fav object
1. Add magnific-popup form method for registration, login, and Fav input
1. Add docstrings to code with concise descriptions

## Post MVP Features to add/update:
1. Write code that creates a 10-15 second animated GIF from video type media to use as thumbnail
1. Provide user ability to delete Fav from database(don't just remove element using JQuery)
1. Modify FavIt link using JQuery to empty Fav section and show all favs for logged in user __Completed 6/7__
1. Fix ordering issue __Completed 6/7__
1. Filter results based on which content provider logo is clicked. __Completed 6/8__
1. Move Imgur API call to server-side logic
1. Write input validation using regular expressions to replace slicing. __Completed 6/22__
1. Change Imgur Album Favs to add all images in album as hidden links to allow for gallery lightbox
1. Include method of detecting element visibility within the user's view-port and swap thumbnail for GIF when visible, and vice versa when not. __Completed 7/5__
1. Expand database to include storage of title, author, publisher, and thumbnail URL
1. Update client-side AJAX to retrieve Fav data from server rather than making API calls ever time a Fav is loaded
