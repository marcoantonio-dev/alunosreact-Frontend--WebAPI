import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import logoCadastro from './assets/logoCadastro.svg';


function App() {
  //https://localhost:44357/swagger/index.html
  const baseUrl = "https://localhost:44357/api/Aluno";
  const [data, setData] = useState([]);
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [updateData, setupdateData] = useState(true);


  const [alunoSelecionado, setAlunoSelecionado] = useState(
    {
      id: '',
      nome: '',
      email: '',
      idade: ''
    });

    const selecionarAluno = (aluno, opcao) => {
      setAlunoSelecionado(aluno);
      (opcao === "Editar") ?
      abrirFecharModalEditar() : abrirFecharModalExcluir()
    }

  const handleChange = e => {
    const { name, value } = e.target;
    setAlunoSelecionado({
      ...alunoSelecionado, [name]: value
    });
    console.log(alunoSelecionado);
  }

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  }

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const abrirFecharModalExcluir = () => {
    setModalExcluir(!modalExcluir);
  }

  const pedidoGet = async () => {
    await axios.get(baseUrl).then(response => {
      setData(response.data);
    }).catch(error => {
      console.log(error);
    });
  }
  const pedidoPost = async () => {
    delete alunoSelecionado.id;
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);
    await axios.post(baseUrl, alunoSelecionado)
      .then(response => {
        setData(data.concat(response.data));
        setupdateData(true);
        abrirFecharModalIncluir();
      }).catch(error => {
        if (error.response) {
          // O servidor retornou um código de status diferente de 2xx
          console.log("Erro de requisição:", error.response.data);
        } else if (error.request) {
          // A solicitação foi feita, mas não houve resposta do servidor
          console.log("Sem resposta do servidor:", error.request);
        } else {
          // Ocorreu um erro ao configurar a solicitação
          console.log("Erro ao configurar a solicitação:", error.message);
        }
      });
  }

  const pedidoPut = async() =>{
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);
    await axios.put(baseUrl+"/"+alunoSelecionado.id, alunoSelecionado)
    .then(response=>{
      var resposta=response.data;
      var dadosAuxiliar=data;
      dadosAuxiliar.map(aluno =>{
        if(aluno.id===alunoSelecionado){
          aluno.nome=resposta.nome;
          aluno.email=resposta.email;
          aluno.idade=resposta.idade;
        }
      });
      setupdateData(true);
      abrirFecharModalEditar();
    }).catch(error =>{
      console.log(error);
    })
  }

  const pedidoDelete = async() => {
    await axios.delete(baseUrl+ "/" + alunoSelecionado.id).then(response=>{
      setData(data.filter(aluno => aluno.id !== response.data));
      setupdateData(true);
        abrirFecharModalExcluir()
    }).catch(error =>{
      console.log(error);
    })
  }

  useEffect(() => {
    if(updateData){
      pedidoGet();
      setupdateData(false);
    }
  },[updateData]);



  return (
    <div className="aluno-container">
      <br />
      <h3>Cadastro de Alunos Via Web API C#</h3>
      <header>
        <img src={logoCadastro} alt='imagem do Cadastro' />
        <button className="btn btn-success" onClick={() => abrirFecharModalIncluir()}>Cadastrar Novo Aluno</button>
      </header>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map(aluno => (
            <tr key={aluno.id}>
              <td>{aluno.id}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.email}</td>
              <td>{aluno.idade}</td>
              <td>
                <button className="btn btn-primary" onClick={()=>selecionarAluno(aluno, "Editar")}>Editar</button> {" "}
                <button className="btn btn-danger" onClick={()=>selecionarAluno(aluno, "Excluir")}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={modalIncluir}>
        <ModalHeader>
          Incluir Alunos
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome: </label>
            <br />
            <input type='text' maxLength={80} required className='form-control' name="nome" onChange={handleChange} />
            <br />
            <label>Email: </label>
            <br />
            <input type='text' maxLength={100} required className='form-control' name="email" onChange={handleChange} />
            <br />
            <label>Idade: </label>
            <br />
            <input type='text' required className='form-control' name="idade" onChange={handleChange} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={() => pedidoPost()}>Incluir</button>{"    "}
          <button className='btn btn-danger' onClick={() => abrirFecharModalIncluir()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader> Editar Aluno </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID: </label>
            <input type="text" className='form-control' readOnly value={alunoSelecionado && alunoSelecionado.id}/>
            <br/>
            <label>Nome: </label>
            <br />
            <input type='text' maxLength={80} required className='form-control' name="nome" onChange={handleChange} value={alunoSelecionado && alunoSelecionado.nome}/>
            <br />
            <label>Email: </label>
            <br />
            <input type='text' maxLength={100} required className='form-control' name="email" onChange={handleChange} value={alunoSelecionado && alunoSelecionado.email}/>
            <br />
            <label>Idade: </label>
            <br />
            <input type='text' required className='form-control' name="idade" onChange={handleChange} value={alunoSelecionado && alunoSelecionado.idade}/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={() => pedidoPut()}>Editar</button>{"    "}
          <button className='btn btn-danger' onClick={() => abrirFecharModalIncluir()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirmar a exclusão deste(a) aluno(a): {alunoSelecionado && setAlunoSelecionado.nome} ?
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-danger' onClick={() => pedidoDelete()}> Sim </button>
          <button className='btn btn-secondary' onClick={() => abrirFecharModalExcluir()}> Não </button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;
