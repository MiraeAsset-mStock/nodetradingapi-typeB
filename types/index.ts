/**
 * Type definitions for TypeB SDK
 * 
 * This module contains all TypeScript type definitions used throughout the TypeB SDK.
 * These types define the structure for request parameters, response data, authentication,
 * trading operations, and WebSocket communications.
 * 
 * @module types
 */

// =============================================================================
// REQUEST PARAMETER TYPES
// =============================================================================

/**
 * Parameters for placing a new order
 * 
 * Defines the structure for order placement requests including all required
 * and optional parameters for different order types.
 * 
 * @interface PlaceOrderParams
 * @property {string} variety - Order variety (NORMAL, STOPLOSS, ROBO, AMO)
 * @property {string} tradingsymbol - Trading symbol of the instrument
 * @property {string} symboltoken - Unique symbol token identifier
 * @property {string} exchange - Exchange identifier (NSE, BSE, NFO, etc.)
 * @property {string} transactiontype - Transaction type (BUY or SELL)
 * @property {string} ordertype - Order type (MARKET, LIMIT, STOPLOSS_LIMIT, STOPLOSS_MARKET)
 * @property {string} quantity - Order quantity
 * @property {string} producttype - Product type (DELIVERY, MARGIN, INTRADAY, BO, CARRYFORWARD)
 * @property {string} [price] - Order price (required for LIMIT orders)
 * @property {string} [triggerprice] - Trigger price (required for STOPLOSS orders)
 * @property {string} [squareoff] - Square off price (for BO orders)
 * @property {string} [stoploss] - Stop loss price (for BO orders)
 * @property {string} [trailingStopLoss] - Trailing stop loss value
 * @property {string} [disclosedquantity] - Disclosed quantity for iceberg orders
 * @property {string} [duration] - Order validity (DAY or IOC)
 * @property {string} [ordertag] - Custom order tag for identification
 */
export interface PlaceOrderParams {
    variety: string;
    tradingsymbol: string;
    symboltoken: string;
    exchange: string;
    transactiontype: string;
    ordertype: string;
    quantity: string;
    producttype: string;
    price?: string;
    triggerprice?: string;
    squareoff?: string;
    stoploss?: string;
    trailingStopLoss?: string;
    disclosedquantity?: string;
    duration?: string;
    ordertag?: string;
}

/**
 * Parameters for modifying an existing order
 * 
 * Defines the structure for order modification requests.
 * 
 * @interface ModifyOrderParams
 * @property {string} variety - Order variety
 * @property {string} orderid - Unique order ID to modify
 * @property {string} tradingsymbol - Trading symbol
 * @property {string} symboltoken - Symbol token
 * @property {string} exchange - Exchange identifier
 * @property {string} ordertype - New order type
 * @property {string} quantity - New quantity
 * @property {string} producttype - New product type
 * @property {string} [duration] - New duration (DAY or IOC)
 * @property {string} [price] - New price
 * @property {string} [triggerprice] - New trigger price
 */
export interface ModifyOrderParams {
    variety: string;
    orderid: string;
    tradingsymbol: string;
    symboltoken: string;
    exchange: string;
    ordertype: string;
    quantity: string;
    producttype: string;
    duration?: string;
    price?: string;
    triggerprice?: string;
}

/**
 * Parameters for canceling an order
 * 
 * @interface CancelOrderParams
 * @property {string} variety - Order variety
 * @property {string} orderid - Order ID to cancel
 */
export interface CancelOrderParams {
    variety: string;
    orderid: string;
}

/**
 * Parameters for fetching order details
 * 
 * @interface OrderDetailsReq
 * @property {string} order_no - Order number to fetch details for
 * @property {string} segment - Market segment
 */
export interface OrderDetailsReq {
    order_no: string;
}

/**
 * Parameters for fetching historical data
 * 
 * @interface HistoricalDataParams
 * @property {string} exchange - Exchange identifier
 * @property {string} symboltoken - Symbol token
 * @property {string} interval - Candlestick interval
 * @property {string} fromdate - Start date in YYYY-MM-DD format
 * @property {string} todate - End date in YYYY-MM-DD format
 */
