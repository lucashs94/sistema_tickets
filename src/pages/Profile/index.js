import { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import Header from '../../components/Header'
import Title from '../../components/Title'

import { db, storage } from '../../services/firebaseConnection'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'

import { FiSettings, FiUpload } from 'react-icons/fi'
import avatar from '../../assets/avatar.png'
import { toast } from 'react-toastify'

import './profile.css'

export default function Profile(){

    const { user, storageUser, setUser, sign_Out } = useContext(AuthContext)

    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
    const [imageAvatar, setImageAvatar] = useState(null)

    const [nome, setNome] = useState(user && user.nome)
    const [email, setEmail] = useState(user && user.email)


    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0]

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setImageAvatar(image)
                setAvatarUrl(URL.createObjectURL(image))
            }else{
                alert('Apenas imagens do tipo JPEG ou PNG são aceitas')
                setImageAvatar(null)
                return
            }
        }
    }


    async function handleUpload(){
        const currentUid = user.uid
        const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}}`)
        
        uploadBytes(uploadRef, imageAvatar)
        .then((snapshot)=>{
            getDownloadURL(snapshot.ref).then(async(downloadURL)=>{
                let urlFoto = downloadURL

                const docRef = doc(db, 'users', user.uid)
                await updateDoc(docRef, {
                    avatarUrl: urlFoto,
                    nome: nome,
                })
                .then(()=>{
                    let data = {
                        ...user,
                        nome: nome,
                        avatarUrl: urlFoto,
                    }
                    setUser(data)
                    storageUser(data)
    
                    toast.success(`Dados atualizados com sucesso!!`,{
                        position: `top-right`,
                        pauseOnHover: false,
                      })
                })
            })
        })
    }


    async function handleSubmit(e){
        e.preventDefault()

        if(imageAvatar === null && nome !== ''){
            // Atualizar apenas o nome
            const docRef = doc(db, 'users', user.uid)
            await updateDoc(docRef,{
                nome: nome,
            })
            .then( () => {
                let data = {
                    ...user,
                    nome: nome,
                }
                setUser(data)
                storageUser(data)

                toast.success(`Dados atualizados com sucesso!!`,{
                    position: `top-right`,
                    pauseOnHover: false,
                  })
            })
        }else if(nome !== '' && imageAvatar !== null){

            // Atualizar nome e foto
            handleUpload()

        }

    }


    return(
        <div>
            <Header />

            <div className='content'>
                <Title name='Minha Conta'>
                    <FiSettings size={25}/>
                </Title>
            
            
                <div className='container'>
                    <form className='form-profile' onSubmit={handleSubmit}>
                        <label className='label-avatar'>
                            <span>
                                <FiUpload color='#FFF' size={25}/>
                            </span>

                            <input type='file' accept='image/*' onChange={handleFile}/> <br/>
                            {avatarUrl === null ? (
                                <img src={avatar} alt='Foto de perfil' width={100} height={250} />
                            ) : (
                                <img src={avatarUrl} alt='Foto de perfil' width={100} height={250} />
                            )}
                        </label>

                        <label>Nome</label>
                        <input 
                            type='text' 
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />

                        <label>Email</label>
                        <input type='text' value={email} disabled={true} />

                        <button type='submit'>Salvar</button>
                    </form>
                </div>

                {/* <div className='container'>
                    <button className='logout-btn' onClick={ ()=> sign_Out() }>Sair</button>
                </div> */}
            
            </div>
            
        </div>
    )
}
