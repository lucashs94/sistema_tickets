import { useState, createContext, useEffect } from 'react'
import { createUserWithEmailAndPassword,
         signOut,
         signInWithEmailAndPassword,
} from 'firebase/auth'
import { setDoc, 
         doc,
         getDoc,
} from 'firebase/firestore'
import { auth, db } from '../services/firebaseConnection'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'

export const AuthContext = createContext({})


export default function AuthProvider( {children} ){

  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(false)
  const [loading, setLoading] = useState(true)

  const history = useHistory()

  useEffect( () => {

    function loadStorage(){
      const storageUser = localStorage.getItem('@user_ticket')

      if(storageUser) {
        setUser(JSON.parse(storageUser))
        setLoading(false)
      }
      setLoading(false)
    } 
    loadStorage()
  },[])


  // Logar usuario que já existe
  async function sign_In(email, password){
    setLoadingAuth(true)
    
    await signInWithEmailAndPassword(auth, email, password)
    .then( async (value) => {
      let uid = value.user.uid
      const docRef = doc(db, 'users', uid)
      const userProfile = await getDoc(docRef)

      let data = {
        uid: uid,
        nome: userProfile.data().nome,
        avatarUrl: userProfile.data().avatarUrl,
        email: value.user.email,
      }
      
      setUser(data)
      storageUser(data)
      setLoadingAuth(false)

      toast.success(`Bem Vindo de volta :)`,{
        position: `top-right`,
        pauseOnHover: false,
      })

      history.push("/dashboard")
    })
    .catch( (error) => {
      console.log(error)
      setLoadingAuth(false)

      toast.error(`Login e/ou senha incorretos  =(`,{
        position: `top-center`,
        pauseOnHover: false,
      })
    })

  }

  // cadastrando usuario novo
  async function signUp(email, password, nome){
    setLoadingAuth(true)

    await createUserWithEmailAndPassword(auth, email, password)
    .then( async (value) => {
      let uid = value.user.uid
      let docRef = doc(db, 'users', uid)

      await setDoc(docRef, {
        nome: nome,
        avatarUrl: null,
      })
      .then( () => {
        let data = {
          uid: uid,
          nome: nome,
          email: value.user.email,
          avatarUrl: null,
        }

        setUser(data)
        storageUser(data)
        setLoadingAuth(false)
        
        toast.success(`Seja Bem Vindo!!`,{
          position: `top-center`,
          pauseOnHover: false,
        })

        history.push("/dashboard")      // navega o usuario cadastrado ate a area interna
      })
    })
    .catch( error => {
      console.log(error)

      toast.error(`Ops, algo deu errado :(`, {
        position: `top-center`,
        pauseOnHover: false,
      })
      setLoadingAuth(false)
    })
  }

  // salvando dados do USER no localStorage
  function storageUser(data) {      
    localStorage.setItem('@user_ticket', JSON.stringify(data))
  }

  // Fazer LogOut do usuario
  async function sign_Out(){
    await signOut(auth)
    localStorage.removeItem('@user_ticket')
    setUser(null)
  }


  return(
    <AuthContext.Provider 
      value={{ 
        signed: !!user,   // converte para boolean (!!)
        user, 
        loading, 
        signUp, 
        sign_Out,
        sign_In,
        loadingAuth,
        storageUser,
        setUser,
      }}
      >

      {children}
    </AuthContext.Provider>
  )
}
