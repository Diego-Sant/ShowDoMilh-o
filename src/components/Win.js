import React from 'react'

const Win = ({winner, win}) => {
  return (
    <div>
        <h1>Você venceu!</h1>
        <h2>Você ganhou: {win.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}!</h2>
        <button onClick={winner}>Reiniciar</button>
    </div>
  )
}

export default Win