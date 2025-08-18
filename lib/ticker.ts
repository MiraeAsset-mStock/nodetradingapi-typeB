import WebSocket from 'ws';
import { Utils } from './utils';
import { DEFAULTS } from '../constants/routes';
import { MTickerConfig } from '../types/config';
import { FeedData, TypeAUpdate } from '../types';
import * as fs from 'fs';
import * as path from 'path';

/**
 * MTicker WebSocket Client
 * Provides real-time market data and order updates via WebSocket
 */
export class MTicker {
    private readonly apiKey: string;
    private readonly accessToken: string;
    private readonly baseSocketUrl: string;
    private readonly maxReconnectionAttempts: number;
    private readonly reconnectDelay: number;
    
    private socketUrl: string;
    private ws: WebSocket | null = null;
    private reconnectionAttempts: number = 0;
    private subscribedTokens: Set<number> = new Set();
    private isManualClose: boolean = false;

    // Event handlers
    public onBroadcastReceived: (data: FeedData) => void = () => {};
    public onOrderTradeReceived: (data: TypeAUpdate) => void = () => {};
    public onConnect: () => void = () => {};
    public onClose: () => void = () => {};
    public onError: (event: Event) => void = () => {};
    public onReconnecting: (attempt: number, maxAttempts: number) => void = () => {};

    constructor(config: MTickerConfig) {
        this.apiKey = config.api_key;
        this.accessToken = config.access_token;
        this.baseSocketUrl = DEFAULTS.wsURL;
        this.maxReconnectionAttempts = config.maxReconnectionAttempts || 5;
        this.reconnectDelay = config.reconnectDelay || 5000;
        
        this.socketUrl = `${this.baseSocketUrl}?ACCESS_TOKEN=${this.accessToken}&API_KEY=${this.apiKey}`;
    }

    /**
     * Log messages to file
     */
    private logToFile(message: string): void {
        const now = new Date();
        const timestamp = now.getFullYear() + '-' + 
            String(now.getMonth() + 1).padStart(2, '0') + '-' + 
            String(now.getDate()).padStart(2, '0') + ' ' + 
            String(now.getHours()).padStart(2, '0') + ':' + 
            String(now.getMinutes()).padStart(2, '0') + ':' + 
            String(now.getSeconds()).padStart(2, '0') + ',' + 
            String(now.getMilliseconds()).padStart(3, '0');
        const logMessage = `${timestamp} ${message}\n`;
        const logPath = path.join(process.cwd(), 'ticker-debug.log');
        fs.appendFileSync(logPath, logMessage);
    }

    /**
     * Log tick data in Python-like format
     */
    private logTickData(tick: FeedData): void {
        const now = new Date();
        const timestamp = now.getFullYear() + '-' + 
            String(now.getMonth() + 1).padStart(2, '0') + '-' + 
            String(now.getDate()).padStart(2, '0') + ' ' + 
            String(now.getHours()).padStart(2, '0') + ':' + 
            String(now.getMinutes()).padStart(2, '0') + ':' + 
            String(now.getSeconds()).padStart(2, '0') + ',' + 
            String(now.getMilliseconds()).padStart(3, '0');
        
        const mode = tick.Mode === 'ltp' ? 1 : tick.Mode === 'quote' ? 2 : 3;
        const tickData = {
            mode: mode,
            subscription_mode: mode,
            exchange_type: 1,
            instrument_token: tick.InstrumentToken,
            sequence_no: 0,
            ex_timestamp: `datetime.datetime(${now.getFullYear()}, ${now.getMonth() + 1}, ${now.getDate()}, ${now.getHours()}, ${now.getMinutes()}, ${now.getSeconds()})`,
            ltp: Math.round(tick.LastPrice * 100),
            last_traded_qty: tick.LastQuantity || 0,
            avg_traded_price: Math.round((tick.AveragePrice || 0) * 100),
            vol_traded_today: tick.Volume || 0,
            tot_buy_qty: tick.BuyQuantity || 0,
            tot_sell_qty: tick.SellQuantity || 0,
            ohlc: {
                open: Math.round((tick.Open || 0) * 100),
                high: Math.round((tick.High || 0) * 100),
                low: Math.round((tick.Low || 0) * 100),
                close: Math.round((tick.Close || 0) * 100)
            }
        };
        
        const logMessage = `${timestamp} Ticks: [${JSON.stringify(tickData).replace(/"/g, "'")}]\n`;
        const logPath = path.join(process.cwd(), 'ticker-debug.log');
        fs.appendFileSync(logPath, logMessage);
    }

