export function handleHttpRequest(req: Request): Response {
    const url = new URL(req.url);

    if (url.pathname === "/") {
        return new Response("Hello from Deno web server!", {
            headers: { "content-type": "text/plain" },
        });
    }

    return new Response("Not found", { status: 404 });
}
