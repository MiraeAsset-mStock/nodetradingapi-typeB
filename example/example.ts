/**
 * TypeB SDK Usage Examples
 * This file demonstrates how to use the TypeB SDK for TypeB Trading API
 * Package name: mconnectb
 */

//import { MConnect} from '@mstock-mirae-asset/nodetradingapi-typeb'
import { MConnect } from  '../lib/connect';
import { MConnectConfig } from '../types/config';
import { 
    LoginReq, 
    PlaceOrderParams, 
    ModifyOrderParams, 
    CancelOrderParams,
    HistoricalDataParams,
    QuoteParams,
    ConvertPositionParams,
    CreateBasket,
    RenameBasket,
    DeleteBasket,
    CalcualteBasket,
    IntradyChartDataParams,
    OrderMarginReq,
    OrderDetailsReq,
    TradeHistoryReq,
    LoserGainer
} from '../types';

// Initialize the SDK with your configuration
const config: MConnectConfig = {
    apiKey: 'ENTER_YOUR_API_KEY_HERE',
    baseUrl: 'https://api.mstock.trade',
    timeout: 30000,
};

// Create an instance of MConnect
const client = new MConnect(
    config.baseUrl || 'https://api.mstock.trade',
    config.apiKey,
    null // jwtToken - will be set after login
);

// Example 1: Authentication - Login
async function authenticate() {
    try {
        console.log('Starting authentication...');
        
        const loginParams: LoginReq = {
            clientcode: 'XXXXXXXXX', // Your client code
            password: 'XXXXXXXXX', // Your password
            totp: '', // Optional
            state: '' // Optional
        };

        const response = await client.login(loginParams);
        
        if (response.status && response.data) {
            // Set the JWT token for authenticated requests
            client.setAccessToken(response.data.jwtToken);
            console.log(' Login successful!');
            console.log('JWT Token:', response.data.jwtToken);
            console.log('Refresh Token:', response.data.refreshToken);
            return response.data;
        } else {
            console.error(' Login failed:', response.message);
            return null;
        }
    } catch (error) {
        console.error(' Authentication error:', error);
        return null;
    }
}

// Example 2: Verify OTP (for 2FA)
async function verifyOTP(refreshToken: string, otp: string) {
    try {
        console.log(' Verifying OTP...');
        
        const response = await client.verifyOTP(refreshToken, otp);
        
        if (response.status && response.data) {
            client.setAccessToken(response.data.jwtToken);
            console.log(' OTP verification successful!');
            return response.data;
        } else {
            console.error(' OTP verification failed:', response.message);
            return null;
        }
    } catch (error) {
        console.error(' OTP verification error:', error);
        return null;
    }
}

// Example 3: Verify TOTP (for 2FA)
async function verifyTOTP(refreshToken: string, totp: string) {
    try {
        console.log(' Verifying TOTP...');
        
        const response = await client.verifyTOTP(refreshToken, totp);
        
        if (response.status && response.data) {
            client.setAccessToken(response.data.jwtToken);
            console.log(' TOTP verification successful!');
            return response.data;
        } else {
            console.error(' TOTP verification failed:', response.message);
            return null;
        }
    } catch (error) {
        console.error(' TOTP verification error:', error);
        return null;
    }
}

// Example 4: Place a Market Order
async function placeMarketOrder() {
    try {
        console.log(' Placing market order...');
        
        const orderParams: PlaceOrderParams = {
            variety: 'NORMAL',
            tradingsymbol: 'RELIANCE-EQ',
            symboltoken: '2885',
            exchange: 'NSE',
            transactiontype: 'BUY',
            ordertype: 'MARKET',
            quantity: '10',
            producttype: 'INTRADAY',
            duration: 'DAY'
        };

        const response = await client.placeOrder(orderParams);
        
        if (response.status && response.data) {
            console.log(' Order placed successfully!');
            console.log('Order ID:', response.data.orderid);
            return response.data;
        } else {
            console.error(' Order placement failed:', response.message);
            return null;
        }
    } catch (error) {
        console.error(' Order placement error:', error);
        return null;
    }
}