    /**
     * Establishes WebSocket connection
     */
    public connect(): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.warn('WebSocket is already connected');
            return;
        }

        this.isManualClose = false;
        this.createWebSocketConnection();
    }

    /**
     * Creates WebSocket connection with event handlers
     */
    private createWebSocketConnection(): void {
        try {
            this.ws = new WebSocket(this.socketUrl);
            this.ws.binaryType = 'arraybuffer';

            this.ws.onopen = this.handleOpen.bind(this);
            this.ws.onmessage = this.handleMessage.bind(this) as any;
            this.ws.onerror = this.handleError.bind(this) as any;
            this.ws.onclose = this.handleClose.bind(this) as any;
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            this.scheduleReconnection();
        }
    }

    /**
     * Handles WebSocket open event
     */
    private handleOpen(): void {
        console.log('WebSocket connected');
        this.reconnectionAttempts = 0;
        this.onConnect();
    }

    /**
     * Send login message after connection (call this in onConnect callback)
     */
    public sendLoginAfterConnect(): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.logToFile('Sending login message...');
            this.ws.send(`LOGIN:${this.accessToken}`);
            this.resubscribeTokens();
        }
    }

    /**
     * Handles WebSocket message event
     */
    private handleMessage(event: MessageEvent): void {
        if (typeof event.data === 'string') {
            this.handleTextMessage(event.data);
        } else if (event.data instanceof ArrayBuffer) {
            this.handleBinaryMessage(event.data);
        }
    }

    /**
     * Handles text messages (JSON)
     */
    private handleTextMessage(data: string): void {
        try {
            this.logToFile(`Received text message: ${data}`);
            const messageDict = JSON.parse(data);
            if (messageDict.type === "order" || messageDict.type === "trade") {
                this.onOrderTradeReceived(messageDict.data as TypeAUpdate);
            }
        } catch (error) {
            this.logToFile(`Failed to parse text message: ${error}`);
        }
    }

    /**
     * Handles binary messages (market data)
     */
    private handleBinaryMessage(data: ArrayBuffer): void {
        try {
            this.logToFile(`Received binary message, size: ${data.byteLength}`);
            this.parseBinaryMessage(data);
        } catch (error) {
            this.logToFile(`Failed to parse binary message: ${error}`);
        }
    }

    /**
     * Handles WebSocket error event
     */
    private handleError(event: Event): void {
        console.error('WebSocket error:', event);
        this.onError(event);
        this.scheduleReconnection();
    }

    /**
     * Handles WebSocket close event
     */
    private handleClose(): void {
        console.log('WebSocket connection closed');
        this.onClose();
        
        if (!this.isManualClose) {
            this.scheduleReconnection();
        }
    }

    /**
     * Schedules reconnection attempt
     */
    private scheduleReconnection(): void {
        if (this.reconnectionAttempts < this.maxReconnectionAttempts && !this.isManualClose) {
            this.reconnectionAttempts++;
            this.onReconnecting(this.reconnectionAttempts, this.maxReconnectionAttempts);
            
            setTimeout(() => {
                if (!this.isManualClose) {
                    this.createWebSocketConnection();
                }
            }, this.reconnectDelay);
        } else if (this.reconnectionAttempts >= this.maxReconnectionAttempts) {
            console.error('Max reconnection attempts reached');
        }
    }

    /**
     * Closes WebSocket connection
     */
    public disconnect(): void {
        this.isManualClose = true;
        
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        
        this.subscribedTokens.clear();
        this.reconnectionAttempts = 0;
    }

    /**
     * Re-subscribes to all previously subscribed tokens
     */
    private resubscribeTokens(): void {
        if (this.subscribedTokens.size > 0) {
            const tokens = Array.from(this.subscribedTokens);
            this.sendSubscriptionMessage('subscribe', tokens);
        }
    }

    /**
     * Subscribes to market data for given instrument tokens
     */
    public subscribe(tokens: number[]): void {
        if (!Array.isArray(tokens) || tokens.length === 0) {
            console.warn('Invalid tokens provided for subscription');
            return;
        }

        tokens.forEach(token => this.subscribedTokens.add(token));
        this.sendSubscriptionMessage('subscribe', tokens);
    }

    /**
     * Unsubscribes from market data for given instrument tokens
     */
    public unsubscribe(tokens: number[]): void {
        if (!Array.isArray(tokens) || tokens.length === 0) {
            console.warn('Invalid tokens provided for unsubscription');
            return;
        }

        tokens.forEach(token => this.subscribedTokens.delete(token));
        this.sendSubscriptionMessage('unsubscribe', tokens);
    }

    /**
     * Sends subscription/unsubscription message
     */
    private sendSubscriptionMessage(action: 'subscribe' | 'unsubscribe', tokens: number[]): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({
                correlationID: "sub_" + Date.now(),
                action: action === 'subscribe' ? 1 : 0,
                params: {
                    mode: 3,
                    tokenList: [{
                        exchangeType: 1,
                        tokens: tokens.map(token => token.toString())
                    }]
                }
            });
            this.logToFile(`Sending ${action} message: ${message}`);
            this.ws.send(message);
        } else {
            this.logToFile(`Cannot ${action}: WebSocket is not connected`);
        }
    }

    /**
     * Parses binary market data messages
     */
    private parseBinaryMessage(data: ArrayBuffer): void {
        try {
            const view = new DataView(data);
            let offset = 0;
            
            // TypeB format: parse each tick directly
            while (offset < data.byteLength - 8) {
                const tick = this.parseTypeBTickData(view, offset);
                if (tick) {
                    this.logTickData(tick);
                    this.onBroadcastReceived(tick);
                }
                offset += 60; // Move to next tick (adjust based on actual packet size)
            }
        } catch (error) {
            this.logToFile(`Error parsing binary message: ${error}`);
        }
    }

    /**
     * Parses TypeB tick data format
     */
    private parseTypeBTickData(view: DataView, offset: number): FeedData | null {
        try {
            if (offset + 20 > view.byteLength) return null;
            
            const mode = view.getUint8(offset);
            const subscriptionMode = view.getUint8(offset + 1);
            const exchangeType = view.getUint8(offset + 2);
            const instrumentToken = view.getUint32(offset + 4, true);
            const sequenceNo = view.getUint32(offset + 8, true);
            const exTimestamp = view.getUint32(offset + 12, true);
            const ltp = view.getUint32(offset + 16, true);
            
            const tick: FeedData = {
                InstrumentToken: instrumentToken,
                Mode: mode === 1 ? 'ltp' : mode === 2 ? 'quote' : 'full',
                LastPrice: ltp / 100,
                Tradable: true
            };
            
            if (mode >= 2 && offset + 32 <= view.byteLength) {
                tick.LastQuantity = view.getUint32(offset + 20, true);
                tick.AveragePrice = view.getUint32(offset + 24, true) / 100;
                tick.Volume = view.getUint32(offset + 28, true);
            }
            
            if (mode === 3 && offset + 56 <= view.byteLength) {
                tick.Open = view.getUint32(offset + 40, true) / 100;
                tick.High = view.getUint32(offset + 44, true) / 100;
                tick.Low = view.getUint32(offset + 48, true) / 100;
                tick.Close = view.getUint32(offset + 52, true) / 100;
            }
            
            return tick;
        } catch (error) {
            this.logToFile(`Error parsing TypeB tick data: ${error}`);
            return null;
        }
    }

    /**
     * Reads LTP broadcast data (8 bytes)
     */
    private readLTPBroadcast(view: DataView, offset: number): FeedData {
        const instrumentToken = view.getUint32(offset, false);
        const divisor = Utils.getDecimalDivisor(instrumentToken);
        const lastPrice = view.getUint32(offset + 4, false) / divisor;
        
        return {
            InstrumentToken: instrumentToken,
            Mode: 'ltp',
            LastPrice: lastPrice,
            Tradable: (instrumentToken & 0xff) !== 9
        };
    }

    /**
     * Reads quote index data (28 bytes)
     */
    private readQuoteIndex(view: DataView, offset: number): FeedData {
        const instrumentToken = view.getUint32(offset, false);
        const divisor = Utils.getDecimalDivisor(instrumentToken);
        
        return {
            Mode: 'quote',
            InstrumentToken: instrumentToken,
            Tradable: (instrumentToken & 0xff) !== 9,
            LastPrice: view.getUint32(offset + 4, false) / divisor,
            High: view.getUint32(offset + 8, false) / divisor,
            Low: view.getUint32(offset + 12, false) / divisor,
            Open: view.getUint32(offset + 16, false) / divisor,
            Close: view.getUint32(offset + 20, false) / divisor,
            Change: view.getUint32(offset + 24, false) / divisor,
        };
    }

    /**
     * Reads full index data (32 bytes)
     */
    private readFullIndex(view: DataView, offset: number): FeedData {
        const instrumentToken = view.getUint32(offset, false);
        const divisor = Utils.getDecimalDivisor(instrumentToken);
        const lastPrice = view.getUint32(offset + 4, false) / divisor;
        const high = view.getUint32(offset + 8, false) / divisor;
        const low = view.getUint32(offset + 12, false) / divisor;
        const open = view.getUint32(offset + 16, false) / divisor;
        const close = view.getUint32(offset + 20, false) / divisor;
        const time = view.getUint32(offset + 28, false);

        return {
            Mode: 'full',
            InstrumentToken: instrumentToken,
            Tradable: (instrumentToken & 0xff) !== 9,
            LastPrice: lastPrice,
            High: high,
            Low: low,
            Open: open,
            Close: close,
            Change: lastPrice - close,
            Timestamp: Utils.unixToDateTime(time)
        };
    }

    /**
     * Reads quote data (44 bytes)
     */
    private readQuote(view: DataView, offset: number): FeedData {
        const instrumentToken = view.getUint32(offset, false);
        const divisor = Utils.getDecimalDivisor(instrumentToken);
        
        return {
            Mode: 'quote',
            InstrumentToken: instrumentToken,
            Tradable: (instrumentToken & 0xff) !== 9,
            LastPrice: view.getUint32(offset + 4, false) / divisor,
            LastQuantity: view.getUint32(offset + 8, false),
            AveragePrice: view.getUint32(offset + 12, false) / divisor,
            Volume: view.getUint32(offset + 16, false),
            BuyQuantity: view.getUint32(offset + 20, false),
            SellQuantity: view.getUint32(offset + 24, false),
            Open: view.getUint32(offset + 28, false) / divisor,
            High: view.getUint32(offset + 32, false) / divisor,
            Low: view.getUint32(offset + 36, false) / divisor,
            Close: view.getUint32(offset + 40, false) / divisor,
        };
    }

    /**
     * Reads full feed data (184 bytes)
     */
    private readFullFeed(view: DataView, offset: number): FeedData {
        const instrumentToken = view.getUint32(offset, false);
        const divisor = Utils.getDecimalDivisor(instrumentToken);

        const tick: FeedData = {
            Mode: 'full',
            InstrumentToken: instrumentToken,
            Tradable: (instrumentToken & 0xff) !== 9,
            LastPrice: view.getUint32(offset + 4, false) / divisor,
            LastQuantity: view.getUint32(offset + 8, false),
            AveragePrice: view.getUint32(offset + 12, false) / divisor,
            Volume: view.getUint32(offset + 16, false),
            BuyQuantity: view.getUint32(offset + 20, false),
            SellQuantity: view.getUint32(offset + 24, false),
            Open: view.getUint32(offset + 28, false) / divisor,
            High: view.getUint32(offset + 32, false) / divisor,
            Low: view.getUint32(offset + 36, false) / divisor,
            Close: view.getUint32(offset + 40, false) / divisor,
            LastTradeTime: Utils.unixToDateTime(view.getUint32(offset + 44, false)),
            OI: view.getUint32(offset + 48, false),
            OIDayHigh: view.getUint32(offset + 52, false),
            OIDayLow: view.getUint32(offset + 56, false),
            Timestamp: Utils.unixToDateTime(view.getUint32(offset + 60, false)),
        };

        // Read bid data
        tick.Bids = [];
        let bidOffset = offset + 64;
        for (let i = 0; i < 5; i++) {
            tick.Bids.push({
                Quantity: view.getUint32(bidOffset, false),
                Price: view.getUint32(bidOffset + 4, false) / divisor,
                Orders: view.getUint16(bidOffset + 8, false),
            });
            bidOffset += 12;
        }

        // Read offer data
        tick.Offers = [];
        let offerOffset = bidOffset;
        for (let i = 0; i < 5; i++) {
            tick.Offers.push({
                Quantity: view.getUint32(offerOffset, false),
                Price: view.getUint32(offerOffset + 4, false) / divisor,
                Orders: view.getUint16(offerOffset + 8, false),
            });
            offerOffset += 12;
        }

        return tick;
    }

    /**
     * Gets current connection status
     */
    public isConnected(): boolean {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }

    /**
     * Gets subscribed tokens
     */
    public getSubscribedTokens(): number[] {
        return Array.from(this.subscribedTokens);
    }

    /**
     * Set streaming mode for tokens
     */
    public setMode(mode: 'ltp' | 'quote' | 'full', tokens: number[]): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ a: 'mode', v: [mode, tokens] });
            this.ws.send(message);
        }
    }
}