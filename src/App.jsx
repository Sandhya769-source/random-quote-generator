import { useEffect, useState } from "react";
import QuoteCard from "./components/QuoteCard";
import quotes from "./data/quotes";
import "./App.css";

function App() {
  // Current displayed quote
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  // Load favorites from localStorage
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favoriteQuotes");

    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Selected category
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Available categories
  const categories = [
    "All",
    "Motivation",
    "Success",
    "Life",
    "Work",
    "Dreams"
  ];

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem(
      "favoriteQuotes",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  // Get quotes based on selected category
  const getFilteredQuotes = () => {
    if (selectedCategory === "All") {
      return quotes;
    }

    return quotes.filter(
      (quote) => quote.category === selectedCategory
    );
  };

  // Generate a random quote
  const getRandomQuote = () => {
    const filteredQuotes = getFilteredQuotes();

    const randomIndex = Math.floor(
      Math.random() * filteredQuotes.length
    );

    setCurrentQuote(filteredQuotes[randomIndex]);
  };

  // Change category
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    const filteredQuotes =
      category === "All"
        ? quotes
        : quotes.filter(
            (quote) => quote.category === category
          );

    const randomIndex = Math.floor(
      Math.random() * filteredQuotes.length
    );

    setCurrentQuote(filteredQuotes[randomIndex]);
  };

  // Copy quote
  const copyQuote = async () => {
    const textToCopy =
      `"${currentQuote.text}" — ${currentQuote.author}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      alert("Quote copied!");
    } catch (error) {
      alert("Unable to copy the quote.");
    }
  };

  // Add or remove favorite
  const toggleFavorite = () => {
    const alreadyFavorite = favorites.some(
      (quote) => quote.id === currentQuote.id
    );

    if (alreadyFavorite) {
      setFavorites(
        favorites.filter(
          (quote) => quote.id !== currentQuote.id
        )
      );
    } else {
      setFavorites([
        ...favorites,
        currentQuote
      ]);
    }
  };

  // Share quote
  const shareQuote = async () => {
    const text =
      `"${currentQuote.text}" — ${currentQuote.author}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Random Quote",
          text: text
        });
      } else {
        await navigator.clipboard.writeText(text);

        alert(
          "Quote copied! You can share it anywhere."
        );
      }
    } catch (error) {
      // User cancelled the share dialog
      console.log("Share cancelled.");
    }
  };

  // Check whether current quote is already a favorite
  const isFavorite = favorites.some(
    (quote) => quote.id === currentQuote.id
  );

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <h1>Random Quote Generator</h1>

        <p>
          Get inspired with a new quote every time.
        </p>
      </header>

      {/* Category Section */}
      <div className="category-container">

        <p className="category-title">
          Choose a Category
        </p>

        <div className="category-buttons">

          {categories.map((category) => (
            <button
              key={category}
              className={
                selectedCategory === category
                  ? "category-button active"
                  : "category-button"
              }
              onClick={() =>
                handleCategoryChange(category)
              }
            >
              {category}
            </button>
          ))}

        </div>

      </div>

      {/* Quote Section */}
      <main>

        <QuoteCard
          quote={currentQuote}
          onNewQuote={getRandomQuote}
          onCopy={copyQuote}
          onFavorite={toggleFavorite}
          onShare={shareQuote}
          isFavorite={isFavorite}
        />

      </main>

      {/* Footer */}
      <footer>
        <p>
          Built with React.js ❤️
        </p>
      </footer>

    </div>
  );
}

export default App;