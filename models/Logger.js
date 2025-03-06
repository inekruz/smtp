const fs = require('fs');

class Logger {
    static logError(error) {
        const logMessage = `${new Date().toISOString()} - ${error.name}: ${error.message}\n`;
        fs.appendFileSync('transaction_errors.log', logMessage);
    }
}

module.exports = Logger;