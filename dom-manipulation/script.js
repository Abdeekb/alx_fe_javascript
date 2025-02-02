document.addEventListener('DOMContentLoaded', function() {
    // Array of initial quotes
    let quotes = [
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "Success is not final, failure is not fatal.", category: "Success" },
        { text: "The only way to do great work is to love what you do.", category: "Work" }
    ];

    // Function to show random quote
    function showRandomQuote() {
        const quoteDisplay = document.getElementById('quoteDisplay');
        if (quotes.length === 0) {
            quoteDisplay.textContent = "No quotes available";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        
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
});