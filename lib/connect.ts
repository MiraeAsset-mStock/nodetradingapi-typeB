import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ROUTES } from '../constants/routes';
import { DEFAULTS } from '../constants';
import { 
    LoginReq, 
    APIResponse, 
    TypeBToken, 
    CancelOrderParams, 
    ConvertPositionParams, 
    FetchedLtp, 
    FetchedOhlc, 
    HistoricalDataParams, 
    ModifyOrderParams, 
    OrderBookData, 
    OrderDetails, 
    OrderDetailsReq, 
    PlaceOrderParams, 
    PositionData, 
    QuoteData, 
    QuoteParams, 
    TypeBHolding, 
    TradeHistoryReq, 
    OrderMarginReq, 
    LoserGainer, 
    IntradyChartDataParams, 
    FetchBasket, 
    RenameBasket, 
    CreateBasket, 
    DeleteBasket, 
    CalcualteBasket 
} from '../types';

/**
 * REST API Client for TypeB Trading API
 * 
 * This class provides a comprehensive interface for interacting with the TypeB trading API.
 * It handles authentication, order management, portfolio operations, market data retrieval,
 * and other trading functionalities through RESTful endpoints.
 * 
 * @class MConnect
 * @example
 * ```typescript
 * const client = new MConnect('https://api.mstock.trade', 'your-api-key');
 * await client.login({ clientcode: 'user', password: 'pass', totp: '123456', state: 'state' });
 * ```
 */
export class MConnect {
    private baseURL: string;
    private apiKey: string;
    private jwtToken: string | null;
    private httpClient: AxiosInstance;

    /**
     * Creates an instance of MConnect
     * 
     * @param {string} baseUrl - Base URL for the API (defaults to https://api.mstock.trade)
     * @param {string} apiKey - API key for authentication
     * @param {string | null} [jwtToken=null] - JWT token for authenticated requests
     */
    constructor(baseUrl: string, apiKey: string, jwtToken: string | null = null) {
        this.baseURL = baseUrl || DEFAULTS.API_BASE_URL;
        this.apiKey = apiKey;
        this.jwtToken = jwtToken;

        this.httpClient = axios.create({ baseURL: this.baseURL });
    }

    /**
     * Sets the access token for authenticated requests
     * 
     * @param {string} jwtToken - JWT token received after successful login
     */
    public setAccessToken(jwtToken: string): void {
        this.jwtToken = jwtToken;
    }

