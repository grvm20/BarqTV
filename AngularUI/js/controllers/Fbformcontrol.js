 var name="";
 var email="";
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
        document.getElementById ('firstname').value=response.first_name;
        document.getElementById ('lastname').value=response.last_name;
        eid = response.email;
        email=response.email;
        name=response.name;
        document.getElementById ('email').value=eid;
        document.getElementById ("email").disabled = true;
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

  function getFriends(){
      console.log("start")
      var inputs={
        "operation":"create",
        "type":"person",
        "id":email,
        "myname":name,
        "friends":[]
      };
      FB.api('/me/friends', function(response) {
        if(response && !response.error){
        console.log(response.data)
        if(response.data) {
            $.each(response.data,function(index,friend) {
                //alert(friend.name + ' has id:' + friend.id);
                inputs.friends.push({
                  "friendname" : friend.name,
                  "id" : friend.id
                });
            });
        } else {
            alert("Error!");
        }
    }
      else{
        alert("Error!");
      }
    });
      console.log("inputs");
      console.log(inputs);
    /*$.ajax({
    url: 'https://j3z4xwt1ch.execute-api.us-west-2.amazonaws.com/prod/customers',
    type: 'POST',
    data: inputs,
    dataType: 'json',
    contentType: 'application/json',
    processData: false,
    success: function( data, textStatus, jQxhr ){
      console.log(data);
      console.log(textStatus);
      console.log("Graph db succesful")
      //$('#response pre').html("success");
      //alert("Success");
    },
    error: function (xhr, ajaxOptions, thrownError) {

      errtext=xhr.responseJSON.errorMessage;
      //$('#response pre').html(errtext);
      console.log("Graph db unsuccesful");
      //console.log(ajaxOptions);
      //console.log(thrownError);
              //alert(thrownError);
            },
    crossDomain: true
          });*/
   }





  