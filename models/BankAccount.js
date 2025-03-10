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

    // Курсы валют
    static exchangeRates = {
        RUB_TO_USD: 0.01,  // 1 RUB = 0.01 USD
        RUB_TO_EUR: 0.01,  // 1 RUB = 0.01 EUR
        USD_TO_RUB: 100,   // 1 USD = 100 RUB
        EUR_TO_RUB: 100    // 1 EUR = 100 RUB
    };

    // Метод для конвертации валют
    convert(amount, fromCurrency, toCurrency) {
        if (fromCurrency === "RUB" && toCurrency === "USD") {
            return amount * BankAccount.exchangeRates.RUB_TO_USD;
        } else if (fromCurrency === "RUB" && toCurrency === "EUR") {
            return amount * BankAccount.exchangeRates.RUB_TO_EUR;
        } else if (fromCurrency === "USD" && toCurrency === "RUB") {
            return amount * BankAccount.exchangeRates.USD_TO_RUB;
        } else if (fromCurrency === "EUR" && toCurrency === "RUB") {
            return amount * BankAccount.exchangeRates.EUR_TO_RUB;
        } else {
            return amount;
        }
    }

    verifyCredentials(login, pass) {
        return this.login === login && this.pass === pass;
    }

    withdraw(amount, currency) {
        let amountInRUB = 0;

        switch (currency) {
            case "RUB":
                if (amount > this.balance) {
                    throw new InsufficientFundsError('Недостаточно средств на счете');
                }
                this.balance -= amount;
                break;

            case "USD":
                amountInRUB = this.convert(amount, "USD", "RUB");
                if (amountInRUB > this.balance) {
                    throw new InsufficientFundsError('Недостаточно средств на счете');
                }
                this.balance -= amountInRUB;
                break;

            case "EUR":
                amountInRUB = this.convert(amount, "EUR", "RUB");
                if (amountInRUB > this.balance) {
                    throw new InsufficientFundsError('Недостаточно средств на счете');
                }
                this.balance -= amountInRUB;
                break;
        
            default:
                throw new Error('Неизвестная валюта');
        }
    }

    deposit(amount, currency) {
        let amountInRUB = 0;

        switch (currency) {
            case "RUB":
                if (amount <= 0) {
                    throw new InsufficientFundsError('Сумма пополнения должна быть положительной!');
                }
                this.balance += amount;
                break;

            case "USD":
                amountInRUB = this.convert(amount, "USD", "RUB");
                if (amount <= 0) {
                    throw new InsufficientFundsError('Сумма пополнения должна быть положительной!');
                }
                this.balance += amountInRUB;
                break;

            case "EUR":
                amountInRUB = this.convert(amount, "EUR", "RUB");
                if (amount <= 0) {
                    throw new InsufficientFundsError('Сумма пополнения должна быть положительной!');
                }
                this.balance += amountInRUB;
                break;
        
            default:
                throw new Error('Неизвестная валюта');
        }
    }
}

module.exports = BankAccount;
