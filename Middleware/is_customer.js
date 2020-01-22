module.exports = (req, res, next) => {
    console.log("Session Master " + req.session.isMaster)
    if (req.session.isMaster.toString()==="false") {
        console.log(req.session.isLoggedIn)
        next();
    }
    else{
        return res.redirect('/login');
    }
}