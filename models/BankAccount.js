const { InsufficientFundsError, InvalidAmountError } = require('./Errors');

class BankAccount {
    constructor(account_id, balance = 0, email = '', login = '', pass = '') {
        this.account_id = account_id;
        this.balance = balance;
        this.email = email;
        this.login = login;
        this.pass = pass;
    }

    convertCurrency(balance) {
        this.toeur = balance / 95.7;
        this.tousd = balance / 89.79;
        return this.toeur && this.tousd;
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

module.exports = BankAccount;