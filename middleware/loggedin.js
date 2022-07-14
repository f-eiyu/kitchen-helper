const checkLoggedIn = (req, res, next) => {
  const loggedIn = Boolean(req.session.loggedIn);

  res.locals.loggedIn = loggedIn;

  // we'll want to do this in a more robust way later, but this is good enough
  // for the time being
  if (loggedIn || req.originalUrl.match(/^\/account/)) { next(); }
  else { res.render("./home/index.liquid"); }
}

module.exports = checkLoggedIn;