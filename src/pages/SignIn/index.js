import { useState } from 'react'
import { useAuth } from '../../contexts/auth'

import logo from '../../assets/logo.png'
import { Link, Redirect } from 'react-router-dom'

import './signin.css'

export default function SignIn() {
  
  const { sign_In, loadingAuth, signed } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if(signed){
    return <Redirect to='/dashboard' /> 
  }


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
  