const parseCookies = (req, res, next) => {
  var obj = {};
  
  if(req.headers && req.headers.cookie) {
    var cookies = req.headers.cookie;
    //console.log(req.headers);
    
    var cookiesArray = cookies.split('; ');
    cookiesArray.forEach(cookie => {
      var pairs = cookie.split('=');
      obj[pairs[0]] = pairs[1];
    });
  }
  req['cookies'] = obj;
  next();
};

module.exports = parseCookies;