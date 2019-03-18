const assert = require('assert'); // Usado para comparar valores
const ganache = require('ganache-cli'); // Local teste ethereum network
const Web3 = require('web3'); // Portal para acessar a rede ethereum
const web3 = new Web3(ganache.provider()); // Instância do Web3, parâmetro diz respeito à network que será acessada
const { interface, bytecode } = require('../.contrato_compilado.js'); // Recebe as propriedades (informadas pelas chaves do dicionário) retornadas pelo arquivo

let accounts;
let lottery;

beforeEach(async () =>{
    // Pega uma lista de contas de forma assíncrona
    accounts = await web3.eth.getAccounts();

    // Use one of those account to deploy the contract
    // Ensina a web3 quais métodos o contrato Inbox tem (pela interface)
    lottery = await new web3.eth.Contract(JSON.parse(interface))

        // Diz à web3 que queremos adicionar uma cópia desse contrato
        .deploy({data: bytecode})
    
        // Instrui a web3 à enviar uma transação que cria esse contrato
        .send({ from: accounts[0], gas: '1000000'});
        
});

/*
beforeEach(async () => {
    // console.log('Executa uma vez antes de cada "IT"');
});
*/

describe('Lottery Contract',() => {
    
    it('Deploys a contract', () =>{
        // Verifica se o 'loterry' tem um endereço, se sim significa que ele foi enviado com sucesso
        assert.ok(lottery.options.address);
    });

    it('Allows accounts to enter', async () => {

        await lottery.methods.enter().send({
            from: accounts[0], 
            value: web3.utils.toWei('0.01','ether')
        });

        const palyer0 = await lottery.methods.players(0).call({
            from: accounts[0]
        });

    });

    /*
    it('Has a manager key', async () =>{
        const manager = await lottery.methods.manager().call();
        return;
        assert.ok(manager);
    });
    */

});