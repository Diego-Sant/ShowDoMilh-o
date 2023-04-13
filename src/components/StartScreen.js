import './StartScreen.css'

const StartScreen = ({buttonStart}) => {
  return (
    <div className="start">
        <h1>Show do Milhão</h1>
        <button onClick={buttonStart}>Começar</button>
    </div>
  )
}

export default StartScreen