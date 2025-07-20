import { useState } from "react";

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (response.ok) {
        setStory(data.story);
        setAudioUrl(data.audio);
      } else {
        console.error("Server Error:", data.error || data.details);
      }
    } catch (error) {
      console.error("Client Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chaya Tales Generator</h1>
      <input
        type="text"
        placeholder="Enter a story topic..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Story"}
      </button>

      {story && (
        <div className="mt-6">
          <h2 className="font-semibold text-lg">Generated Story:</h2>
          <p className="mt-2 whitespace-pre-wrap">{story}</p>
        </div>
      )}

      {audioUrl && (
        <div className="mt-4">
          <h2 className="font-semibold text-lg">Listen to Story:</h2>
          <audio controls src={audioUrl} className="mt-2 w-full" />
        </div>
      )}
    </div>
  );
};

export default App;
