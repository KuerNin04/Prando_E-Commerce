import React, { useEffect, useState } from 'react';
import { Accordion, Alert, Badge, Button, Card, Col, Container, Form, Modal, Nav, Navbar, Offcanvas, Row, Table, Toast, ToastContainer } from 'react-bootstrap';

const products = [
  { id: 'sample-1', name: 'PE Uniform', price: 650, category: 'PE Uniforms', description: 'Complete PE uniform set.', stock: 24 },
  { id: 'sample-2', name: 'ID Lace', price: 150, category: 'Merchandise', description: 'Breakaway clip, official colors.', stock: 24 },
  { id: 'sample-3', name: 'College T-shirt', price: 350, category: 'Merchandise', description: 'Available in all sizes.', stock: 24 },
  { id: 'sample-4', name: 'Uniform Set', price: 800, category: 'Uniforms', description: 'Top and bottom, all sizes.', stock: 24 }
];

const initialInventory = products.map(({ description, ...item }) => item);

const sampleOrders = [
  { id: '#1042', status: 'Ready for Pickup', total: 650 },
  { id: '#1039', status: 'Processing', total: 150 },
  { id: '#1021', status: 'Cancelled', total: 350 }
];

const sellerOrders = [
  { id: '#1048', customer: 'Maya Thompson', product: 'PE Uniform', status: 'Processing', amount: 650 },
  { id: '#1047', customer: 'Noah Williams', product: 'ID Lace', status: 'Completed', amount: 150 },
  { id: '#1046', customer: 'Ava Chen', product: 'College T-shirt', status: 'Pending', amount: 350 },
  { id: '#1045', customer: 'Ethan Brooks', product: 'Uniform Set', status: 'Completed', amount: 800 }
];

const studentLinks = [
  { title: 'Student', links: [['Dashboard', '/dashboard.html'], ['Profile', '/pages/profile.html'], ['Settings', '/pages/settings.html']] },
  { title: 'College Store', links: [['Products', '/pages/products.html'], ['Categories', '/pages/categories.html']] },
  { title: 'Shopping', links: [['Cart', '/pages/cart.html'], ['My Orders', '/pages/myorders.html'], ['Wishlist', '/pages/wishlist.html']] }
];

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) return fallback;

    const parsed = JSON.parse(saved);
    const isOriginalCart = key === 'studentCart' && parsed.length === 2
      && parsed[0].id === 'sample-1' && parsed[0].quantity === 1
      && parsed[1].id === 'sample-2' && parsed[1].quantity === 2;
    const isOriginalInventory = key === 'sellerProducts' && parsed.length === products.length
      && parsed.every(item => products.some(product => product.id === item.id && product.name === item.name) && item.stock === 24);

    if (isOriginalCart) {
      localStorage.setItem(key, JSON.stringify([]));
      return [];
    }
    if (isOriginalInventory) {
      localStorage.setItem(key, JSON.stringify(initialInventory));
      return initialInventory;
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function useSavedState(key, fallback) {
  const [value, setValue] = useState(() => readStorage(key, fallback));
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);
  return [value, setValue];
}

function money(amount) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(amount) || 0);
}

function getScreen(path) {
  const file = path.split('/').pop();
  if (file === 'website.html' || file === '') return 'login';
  if (file === 'signup.html') return 'signup';
  if (file === 'seller-signup.html') return 'seller-signup';
  if (file === 'forgotpass.html') return 'forgot';
  if (file === 'seller-dashboard.html') return 'seller';
  if (file === 'categories.html') return 'categories';
  if (file === 'uniforms.html') return 'uniforms';
  if (file === 'cart.html') return 'cart';
  if (file === 'myorders.html') return 'orders';
  if (file === 'profile.html') return 'profile';
  if (file === 'settings.html') return 'settings';
  if (file === 'wishlist.html') return 'wishlist';
  if (file === 'logout.html') return 'logout';
  if (file === 'home.html' || file === 'dashboard.html') return 'dashboard';
  return 'products';
}

function App() {
  const screen = getScreen(window.location.pathname);
  const account = new URLSearchParams(window.location.search).get('account');
  const isAuth = ['login', 'signup', 'seller-signup', 'forgot'].includes(screen);
  useEffect(() => {
    document.body.className = isAuth ? 'react-app-body auth-app-body' : 'react-app-body portal-app-body';
    document.title = `${screen === 'seller' ? 'Seller Workspace' : screen[0].toUpperCase() + screen.slice(1)} | UoT Portal`;
  }, [isAuth, screen]);

  if (screen === 'login') return <Login initialSeller={account === 'seller'} />;
  if (screen === 'signup') return <StudentSignup />;
  if (screen === 'seller-signup') return <SellerSignup />;
  if (screen === 'forgot') return <ForgotPassword seller={account === 'seller'} />;
  if (screen === 'seller') return <SellerWorkspace />;
  return <StudentPortal screen={screen} />;
}

