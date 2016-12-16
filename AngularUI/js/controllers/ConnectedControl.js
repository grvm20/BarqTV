 window.fbAsyncInit = function() {
    FB.init({
      appId      : '1197867396915792',
      xfbml      : true,
      version    : 'v2.8'
    });
    FB.AppEvents.logPageView();
    FB.getLoginStatus(function (response){
      if(response.status === 'connected'){
        document.getElementById('status').innerHTML = "We re connected";
        FB.api('/me','GET',{fields: 'first_name,last_name,name,email'},function(response){
        document.getElementById ('status').innerHTML="Hi "+response.first_name;
        
        //checkExist(eid);
        
      })}
      else if(response.status === 'not_authorized'){
        document.getElementById('status').innerHTML = "Not logged in";
      }
      else {
        document.getElementById('status').innerHTML = "Not connected to facebook";
      }
    })
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  