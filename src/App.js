import './App.css';

import {useCallback, useEffect, useState} from "react";
import {wordsList} from './data/words';

import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';
import Win from './components/Win';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
  {id: 4, name: "win"}
]

function removeAccents(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [usedLetters, setUsedLetters] = useState([]);
  const [guesses, setGuesses] = useState(15);
  const [score, setScore] = useState(0);

  // Mutar a música
  const [muted, setMuted] = useState(false);

  // Deixar funcional o mute do site
  useEffect(() => {
    const audioElement = document.getElementById('background-music');
    audioElement.volume = muted ? 0 : 0.05;
  }, [muted]);
  

  const pickWordAndCategory = useCallback(() => {
    // Selecionar uma categoria aleatória
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    // Selecionar uma palavra aleatória de acordo com a categoria
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return {word, category};
  }, [words]);

  const startGame = useCallback(() => {
    clearLetterStates();

    // Selecionar uma palavra e a dica quando clicar no botão
    const {word, category} = pickWordAndCategory();

    const diacritics = require("diacritics"); // Baixar biblioteca diacritics para diferenciar o acento
    let wordLetters = diacritics.remove(word.toLowerCase()).split(""); // Remover letras maiúsculas e acentos

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {
    const normalizedLetter = removeAccents(letter);

    if (guessedLetters.map(removeAccents).includes(normalizedLetter) || wrongLetters.map(removeAccents).includes(normalizedLetter)) {
      return;
    }
  
    if(letters.map(removeAccents).includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [...actualGuessedLetters, normalizedLetter])
    } else {
      setWrongLetters((actualWrongLetters) => [...actualWrongLetters, normalizedLetter]);
      setUsedLetters((actualUsedLetters) => [...actualUsedLetters, normalizedLetter]);
    }
  
    setGuesses((actualGuesses) => actualGuesses - 1);
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  useEffect(() => {
    if(guesses <= 0) {
      clearLetterStates()

      setGameStage(stages[2].name);
    }
  }, [guesses])

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    if(guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name) {
      // Adicionar pontos
      setScore((actualScore) => actualScore += 100000)

      //Começar o jogo com outra palavra
      setGuesses(15);
      startGame();
    }
  }, [guessedLetters, letters, startGame, gameStage])

  useEffect(() => {
    if(score === 1000000) {
      clearLetterStates()

      setGameStage(stages[3].name);
    }
  }, [score])

  const retry = () => {
    setScore(0);
    setGuesses(15);

    setGameStage(stages[0].name);
  }

  // Desmutar a música de fundo
  const toggleMute = () => {
    setMuted(!muted);
  }

  return (
    <div className="App">
      {/* Áudio para adicionar a música de fundo, o Math.random foi utilizado pois ao apertar F5 a música parava, com isso a música funciona todas as vezes */}
      <audio id="background-music" src={`${process.env.PUBLIC_URL}/ShowdoMilhao.mp3?v=${Math.random()}`} autoPlay loop></audio>
      {gameStage === "start" && <StartScreen buttonStart={startGame} />}
      {gameStage === "game" && <Game checkLetter={verifyLetter} wordChosen={pickedWord} categoryChosen={pickedCategory} alphabeticLetter={letters} letterAttempted={guessedLetters} wrongAttempt={wrongLetters} attempts={guesses} gameScore={score} mutedButton={muted} muteButton={toggleMute} usedLetters={usedLetters}/>}
      {gameStage === "end" && <GameOver tryAgain={retry} money={score}/>}
      {gameStage === "win" && <Win winner={retry} win={score}/>}
    </div>
  );
}

export default App;
