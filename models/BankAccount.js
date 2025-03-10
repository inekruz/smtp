const { InsufficientFundsError } = require('./Errors');

class BankAccount {
    constructor(account_id, balance = 0, balance_usd = 0, balance_eur = 0, email = '', login = '', pass = '') {
        this.account_id = account_id;
        this.balance = balance;
        this.balance_usd = balance_usd;
        this.balance_eur = balance_eur;
        this.email = email;
        this.login = login;
        this.pass = pass;
    }

    verifyCredentials(login, pass) {
        return this.login === login && this.pass === pass;
    }

    withdraw(amount, currency) {

        switch (currency) {
            case "RUB":
                if (amount > this.balance) {
                    throw new InsufficientFundsError('Недостаточно средств на счете');
                }
                this.balance -= amount;
                break;

            case "USD":
                    if (amount > this.balance_usd) {
                        throw new InsufficientFundsError('Недостаточно средств на счете');
                    }
                    this.balance_usd -= amount;
                    break;

            case "EUR":
                    if (amount > this.balance_eur) {
                        throw new InsufficientFundsError('Недостаточно средств на счете');
                    }
                    this.balance_eur -= amount;
                    break;
        
            default:
                break;
        }
    }

    deposit(amount, currency) {
        switch (currency) {
            case "RUB":
                if (amount <= 0) {
                    throw new InsufficientFundsError('Сумма пополнения должна быть положительной!');
                }
                this.balance += amount;
                break;

            case "USD":
                    if (amount <= 0) {
                        throw new InsufficientFundsError('Сумма пополнения должна быть положительной!');
                    }
                    this.balance_usd += amount;
                    break;

            case "EUR":
                    if (amount <= 0) {
                        throw new InsufficientFundsError('Сумма пополнения должна быть положительной!');
                    }
                    this.balance_eur += amount;
                    break;
        
            default:
                break;
        }
    }
}

module.exports = BankAccount;