// Example 5: Place a Limit Order
async function placeLimitOrder() {
    try {
        console.log(' Placing limit order...');
        
        const orderParams: PlaceOrderParams = {
            variety: 'NORMAL',
            tradingsymbol: 'TCS-EQ',
            symboltoken: '11536',
            exchange: 'NSE',
            transactiontype: 'BUY',
            ordertype: 'LIMIT',
            quantity: '5',
            producttype: 'DELIVERY',
            price: '3200.50',
            duration: 'DAY'
        };

        const response = await client.placeOrder(orderParams);
        
        if (response.status && response.data) {
            console.log(' Limit order placed successfully!');
            console.log('Order ID:', response.data.orderid);
            return response.data;
        } else {
            console.error(' Limit order placement failed:', response.message);
            return null;
        }
    } catch (error) {
        console.error(' Limit order placement error:', error);
        return null;
    }
}

// Example 6: Modify an Existing Order
async function modifyOrder(orderId: string) {
    try {
        console.log(' Modifying order...');
        
        const modifyParams: ModifyOrderParams = {
            variety: 'NORMAL',
            orderid: orderId,
            tradingsymbol: 'TCS-EQ',
            symboltoken: '11536',
            exchange: 'NSE',
            ordertype: 'LIMIT',
            quantity: '10',
            producttype: 'DELIVERY',
            price: '3190.00'
        };

        const response = await client.modifyOrder(modifyParams);
        
        if (response.status && response.data) {
            console.log(' Order modified successfully!');
            console.log('Order ID:', response.data.orderid);
            return response.data;
        } else {
            console.error(' Order modification failed:', response.message);
            return null;
        }
    } catch (error) {
        console.error(' Order modification error:', error);
        return null;
    }
}

// Example 7: Cancel an Order
async function cancelOrder(orderId: string) {
    try {
        console.log(' Canceling order...');
        
        const cancelParams: CancelOrderParams = {
            variety: 'NORMAL',
            orderid: orderId
        };

        const response = await client.cancelOrder(cancelParams);
        
        if (response.status && response.data) {
            console.log(' Order canceled successfully!');
            console.log('Order ID:', response.data.orderid);
            return response.data;
        } else {
            console.error(' Order cancellation failed:', response.message);
            return null;
        }
    } catch (error) {
        console.error(' Order cancellation error:', error);
        return null;
    }
}

// Example 8: Get Order Book
async function getOrderBook() {
    try {
        console.log(' Fetching order book...');
        
        const response = await client.getOrderBook();
        
        if (response.status && response.data) {
            console.log(' Order book retrieved successfully!');
            console.log('Total orders:', response.data.length);
            return response.data;
        } else {
            console.error(' Order book retrieval failed:', response.message);
            return null;
        }
    } catch (error) {
        console.error(' Order book retrieval error:', error);
        return null;
    }
}

// Example 9: Get Positions
async function getPositions() {
    try {
        console.log(' Fetching positions...');
        
        const response = await client.getPositions();
        
        if (response.status && response.data) {
            console.log(' Positions retrieved successfully!');
            console.log('Total positions:', response.data.length);
            return response.data;
        } else {
            console.error(' Positions retrieval failed:', response.message);
            return null;
        }
    } catch (error) {
        console.error(' Positions retrieval error:', error);
        return null;
    }
}

// Example 10: Get Holdings
async function getHoldings() {
    try {
        console.log(' Fetching holdings...');
        
        const response = await client.getHoldings();
        
        if (response.status && response.data) {
            console.log(' Holdings retrieved successfully!');
            console.log('Total holdings:', response.data.length);
            return response.data;
        } else {
            console.error(' Holdings retrieval failed:', response.message);
            return null;
        }
    } catch (error) {
        console.error(' Holdings retrieval error:', error);
        return null;
    }
}

