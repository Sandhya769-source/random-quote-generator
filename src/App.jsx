import { useEffect, useState } from "react";
import QuoteCard from "./components/QuoteCard";
import quotes from "./data/quotes";

import {
  FaCheckCircle,
  FaCopy,
  FaShareAlt,
  FaHeart,
  FaTrash
} from "react-icons/fa";

import "./App.css";

function App() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  // Load favorites from localStorage
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
    "Dreams",
    "❤️ Favorites"
  ];

  // Save favorites
  useEffect(() => {
    localStorage.setItem(
      "favoriteQuotes",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  // Show notification
  const showNotification = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 2500);
  };

  // Get filtered quotes
  const getFilteredQuotes = () => {
    if (selectedCategory === "❤️ Favorites") {
      return favorites;
    }

    if (selectedCategory === "All") {
      return quotes;
    }

    return quotes.filter(
      (quote) => quote.category === selectedCategory
    );
  };

  // New random quote
  const getRandomQuote = () => {
    const filteredQuotes = getFilteredQuotes();

    if (filteredQuotes.length === 0) {
      showNotification("No favorite quotes yet ❤️");
      return;
    }

    const randomIndex = Math.floor(
      Math.random() * filteredQuotes.length
    );

    setCurrentQuote(filteredQuotes[randomIndex]);
  };

  // Category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    let filteredQuotes;

    if (category === "❤️ Favorites") {
      filteredQuotes = favorites;
    } else if (category === "All") {
      filteredQuotes = quotes;
    } else {
      filteredQuotes = quotes.filter(
        (quote) => quote.category === category
      );
    }

    if (filteredQuotes.length === 0) {
      if (category === "❤️ Favorites") {
        showNotification(
          "No favorite quotes yet ❤️"
        );
      }

      return;
    }

    const randomIndex = Math.floor(
      Math.random() * filteredQuotes.length
    );

    setCurrentQuote(filteredQuotes[randomIndex]);
  };

  // Copy quote
  const copyQuote = async () => {
    const text =
      `"${currentQuote.text}" — ${currentQuote.author}`;

    try {
      await navigator.clipboard.writeText(text);

      showNotification(
        "Quote copied successfully!"
      );
    } catch (error) {
      showNotification(
        "Unable to copy quote."
      );
    }
  };

  // Add / remove favorite
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

      showNotification(
        "Removed from favorites"
      );
    } else {
      setFavorites([
        ...favorites,
        currentQuote
      ]);

      showNotification(
        "Added to favorites ❤️"
      );
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

  // Copy a favorite
  const copyFavorite = async (quote) => {
    const text =
      `"${quote.text}" — ${quote.author}`;

    try {
      await navigator.clipboard.writeText(text);

      showNotification(
        "Quote copied successfully!"
      );
    } catch (error) {
      showNotification(
        "Unable to copy quote."
      );
    }
  };

  // Share a favorite
  const shareFavorite = async (quote) => {
    const text =
      `"${quote.text}" — ${quote.author}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Favorite Quote",
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

  // Remove favorite directly from grid
  const removeFavorite = (id) => {
    setFavorites(
      favorites.filter(
        (quote) => quote.id !== id
      )
    );

    showNotification(
      "Removed from favorites"
    );
  };

  // Check current quote
  const isFavorite = favorites.some(
    (quote) => quote.id === currentQuote.id
  );

  return (
    <div className="app">

      {/* =================================
          TOAST
      ================================= */}

      {notification && (
        <div className="toast-notification">
          <FaCheckCircle className="toast-icon" />

          <span>{notification}</span>
        </div>
      )}


      {/* =================================
          HEADER
      ================================= */}

      <header className="header">

        <h1>
          Random Quote Generator
        </h1>

        <p>
          Get inspired with a new quote every time.
        </p>

      </header>


      {/* =================================
          CATEGORIES
      ================================= */}

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


      {/* =================================
          FAVORITES GRID
      ================================= */}

      {selectedCategory === "❤️ Favorites" ? (

        <main className="favorites-section">

          {favorites.length === 0 ? (

            /* Empty Favorites */

            <div className="empty-favorites">

              <div className="empty-heart">
                ❤️
              </div>

              <h2>
                No Favorite Quotes Yet
              </h2>

              <p>
                Click the ❤️ Favorite button on
                a quote to save it here.
              </p>

              <button
                className="browse-quotes-button"
                onClick={() =>
                  handleCategoryChange("All")
                }
              >
                ✨ Explore Quotes
              </button>

            </div>

          ) : (

            <>

              <div className="favorites-heading">

                <div className="favorites-title-icon">
                  <FaHeart />
                </div>

                <div>
                  <h2>
                    My Favorite Quotes
                  </h2>

                  <p>
                    {favorites.length}{" "}
                    {favorites.length === 1
                      ? "quote"
                      : "quotes"}{" "}
                    saved
                  </p>
                </div>

              </div>


              <div className="favorites-grid">

                {favorites.map((quote) => (

                  <div
                    className="favorite-card"
                    key={quote.id}
                  >

                    {/* Quote Icon */}

                    <div className="favorite-quote-mark">
                      “
                    </div>


                    {/* Quote Text */}

                    <p className="favorite-quote-text">
                      {quote.text}
                    </p>


                    {/* Author */}

                    <p className="favorite-author">
                      — {quote.author}
                    </p>


                    {/* Category */}

                    <span className="favorite-category">
                      {quote.category}
                    </span>


                    {/* Actions */}

                    <div className="favorite-actions">

                      <button
                        onClick={() =>
                          copyFavorite(quote)
                        }
                        title="Copy quote"
                      >
                        <FaCopy />
                        Copy
                      </button>


                      <button
                        onClick={() =>
                          shareFavorite(quote)
                        }
                        title="Share quote"
                      >
                        <FaShareAlt />
                        Share
                      </button>


                      <button
                        className="remove-favorite"
                        onClick={() =>
                          removeFavorite(quote.id)
                        }
                        title="Remove favorite"
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </>

          )}

        </main>

      ) : (

        /* =================================
           NORMAL QUOTE
        ================================= */

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

      )}


      {/* =================================
          FOOTER
      ================================= */}

      <footer>

        <p className="footer-message">
          <span>✨</span>
          Find inspiration. Share positivity.
          Keep moving forward.
        </p>

        <p className="footer-copyright">
          Random Quote Generator •
        </p>

      </footer>

    </div>
  );
}

export default App;