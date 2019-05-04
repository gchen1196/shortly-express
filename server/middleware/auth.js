const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  var obj = {};
  var cookies = req.cookies;
  if(!cookies || Object.keys(cookies).length === 0) {
    models.Sessions.create()
    .then(session => {
      console.log(session);
      req.cookies = session;
      obj = session;
    })
  } else {
    var hash = cookies.shortlyid;
    models.Sessions.get({hash})
    .then(session => {
      if(session.user) {
        obj = {hash, userId:session.user.id, username: session.user.username};
      } else {
        req.cookies = {};
        res.redirect('/login');
      }
    });
  }

  req['session'] = obj;
  next();
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

