import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Heart,
  ShoppingBag,
  Pencil,
  LogOut,
  MapPin,
} from 'lucide-react';

import { InputField } from '@/components/InputField.jsx';
import { LoginRequired } from '@/components/LoginRequired.jsx';
import { ProductCard } from '@/components/ProductCard.jsx';

import { useAuth } from '@/context/auth.jsx';
import { useLikes } from '@/context/likes.jsx';
import { MOCK_PRODUCTS } from '@/mocks/products.js';

import styles from './Profile.module.css';

const TABS = [
  { key: 'listings', label: 'Listings', icon: Grid },
  { key: 'favourites', label: 'Favourites', icon: Heart },
  { key: 'orders', label: 'Orders', icon: ShoppingBag },
  { key: 'edit', label: 'Edit Profile', icon: Pencil },
];

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const { likedIds } = useLikes();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listings');

  const [editName, setEditName] = useState(user?.name ?? '');
  const [editLocation, setEditLocation] = useState(user?.location ?? '');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const myListings = useMemo(
    () => (user ? MOCK_PRODUCTS.filter((p) => p.seller.id === user.id) : []),
    [user],
  );
  const favourites = useMemo(
    () => MOCK_PRODUCTS.filter((p) => likedIds.has(p.id)),
    [likedIds],
  );

  if (!user) return <LoginRequired message="Log in to view your profile." />;

  async function handleSave(e) {
    e.preventDefault();
    if (!editName.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    updateUser({ name: editName.trim(), location: editLocation.trim() });
    setSaving(false);
    setSavedMsg('Saved!');
    setTimeout(() => setSavedMsg(''), 1500);
  }

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <h1 className={styles.screenTitle}>Profile</h1>
        <button
          type="button"
          onClick={handleLogout}
          className={styles.logoutBtn}
        >
          <LogOut size={16} />
          Logout
        </button>
      </header>

      <section className={styles.identity}>
        <div className={styles.avatarWrap}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className={styles.avatar} />
          ) : (
            <div className={`${styles.avatar} ${styles.avatarFallback}`}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <h2 className={styles.name}>{user.name}</h2>
        {user.location && (
          <p className={styles.location}>
            <MapPin size={14} /> {user.location}
          </p>
        )}
      </section>

      <section className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{myListings.length}</span>
          <span className={styles.statLabel}>Listings</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statValue}>0</span>
          <span className={styles.statLabel}>Orders</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statValue}>{favourites.length}</span>
          <span className={styles.statLabel}>Saved</span>
        </div>
      </section>

      <nav className={styles.tabBar}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`${styles.tab} ${active ? styles.tabActive : ''}`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <section className={styles.tabContent}>
        {activeTab === 'listings' && (
          myListings.length === 0 ? (
            <div className={styles.empty}>
              <Grid size={40} color="#d1d5db" />
              <p className={styles.emptyTitle}>No listings yet</p>
              <p className={styles.emptySubtext}>
                Click &lsquo;Sell&rsquo; to list your first item.
              </p>
              <button
                type="button"
                className={styles.ctaBtn}
                onClick={() => navigate('/sell')}
              >
                List an Item
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {myListings.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onClick={() => navigate(`/product/${p.id}`)}
                />
              ))}
            </div>
          )
        )}

        {activeTab === 'favourites' && (
          favourites.length === 0 ? (
            <div className={styles.empty}>
              <Heart size={40} color="#d1d5db" />
              <p className={styles.emptyTitle}>No favourites yet</p>
              <p className={styles.emptySubtext}>
                Tap the heart on any item to save it here.
              </p>
            </div>
          ) : (
            <div className={styles.grid}>
              {favourites.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onClick={() => navigate(`/product/${p.id}`)}
                />
              ))}
            </div>
          )
        )}

        {activeTab === 'orders' && (
          <div className={styles.empty}>
            <ShoppingBag size={40} color="#d1d5db" />
            <p className={styles.emptyTitle}>No orders yet</p>
            <p className={styles.emptySubtext}>
              Items you buy will appear here.
            </p>
          </div>
        )}

        {activeTab === 'edit' && (
          <form onSubmit={handleSave} className={styles.editForm}>
            <InputField
              label="Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              maxLength={60}
            />
            <InputField
              label="Location"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              placeholder="City, Country"
              maxLength={60}
            />
            <InputField
              label="Email"
              value={user.email}
              disabled
              readOnly
            />
            <p className={styles.hint}>Email cannot be changed here.</p>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              {savedMsg && <span className={styles.savedMsg}>{savedMsg}</span>}
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
