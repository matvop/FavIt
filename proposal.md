# FavIt

The FavIt web-app will provide users with a web interface to build a shared
gallery of favorite images and videos from around the Internet. Users must be
logged into their account in order to add or remove content. Anonymous users are
 allowed to view the landing page and user galleries.

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
        * Remove Fav
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

## Timeline:
1. Determine user input that should to be saved for Fav creation
1. Create functions in JavaScript that generate Fav objects
1. Write CSS that provides a visually appealing method of viewing Favs
