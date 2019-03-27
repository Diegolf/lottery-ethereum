import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '', 
    totalValue: '0',
    numberOfParticipants: 0,
    value: ''
  };
  
  // Automáticamente chamando quando o compenente é exibido
  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const totalValue = await web3.eth.getBalance(lottery.options.address);
    const numberOfParticipants = await lottery.methods.nParticipants().call();
    this.setState({manager, totalValue, numberOfParticipants});
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
      </div>
    );
  }

  onSubmit = async (event) =>{
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    let value = this.state.value;

    try{
      if(parseFloat(value) >= 0.01 && parseFloat(value) <= 1){
        await lottery.methods.enter().send({from: accounts[0], value: web3.utils.toWei(value, 'ether')});
      }else{
        alert('Valor inválido');
      }
    }catch(e){
      alert('Valor inválido ou operação cancelada pelo usuário');
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