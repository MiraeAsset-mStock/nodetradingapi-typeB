/**
 * Configuration interfaces for TypeB SDK
 * 
 * This module contains all configuration interfaces used to configure the TypeB SDK clients.
 * These interfaces define the structure for REST API client configuration, WebSocket client configuration,
 * and HTTP client settings used throughout the SDK.
 * 
 * @module config
 */

/**
 * REST API Client Configuration
 * 
 * Configuration interface for setting up the REST API client for TypeB SDK.
 * This interface defines all necessary parameters for authenticating and configuring API connections.
 * 
 * @interface MConnectConfig
 * @property {string} apiKey - API key for authentication (required)
 * @property {string} [baseUrl] - Base URL for the API (optional, defaults to https://api.mstock.trade)
 * @property {number} [timeout] - Request timeout in milliseconds (optional, defaults to 30000)
 * @property {Object} [retry] - Retry configuration for failed requests (optional)
 * @property {number} [retry.maxRetries=3] - Maximum number of retry attempts
 * @property {number} [retry.retryDelay=1000] - Delay between retries in milliseconds
 * 
 * @example
 * ```typescript
 * const config: MConnectConfig = {
 *   apiKey: 'your-api-key',
 *   baseUrl: 'https://api.mstock.trade',
 *   timeout: 30000,
 *   retry: {
 *     maxRetries: 3,
 *     retryDelay: 1000
 *   }
 * };
 * ```
 */
export interface MConnectConfig {
    /** API key for authentication */
    apiKey: string;
    /** Base URL for the API */
    baseUrl?: string;
    /** Request timeout in milliseconds */
    timeout?: number;
    /** Retry configuration */
    retry?: {
        /** Maximum number of retry attempts */
        maxRetries?: number;
        /** Delay between retries in milliseconds */
        retryDelay?: number;
    };
}

/**
 * WebSocket Client Configuration
 * 
 * Configuration interface for setting up the WebSocket client for real-time data streaming.
 * This interface defines parameters for WebSocket authentication and connection management.
 * 
 * @interface MTickerConfig
 * @property {string} api_key - API key for authentication (required)
 * @property {string} access_token - Access token for WebSocket authentication (required)
 * @property {string} [baseSocketUrl] - Base WebSocket URL (optional, defaults to wss://ws.mstock.trade)
 * @property {number} [maxReconnectionAttempts=5] - Maximum reconnection attempts on connection failure
 * @property {number} [reconnectDelay=5000] - Delay between reconnection attempts in milliseconds
 * @property {number} [connectionTimeout=30000] - Connection timeout in milliseconds
 * @property {boolean} [autoReconnect=true] - Enable automatic reconnection on connection loss
 * 
 * @example
 * ```typescript
 * const tickerConfig: MTickerConfig = {
 *   api_key: 'your-api-key',
 *   access_token: 'your-access-token',
 *   baseSocketUrl: 'wss://ws.mstock.trade',
 *   maxReconnectionAttempts: 5,
 *   reconnectDelay: 5000,
 *   autoReconnect: true
 * };
 * ```
 */
export interface MTickerConfig {
    /** API key for authentication */
    api_key: string;
    /** Access token for WebSocket authentication */
    access_token: string;
    /** Base WebSocket URL */
    baseSocketUrl?: string;
    /** Maximum reconnection attempts */
    maxReconnectionAttempts?: number;
    /** Delay between reconnection attempts in milliseconds */
    reconnectDelay?: number;
    /** Connection timeout in milliseconds */
    connectionTimeout?: number;
    /** Enable auto-reconnection */
    autoReconnect?: boolean;
}

/**
 * HTTP Client Configuration
 * 
 * Configuration interface for HTTP client settings used throughout the SDK.
 * This interface defines standard HTTP client parameters for making API requests.
 * 
 * @interface HttpClientConfig
 * @property {string} baseURL - Base URL for requests (required)
 * @property {number} timeout - Request timeout in milliseconds (required)
 * @property {Record<string, string>} [headers] - Default headers to include with every request (optional)
 * @property {Object} [retry] - Retry configuration for failed requests (optional)
 * @property {number} retry.maxRetries - Maximum number of retry attempts
 * @property {number} retry.retryDelay - Delay between retries in milliseconds
 * 
 * @example
 * ```typescript
 * const httpConfig: HttpClientConfig = {
 *   baseURL: 'https://api.mstock.trade',
 *   timeout: 30000,
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'User-Agent': 'TypeB-SDK'
 *   },
 *   retry: {
 *     maxRetries: 3,
 *     retryDelay: 1000
 *   }
 * };
 * ```
 */
export interface HttpClientConfig {
    /** Base URL for requests */
    baseURL: string;
    /** Request timeout in milliseconds */
    timeout: number;
    /** Default headers */
    headers?: Record<string, string>;
    /** Retry configuration */
    retry?: {
        maxRetries: number;
        retryDelay: number;
    };
}
