import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { saveProduct, deleteProdcut } from '../actions/productCRUD_Actions';
import { listProducts } from '../actions/productActions';
import { Discovery } from 'aws-sdk';
import PaginacionTabla from "../components/PaginacionTabla";
import BarMenu from "../components/BarMenu";

function ProductsCRUD_Screen(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [jewleryClass, setJewleryClass] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [designer, setdesigner] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const productList = useSelector((state) => state.productList);
  const { products, loading, error } = productList;

  const productSave = useSelector((state) => state.productSave);
  const { loading: loadingSave, success: successSave, error: errorSave } = productSave;
  const productDelete = useSelector((state) => state.productDelete);
  const { loading: loadingDelete, success: successDelete, error: errorDelete } = productDelete;
  const dispatch = useDispatch();

  useEffect(() => {
    if (successSave) {
      setModalVisible(false);
    }
    dispatch(listProducts());
    return () => {
      //
    };
  }, [successSave, successDelete]);

  const openModal = (product) => {
    setModalVisible(true);
    setId(product._id);
    setName(product.name);
    setJewleryClass(product.jewleryClass);
    setPrice(product.price);
    setDescription(product.description);
    setImage(product.image);
    setdesigner(product.designer);
    setCategory(product.category);
    setCountInStock(product.countInStock);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveProduct({
        _id: id,
        jewleryClass,
        name,
        price,
        image,
        designer,
        category,
        countInStock,
        description,
      })
    );
  };
  const deleteHandler = (product) => {
    dispatch(deleteProdcut(product._id));
  };
  const uploadFileHandler = (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    setUploading(true);
    axios
    .post('http://localhost:5000/api/classifyJewelry', bodyFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        },
        })
        .then((response) => {
          setJewleryClass(response.data.predicted_class);
          // setUploading(false);
        })
        .catch((err) => {
          console.log(err);
          // setUploading(false);
        });
    axios
      .post('/api/uploads', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setImage(response.data);
        setUploading(false);
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
      });
  };
  return (
    <div className="homescreen-container" >
      <BarMenu handleCategChange={() => props.history.push('/')}/>
      <div className="content content-margined">
        {modalVisible && (
          <div className="form">
            <form onSubmit={submitHandler}>
              <ul className="form-container">
                <li>
                  {<h2>Create Product</h2>}
                </li>
                <li>
                  {loadingSave && <div>Loading...</div>}
                  {errorSave && <div>{errorSave}</div>}
                </li>

                <li>
                  <label className="form-label" htmlFor="name">Jewelry type</label>
                  <input
                    className="form-input"
                    type="text"
                    name="jewleryClass"
                    value={jewleryClass || ''}
                    id="jewleryClass"
                    onChange={(e) => setJewleryClass(e.target.value)}
                  ></input>
                </li>
                <li>
                  <label className="form-label" htmlFor="name">Name</label>
                  <input
                    className="form-input"
                    type="text"
                    name="name"
                    value={name}
                    id="name"
                    onChange={(e) => setName(e.target.value)}
                  ></input>
                </li>
                <li>
                  <label className="form-label" htmlFor="price">Price</label>
                  <input
                    className="form-input"
                    type="text"
                    name="price"
                    value={price}
                    id="price"
                    onChange={(e) => setPrice(e.target.value)}
                  ></input>
                </li>
                <li>
                  <label className="form-label" htmlFor="image">Image</label>
                  <input
                    className="form-input"
                    type="text"
                    name="image"
                    value={image}
                    id="image"
                    onChange={(e) => setImage(e.target.value)}
                  ></input>
                  <input type="file" onChange={uploadFileHandler}></input>
                  {uploading && <div>Uploading...</div>}
                </li>
                <li>
                  <label className="form-label" htmlFor="designer">Designer</label>
                  <input
                    className="form-input"
                    type="text"
                    name="designer"
                    value={designer}
                    id="designer"
                    onChange={(e) => setdesigner(e.target.value)}
                  ></input>
                </li>
                <li>
                  <label className="form-label" htmlFor="countInStock">Stock</label>
                  <input
                    className="form-input"
                    type="text"
                    name="countInStock"
                    value={countInStock}
                    id="countInStock"
                    onChange={(e) => setCountInStock(e.target.value)}
                  ></input>
                </li>
                <li>
                  <label className="form-label" htmlFor="name">Category</label>
                  <input
                    className="form-input"
                    type="text"
                    name="category"
                    value={category}
                    id="category"
                    onChange={(e) => setCategory(e.target.value)}
                  ></input>
                </li>
                <li>
                  <label className="form-label" htmlFor="description">Description</label>
                  <textarea
                    className="form-input"
                    type="text"
                    name="description"
                    value={description}
                    id="description"
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </li>
                <div className="form-submit">
                  <button type="submit" className="button-prm btns">
                    {id ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalVisible(false)}
                    className="button-prm btns"
                  >
                    Back
                </button>
                </div>
              </ul>
            </form>
          </div>
        )}

        {products && !modalVisible && (
          <div className="product-list">
            <div className="product-header">
              <h3>Products</h3>
              <button className="button-prm" onClick={() => openModal({})}>
                Create Product
        </button>
            </div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Jewlery type</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Designer</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {
                  products.map((product) => (
                    <tr key={product._id}>
                      <td><img className="product-thumbnail" src={product.image} alt="" /></td>
                      <td>{product.jewleryClass}</td>
                      <td>{product.name}</td>
                      <td>{product.price}</td>
                      <td>{product.category}</td>
                      <td>{product.designer}</td>
                      <td>
                        {/* <button className="button-prm" onClick={() => openModal(product)}>
                          Edit
                  </button>{' '}
                        <button
                          className="button-prm"
                          onClick={() => deleteHandler(product)}
                        >
                          Delete
                  </button> */}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>)}
      </div>
    </div>
  );
}
export default ProductsCRUD_Screen;
