
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;




contract Transact {
    uint256 transactionCount ;

    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);

    struct TransactionStruct {
        address sender;
        address receiever;
        uint amount;
        string message;
        uint256 timerstamp;
        string keyword;
    }   

    TransactionStruct[] transactions;

    function addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyword) public {
        transactionCount += 1;
        transactions.push(TransactionStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

    function getAllTransactions() public view returns (TransactionStruct[] memory ) {
        return transactions;
    }

    function getAllTransactionCount() public view returns(uint256) {
        return transactionCount;
    }

}

