import React, {useState,useEffect} from 'react'
import Footer from '../components/Footer'
import Card from '../components/Card'
import axios from 'axios';
import { backendurl } from '../Apipath';

const Home = () => {

  const [search, setSearch] = useState('')
  const [foodItems, setFoodItems] = useState([]);
  const [foodCategories, setFoodCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  // Load the menu and categories independently so a slow category request
  // cannot block the first batch of food items from rendering.
  useEffect(() => {
    let isMounted = true;
    let pendingRequests = 2;
    const requestFinished = () => {
      pendingRequests -= 1;
      if (pendingRequests === 0 && isMounted) setLoading(false);
    };

    let cachedItems = null;
    try {
      cachedItems = sessionStorage.getItem('foodItems_page_1');
    } catch (err) {
      // Continue without a browser cache when storage is unavailable.
    }
    if (cachedItems) {
      try {
        setFoodItems(JSON.parse(cachedItems));
        setLoading(false);
      } catch (err) {
        try { sessionStorage.removeItem('foodItems_page_1'); } catch (storageError) {}
      }
    }

    axios.get(`${backendurl}/api/food-items`, { params: { page: 1, limit: 50 } })
      .then((itemsRes) => {
        if (!isMounted) return;
        const items = itemsRes.data.items || itemsRes.data;
        setFoodItems(items);
        setPage(itemsRes.data.page || 1);
        setPages(itemsRes.data.pages || 1);
        try { sessionStorage.setItem('foodItems_page_1', JSON.stringify(items)); } catch (err) {}
      })
      .catch((err) => console.error('Error fetching food items:', err))
      .finally(requestFinished);

    axios.get(`${backendurl}/api/food-categories`)
      .then((categoriesRes) => {
        if (isMounted) setFoodCategories(categoriesRes.data);
      })
      .catch((err) => console.error('Error fetching food categories:', err))
      .finally(requestFinished);

    return () => { isMounted = false; };
  }, []);

  // load a specific page (used by Load more)
  const loadPage = async (nextPage) => {
    if (nextPage > pages) return;
    const cacheKey = `foodItems_page_${nextPage}`;
    let cached = null;
    try {
      cached = sessionStorage.getItem(cacheKey);
    } catch (err) {
      // Continue with the API request when browser storage is unavailable.
    }
    if (cached) {
      try {
        setFoodItems(prev => [...prev, ...JSON.parse(cached)]);
        setPage(nextPage);
        return;
      } catch (err) {
        // Ignore malformed cache data and refresh this page from the API.
      }
    }

    setLoading(true);
    try {
      const res = await axios.get(`${backendurl}/api/food-items`, { params: { page: nextPage, limit: 50 } });
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

  const visibleItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    (activeCategory === 'All' || item.CategoryName.toLowerCase() === activeCategory.toLowerCase())
  );

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="hero-copy"><span className="eyebrow">Made for your mood</span><h1>Something delicious is on its way.</h1><p>Comfort food, fresh flavours, and the kind of meals that make an ordinary day feel better.</p>
          <div className="home-search"><span>⌕</span><input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="What are you craving today?" aria-label="Search menu" />{search && <button type="button" onClick={() => setSearch('')} aria-label="Clear search">×</button>}</div>
        </div><div className="hero-note"><span>01</span><p>Fresh from local kitchens<br />to your door.</p></div>
      </section>
      <section className="menu-section container">
        <div className="section-heading"><div><span className="eyebrow">Explore the menu</span><h2>Find your next favourite</h2></div><span className="item-count">{visibleItems.length} dishes</span></div>
        <div className="category-list" aria-label="Food categories"><button className={activeCategory === 'All' ? 'category-chip active' : 'category-chip'} onClick={() => setActiveCategory('All')}>All dishes</button>{foodCategories.map(category => <button key={category.CategoryName} className={activeCategory === category.CategoryName ? 'category-chip active' : 'category-chip'} onClick={() => setActiveCategory(category.CategoryName)}>{category.CategoryName}</button>)}</div>
        {loading && foodItems.length === 0 ? <div className="menu-state">Preparing the menu...</div> : foodCategories.map((category) => {
          const categoryItems = visibleItems.filter(item => item.CategoryName.toLowerCase() === category.CategoryName.toLowerCase());
          if (!categoryItems.length || (activeCategory !== 'All' && activeCategory.toLowerCase() !== category.CategoryName.toLowerCase())) return null;
          return <div key={category.CategoryName} className="menu-category"><div className="category-title"><h3>{category.CategoryName}</h3><span>{categoryItems.length} options</span></div><div className="food-grid">{categoryItems.map(item => <Card key={item._id || item.id} foodItems={item} options={item.options} />)}</div></div>;
        })}
        {!loading && !visibleItems.length && <div className="menu-state"><strong>No dishes found.</strong><span>Try a different search or browse all categories.</span></div>}
        <div className="load-more">{loading && foodItems.length > 0 && <span>Loading more...</span>}{!loading && page < pages && <button className="secondary-button" onClick={() => loadPage(page + 1)}>Load more dishes <span>↓</span></button>}</div>
      </section>

        <Footer />
    </main>
  )

}

export default Home
