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


// pie-chart 

document.getElementById('timeRange').addEventListener('change', function() {
    const timeRange = this.value;

    fetch(`/statistics?timeRange=${timeRange}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при получении данных');
            }
            return response.json();
        })
        .then(chartData => {
            // Обновляем данные графика
            updateChart(chartData);
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
});

function updateChart(chartData) {
    if (myPieChart) {
        myPieChart.destroy();
    }
    myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Категория 1 - Тип 1', 'Категория 1 - Тип 2', 'Категория 1 - Тип 3', 
                     'Категория 2 - Тип 1', 'Категория 2 - Тип 2', 'Категория 2 - Тип 3'],
            datasets: [{
                label: 'Транзакции',
                data: chartData, // Используем данные, полученные с сервера
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Статистика транзакций'
                }
            }
        }
    });
}