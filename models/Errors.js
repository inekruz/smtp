class InsufficientFundsError extends Error {}
class InvalidAmountError extends Error {}
class AccountNotFoundError extends Error {}
class AuthenticationError extends Error {}

module.exports = {
    InsufficientFundsError,
    InvalidAmountError,
    AccountNotFoundError,
    AuthenticationError
};