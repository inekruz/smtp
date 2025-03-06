const fs = require('fs');
const BankAccount = require('../models/BankAccount');

const loadAccounts = () => {
    const data = fs.readFileSync('data/db.json');
    const accountsData = JSON.parse(data);
    const accounts = {};
    accountsData.forEach(account => {
        accounts[account.account_id] = new BankAccount(account.account_id, account.balance, account.email, account.login, account.pass);
    });
    return accounts;
};

module.exports = { loadAccounts };