function AuthFrame({ children, brand = false, contentClassName = '' }) {
  return <main className={`auth-shell ${brand ? 'auth-shell-branded' : ''}`}>
    {brand && <section className="auth-brand"><img src="/UoTlogo.png" alt="University of Technology" /><span>STUDENT PORTAL</span><h2>University of Technology</h2><p>Campus life, in one place.</p></section>}
    <section className={`auth-content ${contentClassName}`}>{children}</section>
  </main>;
}

function Login({ initialSeller }) {
  const [seller, setSeller] = useState(initialSeller);
  const [showPassword, setShowPassword] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [switchDirection, setSwitchDirection] = useState('');
  const switchAccount = () => {
    setSwitchDirection(seller ? 'account-switch-from-left' : 'account-switch-from-right');
    setSeller(current => !current);
    setPassword('');
    setError('');
  };
  const enterPortal = (event) => {
    event.preventDefault();
    setError('');
    if (seller) {
      sessionStorage.setItem('sellerId', accountId);
      window.location.href = '/seller-dashboard.html';
    } else {
      sessionStorage.setItem('studentId', accountId);
      window.location.href = '/dashboard.html';
    }
  };

  return <AuthFrame brand contentClassName={switchDirection}>
    <div className="auth-switch-row"><Button variant="outline-secondary" size="sm" onClick={switchAccount} aria-label={seller ? 'Switch to student sign-in' : 'Switch to seller sign-in'}>⇄ <span>{seller ? 'Student sign in' : 'Seller sign in'}</span></Button></div>
    <p className="eyebrow">WELCOME BACK</p>
    <h1>{seller ? 'Store sign in' : 'Student sign in'}</h1>
    <p className="auth-lead">Use your portal credentials to continue.</p>
    <Form onSubmit={enterPortal}>
      <Form.Group className="mb-3"><Form.Label>Number</Form.Label><Form.Control name="accountId" value={accountId} onChange={event => setAccountId(event.target.value)} inputMode="numeric" pattern="[0-9]{9}" maxLength={9} placeholder="123456789" autoComplete="username" required /></Form.Group>
      <Form.Group className="mb-2"><Form.Label>Password</Form.Label><Form.Control name="password" value={password} onChange={event => setPassword(event.target.value)} type={showPassword ? 'text' : 'password'} placeholder="Password" autoComplete="current-password" required /></Form.Group>
      <Form.Check className="mb-3" label="Show password" checked={showPassword} onChange={event => setShowPassword(event.target.checked)} />
      {error && <Alert variant="danger">{error}</Alert>}
      <Button className="w-100 auth-submit" type="submit">{seller ? 'Sign in to Seller Center' : 'Log in'}</Button>
    </Form>
    <p className="auth-foot"><a href={`/forgotpass.html${seller ? '?account=seller' : ''}`}>Forgot password?</a></p>
    <p className="auth-foot">{seller ? <>New seller? <a href="/seller-signup.html">Create a seller account</a></> : <>New to the portal? <a href="/signup.html">Create an account</a></>}</p>
  </AuthFrame>;
}

function StudentSignup() {
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  function submit(event) {
    event.preventDefault();
    if (event.currentTarget.password.value !== event.currentTarget.confirm.value) return setError('Passwords do not match.');
    setError('');
    window.location.href = '/website.html';
  }
  return <AuthFrame><p className="eyebrow">GET STARTED</p><h1>Create account</h1><Form onSubmit={submit}>
    <Form.Group className="mb-3"><Form.Label>Full name</Form.Label><Form.Control name="name" required /></Form.Group>
    <Form.Group className="mb-3"><Form.Label>ID number</Form.Label><Form.Control name="id" pattern="[0-9]{9}" maxLength={9} required /></Form.Group>
    <Row><Form.Group as={Col} className="mb-3"><Form.Label>Age</Form.Label><Form.Control name="age" type="number" min="10" max="100" required /></Form.Group><Form.Group as={Col} className="mb-3"><Form.Label>Course</Form.Label><Form.Control name="course" required /></Form.Group></Row>
    <Form.Group className="mb-3"><Form.Label>Password</Form.Label><Form.Control name="password" type={show ? 'text' : 'password'} required /></Form.Group>
    <Form.Group className="mb-2"><Form.Label>Confirm password</Form.Label><Form.Control name="confirm" type={show ? 'text' : 'password'} required /></Form.Group>
    <Form.Check className="mb-3" label="Show passwords" checked={show} onChange={event => setShow(event.target.checked)} />
    {error && <Alert variant="danger">{error}</Alert>}<Button className="w-100 auth-submit" type="submit">Create account</Button>
  </Form><p className="auth-foot">Already registered? <a href="/website.html">Log in</a></p></AuthFrame>;
}

