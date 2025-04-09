import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
//import { backendurl } from '../Apipath';

export default function MyOrder() {
    const [orderData, setOrderData] = useState({});

    const fetchMyOrder = async () => {
        console.log(localStorage.getItem('userEmail'));
        await fetch('https://epiceats-backend-qyk8.onrender.com/api/myOrderData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: localStorage.getItem('userEmail')
            })
        }).then(async (res) => {
            let response = await res.json();
            console.log("Fetched order data:", response);
             setOrderData(response.orderData);
        });
    };

    useEffect(() => {
        fetchMyOrder();
    }, []);

    return (
        <div>
            <div className='container'>
                <div className='row'>
                    {orderData && orderData.order_data && orderData.order_data.length > 0 ? (
                        orderData.order_data.map((data, index) => (
                            <div key={index}>
                                {data.map((arrayData) => (
                                    <div key={arrayData.id}>
                                        {arrayData.Order_date ? (
                                            <div className='m-auto mt-5'>
                                                <strong>Order Date: {arrayData.Order_date}</strong>
                                                <hr />
                                            </div>
                                        ) : (
                                            <div className='col-12 col-md-6 col-lg-3'>
                                                <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" }}>
                                                    <img src={arrayData.img} className="card-img-top" alt="..." style={{ height: "120px", objectFit: "fill" }} />
                                                    <div className="card-body">
                                                        <h5 className="card-title">{arrayData.name}</h5>
                                                        <div className='container w-100 p-0' style={{ height: "38px" }}>
                                                            <span className='m-1'>{arrayData.qty}</span>
                                                            <span className='m-1'>{arrayData.size}</span>
                                                            <div className='d-inline ms-2 h-100 w-20 fs-5'>
                                                                ₹{arrayData.price}/-
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className='fs-2' style={{ fontWeight: "bold", marginTop: "120px", textAlign: "center" }}>
                            No orders found.
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}