import { MConnect } from '../lib/connect';
import { createInterface } from 'readline';
import { DEFAULTS } from '../constants';
import { ResponseLogger } from '../lib/response-logger';

// Create readline interface for user input
const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

// Global state to maintain session info
let client: MConnect;
let currentToken: string | null = null;
let responseLogger: ResponseLogger;

// Helper function to get user input
const question = (query: string): Promise<string> => {
    return new Promise((resolve) => rl.question(query, resolve));
};

// Helper function to display menu
async function displayMenu() {
    console.log('\n=== TypeB Trading API Test Menu ===');
    console.log('\nAuthentication:');
    console.log('1. Login');
    console.log('2. Verify OTP');
    console.log('3. Verify TOTP');
    console.log('4. Logout');

    console.log('\nOrder Management:');
    console.log('5. Place Order');
    console.log('6. Modify Order');
    console.log('7. Cancel Order');
    console.log('8. Cancel All Orders');
    console.log('9. Get Order Details');
    console.log('10. Get Order Book');

    console.log('\nPortfolio & Funds:');
    console.log('11. Get Positions');
    console.log('12. Get Holdings');
    console.log('13. Get Fund Summary');
    console.log('14. Convert Position');

    console.log('\nMarket Data:');
    console.log('15. Get Historical Data');
    console.log('16. Get Intraday Chart Data');
    console.log('17. Get Quote');
    console.log('18. Get Instrument Master');
    console.log('19. Get Option Chain Master');
    console.log('20. Get Option Chain');

    console.log('\nBasket Operations:');
    console.log('21. Create Basket');
    console.log('22. Fetch Basket');
    console.log('23. Rename Basket');
    console.log('24. Delete Basket');
    console.log('25. Calculate Basket');

    console.log('\nOther Operations:');
    console.log('26. Get Trade Book');
    console.log('27. Get Trade History');
    console.log('28. Order Margin');
    console.log('29. Loser Gainer');

    console.log('\n0. Exit');

    const choice = await question('\nEnter your choice (0-29): ');
    return choice;
}

// Initialize the client
async function initializeClient() {
    const apiKey = 'ENTER YOUR API KEY HERE'; // Replace with your actual API key
    client = new MConnect(DEFAULTS.API_BASE_URL, apiKey);
    responseLogger = new ResponseLogger('api-responses.log');
    console.log('Client initialized successfully!');
}

// Implementation of test methods
async function testLogin() {
//    const clientcode = await question('Enter client code: ');
//    const password = await question('Enter password: ');
    const clientcode = 'Enter Client Code/ Mobile Number';
    const password = 'Sandy@1999';
    const totp = '';//await question('Enter TOTP: ');
    const state = '';

    try {
        const response = await client.login({
            clientcode,
            password,
            totp,
            state
        });
        console.log('Login Response:', JSON.stringify(response, null, 2));
        responseLogger.logResponse('LOGIN', response);
        
        if (response.data?.jwtToken) {
            currentToken = response.data.jwtToken;
            client.setAccessToken(currentToken);
            console.log('JWT Token set successfully!');
        }
    } catch (error) {
        console.error('Login failed:', error);
        responseLogger.logResponse('LOGIN_ERROR', { error: String(error) });
    }
}

async function testVerifyOTP() {
    if (!currentToken) {
        console.log('Please login first to get refresh token');
        return;
    }
    const otp = await question('Enter OTP: ');
    
    try {
        const response = await client.verifyOTP(currentToken, otp);
        console.log('Verify OTP Response:', JSON.stringify(response, null, 2));
        responseLogger.logResponse('VERIFY_OTP', response);
        
        if (response.data?.jwtToken) {
            currentToken = response.data.jwtToken;
            client.setAccessToken(currentToken);
            console.log('New JWT Token set successfully!');
        }
    } catch (error) {
        console.error('OTP verification failed:', error);
        responseLogger.logResponse('VERIFY_OTP_ERROR', { error: String(error) });
    }
}