export interface HistoricalDataParams {
    exchange: string;
    symboltoken: string;
    interval: string;
    fromdate: string;
    todate: string;
}

/**
 * Parameters for fetching real-time quotes
 * 
 * @interface QuoteParams
 * @property {string} mode - Quote mode (LTP, OHLC, or FULL)
 * @property {Object} exchangeTokens - Object mapping exchanges to arrays of symbol tokens
 */
export interface QuoteParams {
    mode: string;
    exchangeTokens: {
        [exchange: string]: string[];
    };
}

/**
 * Parameters for converting position type
 * 
 * @interface ConvertPositionParams
 * @property {string} exchange - Exchange identifier
 * @property {string} symboltoken - Symbol token
 * @property {string} oldproducttype - Current product type
 * @property {string} newproducttype - New product type to convert to
 * @property {string} tradingsymbol - Trading symbol
 * @property {string} symbolname - Symbol name
 * @property {string} transactiontype - Transaction type (BUY or SELL)
 * @property {number} quantity - Quantity to convert
 * @property {string} type - Conversion type (DAY or NET)
 */
export interface ConvertPositionParams {
    exchange: string;
    symboltoken: string;
    oldproducttype: string;
    newproducttype: string;
    tradingsymbol: string;
    symbolname: string;
    transactiontype: string;
    quantity: number;
    type: string;
}

// =============================================================================
// RESPONSE TYPES
// =============================================================================

/**
 * Generic API response wrapper
 * 
 * Standard response format for all API endpoints
 * 
 * @interface APIResponse
 * @template T - Type of the response data
 * @property {boolean} status - Success status of the request
 * @property {string} message - Response message
 * @property {string} errorcode - Error code if request failed
 * @property {T | null} data - Response data or null if failed
 */
export interface APIResponse<T> {
    status: boolean;
    message: string;
    errorcode: string;
    data: T | null;
}

/**
 * Detailed order information
 * 
 * Comprehensive order details including all order parameters and current status
 * 
 * @interface OrderDetails
 */
export interface OrderDetails {
    variety: string;
    ordertype: string;
    producttype: string;
    duration: string;
    price: number;
    triggerprice: number;
    quantity: string;
    disclosedquantity: string;
    squareoff: number;
    stoploss: number;
    trailingstoploss: number;
    tradingsymbol: string;
    transactiontype: string;
    exchange: string;
    symboltoken: string;
    instrumenttype: string;
    strikeprice: number;
    optiontype: string;
    expirydate: string;
    lotsize: string;
    cancelsize: string;
    averageprice: string;
    filledshares: string;
    unfilledshares: string;
    orderid: string;
    text: string;
    status: string;
    orderstatus: string;
    updatetime: string;
    exchtime: string;
    exchorderupdatetime: string;
    fillid: string;
    filltime: string;
    parentorderid: string;
    ordertag: string;
    uniqueorderid: string;
}

/**
 * Order book entry data
 * 
 * Represents a single order in the order book
 * 
 * @interface OrderBookData
 */
export interface OrderBookData {
    variety: string;
    ordertype: string;
    producttype: string;
    duration: string;
    price: string;
    triggerprice: string;
    quantity: string;
    disclosedquantity: string;
    squareoff: string;
    stoploss: string;
    trailingstoploss: string;
    tradingsymbol: string;
    transactiontype: string;
    exchange: string;
    symboltoken: string;
    instrumenttype: string;
    strikeprice: string;
    optiontype: string;
    expirydate: string;
    lotsize: string;
    cancelsize: string;
    averageprice: string;
    filledshares: string;
    unfilledshares: string;
    orderid: string;
    text: string;
    status: string;
    orderstatus: string;
    updatetime: string;
    exchtime: string;
    exchorderupdatetime: string;
    fillid: string;
    filltime: string;
    parentorderid: string;
    uniqueorderid: string;
    exchangeorderid: string;
}

