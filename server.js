const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('client'));

class InsufficientFundsError extends Error {}
class InvalidAmountError extends Error {}
class AccountNotFoundError extends Error {}
class AuthenticationError extends Error {}

class Logger {
    static logError(error) {
        const logMessage = `${new Date().toISOString()} - ${error.name}: ${error.message}\n`;
        fs.appendFileSync('transaction_errors.log', logMessage);
    }
}

class BankAccount {
    constructor(account_id, balance = 0, email = '', login = '', pass = '') {
        this.account_id = account_id;
        this.balance = balance;
        this.email = email;
        this.login = login;
        this.pass = pass;
    }

    verifyCredentials(login, pass) {
        return this.login === login && this.pass === pass;
    }

    withdraw(amount) {
        if (amount > this.balance) {
            throw new InsufficientFundsError('Недостаточно средств на счете');
        }
        this.balance -= amount;
    }

    deposit(amount) {
        if (amount <= 0) {
            throw new InvalidAmountError('Сумма пополнения должна быть положительной!');
        }
        this.balance += amount;
    }
}


class TransactionManager {
    constructor(accounts) {
        this.accounts = accounts;
    }

    authenticate(account_id, login, pass) {
        const account = this.accounts[account_id];
        if (!account || !account.verifyCredentials(login, pass)) {
            throw new AuthenticationError('Неверный логин или пароль');
        }
    }

    transfer(from_account_id, to_account_id, amount) {
        if (!this.accounts[from_account_id] || !this.accounts[to_account_id]) {
            throw new AccountNotFoundError('Один из счетов не найден');
        }
        if (amount <= 0) {
            throw new InvalidAmountError('Сумма перевода должна быть положительной!');
        }
        this.accounts[from_account_id].withdraw(amount);
        this.accounts[to_account_id].deposit(amount);
    }

    saveAccounts() {
        fs.writeFileSync('db.json', JSON.stringify(Object.values(this.accounts), null, 2));
    }
}

const loadAccounts = () => {
    const data = fs.readFileSync('db.json');
    const accountsData = JSON.parse(data);
    const accounts = {};
    accountsData.forEach(account => {
        accounts[account.account_id] = new BankAccount(account.account_id, account.balance, account.email, account.login, account.pass);
    });
    return accounts;
};

const accounts = loadAccounts();
const transactionManager = new TransactionManager(accounts);

app.post('/transfer', (req, res) => {
    const { from_account_id, to_account_id, amount, login, pass } = req.body;

    try {
        transactionManager.authenticate(from_account_id, login, pass);
        transactionManager.transfer(from_account_id, to_account_id, amount);
        transactionManager.saveAccounts();
        res.status(200).send('Перевод выполнен успешно!');
    } catch (error) {
        Logger.logError(error);
        res.status(400).send(error.message);
    }
});

app.post('/deposit', (req, res) => {
    const { account_id, amount } = req.body;

    try {
        transactionManager.accounts[account_id].deposit(amount);
        transactionManager.saveAccounts();
        res.status(200).send('Счет пополнен успешно!');
    } catch (error) {
        Logger.logError(error);
        res.status(400).send(error.message);
    }
});

app.post('/withdraw', (req, res) => {
    const { account_id, amount } = req.body;

    try {
        transactionManager.accounts[account_id].withdraw(amount);
        transactionManager.saveAccounts();
        res.status(200).send('Средства успешно выведены!');
    } catch (error) {
        Logger.logError(error);
        res.status(400).send(error.message);
    }
});

app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});