async function testVerifyTOTP() {
    if (!currentToken) {
        console.log('Please login first to get refresh token');
        return;
    }
    const totp = await question('Enter TOTP: ');
    
    try {
        const response = await client.verifyTOTP(currentToken, totp);
        console.log('Verify TOTP Response:', response);
        responseLogger.logResponse('VERIFY_TOTP', response);
        
        if (response.data?.jwtToken) {
            currentToken = response.data.jwtToken;
            client.setAccessToken(currentToken);
            console.log('New JWT Token set successfully!');
        }
    } catch (error) {
        console.error('TOTP verification failed:', error);
        responseLogger.logResponse('VERIFY_TOTP_ERROR', { error: String(error) });
    }
}

async function testLogout() {
    if (!currentToken) {
        console.log('Not logged in');
        return;
    }
    
    try {
        const response = await client.logout('', currentToken);
        console.log('Logout Response:', response);
        responseLogger.logResponse('LOGOUT', response);
        
        currentToken = null;
        console.log('Logged out successfully!');
    } catch (error) {
        console.error('Logout failed:', error);
        responseLogger.logResponse('LOGOUT_ERROR', { error: String(error) });
    }
}

// Order Management Methods
async function testPlaceOrder() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        // const variety = await question('Enter variety (NORMAL/STOPLOSS/ROBO/AMO): ') as 'NORMAL' | 'STOPLOSS' | 'ROBO' | 'AMO';
        // const exchange = await question('Enter exchange (NSE/BSE/NFO/BFO/CDS/MCX/NCDEX): ') as 'NSE' | 'BSE' | 'NFO' | 'BFO' | 'CDS' | 'MCX' | 'NCDEX';
        // const transactiontype = await question('Enter transaction type (BUY/SELL): ') as 'BUY' | 'SELL';
        // const ordertype = await question('Enter order type (MARKET/LIMIT/STOPLOSS_LIMIT/STOPLOSS_MARKET): ') as 'MARKET' | 'LIMIT' | 'STOPLOSS_LIMIT' | 'STOPLOSS_MARKET';
        // const producttype = await question('Enter product type (DELIVERY/MARGIN/INTRADAY/BO/CARRYFORWARD): ') as 'DELIVERY' | 'MARGIN' | 'INTRADAY' | 'BO' | 'CARRYFORWARD';
        
        const orderParams = {
            variety: "NORMAL",
            tradingsymbol: "IDEA-EQ",
            symboltoken: "14366",
            exchange: "NSE",
            transactiontype: "BUY",
            ordertype: "MARKET",
            quantity: "1",
            producttype: "DELIVERY",
            price: "0",
            triggerprice: "0",
            squareoff: "0",
            stoploss: "0",
            trailingStopLoss: "0.02",
            disclosedquantity: "0",
            duration: "DAY",
            ordertag: ""

  
        };
        
        const response = await client.placeOrder(orderParams);
        console.log('Place Order Response:', JSON.stringify(response, null, 2));
        responseLogger.logResponse('PLACE_ORDER', response);
    } catch (error) {
        console.error('Place order failed:', error);
        responseLogger.logResponse('PLACE_ORDER_ERROR', { error: String(error) });
    }
}

async function testModifyOrder() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        // const variety = await question('Enter variety (NORMAL/STOPLOSS/ROBO/AMO): ') as 'NORMAL' | 'STOPLOSS' | 'ROBO' | 'AMO';
        // const exchange = await question('Enter exchange (NSE/BSE/NFO/BFO/CDS/MCX/NCDEX): ') as 'NSE' | 'BSE' | 'NFO' | 'BFO' | 'CDS' | 'MCX' | 'NCDEX';
        // const ordertype = await question('Enter order type (MARKET/LIMIT/STOPLOSS_LIMIT/STOPLOSS_MARKET): ') as 'MARKET' | 'LIMIT' | 'STOPLOSS_LIMIT' | 'STOPLOSS_MARKET';
        // const producttype = await question('Enter product type (DELIVERY/MARGIN/INTRADAY/BO/CARRYFORWARD): ') as 'DELIVERY' | 'MARGIN' | 'INTRADAY' | 'BO' | 'CARRYFORWARD';
        
        const orderParams = {
            
            variety: "NORMAL",
            tradingsymbol: "IDEA-EQ",
            symboltoken: "14366",
            exchange: "NSE",
            transactiontype: "BUY",
            orderid: "22212507151278",
            ordertype: "LIMIT",
            quantity: "1",
            producttype: "DELIVERY",
            duration: "DAY",
            price: "6.10",
            triggerprice: "0",
            disclosedquantity: "0",
            modqty_remng: "0"
        };

        const response = await client.modifyOrder(orderParams);
        console.log('Modify Order Response:', JSON.stringify(response, null, 2));
        responseLogger.logResponse('MODIFY_ORDER', response);
    } catch (error) {
        console.error('Modify order failed:', error);
        responseLogger.logResponse('MODIFY_ORDER_ERROR', { error: String(error) });
    }
}

