# sessionExpiration.js
A lightweight session expiration tool in pure JS without any dependencies.

It works across all tabs in the browser. The user won't be logged out as long as at least some tab is being regularly used.

### How to use:

Simply include the JS in your markup. Then call the function along with the arguments [1] number of minutes the user is allowed to be idle, [2] number of minutes the user is allowed to be idle before the warning and countdown begins, [3] the url for your server side logout.

```
sessionExpiration(idleMinutes = 1, warningMinutes = 0.5, logoutUrl = 'http://localhost/logout');
```
