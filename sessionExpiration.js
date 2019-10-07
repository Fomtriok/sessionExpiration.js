/******************************************************************************************************************
 ░░░░ SESSIONEXPIRATION.JS - BY FOMTRIOK. ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 * May be used and changed, preferably with this line of accreditation, if you use it almost without alterations. 
 ******************************************************************************************************************/

/******************************************************************************************************************
 ░░░░ HOW TO USE ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 * sessionExpiration.js is a lightweight session expiration tool. Simply include this JS file, and then call as:
 * sessionExpiration(idleMinutes = 1, warningMinutes = 0.5, logoutUrl = 'http://localhost/path/to/logout');
 * It works across all tabs in the browser (that are part of your domain), that you call this function from.
 ******************************************************************************************************************/

/******************************************************************************************************************
 ░░░░ DEMO ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 * There exist a simple demo. Its instructions for it can be found in its own readme file. (Server end session
 * expiration is not included in demo. For instructions in regards to that, see comments below here.)
 ******************************************************************************************************************/

/******************************************************************************************************************
 ░░░░ OPTIONAL: SERVER END REFRESH ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 * The benefit of using server end session expiration too, is that your user is logged out if he/she has kept the
 * browser window or browser closed for more than the defined duration of time.
 *    If the serverRefresh URL is provided as an argument, the serverRefresh() function refreshes a timer on server
 * end too, granted you have such a script [an example for PHP is provided by the name "serverRefresh.php"]. Notice:
 * Set the server session expiration time to +1 minute more than the client side. Thus, we avoid situations where
 * user has lost server session without knowing.
 *    This is because: To economize the number of requests, we check user activity [for the purpose of a server
 * request] only once every 50 seconds. [You can customize this though, by changing the serverInterval value.] This
 * means the data reaching our server side session timer has a delay of up to 50 seconds. If you for instance set
 * the client side session expiration to 5 minutes, and the server side session expiration to 6 minutes, that gives
 * you 10 seconds of margin, which is very generous. But as stated, you can edit all these settings to your liking,
 * and for instance keep serverInterval at 1 second.
 ******************************************************************************************************************/

/******************************************************************************************************************
 ░░░░ CSS VALUE SUGGESTIONS ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 * #sessExpirDiv {
 *   display: none; /* For Firefox, where opacity isn't taken into account before loading page.
 *   border: none;
 *   background-color: #FF6666;
 *   color: #FFF;
 *   font-family: 'Lato', Arial;
 *   margin: 0px;
 *   font-size: 18px;
 *   line-height: 18px;
 *   position: fixed;
 *   width: 100%;
 *   height: 54px;
 *   text-align: center;
 *   z-index: -999999;
 *   top: 0;
 *   left: 0;
 *   opacity: 0;
 *   -webkit-transition: all 1s ease;
 *   transition: all 1s ease;
 * }
 * #sessExpirP {
 *   margin-top: 16px;
 *   padding: 0px;
 * }
 ░░░░ HTML ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 * <div id="sessExpirDiv">
 * </div>
 ******************************************************************************************************************/

function sessionExpiration(idleMinInput, warningMinInput, logoutUrl, serverRefresh = 'none') {
  var t;
  var activeTime;
  var oldActiveTime; /* Only used if serverRefresh URL is provided. */
  var serverInterval = 50; /* Seconds. If serverRefresh URL is provided, at what interval to you want to contact server? */
  var warningCountdown;
  var sessExpirDiv = document.getElementById('sessExpirDiv');
  window.onload = resetTimer; /* Window is refreshed. */
  window.onmousemove = resetTimer; /* Mouse is moved. */
  window.onkeypress = resetTimer; /* Key is pressed. */
  window.onmousedown = resetTimer; /* Touchscreen is pressed. */
  window.onclick = resetTimer; /* Touchpad clicks. */
  window.onscroll = resetTimer; /* Scrolling with arrow keys. */
  if(serverRefresh !== 'none') {
    serverRefresh();
  }
  function warning(idleSeconds, warningSeconds) {
    bannerDisplay = setTimeout(function(){
      sessExpirDiv.style.display = 'inline-block';
    }, 100); /* In Firefox opacity isn't taken into account before the page and div load. Without this the banner would flicker upon page load. */
    warningStart = setTimeout(function(){
      sessExpirDiv.style.opacity = '1';
      sessExpirDiv.style.zIndex = '999999';
    }, 1100); /* Wtihout this, warning div would appear before the text. */
    remaining = idleSeconds - warningSeconds;
    warningCountdown = setInterval(function() { /* Update every 1 second. */
      if(remaining <= 0) {
        /* Now we check that no other tab has been active after us. */
        var browserActive = localStorage.getItem('activeTime');
        if(activeTime != browserActive) { /* Then another tab has been active more recently than this tab. */
          // alert("Not the same. User has been active in another tab. browserActive: " + browserActive + " and activeTime: " + activeTime);
          /* We want to keep going, because user might close the other tab - and if this script is broken, the sessionExpiration is broken. */
          sessionExpiration(idleMinInput, warningMinInput, logoutUrl);
        } else {
          // alert("The same. User has not been active in another tab. browserActive: " + browserActive + " and activeTime: " + activeTime);
          logout();
        }
      } else {
        remaining -= 1;
        document.getElementById('sessExpirDiv').innerHTML =
        '<p id="sessExpirP">Due to inactivity your login session will expire. Use keyboard or mouse to remain logged in. ' + remaining + ' seconds remaining.</p>';
      }
    }, 1000);
  }
  function recordTime() {
    activeTime = Date.now(); /* Milliseconds since 1970/01/01. */
    localStorage.setItem('activeTime', activeTime);
  }
  function clearEverything() {
    clearTimeout(t);
    clearInterval(warningCountdown);
    clearWarning();
  }
  function clearWarning() {
    sessExpirDiv.style.opacity = '0';
    sessExpirDiv.innerHTML = ' ';
    sessExpirDiv.style.zIndex = '-999999';
  }
  function logout() {
    window.location.href = logoutUrl;
  }
  function resetTimer() {
    clearEverything();
    recordTime(); /* Records across all tabs in browser. */
    var idleMinutes = idleMinInput; /* After how long idle time do we log out user? */
    var warningMinutes = warningMinInput; /* After how long idle time do we start the warning countdown? */
    var idleSeconds = parseInt(idleMinutes * 60);
    var warningSeconds = parseInt(warningMinutes * 60);
    var wMilliSeconds = warningSeconds * 1000;
    /* When user has been idle warningSeconds number of seconds, we display warning and countdown. */
    t = setTimeout(function(){ warning(idleSeconds, warningSeconds); }, wMilliSeconds);
  }
  /* Optional. This is used only if you have a server end session timer too, and provide the URL serverRefresh. */
  function serverRefresh() {
    setInterval(function() {
      if(activeTime !== oldActiveTime) { /* Then user has been active in the last 50 seconds. */
        var xhr = new XMLHttpRequest();
        xhr.open('GET', serverRefresh);
        xhr.send(null);
        oldActiveTime = activeTime;
      }
    }, serverInterval * 1000);
  }
};
