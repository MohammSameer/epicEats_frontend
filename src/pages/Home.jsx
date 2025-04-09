import React, {useState,useEffect} from 'react'
import Footer from '../components/Footer'
import Card from '../components/Card'
import axios from 'axios';
//import { backendurl } from '../Apipath';

const Home = () => {

  const[search, setSearch] = useState('')
  const [foodItems, setFoodItems] = useState([]);
  const [foodCategories, setFoodCategories] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsRes = await axios.get('https://epiceats-backend-qyk8.onrender.com/api/food-items')
        const categoriesRes = await axios.get('https://epiceats-backend-qyk8.onrender.com/api/food-categories')
        setFoodItems(itemsRes.data);
        setFoodCategories(categoriesRes.data);
        console.log("Food Items:", itemsRes.data);
        console.log("Food Categories:", categoriesRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div>
        <h1 style={{ textShadow: "4px 4px 8px rgba(0, 0, 0, 0.4)" }} align="center" >Welcome to EpicEats</h1>
        <h5 style={{ color: "#FF6B6B" }} align="center">Your favourite food at your door</h5>

        <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel" style={{objectFit:"contain !important"}}>
          <div className="carousel-inner">
            <div className='carousel-caption' style={{ zIndex: "5" }}>
              <div className="d-flex justify-contain-center" role="search" value={search} onChange={(e)=> {setSearch(e.target.value)}} >
                <input className="form-control me-2" style={{backgroundColor:"lightgray"}} type="search" placeholder="Search" aria-label="Search" />
                {/*<button className="btn btn-outline-success text-white "  type="submit">Search</button> */}
              </div>
            </div>
            <div className="carousel-item active" data-bs-interval="10000">
              <img src="https://recipe30.com/wp-content/uploads/2023/03/chicken-Biryani.jpg" className="d-block w-100" style={{ height: "80vh", objectFit: "cover", filter: "brightness(60%)" }} alt="..." />
            </div>
            <div className="carousel-item" data-bs-interval="2000">
              <img src="https://t4.ftcdn.net/jpg/02/17/39/75/360_F_217397519_MqLzfynUsUKGvZj1AB3iPREmr11sYRhk.jpg" className="d-block w-100" style={{ height: "80vh", objectFit: "cover", filter: "brightness(60%)" }} alt="..." />
            </div>
            <div className="carousel-item">
              <img src="https://t3.ftcdn.net/jpg/03/26/99/68/360_F_326996869_1JxpM9nKmKXYu4dGpFCIIx4aKhYmLSwC.jpg" className="d-block w-100" style={{ height: "80vh", objectFit: "cover", filter: "brightness(60%)" }} alt="..." />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <div className="container my-4">
          {foodCategories.map((category) => (
            <div key={category.CategoryName} className="my-3">
              <h2 className='text-start mb-2 text-xl font-bold '>{category.CategoryName}</h2>
              <br />
              <div className='d-flex flex-wrap gap-4'>
                {
                  foodItems
                    .filter(item => (item.CategoryName.toLowerCase() === category.CategoryName.toLowerCase()) && (item.name.toLowerCase().includes(search.toLocaleLowerCase())))
                    .map(item => (
                      <Card
                        foodItems={item}
                        options={item.options}
                      />
                    ))
                }
              </div>
            </div>
          ))}
        </div>

        <Footer />
        <div />
      </div>
    </>
  )

}

export default Home
