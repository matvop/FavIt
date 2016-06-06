# FavIt

The FavIt web-app will provide users with a web interface to build a shared
gallery of favorite images and videos from around the Internet. Users must be
logged into their account in order to add content. Anonymous users are
allowed to view the landing page, which contains an assortment of recently
submitted Favs.

## Specific Functionality:
+ Main page
  * Provide User with Navigation Options and show recently added Favs
    * Navigation
      * Login
        * Username/Password form
        * Register/Sign-Up Form
      * User Search
        * Display found user's Favs in view only mode
      * View Favs(avail only to logged in users)
        * Add Fav form
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
      * comment
+ Python/Django
  * Use to render and serve HTML to the user
  * Communicate Favs from the user to the database
  * Authenticate user login information in the database
+ JavaScript/CSS
  * Dynamically create and load Fav HTML objects using JQuery
+ CSS
  * Used to provide style and layout for HTML elements
  * Provide an efficient and visually appealing way of viewing Favs via pop-up style animations

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
1. Provide user ability to delete Fav from database(don't just remove element using JQuery)
1. Modify FavIt link using JQuery to empty Fav section and show recent favs for logged in user
1. Fix ordering issue
1. Move Imgur API call to server-side logic
1. Optimize CSS transitions for mobile devices(enable GPU acceleration?)
1. Expand database to include storage of title, author, publisher, and thumbnail URL
1. Update client-side AJAX to retrieve Fav data from server rather than making API calls ever time a Fav is loaded
