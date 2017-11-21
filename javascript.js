var http = require('http')
var querystring = require('querystring')
var request = require('request');

let server = {
  hostname: '119.23.129.240',
  session_id: '',
}

const login = function () {
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

const logout = function () {
  var postData = querystring.stringify({
    beegosessionID: server.session_id,
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
}

const search = function () {

}

// login()
// logout()


var Test = require('./nodejs_output.js')

// Test.prototype.getSearch('119.23.129.240')
var poi = new Test.Test('http://119.23.129.240/api')
var req = poi.getProjects().then(function (res) {
  console.log(res.body)
}, function (err) {
  console.log(err)
})

// console.log(res)

// var intervalID = setInterval(function () {
//   console.log(res)
// }, 500);


// console.log(res)
