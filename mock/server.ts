import { setupWorker } from "msw/browser"; // ✅ Use browser API, NOT "msw/node"
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