// Example 11: Get Fund Summary
async function getFundSummary() {
    try {
        console.log(' Fetching fund summary...');
        
        const response = await client.getFundSummary();
        
        if (response.status && response.data) {
            console.log(' Fund summary retrieved successfully!');
            console.log('Available balance:', response.data.availablecash);
            console.log('Used margin:', response.data.usedmargin);
            return response.data;
        } else {
            console.error(' Fund summary retrieval failed:', response.message);
            return null;
        }
    } catch (error) {
        console.error(' Fund summary retrieval error:', error);
        return null;
    }
}

// Example 12: Get Historical Data
async function getHistoricalData() {
    try {
        console.log(' Fetching historical data...');
        
        const params: HistoricalDataParams = {
            exchange: 'NSE',
            symboltoken: '2885',
            interval: 'ONE_DAY',
            fromdate: '2024-01-01',
            todate: '2024-12-31'
        };

        const response = await client.getHistoricalData(params);
        
        if (response.status && response.data) {
            console.log(' Historical data retrieved successfully!');
            console.log('Total records:', response.data.length);
            return response.data;
        } else {
            console.error(' Historical data retrieval failed:', response.message);
            return null;
        }
    } catch (error) {
        console.error(' Historical data retrieval error:', error);
        return null;
    }
}

// Example 13: Get Quote Data
async function getQuoteData() {
    try {
        console.log(' Fetching quote data...');
        
        const params: QuoteParams = {
            mode: 'LTP',
            exchangeTokens: {
                NSE: ['2885', '11536'] // RELIANCE and TCS
            }
        };

        const response = await client.getQuote(params);
        
        if (response.status && response.data) {
            console.log(' Quote data retrieved successfully!');
            console.log('Fetched symbols:', response.data.fetched.length);
            return response.data;
        } else {
            console.error(' Quote data retrieval failed:', response.message);
            return null;
        }
    } catch (error) {
        console.error(' Quote data retrieval error:', error);
        return null;
    }
}

// Example 14: Cancel All Orders
async function cancelAllOrders() {
    try {
        console.log(' Canceling all orders...');
        
        const response = await client.cancelAllOrders();
        
        if (response.status && response.data) {
            console.log(' All orders canceled successfully!');
            return response.data;
        } else {
            console.error(' Cancel all orders failed:', response.message);
            return null;
        }
    } catch (error) {
        console.error(' Cancel all orders error:', error);
        return null;
    }
}

// Example 15: Get Order Details
async function getOrderDetails(orderNo: string, segment: string) {
    try {
        console.log(' Fetching order details...');
        
        const params: OrderDetailsReq = {
            order_no: orderNo
            //segment: segment
        };
        
        const response = await client.getOrderDetails(params);
        
        if (response && response.length > 0) {
            console.log(' Order details retrieved successfully!');
            console.log('Order details:', response[0]);
            return response;
        } else {
            console.error(' Order details retrieval failed: No data returned');
            return null;
        }
    } catch (error) {
        console.error(' Order details retrieval error:', error);
        return null;
    }
}

// Example 16: Convert Position
async function convertPosition() {
    try {
        console.log(' Converting position...');
        
        const params: ConvertPositionParams = {
            exchange: 'NSE',
            symboltoken: '2885',
            oldproducttype: 'INTRADAY',
            newproducttype: 'DELIVERY',
            tradingsymbol: 'RELIANCE-EQ',
            symbolname: 'RELIANCE',
            transactiontype: 'BUY',
            quantity: 10,
            type: 'DAY'
        };

        const response = await client.convertPosition(params);
        
        if (response.status && response.data) {
            console.log(' Position converted successfully!');
            return response.data;
        } else {
            console.error(' Position conversion failed:', response.message);
            return null;
        }
    } catch (error) {
        console.error(' Position conversion error:', error);
        return null;
    }
}

// Example 17: Get Intraday Chart Data
async function getIntradayChartData() {
    try {
        console.log(' Fetching intraday chart data...');
        
        const params: IntradyChartDataParams = {
            exchange: 'NSE',
            symboltoken: '22',
            interval: 'ONE_MINUTE'
        };

        const response = await client.getIntradayChartData(params);
        
        if (response.status && response.data) {
            console.log(' Intraday chart data retrieved successfully!');
            console.log('Total records:', response.data.length);
            return response.data;
        } else {
            console.error(' Intraday chart data retrieval failed:', response.message);
            return null;
        }
    } catch (error) {
        console.error(' Intraday chart data retrieval error:', error);
        return null;
    }
}

