import { defineHandler } from "nitro";
import { useStorage } from "nitro/storage";

export default defineHandler(async (event) => {
  const storage = useStorage();
  
  // Get value
  const value = await storage.getItem("counter");
  const counter = value ? parseInt(value) : 0;
  
  // Increment
  const newCounter = counter + 1;
  await storage.setItem("counter", newCounter.toString());
  
  return { counter: newCounter };
});
