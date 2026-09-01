import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: "ssibov",
  apiKey: import.meta.env.MICROCMS_API_KEY as string,
});