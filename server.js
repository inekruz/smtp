const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
// const sendEmailNotification = require('./email/email');
const TransactionManager = require('./models/TransactionManager');
const Logger = require('./models/Logger');
const { loadAccounts } = require('./utils/LoadAccounts');

const app = express();
app.use(bodyParser.json());
app.use(express.static('client'));

const accounts = loadAccounts();
const transactionManager = new TransactionManager(accounts);

app.post('/transfer', (req, res) => {
    const { from_account_id, to_account_id, amount, currency, login, pass } = req.body;

    try {
        transactionManager.authenticate(from_account_id, login, pass);
        transactionManager.transfer(from_account_id, to_account_id, amount, currency);
        transactionManager.saveAccounts();
        res.status(200).send('Перевод выполнен успешно!');
    } catch (error) {
        Logger.logError(error);
        res.status(400).send(error.message);
    }
});

app.post('/deposit', (req, res) => {
    const { account_id, amount, currency } = req.body;

    try {
        transactionManager.accounts[account_id].deposit(amount, currency, transactions);
        transactionManager.saveAccounts();
        // sendEmailNotification(transactionManager.accounts[account_id].email, 'Пополнение счета', `Ваш счет был пополнен на сумму ${amount}. Баланс: ${transactionManager.accounts[account_id].balance}`);
        res.status(200).send('Счет пополнен успешно!');
    } catch (error) {
        Logger.logError(error);
        res.status(400).send(error.message);
    }
});

app.post('/withdraw', (req, res) => {
    const { account_id, amount, currency } = req.body;

    try {
        transactionManager.accounts[account_id].withdraw(amount, currency);
        transactionManager.saveAccounts();
        // sendEmailNotification(transactionManager.accounts[account_id].email, 'Снятие средств', `С вашего счета было снято ${amount}. Баланс: ${transactionManager.accounts[account_id].balance}`);
        res.status(200).send('Средства успешно выведены!');
    } catch (error) {
        Logger.logError(error);
        res.status(400).send(error.message);
    }
});

app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});

