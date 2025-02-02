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
        } else {
            alert('Please fill in both fields!');
        }
    };

    // Add event listener for new quote button
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);

    // Create the add quote form when page loads
    createAddQuoteForm();

    // Show initial quote
    showRandomQuote();

    // Function to export quotes to a JSON file
    function exportQuotesToJson() {
        const json = JSON.stringify(quotes, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'quotes.json';
        link.click();
        URL.revokeObjectURL(url);  // Clean up the object URL
    }

    // Function to import quotes from a JSON file
    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotesToStorage();  // Save updated quotes to localStorage
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

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
