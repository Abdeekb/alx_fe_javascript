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

    // Function to save last viewed quote to sessionStorage
    function saveLastViewedQuoteToSessionStorage(quote) {
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
    }

    // Function to load last viewed quote from sessionStorage
    function loadLastViewedQuoteFromSessionStorage() {
        const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
        return lastViewedQuote ? JSON.parse(lastViewedQuote) : null;
    }

    // Array of quotes loaded from localStorage
    let quotes = loadQuotesFromStorage();

    // Show the last viewed quote on page load (if any)
    const lastViewedQuote = loadLastViewedQuoteFromSessionStorage();
    if (lastViewedQuote) {
        showQuote(lastViewedQuote);
    } else {
        showRandomQuote();
    }

    // Function to show random quote
    function showRandomQuote() {
        const quoteDisplay = document.getElementById('quoteDisplay');
        if (quotes.length === 0) {
            quoteDisplay.textContent = "No quotes available";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        
        // Save last viewed quote in sessionStorage
        saveLastViewedQuoteToSessionStorage(quote);

        // Clear previous content
        quoteDisplay.innerHTML = '';
        
        // Create and append quote text
        const quoteText = document.createElement('p');
        quoteText.textContent = quote.text;
        
        // Create and append category
        const quoteCategory = document.createElement('small');
        quoteCategory.textContent = `Category: ${quote.category}`;
        
        quoteDisplay.appendChild(quoteText);
        quoteDisplay.appendChild(quoteCategory);
    }

    // Function to create add quote form
    function createAddQuoteForm() {
        const form = document.createElement('div');
        form.innerHTML = `
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button onclick="addQuote()">Add Quote</button>
        `;
        document.body.appendChild(form);
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
            quotes.push(newQuote);
            saveQuotesToStorage();  // Save updated quotes to localStorage
            textInput.value = '';
            categoryInput.value = '';
            alert('Quote added successfully!');
            populateCategories();  // Update the category filter
        } else {
            alert('Please fill in both fields!');
        }
    };

    // Function to populate categories in the dropdown
    function populateCategories() {
        const categoryFilter = document.getElementById('categoryFilter');
        const categories = [...new Set(quotes.map(quote => quote.category))];  // Extract unique categories

        // Clear current options
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    // Function to filter quotes based on selected category
    window.filterQuotes = function() {
        const selectedCategory = document.getElementById('categoryFilter').value;
        const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
        
        // Show the filtered quotes
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = ''; // Clear current display

        if (filteredQuotes.length === 0) {
            quoteDisplay.textContent = "No quotes found for this category.";
        } else {
            filteredQuotes.forEach(quote => {
                const quoteText = document.createElement('p');
                quoteText.textContent = quote.text;
                const quoteCategory = document.createElement('small');
                quoteCategory.textContent = `Category: ${quote.category}`;
                quoteDisplay.appendChild(quoteText);
                quoteDisplay.appendChild(quoteCategory);
            });
        }

        // Save the last selected category in localStorage
        localStorage.setItem('lastSelectedCategory', selectedCategory);
    };

    // Load the last selected category on page load
    function loadLastSelectedCategory() {
        const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
        if (lastSelectedCategory) {
            const categoryFilter = document.getElementById('categoryFilter');
            categoryFilter.value = lastSelectedCategory;
            filterQuotes();  // Filter quotes based on the last selected category
        }
    }

    // Simulate fetching quotes from the server
    function fetchQuotesFromServer() {
        setTimeout(() => {
            const serverQuotes = [
                { text: "New quote from server!", category: "Motivation" },
                { text: "Server is always working for you.", category: "Technology" }
            ];

            // Update the local quotes array by combining with the server quotes (simulating conflict resolution)
            const newQuotes = [...quotes, ...serverQuotes];
            
            // Check for conflicts (if same quote exists, don't add it again)
            quotes = Array.from(new Set(newQuotes.map(a => a.text)))
                .map(text => newQuotes.find(a => a.text === text));

            // Save the updated quotes to localStorage
            saveQuotesToStorage();
            
            alert("Quotes synced with server.");
            console.log("Synced quotes: ", quotes);
        }, 2000);  // Simulating a 2-second delay (as if waiting for server response)
    }

    // Set up periodic fetching every 10 minutes (600000ms)
    setInterval(fetchQuotesFromServer, 600000);  // You can adjust the time interval as per need

    // Call functions to populate categories and load last selected category
    populateCategories();
    loadLastSelectedCategory();

    // Add event listener for new quote button
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);

    // Create the add quote form when page loads
    createAddQuoteForm();

    // Show initial quote
    showRandomQuote();

    // Create export and import buttons
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

    // Call the function to create the buttons
    createExportImportButtons();
});
