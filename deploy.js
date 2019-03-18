const HDWalletProvider = require('truffle-hdwallet-provider'); // biblioteca para gerenciar as carteiras
const Web3 = require('web3'); // Portal para conectar às networks da ethereum
const { interface, bytecode } = require('./.contrato_compilado.js');
const { mnemonic, url_network} = require('./.dados.js');

const provider = new HDWalletProvider(mnemonic, url_network);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts  = await web3.eth.getAccounts();

    console.log('Fazendo o deploy do contrado pela conta: ', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: '0x' + bytecode}) // add 0x bytecode
        .send({from: accounts[0]});

    console.log('Contrato enviado para: ', result.options.address);
    // 0xB0e1bD295A4D1dbbd2C2732792AD64E48C4079Fd
};

deploy();

