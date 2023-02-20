import { useState, useContext } from 'react'
import { AuthContext } from '../../contexts/auth'

import './signin.css'

import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'

export default function SignIn() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { sign_In, loadingAuth } = useContext(AuthContext)

  async function handleSubmit(e){
    e.preventDefault()
    
    if(email !== '' && password !== ''){
      await sign_In(email, password)
    }
  }

  return (
    <div className="container-center">
      <div className='login'>
        <div className='login-area'>
          <img src={logo} alt='Sistema Logo' />
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Entrar</h1>
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

          <button type='submit'> {loadingAuth ? 'Carregando...' : 'Acessar'} </button>
        </form>

        <Link to='/register'>Criar uma conta</Link>
      </div>
    </div>
  );
}
  