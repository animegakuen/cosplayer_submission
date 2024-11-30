import fastify, { type FastifyInstance } from "fastify";

export class AppSingleton {
  private static _instance: AppSingleton;
  public app: FastifyInstance;

  constructor() {
    this.app = fastify();

    // Enable CORS
    this.app.addHook("preHandler", (req, reply, done) => {
      reply.header("Access-Control-Allow-Headers", "Content-Type");
      reply.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
      reply.header("Access-Control-Allow-Origin", "*");
      reply.header("Access-Control-Max-Age", "86400");

      if (/options/i.test(req.method)) {
        return reply.send();
      }

      done();
    });
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
}
