var http = require('http')
var querystring = require('querystring')

let server = {
  hostname: '119.23.129.240',
  session_id: '',
}

var login = function () {
  var postData = querystring.stringify({
      principal: 'admin',
      password: 'Harbor12345',
      verify: false,
  });

  var options = {
     hostname: server.hostname,
     port: 80,
     path: '/login',
     method: 'POST',
     headers: {
      'Content-Type':'application/x-www-form-urlencoded',
      'Content-Length':Buffer.byteLength(postData)
     }
  }

  var req = http.request(options, function(res) {
      // console.log('Status:',res.statusCode);
      // console.log('headers:',JSON.stringify(res.headers));
      if (res.statusCode === 200) {
        server.session_id = res.headers['set-cookie'][0].split(';')[0].replace('beegosessionID=', '')

        console.log('Successfully login, session id: ' + server.session_id)
      } else {
        console.log('Fail to login, please try again')
      }
      // res.setEncoding('utf-8');
      // res.on('data',function(chun){
      //     console.log('body分隔线---------------------------------\r\n');
      //     console.info(chun);
      // });
      // res.on('end',function(){
      //     console.log('No more data in response.********');
      // });
  });

  req.on('error',function(err){
      console.error(err);
  });
  req.write(postData);
  req.end();
}

var logout = function () {
  var postData = querystring.stringify({
    // beegosessionID: server.session_id,
    beegosessionID: 'be04a84fce6586dd466adf9cf2e6759f',
  });

  var options = {
     hostname: server.hostname,
     port: 80,
     path: '/log_out',
     method: 'GET',
     headers: {
      'Content-Type':'application/x-www-form-urlencoded',
      'Content-Length':Buffer.byteLength(postData)
     }
  }

  var req = http.request(options, function(res) {
      console.log('Status:',res.statusCode);
    if (res.statusCode === 200) {
      console.log('Successfully logout')
    }
  });

  req.on('error',function(err){
      console.error(err);
  });
  req.write(postData);
  req.end();
}

// login()
logout()
