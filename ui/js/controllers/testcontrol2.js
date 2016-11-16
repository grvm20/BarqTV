var liveaddress = $.LiveAddress({
  key: "13784757283489467",
  debug: true,
  target: "US",
  addresses: [{
    address1: '#street-address',
    address1: '#street-address2',
    locality: '#city',
    administrative_area: '#state',
    }]
   });

function PostTest() {
  $.ajax({
    url: 'https://j3z4xwt1ch.execute-api.us-west-2.amazonaws.com/prod/customers',
    type: 'POST',
    data: JSON.stringify({
     /* last_name : $('#lastname').val(),
      first_name : $('#firstname').val(),
      email : $('#email').val(),
      phone_number : $('#phonenumber').val(),
      address : {
        city : $('#city').val(),
        state : $('#state').val(), 
        apt : $('#apt').val(),
        number : $('#number').val(),
        street : $('#streetname').val(),        
        zip_code : $('#zip').val()
      }*/
      last_name : "uitest",
      first_name : "test",
      email : "nope@gmail.com",
      phone_number : "1234567890",
      address : {k
        city : "New York",
        state : "NY",
        apt : "14",
        street : "Claremont Ave",
        number : "188",
        zip_code : "10027"
      }
    }),
    dataType: 'json',
    contentType: 'application/json',
    processData: false,
    success: function( data, textStatus, jQxhr ){
      console.log(data);
      console.log(textStatus);
      
      $('#response pre').html("success");
      //alert("Success");
    },
    error: function (xhr, ajaxOptions, thrownError) {
              $('#response pre').html("error");
              console.log(xhr);
              console.log(ajaxOptions);
              console.log(thrownError);
              //alert(thrownError);
            },
    crossDomain: true
          });

  document.getElementById('firstForm').reset(); 
  document.getElementById('firstname').focus();
};

function populateAddress() {
  var str = $('#street-address').val();
  var sub;
  var sub2;
  if (str.indexOf(' ') === -1){
    sub = str;
    sub2 = str
  }

  else{
    var i=str.indexOf(' ');
    sub = str.substr(0, i);
    sub2 = str.substr(i);
  }
  document.getElementById('number').value=sub ; 
  document.getElementById('streetname').value=sub2 ; 
};