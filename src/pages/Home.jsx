import fastFood_logo from '../../assets/HeroImages/HeroImg.png';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTiktok, FaTruckFast, FaBagShopping } from "react-icons/fa6";
import MenuCarousel from '../components/Carousel/MenuCarousel';
import './Home.css';

function Home() {
    
    return (
        <main className="home-page">

            <header className="hero">

                <div className="hero-img">
                    <img src={fastFood_logo} alt='Restaurant Logo' />
                </div>

                <section className="hero-content">
                    <h1 className='hero-title'>BiteBox</h1>
                    <p className='hero-tagline'>Good food, easy ordering</p>
                    <p className='hero-description'>Browse the menu, build your order, and get it delivered to your door fast.</p>
                    <Link to="/menu" className="order-btn">Order Now</Link>
                </section>

            </header>

            <MenuCarousel />

            <section className="home-section about-section">
                <h2>About BiteBox</h2>
                <p>
                    Welcome to BiteBox! We make ordering your favourite meals
                    simple and convenient. Explore our menu, choose what you
                    love, and place your order online without the hassle.
                    Good food and an easy ordering experience are just a
                    few clicks away.
                </p>
            </section>

            <section className="home-section ordering-section">
                <h2>How would you like your order?</h2>

                <div className="ordering-options">
                    <div className="ordering-card">
                        <FaTruckFast className="ordering-icon" />
                        <h3>Delivery</h3>
                        <p>
                            Enjoy your favourite meals delivered straight to your door.
                            We offer delivery around Grahamstown (Makhanda).
                            Simply enter your delivery details during checkout.
                        </p>
                    </div>

                    <div className="ordering-card">
                        <FaBagShopping className="ordering-icon" />
                        <p>
                            Prefer to collect your order? Place it online
                            and pick it up from our restaurant when it's ready.
                        </p>
                    </div>
                </div>
            </section>

            <section className="home-section visit-section">
                <h2>Visit Us</h2>
                <div className="visit-details">
                    <div className="visit-card">
                        <h3>Our Location</h3>
                        <p>29 Hill St, Makhanda, 6139</p>
                        <a
                            href="https://www.google.com/maps/dir/?api=1&destination=29+Hill+St%2C+Makhanda%2C+6139"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="location-link"
                        >
                            Get Directions
                        </a>
                    </div>

                    <div className="visit-card">
                        <h3>Operating Hours</h3>
                        <div className="opening-hours">
                            <p>
                                <span>Mon - Fri</span>
                                <strong>08:00 - 17:00</strong>
                            </p>

                            <p>
                                <span>Sat - Sun</span>
                                <strong>08:00 - 14:30</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="home-section social-section">
                <h2>Stay Connected</h2>
                <p>
                    Follow BiteBox and stay up to date with our latest news
                    and updates.
                </p>

                <div className="social-links">
                    <a href="https://www.facebook.com/" target="_blank"
                        rel="noopener noreferrer" aria-label="BiteBox on Facebook">
                        <FaFacebook aria-hidden="true"/>
                    </a>

                    <a href="https://www.instagram.com/" target="_blank"
                        rel="noopener noreferrer" aria-label="BiteBox on Instagram">
                        <FaInstagram aria-hidden="true"/>
                    </a>

                    <a href="https://www.tiktok.com/" target="_blank"
                        rel="noopener noreferrer" aria-label="BiteBox on TikTok">
                        <FaTiktok aria-hidden="true"/>
                    </a>
                </div>
            </section>
        </main>
    )
}

export default Home;