const BankAccount = require('../models/BankAccount');

describe('BankAccount currency conversion', () => {
    let account;

    beforeEach(() => {
        account = new BankAccount(3, 1000, 10, 10);
    });

    test('Convert RUB to USD', () => {
        const amount = 1000;
        const expectedAmount = amount * BankAccount.exchangeRates.RUB_TO_USD;  // 1000 RUB -> 10 USD

        const convertedAmount = account.convert(amount, 'RUB', 'USD');
        
        expect(convertedAmount).toBe(expectedAmount);
    });

    test('Convert RUB to EUR', () => {
        const amount = 1000;
        const expectedAmount = amount * BankAccount.exchangeRates.RUB_TO_EUR;  // 1000 RUB -> 10 EUR

        const convertedAmount = account.convert(amount, 'RUB', 'EUR');
        
        expect(convertedAmount).toBe(expectedAmount);
    });

    test('Convert USD to RUB', () => {
        const amount = 10;  // 10 USD
        const expectedAmount = amount * BankAccount.exchangeRates.USD_TO_RUB;  // 10 USD -> 1000 RUB

        const convertedAmount = account.convert(amount, 'USD', 'RUB');
        
        expect(convertedAmount).toBe(expectedAmount);
    });

    test('Convert EUR to RUB', () => {
        const amount = 10;  // 10 EUR
        const expectedAmount = amount * BankAccount.exchangeRates.EUR_TO_RUB;  // 10 EUR -> 1000 RUB

        const convertedAmount = account.convert(amount, 'EUR', 'RUB');
        
        expect(convertedAmount).toBe(expectedAmount);
    });

    test('No conversion needed for same currency', () => {
        const amount = 1000;  // 1000 RUB
        const convertedAmount = account.convert(amount, 'RUB', 'RUB');
        
        expect(convertedAmount).toBe(amount);
    });
});
