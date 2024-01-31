import { serve } from "../deps.ts";
import { handleWebSocket } from "./websocket.ts";
import { handleHttpRequest } from "./http.ts";
import { PORT } from "../config.ts";

export function startServer() {
    console.log(`Server is running on http://localhost:${PORT}`);

    serve((req) => {
        if (req.headers.get("upgrade") === "websocket") {
            return handleWebSocket(req);
        } else {
            return handleHttpRequest(req);
        }
    }, { port: PORT });
}
