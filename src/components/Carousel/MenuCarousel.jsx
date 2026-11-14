import { useEffect, useState } from "react";
import { getMenuItems } from "../../services/menuService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import "./MenuCarousel.css";

function MenuCarousel() {

    const [menuItems, setMenuItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        async function fetchMenuItems() {
            try {
                const data = await getMenuItems();

                const featuredItems = data.filter(
                    item => item.image && item.image.trim() !== ""
                ).slice(0, 4);

                setMenuItems(featuredItems);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchMenuItems();
    }, []);

    useEffect(() => {
        if (menuItems.length <= 1 || isPaused)
            return;

            const interval = setInterval(() => {
                setCurrentIndex(prev =>
                    (prev + 1) % menuItems.length
                );
            }, 5000);

        return () => clearInterval(interval);

    }, [menuItems, isPaused]);

    function previousSlide() {
        setCurrentIndex(prev =>
            prev === 0 ? menuItems.length - 1 : prev - 1
        );
    }

    function nextSlide() {
        setCurrentIndex(prev =>
            (prev + 1) % menuItems.length
        );
    }

    if (loading) {
        return (
            <section className="menu-carousel">
                <h2>A Taste of BiteBox</h2>
                <p className="carousel-loading">Loading featured meals...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="menu-carousel">
                <h2>A Taste of BiteBox</h2>

                <div className="carousel-error">
                    <span className="error-icon">!</span>
                    <h3>Featured meals unavailable</h3>
                    <p>
                        We couldn't load our featured meals right now.
                        Please try again later.
                    </p>
                </div>
            </section>
        );
    }

    if (menuItems.length === 0) return null;

    const currentItem = menuItems[currentIndex];

    return (
        <section className="menu-carousel" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            <h2>A Taste of BiteBox</h2>

            <div className="carousel-container">

                <img
                    src={currentItem.image}
                    alt={currentItem.name}
                    key={currentItem._id}
                    className="carousel-image"
                />

                <button
                    className="carousel-arrow previous"
                    onClick={previousSlide}
                    aria-label="Previous meal"
                >
                    <FaChevronLeft />
                </button>

                <button
                    className="carousel-arrow next"
                    onClick={nextSlide}
                    aria-label="Next meal"
                >
                    <FaChevronRight />
                </button>

            </div>

            <h3>{currentItem.name}</h3>

            <div className="carousel-dots">
                {menuItems.map((item, index) => (
                    <button
                        key={item._id}
                        className={index === currentIndex ? "active" : ""}
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`Show ${item.name}`}
                        aria-current={index === currentIndex ? "true" : undefined}
                    />
                ))}
            </div>
        </section>
    );
}

export default MenuCarousel;