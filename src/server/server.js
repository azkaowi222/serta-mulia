const Hapi = require("@hapi/hapi");
const routes = require("../server/routes.js");
const loadModel = require("../services/loadModel.js");
const InputError = require("../exceptions/InputError.js");

require("dotenv").config();

(async () => {
  const server = Hapi.server({
    host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost",
    port: 3000,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });
  server.route(routes);
  const model = await loadModel();
  server.app.model = model;

  server.ext("onPreResponse", function (request, h) {
    const response = request.response;
    if (response instanceof InputError) {
      const newResponse = h.response({
        status: "fail",
        message: `${response.message} Silakan gunakan foto lain.`,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    if (response.isBoom) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(500);
      return newResponse;
    }
    return h.continue;
  });
  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
})();
