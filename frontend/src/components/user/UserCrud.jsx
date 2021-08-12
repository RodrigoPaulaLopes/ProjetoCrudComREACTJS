import react, {Component, components} from 'react'
import Main from '../template/Main'
import Axios from 'axios'

const baseURL = 'http://localhost:3001/users'

const initialState ={
    user: {name: '', email: ''},
    list: []
}
const headerProps = {
    icon: 'users',
    title: 'Usuarios', 
    subtitle: 'cadastro de usuarios: Incluir, Listar, Alterar e Excluir '
}
export default class UserCrud extends Component{

    state ={...initialState}

    componentWillMount(){
        Axios(baseURL).then(resp => { 
            this.setState({list: resp.data})
        })
    }


    clear(){
        this.setState({user: initialState.user })
    }
    save(){
        const user = this.state.user
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseURL}/${user.id}`: baseURL
        Axios[method](url,user)
        .then(resp => {
            const list = this.getUpdatedList(resp.data)
            this.setState({user: initialState.user, list})
            list.unshift(user)
            return list
        })
    }

    getUpdatedList(user){
        const list = this.state.list.filter(u => u.id !== user.id)
    }

    updateField(event){
        const user = {...this.state.user}
        user[event.target.name] = event.target.value
        this.setState({user})
    }

    renderForm(){
        return(
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome:</label>
                            <input type="text" className="form-control" name="name" value={this.state.user.name} onChange ={e => this.updateField(e)} placeholder="Digite seu Nome" />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Email:</label>
                            <input type="text" className="form-control" name="email" value={this.state.user.email} onChange ={e => this.updateField(e)} placeholder="Digite seu Email" />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary" onClick={e => this.save(e)}>Salvar</button>
                        <button className="btn btn-secundary ml-2" onClick={e => this.clear(e)}>Cancelar</button>
                    </div>
                </div>
            </div>
        )
    }
    state = {...initialState}
    load(user){
        this.setState({user})
    }
    remove(user){
        Axios.delete(`${baseURL}/${user.id}`).then(resp => {
            const list = this.state.list.filter(u => u !== user)
            this.setState({list})
        })
    }

    renderTable(){
        return (
            <table className="table mt-4">
                <thead>
                    <th>Id</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Ações</th>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
        
    }
    renderRows(){
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <button className="btn btn-warning" onClick={ () => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2" onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }
    render(){
        return (
            <Main {...headerProps}>
                Cadastro de usuarios
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}