# The mConnect TradingAPI TypeB TypeScript/JavaScript SDK

The official TypeScript/JavaScript client for communicating with the mConnect TypeB Trading API.

MConnect TypeA is a comprehensive trading API that provides capabilities required to build a complete investment and trading platform. Execute orders in real time, manage user portfolio, stream live market data (WebSockets), and more.

## Documentation

- [mConnect API documentation](https://tradingapi.mstock.com/)
- [Examples](./examples/)

## Requirements

- Node.js v18.0.0+

## Installation

Install via [npm](https://www.npmjs.com/package/@mstock/mconnectb)

```bash
npm install @mstock/mconnectb
```
##  Features

- **Comprehensive API Coverage** - Full support for all TypeB trading API endpoints
- **TypeScript Support** - Fully typed with TypeScript for better development experience
- **Authentication** - Built-in support for JWT token authentication
- **Order Management** - Place, modify, cancel orders with ease
- **Portfolio Management** - View positions, holdings, and trade history
- **Market Data** - Real-time quotes, historical data, and chart data
- **Basket Orders** - Create and manage basket orders
- **Options Trading** - Complete options chain support
- **Error Handling** - Comprehensive error handling and retry mechanisms

##  Getting started with API

### Basic Setup

```typescript
import { MConnect } from '@mstock/mconnectb';

// Initialize the client
const client = new MConnect('https://api.mstock.trade', 'your-api-key');

// Login
const loginResponse = await client.login({
    clientcode: 'your-client-code',
    password: 'your-password',
    totp: 'your-totp',
    state: 'your-state'
});

// Set access token
client.setAccessToken(loginResponse.data.jwtToken);
```

### Place an Order

```typescript
const order = await client.placeOrder({
    variety: 'NORMAL',
    tradingsymbol: 'INFY',
    symboltoken: '1594',
    exchange: 'NSE',
    transactiontype: 'BUY',
    ordertype: 'LIMIT',
    quantity: '100',
    producttype: 'DELIVERY',
    price: '1500'
});
```

##  Authentication

The SDK supports JWT token authentication. After successful login, use the `setAccessToken` method to set the authentication token.

```typescript
const loginResponse = await client.login({
    clientcode: 'your-client-code',
    password: 'your-password',
    totp: 'your-totp',
    state: 'your-state'
});

client.setAccessToken(loginResponse.data.jwtToken);
```

##  Usage Examples

### Order Management

```typescript
// Place an order
const order = await client.placeOrder({
    variety: 'NORMAL',
    tradingsymbol: 'INFY',
    symboltoken: '1594',
    exchange: 'NSE',
    transactiontype: 'BUY',
    ordertype: 'LIMIT',
    quantity: '100',
    producttype: 'DELIVERY',
    price: '1500'
});

// Modify an order
const modifiedOrder = await client.modifyOrder({
    variety: 'NORMAL',
    orderid: '123456',
    tradingsymbol: 'INFY',
    symboltoken: '1594',
    exchange: 'NSE',
    ordertype: 'MARKET',
    quantity: '50',
    producttype: 'DELIVERY'
});

// Cancel an order
await client.cancelOrder({
    variety: 'NORMAL',
    orderid: '123456'
});
```

### Portfolio Management

```typescript
// Get positions
const positions = await client.getPositions();

// Get holdings
const holdings = await client.getHoldings();

// Get fund summary
const fundSummary = await client.getFundSummary();
```

### Market Data

```typescript
// Get historical data
const historicalData = await client.getHistoricalData({
    exchange: 'NSE',
    symboltoken: '1594',
    interval: 'ONE_MINUTE',
    fromdate: '2024-01-01',
    todate: '2024-01-31'
});

// Get real-time quotes
const quotes = await client.getQuote({
    mode: 'FULL',
    exchangeTokens: {
        NSE: ['1594', '2885'],
        BSE: ['500325', '500209']
    }
});
```

### Basket Orders

```typescript
// Create basket
const basket = await client.createBasket({
    BaskName: 'MyStrategy',
    BaskDesc: 'My trading strategy basket'
});

// Calculate basket
const calculation = await client.calculateBasket({
    basket_name: 'MyStrategy',
    basket_id: '123',
    operation: 'CALCULATE',
    include_exist_pos: 'Y'
});
```

##  API Reference

### Authentication

| Method | Description |
|--------|-------------|
| `login()` | User authentication |
| `verifyOTP()` | Verify OTP for session token |
| `verifyTOTP()` | Verify TOTP for 2FA |
| `logout()` | User logout |

### Order Management

| Method | Description |
|--------|-------------|
| `placeOrder()` | Place new orders |
| `modifyOrder()` | Modify existing orders |
| `cancelOrder()` | Cancel orders |
| `cancelAllOrders()` | Cancel all open orders |

### Portfolio Operations

| Method | Description |
|--------|-------------|
| `getPositions()` | Get open positions |
| `getHoldings()` | Get portfolio holdings |
| `getFundSummary()` | Get fund summary |

### Market Data

| Method | Description |
|--------|-------------|
| `getHistoricalData()` | Get historical candlestick data |
| `getIntradayChartData()` | Get intraday chart data |
| `getQuote()` | Get real-time quotes |
| `getInstrumentMaster()` | Get instrument master data |

### Options Trading

| Method | Description |
|--------|-------------|
| `getOptionChainMaster()` | Get option chain master data |
| `getOptionChain()` | Get detailed option chain data |


### Testing

```bash
npm test
```

### Building

```bash
npm run build
```


## License

MIT License - see [LICENSE](LICENSE) file for details.

m.Stock By Mirae Asset Capital Markets (India) Pvt. Ltd. (c) 2025. Licensed under the MIT License.


## Support
For issues, please open an issue on GitHub.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch (feature-xyz)
3. Commit your changes
4. Push the branch and create a pull request
