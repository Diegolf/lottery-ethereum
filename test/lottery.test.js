const assert = require('assert'); // Usado para comparar valores
const ganache = require('ganache-cli'); // Local teste ethereum network
const Web3 = require('web3'); // Portal para acessar a rede ethereum
const web3 = new Web3(ganache.provider()); // Instância do Web3, parâmetro diz respeito à network que será acessada
const { abi, bytecode } = require('../src/contract/.contrato_compilado.js'); // Recebe as propriedades (informadas pelas chaves do dicionário) retornadas pelo arquivo

let accounts;
let lottery;

let values = []; // O valor de cada conta após entrar na loteria

before(async () =>{
    // Pega uma lista de contas de forma assíncrona
    accounts = await web3.eth.getAccounts();

    // Use one of those account to deploy the contract
    // Ensina a web3 quais métodos o contrato Inbox tem (pela abi)
    lottery = await new web3.eth.Contract(JSON.parse(abi))

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

    it('Has a manager key', async () =>{
        const manager = await lottery.methods.manager().call();
        return;
        assert.ok(manager);
    });

    it('Allows accounts to enter', async () => {

        await lottery.methods.enter().send({
            from: accounts[3], 
            value: web3.utils.toWei('0.01','ether'),
            gas: '1000000'
        });
    
    });

    it('The player has been registered correctly', async () =>{
        
        const player0 = await lottery.methods.players(0).call({
            from: accounts[0]
        });

        assert.equal(player0.key, accounts[3]);
    });

    it('Allow multiple accounts to enter', async () =>{
        
        await lottery.methods.enter().send({
            from: accounts[1], 
            value: web3.utils.toWei('0.1','ether'),
            gas: '1000000'
        });
        
        await lottery.methods.enter().send({
            from: accounts[2], 
            value: web3.utils.toWei('1','ether'),
            gas: '1000000'
        });

        const player1 = await lottery.methods.players(1).call({
            from: accounts[0]
        });

        const player2 = await lottery.methods.players(2).call({
            from: accounts[0]
        });

        // Guarda o valor atual de ether das contas para testes futuros
        for(let c = 0 ; c <= 3 ; c++){
            values.push(await web3.eth.getBalance(accounts[c]));
        }

        assert.equal(player1.key, accounts[1]);
        assert.equal(player2.key, accounts[2]);

    });

    it('Requires a minimun ammount of ether to enter', async () => {

        try{
            
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei('0.0001', 'ether'),
                gas: '1000000'
            });

            assert(false);
        }catch(err){
            assert(err);
        }

    });

    it('Randoms can not call "pickWinner"', async () => {
        try{

            await lottery.methods.pickWinner().send({
                from: accounts[1],
                gas: '1000000'
            });
            assert(false);

        }catch(err){
            assert(err);
        }
    });

    it('The manager can call "pickWinner"', async () => {

        await lottery.methods.pickWinner().send({
            from: accounts[0],
            gas: '1000000'
        });

        // Verifica se a função "pickWinner" fechou a loteria 
        try{
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei('1', 'ether'),
                gas: '1000000'
            }); 
            assert(false);
        }catch(err){
            assert(err);
        }

    });

    it('The value has been sent to the random winner',async () => {

        const lotteryValue = await (web3.utils.toWei('1','ether'));
        for (let c = 0; c <= 3; c++){
            let valorAtual = await web3.eth.getBalance(accounts[c]);
            if(parseFloat(valorAtual) > (parseFloat(values[c]) + parseFloat(lotteryValue))){
                assert.ok(true);
                return;
            }
        }

        assert.ok(false);
    });

});