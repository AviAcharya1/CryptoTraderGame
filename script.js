const currencyData = [
    { name: 'Bitcoin', symbol: 'BTC', price: 50000 },
    { name: 'Ethereum', symbol: 'ETH', price: 2000 },
    { name: 'Litecoin', symbol: 'LTC', price: 200 },
    // Add more currencies as needed
  ];
  
  const currenciesDiv = document.querySelector('.currencies');
  const holdingsDiv = document.querySelector('.holdings');
  const balanceDisplay = document.querySelector('.balance');
  const buyBtn = document.getElementById('buy-btn');
  const sellBtn = document.getElementById('sell-btn');
  const messageDiv = document.querySelector('.message');
  const levelSelect = document.getElementById('level');
  
  let balance = 10000;
  let holdings = [];
  let selectedCurrency = null;
  let priceUpdateInterval;
  
  function startGame() {
    displayMarket();
    displayPortfolio();
    updatePrices();
    priceUpdateInterval = setInterval(updatePrices, getPriceUpdateInterval());
  }
  
  function displayMarket() {
    currenciesDiv.innerHTML = '';
    currencyData.forEach(currency => {
      const currencyDiv = document.createElement('div');
      currencyDiv.className = 'currency';
      currencyDiv.textContent = `${currency.name} (${currency.symbol}): $${currency.price.toFixed(2)}`;
      currencyDiv.addEventListener('click', () => selectCurrency(currency));
      currenciesDiv.appendChild(currencyDiv);
    });
  }
  
  function displayPortfolio() {
    holdingsDiv.innerHTML = '';
    holdings.forEach(holding => {
      const holdingDiv = document.createElement('div');
      holdingDiv.className = 'holding';
      holdingDiv.textContent = `${holding.currency.name} (${holding.currency.symbol}): ${holding.amount}`;
      holdingsDiv.appendChild(holdingDiv);
    });
    balanceDisplay.textContent = balance.toFixed(2);
  }
  
  function selectCurrency(currency) {
    selectedCurrency = currency;
    buyBtn.disabled = false;
    sellBtn.disabled = holdings.find(holding => holding.currency.symbol === currency.symbol) ? false : true;
    updateMessage(`Selected ${currency.name} (${currency.symbol})`);
  }
  
  function buyCurrency() {
    if (selectedCurrency && balance >= selectedCurrency.price) {
      const existingHolding = holdings.find(holding => holding.currency.symbol === selectedCurrency.symbol);
      if (existingHolding) {
        existingHolding.amount += 1;
      } else {
        holdings.push({ currency: selectedCurrency, amount: 1 });
      }
      balance -= selectedCurrency.price;
      displayPortfolio();
      updateMessage(`Bought 1 ${selectedCurrency.name} (${selectedCurrency.symbol})`);
    } else {
      updateMessage('Insufficient funds');
    }
  }
  
  function sellCurrency() {
    const holding = holdings.find(holding => holding.currency.symbol === selectedCurrency.symbol);
    if (holding && holding.amount > 0) {
      holding.amount -= 1;
      balance += selectedCurrency.price;
      if (holding.amount === 0) {
        holdings = holdings.filter(h => h !== holding);
      }
      displayPortfolio();
      updateMessage(`Sold 1 ${selectedCurrency.name} (${selectedCurrency.symbol})`);
    } else {
      updateMessage('No holdings to sell');
    }
  }
  
  function updatePrices() {
    currencyData.forEach(currency => {
      const priceChange = getPriceChange();
      currency.price += priceChange;
    });
    displayMarket();
  }
  
  function getPriceChange() {
    const level = levelSelect.value;
    let volatility;
    switch (level) {
      case 'easy':
        volatility = 0.01; // 1% price change
        break;
      case 'medium':
        volatility = 0.03; // 3% price change
        break;
      case 'hard':
        volatility = 0.05; // 5% price change
        break;
    }
    const sign = Math.random() < 0.5 ? -1 : 1;
    const priceChangePercentage = sign * volatility * Math.random();
    return priceChangePercentage;
  }
  
  function getPriceUpdateInterval() {
    const level = levelSelect.value;
    let interval;
    switch (level) {
      case 'easy':
        interval = 10000; // 10 seconds
        break;
      case 'medium':
        interval = 5000; // 5 seconds
        break;
      case 'hard':
        interval = 2000; // 2 seconds
        break;
    }
    return interval;
  }
  
  function updateMessage(message) {
    messageDiv.textContent = message;
  }
  
  startGame();
  
  buyBtn.addEventListener('click', buyCurrency);
  sellBtn.addEventListener('click', sellCurrency);
  levelSelect.addEventListener('change', () => {
    clearInterval(priceUpdateInterval);
    startGame();
  });