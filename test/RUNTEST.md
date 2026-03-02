# Testing TypeB Trading API SDK

This folder contains testing utilities to validate individual SDK methods before public release.

## Quick Start

1. **Update credentials** in `test/test-api.ts`:
   ```typescript
   const clientcode = 'your_mobile_number_or_client_code';
   const password = 'your_password';
   const apiKey = 'your_actual_api_key';
   ```

2. **Run tests**:
   ```bash
   # Interactive testing menu
   npx ts-node test/test-api.ts
   
   # WebSocket ticker testing
   npx ts-node test/test-ticker.ts
   ```

## Available Test Commands

| Command | Description |
|---------|-------------|
| `npx ts-node test/test-api.ts` | Interactive API testing menu |
| `npx ts-node test/test-ticker.ts` | WebSocket market data testing |

## Interactive API Testing

Run `npx ts-node test/test-api.ts` for an interactive menu:

```
=== TypeB Trading API Test Menu ===

Authentication:
1. Login
2. Verify OTP
3. Verify TOTP
4. Logout

Order Management:
5. Place Order
6. Modify Order
7. Cancel Order
8. Cancel All Orders
9. Get Order Details
10. Get Order Book

Portfolio & Funds:
11. Get Positions
12. Get Holdings
13. Get Fund Summary
14. Convert Position

Market Data:
15. Get Historical Data
16. Get Intraday Chart Data
17. Get Quote
18. Get Instrument Master
19. Get Option Chain Master
20. Get Option Chain

Basket Operations:
21. Create Basket
22. Fetch Basket
23. Rename Basket
24. Delete Basket
25. Calculate Basket

Other Operations:
26. Get Trade Book
27. Get Trade History
28. Order Margin
29. Loser Gainer

0. Exit

Enter your choice (0-29):
```

## WebSocket Testing

Run `npx ts-node test/test-ticker.ts` to test real-time market data:

- Connects to WebSocket feed
- Subscribes to market data (LTP/QUOTE/SNAP modes)
- Logs tick data to file
- Supports order/trade updates

## Test Configuration

### API Testing (`test-api.ts`)
- **Login Flow**: Automated login with OTP verification
- **Order Testing**: Place, modify, cancel orders with sample data
- **Market Data**: Historical data, quotes, instrument master
- **Portfolio**: Positions, holdings, fund summary
- **Baskets**: Create and manage trading baskets

### WebSocket Testing (`test-ticker.ts`)
- **Market Modes**: LTP (1), QUOTE (2), SNAP (3)
- **Exchanges**: NSE, BSE, NFO, BFO, CDS, MCX
- **Data Types**: Price, volume, OHLC, market depth
- **Logging**: All data saved to `miraesdk_typeB_socket.log`

## Sample Test Data

### Order Parameters
```typescript
{
  variety: "NORMAL",
  tradingsymbol: "IDEA-EQ",
  symboltoken: "14366",
  exchange: "NSE",
  transactiontype: "BUY",
  ordertype: "MARKET",
  quantity: "1",
  producttype: "DELIVERY"
}
```

### Market Data Parameters
```typescript
{
  exchange: 'NSE',
  symboltoken: '22',
  interval: 'TEN_MINUTE',
  fromdate: '2025-08-11',
  todate: '2025-08-14'
}
```

### WebSocket Subscription
```typescript
// Subscribe to NSE instruments with SNAP mode
mTicker.subscribe("NSE", ["2885"], MTicker.MODE_SNAP);

// Available modes:
// MODE_LTP = 1    (Last Traded Price only)
// MODE_QUOTE = 2  (LTP + OHLC + Volume)
// MODE_SNAP = 3   (Full market depth + all data)
```

## Output Files

- `api-responses.log` - All API responses
- `miraesdk_typeB_socket.log` - WebSocket tick data
- `instrument_Script_Master.json` - Instrument master data

## Error Handling

All test methods include comprehensive error handling and logging:
- API errors logged to response files
- WebSocket connection issues handled with auto-reconnect
- Invalid parameters validated before API calls

## Prerequisites

- Node.js v18.0.0+
- Valid TypeB Trading API credentials
- Active internet connection for API/WebSocket testing

## Notes

- Update credentials before running tests
- Some tests require market hours for live data
- WebSocket data is logged to files (not console) to avoid clutter
- All responses are automatically logged for debugging