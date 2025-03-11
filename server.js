const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
// const sendEmailNotification = require('./email/email');
const TransactionManager = require('./models/TransactionManager');
const Logger = require('./models/Logger');
const { loadAccounts } = require('./utils/LoadAccounts');
const { loadTransactions } = require('./utils/LoadAccounts');
const Transactions = require('./models/Transactions');

const transactions = loadTransactions();
const transactionss = new Transactions(transactions);

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

app.get('/statistics', (req, res) => {
    const timeRange = req.query.timeRange; // Получаем временной диапазон из запроса
    const transactions = transactionss.loadTransactions(); // Предполагается, что у вас есть метод для получения всех транзакций

    // Фильтрация транзакций в зависимости от временного диапазона
    const filteredTransactions = filterTransactionsByTimeRange(transactions, timeRange);

    // Подсчет данных для графика
    const chartData = calculateChartData(filteredTransactions);

    res.json(chartData);
});

// Функция для фильтрации транзакций по временным диапазонам
function filterTransactionsByTimeRange(transactions, timeRange) {
    const now = new Date();
    let startDate;

    switch (timeRange) {
        case '24h':
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
        case '7d':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case '30d':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        case '1y':
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
        case 'all':
            return transactions;
        default:
            return [];
    }

    return transactions.filter(transaction => new Date(transaction.date) >= startDate);
}

// Функция для подсчета данных для графика
function calculateChartData(transactions) {
    const data = {
        'Категория 1 - Тип 1': 0,
        'Категория 1 - Тип 2': 0,
        'Категория 1 - Тип 3': 0,
        'Категория 2 - Тип 1': 0,
        'Категория 2 - Тип 2': 0,
        'Категория 2 - Тип 3': 0,
    };

    transactions.forEach(transaction => {
        // Пример логики для распределения транзакций по категориям
        if (transaction.currency === 'RUB') {
            data['Категория 1 - Тип 1'] += transaction.amount;
        } else if (transaction.currency === 'USD') {
            data['Категория 1 - Тип 2'] += transaction.amount;
        } else if (transaction.currency === 'EUR') {
            data['Категория 1 - Тип 3'] += transaction.amount;
        }
    });

    return Object.values(data);
}

app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});