async function testCancelOrder() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        //const variety = await question('Enter variety (NORMAL/STOPLOSS/ROBO/AMO): ') as 'NORMAL' | 'STOPLOSS' | 'ROBO' | 'AMO';
        const orderParams = {
            variety:await question('Enter variety (NORMAL/STOPLOSS/ROBO/AMO): '),
            orderid: await question('Enter order ID to cancel: ')
        };

        const response = await client.cancelOrder(orderParams);
        console.log('Cancel Order Response:', JSON.stringify(response, null, 2));
        responseLogger.logResponse('CANCEL_ORDER', response);
    } catch (error) {
        console.error('Cancel order failed:', error);
        responseLogger.logResponse('CANCEL_ORDER_ERROR', { error: String(error) });
    }
}

async function testCancelAllOrders() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        const response = await client.cancelAllOrders();
        console.log('Cancel All Orders Response:', response);
        responseLogger.logResponse('CANCEL_ALL_ORDERS', response);
    } catch (error) {
        console.error('Cancel all orders failed:', error);
        responseLogger.logResponse('CANCEL_ALL_ORDERS_ERROR', { error: String(error) });
    }
}

async function testGetOrderDetails() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        const params = {
            order_no: await question('Enter order number: '),
            segment: await question('Enter segment: ')
        };

        const response = await client.getOrderDetails(params);
        console.log('Order Details:', JSON.stringify(response, null, 2));
        responseLogger.logResponse('GET_ORDER_DETAILS', response);
    } catch (error) {
        console.error('Get order details failed:', error);
        responseLogger.logResponse('GET_ORDER_DETAILS_ERROR', { error: String(error) });
    }
}

async function testGetOrderBook() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        const response = await client.getOrderBook();
        console.log('Order Book:', JSON.stringify(response, null, 2));
        responseLogger.logResponse('GET_ORDER_BOOK', response);
    } catch (error) {
        console.error('Get order book failed:', error);
        responseLogger.logResponse('GET_ORDER_BOOK_ERROR', { error: String(error) });
    }
}

// Portfolio & Funds Methods
async function testGetPositions() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        const response = await client.getPositions();
        console.log('Positions:', response);
        responseLogger.logResponse('GET_POSITIONS', response);
    } catch (error) {
        console.error('Get positions failed:', error);
        responseLogger.logResponse('GET_POSITIONS_ERROR', { error: String(error) });
    }
}

async function testGetHoldings() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        const response = await client.getHoldings();
        console.log('Holdings:', response);
        responseLogger.logResponse('GET_HOLDINGS', response);
    } catch (error) {
        console.error('Get holdings failed:', error);
        responseLogger.logResponse('GET_HOLDINGS_ERROR', { error: String(error) });
    }
}

async function testGetFundSummary() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        const response = await client.getFundSummary();
        console.log('Fund Summary:', response);
        responseLogger.logResponse('GET_FUND_SUMMARY', response);
    } catch (error) {
        console.error('Get fund summary failed:', error);
        responseLogger.logResponse('GET_FUND_SUMMARY_ERROR', { error: String(error) });
    }
}

