import * as fs from 'fs';
import * as readline from 'readline';
import { MTicker } from '../lib/ticker';
import { MConnect } from '../lib/connect';

// Logger setup
const logFile = 'miraesdk_typeB_socket.log';
const logger = {
  info: (message: string) => {
    const now = new Date();
    const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    const timestamp = istTime.toISOString().replace('Z', '+05:30');
    const logMessage = `${timestamp} ${message}\n`;
    fs.appendFileSync(logFile, logMessage);
    console.log(message);
  }
};

async function getInput(prompt: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  try {
  
    const apiKey = 'ENTER_YOUR_API_KEY_HERE'; // Replace with your actual API key
    const accessToken = 'EnTER_YOUR_ACCESS_TOKEN_HERE'; // Replace with your actual access token
    
    // User-defined mode for all subscriptions
    const userMode = MTicker.MODE_SNAP; // User can change this to MODE_LTP, MODE_QUOTE, or MODE_SNAP
    
    // Initialize MTicker with user-defined default mode
    const mTicker = new MTicker(apiKey, accessToken, 'wss://ws.mstock.trade', true, true, 50, 60000, userMode);
    
    // Event handlers
    mTicker.on('ticks', (ticks) => {
      // Only log to file, not console
      const now = new Date();
      const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      const timestamp = istTime.toISOString().replace('Z', '+05:30');
      const logMessage = `${timestamp} Ticks: ${JSON.stringify(ticks)}\n`;
      fs.appendFileSync(logFile, logMessage);
    });
    
    mTicker.on('order_update', (data) => {
      logger.info(`On Order Updates Packet received : ${JSON.stringify(data)}`);
    });
    
    mTicker.on('trade_update', (data) => {
      logger.info(`On Trade Updates Packet received : ${JSON.stringify(data)}`);
    });
    
    mTicker.on('connect', () => {
      mTicker.sendLoginAfterConnect();
      //mTicker.subscribe("NSE", ["10000999"]); // Uses default mode set in constructor
      mTicker.subscribe("NSE", ["22"], MTicker.MODE_SNAP); // MODE_QUOTE / MODE_LTP / MODE_SNAP Override with specific mode
      console.log("Connected to socket and logged in successfully");
      console.log(`WebSocket data is being stored in: ${process.cwd()}`);
    });
    
    mTicker.on('close', (code, reason) => {
      logger.info(`Connection closed: ${code} - ${reason}`);
      process.exit(0);
    });
    
    mTicker.on('error', (error) => {
      logger.info(`WebSocket error: ${error.message}`);
    });
    
    // Connect to WebSocket
    mTicker.connect();
    
    // Handle process termination
    process.on('SIGINT', () => {
      logger.info('Now Closing Web socket connection');
      mTicker.close();
      logger.info('Testing complete');
      process.exit(0);
    });
    
   } catch (error) {
  //   logger.info(`Error: ${error}`);
  //   process.exit(1);
  }
}

main();