function SellerSignup() {
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);
  function submit(event) {
    event.preventDefault();
    setMessage(event.currentTarget.password.value === event.currentTarget.confirm.value
      ? 'Seller registration is not connected yet. Contact your portal administrator.'
      : 'Passwords do not match.');
  }
  return <AuthFrame><p className="eyebrow">SELLER CENTER</p><h1>Create seller account</h1><Form onSubmit={submit}>
    <Form.Group className="mb-3"><Form.Label>Full name</Form.Label><Form.Control autoComplete="name" required /></Form.Group>
    <Form.Group className="mb-3"><Form.Label>Store name</Form.Label><Form.Control autoComplete="organization" required /></Form.Group>
    <Form.Group className="mb-3"><Form.Label>Email address</Form.Label><Form.Control type="email" autoComplete="email" required /></Form.Group>
    <Form.Group className="mb-3"><Form.Label>Password</Form.Label><Form.Control name="password" type={show ? 'text' : 'password'} minLength={8} required /></Form.Group>
    <Form.Group className="mb-2"><Form.Label>Confirm password</Form.Label><Form.Control name="confirm" type={show ? 'text' : 'password'} minLength={8} required /></Form.Group>
    <Form.Check className="mb-3" label="Show passwords" checked={show} onChange={event => setShow(event.target.checked)} />
    {message && <Alert variant={message.startsWith('Passwords') ? 'danger' : 'info'}>{message}</Alert>}
    <Button className="w-100 auth-submit" type="submit">Create seller account</Button>
  </Form><p className="auth-foot"><a href="/website.html?account=seller">Back to seller sign in</a></p></AuthFrame>;
}

function ForgotPassword({ seller }) {
  const [message, setMessage] = useState('');
  return <AuthFrame><p className="eyebrow">ACCOUNT SUPPORT</p><h1>{seller ? 'Seller password help' : 'Forgot password'}</h1><p className="auth-lead">{seller ? 'Enter the email linked to your seller account.' : 'Enter your ID number and email address to request reset help.'}</p>
    <Form onSubmit={event => { event.preventDefault(); setMessage('Password recovery is not connected yet. Contact your portal administrator.'); }}>
      {!seller && <Form.Group className="mb-3"><Form.Label>ID number</Form.Label><Form.Control pattern="[0-9]{9}" maxLength={9} required /></Form.Group>}
      <Form.Group className="mb-3"><Form.Label>Email address</Form.Label><Form.Control type="email" required /></Form.Group>
      {message && <Alert variant="info">{message}</Alert>}<Button className="w-100 auth-submit" type="submit">Request help</Button>
    </Form><p className="auth-foot"><a href={`/website.html${seller ? '?account=seller' : ''}`}>Back to sign in</a></p>
  </AuthFrame>;
}

