# sessionExpiration.js
A lightweight session expiration tool in pure JS without any dependencies.

It works across all tabs in the browser. The user won't be logged out as long as at least some tab is being regularly used.

### How to use:

1. Include the JS in your markup on all pages that are to be subjected to sessionExpiration. (Thus, it is preferable to include the JS in your footer.) If you exclude one page, then the user will be logged out if another page (with this function) is open in another tab, but the user is merely using the page without this function. **sessionExpiration.js only notices the activity of a user on those pages that have the function called.**

```
<script type="text/javascript" src="http://localhost/sessExp/sessionExpiration.js"></script>
```

2. Create a div with id "sessExpirDiv" somewhere on each page that will be subject to sessionExpiration (preferably in your footer or header). This will contain the warning message and countdown to logout.

```
<div id="sessExpirDiv">
</div>
```

3. Put the CSS in your stylesheet (or redesign it to your liking) which you find as a comment in the JS file - providing design of the warning message and countdown.

```
#sessExpirDiv { }
#sessExpirP { }
```

4. Call the function (from each page you included the script in, thus also; preferably from your footer) along with the arguments [1] number of minutes the user is allowed to be idle, [2] number of minutes the user is allowed to be idle before the warning and countdown begins, [3] the url for your server side logout.

```
sessionExpiration(idleMinutes = 1, warningMinutes = 0.5, logoutUrl = 'http://localhost/path/to/logout');
```
