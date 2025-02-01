// FUNCTION TO CREATE A TIMESTAMPS BETWEEN PRODUCTS TIMES
export function interpolateTimestamps(data: any) {
  if (data.length < 1) return;
  const result = [];
  for (let i = 0; i < data.length - 1; i++) {
    if (Array.isArray(data[i]) && Array.isArray(data[i + 1])) {
      const [timestamp1, price1] = data[i];

      const [timestamp2, price2] = data[i + 1];
      const startTime = timestamp1;
      const endTime = timestamp2;
      const daysBetween = (endTime - startTime) / (1000 * 60 * 60 * 24);
      const increment = (endTime - startTime) / daysBetween;
      for (let j = startTime; j < endTime; j += increment) {
        result.push([j, price1]);
      }
    } else {
      console.error(`Invalid data format at index ${i}`);
    }
  }
  result.push(data[data.length - 1]);

  return result;
}

// FUNCTION TO GET LOWEST PRICE
export const getLowestPrice = (data: any) => {
  const lowestprice = [];
  for (let i = 0; i < data.length; i++) {
    const [timestamp1, price] = data[i];
    lowestprice.push(price);
  }
  return Math.min(...lowestprice);
};

// Function to calculate is this a corrent time to buy
type PriceAnalysisResult = "Exactly" | "Indeed" | "Maybe" | "Nope";


export function analyzePriceTrends(data: [number, number][]): PriceAnalysisResult {
  if (data.length < 2) {
    throw new Error("Insufficient data to determine if it's a good time to buy.");
  }

  // Extract the last entry which is the current timestamp and price
  const [currentTimestamp, currentPrice] = data[data.length - 1];

  // Extract the historical prices
  const historicalPrices = data.slice(0, -1).map(entry => entry[1]);

  // Calculate the average historical price
  const averageHistoricalPrice = historicalPrices.reduce((sum, price) => sum + price, 0) / historicalPrices.length;

  // Calculate the standard deviation of historical prices
  const variance = historicalPrices.reduce((sum, price) => sum + Math.pow(price - averageHistoricalPrice, 2), 0) / historicalPrices.length;
  const standardDeviation = Math.sqrt(variance);

  // Calculate the percentage of price drops
  const priceDrops = historicalPrices.filter(price => price > currentPrice).length;
  const dropPercentage = (priceDrops / historicalPrices.length) * 100;

  // Determine the advice based on the analysis
  if (currentPrice < averageHistoricalPrice - standardDeviation) {
    return "Exactly"; // Best time to buy
  } else if (currentPrice < averageHistoricalPrice) {
    return "Indeed"; // Good time to buy
  } else if (dropPercentage < 15) {
    return "Maybe"; // Consider buying
  } else {
    return "Nope"; // Not a good time to buy
  }
}

