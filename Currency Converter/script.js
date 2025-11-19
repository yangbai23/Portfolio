//  API key and endpoint
const API_KEY = 'fca_live_do9rv0GaDfN6oiQ7JRRidF9pNTh6CxKU76kXW1rD';
const API_URL = 'https://api.freecurrencyapi.com/v1/latest';

// Popular currencies to show first in dropdown
const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'];

// All available currencies from the API
const allCurrencies = [
    "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR", 
    "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AZN",
    "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB",
    "BRL", "BSD", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP",
    "CNY", "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP",
    "DZD", "EGP", "ERN", "ETB", "FJD", "FKP", "FOK", "GBP", "GEL",
    "GGP", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL",
    "HRK", "HTG", "HUF", "IDR", "ILS", "IMP", "INR", "IQD", "IRR",
    "ISK", "JEP", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KID",
    "KMF", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD",
    "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP",
    "MRU", "MUR", "MVR", "MWK", "MXN", "MYR", "MZN", "NAD", "NGN",
    "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP",
    "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR",
    "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD",
    "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP",
    "TRY", "TTD", "TVD", "TWD", "TZS", "UAH", "UGX", "UYU", "UZS",
    "VES", "VND", "VUV", "WST", "XAF", "XCD", "XDR", "XOF", "XPF",
    "YER", "ZAR", "ZMW", "ZWL"
];

// Convert currency
async function convert() {
    const amount = parseFloat(document.getElementById('amount').value);
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    
    if (!amount || amount <= 0) {
        document.getElementById('result').innerHTML = "Enter valid amount";
        return;
    }
    
    // If same currency, no conversion is needed
    if (from === to) {
        document.getElementById('result').innerHTML = `${amount.toFixed(2)} ${from}`;
        document.getElementById('rate').innerHTML = "Same currency - no conversion needed";
        return;
    }
    
    try {
        
        document.getElementById('result').innerHTML = "Loading...";
        document.getElementById('rate').innerHTML = "Getting live rates...";
        
        // Fetch from API
        const response = await fetch(`${API_URL}?apikey=${API_KEY}&base_currency=${from}`);
        const data = await response.json();
        
        if (!data.data || !data.data[to]) {
            throw new Error('Rate not available');
        }
        
        const rate = data.data[to];
        const result = (amount * rate).toFixed(2);
        
        document.getElementById('result').innerHTML = `${result} ${to}`;
        document.getElementById('rate').innerHTML = `1 ${from} = ${rate.toFixed(4)} ${to}`;
        
        // Update timestamp for the rates
        const now = new Date();
        document.getElementById('timestamp').textContent = `Updated: ${now.toLocaleTimeString()}`;
        
    } catch (error) {
        console.error('API Error:', error);
        document.getElementById('result').innerHTML = "Error loading rates";
        document.getElementById('rate').innerHTML = "Please try again later";
        document.getElementById('timestamp').textContent = "API unavailable";
    }
}

// Swap currencies
function swapCurrencies() {
    const from = document.getElementById('from');
    const to = document.getElementById('to');
    [from.value, to.value] = [to.value, from.value];
    convert();
}

// Populate dropdowns with all currencies
function populateDropdowns() {
    const fromSelect = document.getElementById('from');
    const toSelect = document.getElementById('to');
    
    // Clear existing options
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    
    // Add popular currencies first
    popularCurrencies.forEach(currency => {
        const optionFrom = new Option(currency, currency);
        const optionTo = new Option(currency, currency);
        
        fromSelect.add(optionFrom);
        toSelect.add(optionTo);
    });
    
    // Add separator
    const separator = new Option('──────────', '');
    separator.disabled = true;
    fromSelect.add(separator);
    toSelect.add(separator);
    
    // Add all other currencies alphabetically
    allCurrencies
        .filter(currency => !popularCurrencies.includes(currency))
        .sort()
        .forEach(currency => {
            const optionFrom = new Option(currency, currency);
            const optionTo = new Option(currency, currency);
            
            fromSelect.add(optionFrom);
            toSelect.add(optionTo);
        });
    
    // Set popular defaults
    fromSelect.value = 'USD';
    toSelect.value = 'EUR';
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    populateDropdowns();
    document.getElementById('amount').value = 1;
    
    // Add event listeners
    document.getElementById('amount').addEventListener('input', convert);
    document.getElementById('from').addEventListener('change', convert);
    document.getElementById('to').addEventListener('change', convert);
    document.getElementById('convert-btn').addEventListener('click', convert);
    document.getElementById('swap-btn').addEventListener('click', swapCurrencies);
    
    convert(); // Initial conversion
});