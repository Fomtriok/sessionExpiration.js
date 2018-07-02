/******************************************************************************************************************
 ░░░░ SESSIONEXPIRATION.JS - By Fomtriok. May be used and changed, with this line of accreditation. ░░░░░░░░░░░░░░░
 ******************************************************************************************************************/

/******************************************************************************************************************
 ░░░░ HOW TO USE ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 * sessionExpiration.js is a lightweight session expiration tool. Simply include this JS file, and then call as:
 * sessionExpiration(idleMinutes = 0.1, warningMinutes = 0.02, logoutUrl = 'http://localhost/path/to/logout');
 * It works across all tabs in the browser.
 ******************************************************************************************************************/

/******************************************************************************************************************
 ░░░░ CSS VALUE SUGGESTIONS ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 * #sessExpirDiv {
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
 *   <div id="sessExpirDiv">
 *   </div>
 ******************************************************************************************************************/

function sessionExpiration(idleMinInput, warningMinInput, logoutUrl) {
  var t;
  var activeTime;
  var warningCountdown;
  var sessExpirDiv = document.getElementById('sessExpirDiv');
  window.onload = resetTimer; /* Window is refreshed. */
  window.onmousemove = resetTimer; /* Mouse is moved. */
  window.onkeypress = resetTimer; /* Key is pressed. */
  window.onmousedown = resetTimer; /* Touchscreen is pressed. */
  window.onclick = resetTimer; /* Touchpad clicks. */
  window.onscroll = resetTimer; /* Scrolling with arrow keys. */
  function warning(idleSeconds, warningSeconds) {
    warningStart = setTimeout(function(){
      sessExpirDiv.style.opacity = '1';
      sessExpirDiv.style.zIndex = '999999';
    }, 1000); /* Wtihout this, warning div would appear before the text. */
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
};
