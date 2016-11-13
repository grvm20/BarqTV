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