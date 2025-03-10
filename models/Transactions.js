const { randomInt } = require('crypto');
const fs = require('fs');

class Transactions {
    constructor(id, user_1 = 0, user_2 = 0, amount = 0, currency = 'RUB', date = "11/11/1111 11:11") {
        this.id = id;
        this.user_1 = user_1;
        this.user_2 = user_2;
        this.amount = amount;
        this.currency = currency;
        this.date = date;
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

        const ids = randomInt(100000)
        // Добавление транзакции

        console.log(`${ids} ${from_account_id} ${to_account_id} ${amount} ${currency} ${formattedDate}`)
        this.id = ids;
        this.user_1 = from_account_id;
        this.user_2 = to_account_id;
        this.amount = amount;
        this.currency = currency;
        this.date = formattedDate;

        fs.writeFileSync('data/transactions.json', JSON.stringify(Object.values(this.transactions), null, 2));
    }

}

module.exports = Transactions;
