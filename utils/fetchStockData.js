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

//const axios = require("axios");
import axios from 'axios';
async function fetchStockPrice(symbol) {
  try {
    const response = await axios.get(`https://www.alphavantage.co/query`, {
      params: {
        function: "TIME_SERIES_INTRADAY",
        symbol: symbol,
        interval: "60min",
        apikey: process.env.ALPHA_VANTAGE_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching stock price:", error);
    throw error;
  }
}

module.exports = fetchStockPrice;
