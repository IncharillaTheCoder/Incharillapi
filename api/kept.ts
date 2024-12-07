import { serve } from "bun";

let isKeptAlive = false;
let botProcess: Bun.ChildProcess | null = null;

// Function to start the bot
function startBot() {
  if (botProcess) {
    console.log("Bot is already running!");
    return;
  }

  console.log("Starting the bot...");
  botProcess = Bun.spawn(["bun", "run", "index.ts"], {
    stdout: "inherit",
    stderr: "inherit",
  });
}

// Function to stop the bot
function stopBot() {
  if (!botProcess) {
    console.log("Bot is not running!");
    return;
  }

  console.log("Stopping the bot...");
  botProcess.kill();
  botProcess = null;
}

// Server to handle the API requests and control the bot
serve({
  fetch(req) {
    const url = new URL(req.url);

    // Route to start the bot
    if (url.pathname === "/GET/KEPT") {
      if (isKeptAlive) {
        return new Response("Bot is already KEPT alive.", { status: 200 });
      }
      isKeptAlive = true;
      startBot();
      return new Response("Bot is now KEPT alive.", { status: 200 });
    }

    // Route to stop the bot
    if (url.pathname === "/GET/UNKEPT") {
      if (!isKeptAlive) {
        return new Response("Bot is already UNKEPT.", { status: 200 });
      }
      isKeptAlive = false;
      stopBot();
      return new Response("Bot is now UNKEPT and stopped.", { status: 200 });
    }

    return new Response("Invalid route", { status: 404 });
  },
});
