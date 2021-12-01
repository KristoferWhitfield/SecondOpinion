module.exports = function (app, passport, db, ObjectId, mongoose) {
  //multer
  const fs = require("fs");
  const path = require("path");
  // const textract = require('textract');
  const multer = require("multer");
  const ocrad = require("async-ocrad");
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now());
    },
  });

  var upload = multer({ storage: storage });
  // const config = {}
  app.post("/issue", upload.single("image"), async (req, res, next) => {
    const imageFile = path.join(__dirname + "/../uploads/" + req.file.filename);
    const imageData = fs.readFileSync(imageFile);
    // console.log(imageFile)
    // textract.fromFileWithMimeAndPath("image/jpeg", imageFile, config, function( error, text ) {
    //   console.log("ocr", error, text)
    // })
    const text = await ocrad(imageFile);

    db.collection("issue").save(
      {
        date: new Date(),
        imageData,
        text,
        description: req.body.description,
        userId: req.user._id,
        chosenDoctorId: ObjectId(req.body.chosenDoctorId),
        userName: req.user.local.email
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.redirect("/profile");
      }
    );
  });

  app.get("/documentReader/:_id", isLoggedIn, function (req, res) {
    db.collection("issue")
      .find({_id: ObjectId(req.params._id)})
      .toArray((err, issues) => {
        if (err) return console.log(err);
            res.render("documentReader.ejs", {
              user: req.user,
              issues: issues,
          });
      });
  });
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });

  // PROFILE SECTION =========================
  app.get("/profile", isLoggedIn, function (req, res) {
    db.collection("userVitals")
      .find({ user: req.user._id })
      .toArray((err, result) => {
        if (err) return console.log(err);
        db.collection("issue")
          .find({ userId: req.user._id })
          .toArray((err, issues) => {
            if (err) return console.log(err);
            db.collection("users")
            .find({ "local.userType": "doctor" })
              .toArray((err, doctors) => {
                if (err) return console.log(err);
            db.collection("responses")
              .find({patientId: req.user._id})
              .toArray((err, message) => {
                if (err) return console.log(err);
                res.render("profile.ejs", {
                  user: req.user,
                  userVitals: result,
                  responses: message,
                  issues: issues,
                  doctors: doctors
                });
              });
            });
          });
      });
  });
  // DR PROFILE SECTION =========================
  app.get("/docProfile", isLoggedIn, function (req, res) {
    db.collection("issue")
      .find({chosenDoctorId: req.user._id})
      .toArray((err, issues) => {
        if (err) return console.log(err);
        db.collection("responses")
          .find()
          .toArray((err, result) => {
            if (err) return console.log(err);
            res.render("docProfile.ejs", {
              user: req.user,
              responses: result,
              issues: issues,
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
  app.post("/docResponse", (req, res) => {
    db.collection("responses").save(
      { responses: req.body.responses, user: req.user._id, issueId: ObjectId(req.body.issueId), patientId: ObjectId(req.body.patientId)},
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.redirect("/docProfile");
      }
    );
  });

  app.post("/vitals", (req, res) => {
    db.collection("userVitals").save(
      {
        date: req.body.date,
        weight: req.body.weight,
        height: req.body.height,
        bp: req.body.bp,
        pulse: req.body.pulse,
        user: req.user._id,
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.redirect("/profile");
      }
    );
  });

  app.put("/vitals", (req, res) => {
    db.collection("userVitals").findOneAndUpdate(
      {
        date: req.body.date,
        weight: req.body.weight,
        height: req.body.height,
        bp: req.body.bp,
        pulse: req.body.pulse,
      },

      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });

  app.delete("/vitals", (req, res) => {
    db.collection("userVitals").findOneAndDelete(
      {
        date: req.body.date,
        weight: req.body.weight,
        height: req.body.height,
        bp: req.body.bp,
        pulse: req.body.pulse,
      },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send("Message deleted!");
      }
    );
  });

  app.delete("/issues", (req, res) => {

    db.collection("issue").findOneAndDelete(
      {
        _id: ObjectId(req.body.issueTrash)
      },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send("Message deleted!");
      }
    );
  });

  app.delete("/responses", (req, res) => {

    db.collection("responses").findOneAndDelete(
      {
        _id: ObjectId(req.body.responseTrash)
      },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send("Message deleted!");
      }
    );
  });

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

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================
  //Dr Login
  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/docLogin", function (req, res) {
    res.render("docLogin.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/docLogin",
    passport.authenticate("local-login", {
      successRedirect: "/docProfile", // redirect to the secure profile section
      failureRedirect: "/docSignup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/docSignup", function (req, res) {
    res.render("docSignup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/docSignup",
    passport.authenticate("local-signup", {
      successRedirect: "/docProfile", // redirect to the secure profile section
      failureRedirect: "/docSignup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
