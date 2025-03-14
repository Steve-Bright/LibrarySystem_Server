const {statusCode} = window.cookieApi.checkCookie();
if(statusCode != 200){
  window.navigationApi.toAnotherPage("./auth.html")
}