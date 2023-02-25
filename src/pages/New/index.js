import { useState, useEffect, useContext } from 'react'

import { AuthContext } from '../../contexts/auth'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiPlusCircle } from 'react-icons/fi'
import './new.css'

import { db } from '../../services/firebaseConnection'
import { collection, getDocs, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'

import { useParams, useHistory } from 'react-router-dom'

const listRef = collection(db, 'customers')

export default function New(){

    const { user } = useContext(AuthContext)
    const { id } = useParams()
    const history = useHistory()

    const [customers, setCustomers] = useState([])
    const [loadCustomer, setLoadCustomer] = useState(true)
    const [customerSelected, setCustomerSelected] = useState(0)

    const [complemento, setComplemento] = useState('')
    const [assunto, setAssunto] = useState('Suporte')
    const [status, setStatus] = useState('Aberto')
    const [idCustomer, setIdCustomer] = useState(false)


    useEffect( () => {

        async function loadCustomers(){

            await getDocs(listRef)
            .then( (snapshot) => {
                let lista = []

                snapshot.forEach( (doc) => {
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    })
                })

                if(snapshot.docs.size === 0){
                    setCustomers([ { id: '1', nomeFantasia: 'FREELA'} ])
                    setLoadCustomer(false)
                    return
                }

                setCustomers(lista)
                setLoadCustomer(false)

                if(id){
                    loadId(lista)
                }


            })
            .catch((error) => {
                console.log(error)
                setLoadCustomer(false)
                setCustomers([ { id: '1', nomeFantasia: 'FREELA'} ])
            })

        }
        loadCustomers()

    }, [id])


    async function loadId(lista){
        const docRef = doc(db, 'chamados', id)
        await getDoc(docRef)
        .then((snapshot) => {
            setAssunto(snapshot.data().assunto)
            setStatus(snapshot.data().status)
            setComplemento(snapshot.data().complemento)

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
            setCustomerSelected(index + 1)
            setIdCustomer(true)
        })
        .catch((error) => {
            console.log(error)
            setIdCustomer(false)
        })
    }


    function handleOptionChange(e){
        setStatus(e.target.value)
    }

    function handleChangeSelect(e){
        setAssunto(e.target.value)
    }

    function handleChangeCustomer(e){
        setCustomerSelected(e.target.value)
    }

    
    async function handleRegister(e){
        e.preventDefault()

        if(idCustomer){
            //atualizando chamado
            const docRef = doc(db, 'chamados', id)
            await updateDoc(docRef, {
                cliente: customers[customerSelected - 1].nomeFantasia,
                clienteId: customers[customerSelected - 1].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                userId: user.uid,
            })
            .then(() => {
                toast.info(`Chamado atualizado com sucesso! `)

                setComplemento('')
                setCustomerSelected(0)
                
                history.push('/dashboard')
            })
            .catch((error) => {
                console.log(error)
                toast.error(`Erro ao atualizar este chamado...`)
            })
            return
        }

        await addDoc(collection(db, 'chamados'), {
            created: new Date(),
            cliente: customers[customerSelected - 1].nomeFantasia,
            clienteId: customers[customerSelected - 1].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid,
        })
        .then(() => {
            setComplemento('')
            setCustomerSelected(0)

            toast.success(`Chamado criado com sucesso!`,{
                position: `top-right`,
                pauseOnHover: false,
              })
            
            history.push('/dashboard')
        })
        .catch((error) => {
            toast.error("Erro ao registrar. Tente novamente mais tarde...")
        })
    }


    return(
        <div>
            <Header/>

            <div className='content'>
                <Title name={id ? 'Editando chamado' : 'Novo Chamado'}>
                    <FiPlusCircle size={25}/>
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Clientes</label>
                        {
                            loadCustomer ? (
                                <input type='text' disabled={true} value='Carregando...' />
                            ) : (
                                <select value={customerSelected} onChange={handleChangeCustomer}>
                                    <option value={'0'} disabled={true} >Escolha um cliente</option>

                                    {customers.map((item, index) => {
                                        return(
                                            <option key={index + 1} value={index + 1} >
                                                {item.nomeFantasia}
                                            </option>
                                        )
                                    })
                                    }
                                </select>
                            )
                        }

                        
                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value='Suporte'>Suporte</option>
                            <option value='Visita'>Visita Tecnica</option>
                            <option value='Financeiro'>Financeiro</option>
                        </select>
                        
                        <label className='status-label'>Status</label>
                        <div className='status'>
                            <div className='opt'>
                                <input
                                    id='1'
                                    type='radio'
                                    name='radio'
                                    value='Aberto'
                                    onChange={handleOptionChange}
                                    checked={ status === 'Aberto' }
                                />
                                <label htmlFor='1'>Em aberto</label>
                            </div>
                            <div className='opt'>
                                <input
                                    id='2'
                                    type='radio'
                                    name='radio'
                                    value='Progresso'
                                    onChange={handleOptionChange}
                                    checked={ status === 'Progresso' }
                                />
                                <label htmlFor='2'>Progresso</label>
                            </div>
                            <div className='opt'>
                                <input
                                    id='3'
                                    type='radio'
                                    name='radio'
                                    value='Atendido'
                                    onChange={handleOptionChange}
                                    checked={ status === 'Atendido' }
                                />
                                <label htmlFor='3'>Atendido</label>
                            </div>
                        </div>
                        
                        <label>Complemento</label>
                        <textarea
                            type='text'
                            placeholder='Descreve seu problema (opcional)'
                            value={complemento}
                            onChange={ (e) => setComplemento(e.target.value) }
                        />

                        <button type='submit'>Cria chamado</button>
                    </form>
                </div>
            </div>
        </div>
    )
}