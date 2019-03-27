import web3 from './web3';
import {enderecoContrato} from './contract/.endereco_contrato';
import {abi} from './contract/.contrato_compilado';

export default new web3.eth.Contract(JSON.parse(abi), enderecoContrato);