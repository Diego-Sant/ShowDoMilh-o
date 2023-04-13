import './GameOver.css'

const GameOver = ({tryAgain, money}) => {
  return (
    <div>
        <h1>Fim de Jogo!</h1>
        <h2>Você ganhou: {money.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</h2>
        <button onClick={tryAgain}>Reiniciar</button>
    </div>
  )
}

export default GameOver