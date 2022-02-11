import express from "express";
const app = express();
import { routerProductos } from "./routers/routerProductos.js";
import { routerCarritos } from "./routers/routerCarritos.js";
import logger from "./logger.js";
import { User } from "./model.js";
import bCrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { conectarDB } from "./controllerdb.js";
import { credenciales } from "./credenciales.js";
import session from "express-session";
import { mailSignUp } from "./transporter.js";


let usuario;

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
          const subject = "Nuevo Registro"
          const html = `<ul><li>email: ${userWithId.email}</li><li>password: ${userWithId.password}</li><li>nombre: ${userWithId.nombre}</li><li>edad: ${userWithId.edad}</li><li>telefono: ${userWithId.telefono}</li><li>avatar: ${userWithId.avatar}</li></ul>`
          mailSignUp(subject,html)
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

        usuario = email;
        return done(null, user);
      });
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

app.use(
  session({
    secret: credenciales.SESSION_SECRET_KEY,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 600000,
    },
    rolling: true,
    resave: true,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

app.post(
  "/signup",
  passport.authenticate("signup", {
    successRedirect: "/login",
    failureMessage: true,
  })
);

app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/api/productos");
    logger.info(`${usuario} ha sido autenticado`);
  } else {
    return res.status(401).json({
      error: "401",
      descripcion: `Usuario no autenticado. Inicie sesión`,
    });
  }
});

app.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/login",
    failureMessage: true,
  })
);

app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarritos);

app.get("/logout", (req, res) => {
  req.logout();
  res.json(`${usuario} ha terminando la sesion`);
});

app.get("*", (req, res) => {
  next(error);
});

app.use(function (err, req, res, next) {
  logger.warn(`Ruta ${req.method} ${req.originalUrl} no implementada`);
  res.status(500).json({
    error: -2,
    descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada`,
  });
});

conectarDB(
  `mongodb+srv://${credenciales.MONGO_ATLAS_USER}:${credenciales.MONGO_ATLAS_PASSWORD}@${credenciales.MONGO_ATLAS_CLUSTER}/${credenciales.MONGO_ATLAS_DBNAME}?retryWrites=true&w=majority`,
  (err) => {
    if (err) return logger.error("error en conexión de base de datos", err);
    logger.info("BASE DE DATOS CONECTADA");
  }
);

const PORT = process.env.port || 8080;

const server = app.listen(PORT, () => {
  logger.info(`Servidor http escuchando en el puerto ${server.address().port}`);
});
server.on("error", (error) => logger.info(`Error en servidor ${error}`));
