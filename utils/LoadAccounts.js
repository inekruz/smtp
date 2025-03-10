const fs = require('fs');
const BankAccount = require('../models/BankAccount');
const Transactions = require('../models/Transactions');

// accounts
const loadAccounts = () => {
    const data = fs.readFileSync('data/db.json');
    const accountsData = JSON.parse(data);
    const accounts = {};
    accountsData.forEach(account => {
        accounts[account.account_id] = new BankAccount(account.account_id, account.balance, account.balance_usd, account.balance_eur, account.email, account.login, account.pass);
    });

    return accounts;
};

// transactions
const loadTransactions = () => {
    const data2 = fs.readFileSync('data/transactions.json');
    const transactionsData = JSON.parse(data2);
    const transactions = {};
    transactionsData.forEach(transaction => {
        transactions[transaction.id] = new Transactions(transaction.id, transaction.user_1, transaction.user_2, transaction.amount, transaction.currency, transaction.date);
    });

    return transactions;
};

module.exports = { loadAccounts, loadTransactions };