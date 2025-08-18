/**
 * Trading constants and enumerations for TypeB SDK
 * 
 * This module contains all the constant values and enumerations used throughout the TypeB SDK.
 * These constants define standard values for product types, order types, exchanges, intervals,
 * and other trading-related configurations.
 * 
 * @module constants
 */

/**
 * Product types available for trading
 * Defines the different types of trading products supported by the SDK
 * 
 * @constant
 * @type {Object}
 * @property {string} DELIVERY - Delivery-based trading (hold positions overnight)
 * @property {string} MARGIN - Margin trading with leverage
 * @property {string} INTRADAY - Intraday trading (square off same day)
 * @property {string} BO - Bracket Order trading with predefined stop loss and target
 * @property {string} CARRYFORWARD - Carry forward positions to next day
 */
export const PRODUCT_TYPES = {
    DELIVERY: 'DELIVERY',
    MARGIN: 'MARGIN',
    INTRADAY: 'INTRADAY',
    BO: 'BO',
    CARRYFORWARD: 'CARRYFORWARD',
} as const;

/**
 * Order types for placing trades
 * Defines the various order types supported for trade execution
 * 
 * @constant
 * @type {Object}
 * @property {string} MARKET - Market order (executes at current market price)
 * @property {string} LIMIT - Limit order (executes at specified price or better)
 * @property {string} STOPLOSS_LIMIT - Stop loss limit order (triggers at stop price, executes at limit price)
 * @property {string} STOPLOSS_MARKET - Stop loss market order (triggers at stop price, executes at market price)
 */
export const ORDER_TYPES = {
    MARKET: 'MARKET',
    LIMIT: 'LIMIT',
    STOPLOSS_LIMIT: 'STOPLOSS_LIMIT',
    STOPLOSS_MARKET: 'STOPLOSS_MARKET',
} as const;

/**
 * Order varieties for different trading scenarios
 * Defines special order types for specific trading requirements
 * 
 * @constant
 * @type {Object}
 * @property {string} NORMAL - Regular order type
 * @property {string} STOPLOSS - Stop loss order variety
 * @property {string} ROBO - Robo order with automated features
 * @property {string} AMO - After Market Order (placed outside market hours)
 */
export const VARIETIES = {
    NORMAL: 'NORMAL',
    STOPLOSS: 'STOPLOSS',
    ROBO: 'ROBO',
    AMO: 'AMO',
} as const;

/**
 * Transaction types for buy/sell operations
 * Defines the basic transaction directions
 * 
 * @constant
 * @type {Object}
 * @property {string} BUY - Buy transaction
 * @property {string} SELL - Sell transaction
 */
export const TRANSACTION_TYPES = {
    BUY: 'BUY',
    SELL: 'SELL',
} as const;

/**
 * Order validity types
 * Defines how long an order remains active in the system
 * 
 * @constant
 * @type {Object}
 * @property {string} DAY - Valid for the entire trading day
 * @property {string} IOC - Immediate or Cancel (executes immediately or cancels)
 */
export const VALIDITY_TYPES = {
    DAY: 'DAY',
    IOC: 'IOC',
} as const;

/**
 * Exchange identifiers
 * Defines all supported exchanges for trading
 * 
 * @constant
 * @type {Object}
 * @property {string} NSE - National Stock Exchange of India
 * @property {string} BSE - Bombay Stock Exchange
 * @property {string} NFO - NSE Futures and Options
 * @property {string} BFO - BSE Futures and Options
 * @property {string} CDS - Currency Derivatives Segment
 * @property {string} MCX - Multi Commodity Exchange
 * @property {string} NCDEX - National Commodity & Derivatives Exchange
 */
export const EXCHANGES = {
    NSE: 'NSE',
    BSE: 'BSE',
    NFO: 'NFO',
    BFO: 'BFO',
    CDS: 'CDS',
    MCX: 'MCX',
    NCDEX: 'NCDEX',
} as const;

/**
 * Candlestick intervals for historical data
 * Defines the time intervals for fetching historical price data
 * 
 * @constant
 * @type {Object}
 * @property {string} ONE_MINUTE - 1 minute interval
 * @property {string} THREE_MINUTE - 3 minute interval
 * @property {string} FIVE_MINUTE - 5 minute interval
 * @property {string} TEN_MINUTE - 10 minute interval
 * @property {string} FIFTEEN_MINUTE - 15 minute interval
 * @property {string} THIRTY_MINUTE - 30 minute interval
 * @property {string} ONE_HOUR - 1 hour interval
 * @property {string} ONE_DAY - 1 day interval
 */
export const INTERVALS = {
    ONE_MINUTE: 'ONE_MINUTE',
    THREE_MINUTE: 'THREE_MINUTE',
    FIVE_MINUTE: 'FIVE_MINUTE',
    TEN_MINUTE: 'TEN_MINUTE',
    FIFTEEN_MINUTE: 'FIFTEEN_MINUTE',
    THIRTY_MINUTE: 'THIRTY_MINUTE',
    ONE_HOUR: 'ONE_HOUR',
    ONE_DAY: 'ONE_DAY',
} as const;

/**
 * Default configuration values
 * Defines the default settings and URLs for the SDK
 * 
 * @constant
 * @type {Object}
 * @property {string} API_BASE_URL - Base URL for API endpoints
 * @property {string} SOCKET_BASE_URL - Base URL for WebSocket connections
 * @property {string} wsURL - WebSocket URL for real-time data
 * @property {number} MAX_RECONNECTION_ATTEMPTS - Maximum attempts for reconnection
 * @property {number} RECONNECT_DELAY - Delay between reconnection attempts (milliseconds)
 * @property {number} TIMEOUT - Request timeout duration (milliseconds)
 */
export const DEFAULTS = {
    API_BASE_URL: 'https://api.mstock.trade',
    SOCKET_BASE_URL: 'wss://ws.mstock.trade',
    wsURL: 'wss://ws.mstock.trade',
    MAX_RECONNECTION_ATTEMPTS: 5,
    RECONNECT_DELAY: 5000,
    TIMEOUT: 30000,
} as const;
