import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import Agent from '@/components/ui/agent';

export default async function Home() {
  const sessionConfig = JSON.stringify({
    session: {
      type: "realtime",
      model: "gpt-realtime",
    },
  });

  const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: sessionConfig,
  });

  const data = await response.json();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <main className="flex-1 flex container mx-auto px-4 pt-24 pb-12">
        <Agent openAIEphemeralKey={data.value} />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
