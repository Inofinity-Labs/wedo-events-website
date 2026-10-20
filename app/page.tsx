import { HomePage } from "@/components/HomePage";

// Re-fetch the event list at most every 5 minutes.
export const revalidate = 300;

export default function Home() {
  return <HomePage hero="futuristic" theme="glass" version="a" />;
}
