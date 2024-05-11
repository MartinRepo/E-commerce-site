import { useState, useEffect } from 'react';
import { ProductList } from './Components/ProductList';
import itemList from './Assets/random_products_175.json';
import './e-commerce-stylesheet.css';

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
  rating: number;
  image_link: string;
};

type BasketItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

const sortedItemList = [...itemList].sort((a, b) => a.name.localeCompare(b.name));

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchedProducts, setSearchedProducts] = useState<Product[]>(sortedItemList);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('AtoZ');
  const [shoppingBasket, setShoppingBasket] = useState<BasketItem[]>([]);

  useEffect(() => {
    updateSearchedProducts();
  }, [searchTerm, inStockOnly, sortBy]);

  function showBasket() {
    let areaObject = document.getElementById('shopping-area');
    if (areaObject !== null) {
      areaObject.style.display = 'block';
    }
  }

  function hideBasket() {
    let areaObject = document.getElementById('shopping-area');
    if (areaObject !== null) {
      areaObject.style.display = 'none';
    }
  }

  function updateSearchedProducts() {
    let filteredItems = itemList.filter((product: Product) => {
      return (
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!inStockOnly || product.quantity > 0)
      );
    });

    const sortedFilteredItems = filteredItems.sort((a, b) => {
      switch (sortBy) {
        case 'AtoZ':
          return a.name.localeCompare(b.name);
        case 'ZtoA':
          return b.name.localeCompare(a.name);
        case '£LtoH':
          return a.price - b.price;
        case '£HtoL':
          return b.price - a.price;
        case '*LtoH':
          return a.rating - b.rating;
        case '*HtoL':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setSearchedProducts(sortedFilteredItems);
  }

  function sortItems(sortBy: string) {
    setSortBy(sortBy);
    updateSearchedProducts();
  }

  function addToBasket(product: Product) {
    setShoppingBasket(prevBasket => {
      const existingItem = prevBasket.find(item => item.id === product.id);

      if (existingItem) {
        if (existingItem.quantity < product.quantity) {
          return prevBasket.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          return prevBasket;
        }
      } else {
        return product.quantity > 0 ? [...prevBasket, { id: product.id, name: product.name, price: product.price, quantity: 1 }] : prevBasket;
      }
    });
  }

  function removeFromBasket(productId: number) {
    setShoppingBasket(prevBasket => {
      const existingItem = prevBasket.find(item => item.id === productId);

      if (existingItem) {
        if (existingItem.quantity > 1) {
          return prevBasket.map(item =>
            item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
          );
        } else {
          return prevBasket.filter(item => item.id !== productId);
        }
      }
      return prevBasket;
    });
  }

  const totalCost = shoppingBasket.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  return (
    <div id="container">
      <div id="logo-bar">
        <div id="logo-area">
          <img src="./src/assets/logo.png" alt="Logo" />
        </div>
        <div id="shopping-icon-area">
          <img id="shopping-icon" onClick={showBasket} src="./src/assets/shopping-basket.png" alt="Shopping Basket" />
        </div>
        <div id="shopping-area">
          <div id="exit-area">
            <p id="exit-icon" onClick={hideBasket}>x</p>
          </div>
          {shoppingBasket.length === 0 ? (
            <p>Your basket is empty</p>
          ) : (
            <>
              {shoppingBasket.map(item => (
                <div key={item.id} className="shopping-row">
                  <div className="shopping-information">
                    <p>
                      {item.name} (£{item.price.toFixed(2)}) - {item.quantity}
                      <button onClick={() => removeFromBasket(item.id)}>Remove</button>
                    </p>
                  </div>
                </div>
              ))}
              <p>Total: £{totalCost}</p>
            </>
          )}
        </div>
      </div>
      <div id="search-bar">
        <input type="text" placeholder="Search..." onChange={e => setSearchTerm(e.target.value)} />
        <div id="control-area">
          <select id="sort-select" onChange={e => sortItems(e.target.value)}>
            <option value="AtoZ">By name (A - Z)</option>
            <option value="ZtoA">By name (Z - A)</option>
            <option value="£LtoH">By price (low - high)</option>
            <option value="£HtoL">By price (high - low)</option>
            <option value="*LtoH">By rating (low - high)</option>
            <option value="*HtoL">By rating (high - low)</option>
          </select>
          <input id="inStock" type="checkbox" checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)} />
          <label htmlFor="inStock">In stock</label>
        </div>
      </div>
      {searchedProducts.length > 0 ? <p id="results-indicator">{searchedProducts.length} products</p> : <p id="results-indicator">No search results</p>}
      <ProductList itemList={searchedProducts} addToBasket={addToBasket} shoppingBasket={shoppingBasket} />
    </div>
  );
}

export default App;