/**
 * Position data structure
 * 
 * Represents an open position in the portfolio
 * 
 * @interface PositionData
 */
export interface PositionData {
    exchange: string;
    symboltoken: string;
    producttype: string;
    tradingsymbol: string;
    symbolname: string;
    instrumenttype: string;
    netqty: string;
    buyavgprice: string;
    sellavgprice: string;
    ltp?: string;
    pnl?: string;
}

/**
 * Holdings data structure
 * 
 * Represents a holding in the portfolio
 * 
 * @interface TypeBHolding
 */
export interface TypeBHolding {
    tradingsymbol: string;
    exchange: string;
    isin: string;
    t1quantity: number;
    realisedquantity: number;
    quantity: number;
    authorisedquantity: number;
    product: string;
    collateralquantity: number;
    collateraltype: string;
    haircut: number;
    averageprice: number;
    ltp: number;
    symboltoken: string;
    close: number;
    profitandloss: number;
    pnlpercentage: number;
}

/**
 * Last traded price data
 * 
 * @interface FetchedLtp
 */
export interface FetchedLtp {
    exchange: string;
    tradingSymbol: string;
    symbolToken: string;
    ltp: number;
}

/**
 * OHLC (Open, High, Low, Close) data
 * 
 * @interface FetchedOhlc
 * @extends {FetchedLtp}
 */
export interface FetchedOhlc extends FetchedLtp {
    open: number;
    high: number;
    low: number;
    close: number;
}

/**
 * Unfetched data error information
 * 
 * @interface UnfetchedData
 */
export interface UnfetchedData {
    exchange: string;
    symbolToken: string;
    message: string;
    errorCode: string;
}

/**
 * Quote data wrapper
 * 
 * @interface QuoteData
 * @template T - Type of the quote data
 */
export interface QuoteData<T> {
    fetched: T[];
    unfetched: UnfetchedData[];
}

// =============================================================================
// WEBSOCKET TYPES
// =============================================================================

/**
 * Market depth packet data
 * 
 * Represents a single level in the market depth
 * 
 * @interface DepthPacket
 */
export interface DepthPacket {
    BuySellFlag: number;
    Quantity: bigint;
    Price: bigint;
    NumberOfOrders: number;
}

/**
 * Real-time feed data
 * 
 * Represents real-time market data received via WebSocket
 * 
 * @interface FeedData
 */
export interface FeedData {
    InstrumentToken: number;
    Mode: string;
    LastPrice: number;
    Tradable: boolean;
    LastQuantity?: number;
    AveragePrice?: number;
    Volume?: number;
    BuyQuantity?: number;
    SellQuantity?: number;
    Open?: number;
    High?: number;
    Low?: number;
    Close?: number;
    Change?: number;
    LastTradeTime?: Date;
    OI?: number;
    OIDayHigh?: number;
    OIDayLow?: number;
    Timestamp?: Date;
    Bids?: DepthData[];
    Offers?: DepthData[];
}

/**
 * Market depth data
 * 
 * @interface DepthData
 */
export interface DepthData {
    Quantity: number;
    Price: number;
    Orders: number;
}

// =============================================================================
// ORDER UPDATE TYPES
// =============================================================================

/**
 * Type A order update
 * 
 * @interface TypeAUpdate
 */
export interface TypeAUpdate {
    variety: string;
    ordertype: string;
    ordertag?: string;
    producttype: string;
    price: number;
    triggerprice: number;
    quantity: string;
    disclosedquantity: string;
    duration: string;
    squareoff: number;
    stoploss: number;
    trailingstoploss: number;
    tradingsymbol: string;
    transactiontype: string;
    exchange: string;
    symboltoken: string;
    instrumenttype: string;
    strikeprice: number;
    optiontype: string;
    expirydate: string;
    lotsize: string;
    cancelsize: string;
    averageprice: string;
    filledshares: string;
    unfilledshares: string;
    orderid: string;
    text?: string;
    status: string;
    orderstatus: string;
    updatetime: string;
    exchtime: string;
    exchorderupdatetime: string;
    fillid?: string;
    filltime?: string;
    parentorderid?: string;
}

