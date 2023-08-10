import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { listProducts } from '../actions/productActions';
import BarMenu from "../components/BarMenu";

function HomeScreen(props) {

  const productList = useSelector(state => state.productList);
  const { products, loading, error } = productList;
  const [jewleryClass, setJewleryClass] = useState('');
  const [category, setCategory] = useState('');
  const [filterText, setFilterText] = useState('');
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listProducts(jewleryClass, category));
    if (jewleryClass || category) {
      setFilterText(jewleryClass + " " + category);
    } else {
      setFilterText("All Products");
    }
    return () => {
      // 
    }
  }, [jewleryClass, category]);

  const handleCategChange = (categ) => {
    setCategory(categ === "All" ? "": categ);
  };

  const clearFilter = () => {
    setJewleryClass('');
    setCategory('');
  }

  return loading ? <div>Loading...</div> :
    error ? <div>{error}</div> :
      <div className="homescreen-container" >
        <BarMenu handleCategChange={handleCategChange} />
        <div className="project-description">
        Merging Elegance and Sustainability:
        Transforming Recycled Materials into Timeless Jewelry
      </div>
        <div className="filter">
          <ul className="list-unstyled list-inline row">
            <li className="col-2 col-4-sm text-center">
              <div>
                <button className="btn-filter" onClick={() => setJewleryClass("Necklace")}>
                  <img className="filter-jewlery" src="/imgs/necklace.jpg" alt="Necklace" />
                </button>
              </div>
              <p className="filter-name">Necklaces</p>
            </li>
            <li className="col-2 col-4-sm text-center">
              <div>
                <button className="btn-filter" onClick={() => setJewleryClass("Bracelet")}>
                  <img className="filter-jewlery" src="/imgs/bracelet.jpg" alt="Bracelet" />
                </button>
              </div>
              <p className="filter-name">Bracelets</p>
            </li>
            <li className="col-2 col-4-sm text-center">
              <div>
                <button className="btn-filter" onClick={() => setJewleryClass("Ring")}>
                  <img className="filter-jewlery" src="/imgs/ring.jpg" alt="Ring" />
                </button>
              </div>
              <p className="filter-name">Rings</p>
            </li>
            <li className="col-2 col-4-sm text-center">
              <div>
                <button className="btn-filter" onClick={() => setJewleryClass("Earrings")}>
                  <img className="filter-jewlery" src="/imgs/earring.jpg" alt="Earrings" />
                </button>
              </div>
              <p className="filter-name">Earrings</p>
            </li>
            <li className="col-2 col-4-sm text-center">
              <div>
                <button className="btn-filter" onClick={() => setJewleryClass("Body")}>
                  <img className="filter-jewlery" src="/imgs/body.jpg" alt="Body" />
                </button>
              </div>
              <p className="filter-name">Body jewelry</p>
            </li>
            <li className="col-2 col-4-sm text-center">
              <div>
                <button className="btn-filter" onClick={() => setJewleryClass("Watch")}>
                  <img className="filter-jewlery" src="/imgs/watch.jpg" alt="Watch" />
                </button>
              </div>
              <p className="filter-name">Watches</p>
            </li>
            <li className="col-2 col-4-sm text-center">
              <div>
                <button className="btn-all-filter button-prm" onClick={() => clearFilter()}>
                  Show all
              </button>
              </div>
            </li>
          </ul>
        </div>
        <h1 style={{textAlign: "center"}}>{filterText}</h1>
        <div className="product-container">
          <ul className="products">
            {
              products.map((product) =>
                <li key={product._id}>
                  <div className="product">
                    <Link to={"/product/" + product._id}>
                      <img className="product-image" src={product.image} alt="product_image" />
                    </Link>
                    <div className="product-name">
                      <Link to={"/product/" + product._id}>
                        {product.name}</Link>
                    </div>
                    <div className="product-designer">{product.designer}</div>
                    <div className="product-price">${product.price}</div>
                    <div className="product-rating">{product.rating} Stars ({product.numReviews})</div>
                  </div>
                </li>
              )
            }
          </ul>
        </div>
      </div>
}

export default HomeScreen;