export function handleWebSocket(req: Request): Response {
    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.addEventListener("open", () => {
        console.log("WebSocket client connected");
    });

    socket.addEventListener("message", (event) => {
        console.log("Received message:", event.data);
        socket.send("Pong");
    });

    socket.addEventListener("close", () => {
        console.log("WebSocket client disconnected");
    });

    return response;
}
