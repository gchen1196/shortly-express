const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  var cookies = req.cookies;
  if(!cookies || Object.keys(cookies).length === 0) {
    //if no cookies, initialize a new session on the request;
    //create the session;
    models.Sessions.create()
    .then(result => {
      //get the created session from database
      let id = result.insertId;
      models.Sessions.get({id})
      .then(session => {
        let hash = session.hash;
        req['session'] = {hash};
        res.cookie('shortlyid', hash);
        next();
      })
      .catch(err => {
        throw(err);
      });
    })
    .catch(err => {
      throw(err);
    });
  } else {
    //use cookies.shortlyId to get the session from database.
    //if it exists, assign a session object to the request;
    let hash = req.cookies.shortlyid;
    //console.log(hash);
    models.Sessions.get({hash})
    .then(session => {
      if(!session) {
        models.Sessions.create()
        .then(result => {
      //get the created session from database
          let id = result.insertId;
          models.Sessions.get({id})
          .then(session => {
            let hash = session.hash;
            req['session'] = {hash};
            res.cookie('shortlyid', hash);
            next();
          })
          .catch(err => {
          throw(err);
          });
        })
        .catch(err => {
        throw(err);
        });
      } else {
      req['session'] = session;
      next();
      }
    })
    .catch(err => {
      throw err;
    });





    ///////////////
    // var hash = cookies.shortlyid;
    // models.Sessions.get({hash})
    // .then(session => {
    //   if(session.user) {
    //     req['session'] = {hash, userId:session.user.id, username: session.user.username};
    //     next();
    //   } else {
    //     req.cookies = {};
    //     res.redirect('/login');
    //     next();
    //   }
    // })
    // .catch((err) => {
    //   console.log(err);
    //   next();
    // });
  }
  
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

