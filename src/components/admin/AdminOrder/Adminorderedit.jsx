import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link, useParams } from "react-router-dom";
import Adminheader from "../AdminHeader/Adminheader";

function Adminorderedit() {
  document.title = "Update Order";
  const [cookies] = useCookies("access_token");
  const [order, setOrder] = useState([]);
  const { id } = useParams();
  const [showNotification, setShowNotification] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const fetchOrder = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      setOrder(response.data.order);
    } catch (error) {}
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`http://localhost:8000/api/orders/status/${id}`, {
                status
            }, {
                headers: {
                    'Authorization': `Bearer ${cookies.access_token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            setMessage(response.data.message);
            setShowNotification(true);
            fetchOrder();
        } catch (error) {
            console.error("There was an error updating the order!", error);
        }
    };

  useEffect(() => {
    fetchOrder();
    }, [id]);



  return (
    <>
      <Adminheader />
      {showNotification && (
                <div className={`alert alert-${messageType} alert-dismissible fade show m-3`} role="alert">
                <strong>{message}</strong>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
       )}

      {Object.keys(order).length > 0 && (
        <div className="container">
          <table className="table table-hover table-bordered border-dark mt-3">
            <thead>
              <tr>
                <th className="table-dark">
                  <b>Order Reference : {order.id}</b>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>
                  <b>Placed On : </b>
                  {order.created_at}
                </th>
              </tr>
              <tr>
                <th>
                  <b>Placed by : </b>
                  {order.user.name}
                </th>
              </tr>
              <tr>
                <th>
                  <b>Address : </b>
                  {order.address.name} {order.address.surname} -
                  {order.address.address} - {order.address.more_info} -
                  {order.address.district} / {order.address.locality} -
                  {order.address.phone}
                </th>
              </tr>
              <tr>
                <th>
                  <b>Total Price : </b>${order.total_price}
                </th>
              </tr>
              <tr>
                <th>
                  <b>Status : </b>

                  <select
                    className="form-select"
                    name="status"
                    value={order.status}
                    onChange={handleStatusChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </th>
              </tr>

              <tr>
                <th>
                  <div className="d-flex flex-column gap-2">
                    {order.order_items.map((orderItem) => (
                      <div
                        className="d-flex border overflow-hidden"
                        style={{ height: "150px" }}
                        key={orderItem.id}
                      >
                        <div className="h-100">
                          <img
                            className="object-fit-contain h-100 ratio ratio-1x1"
                            alt="Product Image"
                          />
                        </div>
                        <div className="d-flex flex-column justify-content-center ps-3 gap-2">
                          <div>{orderItem.product.name}</div>
                          <div>$ {orderItem.price}</div>
                          <div>{orderItem.quantity} Item(s)</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </th>
              </tr>

              <tr>
                <th className="d-grid gap-2">
                  <button className="btn btn-primary mt-1" name="save" onClick={handleSave}>Save</button>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
export default Adminorderedit;
