import { useState, useCallback } from "react";
import HomeScreen from "@/components/game/HomeScreen";
import SettingsModal from "@/components/game/SettingsModal";
import GameScreen from "@/components/game/GameScreen";
import CelebrationScreen from "@/components/game/CelebrationScreen";
import HowToPlayModal from "@/components/game/HowToPlayModal";
import HighScoresModal from "@/components/game/HighScoresModal";
import { GameSettings, saveHighScore } from "@/lib/gameTypes";

type Screen = "home" | "playing" | "won";

export default function Index() {
  const [screen, setScreen] = useState<Screen>("home");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  const [highScoresOpen, setHighScoresOpen] = useState(false);
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [secretNumber, setSecretNumber] = useState(0);
  const [winAttempts, setWinAttempts] = useState(0);

  const startGame = useCallback((s: GameSettings) => {
    setSettings(s);
    const num = Math.floor(Math.random() * (s.max - s.min + 1)) + s.min;
    setSecretNumber(num);
    setSettingsOpen(false);
    setScreen("playing");
  }, []);

  const handleWin = useCallback((attempts: number) => {
    setWinAttempts(attempts);
    if (settings) {
      saveHighScore({
        difficulty: settings.difficulty,
        range: `${settings.min}–${settings.max}`,
        attempts,
        date: new Date().toLocaleDateString(),
      });
    }
    setScreen("won");
  }, [settings]);

  const resetGame = useCallback(() => {
    if (settings) startGame(settings);
  }, [settings, startGame]);

  const goHome = useCallback(() => {
    setScreen("home");
    setSettings(null);
  }, []);

  return (
    <>
      {screen === "home" && (
        <HomeScreen
          onStart={() => setSettingsOpen(true)}
          onHowToPlay={() => setHowToPlayOpen(true)}
          onHighScores={() => setHighScoresOpen(true)}
        />
      )}
      {screen === "playing" && settings && (
        <GameScreen
          settings={settings}
          secretNumber={secretNumber}
          onWin={handleWin}
          onReset={resetGame}
          onHome={goHome}
        />
      )}
      {screen === "won" && (
        <CelebrationScreen
          secretNumber={secretNumber}
          attempts={winAttempts}
          onNewGame={() => setSettingsOpen(true)}
        />
      )}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} onStart={startGame} />
      <HowToPlayModal open={howToPlayOpen} onClose={() => setHowToPlayOpen(false)} />
      <HighScoresModal open={highScoresOpen} onClose={() => setHighScoresOpen(false)} />
    </>
  );
}