// Example 18: Get Instrument Master
async function getInstrumentMaster() {
    try {
        console.log(' Fetching instrument master...');
        
        const response = await client.getInstrumentMaster();
        
        if (response) {
            console.log(' Instrument master retrieved successfully!');
            console.log('CSV data length:', response.length);
            return response;
        } else {
            console.error(' Instrument master retrieval failed: No data returned');
            return null;
        }
    } catch (error) {
        console.error(' Instrument master retrieval error:', error);
        return null;
    }
}

// Example 19: Get Trade Book
async function getTradeBook() {
    try {
        console.log(' Fetching trade book...');
        
        const response = await client.getTradeBook();
        
        if (response.status && response.data) {
            console.log(' Trade book retrieved successfully!');
            console.log('Total trades:', response.data.length);
            return response.data;
        } else {
            console.error(' Trade book retrieval failed:', response.message);
            return null;
        }
    } catch (error) {
        console.error(' Trade book retrieval error:', error);
        return null;
    }
}

// Example 20: Get Trade History
async function getTradeHistory() {
    try {
        console.log(' Fetching trade history...');
        
        const params: TradeHistoryReq = {
            fromdate: '2024-01-01',
            todate: '2024-12-31'
        };
        
        const response = await client.getTradeHistory(params);
        
        if (response && response.length > 0) {
            console.log(' Trade history retrieved successfully!');
            console.log('Total trades:', response.length);
            return response;
        } else {
            console.error(' Trade history retrieval failed: No data returned');
            return null;
        }
    } catch (error) {
        console.error(' Trade history retrieval error:', error);
        return null;
    }
}

// Example 21: Order Margin
async function orderMargin() {
    try {
        console.log(' Calculating order margin...');
        
        const params: OrderMarginReq = {
            orders: [{
                product_type: 'INTRADAY',
                transaction_type: 'BUY',
                quantity: 10,
                price: 2500,
                exchange: 'NSE',
                symbol_name: 'RELIANCE-EQ',
                token: 2885,
                trigger_price: 0
            }]
        };

        const response = await client.orderMargin(params);
        
        if (response && response.length > 0) {
            console.log(' Order margin calculated successfully!');
            return response;
        } else {
            console.error(' Order margin calculation failed: No data returned');
            return null;
        }
    } catch (error) {
        console.error(' Order margin calculation error:', error);
        return null;
    }
}

// Example 22: Loser Gainer
async function loserGainer() {
    try {
        console.log(' Fetching loser gainer data...');
        
        const params: LoserGainer = {
            Exchange: 1,
            SecurityIdCode: 1,
            segment: 1,
            TypeFlag: 'G'
        };
        
        const response = await client.loserGainer(params);
        
        if (response && response.length > 0) {
            console.log(' Loser gainer data retrieved successfully!');
            return response;
        } else {
            console.error(' Loser gainer data retrieval failed: No data returned');
            return null;
        }
    } catch (error) {
        console.error(' Loser gainer data retrieval error:', error);
        return null;
    }
}

// Example 23: Delete Basket
async function deleteBasket(basketId: string) {
    try {
        console.log(' Deleting basket...');
        
        const params: DeleteBasket = {
            BasketId: basketId
        };
        
        const response = await client.deleteBasket(params);
        
        if (response && response.length >= 0) {
            console.log(' Basket deleted successfully!');
            return response;
        } else {
            console.error(' Basket deletion failed: No response');
            return null;
        }
    } catch (error) {
        console.error(' Basket deletion error:', error);
        return null;
    }
}

