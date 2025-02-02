document.addEventListener('DOMContentLoaded', function() {
    // Function to load quotes from localStorage
    function loadQuotesFromStorage() {
        const storedQuotes = localStorage.getItem('quotes');
        return storedQuotes ? JSON.parse(storedQuotes) : [];  // Return empty array if no quotes are found
    }

    // Function to save quotes to localStorage
    function saveQuotesToStorage() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    // Array of quotes loaded from localStorage
    let quotes = loadQuotesFromStorage();

    // Show the last viewed quote on page load (if any)
    function showQuote(quote) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `<p>${quote.text}</p><small>Category: ${quote.category}</small>`;
    }

    // Fetch quotes from a mock server
    function fetchQuotesFromServer() {
        fetch('https://jsonplaceholder.typicode.com/posts')  // Example: Replace with real server endpoint
            .then(response => response.json())
            .then(serverQuotes => {
                // Example: Conflict Resolution - if the quote ID exists locally, we consider the server's version.
                serverQuotes.forEach(serverQuote => {
                    const localQuoteIndex = quotes.findIndex(q => q.id === serverQuote.id);
                    if (localQuoteIndex !== -1) {
                        // Assume server data should be preferred in case of conflict
                        quotes[localQuoteIndex] = serverQuote;
                    } else {
                        quotes.push(serverQuote); // New quote from server
                    }
                });

                // Save to localStorage after fetching
                saveQuotesToStorage();
                alert('Quotes synchronized with the server!');
                showRandomQuote();  // Optionally display a random quote
            });
    }

    // Sync quotes with the server every 10 seconds (for demonstration)
    setInterval(fetchQuotesFromServer, 10000);

    // Function to show random quote
    function showRandomQuote() {
        const quoteDisplay = document.getElementById('quoteDisplay');
        if (quotes.length === 0) {
            quoteDisplay.textContent = "No quotes available";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        showQuote(quote);
    }

    // Event listener to fetch quotes manually from the server
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);

    // Function to add new quote
    window.addQuote = function() {
        const textInput = document.getElementById('newQuoteText');
        const categoryInput = document.getElementById('newQuoteCategory');
        
        const newQuote = {
            text: textInput.value.trim(),
            category: categoryInput.value.trim(),
            id: Date.now() // Simulating an ID
        };
        
        if (newQuote.text && newQuote.category) {
            quotes.push(newQuote);
            saveQuotesToStorage();  // Save updated quotes to localStorage
            textInput.value = '';
            categoryInput.value = '';
            alert('Quote added successfully!');
        } else {
            alert('Please fill in both fields!');
        }
    };

    // Initial quote display
    showRandomQuote();

    // Manually trigger synchronization with the server
    document.getElementById('syncWithServer').addEventListener('click', fetchQuotesFromServer);
});
