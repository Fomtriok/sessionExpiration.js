/* This functionality is optional, for server end session expiration too - which however is advisable to implement. */

/* Keep this on top of every page user is logged in into.
session_start();
if(isset($_SESSION['user_ID'])) {
  if(isset($_SESSION['last_activity']) && $_SESSION['last_activity'] < time() - '360') {
    /* 360 seconds = 6 min. The client side logout happens after 5 minutes, but only if the browser is not closed. */
    header('Location: http://localhost/path/to/log_out');
    exit;
  } else {
    $_SESSION['last_activity'] = time();
  }
} */

/* And this is the actual code for the refresh_session.php script. */
session_start();
if(isset($_SESSION['user_ID'])) {
  $_SESSION['last_activity'] = time();
  exit();
}
