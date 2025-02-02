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
        const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
        
        // Filter quotes based on selected category
        const filteredQuotes = quotes.filter(quote => 
            selectedCategory === 'all' || quote.category === selectedCategory
        );

        if (filteredQuotes.length === 0) {
            quoteDisplay.textContent = "No quotes available";
            return;
        }

        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];
        
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
            updateCategoryFilter();  // Update category filter
            textInput.value = '';
            categoryInput.value = '';
            alert('Quote added successfully!');
        } else {
            alert('Please fill in both fields!');
        }
    };

    // Function to populate categories dynamically
    function populateCategories() {
        const categories = Array.from(new Set(quotes.map(quote => quote.category)));
        const categoryFilter = document.getElementById('categoryFilter');

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    // Function to create category filter
    function createCategoryFilter() {
        const categoryFilter = document.createElement('select');
        categoryFilter.id = 'categoryFilter';
        categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
        
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = categoryFilter.value;
            localStorage.setItem('selectedCategory', selectedCategory); // Save selected category
            showRandomQuote(); // Update the displayed quote based on selected category
        });

        document.body.appendChild(categoryFilter);
        populateCategories();  // Populate categories when filter is created
    }

    // Function to update the category filter with the latest categories
    function updateCategoryFilter() {
        const categoryFilter = document.getElementById('categoryFilter');
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        populateCategories();  // Update the categories dynamically
    }

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
            updateCategoryFilter();  // Update category filter
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

    // Create category filter, add quote form, and export/import buttons
    createCategoryFilter();
    createAddQuoteForm();
    createExportImportButtons();

    // Show initial quote
    showRandomQuote();
});
