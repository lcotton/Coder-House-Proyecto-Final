import express from "express";
const app = express();
import { routerProductos } from "./api/routerProductos.js";
import { routerCarritos } from "./api/routerCarritos.js";
import logger from "./utils/logger.js";
import passport from "./controller/auth.js";
import parseArgs from "minimist";
import jwt from "jsonwebtoken";


app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarritos);

app.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    res.json({
      message: "Signup realizado con éxito",
      user: req.user,
    });
  }
);

app.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An error occurred.");

        return res.status(401).json({
          error: "401",
          descripcion: `Autenticación Invalida`,
        });
      }

      req.login(user, { session: false }, async (error) => {
        if (error)
          return res.status(401).json({
            error: "401",
            descripcion: `Autenticación Invalida`,
          });

        const body = {
          _id: user._id,
          email: user.email,
          nombre: user.nombre,
          telefono: user.telefono,
        };
        const token = jwt.sign({ user: body }, "coderhouse", {
          expiresIn: "600s",
        });

        return res.json({ token });
      });
    } catch (error) {
      return res.json(error);
    }
  })(req, res, next);
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

const options = {
  alias: {
    p: "puerto",
  },
  default: {
    puerto: 8080,
  },
};

const commandLineArgs = process.argv.slice(2);

const { puerto } = parseArgs(commandLineArgs, options);

const PORT = process.env.PORT || puerto;

const server = app.listen(PORT, () => {
  logger.info(`Servidor http escuchando en el puerto ${server.address().port}`);
});
server.on("error", (error) => logger.info(`Error en servidor ${error}`));
