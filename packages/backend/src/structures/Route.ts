import { AppSingleton } from "../App";
import { RouteHandlerMethod } from "fastify";

interface RouteOptions {
  callback: RouteHandlerMethod;
  endpoint?: string;
  method: "get" | "post";
}

export class Route {
  private route: string;
  private app = AppSingleton.instance.app;

  constructor(route: string) {
    this.route = route;
  }

  get(callback: RouteHandlerMethod, endpoint?: string) {
    this.register({ callback, endpoint, method: "get" });
  }

  post(callback: RouteHandlerMethod, endpoint?: string) {
    this.register({ callback, endpoint, method: "post" });
  }

  register(options: RouteOptions) {
    let endpoint = `${this.route}`;
    if (options.endpoint) {
      if (options.endpoint.indexOf("/") === -1) {
        endpoint += "/";
      }

      endpoint += `${options.endpoint}`;
    }

    this.app[options.method](endpoint, options.callback);
  }
}
