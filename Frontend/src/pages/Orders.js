import React, { useEffect } from "react";
import Container from "../components/Container";
import BreadCrumb from "../components/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../features/user/userSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const orderState = useSelector(
    (state) => state?.auth?.getorderedProduct?.orders
  );

  const getTokenFromLocalStorage = localStorage.getItem("customer")
    ? JSON.parse(localStorage.getItem("customer"))
    : null;

  const config2 = {
    headers: {
      Authorization: `Bearer ${
        getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
      }`,
      Accept: "application/json",
    },
  };

  useEffect(() => {
    dispatch(getOrders(config2));
  }, []);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "ordered":
        return "status-ordered";
      case "processed":
        return "status-processed";
      case "shipped":
        return "status-shipped";
      case "delivered":
        return "status-delivered";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  return (
    <>
      <BreadCrumb title="My Orders" />
      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Your Order History</h3>
            <div className="row mt-4">
              <div className="col-12">
                {orderState &&
                  orderState?.map((item, index) => {
                    return (
                      <div key={index} className="order-card card-wrapper mb-4">
                        <div className="order-header d-flex justify-content-between align-items-center">
                          <div className="d-flex gap-5">
                            <div>
                              <div className="order-header-title">Order ID</div>
                              <div className="order-header-value">
                                #{item?._id}
                              </div>
                            </div>
                            <div className="d-none d-md-block">
                              <div className="order-header-title">Total Amount</div>
                              <div className="order-header-value">
                                {item?.totalPrice}
                              </div>
                            </div>
                          </div>
                          <div className="text-end">
                            <div className="order-header-title mb-2">Status</div>
                            <div
                              className={`order-status-badge ${getStatusClass(
                                item?.orderStatus
                              )}`}
                            >
                              {item?.orderStatus}
                            </div>
                          </div>
                        </div>

                        <div className="order-details-container">
                          {item?.orderItems?.map((i, idx) => {
                            return (
                              <div
                                key={idx}
                                className="product-row d-flex align-items-center"
                              >
                                <div className="flex-grow-1 product-info">
                                  <h6>{i?.product?.title}</h6>
                                  <div className="d-flex align-items-center gap-4 mt-2">
                                    <p>
                                      <span className="text-muted">Qty:</span>{" "}
                                      {i?.quantity}
                                    </p>
                                    <p>
                                      <span className="text-muted">Price:</span>{" "}
                                      {i?.price}
                                    </p>
                                    <div className="d-flex align-items-center gap-2">
                                      <span className="text-muted small">
                                        Color:
                                      </span>
                                      <ul className="colors ps-0 mb-0">
                                        <li
                                          style={{
                                            backgroundColor: i?.color.title,
                                            width: "15px",
                                            height: "15px",
                                          }}
                                        ></li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="order-total-section d-flex justify-content-between align-items-center">
                          <div>
                            <span className="order-total-label">
                              Summary:{" "}
                            </span>
                            <span className="text-muted small">
                              {item?.orderItems?.length} Item(s)
                            </span>
                          </div>
                          <div className="text-end">
                            <span className="order-total-label me-2">
                              Total Paid:
                            </span>
                            <span className="order-total-amount">
                              {item?.totalPriceAfterDiscount}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Orders;
