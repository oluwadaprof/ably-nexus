import Ably from "ably/promises";

const rest = new Ably.Rest(process.env.ABLY_API_KEY);

app.get("/ably/auth", (req, res) => {
  const tokenParams = {
    clientId: "my-client-id",
  };
  rest.auth.createTokenRequest(tokenParams, (err, tokenRequest) => {
    if (err) {
      res.status(500).send("Error requesting token: " + JSON.stringify(err));
    } else {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(tokenRequest));
    }
  });
});