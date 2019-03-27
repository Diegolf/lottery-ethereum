const path = require('path'); // Caminho válido independente de plataforma
const fs = require('fs'); // módulo de arquivo de sistema, usado para ler o conetúdo do arquivo
const solc = require('solc'); // Usado para compilar o código solidity
const dir_arquivo = '.contrato_compilado.js'

/* Caminho do arquivo .sol a ser compilado. Cada pasta é passada 
   como um argumento separado  
*/
const contractPath = path.resolve(__dirname, '..', 'sol', 'Lottery.sol');

// Lê o que há dentro do arquivo .sol
const source = fs.readFileSync(contractPath, 'utf8');

const dados = solc.compile(source,1).contracts[':Lottery'];

const contrato_compilado = 
`module.exports = {
    bytecode : '${dados['bytecode']}',
    abi : '${dados['interface']}',
}
`

// Cria um arquivo com o bytecode e a abi do contrato selecionado
fs.writeFile(__dirname+'/'+dir_arquivo, contrato_compilado, function (err) {
    if (err) 
        return console.log(err);
    console.log('arquivo '+dir_arquivo+' criado.');
});