// Example 24: Calculate Basket
async function calculateBasket() {
    try {
        console.log(' Calculating basket...');
        
        const params: CalcualteBasket = {
            basket_name: 'MyStrategy',
            basket_id: '123',
            operation: 'CALCULATE',
            include_exist_pos: 'Y',
            ord_product: 'INTRADAY',
            disc_qty: '0',
            segment: 'EQ',
            trigger_price: '0',
            scriptcode: '2885',
            ord_type: 'MARKET',
            order_validity: 'DAY',
            order_qty: '10',
            script_stat: 'ACTIVE',
            buy_sell_indi: 'BUY',
            basket_priority: '1',
            order_price: '0',
            exch_id: 'NSE'
        };
        
        const response = await client.calculateBasket(params);
        
        if (response && response.length >= 0) {
            console.log(' Basket calculated successfully!');
            return response;
        } else {
            console.error(' Basket calculation failed: No response');
            return null;
        }
    } catch (error) {
        console.error(' Basket calculation error:', error);
        return null;
    }
}

// Example 25: Basket Operations
async function basketOperations() {
    try {
        console.log(' Performing basket operations...');
        
        // Create a basket
        const createParams: CreateBasket = {
            BaskName: 'MyStrategy',
            BaskDesc: 'Long term investment strategy'
        };
        
        const createResponse = await client.createBasket(createParams);
        console.log(' Basket created:', createResponse);
        
        // Fetch all baskets
        const baskets = await client.fetchBasket();
        console.log(' Available baskets:', baskets);
        
        // Rename basket (if baskets exist)
        if (baskets && baskets.length > 0) {
            const renameParams: RenameBasket = {
                basketName: 'UpdatedStrategy',
                BasketId: baskets[0].BASKET_ID.toString()
            };
            
            const renameResponse = await client.renameBasket(renameParams);
            console.log(' Basket renamed:', renameResponse);
            
            // Calculate basket
            const calculateResponse = await calculateBasket();
            console.log(' Basket calculated:', calculateResponse);
        }
        
        return baskets;
    } catch (error) {
        console.error(' Basket operations error:', error);
        return null;
    }
}

// Example 26: Complete Workflow
async function completeWorkflow() {
    try {
        console.log(' Starting complete workflow...');
        
        // Step 1: Authenticate
        const authResult = await authenticate();
        if (!authResult) {
            console.log(' Authentication failed, stopping workflow');
            return;
        }
        
        // Step 2: Get market data
        const quoteData = await getQuoteData();
        console.log(' Market data:', quoteData);
        
        // Step 3: Check portfolio
        const holdings = await getHoldings();
        console.log(' Holdings:', holdings);
        
        // Step 4: Place a test order
        const orderResult = await placeMarketOrder();
        if (orderResult) {
            console.log(' Order placed:', orderResult);
            
            // Step 5: Check order book
            const orders = await getOrderBook();
            console.log(' Order book:', orders);
        }
        
        console.log(' Complete workflow finished successfully!');
    } catch (error) {
        console.error(' Workflow error:', error);
    }
}

// Example 27: Error Handling
async function errorHandlingExample() {
    try {
        console.log(' Testing error handling...');
        
        // Try to access data without authentication
        const response = await client.getOrderBook();
        
        if (!response.status) {
            console.log(' Expected error handled correctly:', response.message);
            console.log('Error code:', response.errorcode);
        }
    } catch (error) {
        console.error(' Error handling example:', error);
    }
}

// Export all examples for use in other files
export {
    authenticate,
    verifyOTP,
    verifyTOTP,
    placeMarketOrder,
    placeLimitOrder,
    modifyOrder,
    cancelOrder,
    cancelAllOrders,
    getOrderDetails,
    getOrderBook,
    getPositions,
    getHoldings,
    convertPosition,
    getFundSummary,
    getHistoricalData,
    getIntradayChartData,
    getInstrumentMaster,
    getTradeBook,
    getTradeHistory,
    getQuoteData,
    orderMargin,
    loserGainer,
    deleteBasket,
    calculateBasket,
    basketOperations,
    completeWorkflow,
    errorHandlingExample,
    client
};

// Usage: Run the complete workflow
// completeWorkflow().catch(console.error);
