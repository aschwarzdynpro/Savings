import type { SymbolSeed } from './types';

/**
 * Curated top 50 listed companies by market cap.
 *
 * Market cap figures are a snapshot and will drift over time. Sprint 2 will
 * either pull live market-cap values from the provider or update this list
 * from a more authoritative source. The ordering is approximate.
 *
 * `marketCap` is in USD.
 */
export const TOP_50: SymbolSeed[] = [
  { symbol: 'AAPL', name: 'Apple', marketCap: 3_400_000_000_000 },
  { symbol: 'MSFT', name: 'Microsoft', marketCap: 3_300_000_000_000 },
  { symbol: 'NVDA', name: 'NVIDIA', marketCap: 3_200_000_000_000 },
  { symbol: 'GOOGL', name: 'Alphabet (Class A)', marketCap: 2_100_000_000_000 },
  { symbol: 'AMZN', name: 'Amazon', marketCap: 1_900_000_000_000 },
  { symbol: 'META', name: 'Meta Platforms', marketCap: 1_500_000_000_000 },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', marketCap: 990_000_000_000 },
  { symbol: 'TSLA', name: 'Tesla', marketCap: 900_000_000_000 },
  { symbol: 'LLY', name: 'Eli Lilly', marketCap: 820_000_000_000 },
  { symbol: 'TSM', name: 'Taiwan Semiconductor', marketCap: 800_000_000_000 },
  { symbol: 'V', name: 'Visa', marketCap: 560_000_000_000 },
  { symbol: 'JPM', name: 'JPMorgan Chase', marketCap: 550_000_000_000 },
  { symbol: 'WMT', name: 'Walmart', marketCap: 540_000_000_000 },
  { symbol: 'UNH', name: 'UnitedHealth', marketCap: 520_000_000_000 },
  { symbol: 'XOM', name: 'ExxonMobil', marketCap: 510_000_000_000 },
  { symbol: 'MA', name: 'Mastercard', marketCap: 440_000_000_000 },
  { symbol: 'PG', name: 'Procter & Gamble', marketCap: 410_000_000_000 },
  { symbol: 'ORCL', name: 'Oracle', marketCap: 400_000_000_000 },
  { symbol: 'COST', name: 'Costco', marketCap: 390_000_000_000 },
  { symbol: 'HD', name: 'Home Depot', marketCap: 380_000_000_000 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', marketCap: 380_000_000_000 },
  { symbol: 'NVO', name: 'Novo Nordisk', marketCap: 370_000_000_000 },
  { symbol: 'BAC', name: 'Bank of America', marketCap: 320_000_000_000 },
  { symbol: 'ABBV', name: 'AbbVie', marketCap: 310_000_000_000 },
  { symbol: 'KO', name: 'Coca-Cola', marketCap: 300_000_000_000 },
  { symbol: 'CVX', name: 'Chevron', marketCap: 290_000_000_000 },
  { symbol: 'NFLX', name: 'Netflix', marketCap: 280_000_000_000 },
  { symbol: 'CRM', name: 'Salesforce', marketCap: 275_000_000_000 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', marketCap: 270_000_000_000 },
  { symbol: 'MRK', name: 'Merck', marketCap: 265_000_000_000 },
  { symbol: 'PEP', name: 'PepsiCo', marketCap: 255_000_000_000 },
  { symbol: 'ADBE', name: 'Adobe', marketCap: 250_000_000_000 },
  { symbol: 'TM', name: 'Toyota Motor', marketCap: 245_000_000_000 },
  { symbol: 'ASML', name: 'ASML Holding', marketCap: 240_000_000_000 },
  { symbol: 'LIN', name: 'Linde', marketCap: 225_000_000_000 },
  { symbol: 'TMO', name: 'Thermo Fisher', marketCap: 220_000_000_000 },
  { symbol: 'ACN', name: 'Accenture', marketCap: 215_000_000_000 },
  { symbol: 'CSCO', name: 'Cisco Systems', marketCap: 210_000_000_000 },
  { symbol: 'BABA', name: 'Alibaba', marketCap: 205_000_000_000 },
  { symbol: 'MCD', name: "McDonald's", marketCap: 200_000_000_000 },
  { symbol: 'SHEL', name: 'Shell', marketCap: 200_000_000_000 },
  { symbol: 'AZN', name: 'AstraZeneca', marketCap: 195_000_000_000 },
  { symbol: 'ABT', name: 'Abbott Laboratories', marketCap: 190_000_000_000 },
  { symbol: 'DIS', name: 'Walt Disney', marketCap: 185_000_000_000 },
  { symbol: 'NVS', name: 'Novartis', marketCap: 180_000_000_000 },
  { symbol: 'WFC', name: 'Wells Fargo', marketCap: 175_000_000_000 },
  { symbol: 'VZ', name: 'Verizon', marketCap: 170_000_000_000 },
  { symbol: 'QCOM', name: 'Qualcomm', marketCap: 165_000_000_000 },
  { symbol: 'IBM', name: 'IBM', marketCap: 160_000_000_000 },
  { symbol: 'INTU', name: 'Intuit', marketCap: 155_000_000_000 },
];
