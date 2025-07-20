import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, Play, Pause, Download, RotateCcw, Sparkles, BookOpen, Volume2, Key } from "lucide-react";

interface Story {
  text: string;
  audioUrl?: string;
}

export const ChayaBot = () => {
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState<Story | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [apiKey, setApiKey] = useState("");

  const generateAudio = async (text: string): Promise<string> => {
    if (!apiKey) {
      throw new Error("Please enter your ElevenLabs API key");
    }

    const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x", {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
      throw new Error("Failed to generate audio");
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (!apiKey.trim()) {
      alert("Please enter your ElevenLabs API key");
      return;
    }
    
    setIsGenerating(true);
    setGenerationStep("Writing your story...");
    
    try {
      // Generate story text
      const storyText = `Once upon a time, there was a magnificent ${prompt}. The story unfolds with magical adventures, filled with wonder and excitement. Each moment brought new discoveries and the characters learned valuable lessons along their journey. The tale concluded with wisdom and joy, leaving everyone with a sense of fulfillment and magic.`;
      
      setGenerationStep("Creating audio narration...");
      
      // Generate audio
      const audioUrl = await generateAudio(storyText);
      
      setStory({
        text: storyText,
        audioUrl: audioUrl
      });
      setIsGenerating(false);
      setGenerationStep("");
    } catch (error) {
      console.error("Error generating story:", error);
      alert("Error generating story. Please check your API key and try again.");
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
    <div 
      className="absolute opacity-20 floating-animation"
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );

  const LoadingAnimation = () => (
    <div className="flex flex-col items-center space-y-6 py-12">
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 bg-primary rounded-full typing-dots"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
      <div className="flex space-x-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-1 h-8 bg-gradient-magical rounded-full wave-animation"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <p className="text-muted-foreground font-medium">{generationStep}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Floating Background Elements */}
      <FloatingElement delay={0}>
        <BookOpen className="w-16 h-16 text-primary" style={{ top: "10%", left: "10%" }} />
      </FloatingElement>
      <FloatingElement delay={1}>
        <Sparkles className="w-12 h-12 text-secondary" style={{ top: "20%", right: "15%" }} />
      </FloatingElement>
      <FloatingElement delay={2}>
        <Volume2 className="w-14 h-14 text-accent" style={{ bottom: "20%", left: "20%" }} />
      </FloatingElement>
      <FloatingElement delay={3}>
        <BookOpen className="w-10 h-10 text-primary" style={{ top: "60%", right: "10%" }} />
      </FloatingElement>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-magical bg-clip-text text-transparent mb-6">
            ChayaBot
          </h1>
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold text-foreground mb-4">
            Your Story, Now Spoken
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Turn any idea into a narrated story in seconds. Just describe your concept and watch it come to life.
          </p>
        </div>

        {/* Input Interface */}
        <Card className="max-w-4xl mx-auto p-8 shadow-magical bg-card/80 backdrop-blur-sm border-primary/20 mb-12">
          <div className="space-y-6">
            <div className="relative">
              <Textarea
                placeholder="Enter your idea... (e.g., 'a tree and a carpenter')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] text-lg resize-none border-2 border-primary/20 focus:border-primary bg-input/50 backdrop-blur-sm rounded-2xl p-6"
                disabled={isGenerating}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-4 right-4 text-muted-foreground hover:text-primary"
              >
                <Mic className="w-5 h-5" />
              </Button>
            </div>
            
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full magical-button text-lg py-6 pulse-glow"
            >
              {isGenerating ? (
                <>
                  <div className="flex space-x-1 mr-3">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-white rounded-full typing-dots"
                        style={{ animationDelay: `${i * 0.3}s` }}
                      />
                    ))}
                  </div>
                  Creating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate & Narrate
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Loading Animation */}
        {isGenerating && (
          <Card className="max-w-4xl mx-auto shadow-soft bg-card/60 backdrop-blur-sm border-primary/10">
            <LoadingAnimation />
          </Card>
        )}

        {/* Story Output */}
        {story && !isGenerating && (
          <Card className="max-w-4xl mx-auto p-8 shadow-magical bg-gradient-story border-primary/20">
            <div className="space-y-8">
              {/* Story Text */}
              <div className="relative">
                <h3 className="text-2xl font-playfair font-semibold mb-6 text-center text-foreground">
                  Your Story
                </h3>
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 max-h-80 overflow-y-auto border border-primary/10">
                  <p className="story-text">{story.text}</p>
                </div>
              </div>

              {/* Audio Player */}
              <div className="bg-card/70 backdrop-blur-sm rounded-2xl p-6 border border-primary/10">
                <h4 className="text-lg font-playfair font-semibold mb-4 text-center">
                  Audio Narration
                </h4>
                
                {/* Audio Controls */}
                <div className="flex justify-center items-center space-x-4 mb-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (audioRef) {
                        if (isPlaying) {
                          audioRef.pause();
                        } else {
                          audioRef.play();
                        }
                        setIsPlaying(!isPlaying);
                      } else if (story?.audioUrl) {
                        const audio = new Audio(story.audioUrl);
                        audio.onended = () => setIsPlaying(false);
                        audio.onpause = () => setIsPlaying(false);
                        audio.onplay = () => setIsPlaying(true);
                        setAudioRef(audio);
                        audio.play();
                        setIsPlaying(true);
                      }
                    }}
                    className="w-16 h-16 rounded-full border-2 border-primary/30 hover:border-primary hover:bg-primary/10"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </Button>
                </div>

                {/* Waveform Visualization */}
                <div className="flex justify-center items-center space-x-1 mb-6">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 bg-gradient-magical rounded-full transition-all duration-300 ${
                        isPlaying ? 'wave-animation' : 'h-2'
                      }`}
                      style={{
                        height: isPlaying ? `${Math.random() * 30 + 10}px` : '8px',
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={handleGenerate}
                    className="border-primary/30 hover:border-primary hover:bg-primary/10"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Replay
                  </Button>
                  <Button
                    variant="outline"
                    className="border-primary/30 hover:border-primary hover:bg-primary/10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Audio
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Featured Stories Section */}
        {!isGenerating && !story && (
          <div className="max-w-6xl mx-auto mt-20">
            <h3 className="text-3xl font-playfair font-semibold text-center mb-12 text-foreground">
              Featured Stories
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                "A magical forest and a lost child",
                "A brave robot and a distant planet",
                "An ancient book and a curious librarian"
              ].map((samplePrompt, i) => (
                <Card 
                  key={i}
                  className="p-6 shadow-soft bg-card/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 cursor-pointer hover:scale-105"
                  onClick={() => setPrompt(samplePrompt)}
                >
                  <div className="text-center">
                    <BookOpen className="w-8 h-8 text-primary mx-auto mb-4" />
                    <p className="font-playfair text-lg text-foreground mb-4">"{samplePrompt}"</p>
                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                      <Play className="w-4 h-4 mr-2" />
                      Try This Story
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};