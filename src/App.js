import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    playerAddress: '', 
    totalValue: '0',
    numberOfParticipants: 0,
    value: '',
    message: ''
  };
  
  // Automáticamente chamando quando o compenente é exibido
  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const totalValue = await web3.eth.getBalance(lottery.options.address);
    const numberOfParticipants = await lottery.methods.nParticipants().call();
    const playerAddress = await web3.eth.getAccounts();
    this.setState({manager, totalValue, numberOfParticipants, playerAddress: playerAddress[0]});
  }

  render() {
    return (
      <div>
          <h2>Lottery Contract</h2>
          <p>This contract is managed by: {this.state.manager}</p>
          <p>
            There are currently {this.state.numberOfParticipants} players competing to
            win {web3.utils.fromWei(this.state.totalValue, 'ether')} Ether 
          </p>
          <hr />
          <form onSubmit={this.onSubmit}>
            <h3>Want to try your luck?</h3>
            <p>Each 0.01 ether equals to 1 entry (max 1 ether)</p>
            <div>
              <label>Amount of ether to enter: </label>
              <input
                value={this.state.value} 
                onChange={event => this.setState({value: event.target.value})} 
              />
            </div>
            <button>Enter</button>
          </form>
          {this.state.manager == this.state.playerAddress &&(
            <div>
              <hr />
              <h3>Time to Pick a Winner?</h3>
              <button onClick={this.onClick}>Pick a Winner!</button>
            </div>
          )}
          <hr />
          <h2>{this.state.message}</h2>
      </div>
    );
  }

  onSubmit = async (event) =>{
    event.preventDefault();

    const value = this.state.value;

    this.setState({message: 'Esperando pela confirmação da transação...'})

    try{
      if(parseFloat(value) >= 0.01 && parseFloat(value) <= 1){
        await lottery.methods.enter().send({from: this.state.playerAddress, value: web3.utils.toWei(value, 'ether')});
        this.setState({message: 'Você entrou na loteria !'})
      }else{
        alert('Valor inválido');
        this.setState({message: ''})
      }
    }catch(e){
      alert('Valor inválido ou operação cancelada pelo usuário');
      this.setState({message: ''})
      console.log(e);
    }
    

  }

  onClick = async (event) => {
    event.preventDefault();

    this.setState({message: 'Esperando pela confirmação da transação...'})

    try{
        await lottery.methods.pickWinner().send({from: this.state.playerAddress});
        this.setState({message: 'O vencedor foi selecionado !'})
    }catch(e){
      alert('Ocorreu um erro ou operação cancelada pelo usuário');
      this.setState({message: ''})
      console.log(e);
    }

  }


}

export default App;


/*
  TODO
    > Apenas o servidor com a conta já predefinada vai fazer o deploy de novos contratos;
    > Função para chamar o pick winner (verifica se há pelo menos 2 participando);
    >


*/