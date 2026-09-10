import { useEffect, useState } from "react";
import QuoteCard from "./components/QuoteCard";
import quotes from "./data/quotes";
import { FaCheckCircle } from "react-icons/fa";
import "./App.css";

function App() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites =
      localStorage.getItem("favoriteQuotes");

    return savedFavorites
      ? JSON.parse(savedFavorites)
      : [];
  });

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  // Toast notification
  const [notification, setNotification] = useState("");

  const categories = [
    "All",
    "Motivation",
    "Success",
    "Life",
    "Work",
    "Dreams"
  ];

  // Save favorites
  useEffect(() => {
    localStorage.setItem(
      "favoriteQuotes",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  // Show modern notification
  const showNotification = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 2500);
  };

  // Get filtered quotes
  const getFilteredQuotes = () => {
    if (selectedCategory === "All") {
      return quotes;
    }

    return quotes.filter(
      (quote) => quote.category === selectedCategory
    );
  };

  // Generate random quote
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

      showNotification("Quote copied successfully!");
    } catch (error) {
      showNotification("Unable to copy quote.");
    }
  };

  // Favorite quote
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

      showNotification("Removed from favorites");
    } else {
      setFavorites([
        ...favorites,
        currentQuote
      ]);

      showNotification("Added to favorites ❤️");
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

        showNotification(
          "Quote copied! Ready to share."
        );
      }
    } catch (error) {
      console.log("Share cancelled.");
    }
  };

  // Check favorite
  const isFavorite = favorites.some(
    (quote) => quote.id === currentQuote.id
  );

  return (
    <div className="app">

      {/* Modern Notification */}
      {notification && (
        <div className="toast-notification">
          <FaCheckCircle className="toast-icon" />

          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <header className="header">
        <h1>Random Quote Generator</h1>

        <p>
          Get inspired with a new quote every time.
        </p>
      </header>

      {/* Categories */}
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

      {/* Quote */}
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

      {/* Modern Footer */}
      <footer>
        <p className="footer-message">
          <span>✨</span>
          Find inspiration. Share positivity. Keep moving forward.
        </p>

      </footer>

    </div>
  );
}

export default App;