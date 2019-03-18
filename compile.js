const path = require('path'); // Caminho válido independente de plataforma
const fs = require('fs'); // módulo de arquivo de sistema, usado para ler o conetúdo do arquivo
const solc = require('solc'); // Usado para compilar o código solidity
const dir_arquivo = '.contrato_compilado.js'

/* Caminho do arquivo .sol a ser compilado. Cada pasta é passada 
   como um argumento separado  
*/
const contractPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');

// Lê o que há dentro do arquivo .sol
const source = fs.readFileSync(contractPath, 'utf8');

var input = {
	language: 'Solidity',
	sources: {
		'Lottery.sol' : {
			content: source
		}
	},
	settings: {
		outputSelection: {
			'*': {
				'*': [ '*' ]
			}
		}
	}
}

// Compila exporta o bytecode do contrato Inbox
let dados = JSON.parse(solc.compile(JSON.stringify(input)))['contracts']['Lottery.sol']['Lottery']

let contrato_compilado = 
`module.exports = {
    bytecode : '${dados['evm']['bytecode']['object']}',
    interface : '${JSON.stringify(dados['abi'])}'
}
`

// Cria um arquivo com o bytecode e a interface do contrato selecionado
fs.writeFile(dir_arquivo, contrato_compilado, function (err) {
    if (err) 
        return console.log(err);
    console.log('arquivo '+dir_arquivo+' criado.');
});
