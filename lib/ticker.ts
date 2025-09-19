import WebSocket from 'ws';
import { EventEmitter } from 'events';

interface DepthItem {
  buy_or_sell: number;
  quantity: number;
  price: number;
  orders: number;
}

interface TickData {
  mode: number;
  subscription_mode: number;
  exchange_type: number;
  instrument_token: string;
  sequence_no: number;
  ex_timestamp: string;
  ltp: number;
  last_traded_qty?: number;
  avg_traded_price?: number;
  vol_traded_today?: number;
  tot_buy_qty?: number;
  tot_sell_qty?: number;
  ohlc?: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
  last_traded_timestamp?: string;
  open_interest?: number;
  open_interest_percent?: number;
  depth?: {
    bid: DepthItem[];
    ask: DepthItem[];
  };
  upper_circuit_lmt?: number;
  lower_circuit_lmt?: number;
  '52_wk_high'?: number;
  '52_wk_low'?: number;
}

interface SubscriptionPacket {
  correlationID: string;
  action: number;
  params: {
    mode: number;
    tokenList: Array<{
      exchangeType: number;
      tokens: string[];
    }>;
  };
}

export class MTicker extends EventEmitter {
  private static readonly EXCHANGE_TYPE = {
    nsecm: 1,
    nsefo: 2,
    bsecm: 3,
    bsefo: 4,
    nsecd: 13
  };

  static readonly MODE_LTP = 1;
  static readonly MODE_QUOTE = 2;
  static readonly MODE_SNAP = 3;

  private static readonly MESSAGE_SUBSCRIBE = 1;
  private static readonly MESSAGE_UNSUBSCRIBE = 0;

  private ws: WebSocket | null = null;
  private socketUrl: string;
  private subscribedTokens: { [key: string]: number } = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts: number;
  private reconnectDelay: number;
  private pingInterval: NodeJS.Timeout | null = null;
  private isFirstConnect = true;
  private defaultMode: number;

  constructor(
    private apiKey: string,
    private accessToken: string,
    private root: string,
    private debug = false,
    private reconnect = true,
    maxReconnectTries = 50,
    reconnectMaxDelay = 60000,
    defaultMode = MTicker.MODE_LTP
  ) {
    super();
    this.socketUrl = `${this.root}?ACCESS_TOKEN=${this.accessToken}&API_KEY=${this.apiKey}`;
    this.maxReconnectAttempts = maxReconnectTries;
    this.reconnectDelay = reconnectMaxDelay;
    this.defaultMode = defaultMode;
  }

  connect(): void {
    this.ws = new WebSocket(this.socketUrl);
    
    this.ws.on('open', () => this.onOpen());
    this.ws.on('message', (data: Buffer) => this.onMessage(data));
    this.ws.on('close', (code: number, reason: Buffer) => this.onClose(code, reason.toString()));
    this.ws.on('error', (error: Error) => this.onError(error));
  }

  private onOpen(): void {
    this.reconnectAttempts = 0;
    this.startPing();
    
    if (!this.isFirstConnect) {
      this.resubscribe();
    }
    this.isFirstConnect = false;
    
    this.emit('connect');
    if (this.debug) console.log('WebSocket connected');
  }

  private onMessage(data: Buffer): void {
    if (data.length < 2) return;

    try {
      // Try to parse as text first
      const textData = data.toString('utf8');
      if (textData.startsWith('{')) {
        const jsonData = JSON.parse(textData);
        this.parseTextMessage(jsonData);
        return;
      }
    } catch {
      // If not JSON, treat as binary
    }

    // Parse binary data
    if (data.length > 4) {
      const parsedData = this.parseBinary(data);
      const convertedData = this.convertPrices(parsedData);
      this.emit('ticks', convertedData);
    }
  }

