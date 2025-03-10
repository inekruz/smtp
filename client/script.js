document.getElementById('transferForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fromAccount = document.getElementById('fromAccount').value;
    const toAccount = document.getElementById('toAccount').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const currency = document.getElementById('currency').value;
    const messageDiv = document.getElementById('message');

    const login = prompt('Введите логин');
    const pass = prompt('Введите пароль');

    if (!login || !pass) {
        messageDiv.textContent = 'Ошибка: Логин и пароль обязательны для ввода';
        messageDiv.className = 'error';
        return;
    }

    messageDiv.textContent = '';
    messageDiv.className = '';

    if (!fromAccount || !toAccount) {
        messageDiv.textContent = 'Ошибка: Один из счетов указан некорректно!';
        messageDiv.className = 'error';
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        messageDiv.textContent = 'Ошибка: Сумма должна быть больше 0';
        messageDiv.className = 'error';
        return;
    }

    fetch('/transfer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            from_account_id: fromAccount, 
            to_account_id: toAccount, 
            amount: amount, 
            currency: currency, 
            login: login, 
            pass: pass 
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
        }
        return response.text();
    })
    .then(message => {
        messageDiv.textContent = message;
        messageDiv.className = 'success';
    })
    .catch(error => {
        messageDiv.textContent = 'Ошибка: ' + error.message;
        messageDiv.className = 'error';
    });
});


// Пополнение и вывод

document.getElementById('depositButton').addEventListener('click', function() {
    const accountId = document.getElementById('accountId').value;
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    const currency = document.getElementById('transactionCurrency').value;
    const transactionMessageDiv = document.getElementById('transactionMessage');

    transactionMessageDiv.textContent = '';
    transactionMessageDiv.className = '';

    if (!accountId) {
        transactionMessageDiv.textContent = 'Ошибка: Счет указан некорректно!';
        transactionMessageDiv.className = 'error';
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        transactionMessageDiv.textContent = 'Ошибка: Сумма должна быть больше 0';
        transactionMessageDiv.className = 'error';
        return;
    }

    console.log(currency)
    console.log(amount)
    fetch('/deposit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ account_id: accountId, amount: amount, currency: currency })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
        }
        return response.text();
    })
    .then(message => {
        transactionMessageDiv.textContent = message;
        transactionMessageDiv.className = 'success';
    })
    .catch(error => {
        if (error.message.includes("Cannot read properties of undefined")) {
            transactionMessageDiv.textContent = 'Ошибка: Счет не найден!';
        } else {
            transactionMessageDiv.textContent = 'Ошибка: ' + error.message;
        }
        transactionMessageDiv.className = 'error';
    });
});


document.getElementById('withdrawButton').addEventListener('click', function() {
    const accountId = document.getElementById('accountId').value;
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    const currency = document.getElementById('transactionCurrency').value;
    const transactionMessageDiv = document.getElementById('transactionMessage');

    transactionMessageDiv.textContent = '';
    transactionMessageDiv.className = '';

    if (!accountId) {
        transactionMessageDiv.textContent = 'Ошибка: Счет указан некорректно!';
        transactionMessageDiv.className = 'error';
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        transactionMessageDiv.textContent = 'Ошибка: Сумма должна быть больше 0';
        transactionMessageDiv.className = 'error';
        return;
    }

    fetch('/withdraw', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ account_id: accountId, amount: amount, currency: currency })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
        }
        return response.text();
    })
    .then(message => {
        transactionMessageDiv.textContent = message;
        transactionMessageDiv.className = 'success';
    })
    .catch(error => {
        if (error.message.includes("Cannot read properties of undefined")) {
            transactionMessageDiv.textContent = 'Ошибка: Счет не найден!';
        } else {
            transactionMessageDiv.textContent = 'Ошибка: ' + error.message;
        }
        transactionMessageDiv.className = 'error';
    });
});