    /**
     * Executes an HTTP request with proper authentication headers
     * 
     * @private
     * @template T - Expected response type
     * @param {AxiosRequestConfig} config - Request configuration
     * @returns {Promise<T>} Promise resolving to the response data
     * @throws {Error} Throws error if request fails
     */
    private async executeRequest<T>(config: AxiosRequestConfig): Promise<T> {
        try {
            const headers = {
                'Authorization': `Bearer ${this.jwtToken}`,
                'X-PrivateKey': this.apiKey,
                'X-Mirae-Version': '1',
                'Accept': 'application/json',
                ...config.headers,
            };
            const finalConfig: AxiosRequestConfig = { ...config, headers };
            const response = await this.httpClient(finalConfig);

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(`API Error: ${error.response.status} ${error.response.data?.message || error.message}`);
            }
            throw error;
        }
    }

    /**
     * User login endpoint
     * 
     * Authenticates user credentials and returns access tokens
     * 
     * @param {LoginReq} params - Login credentials
     * @returns {Promise<APIResponse<TypeBToken>>} Authentication response with tokens
     */
    public async login(params: LoginReq): Promise<APIResponse<TypeBToken>> {
        const route = ROUTES.login;
        return this.executeRequest({
            method: 'POST',
            url: route,
            data: params,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    /**
     * Verify OTP for session token
     * 
     * @param {string} refreshToken - Refresh token from login
     * @param {string} otp - One-time password
     * @returns {Promise<APIResponse<TypeBToken>>} Updated authentication tokens
     */
    public async verifyOTP(refreshToken: string, otp: string): Promise<APIResponse<TypeBToken>> {
        const params = { refreshToken, otp };
        return this.executeRequest<APIResponse<TypeBToken>>({
            method: 'POST',
            url: ROUTES.sessionToken,
            data: params,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    /**
     * Verify TOTP for two-factor authentication
     * 
     * @param {string} refreshToken - Refresh token
     * @param {string} totp - Time-based one-time password
     * @returns {Promise<APIResponse<TypeBToken>>} Authentication response
     */
    public async verifyTOTP(refreshToken: string, totp: string): Promise<APIResponse<TypeBToken>> {
        const params = { refreshToken, totp };
        return this.executeRequest<APIResponse<TypeBToken>>({
            method: 'POST',
            url: ROUTES.verifyTOTP,
            data: params,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    /**
     * Place a new order
     * 
     * Submits a new order to the exchange
     * 
     * @param {PlaceOrderParams} params - Order parameters
     * @returns {Promise<APIResponse<{ orderid: string }>>} Order placement response
     */
    public async placeOrder(params: PlaceOrderParams): Promise<APIResponse<{ orderid: string }>> {
        return this.executeRequest<APIResponse<{ orderid: string }>>({
            method: 'POST',
            url: ROUTES.placeOrder,
            data: params,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    /**
     * Modify an existing order
     * 
     * Updates order parameters for an existing order
     * 
     * @param {ModifyOrderParams} params - Order modification parameters
     * @returns {Promise<APIResponse<{ orderid: string }>>} Modification response
     */
    public async modifyOrder(params: ModifyOrderParams): Promise<APIResponse<{ orderid: string }>> {
        const route = ROUTES.modifyOrder.replace('{orderid}', params.orderid);
        return this.executeRequest<APIResponse<{ orderid: string }>>({
            method: 'PUT',
            url: route,
            data: params,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    /**
     * Cancel an existing order
     * 
     * Cancels a pending or partially filled order
     * 
     * @param {CancelOrderParams} params - Order cancellation parameters
     * @returns {Promise<APIResponse<{ orderid: string }>>} Cancellation response
     */
    public async cancelOrder(params: CancelOrderParams): Promise<APIResponse<{ orderid: string }>> {
        const route = ROUTES.cancelOrder.replace('{orderid}', params.orderid);
        return this.executeRequest<APIResponse<{ orderid: string }>>({
            method: 'DELETE',
            url: route,
            data: params,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    /**
     * Get detailed order information
     * 
     * Retrieves comprehensive details for a specific order
     * 
     * @param {OrderDetailsReq} params - Order details request parameters
     * @returns {Promise<OrderDetails[]>} Detailed order information
     */
    public async getOrderDetails(params: OrderDetailsReq): Promise<OrderDetails[]> {
        const route = ROUTES.getorderdetails;

        return this.executeRequest({
            method: 'POST',
            url: route,
            data: params,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    /**
     * Get trade history
     * 
     * Retrieves historical trades for a date range
     * 
     * @param {TradeHistoryReq} params - Trade history parameters
     * @returns {Promise<any[]>} Array of trade records
     */
    public async getTradeHistory(params: TradeHistoryReq): Promise<any[]> {
        const route = ROUTES.trades;
        return this.executeRequest({
            method: 'POST',
            url: route,
            data: params,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    /**
     * Calculate order margin
     * 
     * Calculates the required margin for placing orders
     * 
     * @param {OrderMarginReq} params - Order margin calculation parameters
     * @returns {Promise<any[]>} Margin calculation results
     */
    public async orderMargin(params: OrderMarginReq): Promise<any[]> {
        const route = ROUTES.ordermargin;
        return this.executeRequest({
            method: 'POST',
            url: route,
            data: params,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    /**
     * Get top losers and gainers
     * 
     * Retrieves market data for top performing and underperforming securities
     * 
     * @param {LoserGainer} params - Loser/gainer request parameters
     * @returns {Promise<any[]>} Array of market performance data
     */
    public async loserGainer(params: LoserGainer): Promise<any[]> {
        const route = ROUTES.losergainer;
        return this.executeRequest({
            method: 'POST',
            url: route,
            data: params,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    /**
     * Cancel all open orders
     * 
     * Cancels all pending orders across all segments
     * 
     * @returns {Promise<any>} Cancellation response
     */
    public async cancelAllOrders(): Promise<any> {
        return this.executeRequest({ method: 'POST', url: ROUTES.cancelAll });
    }

    /**
     * Get fund summary
     * 
     * Retrieves account balance and fund summary
     * 
     * @returns {Promise<any>} Fund summary data
     */
    public async getFundSummary(): Promise<any> {
        return this.executeRequest({ method: 'GET', url: ROUTES.fundSummary });
    }

    /**
     * Get order book
     * 
     * Retrieves all orders including pending, executed, and cancelled orders
     * 
     * @returns {Promise<APIResponse<OrderBookData[]>>} Order book data
     */
    public async getOrderBook(): Promise<APIResponse<OrderBookData[]>> {
        return this.executeRequest({ method: 'GET', url: ROUTES.getOrders });
    }

    /**
     * Get open positions
     * 
     * Retrieves current open positions across all segments
     * 
     * @returns {Promise<APIResponse<PositionData[]>>} Position data
     */
    public async getPositions(): Promise<APIResponse<PositionData[]>> {
        return this.executeRequest({ method: 'GET', url: ROUTES.getPositions });
    }

    /**
     * Get portfolio holdings
     * 
     * Retrieves current portfolio holdings
     * 
     * @returns {Promise<APIResponse<TypeBHolding[]>>} Holdings data
     */
    public async getHoldings(): Promise<APIResponse<TypeBHolding[]>> {
        return this.executeRequest({ method: 'GET', url: ROUTES.getHoldings });
    }

    /**
     * Get historical candlestick data
     * 
     * Retrieves historical price data in OHLC format
     * 
     * @param {HistoricalDataParams} params - Historical data parameters
     * @returns {Promise<APIResponse<[string, number, number, number, number, number][]>>} Historical data
     */
    public async getHistoricalData(params: HistoricalDataParams): Promise<APIResponse<[string, number, number, number, number, number][]>> {
        return this.executeRequest({
            method: 'POST',
            url: ROUTES.historicalData,
            data: params,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    /**
     * Get intraday chart data
     * 
     * Retrieves intraday price data for charting
     * 
     * @param {IntradyChartDataParams} params - Intraday data parameters
     * @returns {Promise<APIResponse<[string, number, number, number, number, number][]>>} Intraday data
     */
    public async getIntradayChartData(params: IntradyChartDataParams): Promise<APIResponse<[string, number, number, number, number, number][]>> {
        return this.executeRequest({
            method: 'POST',
            url: ROUTES.intradayChartData,
            data: params,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    /**
     * Get instrument master data
     * 
     * Retrieves complete instrument master data in CSV format
     * 
     * @returns {Promise<string>} CSV formatted instrument data
     */
    public async getInstrumentMaster(): Promise<string> {
        return this.executeRequest<string>({
            method: 'GET',
            url: ROUTES.scriptMaster,
            headers: {
                'Accept': 'text/csv, application/json'
            }
        });
    }

    /**
     * Get real-time quotes
     * 
     * Retrieves real-time quotes for specified instruments
     * 
     * @param {QuoteParams} params - Quote request parameters
     * @returns {Promise<APIResponse<QuoteData<FetchedLtp | FetchedOhlc>>>} Quote data
     */
    public async getQuote(params: QuoteParams): Promise<APIResponse<QuoteData<FetchedLtp | FetchedOhlc>>> {
        return this.executeRequest({
            method: 'POST',
            url: ROUTES.quote,
            data: params,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    /**
     * Convert position type
     * 
     * Converts position from one product type to another (e.g., intraday to delivery)
     * 
     * @param {ConvertPositionParams} params - Position conversion parameters
     * @returns {Promise<APIResponse<any>>} Conversion response
     */
    public async convertPosition(params: ConvertPositionParams): Promise<APIResponse<any>> {
         return this.executeRequest<APIResponse<any>>({
            method: 'POST',
            url: ROUTES.convertPosition,
            data: params,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    /**
     * Get trade book
     * 
     * Retrieves trade book with all executed trades
     * 
     * @returns {Promise<APIResponse<any>>} Trade book data
     */
    public async getTradeBook(): Promise<APIResponse<any>> {
        return this.executeRequest({ method: 'GET', url: ROUTES.tradeBook });
    }

    /**
     * User logout
     * 
     * Logs out the current user and invalidates the session
     * 
     * @param {string} clientCode - Client code
     * @param {string} jwtToken - JWT token
     * @returns {Promise<APIResponse<any>>} Logout response
     */
    public async logout(clientCode: string, jwtToken: string): Promise<APIResponse<any>> {
        return this.executeRequest({
            method: 'GET',
            url: ROUTES.logout,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    /**
     * Fetch basket orders
     * 
     * Retrieves all basket orders
     * 
     * @returns {Promise<FetchBasket[]>} Array of basket orders
     */
    public async fetchBasket(): Promise<FetchBasket[]> {
        return this.executeRequest({ method: 'GET', url: ROUTES.fetchbasket });
    }

    /**
     * Create basket order
     * 
     * Creates a new basket order
     * 
     * @param {CreateBasket} params - Basket creation parameters
     * @returns {Promise<any[]>} Creation response
     */
    public async createBasket(params: CreateBasket): Promise<any[]> {
        const route = ROUTES.createbasket;
        return this.executeRequest({
            method: 'POST',
            url: route,
            data: params,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    /**
     * Rename basket order
     * 
     * Renames an existing basket order
     * 
     * @param {RenameBasket} params - Basket rename parameters
     * @returns {Promise<any[]>} Rename response
     */
    public async renameBasket(params: RenameBasket): Promise<any[]> {
        const route = ROUTES.renamebasket;
        return this.executeRequest({
            method: 'PUT',
            url: route,
            data: params,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    /**
     * Delete basket order
     * 
     * Deletes an existing basket order
     * 
     * @param {DeleteBasket} params - Basket deletion parameters
     * @returns {Promise<any[]>} Deletion response
     */
    public async deleteBasket(params: DeleteBasket): Promise<any[]> {
        const route = ROUTES.deletebasket;
        return this.executeRequest({
            method: 'DELETE',
            url: route,
            data: params,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    /**
     * Calculate basket order
     * 
     * Calculates basket order details including margin requirements
     * 
     * @param {CalcualteBasket} params - Basket calculation parameters
     * @returns {Promise<any[]>} Calculation results
     */
    public async calculateBasket(params: CalcualteBasket): Promise<any[]> {
        const route = ROUTES.calculatebasket;
        return this.executeRequest({
            method: 'POST',
            url: route,
            data: params,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    /**
     * Get option chain master data
     * 
     * Retrieves option chain master data for a specific exchange
     * 
     * @param {string} exchange - Exchange identifier
     * @returns {Promise<any>} Option chain master data
     */
    public async getOptionChainMaster(exchange: string): Promise<any> {
        const route = ROUTES.optionchainmaster
            .replace('{exchange}', String(exchange));
        return this.executeRequest({
            method: 'GET',
            url: route
        });
    }

    /**
     * Get option chain data
     * 
     * Retrieves detailed option chain data for specific expiry and token
     * 
     * @param {string} exchange - Exchange identifier
     * @param {string} expiry - Expiry date
     * @param {string} token - Symbol token
     * @returns {Promise<any>} Option chain data
     */
    public async getOptionChain(exchange: string, expiry: string, token: string): Promise<any> {
        const route = ROUTES.optionchain
            .replace('{exchange}', exchange)
            .replace('{expiry}', expiry)
            .replace('{token}', token);
        return this.executeRequest({
            method: 'GET',
            url: route
        });
    }
}