function StudentPortal({ screen }) {
  const [cart, setCart] = useSavedState('studentCart', []);
  const [inventory, setInventory] = useSavedState('sellerProducts', initialInventory);
  const [wishlist, setWishlist] = useSavedState('studentWishlist', [products[3], products[2]]);
  const [orders, setOrders] = useSavedState('studentOrders', sampleOrders);
  const [storeOrders, setStoreOrders] = useSavedState('storeOrders', sellerOrders);
  const [toast, setToast] = useState('');
  const [logoutOpen, setLogoutOpen] = useState(screen === 'logout');
  const notify = (message) => setToast(message);
  const addToCart = (item, quantity = 1) => {
    const amount = Math.max(0, Math.trunc(Number(quantity) || 0));
    const stockItem = inventory.find(product => product.id === item.id);
    const existing = cart.find(line => line.id === item.id);
    const resultingQuantity = (existing?.quantity || 0) + amount;
    if (!amount) return false;
    if (resultingQuantity > 24) {
      notify(`Maximum quantity for ${item.name} is 24`);
      return false;
    }
    const isCatalogCategory = ['Uniforms', 'Merchandise', 'PE Uniforms'].includes(item.category);
    if ((!stockItem && !isCatalogCategory) || (stockItem && stockItem.stock < amount)) {
      notify(`Only ${stockItem?.stock ?? 0} ${item.name} available`);
      return false;
    }

    if (stockItem) setInventory(current => current.map(product => product.id === item.id ? { ...product, stock: product.stock - amount } : product));
    setCart(current => {
      return existing ? current.map(line => line.id === item.id ? { ...line, quantity: line.quantity + amount } : line) : [...current, { ...item, quantity: amount, detail: item.size ? `Size: ${item.size}` : 'One size' }];
    });
    notify(`${amount} ${item.name} added to cart`);
    return true;
  };
  const moveToCart = (item) => {
    if (addToCart(item, item.quantity || 1)) setWishlist(current => current.filter(saved => saved.id !== item.id));
  };
  const updateCartQuantity = (itemId, quantity) => {
    const item = cart.find(line => line.id === itemId);
    if (!item) return;
    const nextQuantity = Math.max(0, Math.trunc(Number(quantity) || 0));
    const change = nextQuantity - item.quantity;
    const stockItem = inventory.find(product => product.id === itemId);
    const isCatalogCategory = ['Uniforms', 'Merchandise', 'PE Uniforms'].includes(item.category);
    if (change > 0 && ((!stockItem && !isCatalogCategory) || (stockItem && stockItem.stock < change) || nextQuantity > 24)) {
      notify(`Only ${stockItem?.stock ?? 0} more available`);
      return;
    }
    if (stockItem && change !== 0) {
      setInventory(current => current.map(product => product.id === itemId ? { ...product, stock: product.stock - change } : product));
    }
    setCart(current => current.flatMap(line => line.id !== itemId ? [line] : nextQuantity === 0 ? [] : [{ ...line, quantity: nextQuantity }]));
  };
  const checkout = () => {
    if (!cart.length) return;
    const orderId = `#${String(Date.now()).slice(-6)}`;
    const orderItems = cart.map(item => ({ id: item.id, name: item.name, size: item.size, price: item.price, quantity: item.quantity }));
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = { id: orderId, status: 'Processing', total, items: orderItems, placedAt: new Date().toISOString() };
    const customer = sessionStorage.getItem('studentId') || 'Student';

    setOrders(current => [order, ...current]);
    setStoreOrders(current => [
      ...cart.map((item, index) => ({
        id: `${orderId}-${item.id}-${index}`,
        orderId,
        customer,
        product: item.size ? `${item.name} (${item.size})` : item.name,
        status: 'Pending',
        amount: item.price * item.quantity
      })),
      ...current
    ]);
    setCart([]);
    notify(`Order ${orderId} placed`);
  };

  return <PortalLayout screen={screen} onLogout={() => setLogoutOpen(true)}>
    {screen === 'dashboard' && <Dashboard />}
    {screen === 'products' && <ProductPage inventory={inventory} addToCart={addToCart} />}
    {screen === 'categories' && <Categories />}
    {screen === 'uniforms' && <Uniforms />}
    {screen === 'cart' && <CartPage cart={cart} inventory={inventory} updateCartQuantity={updateCartQuantity} onCheckout={checkout} />}
    {screen === 'orders' && <Orders orders={orders} />}
    {screen === 'wishlist' && <Wishlist items={wishlist} moveToCart={moveToCart} />}
    {screen === 'profile' && <Profile />}
    {screen === 'settings' && <Settings notify={notify} />}
    <ToastContainer position="bottom-center" className="portal-toast"><Toast show={Boolean(toast)} onClose={() => setToast('')} delay={2200} autohide><Toast.Body>{toast}</Toast.Body></Toast></ToastContainer>
    <LogoutDialog show={logoutOpen} onHide={() => setLogoutOpen(false)} />
  </PortalLayout>;
}

