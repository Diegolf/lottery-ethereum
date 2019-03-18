pragma solidity ^0.5.5;

contract Lottery{
    
    address payable public manager;
    bool private open; // Diz se ainda é possível apostar
    
    struct Player{
        address payable key;
        uint value;
        uint entryTo; // O último número do ingresso do participante
    }
    
    Player[] public players;
    
    modifier ownerOnly(){
        require(msg.sender == manager);
        _;
    }
    
    modifier hasPlayers(){
        require(players.length > 0);
        _;
    }
    
    modifier isOpen(){
        assert(open);
        _;
    }
    
    constructor() public {
        manager = msg.sender;
        open = true;
    }
    
    function enter() public isOpen payable {
        require(msg.value >= 0.01 ether && msg.value <= 1 ether);
        
        uint lastEntry = 0;
        if (players.length > 0){
            lastEntry = players[players.length -1].entryTo;
        }
        
        players.push(Player(msg.sender, msg.value, lastEntry + msg.value / 0.01 ether ));
        
    }
    
    function pickWinner() public isOpen hasPlayers ownerOnly{
        uint winner = (random() % players[players.length - 1].entryTo) + 1;
        
        for(uint c = 0; c < players.length; c++){
            if (players[c].entryTo >= winner){
                manager.transfer(address(this).balance / 50); // Envia 2% para o manager
                players[c].key.transfer(address(this).balance);
                open = false;
                break;
            }
        }
    }
    
    // Não é completamente random, pode ser calculado 
    function random() private hasPlayers view returns(uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, now, players[players.length -1].key)));
    }
    
}