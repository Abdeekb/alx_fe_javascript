document.addEventListener('DOMContentLoaded', function() {
    // Simulate server API URL
    const serverUrl = 'https://jsonplaceholder.typicode.com/posts'; // Mock server for simulation

    // Function to load quotes from localStorage
    function loadQuotesFromStorage() {
        const storedQuotes = localStorage.getItem('quotes');
        return storedQuotes ? JSON.parse(storedQuotes) : []; // Return empty array if no quotes are found
    }

    // Function to save quotes to localStorage
    function saveQuotesToStorage() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    // Function to fetch quotes from the server (simulated)
    function fetchQuotesFromServer() {
        return fetch(serverUrl)
            .then(response => response.json())
            .then(data => data.map(item => ({
                text: item.title, // Use title as text for simulation
                category: item.body.slice(0, 20) // Use body start as category for simulation
            })))
            .catch(error => console.error('Error fetching data from server:', error));
    }

    // Function to sync local data with server
    function syncDataWithServer() {
        fetchQuotesFromServer().then(serverQuotes => {
            const localQuotes = loadQuotesFromStorage();

            // Compare server data with local data, resolve conflicts by taking server data as priority
            const mergedQuotes = [...serverQuotes, ...localQuotes.filter(localQuote => {
                // If the quote is not in the server data, keep it
                return !serverQuotes.some(serverQuote => serverQuote.text === localQuote.text);
            })];

            // Save merged quotes to localStorage
            saveQuotesToStorage();
            alert("Data synced with server!");

            // Update display with the most recent quote data
            showRandomQuote();
        });
    }

    // Function to periodically sync data every 10 seconds
    setInterval(syncDataWithServer, 10000); // Sync every 10 seconds

    // Function to show random quote
    function showRandomQuote() {
        const quoteDisplay = document.getElementById('quoteDisplay');
        const quotes = loadQuotesFromStorage();

        if (quotes.length === 0) {
            quoteDisplay.textContent = "No quotes available";
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p>${quote.text}</p><small>Category: ${quote.category}</small>`;
    }

    // Function to add new quote
    window.addQuote = function() {
        const textInput = document.getElementById('newQuoteText');
        const categoryInput = document.getElementById('newQuoteCategory');
        const newQuote = {
            text: textInput.value.trim(),
            category: categoryInput.value.trim()
        };

        if (newQuote.text && newQuote.category) {
            const quotes = loadQuotesFromStorage();
            quotes.push(newQuote);
            saveQuotesToStorage();
            textInput.value = '';
            categoryInput.value = '';
            alert('Quote added successfully!');
            showRandomQuote(); // Show updated quotes
        } else {
            alert('Please fill in both fields!');
        }
    };

    // Function to export quotes to JSON
    function exportQuotesToJson() {
        const quotes = loadQuotesFromStorage();
        const json = JSON.stringify(quotes, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'quotes.json';
        link.click();
        URL.revokeObjectURL(url);
    }

    // Function to import quotes from JSON
    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            const quotes = loadQuotesFromStorage();
            quotes.push(...importedQuotes);
            saveQuotesToStorage();
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

    // Function to create export and import buttons
    function createExportImportButtons() {
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export Quotes to JSON';
        exportButton.onclick = exportQuotesToJson;

        const importButton = document.createElement('input');
        importButton.type = 'file';
        importButton.accept = '.json';
        importButton.onchange = importFromJsonFile;

        document.body.appendChild(exportButton);
        document.body.appendChild(importButton);
    }

    // Create export/import buttons
    createExportImportButtons();

    // Show the initial quote when the page loads
    showRandomQuote();
});
