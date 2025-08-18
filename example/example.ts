/**
 * TypeB SDK Usage Examples
 * This file demonstrates how to use the TypeB SDK for TypeB Trading API
 * Package name: mconnectb
 */

import { MConnect } from '../lib/connect';
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
    CalcualteBasket
} from '../types';

// Initialize the SDK with your configuration
const config: MConnectConfig = {
    apiKey: 'YOUR_API_KEY_HERE',
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
            clientcode: 'YOUR_CLIENT_CODE',
            password: 'YOUR_PASSWORD',
            totp: 'YOUR_TOTP_CODE', // Optional
            state: 'random_state_string' // Optional
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

// Example 14: Basket Operations
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
        }
        
        return baskets;
    } catch (error) {
        console.error(' Basket operations error:', error);
        return null;
    }
}

// Example 15: Complete Workflow
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

// Example 16: Error Handling
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
    getOrderBook,
    getPositions,
    getHoldings,
    getFundSummary,
    getHistoricalData,
    getQuoteData,
    basketOperations,
    completeWorkflow,
    errorHandlingExample,
    client
};

// Usage: Run the complete workflow
// completeWorkflow().catch(console.error);
