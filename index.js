import connectClient from './utils/connectClient.js';
import fetchStockPrice from './utils/fetchStockData.js';

const SYMBOL = "SCOM"; // Replace with desired stock symbol

async function run() {
    try {
        // Build and connect Pub/Sub API client
        const client = await connectClient();
        console.log('### got client: ',client);

        //fetch Stock price
        const stockData = await fetchStockPrice(SYMBOL);
        //console.log('Stock data: ',JSON.stringify(stockData));
        const change = stockData['change'];
        const price = stockData['price'];
        const name = stockData['name'];
        const ticker = stockData['ticker'];
        const volume = stockData['volume'];

        //publish stock price data   
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
        console.log('### payload: ',JSON.stringify(payload));
        const publishResult = await client.publish('/event/HourlyStockEvent__e', payload);
        console.log('Published event: ', JSON.stringify(publishResult));   
        
    } catch (error) {
        console.error(error);
    }
}

// Schedule to run every hour
//setInterval(run, 60 * 60 * 1000);

// Run every 20 seconds for testing
setInterval(run, 20 * 1000); 
run(); // Initial run