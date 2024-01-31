const HOME_ROUTE = new URLPattern({ pathname: "/" });
const WEB_SOCKET_ROUTE = new URLPattern({ pathname: "/websocket" });

Deno.serve({port:3001},async (req) => {
    const matchHomeUrl = HOME_ROUTE.exec(req.url);
    const matchWebSocketUrl = WEB_SOCKET_ROUTE.exec(req.url);

    if (matchHomeUrl) {
        return new Response("Welcome Deno Web App");
    }

    if (matchWebSocketUrl) {
        console.log("match_websocket_url");
        if (req.headers.get("upgrade") !== "websocket") {
            return new Response(null, { status: 501 });
        }

        const { socket, response } = Deno.upgradeWebSocket(req);

        socket.addEventListener("open", () => {
            console.log("WebSocket client connected!");
        });

        socket.addEventListener("message", async (event) => {
            if (event.data === "ping") {
                await socket.send("pong");
            }
            if (event.data === "CHIA_BAI") {
                const obj = {
                    command: "CHIA_BAI",
                    numbers: [1, 2, 3],
                };
                const json = JSON.stringify(obj);
                await socket.send(json);
            }
            if (event.data === "CHECK_BAI") {
                await socket.send("CHECK_BAI");
            }
            if (event.data === "STOP_GAME") {
                await socket.send("STOP_GAME");
            }
        });

        socket.addEventListener("close", (event) => {
            console.log("WebSocket client disconnected.");
        });

        return response;
    }

    // Nếu không khớp với bất kỳ route nào
    return new Response("Not Found", { status: 404 });
});
