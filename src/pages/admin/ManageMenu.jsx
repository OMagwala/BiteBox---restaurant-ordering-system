import {useState, useEffect, useCallback} from "react";
import { getMenuItems, createMenuItem, updateMenuItem, updateMenuItemAvailability,
  deleteMenuItem } from "../../services/menuService";
import {formatCurrency} from "../../utils/formatCurrency";
import "./ManageMenu.css";

const initialFormData = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  isAvailable: true,
};

function ManageMenu() {

  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editingItemId, setEditingItemId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [updatingItemId, setUpdatingItemId] = useState(null);

  const fetchMenuItems = useCallback(async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getMenuItems();
      setMenuItems(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  function handleInputChange(event) {
    const {name, value} = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function resetForm() {
    setFormData(initialFormData);
    setEditingItemId(null);
  }

  function handleEdit(item) {
    setEditingItemId(item._id);

    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image || "",
      isAvailable: item.isAvailable,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const menuItemData = {
        ...formData,
        price: Number(formData.price),
      };

      if (editingItemId) {
        const result = await updateMenuItem(
          editingItemId,
          menuItemData
        );

        setMenuItems((currentItems) => currentItems.map((item) => 
        item._id === editingItemId ? result.menuItem : item));
      } else {
        const result = await createMenuItem(menuItemData);
        console.log("Created menu item:", result.menuItem);

        setMenuItems((currentItems) => [
          ...currentItems,
          result.menuItem,
        ]);
      }
      resetForm();
    } catch (error) {
      setError(error.message);
    } finally{
      setSaving(false);
    }
  }

  async function handleAvailabilityChange(item) {
    try {
      setUpdatingItemId(item._id);
      setError("");

      const result = await updateMenuItemAvailability(item._id, !item.isAvailable);

      setMenuItems((currentItems) => currentItems.map((currentItem) => 
      currentItem._id === item._id ? result.menuItem : currentItem));
    } catch (error) {
      setError(error.message);
    }finally {
      setUpdatingItemId(null);
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(`Are you sure you want to delete "${item.name}"?`);

    if (!confirmed) 
      return;

    try {
      setUpdatingItemId(item._id);
      setError("");
      
      await deleteMenuItem(item._id);

      setMenuItems((currentItems) => currentItems.filter((currentItem) =>
        currentItem._id !== item._id));

      if (editingItemId === item._id) {
        resetForm();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdatingItemId(null);
    }
  }

  if (loading) {
    return <p className="menu-message">Loading menu items...</p>;
  }

  return (
    <section className="manage-menu">
      <div className="menu-heading">
        <div>
          <h1>Manage Menu</h1>
          <p>Add, edit and manage your restaurant items.</p>
        </div>

        <div className="menu-heading-actions">
          <span className="menu-count">
            {menuItems.length} {menuItems.length === 1 ? "Item" : "Items"}
          </span>

          <button className="refresh-menu-btn" onClick={() => fetchMenuItems(true)} disabled={refreshing}>
            {refreshing ? "Refreshing..." : "Refresh Menu"}
          </button>
        </div>
      </div>

      {error && (
        <p className="menu-message menu-error">{error}</p>
      )}

      <div className="menu-form-section">
        <h2>{editingItemId ? "Edit Menu Item" : "Add Menu Item"}</h2>
        <form className="menu-form" onSubmit={handleSubmit}>
          <div className="menu-form-grid">
            <div className="menu-form-group">
              <label htmlFor="menu-name">Item Name</label>
              <input type="text" id="menu-name" name="name" value={formData.name}
                onChange={handleInputChange} placeholder="e.g Chicken Burger" required />
            </div>

            <div className="menu-form-group">
              <label htmlFor="menu-category">Category</label>
              <input type="text" id="menu-category" name="category" value={formData.category}
                onChange={handleInputChange} placeholder="e.g Burgers" required />
            </div>

            <div className="menu-form-group">
              <label htmlFor="menu-price">Price (R)</label>
              <input type="number" id="menu-price" name="price" value={formData.price}
                onChange={handleInputChange} placeholder="0.00" min="0" step="0.01" required />
            </div>

            <div className="menu-form-group">
              <label htmlFor="menu-image">Image URL</label>
              <input type="url" id="menu-image" name="image" value={formData.image}
                onChange={handleInputChange} placeholder="https://example.com/image.jpg"/>
            </div>

            <div className="menu-form-group menu-description-group">
              <label htmlFor="menu-description">Description</label>
              <textarea id="menu-description" name="description" value={formData.description}
                onChange={handleInputChange} placeholder="Describe menu item..." rows="3" required />
            </div>

          </div>

          <div className="menu-form-actions">
            <button type="submit" className="menu-save-btn" disabled={saving}>
              {saving ? "Saving..." : editingItemId ? "Update Menu Item" : "Add Menu Item"}
            </button>

            {editingItemId && (
              <button type="button" className="menu-cancel-btn" onClick={resetForm}
                disabled={saving}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="menu-list-section">
        <h2>Existing Menu Items</h2>

        {menuItems.length === 0 ? (
          <p className="menu-empty">
            No menu items found. Add your first menu item above.
          </p>
        ) : (
            <div className="menu-items-grid">
              {menuItems.map((item) => (
                <article className="menu-admin-card" key={item._id}>
                  {item.image ? (
                    <img className="menu-admin-image" src={item.image} alt={item.name} />
                  ) : (
                      <div className="menu-admin-image menu-image-placeholder">
                        No image available
                      </div>
                  )}

                  <div className="menu-admin-details">
                    <div className="menu-admin-title">
                      <h3>{item.name}</h3>
                      <span className="menu-admin-price">
                        {formatCurrency(item.price)}
                      </span>
                    </div>

                    <p className="menu-admin-category">
                      {item.category}
                    </p>

                    <p className="menu-admin-description">
                      {item.description}
                    </p>

                    <span className={`menu-availability ${item.isAvailable ? "available" : "unavailable"}`}>
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </span>

                    <div className="menu-card-actions">
                      <button className="menu-edit-btn" onClick={() => handleEdit(item)}
                        disabled={updatingItemId === item._id || saving} >
                        Edit 
                      </button>

                      <button className="menu-availability-btn" onClick={() => handleAvailabilityChange(item)}
                        disabled={updatingItemId === item._id}>
                        {updatingItemId === item._id ? "Saving..." : item.isAvailable ? 
                        "Mark Unavailable" : "Mark Available"}
                      </button>

                      <button className="menu-delete-btn" onClick={() => handleDelete(item)}
                        disabled={updatingItemId === item._id}>
                        Delete
                      </button>

                    </div>
                  </div>
                </article>
              ))}
            </div>
        )}
      </div>
    </section>
  )
}

export default ManageMenu;
