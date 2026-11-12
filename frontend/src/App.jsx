import { useEffect, useMemo, useState } from 'react'
import { site } from './lib/site'
import { initialLanguage, languageNames, locales } from './i18n'

const api = import.meta.env.VITE_API_URL || 'http://localhost:8001'
const yen = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 })

export default function App() {
  const [language, setLanguage] = useState(initialLanguage)
  const [menu, setMenu] = useState([])
  const [cart, setCart] = useState([])
  const [message, setMessage] = useState('')
  const t = locales[language]

  useEffect(() => { localStorage.setItem('mhc-language', language); document.documentElement.lang = language }, [language])
  useEffect(() => { fetch(`${api}/api/menu`).then(r => r.ok ? r.json() : Promise.reject()).then(data => setMenu(data.items)).catch(() => setMessage('Menu service is unavailable. Please contact the café.')) }, [])
  const total = useMemo(() => cart.reduce((sum, entry) => sum + entry.price * entry.quantity, 0), [cart])
  function add(item) { setCart(items => { const found = items.find(x => x.id === item.id); return found ? items.map(x => x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x) : [...items, { ...item, quantity: 1 }] }) }
  function chooseLanguage(event) { setLanguage(event.target.value) }
  async function submitReservation(event) { event.preventDefault(); const form = new FormData(event.currentTarget); try { const response = await fetch(`${api}/api/reservations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form)) }); const data = await response.json(); setMessage(data.message || data.detail); if (response.ok) event.currentTarget.reset() } catch { setMessage('Unable to send your request. Please call the café.') } }

  return <main>
    <header className="hero" id="top"><nav><a href="#top" className="brand">Mini House <span>Café</span></a><div><a href="#menu">{t.menu}</a><a href="#reserve">{t.reserve}</a><a href="#visit">{t.visit}</a><select aria-label="Language" value={language} onChange={chooseLanguage}>{Object.entries(languageNames).map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></div></nav><section className="hero-copy"><p className="eyebrow">MYOKO · NIIGATA</p><h1>{t.welcome}</h1><p>{t.intro}</p><a className="button" href="#menu">{t.menu}</a></section></header>
    <section className="story"><p className="eyebrow">KAIN NA TAYO</p><h2>Family recipes, shared with everyone.</h2><p>Mini House Café brings together Filipino comfort food, Indian favorites, tacos and Philippine Barako or Arabica coffee.</p><p className="note">{t.freeCoffee}</p></section>
    <section id="menu" className="section"><div className="section-heading"><p className="eyebrow">{t.menu}</p><h2>Made for the table</h2></div><div className="menu-grid">{menu.map(item => <article className="dish" key={item.id}><p>{item.category}</p><h3>{item.name}</h3><strong>{yen.format(item.price)}</strong>{item.pickup ? <button onClick={() => add(item)}>Add to pickup</button> : <small>Dine-in only</small>}</article>)}</div><aside className="cart"><h3>{t.order}</h3>{cart.length === 0 ? <p>Your cart is ready when you are.</p> : <>{cart.map(item => <p key={item.id}>{item.quantity} × {item.name}</p>)}<strong>Total: {yen.format(total)}</strong><p>Payment is made at the counter.</p></>}</aside></section>
    <section id="reserve" className="section reserve"><div><p className="eyebrow">{t.reserve}</p><h2>Save your seat.</h2><p>Breakfast, lunch and dinner reservations welcome. Each time slot accommodates up to 40 guests.</p></div><form onSubmit={submitReservation}><label>Name<input name="customer_name" required /></label><label>Phone<input name="phone" type="tel" required /></label><label>Date<input name="date" type="date" required /></label><label>Time<select name="time" defaultValue="11:30"><option>08:00</option><option>11:30</option><option>12:00</option><option>17:30</option><option>18:00</option></select></label><label>Guests<input name="guests" type="number" min="1" max="40" defaultValue="2" required /></label><button className="button" type="submit">{t.reserve}</button></form></section>
    <section id="events" className="events"><p className="eyebrow">{t.events}</p><h2>Birthdays, debuts, reunions and company parties.</h2><p>Ask about booking our live band for your celebration.</p><a className="button light" href={`mailto:${site.email}?subject=Event%20booking%20request`}>{t.events}</a></section>
    <section id="visit" className="section visit"><div><p className="eyebrow">{t.visit}</p><h2>Come hungry. Leave like family.</h2><address>{site.address}<br /><a href={`tel:${site.phone.replace(/[^+\d]/g, '')}`}>{site.phone}</a><br /><a href={`mailto:${site.email}`}>{site.email}</a></address><ul>{site.hours.map(hour => <li key={hour}>{hour}</li>)}</ul></div><iframe title="Map to Mini House Cafe" src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`} loading="lazy" /></section>
    {message && <div className="toast" role="status">{message}<button onClick={() => setMessage('')}>×</button></div>}
    <footer>© {new Date().getFullYear()} Mini House Café · Kain na tayo · さあ、いただきましょう</footer>
  </main>
}
