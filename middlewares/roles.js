module.exports = function (rolesAllowed, redirect) {
  return (req, res, next) => {
    if (rolesAllowed.indexOf(
        req.user ? req.user.role : 'guest'
      ) != -1) {
      next();
    } else {
      if (redirect) {
        res.redirect(redirect)
      } else {
        res.sendStatus(req.user ? 403 : 401);
      }
    }
  }
}