async function testConvertPosition() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        // const exchange = 'NSE' as 'NSE'; //('Enter exchange (NSE/BSE/NFO/BFO/CDS/MCX/NCDEX): ') as 'NSE' | 'BSE' | 'NFO' | 'BFO' | 'CDS' | 'MCX' | 'NCDEX';
        // const oldproducttype = 'INTRADAY' as 'DELIVERY'//('Enter old product type (DELIVERY/MARGIN/INTRADAY/CARRYFORWARD): ')
        // const newproducttype = 'DELIVERY' as 'DELIVERY'//('Enter new product type (DELIVERY/MARGIN/INTRADAY/CARRYFORWARD): ')
        // const transactiontype = 'BUY' as 'BUY' | 'SELL' //('Enter transaction type (BUY/SELL): ')
        
        const params = {
            exchange: 'NSE',//'NSE' | 'BSE' | 'NFO' | 'BFO' | 'CDS' | 'MCX' | 'NCDEX',
            symboltoken: '22',
            oldproducttype: 'DELIVERY',// 'DELIVERY' | 'MARGIN' | 'INTRADAY' | 'CARRYFORWARD',
            newproducttype: 'INTRADAY',// as 'DELIVERY' | 'MARGIN' | 'INTRADAY' | 'CARRYFORWARD',
            tradingsymbol: 'ACC-EQ',
            symbolname: 'ACC',
            transactiontype: 'BUY',// 'BUY' | 'SELL',
            quantity: 1,//'Enter quantity: 
            type: 'DAY',// 'DAY' | 'NET'
        };

        const response = await client.convertPosition(params);
        console.log('Convert Position Response:', response);
        responseLogger.logResponse('CONVERT_POSITION', response);
    } catch (error) {
        console.error('Convert position failed:', error);
        responseLogger.logResponse('CONVERT_POSITION_ERROR', { error: String(error) });
    }
}

// Market Data Methods
async function testGetHistoricalData() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        // const exchange = 'NSE' as 'NSE'; // (NSE/BSE/NFO/MCX/NCDEX): ') as 'NSE' | 'BSE' | 'NFO' | 'MCX' | 'NCDEX';
        // const interval = "TEN_MINUTE" as "TEN_MINUTE" // (ONE_MINUTE/THREE_MINUTE/FIVE_MINUTE/TEN_MINUTE/FIFTEEN_MINUTE/THIRTY_MINUTE/ONE_HOUR/ONE_DAY): ') as 'ONE_MINUTE' | 'THREE_MINUTE' | 'FIVE_MINUTE' | 'TEN_MINUTE' | 'FIFTEEN_MINUTE' | 'THIRTY_MINUTE' | 'ONE_HOUR' | 'ONE_DAY';
        
        const params = {
            exchange:'NSE',
            symboltoken: '22',
            interval:'TEN_MINUTE',
            fromdate: '2025-08-11',//('Enter from date (YYYY-MM-DD HH:mm:ss): '),
            todate: '2025-08-14'//'Enter to date (YYYY-MM-DD HH:mm:ss): ')
        };

        const response = await client.getHistoricalData(params);
        if (response?.data) {
            const formattedData = {
                status: response.status,
                message: response.message,
                errorcode: response.errorcode,
                data: Array.isArray(response.data) ? {
                    candles: response.data.map((candle: any) => ({
                        timestamp: candle[0],
                        open: candle[1],
                        high: candle[2],
                        low: candle[3],
                        close: candle[4],
                        volume: candle[5]
                    }))
                } : response.data
            };
            console.log('Historical Data:', JSON.stringify(formattedData, null, 2));
            responseLogger.logResponse('GET_HISTORICAL_DATA', formattedData);
        } else {
            console.log('Historical Data:', JSON.stringify(response, null, 2));
            responseLogger.logResponse('GET_HISTORICAL_DATA', response);
        }
    } catch (error) {
        console.error('Get historical data failed:', error);
        responseLogger.logResponse('GET_HISTORICAL_DATA_ERROR', { error: String(error) });
    }
}

async function testGetIntradayChartData() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        //const interval = "TEN_MINUTE" as "TEN_MINUTE";
        const params = {
            exchange: '1',
            symbolname: 'ACC',  // Using full symbol name
            interval:'TEN_MINUTE' // Using TEN_MINUTE interval
        };

        const response = await client.getIntradayChartData(params);
        if (response?.data) {
            console.log('Intraday Chart Data:', response.data);
            responseLogger.logResponse('GET_INTRADAY_CHART_DATA', response);
        } else {
            console.log('Intraday Chart Data:', JSON.stringify(response, null, 2));
            responseLogger.logResponse('GET_INTRADAY_CHART_DATA', response);
        }
    } catch (error) {
        console.error('Get intraday chart data failed:', error);
        responseLogger.logResponse('GET_INTRADAY_CHART_DATA_ERROR', { error: String(error) });
    }
}

