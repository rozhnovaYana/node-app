const User = require('../models/user');
const crypto = require("crypto");
const bcrypt = require("bcryptjs"); // encrypt password
const nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "d4b14ef7f8bc64",
    pass: "a55035636d92e2"
  }
});
exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: req.flash("error")
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup'
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password
  User.findOne({email: email})
  .then(user => {
    if(!user){
      req.flash('error', 'User not found')
      return res.redirect("/login");
    }
    return bcrypt.compare(password, user.password)
    .then((result) => {
      if(result){
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save(err => {
          res.redirect('/');
        });
      }
      req.flash('error', 'The password isn`t correct')
      return res.redirect("/login")
    })
    .catch(err => res.redirect("/login"))
  })
  .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    // const confirmPassword = req.body.confirmPassword;
    // validating
    User.findOne({email: email})
    .then(user => {
        if(user){
          req.flash('error', 'User already exists')
          return res.redirect('/login');
        }
        return bcrypt.hash(password, 12)
          .then((newPassword) => {
            const newUser = new User({
              email,
              password: newPassword,
              cart: {items: []}
            })
            return newUser.save()
          })
    })
    .then(() => {
        res.redirect('/');
        return transport.sendMail({
          from: '"Fred Foo 👻" <foo@example.com>', // sender address
          to: email,
          subject: "Hello ✔", // Subject line
          text: "Hello world?", // plain text body
          html: "<b>Hello world?</b>", // html body
        });
    })
    .catch(err => console.log(err))
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    res.redirect('/');
  });
};
exports.getResetPassword = (req, res, next) => {
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: req.flash("error")
  });
};
exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if(err){
      return res.redirect("/")
    }
    const token = buffer.toString('hex');
    User.findOne({email: req.body.email})
    .then(user => {
      if(!user){
        req.flash('error', 'User isn`t exist');
        return res.redirect("/login")
      }
      user.token = token;
      user.tokenExpired = Date.now() + 60*60*1000;
      user.save()
      .then(() => {
        res.redirect('/login');
        return transport.sendMail({
          from: '"Fred Foo 👻" <foo@example.com>', // sender address
          to: req.body.email,
          subject: "Password Reset", // Subject line
          html: `<p>You try to reset your password</p><p>Please, click <a href="http://localhost:3000/reset/${token}">here</a>, to reset your password</p>`
        });
      })
    })
    .catch(err => console.log(err))
    
  })
}
exports.getUpdatePassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({token: token, tokenExpired: {$gt: Date.now()}})
  .then(user => {
    console.log(user)
    if(user){
      return res.render('auth/update-password', {
        path: '/update-password',
        pageTitle: 'Update Password',
        errorMessage: req.flash("error"),
        id: user._id,
        token
      });
    }
    req.flash('error', 'token is broken, please, try again')
    return res.redirect('/login');
  })
  .catch(err => {
    console.log(err)
  })

};
exports.postUpdatePassword = (req, res, next) => {
  const newPassword = req.body.password;
  User.findOne({_id: req.body.id, token: req.body.token, tokenExpired: {$gt: Date.now()}})
  .then(user => {
    if(user){
      return bcrypt.hash(newPassword, 12)
      .then((newPassword) => {
        user.token = undefined;
        user.tokenExpired = undefined;
        user.password = newPassword;
        return user.save()
        .then(() => {
          res.redirect("/login")
      })
      })
    }
    req.flash('error', 'token is broken, please, try again')
    return res.redirect('/login');
  })
  .catch(err => console.log(err))
}