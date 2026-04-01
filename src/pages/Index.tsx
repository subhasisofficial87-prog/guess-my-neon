import { useState, useCallback } from "react";
import HomeScreen from "@/components/game/HomeScreen";
import SettingsModal from "@/components/game/SettingsModal";
import GameScreen from "@/components/game/GameScreen";
import CelebrationScreen from "@/components/game/CelebrationScreen";
import HowToPlayModal from "@/components/game/HowToPlayModal";
import HighScoresModal from "@/components/game/HighScoresModal";
import MultiplayerSetup from "@/components/game/MultiplayerSetup";
import MultiplayerGameScreen from "@/components/game/MultiplayerGameScreen";
import MultiplayerResults from "@/components/game/MultiplayerResults";
import { GameSettings, GuessEntry, saveHighScore } from "@/lib/gameTypes";

type Screen = "home" | "playing" | "won" | "mp-setup" | "mp-playing" | "mp-results";

export default function Index() {
  const [screen, setScreen] = useState<Screen>("home");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  const [highScoresOpen, setHighScoresOpen] = useState(false);
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [secretNumber, setSecretNumber] = useState(0);
  const [winAttempts, setWinAttempts] = useState(0);

  // Multiplayer state
  const [mpSettings, setMpSettings] = useState<GameSettings | null>(null);
  const [mpSecret, setMpSecret] = useState(0);
  const [p1Name, setP1Name] = useState("Player 1");
  const [p2Name, setP2Name] = useState("Player 2");
  const [firstPlayer, setFirstPlayer] = useState<1 | 2>(1);
  const [p1Wins, setP1Wins] = useState(0);
  const [p2Wins, setP2Wins] = useState(0);
  // Results
  const [mpWinner, setMpWinner] = useState<1 | 2>(1);
  const [mpWinnerAttempts, setMpWinnerAttempts] = useState(0);
  const [mpLoserAttempts, setMpLoserAttempts] = useState(0);

  // Solo game
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
    setMpSettings(null);
  }, []);

  // Multiplayer
  const startMultiplayer = useCallback((s: GameSettings, name1: string, name2: string, first: 1 | 2) => {
    setMpSettings(s);
    setP1Name(name1);
    setP2Name(name2);
    setFirstPlayer(first);
    const num = Math.floor(Math.random() * (s.max - s.min + 1)) + s.min;
    setMpSecret(num);
    setScreen("mp-playing");
  }, []);

  const handleMpWin = useCallback((winner: 1 | 2, p1Guesses: GuessEntry[], p2Guesses: GuessEntry[]) => {
    setMpWinner(winner);
    setMpWinnerAttempts(winner === 1 ? p1Guesses.length : p2Guesses.length);
    setMpLoserAttempts(winner === 1 ? p2Guesses.length : p1Guesses.length);
    if (winner === 1) setP1Wins(w => w + 1);
    else setP2Wins(w => w + 1);
    setScreen("mp-results");
  }, []);

  const handleRematch = useCallback(() => {
    if (mpSettings) {
      const num = Math.floor(Math.random() * (mpSettings.max - mpSettings.min + 1)) + mpSettings.min;
      setMpSecret(num);
      setScreen("mp-playing");
    }
  }, [mpSettings]);

  return (
    <>
      {screen === "home" && (
        <HomeScreen
          onStart={() => setSettingsOpen(true)}
          onMultiplayer={() => setScreen("mp-setup")}
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

      {screen === "mp-setup" && (
        <MultiplayerSetup onStart={startMultiplayer} onBack={goHome} />
      )}
      {screen === "mp-playing" && mpSettings && (
        <MultiplayerGameScreen
          key={mpSecret}
          settings={mpSettings}
          secretNumber={mpSecret}
          p1Name={p1Name}
          p2Name={p2Name}
          firstPlayer={firstPlayer}
          p1Wins={p1Wins}
          p2Wins={p2Wins}
          onWin={handleMpWin}
          onHome={goHome}
        />
      )}
      {screen === "mp-results" && (
        <MultiplayerResults
          winnerName={mpWinner === 1 ? p1Name : p2Name}
          loserName={mpWinner === 1 ? p2Name : p1Name}
          winnerAttempts={mpWinnerAttempts}
          loserAttempts={mpLoserAttempts}
          secretNumber={mpSecret}
          winnerWins={mpWinner === 1 ? p1Wins : p2Wins}
          loserWins={mpWinner === 1 ? p2Wins : p1Wins}
          onRematch={handleRematch}
          onHome={goHome}
        />
      )}

      {screen !== "mp-setup" && (
        <SettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onStart={startGame}
        />
      )}
      <HowToPlayModal open={howToPlayOpen} onClose={() => setHowToPlayOpen(false)} />
      <HighScoresModal open={highScoresOpen} onClose={() => setHighScoresOpen(false)} />
    </>
  );
}
