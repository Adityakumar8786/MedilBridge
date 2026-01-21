const passport = require('passport');
exports.login = passport.authenticate('local', { failureRedirect: '/api/auth/fail' });
exports.loginSuccess = (req, res) => {
  res.json({ user: req.user });
};
exports.loginFail = (req, res) => {
  res.status(401).json({ msg: 'Invalid credentials' });
};
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ msg: 'Logged out' });
  });
};
exports.getCurrentUser = (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ msg: 'No user' });
  }
};