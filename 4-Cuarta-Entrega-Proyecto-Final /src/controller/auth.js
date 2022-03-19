import bCrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTstrategy } from "passport-jwt";
import { ExtractJwt as ExtractJwt } from "passport-jwt";
import { User } from "../db/models/usuarios.js";
import { mailSignUp } from "../utils/transporter.js";
import logger from "../utils/logger.js";

passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      const nombre = req.body.nombre;
      const edad = req.body.edad;
      const telefono = req.body.telefono;
      const avatar = req.body.avatar;

      User.findOne({ email: email }, function (err, user) {
        if (err) {
          logger.info("Error in SignUp: " + err);
          return done(err);
        }

        if (user) {
          logger.info("User already exists");
          return done(null, false);
        }

        const newUser = {
          email: email,
          password: createHash(password),
          nombre: nombre,
          edad: edad,
          telefono: telefono,
          avatar: avatar,
        };

        User.create(newUser, (err, userWithId) => {
          if (err) {
            logger.info("Error in Saving user: " + err);
            return done(err);
          }
          logger.info("User Registration succesful");
          logger.info(userWithId);
          const subject = "Nuevo Registro";
          const html = `<ul><li>email: ${userWithId.email}</li><li>password: ${userWithId.password}</li><li>nombre: ${userWithId.nombre}</li><li>edad: ${userWithId.edad}</li><li>telefono: ${userWithId.telefono}</li><li>avatar: ${userWithId.avatar}</li></ul>`;
          mailSignUp(subject, html);
          return done(null, userWithId);
        });
      });
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) return done(err);

        if (!user) {
          logger.info("User Not Found with username " + email);
          return done(null, false);
        }

        if (!isValidPassword(user, password)) {
          logger.info("Invalid Password");
          return done(null, false);
        }

        return done(null, user);
      });
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: 'coderhouse',
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('secret_token')
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.deserializeUser((id, done) => {
  User.findById(id, done);
});

passport.serializeUser((user, done) => {
  done(null, user._id);
});

function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.password);
}

function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

export default passport;