function PortalLayout({ screen, children, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeHref = window.location.pathname;
  const activeGroup = screen === 'products' || screen === 'categories' || screen === 'uniforms' ? '1' : ['cart', 'orders', 'wishlist'].includes(screen) ? '2' : '0';
  const navContent = () => <>
    <div className="portal-brand"><img src="/UoTlogo.png" alt="" /><span>UoT Portal</span></div>
    <Accordion className="portal-nav-accordion" defaultActiveKey={activeGroup}>
      {studentLinks.map((group, index) => <Accordion.Item eventKey={String(index)} key={group.title}><Accordion.Header>{group.title}</Accordion.Header><Accordion.Body><Nav className="flex-column">{group.links.map(([label, href]) => <Nav.Link key={href} href={href} active={activeHref === href || (label === 'Dashboard' && screen === 'dashboard')}>{label}</Nav.Link>)}</Nav></Accordion.Body></Accordion.Item>)}
    </Accordion>
    <Nav.Link as="button" type="button" className="portal-signout" onClick={() => { setMenuOpen(false); onLogout(); }}>Log out</Nav.Link>
  </>;
  return <div className="portal-shell">
    <Button className={`portal-menu-toggle${menuOpen ? ' is-open' : ''}`} onClick={() => setMenuOpen(open => !open)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}>
      <span /><span /><span />
    </Button>
    <aside className="portal-sidebar" aria-label="Student navigation">{navContent()}</aside>
    <Offcanvas show={menuOpen} onHide={() => setMenuOpen(false)} placement="start" className="portal-offcanvas"><Offcanvas.Header closeButton><Offcanvas.Title>Navigation</Offcanvas.Title></Offcanvas.Header><Offcanvas.Body>{navContent()}</Offcanvas.Body></Offcanvas>
    <main className="portal-main"><Container fluid className={`portal-content${screen === 'dashboard' ? ' dashboard-content' : ''}`}>{children}</Container></main>
  </div>;
}

function PageHeading({ title, subtitle, eyebrow }) {
  return <header className="portal-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1><p>{subtitle}</p></div></header>;
}

function Dashboard() {
  const metrics = [['Units Enrolled', '6'], ['Average Grade', '1.75'], ['Classes Today', '3'], ['Clearance Status', '80%']];
  return <><PageHeading title="Welcome back, Student" subtitle="Your campus account at a glance." />
    <section className="campus-banner"><div><p className="eyebrow">THIS SEMESTER</p><h2>Everything you need for campus</h2><p>Browse official products, review your cart, and follow your orders.</p><Button href="/pages/products.html">Browse store</Button></div><img src="/UoTlogo.png" alt="University of Technology" /></section>
    <SectionTitle>Quick overview</SectionTitle><Row className="g-2 promo-strip">{[['ACADEMICS', 'Next class: 1:00 PM · Data Structures'], ['ACADEMICS', '2 pending clearance items'], ['STORE', 'Store order arriving this week'], ['ACADEMICS', 'Attendance rate: 96%'], ['NOTICE', '1 unread announcement']].map(([tag, text]) => <Col sm={6} xl key={text}><div className="promo-item"><Badge>{tag}</Badge><span>{text}</span></div></Col>)}</Row>
    <SectionTitle>This week’s snapshot</SectionTitle><Row className="g-3 mb-4">{metrics.map(([label, value]) => <Col sm={6} xl={3} key={label}><Card className="portal-card metric-card"><Card.Body><span>{label}</span><strong>{value}</strong></Card.Body></Card></Col>)}</Row>
    <SectionTitle>Student tools</SectionTitle><Row className="g-3">{[['Products', 'Browse official campus gear and supplies.', '/pages/products.html'], ['Cart', 'Review selected items before checkout.', '/pages/cart.html'], ['Profile', 'Manage your personal information.', '/pages/profile.html'], ['Wishlist', 'Keep track of products for later.', '/pages/wishlist.html']].map(([title, text, href]) => <Col sm={6} xl={3} key={title}><Card className="portal-card tool-card h-100"><Card.Body><Card.Title>{title}</Card.Title><Card.Text>{text}</Card.Text><Button href={href} variant="outline-primary">Open</Button></Card.Body></Card></Col>)}</Row>
    <SectionTitle>Recent activity</SectionTitle><Card className="portal-card"><ListRows rows={[["Grade posted: Data Structures", 'Updated'], ['Clearance: Library', 'Pending'], ['Store order #1042', 'Ready for pickup']]} /></Card>
  </>;
}

function SectionTitle({ children }) { return <h2 className="portal-section-title">{children}</h2>; }

function ListRows({ rows }) {
  return <div className="activity-list">{rows.map(([title, status]) => <div className="activity-row" key={title}><strong>{title}</strong><Badge bg={status === 'Pending' ? 'warning' : 'success'}>{status}</Badge></div>)}</div>;
}

function QuantityStepper({ label, value, onChange, max }) {
  return <div className="quantity-stepper">
    <Button type="button" variant="outline-secondary" aria-label={`Decrease ${label}`} disabled={value <= 0} onClick={() => onChange(value - 1)}>-</Button>
    <Form.Control aria-label={`${label} quantity`} type="number" min="0" max={max} step="1" value={value} onChange={event => onChange(Math.max(0, Math.min(max ?? Number.MAX_SAFE_INTEGER, Math.trunc(Number(event.target.value) || 0))))} />
    <Button type="button" variant="outline-secondary" aria-label={`Increase ${label}`} disabled={max !== undefined && value >= max} onClick={() => onChange(value + 1)}>+</Button>
  </div>;
}

function ProductPage({ inventory, addToCart }) {
  const [quantities, setQuantities] = useState({});
  return <><PageHeading title="Products" subtitle="Everything available from the college store." /><Row className="g-3">{inventory.map(item => {
    const details = products.find(product => product.id === item.id);
    const displayItem = { ...details, ...item };
    const quantity = quantities[item.id] || 0;
    const stock = Number(item.stock) || 0;
    return <Col sm={6} xl={4} key={item.id}><Card className="portal-card product-card h-100"><div className="product-art" aria-hidden="true">{item.name.split(' ').map(word => word[0]).join('').slice(0, 2)}</div><Card.Body><Badge bg="light" text="dark">{item.category}</Badge><Card.Title>{item.name}</Card.Title><Card.Text>{displayItem.description || 'Seller listing.'}</Card.Text><div className="product-stock">{stock} in stock</div><QuantityStepper label={item.name} value={quantity} onChange={next => setQuantities(current => ({ ...current, [item.id]: next }))} /><div className="product-buy"><strong>{money(item.price)}</strong><Button disabled={quantity === 0 || quantity > stock} onClick={() => { if (addToCart(displayItem, quantity)) setQuantities(current => ({ ...current, [item.id]: 0 })); }}>Add to cart</Button></div></Card.Body></Card></Col>;
  })}</Row></>;
}

function Categories() {
  const categories = [['Uniforms', 'College uniforms, tops, and pants.', '/pages/uniforms.html'], ['Merchandise', 'College accessories, apparel, and keepsakes.', '/pages/merchandise.html'], ['PE Uniforms', 'PE jerseys, shirts, shorts, and pants.', '/pages/pe-uniforms.html']];
  return <><PageHeading title="Categories" subtitle="Browse the store by category." /><Row className="g-3">{categories.map(([name, description, href]) => <Col sm={6} xl={4} key={name}><Card className="portal-card category-card h-100"><Card.Body><div className="category-mark">{name.slice(0, 1)}</div><Card.Title>{name}</Card.Title><Card.Text>{description}</Card.Text><Button href={href} variant="primary">Browse</Button></Card.Body></Card></Col>)}</Row></>;
}

function Uniforms() {
  const items = [
    { name: "Men's Type A Uniform", sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
    { name: "Men's Type B Uniform", sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
    { name: "Men's Uniform Pants", sizes: ['28', '30', '32', '34', '36', '38', '40'] },
    { name: "Women's Uniform Pants", sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
    { name: 'College Uniform', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
    { name: "Women's Type A Uniform", sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }
  ];

  return <><PageHeading title="Uniforms" subtitle="Browse uniform options and select a size." /><Row className="g-3">{items.map(item => <Col sm={6} xl={4} key={item.name}><Card className="portal-card uniform-card h-100"><div className="product-art" aria-hidden="true">{item.name.split(' ').map(word => word[0]).join('').slice(0, 2)}</div><Card.Body><Card.Title>{item.name}</Card.Title><Form.Label htmlFor={`size-${item.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}>Size</Form.Label><Form.Select id={`size-${item.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`} defaultValue=""><option value="" disabled>Select a size</option>{item.sizes.map(size => <option key={size} value={size}>{size}</option>)}</Form.Select></Card.Body></Card></Col>)}</Row></>;
}

function CartPage({ cart, inventory, updateCartQuantity, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <><PageHeading title="Cart" subtitle="Review your items before checkout." />{cart.length ? <><Card className="portal-card"><Table responsive className="cart-table" align="middle"><thead><tr><th>Item</th><th>Details</th><th>Quantity</th><th className="text-end">Price</th><th /></tr></thead><tbody>{cart.map(item => { const catalogItem = ['Uniforms', 'Merchandise', 'PE Uniforms'].includes(item.category); const stock = Number(inventory.find(product => product.id === item.id)?.stock) || (catalogItem ? Math.max(0, 24 - item.quantity) : 0); return <tr key={item.id}><td><strong>{item.name}</strong></td><td>{item.detail}</td><td><QuantityStepper label={item.name} value={item.quantity} max={item.quantity + stock} onChange={quantity => updateCartQuantity(item.id, quantity)} /></td><td className="text-end">{money(item.price * item.quantity)}</td><td><Button variant="link" onClick={() => updateCartQuantity(item.id, 0)}>Remove</Button></td></tr>; })}</tbody></Table></Card><div className="cart-checkout"><span>Total <strong>{money(total)}</strong></span><Button onClick={onCheckout}>Checkout</Button></div></> : <EmptyState title="Your cart is empty" href="/pages/products.html" action="Browse products" />}</>;
}

function Orders({ orders }) {
  return <><PageHeading title="My orders" subtitle="Track your college store orders." /><Card className="portal-card"><ListRows rows={orders.map(order => [`Order ${order.id} · ${money(order.total)}`, order.status])} /></Card></>;
}

function Wishlist({ items, moveToCart }) {
  return <><PageHeading title="Wishlist" subtitle="Items you have saved for later." />{items.length ? <Row className="g-3">{items.map(item => <Col sm={6} xl={4} key={item.id}><Card className="portal-card h-100"><Card.Body><Badge bg="light" text="dark">{item.category}</Badge><Card.Title className="mt-3">{item.name}</Card.Title><Card.Text>{item.description || 'Saved for later.'}{item.size ? ` · Size: ${item.size}` : ''}</Card.Text><div className="product-buy"><strong>{money(item.price)}</strong><Button variant="outline-primary" onClick={() => moveToCart(item)}>Move to cart</Button></div></Card.Body></Card></Col>)}</Row> : <EmptyState title="Your wishlist is empty" href="/pages/products.html" action="Browse products" />}</>;
}

function EmptyState({ title, href, action }) { return <Card className="portal-card empty-state"><Card.Body><h2>{title}</h2><Button href={href}>{action}</Button></Card.Body></Card>; }

function Profile() {
  const [name, id] = ['Juan Dela Cruz', sessionStorage.getItem('studentId') || '2024-00123'];
  return <><PageHeading title="My profile" subtitle="Your personal and academic information on file." /><Card className="portal-card profile-panel"><div className="profile-initials">JD</div><div>{[['Full name', name], ['Student ID', id], ['Course', 'BS Information Technology'], ['Year level', '2nd Year'], ['Email', 'juan.delacruz@uot.edu.ph']].map(([label, value]) => <div className="profile-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></Card></>;
}

function Settings({ notify }) {
  return <><PageHeading title="Settings" subtitle="Manage your account preferences." /><div className="settings-stack">{[['Edit profile information', 'Update your contact details and personal information.', 'Edit profile', '/pages/profile.html'], ['Change password', 'Update your account password.', 'Request help', '/forgotpass.html'], ['Notifications', 'Choose what you get notified about.', 'Manage notifications', null]].map(([title, text, action, href]) => <Card className="portal-card" key={title}><Card.Body className="settings-row"><div><Card.Title>{title}</Card.Title><Card.Text>{text}</Card.Text></div>{href ? <Button href={href} variant="outline-primary">{action}</Button> : <Button variant="outline-primary" onClick={() => notify('Notification preferences saved.')}>{action}</Button>}</Card.Body></Card>)}</div></>;
}

function LogoutDialog({ show, onHide, seller = false }) {
  return <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton><Modal.Title>Log out</Modal.Title></Modal.Header>
    <Modal.Body>Are you sure you want to end your session?</Modal.Body>
    <Modal.Footer>
      <Button variant="outline-secondary" onClick={onHide}>Cancel</Button>
      <Button onClick={() => { sessionStorage.clear(); window.location.href = seller ? '/website.html?account=seller' : '/website.html'; }}>Log out</Button>
    </Modal.Footer>
  </Modal>;
}

function SellerWorkspace() {
  const [section, setSection] = useState('overview');
  const [items, setItems] = useSavedState('sellerProducts', initialInventory);
  const [orders] = useSavedState('storeOrders', sellerOrders);
  const [editing, setEditing] = useState(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const sales = orders.reduce((sum, order) => sum + order.amount, 0);
  const completed = orders.filter(order => order.status === 'Completed').reduce((sum, order) => sum + order.amount, 0);
  const sellerName = readStorage('sellerAccount', null)?.name || 'Jordan Lee';
  const go = (next) => { setSection(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const saveItem = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const item = { id: editing?.id || `product-${Date.now()}`, name: data.get('name').trim(), price: Number(data.get('price')), category: data.get('category').trim(), stock: Number(data.get('stock')) };
    setItems(current => editing ? current.map(existing => existing.id === editing.id ? item : existing) : [item, ...current]);
    setEditing(null);
    setProductDialogOpen(false);
    event.currentTarget.reset();
  };
  const sidebar = () => <><div className="seller-brand"><span className="seller-brand-mark">SC</span><span><strong>Seller Center</strong><small>Store workspace</small></span></div><Nav className="flex-column seller-nav">{[['Overview', 'overview'], ['Manage products', 'products'], ['Orders', 'orders'], ['Seller profile', 'profile']].map(([label, id]) => <Nav.Link key={id} active={section === id} onClick={() => go(id)}>{label}</Nav.Link>)}</Nav><Nav.Link as="button" type="button" className="seller-signout" onClick={() => { setMenuOpen(false); setLogoutOpen(true); }}>Log out</Nav.Link></>;
  return <div className="seller-shell"><Button className="portal-menu-toggle seller-menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Open seller navigation">☰</Button><aside className="seller-desktop-sidebar" aria-label="Seller navigation">{sidebar()}</aside><Offcanvas show={menuOpen} onHide={() => setMenuOpen(false)} placement="start" className="portal-offcanvas seller-offcanvas"><Offcanvas.Header closeButton><Offcanvas.Title>Seller Center</Offcanvas.Title></Offcanvas.Header><Offcanvas.Body>{sidebar()}</Offcanvas.Body></Offcanvas><LogoutDialog show={logoutOpen} onHide={() => setLogoutOpen(false)} seller />
    <Modal show={productDialogOpen} onHide={() => { setProductDialogOpen(false); setEditing(null); }} centered>
      <Modal.Header closeButton><Modal.Title>{editing ? 'Edit product' : 'Add a product'}</Modal.Title></Modal.Header>
      <Form key={editing?.id || 'new-product'} onSubmit={saveItem}><Modal.Body><Row className="g-3">
        <Col xs={12}><Form.Label>Product name</Form.Label><Form.Control name="name" defaultValue={editing?.name} maxLength={80} required /></Col>
        <Col sm={6}><Form.Label>Price (₱)</Form.Label><Form.Control name="price" type="number" min="0.01" step="0.01" defaultValue={editing?.price} required /></Col>
        <Col sm={6}><Form.Label>Stock / quantity</Form.Label><Form.Control name="stock" type="number" min="0" step="1" defaultValue={editing?.stock ?? 0} required /></Col>
        <Col xs={12}><Form.Label>Category</Form.Label><Form.Control name="category" defaultValue={editing?.category} maxLength={50} required /></Col>
      </Row></Modal.Body><Modal.Footer><Button variant="outline-secondary" type="button" onClick={() => { setProductDialogOpen(false); setEditing(null); }}>Cancel</Button><Button type="submit">{editing ? 'Save changes' : 'Save product'}</Button></Modal.Footer></Form>
    </Modal>
    <Modal show={Boolean(deleteTarget)} onHide={() => setDeleteTarget(null)} centered>
      <Modal.Header closeButton><Modal.Title>Delete product?</Modal.Title></Modal.Header>
      <Modal.Body>{deleteTarget ? `Delete ${deleteTarget.name} from your catalog? This cannot be undone.` : ''}</Modal.Body>
      <Modal.Footer><Button variant="outline-secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button variant="danger" onClick={() => { setItems(current => current.filter(item => item.id !== deleteTarget?.id)); setDeleteTarget(null); }}>Delete product</Button></Modal.Footer>
    </Modal>
    <main className="seller-main"><header className="seller-topbar"><span>Store workspace</span><Badge bg="light" text="dark">{sellerName}</Badge></header>
      {section === 'overview' && <><PageHeading title={`Welcome back, ${sellerName.split(' ')[0]}`} subtitle="Here is the latest activity from your store." eyebrow="STORE OVERVIEW" /><Row className="g-3 mb-4">{[['Total products', items.length], ['Total orders', orders.length], ['Sales summary', money(sales)]].map(([label, value]) => <Col md={4} key={label}><Card className="portal-card metric-card"><Card.Body><span>{label}</span><strong>{value}</strong></Card.Body></Card></Col>)}</Row><Card className="portal-card seller-summary"><Card.Body><p className="eyebrow">SALES SUMMARY</p><h2>Order performance</h2><Row className="mt-3"><Col>Completed sales <strong>{money(completed)}</strong></Col><Col>Pending orders <strong>{orders.filter(order => order.status !== 'Completed').length}</strong></Col><Col>Average order <strong>{money(orders.length ? sales / orders.length : 0)}</strong></Col></Row><div className="sales-track"><span style={{ width: `${sales ? completed / sales * 100 : 0}%` }} /></div></Card.Body></Card><SellerOrders orders={orders.slice(0, 3)} /></>}
      {section === 'products' && <><PageHeading title="Manage products" subtitle="Add and maintain products listed in your store." eyebrow="CATALOG" /><div className="d-flex justify-content-end mb-3"><Button onClick={() => { setEditing(null); setProductDialogOpen(true); }}>+ Add product</Button></div><Card className="portal-card"><Table responsive><thead><tr><th>Product</th><th>Price</th><th>Category</th><th>Stock</th><th>Actions</th></tr></thead><tbody>{items.map(item => <tr key={item.id}><td>{item.name}</td><td>{money(item.price)}</td><td>{item.category}</td><td>{item.stock} in stock</td><td><div className="d-flex gap-2"><Button size="sm" variant="outline-primary" onClick={() => { setEditing(item); setProductDialogOpen(true); }}>Edit</Button><Button size="sm" variant="outline-danger" onClick={() => setDeleteTarget(item)}>Delete</Button></div></td></tr>)}</tbody></Table></Card></>}
      {section === 'orders' && <><PageHeading title="Customer orders" subtitle="Customer orders and their current status." eyebrow="FULFILLMENT" /><SellerOrders orders={orders} /></>}
      {section === 'profile' && <><PageHeading title="Seller profile" subtitle="Your store contact information." eyebrow="ACCOUNT" /><Card className="portal-card profile-panel"><div className="profile-initials">JL</div><div>{[['Seller name', sellerName], ['Store name', 'Campus Corner'], ['Email address', 'hello@campuscorner.example'], ['Contact', '(555) 014-2024']].map(([label, value]) => <div className="profile-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></Card></>}
    </main></div>;
}

function SellerOrders({ orders }) {
  return <Card className="portal-card"><Table responsive className="mb-0"><thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Status</th><th className="text-end">Amount</th></tr></thead><tbody>{orders.map(order => <tr key={order.id}><td>{order.orderId || order.id}</td><td>{order.customer}</td><td>{order.product}</td><td><Badge bg={order.status === 'Completed' ? 'success' : 'warning'}>{order.status}</Badge></td><td className="text-end">{money(order.amount)}</td></tr>)}</tbody></Table></Card>;
}

export default App;