const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        state: true
    })
);

router.get("/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/"
    }),
    (req, res) => {
        res.redirect("/");
    }
);

router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.session.destroy((err) => {
            if (err) return next(err);

            res.clearCookie("connect.sid");
            res.redirect("/");
        });
    });
});

module.exports = router;