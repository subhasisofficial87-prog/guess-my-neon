import { useState, useCallback } from "react";
import HomeScreen from "@/components/game/HomeScreen";
import SettingsModal from "@/components/game/SettingsModal";
import GameScreen from "@/components/game/GameScreen";
import CelebrationScreen from "@/components/game/CelebrationScreen";
import HowToPlayModal from "@/components/game/HowToPlayModal";
import HighScoresModal from "@/components/game/HighScoresModal";
import SetNumberScreen from "@/components/game/SetNumberScreen";
import HandoffScreen from "@/components/game/HandoffScreen";
import MultiplayerResults from "@/components/game/MultiplayerResults";
import { GameSettings, saveHighScore } from "@/lib/gameTypes";

type Screen =
  | "home"
  | "playing"
  | "won"
  | "mp-settings"
  | "mp-p1-set"
  | "mp-handoff-to-p2-set"
  | "mp-p2-set"
  | "mp-handoff-to-p2-guess"
  | "mp-p2-guessing"
  | "mp-handoff-to-p1-guess"
  | "mp-p1-guessing"
  | "mp-results";

const P1 = "Player 1";
const P2 = "Player 2";

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
  const [p1Secret, setP1Secret] = useState(0);
  const [p2Secret, setP2Secret] = useState(0);
  const [p1Attempts, setP1Attempts] = useState(0);
  const [p2Attempts, setP2Attempts] = useState(0);

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

  // Multiplayer flow
  const startMultiplayer = useCallback((s: GameSettings) => {
    setMpSettings(s);
    setSettingsOpen(false);
    setScreen("mp-p1-set");
  }, []);

  const handleP1Set = useCallback((num: number) => {
    setP1Secret(num);
    setScreen("mp-handoff-to-p2-set");
  }, []);

  const handleP2Set = useCallback((num: number) => {
    setP2Secret(num);
    setScreen("mp-handoff-to-p2-guess");
  }, []);

  const handleP2GuessWin = useCallback((attempts: number) => {
    setP2Attempts(attempts);
    setScreen("mp-handoff-to-p1-guess");
  }, []);

  const handleP1GuessWin = useCallback((attempts: number) => {
    setP1Attempts(attempts);
    setScreen("mp-results");
  }, []);

  const isMultiplayerMode = screen.startsWith("mp-");

  return (
    <>
      {screen === "home" && (
        <HomeScreen
          onStart={() => setSettingsOpen(true)}
          onMultiplayer={() => {
            setScreen("mp-settings");
            setSettingsOpen(true);
          }}
          onHowToPlay={() => setHowToPlayOpen(true)}
          onHighScores={() => setHighScoresOpen(true)}
        />
      )}

      {/* Solo */}
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

      {/* Multiplayer flow */}
      {screen === "mp-p1-set" && mpSettings && (
        <SetNumberScreen playerName={P1} settings={mpSettings} onSubmit={handleP1Set} />
      )}
      {screen === "mp-handoff-to-p2-set" && (
        <HandoffScreen
          nextPlayer={P2}
          message="It's your turn to pick a secret number."
          onReady={() => setScreen("mp-p2-set")}
        />
      )}
      {screen === "mp-p2-set" && mpSettings && (
        <SetNumberScreen playerName={P2} settings={mpSettings} onSubmit={handleP2Set} />
      )}
      {screen === "mp-handoff-to-p2-guess" && (
        <HandoffScreen
          nextPlayer={P2}
          message={`Guess ${P1}'s secret number!`}
          onReady={() => setScreen("mp-p2-guessing")}
        />
      )}
      {screen === "mp-p2-guessing" && mpSettings && (
        <GameScreen
          key="p2-guess"
          settings={mpSettings}
          secretNumber={p1Secret}
          onWin={handleP2GuessWin}
          onReset={() => {}}
          onHome={goHome}
          playerLabel={`${P2} guessing`}
        />
      )}
      {screen === "mp-handoff-to-p1-guess" && (
        <HandoffScreen
          nextPlayer={P1}
          message={`Now it's your turn to guess ${P2}'s number!`}
          onReady={() => setScreen("mp-p1-guessing")}
        />
      )}
      {screen === "mp-p1-guessing" && mpSettings && (
        <GameScreen
          key="p1-guess"
          settings={mpSettings}
          secretNumber={p2Secret}
          onWin={handleP1GuessWin}
          onReset={() => {}}
          onHome={goHome}
          playerLabel={`${P1} guessing`}
        />
      )}
      {screen === "mp-results" && (
        <MultiplayerResults
          p1Name={P1}
          p2Name={P2}
          p1Attempts={p1Attempts}
          p2Attempts={p2Attempts}
          p1Secret={p1Secret}
          p2Secret={p2Secret}
          onNewGame={() => {
            setScreen("mp-settings");
            setSettingsOpen(true);
          }}
          onHome={goHome}
        />
      )}

      <SettingsModal
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          if (screen === "mp-settings") setScreen("home");
        }}
        onStart={screen === "mp-settings" ? startMultiplayer : startGame}
      />
      <HowToPlayModal open={howToPlayOpen} onClose={() => setHowToPlayOpen(false)} />
      <HighScoresModal open={highScoresOpen} onClose={() => setHighScoresOpen(false)} />
    </>
  );
}
