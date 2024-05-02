import { useState, useEffect } from 'react'
import { ProductList } from './Components/ProductList'
import itemList from './Assets/random_products_175.json';
import './e-commerce-stylesheet.css'

type Product = {
  id: number
	name: string
  price: number
  category: string
  quantity: number
  rating: number
  image_link: string
}

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchedProducts, setSearchedProducts] = useState<Product[]>(itemList);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // ===== Hooks =====
  useEffect(() => updateSearchedProducts(), [searchTerm, inStockOnly]);

  // ===== Basket management =====
  function showBasket(){
    let areaObject = document.getElementById('shopping-area');
    if(areaObject !== null){
      areaObject.style.display='block';
    }
  }

  function hideBasket(){
    let areaObject = document.getElementById('shopping-area');
    if(areaObject !== null){
      areaObject.style.display='none';
    }
  }

  // ===== Search =====
  function updateSearchedProducts() {
    let filteredItems = itemList.filter((product: Product) => {
      return product.name.toLowerCase().includes(searchTerm.toLowerCase()) && (!inStockOnly || product.quantity > 0);
    });
    setSearchedProducts(filteredItems);
  }

  // ===== Sort =====
  function sortItems(sortBy: string) {
    const sortedProducts = [...searchedProducts];
  
    sortedProducts.sort((a, b) => {
      switch (sortBy) {
        case "AtoZ":
          return a.name.localeCompare(b.name);
        case "ZtoA":
          return b.name.localeCompare(a.name);
        case "£LtoH":
          return a.price - b.price;
        case "£HtoL":
          return b.price - a.price;
        case "*LtoH":
          return a.rating - b.rating;
        case "*HtoL":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  
    setSearchedProducts(sortedProducts);
  }  
 

  return (
    <div id="container"> 
      <div id="logo-bar">
        <div id="logo-area">
          <img src="./src/assets/logo.png"></img>
        </div>
        <div id="shopping-icon-area">
          <img id="shopping-icon" onClick={showBasket} src="./src/assets/shopping-basket.png"></img>
        </div>
        <div id="shopping-area">
          <div id="exit-area">
            <p id="exit-icon" onClick={hideBasket}>x</p>
          </div>
          <p>Your basket is empty</p>
        </div>
      </div>
      <div id="search-bar">
        <input type="text" placeholder="Search..." onChange={changeEventObject => setSearchTerm(changeEventObject.target.value)}></input>
        <div id="control-area">
          <select id="sort-select" onChange={e => sortItems(e.target.value)}>
            <option value="AtoZ">By name (A - Z)</option>
            <option value="ZtoA">By name (Z - A)</option>
            <option value="£LtoH">By price (low - high)</option>
            <option value="£HtoL">By price (high - low)</option>
            <option value="*LtoH">By rating (low - high)</option>
            <option value="*HtoL">By rating (high - low)</option>
          </select>
          <input id="inStock" type="checkbox" checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)}></input>
          <label htmlFor="inStock">In stock</label>
        </div>
      </div>
      <p id="results-indicator">{searchedProducts.length} products available</p>
      <ProductList itemList={searchedProducts}/>
    </div>
  )
}

export default App
