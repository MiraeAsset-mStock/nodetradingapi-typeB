/**
 * API routes and endpoints for TypeB SDK
 * 
 * This module contains all the API endpoint URLs used by the TypeB SDK to communicate with the backend services.
 * These routes cover authentication, order management, portfolio operations, market data, and other trading functionalities.
 * 
 * @module routes
 */

/**
 * API route definitions for all available endpoints
 * Defines the complete set of REST API endpoints supported by the TypeB SDK
 * 
 * @constant
 * @type {Object}
 * 
 * Authentication Endpoints:
 * @property {string} login - User authentication endpoint for login
 * @property {string} sessionToken - Generate session token for authenticated access
 * @property {string} verifyTOTP - Verify Two-Factor Authentication (2FA) TOTP code
 * 
 * Order Management Endpoints:
 * @property {string} placeOrder - Place new orders (regular orders)
 * @property {string} modifyOrder - Modify existing orders by order ID
 * @property {string} cancelOrder - Cancel specific order by order ID
 * @property {string} cancelAll - Cancel all open orders at once
 * @property {string} getOrders - Get list of all orders
 * @property {string} getorderdetails - Get detailed information for a specific order
 * @property {string} ordermargin - Calculate margin required for placing orders
 * 
 * Portfolio Endpoints:
 * @property {string} getPositions - Get current open positions
 * @property {string} getHoldings - Get portfolio holdings
 * @property {string} convertPosition - Convert position from intraday to delivery or vice versa
 * 
 * Market Data Endpoints:
 * @property {string} historicalData - Get historical candlestick data
 * @property {string} intradayChartData - Get intraday chart data
 * @property {string} scriptMaster - Get complete scrip master data
 * @property {string} quote - Get real-time quotes for instruments
 * @property {string} losergainer - Get top losers and gainers data
 * 
 * Trading Endpoints:
 * @property {string} tradeBook - Get trade book data
 * @property {string} trades - Get individual trades information
 * 
 * User Account Endpoints:
 * @property {string} fundSummary - Get user fund summary and balance
 * @property {string} logout - User logout endpoint
 * 
 * Basket Order Endpoints:
 * @property {string} createbasket - Create new basket order
 * @property {string} fetchbasket - Fetch existing basket orders
 * @property {string} renamebasket - Rename existing basket order
 * @property {string} deletebasket - Delete basket order
 * @property {string} calculatebasket - Calculate basket order details
 * 
 * Options Trading Endpoints:
 * @property {string} optionchainmaster - Get option chain master data for an exchange
 * @property {string} optionchain - Get option chain data for specific expiry and token
 */
export const ROUTES = {
    // Authentication
    login: "/openapi/typeb/connect/login",
    sessionToken: "/openapi/typeb/session/token",
    verifyTOTP: "/openapi/typeb/session/verifytotp",
    
    // Order Management
    placeOrder: "/openapi/typeb/orders/regular",
    modifyOrder: "/openapi/typeb/orders/regular/{orderid}",
    cancelOrder: "/openapi/typeb/orders/regular/{orderid}",
    cancelAll: "/openapi/typeb/orders/cancelall",
    getOrders: "/openapi/typeb/orders",
    getorderdetails: "/openapi/typeb/order/details",
    ordermargin: "/openapi/typeb/margins/orders",
    
    // Market Data
    losergainer: "/openapi/typeb/losergainer",
    
    // Portfolio
    getPositions: "/openapi/typeb/portfolio/positions",
    getHoldings: "/openapi/typeb/portfolio/holdings",
    historicalData: "/openapi/typeb/instruments/historical",
    intradayChartData: "/openapi/typeb/instruments/intraday",
    scriptMaster: "openapi/typeb/instruments/OpenAPIScripMaster",
    quote: "/openapi/typeb/instruments/quote",
    convertPosition: "/openapi/typeb/portfolio/convertposition",
    
    // Trading
    tradeBook: "/openapi/typeb/tradebook",
    trades: "/openapi/typeb/trades",
    
    // User Account
    fundSummary: "/openapi/typeb/user/fundsummary",
    logout: "/openapi/typeb/logout",
    
    // Basket Orders
    createbasket: "/openapi/typeb/CreateBasket",
    fetchbasket: "/openapi/typeb/FetchBasket",
    renamebasket: "/openapi/typeb/RenameBasket",
    deletebasket: "/openapi/typeb/DeleteBasket",
    calculatebasket: "/openapi/typeb/CalculateBasket",
    
    // Options
    optionchainmaster: "/openapi/typeb/getoptionchainmaster/{exchange}",
    optionchain: "/openapi/typeb/GetOptionChain/{exchange}/{expiry}/{token}"
} as const;

/**
 * Default configuration values for API connections
 * Defines the default settings for connecting to the TypeB API services
 * 
 * @constant
 * @type {Object}
 * @property {string} baseURL - Base URL for the API server
 * @property {string} wsURL - WebSocket URL for real-time data streaming
 * @property {number} timeout - Request timeout in milliseconds
 * @property {boolean} debug - Debug mode flag for verbose logging
 */
export const DEFAULTS = {
    baseURL: 'https://api.mstock.trade',
    wsURL: 'wss://ws.mstock.trade',
    timeout: 7000,
    debug: false
};