async function testGetQuote() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        const params = {
            mode: "OHLC" as "OHLC",
            exchangeTokens: {
                NSE: ['22']
            }
        };

        const response = await client.getQuote(params);
        console.log('Quote:', response.data);
        responseLogger.logResponse('GET_QUOTE', response);
    } catch (error) {
        console.error('Get quote failed:', error);
        responseLogger.logResponse('GET_QUOTE_ERROR', { error: String(error) });
    }
}

async function testGetInstrumentMaster() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        // Get instrument master without any parameters
        const response = await client.getInstrumentMaster();
        
        // Save the response to a file
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '..', 'instrument_Script_Master.json');

        // Handle the response and save it
        if (response && typeof response === 'string') {
            // If it's CSV data, try to parse it into structured format
            const lines = response.split('\n');
            if (lines.length > 0) {
                const headers = lines[0].split(',');
                const data = lines.slice(1)
                    .filter(line => line.trim()) // Remove empty lines
                    .map(line => {
                        const values = line.split(',');
                        return headers.reduce((obj: any, header, index) => {
                            obj[header.trim()] = values[index]?.trim() || '';
                            return obj;
                        }, {});
                    });

                // Save as JSON
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                console.log(`Instrument master data saved to ${filePath}`);
                console.log('\nFirst few records preview:');
                console.log(JSON.stringify(data.slice(0, 3), null, 2));
            } else {
                // Save raw response if parsing fails
                fs.writeFileSync(filePath, response);
                console.log(`Raw instrument master data saved to ${filePath}`);
            }
        } else {
            // Save JSON response
            fs.writeFileSync(filePath, JSON.stringify(response, null, 2));
            console.log(`Instrument master data saved to ${filePath}`);
            console.log('\nResponse preview:');
            console.log(JSON.stringify(response, null, 2));
            responseLogger.logResponse('GET_INSTRUMENT_MASTER', response);
        }
    } catch (error) {
        console.error('Get instrument master failed:', error);
        // Log additional error details if available
        if (error instanceof Error) {
            // Save error details to file
            const fs = require('fs');
            const path = require('path');
            const errorFilePath = path.join(__dirname, '..', 'instrument_Script_Master_error.json');
            const errorDetails = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                timestamp: new Date().toISOString()
            };
            fs.writeFileSync(errorFilePath, JSON.stringify(errorDetails, null, 2));
            console.error('Error details saved to:', errorFilePath);
        }
    }
}

async function testGetOptionChainMaster() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        const exchange = '5';
        const response = await client.getOptionChainMaster(exchange);
        console.log('Option Chain Master:', response);
        responseLogger.logResponse('GET_OPTION_CHAIN_MASTER', response);
    } catch (error) {
        console.error('Get option chain master failed:', error);
        responseLogger.logResponse('GET_OPTION_CHAIN_MASTER_ERROR', { error: String(error) });
    }
}

async function testGetOptionChain() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        const exchange = '5';
        const expiry = '1758758400';
        const token = '69';
        
        const response = await client.getOptionChain(exchange, expiry, token);
        console.log('Option Chain:', response);
        responseLogger.logResponse('GET_OPTION_CHAIN', response);
    } catch (error) {
        console.error('Get option chain failed:', error);
        responseLogger.logResponse('GET_OPTION_CHAIN_ERROR', { error: String(error) });
    }
}

// Basket Operation Methods
async function testCreateBasket() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        const params = {
            BaskName: await question('Enter basket name: '),
            BaskDesc: await question('Enter basket description: ')
        };

        const response = await client.createBasket(params);
        console.log('Create Basket Response:', response);
        responseLogger.logResponse('CREATE_BASKET', response);
    } catch (error) {
        console.error('Create basket failed:', error);
        responseLogger.logResponse('CREATE_BASKET_ERROR', { error: String(error) });
    }
}

async function testFetchBasket() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        const response = await client.fetchBasket();
        console.log('Fetch Basket Response:', response);
        responseLogger.logResponse('FETCH_BASKET', response);
    } catch (error) {
        console.error('Fetch basket failed:', error);
        responseLogger.logResponse('FETCH_BASKET_ERROR', { error: String(error) });
    }
}

async function testRenameBasket() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        const params = {
            basketName: await question('Enter current basket name: '),
            BasketId: await question('Enter basket ID: ')
        };

        const response = await client.renameBasket(params);
        console.log('Rename Basket Response:', response);
        responseLogger.logResponse('RENAME_BASKET', response);
    } catch (error) {
        console.error('Rename basket failed:', error);
        responseLogger.logResponse('RENAME_BASKET_ERROR', { error: String(error) });
    }
}

