const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");

module.exports = function (passport) {
  // Estrategia Local
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        // Buscar usuario por email (antes username)
        const user = await Usuario.findOne({ where: { email } });
        if (!user) {
          return done(null, false, { message: "Usuario no encontrado" });
        }

        // Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Contraseña incorrecta" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // Serializar usuario (guarda solo el ID en sesión)
  passport.serializeUser((user, done) => done(null, user.id));

  // Deserializar (recupera el usuario desde la BD)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await Usuario.findByPk(id);
      if (!user) return done(new Error("Usuario no encontrado"));
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
