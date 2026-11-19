import logo from '../../../assets/HeroImages/Logo.png';
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import { useState, useEffect, useContext, useRef } from 'react';
import { getStoredUser, logoutUser } from '../../services/authService';
import { CartContext } from '../../context/CartContext';
import './Navbar.css';

function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(() => getStoredUser());

    const navigate = useNavigate();
    const { cart } = useContext(CartContext);
    const menuRef = useRef(null);
    const menuButtonRef = useRef(null);

    function handleNavClick() {
        setMenuOpen(false);
    }

    const cartCount = cart.reduce((sum, item) => {
        return sum + item.quantity;
    }, 0);

    useEffect(() => {
        function updateUser() {
            setUser(getStoredUser());
        }

        window.addEventListener("authChange", updateUser);
        window.addEventListener("storage", updateUser);

        return () => {
            window.removeEventListener("authChange", updateUser);
            window.removeEventListener("storage", updateUser);
        }
    }, []);

    useEffect(() => {
        function handleOutsideClick(event) {
            if (menuRef.current && !menuRef.current.contains(event.target) &&
                menuButtonRef.current && !menuButtonRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        }

        if (menuOpen) {
            document.addEventListener("pointerdown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("pointerdown", handleOutsideClick);
        }
    }, [menuOpen]);

    function handleLogout() {
        logoutUser();
        setMenuOpen(false);
        navigate("/");
    }

    return (

        <header className="navigation">
            <div className="left-section">
                <div className="brand">
                    <Link to='/' className='brand-logo' onClick={handleNavClick}>
                        <img src={logo} alt="BiteBox logo" />
                    </Link>
                </div>
                <button ref={menuButtonRef} className="menu-icon" type="button" onClick={() => setMenuOpen(prev => !prev)}
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={menuOpen} aria-controls="menu-navigation">
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>

                {user && <span className="user-greeting">Hi, {user.name}</span>}
            </div>
            <nav ref={menuRef} className={menuOpen ? "navbar open" : "navbar"}>
                <NavLink to="/" onClick={handleNavClick}>Home</NavLink>
                <NavLink to="/menu" onClick={handleNavClick}>Menu</NavLink>
                {user && (user.role === "admin" ? (
                    <NavLink to="/admin" onClick={handleNavClick}>
                        Dashboard
                    </NavLink>
                    ) : (
                    <NavLink to="/orders" onClick={handleNavClick}>
                        My Orders
                    </NavLink>)
                )}
            </nav>
            <nav className='user-navigation'>
                {user ? (
                    <>
                        <button type='button' className='logout-btn' onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                        <>
                            <NavLink to="/login" className="sign-in-btn" onClick={handleNavClick}>
                                Sign In
                            </NavLink>
                            <NavLink to="/register" className="sign-up-btn" onClick={handleNavClick}>
                                Sign Up
                            </NavLink>
                    </>
                )}

                <NavLink to="/cart" className="cart-link" onClick={handleNavClick}>
                    <FaShoppingCart />
                    <span className="cart-count">{cartCount}</span>
                </NavLink>
            </nav>
        </header>
    );
}

export default Navbar;
