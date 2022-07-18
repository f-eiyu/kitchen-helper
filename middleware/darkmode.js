const User = require("../models/user.js");

const checkDarkMode = (req, res, next) => {
  const userId = req.session.userId;
  User.findById(userId)
    .then(user => (user ? user.settings.darkmode : false))
    .then(useDark => { res.locals.darkmode = useDark; })
    .catch(() => { res.locals.darkmode = false; })
    .finally(() => next());
}

module.exports = checkDarkMode;