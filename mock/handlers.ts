import { rest } from "msw";
import { fakeUsers, findUser, validateToken } from "./db";

// Mock Login API
export const handlers = [
  rest.post("https://mockapi.com/login", async (req, res, ctx) => {
    const { username, password } = await req.json();
    const user = findUser(username, password);

    if (!user) {
      return res(ctx.status(401), ctx.json({ error: "Invalid username or password" }));
    }

    return res(ctx.status(200), ctx.json({ user, token: user.token }));
  }),

  // Mock Profile API (Requires Authentication)
  rest.get("https://mockapi.com/profile", async (req, res, ctx) => {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const user = validateToken(token || "");

    if (!user) {
      return res(ctx.status(401), ctx.json({ error: "Unauthorized" }));
    }

    return res(ctx.status(200), ctx.json({ id: user.id, username: user.username, email: user.email }));
  }),
];
