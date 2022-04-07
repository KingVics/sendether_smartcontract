import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers"

import { contractAbi, contractAddress} from "../utils/constant"

export const TransactionContext = React.createContext();

const { ethereum } = window;


const createEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    // const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, provider.getSigner());

    return contract;
}


export const TransactionsProvider = ({ children }) => {
    const [currentAccount, setCurrentAccounts] = useState()
    const [formData, setFormData] = useState({addressTo: "", amount: "", keyword: "", message: ""})
    const [isLoading, setLoading] = useState(false)
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'))
    const [transact, setTransaction] = useState()


    // const convertedAmount = ethers.utils.parseEther(formData.amount);
    const handleChange = (e) => {
        const {name} = e.target
        // setFormData({...formData, [name]: e.target.value})
        setFormData((prevState) => ({...prevState, [name]: e.target.value}))
    }

    const getAllAvailableTransactions = async () => {
        try {
            if(ethereum) {
                const contract = createEthereumContract();
                
                const getAllTransaction = await contract.getAllTransactions();

                const structuredTransactions = getAllTransaction.map((transaction) => ({
                    addressTo: transaction.receiever,
                    addressFrom: transaction.sender,
                    timestamp: new Date(transaction?.timerstamp?.toNumber() * 1000).toLocaleString(),
                    message: transaction.message,
                    keyword: transaction.keyword,
                    amount: parseInt(transaction.amount._hex) / (10 ** 18)
                }))

                setTransaction(structuredTransactions)

                console.log({structuredTransactions, getAllTransaction})
            } else {
                console.log("no transact")
            }
        } catch (error) {
            throw new Error(error)   
        }
    }

    const checkWallet =  useCallback((async () => {
        try {
            if(!ethereum) return alert("Please install metamask")

            const accounts = await ethereum.request({method: "eth_accounts"});

            if(accounts?.length) {
                setCurrentAccounts(accounts[0])
                getAllAvailableTransactions();
            } else {
                console.log("No accounts found")
            }
        } catch (error) {
            throw new Error("No accounts found")
        }
    }), [])

    const checkTransactionExist =  useCallback((async () => {
        try {
            const getContracts = createEthereumContract()
            const transactionCount = await getContracts.getAllTransactionCount(currentAccount);

            window.localStorage.setItem('transactionCount', transactionCount)

        } catch (error) {
            throw new Error("No transaction found")
        }
    }),  [currentAccount])

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please install metamask")

            const accounts = await ethereum.request({method: "eth_requestAccounts"});
    
            setCurrentAccounts(accounts)
        } catch (error) {
            console.log(error)
            throw new Error("No ethers")
        }
    }


    const sendTransaction = async() => {
        try {
            if(!ethereum) return alert("Please install metamask")

            const { addressTo, amount, keyword, message } = formData;
            const getContracts = createEthereumContract()
            const convertedAmount = ethers.utils.parseEther(amount);
        
            await ethereum.request({
                method:"eth_sendTransaction",
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208',
                    value: convertedAmount._hex,
                }]
            })

            const transactionHash =  await getContracts.addToBlockchain(addressTo, convertedAmount, message, keyword);
            
            setLoading(true)
            console.log(`Loading... ${transactionHash.hash}`)
            await transactionHash.wait();
            setLoading(false)

            const transactionCount = await getContracts.getAllTransactionCount(currentAccount);
            
            setTransactionCount(transactionCount.toNumber())
        } catch (error) {
            console.log(error)
            throw new Error("No ethers")
        }
    }

    useEffect(() => {
        checkWallet()
        checkTransactionExist()
    }, [checkTransactionExist, checkWallet])

    return (
        <TransactionContext.Provider value={{connectWallet, currentAccount, formData, handleChange, sendTransaction, transact, isLoading }}>
        {children}
        </TransactionContext.Provider>
    );
};