const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
// const path = require('path');
// const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('client'));

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.user,
//         pass: process.env.pass
//     }
// });

// // функция отправки письма
// const sendEmailNotification = (email, subject, text) => {
//     const mailOptions = {
//         from: process.env.user,
//         to: email,
//         subject: subject,
//         text: text
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log('Ошибка при отправке письма:', error);
//         } else {
//             console.log('Письмо отправлено:', info.response);
//         }
//     });
// };

class InsufficientFundsError extends Error {}
class InvalidAmountError extends Error {}
class AccountNotFoundError extends Error {}

class Logger {
    static logError(error) {
        const logMessage = `${new Date().toISOString()} - ${error.name}: ${error.message}\n`;
        fs.appendFileSync('transaction_errors.log', logMessage);
    }
}

class BankAccount {
    constructor(account_id, balance = 0, email = '') {
        this.account_id = account_id;
        this.balance = balance;
        this.email = email;
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

    transfer(from_account_id, to_account_id, amount) {
        if (!this.accounts[from_account_id] || !this.accounts[to_account_id]) {
            throw new AccountNotFoundError('Один из счетов не найден');
        }
        if (amount <= 0) {
            throw new InvalidAmountError('Сумма перевода должна быть положительной!');
        }
        this.accounts[from_account_id].withdraw(amount);
        this.accounts[to_account_id].deposit(amount);

        // const fromAccount = this.accounts[from_account_id];
        // const toAccount = this.accounts[to_account_id];
        
        // sendEmailNotification(fromAccount.email, 'Транзакция завершена', `Вы перевели ${amount} на счет ${to_account_id}. Ваш новый баланс: ${fromAccount.balance}`);
        // sendEmailNotification(toAccount.email, 'Транзакция завершена', `Вы получили ${amount} от счета ${from_account_id}. Ваш новый баланс: ${toAccount.balance}`);
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
        accounts[account.account_id] = new BankAccount(account.account_id, account.balance, account.email);
    });
    return accounts;
};

const accounts = loadAccounts();
const transactionManager = new TransactionManager(accounts);

app.post('/deposit', (req, res) => {
    const { account_id, amount } = req.body;

    try {
        transactionManager.accounts[account_id].deposit(amount);
        transactionManager.saveAccounts();
        // sendEmailNotification(transactionManager.accounts[account_id].email, 'Пополнение счета', `Ваш счет был пополнен на сумму ${amount}. Баланс: ${transactionManager.accounts[account_id].balance}`);
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
        // sendEmailNotification(transactionManager.accounts[account_id].email, 'Снятие средств', `С вашего счета было снято ${amount}. Баланс: ${transactionManager.accounts[account_id].balance}`);
        res.status(200).send('Средства успешно выведены!');
    } catch (error) {
        Logger.logError(error);
        res.status(400).send(error.message);
    }
});

app.post('/transfer', (req, res) => {
    const { from_account_id, to_account_id, amount } = req.body;

    try {
        transactionManager.transfer(from_account_id, to_account_id, amount);
        transactionManager.saveAccounts();
        res.status(200).send('Перевод выполнен успешно!');
    } catch (error) {
        Logger.logError(error);
        res.status(400).send(error.message);
    }
});

app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});
