import React, { useEffect, useRef, useState } from 'react';
import { useDispatchCart, useCart } from './ContextReducer';
function Card(props) {
    let dispatch = useDispatchCart()
    let options = props.options
    let priceOptions = options.length > 0 ? Object.keys(options[0]) : [];
    let data = useCart()
    let priceRef = useRef()
    const [qty, setQty] = useState(1)
    const [size, setSize] = useState(priceOptions[0] || "")
    const [finalPrice, setFinalPrice] = useState(0);

    const handleAddtocart = async () => {
        let food = []
        for (const item of data) {
            if (item.id === props.foodItems._id) {
                food = item;
                break;
            }
        }
        if (!food.length === 0) {
            if (food.size === size) {
                await dispatch({ type: "UPDATE", id: props.foodItems._id, price: finalPrice, qty: qty })
                return
            }
            else if (!food.size === size) {
                await dispatch({ type: "ADD", id: props.foodItems._id, name: props.foodItems.name, img: props.foodItems.img, price: finalPrice, qty: qty, size: size })
                return
                //console.log(data)
            }
            return
        }
        await dispatch({ type: "ADD", id: props.foodItems._id, name: props.foodItems.name, img: props.foodItems.img, price: finalPrice, qty: qty, size: size })

    }

    useEffect(() => {
        if (size) {
            setFinalPrice(qty * parseInt(options[0][size]));
        }
    }, [qty, size, options]);

    useEffect(() => {
        if (priceRef.current) {
            setSize(priceRef.current.value);
        }
    }, []);



    return (
        <div className="card shadow-lg" style={{ width: "18rem", maxHeight: "400px", border: "1px solid black" }}>
            <img src={props.foodItems.img} style={{
                width: "286px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "3px"
            }} className="card-img-top w-24 h-24 object-cover" alt={props.foodItems.name} />
            <div className="card-body ">
                <h5 className="card-title">{props.foodItems.name}</h5>
                <p className="card-text">{props.foodItems.description}</p>
                <div className='container w-100'>
                    <select className="m-2 h-100 bg-success rounded" style={{ transition: "background-color 0.3s" }} onChange={(e) => setQty(e.target.value)}>
                        {Array.from(Array(6), (e, i) => {
                            return <option key={i + 1} value={i + 1}>{i + 1}</option>
                        })}
                    </select>

                    <select className="m-2 h-100 bg-success rounded" style={{ transition: "background-color 0.3s" }} ref={priceRef} onChange={(e) => setSize(e.target.value)}>
                        {priceOptions.map((data) => {
                            return <option key={data} value={data}>{data}</option>
                        })}
                    </select>
                    <div className='d-inline h-100 fs-6 text-bold' style={{ color: "black", fontWeight: "bold" }}   >
                        ₹{finalPrice}/-
                    </div>
                    <button className='btn bg-warning justify-center ms-2 ' onClick={handleAddtocart}>Add to cart</button>
                </div>
            </div>
        </div>
    );
}

export default Card;
