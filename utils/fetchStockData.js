import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

async function fetchStockPrice(symbol) {
  const options = {
    method: 'GET',
    url: `https://nairobi-stock-exchange-nse.p.rapidapi.com/stocks/${symbol}`,
    headers: {
      'x-rapidapi-key': process.env.RAPID_API_KEY,
      'x-rapidapi-host': process.env.RAPID_API_HOST
    }
  };
  try {
    const response = await axios.request(options);
    return(response.data[0]);
  } catch (error) {
    console.error(error);
  }
}

async function fetchAllStocks() {
  const options = {
    method: 'GET',
    url: 'https://nairobi-stock-exchange-nse.p.rapidapi.com/stocks',
    headers: {
      'x-rapidapi-key': process.env.RAPID_API_KEY,
      'x-rapidapi-host': process.env.RAPID_API_HOST
    }
  };
  try {
    const response = await axios.request(options);
    return(response.data);
  } catch (error) {
    console.error(error);
  }
}

export default fetchStockPrice;
export { fetchAllStocks };