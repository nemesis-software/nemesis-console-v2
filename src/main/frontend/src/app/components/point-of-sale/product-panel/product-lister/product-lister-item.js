import React from 'react';

const ProductListerItem = ({product}) => (
  <div className="product-lister-item">
    <div className="product-price">{product.price}$</div>
    <div className="product-image"><img src={product.img}/></div>
    <div className="product-name">{product.name}</div>
  </div>
);

export default ProductListerItem;