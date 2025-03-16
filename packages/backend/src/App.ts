import fastify, { type FastifyReply, type FastifyInstance } from "fastify";

export class AppSingleton {
  private static _instance: AppSingleton;
  public app: FastifyInstance;

  constructor() {
    this.app = fastify({
      bodyLimit: 100000000,
    });

    // Enable CORS
    this.app.addHook("preHandler", (req, reply, done) => {
      this.addCors(reply);

      if (/options/i.test(req.method)) {
        return reply.send();
      }

      done();
    });

    this.app.addHook("onSend", (_request, reply, _payload, done) => {
      this.addCors(reply);

      done();
    });
  }

  public addCors(reply: FastifyReply): void {
    reply.header("Access-Control-Allow-Headers", "Content-Type");
    reply.header("Access-Control-Allow-Methods", "POST, GET, PATCH, OPTIONS");
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Max-Age", "86400");
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
}
