const User = require("../models/user.js");
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new User({ email, username });
        const registeruser = await User.register(newuser, password);
        console.log(registeruser);
        req.login(registeruser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "register successfully");
            res.redirect("/listings");
        })

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/listings");
    }

};
module.exports.loginpage = (req, res) => {
    res.render("User/login.ejs");
};
module.exports.loginafter = async (req, res) => {
    req.flash("success", "welcome back darling");
    let redirectUrl = res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
};
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are successfully logout");
        res.redirect("/listings");
    });

};
module.exports.rendersignup= (req, res) => {
    res.render("User/signup.ejs");
};
