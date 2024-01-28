/**
 * gamebai-server deno project
 */
class Card {

  name: string;

  constructor(public rank: string, public suit: string) {
    this.suit = suit;
    this.rank = rank;
    this.name = `${suit}${rank}`;
  }

  getName() {
    return this.name;
  }
}

interface Card {
  rank: string;
  suit: string;
  getName(): string;
}

class Deck {
  cards: Card[];
  constructor() {
    this.cards = [];
    this.createDeck();
    this.shuffleDeck();
  }

  private createDeck(): void {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = ['3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace', '2'];

    for (let suit of suits) {
      for (let rank of ranks) {
        this.cards.push(new Card(rank, suit));
      }
    }
  }

  private shuffleDeck(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  public dealCards(numberOfCards: number): Card[] {
    return this.cards.splice(0, numberOfCards);
  }
}

const BOOK_ROUTE = new URLPattern({ pathname: "/books/:id" });
const HOME_ROUTE = new URLPattern({ pathname: "/" });
const SERVER_DATETIME_STREAM_ROUTE = new URLPattern({ pathname: "/stream" });
const WEB_SOCKET_ROUTE = new URLPattern({ pathname: "/websocket" });

Deno.serve({ hostname: "0.0.0.0" , port:8000}, (req) => {
  // 
  const match = BOOK_ROUTE.exec(req.url);
  const match_home_url = HOME_ROUTE.exec(req.url);
  const match_websocket_url = WEB_SOCKET_ROUTE.exec(req.url);
  const match_server_stream_url = SERVER_DATETIME_STREAM_ROUTE.exec(req.url);

  if (match) {
    const id = match.pathname.groups.id;
    return new Response(`Book ${id}`);
  }
  if (match_home_url) {
    return new Response("Welcome Deno Web App");
  }
  if (match_server_stream_url) {
    return new Response("Welcome Deno Web Streaming App");
  }


  if (match_websocket_url) {
    console.log("match_websocket_url");
    if (req.headers.get("upgrade") != "websocket") {
      return new Response(null, { status: 501 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.addEventListener("open", () => {
      console.log("WebSocket client connected!");
    });

    socket.addEventListener("message", (event) => {
      // if (event.data === "ping") {
      //   socket.send("pong");
      // }
      // if (event.data === "CHIA_BAI") {
      //   const obj = {
      //     command: "CHIA_BAI",
      //     numbers: [1, 2, 3],
      //   };
      //   const json = JSON.stringify(obj);
      //   socket.send(json)
      // }
      switch (event.data) {
        case "ping": socket.send("pong"); break;
        case "CHIA_BAI": socket.send("CHIA_BAI"); break;
        default: socket.send("Not Found"); break;
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