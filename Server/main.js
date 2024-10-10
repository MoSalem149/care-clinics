const http = require("http");
const ngrok = require("@ngrok/ngrok");

// Create a simple HTTP server
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Congrats, you have created an ngrok web server!");
  })
  .listen(8080, () => console.log("Node.js web server at 8080 is running..."));

// Start ngrok to expose the server
ngrok
  .connect({ addr: 8080, authtoken_from_env: true })
  .then((listener) => console.log(`Ingress established at: ${listener.url()}`))
  .catch((err) => console.error("Error connecting to ngrok:", err));
