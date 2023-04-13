import './Game.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef } from 'react';
import acertoSom from '../assets/Acerto.mp3';

// Ao repetir a palavra com letra minúscula/maiúscula, letra com acento ou Ç, caso a vogal ou o C já tenham sido selecionados, dará como letra repetida

function removeAccents(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

const Game = ({checkLetter, wordChosen, categoryChosen, alphabeticLetter, letterAttempted, wrongAttempt, attempts, gameScore, muteButton, mutedButton}) => {
  const [letter, setLetter] = useState("");
  const [usedLetters, setUsedLetters] = useState([]);
  const [error, setError] = useState(false);
  const [showingRight, setShowingRight] = useState("");
  const letterInputRef = useRef(null);
  const audioRef = useRef(new Audio(acertoSom));

  const regex = /^[a-zA-Z]+$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedLetter = removeAccents(letter.toLowerCase());

    if (!regex.test(cleanedLetter)) {
      setError("Por favor, insira apenas letras.");
      letterInputRef.current.classList.add("error");
      setTimeout(() => {
        letterInputRef.current.classList.remove("error");
        setError("");
      }, 2000); // Oculta a mensagem após 2 segundos
      return;
    }

    checkLetter(cleanedLetter);
    setLetter("");
    setUsedLetters([...usedLetters, cleanedLetter]);
    letterInputRef.current.focus();

    if (wordChosen.includes(cleanedLetter)) {
      setShowingRight("correct-letter");
      audioRef.current.play();
      setTimeout(() => {
        setShowingRight("");
      }, 1000)
    }
  }
  
  return (
    <div className='game'>
        <p className='points'>
          {/* Adionar o R$ e a vírgula depois do número */}
          <span>Ganhos: {gameScore.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
        </p>
        {/* Botão que muta a música de fundo de acordo com o ícon do fontawesome */}
        <button onClick={muteButton}>
          <FontAwesomeIcon icon={mutedButton ? faVolumeMute : faVolumeUp}/>
        </button>
        <h1>Adivinhe a palavra: </h1>
        {/* Pega a categoria que foi selecionada aleatóriamente */}
        <h3 className='tip'>Dica sobre a palavra: <span>{categoryChosen}</span></h3>
        {/* Pega o número de tentativas que já foi determinado */}
        <p>Você ainda tem {attempts} tentativas</p>
        {/* Código para personalizar a letra caso tenha uma, ou adicionar um espaço em branco caso esteja vazio */}
        <div className='wordContainer'>
          {alphabeticLetter.map((letter, i) => (
            letterAttempted.includes(letter) ? (
              <span key={i} className={`letter ${showingRight}`}>{letter}</span>
            ) : (
              <span key={i} className={letter === " " ? "" : "blankSquare"}>
              </span>
            )
          ))}
        </div>
        <div className="letterContainer">
          <p className='tinyTip'>Não é preciso colocar acento e ç na tentativa</p>
          <p>Tente adivinhar uma letra da palavra: </p>
          <form onSubmit={handleSubmit}>
            <div className='input-container'>
              <input type="text" name="letter" maxLength="1" required onChange={(e) => setLetter(e.target.value)} value={letter} ref={letterInputRef}/>
              {error && <span className='error-message'>{error}</span>}
            </div>
            <button>Jogar!</button>
          </form>
        </div>
        <div className="wrongLettersContainers">
          <p>Letras erradas: {wrongAttempt.map((letter, i) => (
            <span key={i}>{letter}, </span>
          ))}</p>
        </div>
    </div>
  ) 
}

export default Game