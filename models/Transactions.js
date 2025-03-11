const { randomInt } = require('crypto');
const fs = require('fs');
const path = require('path');

class Transactions {
    constructor() {
        // Указываем правильный путь к файлу transactions.json
        this.filePath = path.join(__dirname, '..', 'data', 'transactions.json');
        this.transactions = this.loadTransactions(); // Загрузка существующих транзакций
    }

    loadTransactions() {
        // Проверка, существует ли файл, и загрузка данных
        if (fs.existsSync(this.filePath)) {
            const data = fs.readFileSync(this.filePath);
            return JSON.parse(data);
        }
        return []; // Возвращаем пустой массив, если файл не существует
    }

    setTransactions(from_account_id, to_account_id, amount, currency) {
        // Получение текущей даты и времени в формате dd/mm/yyyy hh:mm
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

        const ids = randomInt(100000);
        // Создание объекта транзакции
        const transaction = {
            id: ids,
            user_1: from_account_id,
            user_2: to_account_id,
            amount: amount,
            currency: currency,
            date: formattedDate
        };

        // Добавление транзакции в массив
        this.transactions.push(transaction);

        // Запись всех транзакций в файл
        fs.writeFileSync(this.filePath, JSON.stringify(this.transactions, null, 2));
    }
}

module.exports = Transactions;