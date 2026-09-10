import { useEffect, useState } from "react";
import QuoteCard from "./components/QuoteCard";
import quotes from "./data/quotes";
import { FaCheckCircle } from "react-icons/fa";
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

  // Categories
  const categories = [
    "All",
    "Motivation",
    "Success",
    "Life",
    "Work",
    "Dreams",
    "❤️ Favorites"
  ];

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(
      "favoriteQuotes",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  // Modern notification
  const showNotification = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 2500);
  };

  // Get quotes based on selected category
  const getFilteredQuotes = () => {
    // Favorites category
    if (selectedCategory === "❤️ Favorites") {
      return favorites;
    }

    // All quotes
    if (selectedCategory === "All") {
      return quotes;
    }

    // Normal categories
    return quotes.filter(
      (quote) => quote.category === selectedCategory
    );
  };

  // Generate random quote
  const getRandomQuote = () => {
    const filteredQuotes = getFilteredQuotes();

    // No favorites available
    if (filteredQuotes.length === 0) {
      showNotification("No favorite quotes yet ❤️");
      return;
    }

    const randomIndex = Math.floor(
      Math.random() * filteredQuotes.length
    );

    setCurrentQuote(filteredQuotes[randomIndex]);
  };

  // Change category
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    let filteredQuotes;

    // Favorites
    if (category === "❤️ Favorites") {
      filteredQuotes = favorites;
    }

    // All
    else if (category === "All") {
      filteredQuotes = quotes;
    }

    // Other categories
    else {
      filteredQuotes = quotes.filter(
        (quote) => quote.category === category
      );
    }

    // No favorites
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
    const textToCopy =
      `"${currentQuote.text}" — ${currentQuote.author}`;

    try {
      await navigator.clipboard.writeText(textToCopy);

      showNotification(
        "Quote copied successfully!"
      );
    } catch (error) {
      showNotification(
        "Unable to copy quote."
      );
    }
  };

  // Add / Remove favorite
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

      /*
        If we are currently viewing Favorites
        and remove the current quote, automatically
        show another favorite.
      */
      if (selectedCategory === "❤️ Favorites") {
        const remainingFavorites =
          favorites.filter(
            (quote) => quote.id !== currentQuote.id
          );

        if (remainingFavorites.length > 0) {
          const randomIndex = Math.floor(
            Math.random() *
              remainingFavorites.length
          );

          setCurrentQuote(
            remainingFavorites[randomIndex]
          );
        }
      }
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

  // Check if current quote is favorite
  const isFavorite = favorites.some(
    (quote) => quote.id === currentQuote.id
  );

  return (
    <div className="app">

      {/* =================================
          TOAST NOTIFICATION
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
          CATEGORY SECTION
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
          QUOTE SECTION
      ================================= */}

      <main>

        {selectedCategory === "❤️ Favorites" &&
        favorites.length === 0 ? (

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

          <QuoteCard
            quote={currentQuote}
            onNewQuote={getRandomQuote}
            onCopy={copyQuote}
            onFavorite={toggleFavorite}
            onShare={shareQuote}
            isFavorite={isFavorite}
          />

        )}

      </main>


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
          Random Quote Generator • Made with React.js
        </p>

      </footer>

    </div>
  );
}

export default App;