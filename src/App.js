import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import logoCadastro from './assets/logoCadastro.svg';


function App() {

  const baseUrl = "https://localhost:44357/api/Aluno";
  const [data, setData] = useState([]);
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);

  const [alunoSelecionado, setAlunoSelecionado] = useState(
    {
      id: '',
      nome: '',
      email: '',
      idade: ''
    });

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
    setModalIncluir(!modalIncluir);
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

  useEffect(() => {
    pedidoGet();
  });
  useEffect(() => {
    pedidoPost();
  });


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
                <button className="btn btn-primary">Editar</button> {" "}
                <button className="btn btn-danger">Excluir</button>
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
          <button className='btn btn-primary' onClick={() => pedidoPost()}>Incluir</button>
          <button className='btn btn-danger' onClick={() => abrirFecharModalIncluir()}>Cancelar</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
