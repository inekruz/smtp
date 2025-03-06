const fs = require('fs');
const sendEmailNotification = require('../email/email');
const { AuthenticationError, AccountNotFoundError, InvalidAmountError } = require('./Errors');

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

        const fromAccount = this.accounts[from_account_id];
        const toAccount = this.accounts[to_account_id];
        
        sendEmailNotification(fromAccount.email, 'Транзакция завершена', `Вы перевели ${amount} на счет ${to_account_id}. Ваш новый баланс: ${fromAccount.balance}`);
        sendEmailNotification(toAccount.email, 'Транзакция завершена', `Вы получили ${amount} от счета ${from_account_id}. Ваш новый баланс: ${toAccount.balance}`);
    }

    saveAccounts() {
        fs.writeFileSync('data/db.json', JSON.stringify(Object.values(this.accounts), null, 2));
    }
}

module.exports = TransactionManager;