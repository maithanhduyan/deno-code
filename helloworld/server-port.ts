import { serve } from "https://deno.land/std/http/server.ts";

serve((_request: Request) => {
  return new Response("Hello, world!");
}, { port: 8000 }); // Thay đổi 8000 bằng cổng bạn muốn sử dụng