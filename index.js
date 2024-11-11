/**
 * MIT License
 * 
 * Copyright (c) 2024 brave-hawk
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import connectClient from './utils/connectClient.js';
import fetchStockPrice, {fetchAllStocks} from './utils/fetchStockData.js';

import * as dotenv from 'dotenv';
dotenv.config();

async function run(){
    if(process.env.FETCH_MODE == 'ALL'){
        console.log('## Running in FETCH_MODE: ALL');
        fetchAll();
    }
    else{
        console.log('## Running in FETCH_MODE: SINGLE');
        fetchSingle();
    }
}


async function fetchSingle() {
    try {
        // Build and connect Pub/Sub API client
        const client = await connectClient();
        const SYMBOL = "GLD"; // Replace with desired stock symbol
        //fetch single stock price
        const stockData = await fetchStockPrice(SYMBOL);
        //console.log('Stock data: ',JSON.stringify(stockData));
        const change = stockData['change'];
        const price = stockData['price'];
        const name = stockData['name'];
        const ticker = stockData['ticker'];
        const volume = stockData['volume'];

        //publish single stock price data   
        const payload = {
            CreatedDate: new Date().getTime(), 
            //CreatedById: process.env.SALESFORCE_USERID, // Valid user ID
            CreatedById: '005Qy000007bIpxIAE',
            Symbol__c: { string: ticker },
            Price__c: { string: price }, 
            Change__c: { string: change },
            StockName__c: { string: name },
            Volume__c: { string: volume }
        };
        const publishResult = await client.publish('/event/HourlyStockEvent__e', payload);
        console.log('Published event: ', JSON.stringify(publishResult));   
        
    } catch (error) {
        console.error(error);
    }
}

async function fetchAll() {
    try {
        // Build and connect Pub/Sub API client
        const client = await connectClient();
        
        //fetch all stocks
        const stockData = await fetchAllStocks();
        
         //publish ALL stock price data. Payload will contain just the All_Stock_String__c field
         const payload = {
            CreatedDate: new Date().getTime(), 
            CreatedById: '005Qy000007bIpxIAE',
            Symbol__c: { string: 'ALL' },
            All_Stock_String__c: {string: JSON.stringify(stockData)}
        };
        const publishResult = await client.publish('/event/HourlyStockEvent__e', payload);
        console.log('Published event: ', JSON.stringify(publishResult));   
        
    } catch (error) {
        console.error(error);
    }
}

// Schedule to run every hour
setInterval(run, 60 * 60 * 1000);

// Run every 60 seconds for testing
//setInterval(run, 60 * 1000); 
run(); // Initial run