async function testDeleteBasket() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        const params = {
            BasketId: await question('Enter basket ID to delete: ')
        };

        const response = await client.deleteBasket(params);
        console.log('Delete Basket Response:', response);
        responseLogger.logResponse('DELETE_BASKET', response);
    } catch (error) {
        console.error('Delete basket failed:', error);
        responseLogger.logResponse('DELETE_BASKET_ERROR', { error: String(error) });
    }
}

async function testCalculateBasket() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        const params = {
            include_exist_pos: '2',
            ord_product: 'INTRADAY',
            disc_qty: '0',
            segment: 'All',
            trigger_price: '0',
            scriptcode: '9561',
            ord_type: 'LMT',
            basket_name: 'Test9876',
            basket_id: '88145',
            exchange: 'NSE',
            transactiontype: 'BUY',
            operation: 'I',
            order_validity: 'DAY',
            order_qty: '2',
            script_stat: 'A',
            buy_sell_indi: 'B',
            basket_priority: '3',
            order_price: '300',
            exch_id: 'NSE',
            orders: []  // Empty array for orders
            

            //scriptcode: await question('Enter script code: '),
            // ord_type: await question('Enter order type (MARKET/LIMIT): '),
            // basket_name: await question('Enter basket name: '),
            // exchange: await question('Enter exchange: '),
            // tradingsymbol: await question('Enter trading symbol: '),
            // symboltoken: await question('Enter symbol token: '),
            // transactiontype: await question('Enter transaction type (BUY/SELL): '),
            // price: await question('Enter price: '),
            // producttype: await question('Enter product type: '),
            // markettype: await question('Enter market type: '),
            // lotsize: await question('Enter lot size: '),
            // ordertype: await question('Enter order type: '),
            // ordertag: await question('Enter order tag: '),
            // operation: await question('Enter operation: '),
            // order_validity: await question('Enter order validity (DAY/IOC): '),
            // order_qty: await question('Enter order quantity: '),
            // script_stat: await question('Enter script status: '),
            // sripstat: await question('Enter SRIP status: '),
            // symbolName: await question('Enter symbol name: '),
            // token: await question('Enter token: '),
            // trading_symbol: await question('Enter trading symbol again: '),
            // buy_sell_indi: await question('Enter buy/sell indicator: '),
            // basket_priority: await question('Enter basket priority: '),
            // order_price: await question('Enter order price: '),
            // basket_id: await question('Enter basket ID: '),
            // exch_id: await question('Enter exchange ID: '),
            // orders: []  // Empty array for orders
        };

        const response = await client.calculateBasket(params);
        console.log('Calculate Basket Response:', response);
        responseLogger.logResponse('CALCULATE_BASKET', response);
    } catch (error) {
        console.error('Calculate basket failed:', error);
        responseLogger.logResponse('CALCULATE_BASKET_ERROR', { error: String(error) });
    }
}

// Other Operation Methods
async function testGetTradeBook() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        const response = await client.getTradeBook();
        console.log('Trade Book:', response);
        responseLogger.logResponse('GET_TRADE_BOOK', response);
    } catch (error) {
        console.error('Get trade book failed:', error);
        responseLogger.logResponse('GET_TRADE_BOOK_ERROR', { error: String(error) });
    }
}

async function testGetTradeHistory() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        const params = {
            //order_no: await question('Enter order number: '),
            fromdate: await question('Enter from date (YYYY-MM-DD): '),
            todate: await question('Enter to date (YYYY-MM-DD): ')
        };

        const response = await client.getTradeHistory(params);
        console.log('Trade History:', response);
        responseLogger.logResponse('GET_TRADE_HISTORY', response);
    } catch (error) {
        console.error('Get trade history failed:', error);
        responseLogger.logResponse('GET_TRADE_HISTORY_ERROR', { error: String(error) });
    }
}

