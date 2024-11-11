# Salesforce Stock Price Publisher

A Node.js application that fetches stock prices from the Nairobi Stock Exchange and publishes them to Salesforce using the Pub/Sub API. The application can run in two modes: fetching a single stock or all available stocks, and publishes the data hourly as custom Salesforce events.

## Features

- Hourly stock price fetching from Nairobi Stock Exchange (or stock exchange of your choice)
- Support for both single stock and bulk stock data fetching
- Automatic publishing to Salesforce using Pub/Sub API
- Configurable environment for development and production
- Secure authentication handling for Salesforce integration

## Prerequisites

- Node.js (v14 or higher)
- Salesforce Organization with Pub/Sub API enabled
- RapidAPI account with access to Nairobi Stock Exchange API
- Salesforce Connected App (for production environment)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd stock-price-publisher
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
# Environment
NODE_ENV=DEV  # or PROD

# Fetch Mode
FETCH_MODE=SINGLE  # or ALL

# Salesforce Credentials
SALESFORCE_LOGIN_URL=your-salesforce-login-url
SALESFORCE_USERNAME=your-username
SALESFORCE_PASSWORD=your-password
SALESFORCE_TOKEN=your-security-token

# Production Only (OAuth JWT)
SALESFORCE_JWT_CLIENT_ID=your-connected-app-client-id
SALESFORCE_PRIVATE_KEY_FILE=path/to/private-key.key

# RapidAPI Configuration
RAPID_API_KEY=your-rapid-api-key
RAPID_API_HOST=nairobi-stock-exchange-nse.p.rapidapi.com
```

## Usage

Start the application:

```bash
node index.js
```

The application will run based on the `FETCH_MODE` environment variable:
- `SINGLE`: Fetches data for a single stock (default: "GLD")
- `ALL`: Fetches data for all available stocks

## Architecture

### Components

1. **index.js**
   - Main application entry point
   - Handles scheduling and execution modes
   - Manages the publishing process

2. **utils/connectClient.js**
   - Manages Salesforce Pub/Sub API client connection
   - Supports both username-password (development) and OAuth JWT (production) authentication
   - Implements connection pooling

3. **utils/fetchStockData.js**
   - Handles API calls to Nairobi Stock Exchange
   - Provides methods for single and bulk stock data fetching

### Salesforce Integration

The application publishes events to a custom Salesforce event channel (`HourlyStockEvent__e`) with the following fields:
- `CreatedDate`: Timestamp of the event
- `CreatedById`: Salesforce User ID
- `Symbol__c`: Stock symbol
- `Price__c`: Current stock price
- `Change__c`: Price change
- `StockName__c`: Name of the stock
- `Volume__c`: Trading volume
- `All_Stock_String__c`: JSON string containing all stocks data (when in ALL mode)

## Production Deployment

For production deployment:

1. Set `NODE_ENV=PROD` in your environment
2. Configure a Salesforce Connected App with JWT authentication
3. Generate and safely store your private key
4. Update all production-specific environment variables
5. Consider implementing proper logging and monitoring

## Development

For development purposes:
- Set `NODE_ENV=DEV` for simplified authentication
- Uncomment the 60-second interval in `index.js` for faster testing
- Use username-password authentication flow

## Error Handling

The application includes basic error handling for:
- API connection failures
- Salesforce authentication issues
- Data fetching errors

## Dependencies

- `salesforce-pubsub-api-client`: Salesforce Pub/Sub API integration
- `axios`: HTTP client for API requests
- `dotenv`: Environment variable management

## Thanks

Thanks to [@iancenry](https://github.com/iancenry) for providing the free API

## License

This project is licensed under the terms of the [MIT License](./LICENSE)

