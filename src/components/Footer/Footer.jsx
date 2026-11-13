import logo from "../../../assets/HeroImages/Logo.png";
import {Link} from "react-router-dom";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa6";
import "./Footer.css";

function Footer() {

    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <Link to="/">
                        <img src={logo} alt="BiteBox logo" />
                    </Link>
                    <p>Good food, easy ordering.</p>
                </div>

                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <Link to="/">Home</Link>
                    <Link to="/menu">Menu</Link>
                    <Link to="/orders">Orders</Link>
                    <Link to="/cart">Cart</Link>
                </div>

                <div className="footer-contact">
                    <h3>Visit Us</h3>
                    <p>29 Hill St, Makhanda, 6139</p>
                    <p>Mon - Fri: 08:00 - 17:00</p>
                    <p>Sat - Sun: 08:00 - 14:30</p>
                </div>

                <div className="footer-socials">
                    <h3>Follow Us</h3>
                    <div className="footer-social-links">
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <FaFacebook />
                        </a>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FaInstagram />
                        </a>
                        <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                            <FaTiktok />
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} BiteBox. All rights reserved.</p>
                <p>Designed and developed by Olwethu</p>
            </div>
        </footer>
    );
}

export default Footer;