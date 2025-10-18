module.exports = {
  ensureAuth: (req, res, next) => {
    console.log("Ruta:", req.path, "| Autenticado:", req.isAuthenticated && req.isAuthenticated());
    if (req.isAuthenticated && req.isAuthenticated()) {
      return next();
    }
    return res.redirect("/login");
  }
};
