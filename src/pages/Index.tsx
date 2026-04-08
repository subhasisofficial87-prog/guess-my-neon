import { useState, useCallback } from "react";
import HomeScreen from "@/components/game/HomeScreen";
import SettingsModal from "@/components/game/SettingsModal";
import GameScreen from "@/components/game/GameScreen";
import CelebrationScreen from "@/components/game/CelebrationScreen";
import HowToPlayModal from "@/components/game/HowToPlayModal";

import MultiplayerSetup from "@/components/game/MultiplayerSetup";
import MultiplayerGameScreen from "@/components/game/MultiplayerGameScreen";
import MultiplayerResults from "@/components/game/MultiplayerResults";
import SetNumberScreen from "@/components/game/SetNumberScreen";
import HandoffScreen from "@/components/game/HandoffScreen";
import { GameSettings, GuessEntry, saveHighScore } from "@/lib/gameTypes";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { type NumberMode } from "@/components/game/MultiplayerSetup";

type Screen =
  | "home" | "playing" | "won"
  | "mp-setup" | "mp-playing" | "mp-results"
  | "mp-p1-set" | "mp-handoff-to-p2-set" | "mp-p2-set" | "mp-handoff-to-game";

export default function Index() {
  const { user } = useAuth();
  const [screen, setScreen] = useState<Screen>("home");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [secretNumber, setSecretNumber] = useState(0);
  const [winAttempts, setWinAttempts] = useState(0);

  // Multiplayer state
  const [mpSettings, setMpSettings] = useState<GameSettings | null>(null);
  const [mpNumberMode, setMpNumberMode] = useState<NumberMode>("random");
  const [p1Name, setP1Name] = useState("Player 1");
  const [p2Name, setP2Name] = useState("Player 2");
  const [firstPlayer, setFirstPlayer] = useState<1 | 2>(1);
  const [p1Wins, setP1Wins] = useState(0);
  const [p2Wins, setP2Wins] = useState(0);
  // Secrets: in random mode both are the same; in players-choose p1Secret = what P1 guesses (set by P2), p2Secret = what P2 guesses (set by P1)
  const [p1Secret, setP1Secret] = useState(0);
  const [p2Secret, setP2Secret] = useState(0);
  // Results
  const [mpWinner, setMpWinner] = useState<1 | 2>(1);
  const [mpWinnerAttempts, setMpWinnerAttempts] = useState(0);
  const [mpLoserAttempts, setMpLoserAttempts] = useState(0);
  // For results: which number was guessed
  const [mpRevealedSecret, setMpRevealedSecret] = useState(0);

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
      // Save locally always
      saveHighScore({
        difficulty: settings.difficulty,
        range: `${settings.min}–${settings.max}`,
        attempts,
        date: new Date().toLocaleDateString(),
      });
      // Save to cloud if logged in
      if (user) {
        supabase.from("high_scores").insert({
          user_id: user.id,
          difficulty: settings.difficulty,
          range: `${settings.min}–${settings.max}`,
          attempts,
        }).then(() => {});
      }
    }
    setScreen("won");
  }, [settings, user]);

  const resetGame = useCallback(() => {
    if (settings) startGame(settings);
  }, [settings, startGame]);

  const goHome = useCallback(() => {
    setScreen("home");
    setSettings(null);
    setMpSettings(null);
  }, []);

  // Multiplayer
  const startMultiplayer = useCallback((s: GameSettings, name1: string, name2: string, first: 1 | 2, numberMode: NumberMode) => {
    setMpSettings(s);
    setP1Name(name1);
    setP2Name(name2);
    setFirstPlayer(first);
    setMpNumberMode(numberMode);

    if (numberMode === "random") {
      const num = Math.floor(Math.random() * (s.max - s.min + 1)) + s.min;
      setP1Secret(num);
      setP2Secret(num);
      setScreen("mp-playing");
    } else {
      // Players choose: P1 sets a number for P2 to guess first
      setScreen("mp-p1-set");
    }
  }, []);

  // P1 sets a number → this becomes p2Secret (what P2 will guess)
  const handleP1SetNumber = useCallback((num: number) => {
    setP2Secret(num);
    setScreen("mp-handoff-to-p2-set");
  }, []);

  // P2 sets a number → this becomes p1Secret (what P1 will guess)
  const handleP2SetNumber = useCallback((num: number) => {
    setP1Secret(num);
    setScreen("mp-handoff-to-game");
  }, []);

  const handleMpWin = useCallback((winner: 1 | 2, p1Guesses: GuessEntry[], p2Guesses: GuessEntry[]) => {
    setMpWinner(winner);
    setMpWinnerAttempts(winner === 1 ? p1Guesses.length : p2Guesses.length);
    setMpLoserAttempts(winner === 1 ? p2Guesses.length : p1Guesses.length);
    setMpRevealedSecret(winner === 1 ? p1Secret : p2Secret);
    if (winner === 1) setP1Wins(w => w + 1);
    else setP2Wins(w => w + 1);
    setScreen("mp-results");
  }, [p1Secret, p2Secret]);

  const handleRematch = useCallback(() => {
    if (!mpSettings) return;
    if (mpNumberMode === "random") {
      const num = Math.floor(Math.random() * (mpSettings.max - mpSettings.min + 1)) + mpSettings.min;
      setP1Secret(num);
      setP2Secret(num);
      setScreen("mp-playing");
    } else {
      setScreen("mp-p1-set");
    }
  }, [mpSettings, mpNumberMode]);

  const gameKey = `${p1Secret}-${p2Secret}`;

  return (
    <>
      {screen === "home" && (
        <HomeScreen
          onStart={() => setSettingsOpen(true)}
          onMultiplayer={() => setScreen("mp-setup")}
          onHowToPlay={() => setHowToPlayOpen(true)}
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

      {/* Players-choose flow */}
      {screen === "mp-p1-set" && mpSettings && (
        <SetNumberScreen
          playerName={p1Name}
          otherPlayerName={p2Name}
          settings={mpSettings}
          onSubmit={handleP1SetNumber}
        />
      )}
      {screen === "mp-handoff-to-p2-set" && (
        <HandoffScreen
          nextPlayer={p2Name}
          message="It's your turn to pick a secret number."
          onReady={() => setScreen("mp-p2-set")}
        />
      )}
      {screen === "mp-p2-set" && mpSettings && (
        <SetNumberScreen
          playerName={p2Name}
          otherPlayerName={p1Name}
          settings={mpSettings}
          onSubmit={handleP2SetNumber}
        />
      )}
      {screen === "mp-handoff-to-game" && (
        <HandoffScreen
          nextPlayer={firstPlayer === 1 ? p1Name : p2Name}
          message="Get ready to start guessing!"
          onReady={() => setScreen("mp-playing")}
        />
      )}

      {screen === "mp-playing" && mpSettings && (
        <MultiplayerGameScreen
          key={gameKey}
          settings={mpSettings}
          p1Secret={p1Secret}
          p2Secret={p2Secret}
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
          secretNumber={mpRevealedSecret}
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
      
    </>
  );
}
