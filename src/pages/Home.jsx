import React, {useState,useEffect} from 'react'
import Footer from '../components/Footer'
import Card from '../components/Card'
import axios from 'axios';
//import { backendurl } from '../Apipath';

const Home = () => {

  const [search, setSearch] = useState('')
  const [foodItems, setFoodItems] = useState([]);
  const [foodCategories, setFoodCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // fetch categories once and initial page of items
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoading(true);
        const [categoriesRes, itemsRes] = await Promise.all([
          axios.get('https://epiceats-backend-qyk8.onrender.com/api/food-categories'),
          axios.get('https://epiceats-backend-qyk8.onrender.com/api/food-items', { params: { page: 1, limit: 50 } })
        ]);

        setFoodCategories(categoriesRes.data);

        // if backend returns wrapped object { items, total, page, pages }
        const itemsPayload = itemsRes.data.items || itemsRes.data;
        setFoodItems(itemsPayload);
        setPage(itemsRes.data.page || 1);
        setPages(itemsRes.data.pages || 1);

        // simple session cache to avoid re-fetch on navigation
        try { sessionStorage.setItem('foodItems_page_1', JSON.stringify(itemsPayload)); } catch (e) {}
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  // load a specific page (used by Load more)
  const loadPage = async (nextPage) => {
    if (nextPage > pages) return;
    const cacheKey = `foodItems_page_${nextPage}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setFoodItems(prev => [...prev, ...JSON.parse(cached)]);
      setPage(nextPage);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get('https://epiceats-backend-qyk8.onrender.com/api/food-items', { params: { page: nextPage, limit: 50 } });
      const itemsPayload = res.data.items || res.data;
      setFoodItems(prev => [...prev, ...itemsPayload]);
      setPage(res.data.page || nextPage);
      setPages(res.data.pages || pages);
      try { sessionStorage.setItem(cacheKey, JSON.stringify(itemsPayload)); } catch (e) {}
    } catch (err) {
      console.error('Failed to load page', nextPage, err);
    } finally {
      setLoading(false);
    }
  }

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
              <br/>
              <div className='d-flex flex-wrap gap-4'>
                {
                  foodItems
                    .filter(item => (item.CategoryName.toLowerCase() === category.CategoryName.toLowerCase()) && (item.name.toLowerCase().includes(search.toLocaleLowerCase())))
                    .map(item => (
                      <Card
                        key={item._id || item.id}
                        foodItems={item}
                        options={item.options}
                      />
                    ))
                }
              </div>
            </div>
          ))}
        </div>

        <div className="container text-center my-4">
          {loading && <div>Loading...</div>}
          {!loading && page < pages && (
            <button className="btn btn-primary" onClick={() => loadPage(page + 1)}>Load more</button>
          )}
        </div>

        <Footer />
        <div />
      </div>
    </>
  )

}

export default Home
