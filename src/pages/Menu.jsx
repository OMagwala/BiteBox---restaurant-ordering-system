import { useState, useContext } from 'react'
import { CartContext } from '../context/CartContext'
import './Menu.css'

function Menu() {

  const [selectedCategory, setSelectedCategory] = useState("All");
  const { menuItems, isMenuLoading, menuError, addToCart} = useContext(CartContext);

  const availableItems = menuItems.filter((item) => item.isAvailable);

  const filteredItems = (selectedCategory === "All" ?
    availableItems :availableItems.filter((item) => item.category === selectedCategory));

  if (isMenuLoading) {
    return (
      <section className="menu">
        <h1>Loading menu...</h1>
      </section>
    );
  }
  
  if (menuError) {
    return (
      <section className="menu">
        <h1>{menuError}</h1>
      </section>
    );
  }
  
  return (
    <section className="menu">
      <h1>Our Menu</h1>

      <div className="category-filter">
        <button onClick={() => setSelectedCategory("All")}>All</button>
        <button onClick={() => setSelectedCategory("Burgers")}>Burgers</button>
        <button onClick={() => setSelectedCategory("Chicken")}>Chicken</button>
        <button onClick={() => setSelectedCategory("Pizza")}>Pizza</button>
        <button onClick={() => setSelectedCategory("Drinks")}>Drinks</button>
      </div>

      <div className="category-dropdown">
        <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
        >
            <option value="All">All</option>
            <option value="Burgers">Burgers</option>
            <option value="Chicken">Chicken</option>
            <option value="Pizza">Pizza</option>
            <option value="Drinks">Drinks</option>
        </select>
    </div>

      <div className="menu-grid">
        {filteredItems.map((item) => (
          <article className="menu-card" key={item._id}>
            {item.image ? (
                  <img src={item.image} alt={item.name} />
              ) : (
                  <div className="menu-image-placeholder">
                      No image available
                  </div>
              )}

            <div className="menu-card-content">
              <h2>{item.name}</h2>
              <p className='item-description'>{item.description}</p>
              <p className='item-price'>R{item.price.toFixed(2)}</p>

              <button className='cart-btn' onClick={() => addToCart(item)}>Add to Cart</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Menu;
