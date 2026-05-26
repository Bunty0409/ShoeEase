import React from "react";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";

const SpecialProduct = (props) => {
  const { title, brand, totalrating, price, sold, quantity, id, img } = props;

  // Correct stock percentage
  const total = (quantity || 0) + (sold || 0);
  const stockPercent = total > 0 ? Math.min((quantity / total) * 100, 100) : 0;

  return (
    <div className="col-12 col-sm-6 col-md-4 mb-3">
      <div className="special-product-card">
        {/* Image */}
        <div className="special-product-image">
          <img src={img} alt={title} />
        </div>

        {/* Details */}
        <div className="special-product-content">
          <h5 className="brand">{brand}</h5>
          <h6 className="title">{title}</h6>

          <ReactStars
            count={5}
            size={16}
            value={Number(totalrating) || 0}
            edit={false}
            activeColor="#ffd700"
            color="#475569"
          />

          <p className="price">
            <span className="red-p">Rs. {price?.toLocaleString()}</span>
          </p>

          <div className="prod-count">
            <div className="prod-count-labels">
              <span>In Stock</span>
              <span>{quantity} left</span>
            </div>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${stockPercent}%` }}
                aria-valuenow={stockPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>

          <Link className="button sp-view-btn" to={"/product/" + id}>
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SpecialProduct;
