export interface Env {
  ASSETS: R2Bucket;
  WELCOME_OBJECT_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      const object = await env.ASSETS.get(env.WELCOME_OBJECT_KEY);
      if (object === null) {
        return new Response("Welcome content not found", {
          status: 500,
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
      }
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      if (!headers.has("content-type")) {
        headers.set("content-type", "text/html; charset=utf-8");
      }
      return new Response(object.body, { headers });
    }

    if (url.pathname === "/sample-500") {
      return new Response("Internal Server Error (sample)", {
        status: 500,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    if (url.pathname === "/favicon.ico") {
      return new Response("", { status: 204 });
    }

    return new Response("Not Found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  },
};

