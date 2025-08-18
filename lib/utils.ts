/**
 * Utility functions for TypeB SDK
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { HttpClientConfig } from '../types/config';

/**
 * Replace route parameters in URL templates
 * @param route - Route template with placeholders
 * @param params - Object with parameter values
 * @returns Formatted URL
 */
export function replaceRouteParams(route: string, params: Record<string, string | number>): string {
    let formattedRoute = route;
    for (const [key, value] of Object.entries(params)) {
        formattedRoute = formattedRoute.replace(`{${key}}`, String(value));
    }
    return formattedRoute;
}

/**
 * Create a configured HTTP client instance
 * @param config - HTTP client configuration
 * @returns Configured Axios instance
 */
export function createHttpClient(config: HttpClientConfig): AxiosInstance {
    const client = axios.create({
        baseURL: config.baseURL,
        timeout: config.timeout,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...config.headers,
        },
    });

    // Add request interceptor for error handling
    client.interceptors.request.use(
        (request) => request,
        (error) => {
            console.error('Request error:', error);
            return Promise.reject(error);
        }
    );

    client.interceptors.response.use(
        (response) => response,
        (error) => {
            console.error('Response error:', error);
            return Promise.reject(error);
        }
    );

    return client;
}

/**
 * Utility class for WebSocket data processing
 */
export class Utils {
    /**
     * Get decimal divisor based on instrument token
     * @param instrumentToken - The instrument token
     * @returns Decimal divisor
     */
    static getDecimalDivisor(instrumentToken: number): number {
        // Default divisor logic - can be customized based on TypeB protocol
        return 100;
    }

    /**
     * Convert Unix timestamp to DateTime
     * @param unixTimestamp - Unix timestamp
     * @returns Date object
     */
    static unixToDateTime(unixTimestamp: number): Date {
        return new Date(unixTimestamp * 1000);
    }
}
