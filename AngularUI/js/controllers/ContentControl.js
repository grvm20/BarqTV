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
        document.getElementById ('status').innerHTML="Hi "+response.first_name;
        email=response.email;
        generateContent();
        
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

  function generateContent(){
    $.ajax({
    url: 'https://j3z4xwt1ch.execute-api.us-west-2.amazonaws.com/prod/franchise/',
    //url: 'https://7pkr9e33k8.execute-api.us-west-2.amazonaws.com/prod/series/',
    type: 'GET',
    dataType: 'json',
    contentType: false,
    processData: false,
    success: function( data, textStatus, jQxhr ){
      console.log(data);
      console.log(textStatus);
      var shows=data;
      var list=$('#list')
      $(shows).each(function(index, object) {

        var item = $('<li/>')
        var link = $('<a/>').html(object.name)
        link.click(function() { 
          //alert(object.name) })
          $('#contentID').val(object.id);
          readComments(object.id);
          generateContent2(object.id) })
        item.append(link)
        list.append(item)
        $('#list').listview('refresh')

      /*$.each(object, function(key, value){

      if(key === 'email'){
        
            var item = $('<li/>')
            var link = $('<a/>').html(value)
            link.click(function() { alert(value) })
            item.append(link)
            list.append(item)
            $('#list').listview('refresh')
        }

      });*/
    });
      //window.location.href="http://www.lambdacheck.com.s3-website-us-west-2.amazonaws.com/ContentPage.html";
    },
    error: function (xhr, ajaxOptions, thrownError) {
              //$('#response pre').html("error");
              errtext=String(xhr.responseJSON.errorMessage);
              var errcode=errtext.substring(1, 4);
              console.log(xhr);
              console.log(ajaxOptions);
              if(errcode=="404"){
                document.getElementById ('status').innerHTML="No such user found";
                //window.location.href="http://www.lambdacheck.com.s3-website-us-west-2.amazonaws.com/Fbform.html";

              }
              else
              {
                document.getElementById ('status').innerHTML=errtext;
                //window.location.href="http://www.lambdacheck.com.s3-website-us-west-2.amazonaws.com/Fbform.html";

              }
              //alert(thrownError);
              //window.location.href="http://www.lambdacheck.com.s3-website-us-west-2.amazonaws.com/Fbform.html";
            }
          });
    }

 function generateContent2(fid){

    $("#content1").hide();
    $(".content2").show();
    $.ajax({
    url: 'https://j3z4xwt1ch.execute-api.us-west-2.amazonaws.com/prod/series/?fid='+fid,
    type: 'GET',
    dataType: 'json',
    contentType: false,
    processData: false,
    success: function( data, textStatus, jQxhr ){
      console.log(data);
      console.log(textStatus);
      var shows=data;
      var list=$('#serieslist')
      $(shows).each(function(index, object) {

        var item = $('<li/>')
        var link = $('<a/>').html(object.name)
        link.click(function() { 
          //alert(object.name) })
          $('#contentID').val(object.id);
          readComments(object.id);
          generateContent3(object.id) })
        item.append(link)
        list.append(item)
        $('#serieslist').listview('refresh')

      });
      //window.location.href="http://www.lambdacheck.com.s3-website-us-west-2.amazonaws.com/ContentPage.html";
    },
    error: function (xhr, ajaxOptions, thrownError) {
              
              alert(thrownError);
             
            }
          });
    }

function generateContent3(sid){

    $("#content2").hide();
    $(".content3").show();
    $.ajax({
    url: 'https://j3z4xwt1ch.execute-api.us-west-2.amazonaws.com/prod/episode/?sid='+sid,
    type: 'GET',
    dataType: 'json',
    contentType: false,
    processData: false,
    success: function( data, textStatus, jQxhr ){
      console.log(data);
      console.log(textStatus);
      var shows=data;
      var list=$('#episodelist')
      $(shows).each(function(index, object) {

        var item = $('<li/>')
        var link = $('<a/>').html(object.name)
        link.click(function() { 
          $('#contentID').val(object.id);
          readComments(object.id)
          alert(object.name) })
          //generateContent2(object.id) })
        item.append(link)
        list.append(item)
        $('#episodelist').listview('refresh')

      });
      //window.location.href="http://www.lambdacheck.com.s3-website-us-west-2.amazonaws.com/ContentPage.html";
    },
    error: function (xhr, ajaxOptions, thrownError) {
              
              alert(thrownError);
             
            }
          });
    }

function postComment() {
  $.ajax({
    url: 'https://ygxp4ozx98.execute-api.us-west-2.amazonaws.com/prod/comments',
    type: 'POST',
    data: JSON.stringify({
      content : $('#contentID').val(),
      customer : email,
      text : $('#comment').val(),
      
           
    }),
    dataType: 'json',
    contentType: 'application/json',
    processData: false,
    success: function( data, textStatus, jQxhr ){
      console.log(data);
      console.log(textStatus);
      
      //$('#response pre').html("success");
      alert("Success");
    },
    error: function (xhr, ajaxOptions, thrownError) {

      //errtext=xhr.responseJSON.errorMessage;
      //$('#response pre').html(errtext);
      console.log(xhr);
      //console.log(ajaxOptions);
      //console.log(thrownError);
      alert(thrownError);
            },
    crossDomain: true
          });

  $('#comment').val('');
};

function refreshPage(){
  location.reload();
}

function readComments(cid){

    //$("#content2").hide();
    $('#commentlist').empty();
    $("#comments").show();
    $.ajax({
    url: 'https://ygxp4ozx98.execute-api.us-west-2.amazonaws.com/prod/comments/?content='+cid,
    type: 'GET',
    dataType: 'json',
    contentType: false,
    processData: false,
    success: function( data, textStatus, jQxhr ){
      console.log(data);
      console.log(textStatus);
      var shows=data;
      var list=$('#commentlist')
      $(shows).each(function(index, object) {
        var str=object.customer.href;
        var n = str.lastIndexOf("/");
        var name=str.substring(n+1)
        var item = $('<li>'+name+' '+' says: '+ object.text+'</li>')
        
        list.append(item)
        $('#commentlist').listview('refresh')

      });
      //window.location.href="http://www.lambdacheck.com.s3-website-us-west-2.amazonaws.com/ContentPage.html";
    },
    error: function (xhr, ajaxOptions, thrownError) {
              
              alert(thrownError);
             
            }
          });
    }


  