var liveaddress = $.LiveAddress({
  key: "13784757283489467",
  debug: true,
  target: "US",
  addresses: [{
    address1: '#street-address',
    locality: '#city',
    administrative_area: '#state',
    postal_code: '#zip',
     }]
   });

function PostTest() {
  $.ajax({
    url: 'https://j3z4xwt1ch.execute-api.us-west-2.amazonaws.com/prod/customers',
    type: 'POST',
    data: JSON.stringify({
      last_name : $('#lastname').val(),
      first_name : $('#firstname').val(),
      email : $('#email').val(),
      phone_number : $('#phonenumber').val(),
      address : {
        city : $('#city').val(),
        state : $('#state').val(),
        apt : $('#apt').val(),
        street : $('#street').val(),
        number : $('#number').val(),
        zip_code : $('#zip').val()
      }
      // last_name : "uitest",
      // first_name : "test",
      // email : "uitest@gmail.com",
      // phone_number : "1234567890",
      // address : {
      //   city : "New York",
      //   state : "NY",
      //   apt : "64",
      //   street : "1",
      //   number : "1",
      //   zip_code : "10025"
      // }
    }),
    dataType: 'json',
    contentType: 'application/json',
    processData: false,
    success: function( data, textStatus, jQxhr ){
      console.log(data);
      console.log(textStatus);
      console.log($('#lastname').val());
      console.log($('#firstname').val());
      console.log($('#email').val());
      console.log($('#phonenumber').val());
      console.log($('#city').val());
      console.log($('#state').val());
      console.log($('#apt').val());
      console.log($('#street').val());
      console.log($('#number').val());
      console.log($('#zip').val());
      $('#response pre').html("success");
    },
    error: function (xhr, ajaxOptions, thrownError) {
              //$('#response pre').html("error");
              console.log(xhr);
              console.log(ajaxOptions);
              alert(thrownError);
            }
          });
  alert("POST JSON");
};