async function testOrderMargin() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        const order = {
            // tradingsymbol: await question('Enter trading symbol: '),
            // exchange: await question('Enter exchange (NSE/BSE/NFO/BFO/CDS/MCX/NCDEX): ') as 'NSE' | 'BSE' | 'NFO' | 'BFO' | 'CDS' | 'MCX' | 'NCDEX',
            // quantity: parseInt(await question('Enter quantity: ')),
            // price: parseFloat(await question('Enter price: ')),
            // product_type: await question('Enter product type (DELIVERY/MARGIN/INTRADAY/BO/CARRYFORWARD): ') as 'DELIVERY' | 'MARGIN' | 'INTRADAY' | 'BO' | 'CARRYFORWARD',
            // transaction_type: await question('Enter transaction type (BUY/SELL): ') as 'BUY' | 'SELL',
            // symbol_name: await question('Enter symbol name: '),
            // token: parseInt(await question('Enter token (as number): ')),
            // trigger_price: parseFloat(await question('Enter trigger price: '))


            //tradingsymbol: await question('Enter trading symbol: '),
            exchange: 'NSE',
            quantity: 1,
            price: 0,
            product_type: 'DELIVERY',
            transaction_type: 'BUY',
            symbol_name: 'ACC',
            token: 22,
            trigger_price: 0
        };

        const params = {
            orders: [order] as [typeof order]  // Type assertion to ensure exactly one element
        };

        const response = await client.orderMargin(params);
        console.log('Order Margin:', JSON.stringify(response, null, 2));
        responseLogger.logResponse('ORDER_MARGIN', response);
    } catch (error) {
        console.error('Get order margin failed:', error);
        responseLogger.logResponse('ORDER_MARGIN_ERROR', { error: String(error) });
    }
}

async function testLoserGainer() {
    if (!currentToken) {
        console.log('Please login first');
        return;
    }

    try {
        const params = {
            // Exchange: parseInt(await question('Enter exchange (as number): ')),
            // SecurityIdCode: parseInt(await question('Enter security ID code (as number): ')),
            // segment: parseInt(await question('Enter segment (as number): ')),
            // TypeFlag: await question('Enter type flag: ')
            Exchange: 1,
            SecurityIdCode: 13,
            segment: 1,
            TypeFlag: 'G'
        };

        const response = await client.loserGainer(params);
        console.log('Loser Gainer Response:', response);
        responseLogger.logResponse('LOSER_GAINER', response);
    } catch (error) {
        console.error('Get loser gainer failed:', error);
        responseLogger.logResponse('LOSER_GAINER_ERROR', { error: String(error) });
    }
}

// Main function to run the interactive test
async function main() {
    console.log('Welcome to TypeB Trading API Tester');
    await initializeClient();

    while (true) {
        const choice = await displayMenu();

        switch (choice) {
            case '0':
                console.log('Exiting...');
                console.log(`\nAPI responses logged to: ${responseLogger.getLogPath()}`);
                rl.close();
                return;
            case '1':
                await testLogin();
                break;
            case '2':
                await testVerifyOTP();
                break;
            case '3':
                await testVerifyTOTP();
                break;
            case '4':
                await testLogout();
                break;
            case '5':
                await testPlaceOrder();
                break;
            case '6':
                await testModifyOrder();
                break;
            case '7':
                await testCancelOrder();
                break;
            case '8':
                await testCancelAllOrders();
                break;
            case '9':
                await testGetOrderDetails();
                break;
            case '10':
                await testGetOrderBook();
                break;
            case '11':
                await testGetPositions();
                break;
            case '12':
                await testGetHoldings();
                break;
            case '13':
                await testGetFundSummary();
                break;
            case '14':
                await testConvertPosition();
                break;
            case '15':
                await testGetHistoricalData();
                break;
            case '16':
                await testGetIntradayChartData();
                break;
            case '17':
                await testGetQuote();
                break;
            case '18':
                await testGetInstrumentMaster();
                break;
            case '19':
                await testGetOptionChainMaster();
                break;
            case '20':
                await testGetOptionChain();
                break;
            case '21':
                await testCreateBasket();
                break;
            case '22':
                await testFetchBasket();
                break;
            case '23':
                await testRenameBasket();
                break;
            case '24':
                await testDeleteBasket();
                break;
            case '25':
                await testCalculateBasket();
                break;
            case '26':
                await testGetTradeBook();
                break;
            case '27':
                await testGetTradeHistory();
                break;
            case '28':
                await testOrderMargin();
                break;
            case '29':
                await testLoserGainer();
                break;
            default:
                console.log('Invalid choice');
        }
    }
}

// Start the interactive test
main().catch(console.error);