  private onClose(code: number, reason: string): void {
    this.stopPing();
    this.emit('close', code, reason);
    
    if (this.reconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        if (this.debug) console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
        this.connect();
      }, this.reconnectDelay);
    }
  }

  private onError(error: Error): void {
    this.emit('error', error);
    if (this.debug) console.error('WebSocket error:', error);
  }

  private startPing(): void {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.ping();
      }
    }, 2500);
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  sendLoginAfterConnect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(`LOGIN:${this.accessToken}`);
    }
  }

  subscribe(exchangeType: string, instrumentTokens: string[], mode?: number): void {
    const subscriptionMode = mode ?? this.defaultMode;
    const packet: SubscriptionPacket = {
      correlationID: '',
      action: MTicker.MESSAGE_SUBSCRIBE,
      params: {
        mode: subscriptionMode,
        tokenList: [{
          exchangeType: MTicker.EXCHANGE_TYPE[exchangeType.toLowerCase() as keyof typeof MTicker.EXCHANGE_TYPE] || 1,
          tokens: instrumentTokens
        }]
      }
    };

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(packet));
      instrumentTokens.forEach(token => {
        this.subscribedTokens[token] = subscriptionMode;
      });
    }
  }

  unsubscribe(exchangeType: string, instrumentTokens: string[]): void {
    const packet: SubscriptionPacket = {
      correlationID: '',
      action: MTicker.MESSAGE_UNSUBSCRIBE,
      params: {
        mode: this.defaultMode,
        tokenList: [{
          exchangeType: MTicker.EXCHANGE_TYPE[exchangeType.toLowerCase() as keyof typeof MTicker.EXCHANGE_TYPE] || 1,
          tokens: instrumentTokens
        }]
      }
    };

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(packet));
      instrumentTokens.forEach(token => {
        delete this.subscribedTokens[token];
      });
    }
  }

  private resubscribe(): void {
    const modes: { [key: number]: string[] } = {};
    
    Object.keys(this.subscribedTokens).forEach(token => {
      const mode = this.subscribedTokens[token];
      if (!modes[mode]) modes[mode] = [];
      modes[mode].push(token);
    });

    Object.keys(modes).forEach(mode => {
      if (this.debug) console.log(`Resubscribe mode: ${mode} - ${modes[+mode]}`);
      // Note: This would need the exchange type to be stored with tokens for proper resubscription
    });
  }

  private parseTextMessage(data: any): void {
    if (data.order_status === 'order' && data.orderData) {
      this.emit('order_update', data.orderData);
    }
    
    if (data.order_status === 'trade' && data.orderData) {
      this.emit('trade_update', data.orderData);
    }
    
    if (data.type === 'error') {
      this.emit('error', new Error(data.data));
    }
  }

  private convertFromUnixTimestamp(timestamp: number, year = 1980): Date {
    // Convert from custom epoch (1980) as per Python implementation
    const origin = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
    if (timestamp !== 0) {
      return new Date(origin.getTime() + timestamp * 1000);
    }
    return origin;
  }

  private convertPrices(tickData: TickData[]): TickData[] {
    return tickData.map(tick => {
      const converted = { ...tick };
      
      // Convert price fields
      ['ltp', 'avg_traded_price'].forEach(field => {
        if (field in converted) {
          (converted as any)[field] = (converted as any)[field] / 100;
        }
      });
      
      // Convert OHLC
      if (converted.ohlc) {
        ['open', 'high', 'low', 'close'].forEach(key => {
          if (key in converted.ohlc!) {
            (converted.ohlc as any)[key] = (converted.ohlc as any)[key] / 100;
          }
        });
      }
      
      // Convert market depth prices
      if (converted.depth) {
        converted.depth.bid.forEach(item => {
          if (item.price > 0) item.price = item.price / 100;
        });
        converted.depth.ask.forEach(item => {
          if (item.price > 0) item.price = item.price / 100;
        });
      }
      
      // Convert circuit limits and 52-week data
      ['upper_circuit_lmt', 'lower_circuit_lmt', '52_wk_high', '52_wk_low'].forEach(field => {
        if (field in converted && (converted as any)[field] > 0) {
          (converted as any)[field] = (converted as any)[field] / 100;
        }
      });
      
      return converted;
    });
  }

  private parseBinary(buffer: Buffer): TickData[] {
    try {
      const data: TickData[] = [];
      
      const subscriptionMode = buffer.readUInt8(0);
      const exchangeType = buffer.readUInt8(1);
      const instrumentToken = buffer.subarray(2, 27).toString('utf8').replace(/\0/g, ' ').trim();
      const sequenceNo = this.readUInt64LE(buffer, 27);
      const exTimestamp = this.convertFromUnixTimestamp(this.readUInt64LE(buffer, 35));
      const ltp = this.readUInt64LE(buffer, 43);

      const tickData: TickData = {
        mode: this.defaultMode,
        subscription_mode: subscriptionMode,
        exchange_type: exchangeType,
        instrument_token: instrumentToken,
        sequence_no: sequenceNo,
        ex_timestamp: exTimestamp.toISOString(),
        ltp: ltp
      };

      // LTP Mode (51 bytes)
      if (buffer.length === 51) {
        data.push(tickData);
      }
      // Quote Mode (123 bytes) or Snap Mode (379 bytes)
      else if (buffer.length === 123 || buffer.length === 379) {
        tickData.mode = buffer.length === 123 ? MTicker.MODE_QUOTE : MTicker.MODE_SNAP;
        tickData.last_traded_qty = this.readUInt64LE(buffer, 51);
        tickData.avg_traded_price = this.readUInt64LE(buffer, 59);
        tickData.vol_traded_today = this.readUInt64LE(buffer, 67);
        tickData.tot_buy_qty = buffer.readDoubleLE(75);
        tickData.tot_sell_qty = buffer.readDoubleLE(83);
        
        // Read OHLC data - these should be dynamic values from server
        const openPrice = this.readUInt64LE(buffer, 91);
        const highPrice = this.readUInt64LE(buffer, 99);
        const lowPrice = this.readUInt64LE(buffer, 107);
        const closePrice = this.readUInt64LE(buffer, 115);
        
        tickData.ohlc = {
          open: openPrice,
          high: highPrice,
          low: lowPrice,
          close: closePrice
        };

        if (buffer.length === 379) {
          const timestamp = this.convertFromUnixTimestamp(this.readUInt64LE(buffer, 123));
          tickData.last_traded_timestamp = timestamp.toISOString();
          tickData.open_interest = this.readUInt64LE(buffer, 131);
          tickData.open_interest_percent = buffer.readDoubleLE(139);
          
          // Parse market depth data (200 bytes from 147 to 347)
          const depth = { bid: [] as DepthItem[], ask: [] as DepthItem[] };
          
          for (let i = 0, p = 147; i < 10 && p < 347; i++, p += 20) {
            const buySellFlag = buffer.readInt16LE(p);
            const quantity = this.readUInt64LE(buffer, p + 2);
            const price = this.readUInt64LE(buffer, p + 10);
            const orders = buffer.readInt16LE(p + 18);
            
            const depthItem: DepthItem = {
              buy_or_sell: buySellFlag,
              quantity: quantity,
              price: price,
              orders: orders
            };
            
            if (i < 5) {
              depth.bid.push(depthItem);
            } else {
              depth.ask.push(depthItem);
            }
          }
          
          tickData.depth = depth;
          
          // Read circuit limits and 52-week data
          tickData.upper_circuit_lmt = this.readUInt64LE(buffer, 347);
          tickData.lower_circuit_lmt = this.readUInt64LE(buffer, 355);
          tickData['52_wk_high'] = this.readUInt64LE(buffer, 363);
          tickData['52_wk_low'] = this.readUInt64LE(buffer, 371);
        }

        data.push(tickData);
      }

      return data;
    } catch (error) {
      if (this.debug) console.error('Error parsing binary data:', error);
      throw error;
    }
  }

  private readUInt64LE(buffer: Buffer, offset: number): number {
    // Read 8 bytes as little-endian and convert to number
    // Using system byte order as per Python implementation
    const low = buffer.readUInt32LE(offset);
    const high = buffer.readUInt32LE(offset + 4);
    return high * 0x100000000 + low;
  }

  close(code?: number, reason?: string): void {
    this.reconnect = false;
    this.stopPing();
    if (this.ws) {
      this.ws.close(code, reason);
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}