import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {manager: '', totalValue: 0};
  }
  
  // Automáticamente chamando quando o compenente é exibido
  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const totalValue = await lottery.methods.manager().call();
    this.setState({manager, totalValue});
  }

  render() {
    return (
      <div>
          <h2>Lottery Contract</h2>
          <p>This contract is managed by: {this.state.manager}</p>
      </div>
    );
  }
}

export default App;


/*
  TODO
    > Apenas o servidor com a conta já predefinada vai fazer o deploy de novos contratos;
    > Função para chamar o pick winner (verifica se há pelo menos 2 participando);
    >


*/