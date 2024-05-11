type ContentAreaProps = {
  itemList: Product[],
  addToBasket: (product: Product) => void,
  shoppingBasket: BasketItem[],
}

type Product = {
  id: number
  name: string
  price: number
  category: string
  quantity: number
  rating: number
  image_link: string
}

type BasketItem = {
  id: number
  name: string
  price: number
  quantity: number
}

export const ProductList = (props: ContentAreaProps) => {
  return (
    <div id="productList">
      {props.itemList.map((item) => {
        const basketItem = props.shoppingBasket.find(basketItem => basketItem.id === item.id);
        const isOutOfStock = item.quantity === 0;
        const isMaxInBasket = basketItem ? basketItem.quantity >= item.quantity : false;

        return (
          <div key={item.id} className="product">
            <div className="product-top-bar">
              <h2>{item.name}</h2>
              <p> £{item.price.toFixed(2)} ({item.rating}/5)</p>
            </div>
            <img src={"./src/Assets/Product_Images/" + item.image_link} alt={item.name} />
            <button
              value={item.id}
              disabled={isOutOfStock || isMaxInBasket}
              onClick={() => props.addToBasket(item)}
            >
              {isOutOfStock ? "Out of stock" : isMaxInBasket ? "Max quantity reached" : "Add to basket"}
            </button>
          </div>
        )
      })}
    </div>
  )
}
