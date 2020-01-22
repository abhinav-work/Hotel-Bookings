module.exports = (req, res, next) => {
    if (req.session.isMaster.toString()==="true") {
        console.log(req.session.isLoggedIn)
          next();
    }
  
    else{
         return res.redirect('/login');
    }
}