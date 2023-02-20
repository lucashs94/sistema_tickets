import { useState, useContext } from 'react'
import { AuthContext } from '../../contexts/auth'

import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'

export default function SignUp() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')

  const { signUp, loadingAuth } = useContext(AuthContext)

  async function handleSubmit(e){
    e.preventDefault()
    
    if(nome !== '' && email !== '' && password !== ''){
      await signUp(email, password, nome)
    }
  }

  return (
    <div className="container-center">
      <div className='login'>
        <div className='login-area'>
          <img src={logo} alt='Sistema Logo' />
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Cadastrar</h1>
          <input 
            type='text' 
            placeholder='Seu nome...' 
            value={nome}
            onChange={ e => setNome(e.target.value)}
          />
          <input 
            type='text' 
            placeholder='email@email.com' 
            value={email}
            onChange={ e => setEmail(e.target.value)}
          />
          <input 
            type='password' 
            placeholder='************' 
            value={password}
            onChange={ e => setPassword(e.target.value)}
          />

          <button type='submit'> {loadingAuth ? 'Carregando...' : 'Cadastrar'} </button>
        </form>

        <Link to='/'>Já tem uma conta? Faça login</Link>
      </div>
    </div>
  );
}
  