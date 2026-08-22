import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { AppRouter } from "./router";

export const orpc = createORPCClient<AppRouter>({
  link: new RPCLink({ url: "/rpc" }),
});