/**
 * Type B order update
 * 
 * @interface TypeBUpdate
 */
export interface TypeBUpdate {
    variety: string;
    ordertype: string;
    ordertag?: string;
    producttype: string;
    price: number;
    triggerprice: number;
    quantity: string;
    disclosedquantity: string;
    duration: string;
    squareoff: number;
    stoploss: number;
    trailingstoploss: number;
    tradingsymbol: string;
    transactiontype: string;
    exchange: string;
    symboltoken: string;
    instrumenttype: string;
    strikeprice: number;
    optiontype: string;
    expirydate: string;
    lotsize: string;
    cancelsize: string;
    averageprice: string;
    filledshares: string;
    unfilledshares: string;
    orderid: string;
    text?: string;
    status: string;
    orderstatus: string;
    updatetime: string;
    exchtime: string;
    exchorderupdatetime: string;
    fillid?: string;
    filltime?: string;
    parentorderid?: string;
}

// =============================================================================
// AUTHENTICATION TYPES
// =============================================================================

/**
 * Login request parameters
 * 
 * @interface LoginReq
 */
export interface LoginReq {
    clientcode: string;
    password: string;
    totp: string;
    state: string;
}

/**
 * Authentication token response
 * 
 * @interface TypeBToken
 */
export interface TypeBToken {
    jwtToken: string;
    refreshToken: string;
    feedToken: string;
    state?: string;
}

// =============================================================================
// TRADING HISTORY TYPES
// =============================================================================

/**
 * Trade history request parameters
 * 
 * @interface TradeHistoryReq
 */
export interface TradeHistoryReq {
    fromdate: string;
    todate: string;
}

/**
 * Order margin calculation request
 * 
 * @interface OrderMarginReq
 */
export interface OrderMarginReq {
    orders: [OrderMargin];
}

/**
 * Individual order margin parameters
 * 
 * @interface OrderMargin
 */
export interface OrderMargin {
    product_type: string;
    transaction_type: string;
    quantity: number;
    price: number;
    exchange: string;
    symbol_name: string;
    token: number;
    trigger_price: number;
}

/**
 * Loser/Gainer data request parameters
 * 
 * @interface LoserGainer
 */
export interface LoserGainer {
    Exchange: number;
    SecurityIdCode: number;
    segment: number;
    TypeFlag: string;
}

/**
 * Intraday chart data request parameters
 * 
 * @interface IntradyChartDataParams
 */
export interface IntradyChartDataParams {
    exchange: string;
    symboltoken: string;
    interval: string;
}

// =============================================================================
// BASKET ORDER TYPES
// =============================================================================

/**
 * Basket order fetch response
 * 
 * @interface FetchBasket
 */
export interface FetchBasket {
    BASKET_ID: number;
    BASKET_NAME: string;
    COUNT: number;
    CREATE_DATE: string;
    DESCRIPTOR: string;
}

/**
 * Basket creation parameters
 * 
 * @interface CreateBasket
 */
export interface CreateBasket {
    BaskName: string;
    BaskDesc: string;
}

/**
 * Basket rename parameters
 * 
 * @interface RenameBasket
 */
export interface RenameBasket {
    basketName: string;
    BasketId: string;
}

/**
 * Basket deletion parameters
 * 
 * @interface DeleteBasket
 */
export interface DeleteBasket {
    BasketId: string;
}

/**
 * Basket calculation parameters
 * 
 * @interface CalcualteBasket
 */
export interface CalcualteBasket {
    include_exist_pos: string;
    ord_product: string;
    disc_qty: string;
    segment: string;
    trigger_price: string;
    scriptcode: string;
    ord_type: string;
    basket_name: string;
    operation: string;
    order_validity: string;
    order_qty: string;
    script_stat: string;
    buy_sell_indi: string;
    basket_priority: string;
    order_price: string;
    basket_id: string;
    exch_id: string;
}
