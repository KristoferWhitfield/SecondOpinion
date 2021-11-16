module.exports = function (app, passport, db) {
//multer
const fs = require('fs');
const path = require('path');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

app.post('/issue', upload.single('image'), (req, res, next) => {
  const imageData = fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename))
  db.collection("issue").save(
    { date: new Date(), imageData, description: req.body.description },
    (err, result) => {
      if (err) return console.log(err);
      console.log("saved to database");
      res.redirect("/profile");
    }
  );


});
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });

  // PROFILE SECTION =========================
  app.get("/profile", isLoggedIn, function (req, res) {
    db.collection("userVitals")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        db.collection("issue")
          .find()
          .toArray((err, issues) => {
            if (err) return console.log(err);
            res.render("profile.ejs", {
              user: req.user,
              userVitals: result,
              issues: issues
            });
          });

      });
  });

  // LOGOUT ==============================
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // message board routes ===============================================================

  app.post("/vitals", (req, res) => {
    db.collection("userVitals").save(
      { date: req.body.date, weight: req.body.weight, height: req.body.height, bp: req.body.bp, pulse: req.body.pulse },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.redirect("/profile");
      }
    );
  });

  app.put("/vitals", (req, res) => {
    db.collection("userVitals").findOneAndUpdate(
      { date: req.body.date, weight: req.body.weight, height: req.body.height, bp: req.body.bp, pulse: req.body.pulse },
      {
        $set: {
          thumbUp: req.body.thumbUp + 1,
        },
      },
      {
        sort: { _id: -1 },
        upsert: true,
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });
  app.put("/vitals", (req, res) => {
    db.collection("userVitals").findOneAndUpdate(
      {  date: req.body.date, weight: req.body.weight, height: req.body.height, bp: req.body.bp, pulse: req.body.pulse },
      {
        $set: {
          thumbDown: req.body.thumbUp - 1,
        },
      },
      {
        sort: { _id: -1 },
        upsert: true,
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });

  app.delete('/vitals', (req, res) => {
    db.collection('userVitals').findOneAndDelete({ date: req.body.date, weight: req.body.weight, height: req.body.height, bp: req.body.bp, pulse: req.body.pulse }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
