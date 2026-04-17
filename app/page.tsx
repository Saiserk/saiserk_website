import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, ArrowRight, Instagram, Mail, Compass, Hexagon, Layers, Zap, Plus, Minus, Check, Send, Paperclip, PenTool, ExternalLink, LogIn, User, Package, LogOut, PlayCircle, Settings, Ruler, Wrench, Search, Star, MessageCircle, MapPin, UploadCloud, ChevronDown, ShieldCheck, Truck, CreditCard, Sparkles, Loader2, LayoutDashboard, Box, ClipboardList, Inbox, Edit, Trash2 } from 'lucide-react';

// --- IMPORTACIONES DE FIREBASE ---
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

// --- CONFIGURACIÓN DE FIREBASE ---
let auth = null;
try {
  if (typeof __firebase_config !== 'undefined') {
    const firebaseConfig = JSON.parse(__firebase_config);
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  }
} catch (error) {
  console.warn("Configuración de Firebase no detectada. Funcionando en modo de prueba local.");
}

// --- DATOS DE LA TIENDA ---
const CATEGORIES = ['Todo', 'Mobiliario', 'Herramientas & Taller', 'Accesorios', 'Edición Limitada', 'Servicios Profesionales'];

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Tabla de Cortar "End Grain" Nogal',
    price: 45000,
    category: 'Accesorios',
    stock: 3,
    image: 'https://placehold.co/800x1000/e2e8f0/475569?text=Tabla+Principal',
    gallery: [
      'https://placehold.co/800x1000/e2e8f0/475569?text=Tabla+Principal',
      'https://placehold.co/800x1000/cbd5e1/334155?text=Detalle+Vetas'
    ],
    video: 'https://placehold.co/800x600/94a3b8/ffffff?text=Video:+Uso+y+Corte',
    description: 'Tabla de cocina profesional. Ensamblada a contraveta para proteger el filo de tus cuchillos. Un diseño clásico de la alta carpintería que durará toda la vida si se cuida adecuadamente.',
    howItsMade: 'Ensamblada con pegamento Titebond III (grado alimenticio). Lijada hasta grano 600 y sellada con una mezcla propia de cera de abejas orgánica y aceite mineral.',
    dimensions: 'Largo: 40cm | Ancho: 30cm | Grosor: 4cm',
    capacity: 'Superficie de corte de alta dureza. Resistente a impactos de cuchillos de chef (hachuelas ligeras).'
  },
  {
    id: 2,
    name: 'Organizador Modular de Escritorio',
    price: 18000,
    category: 'Accesorios',
    stock: 15,
    image: 'https://placehold.co/800x1000/f1f5f9/3b82f6?text=Organizador+Base',
    gallery: [
      'https://placehold.co/800x1000/f1f5f9/3b82f6?text=Organizador+Base',
      'https://placehold.co/800x1000/e2e8f0/2563eb?text=Módulos+Separados'
    ],
    video: 'https://placehold.co/800x600/bfdbfe/1d4ed8?text=Video:+Cómo+Ensamblar',
    description: 'Sistema de bandejas acoplables con un diseño geométrico único. Ideal para clasificar herramientas de precisión, tornillos, componentes electrónicos o artículos de oficina.',
    howItsMade: 'Diseñado en Fusion 360 e impreso en PETG mate. El PETG ofrece mayor flexibilidad y resistencia química que el PLA tradicional.',
    dimensions: 'Cada módulo base: 10x10x5 cm. Expandible infinitamente.',
    capacity: 'Tolerancia de encaje de 0.2mm. Los imanes de neodimio integrados permiten que los módulos se auto-alineen con un "click" satisfactorio.'
  },
  {
    id: 3,
    name: 'Mesa Auxiliar "Zeta"',
    price: 120000,
    category: 'Mobiliario',
    stock: 1, 
    image: 'https://placehold.co/800x1000/cbd5e1/334155?text=Mesa+Auxiliar',
    gallery: [
      'https://placehold.co/800x1000/cbd5e1/334155?text=Mesa+Auxiliar',
      'https://placehold.co/800x1000/94a3b8/1e293b?text=Detalle+Ensamble'
    ],
    video: 'https://placehold.co/800x600/64748b/ffffff?text=Video:+Estabilidad',
    description: 'Mueble de diseño minimalista fabricado en roble natural. Su estructura geométrica en forma de "Z" desafía la gravedad y optimiza espacios en salas de estar.',
    howItsMade: 'Carpintería tradicional con ensambles de caja y espiga ocultos. Acabado en laca de poliuretano mate para máxima protección contra derrames.',
    dimensions: 'Alto: 65cm | Base: 40x40cm | Cubierta: 45x35cm',
    capacity: 'El diseño en voladizo ha sido calculado para soportar hasta 25kg de carga estática.'
  },
  {
    id: 4,
    name: 'Soporte Articulado para Soldadura',
    price: 25000,
    category: 'Herramientas & Taller',
    stock: 8,
    image: 'https://placehold.co/800x1000/e2e8f0/475569?text=Soporte+Soldadura',
    gallery: [
      'https://placehold.co/800x1000/e2e8f0/475569?text=Soporte+Soldadura',
      'https://placehold.co/800x1000/cbd5e1/334155?text=Brazos+Flexibles'
    ],
    video: 'https://placehold.co/800x600/475569/ffffff?text=Video:+Demostración+Soldadura',
    description: 'Herramienta de precisión tipo "tercera mano" para técnicos y hobbistas de la electrónica. Permite sujetar placas y cables en ángulos imposibles gracias a sus rótulas personalizadas.',
    howItsMade: 'Impreso 100% en ABS de grado de ingeniería para resistir el calor ambiental del cautín. Uniones de rótula esférica ajustables.',
    dimensions: 'Base central: Ø12cm. Largo máximo de cada brazo: 35cm.',
    capacity: 'Resiste salpicaduras accidentales de estaño (hasta 150°C breves). Las pinzas sujetan PCBs de hasta 500g sin ceder.'
  },
  {
    id: 5,
    name: 'Visualización Inmobiliaria 8K',
    price: 180000,
    category: 'Servicios Profesionales',
    stock: 99,
    isService: true,
    image: 'https://placehold.co/800x1000/f8fafc/3b82f6?text=Render+8K',
    gallery: [
      'https://placehold.co/800x1000/f8fafc/3b82f6?text=Render+Día',
      'https://placehold.co/800x1000/e0e7ff/3730a3?text=Render+Noche'
    ],
    video: 'https://placehold.co/800x600/312e81/ffffff?text=Video:+Recorrido+Virtual',
    description: 'Servicio de renderizado fotorrealista hiperdetallado. El valor final y los tiempos de entrega dependen de la escala del proyecto. Para cotizar con exactitud, requerimos que nos envíes tu modelo 3D (SKP, RVT) o planimetría detallada en CAD.',
    howItsMade: 'Modelado en 3ds Max / Blender, texturizado PBR, iluminación mediante mapas HDRI reales y motor de renderizado path-tracing. Postproducción en Photoshop.',
    dimensions: 'Rango de precios desde $180.000 CLP (Referencia: Vivienda unifamiliar básica de 1 piso).',
    capacity: 'El servicio base incluye modelado del entorno inmediato, ambientación con vegetación 3D realista y 2 rondas de correcciones sobre la cámara seleccionada.'
  },
  {
    id: 6,
    name: 'Levantamiento Fotogramétrico',
    price: 280000,
    category: 'Servicios Profesionales',
    stock: 5,
    isService: true,
    image: 'https://placehold.co/800x1000/f1f5f9/3b82f6?text=Topografía+Drone',
    gallery: [
      'https://placehold.co/800x1000/f1f5f9/3b82f6?text=Topografía+Drone',
      'https://placehold.co/800x1000/dbeafe/1e40af?text=Nube+de+Puntos'
    ],
    video: 'https://placehold.co/800x600/1e3a8a/ffffff?text=Video:+Vuelo+y+Mapeo',
    description: 'Mapeo aéreo de precisión centimétrica. Todo vuelo está sujeto a factibilidad técnica y revisión de las normativas de restricción de espacio aéreo de la DGAC según la ubicación exacta de tu predio.',
    howItsMade: 'Vuelo automatizado con grilla superpuesta. Procesamiento de cientos de imágenes mediante software de fotogrametría avanzada para generar nubes de puntos densas.',
    dimensions: 'Desde $280.000 CLP (Cubre hasta 5 hectáreas de terreno despejado o rural).',
    capacity: 'Precisión relativa de 2-5 cm/píxel (GSD). Entregables estándar: Ortomosaico georreferenciado, Modelo Digital de Elevación (DEM) y Nube de Puntos.'
  },
  {
    id: 7,
    name: 'Lámpara Escultural "Vórtice"',
    price: 150000,
    category: 'Edición Limitada',
    stock: 1,
    isLimitedEdition: true,
    image: 'https://placehold.co/800x1000/e2e8f0/475569?text=Lámpara+Vórtice',
    gallery: [
      'https://placehold.co/800x1000/e2e8f0/475569?text=Lámpara+Vórtice',
      'https://placehold.co/800x1000/cbd5e1/334155?text=Detalle+Luz'
    ],
    video: 'https://placehold.co/800x600/94a3b8/ffffff?text=Video:+Iluminación',
    description: 'Pieza de autor 1/1. Lámpara de mesa tallada paramétricamente. La madera fue rescatada de un antiguo granero y moldeada mediante fresado CNC de 5 ejes. Nunca se fabricará otra igual.',
    howItsMade: 'Mecanizado CNC en roble reciclado. Incorpora una tira LED COB de tono cálido (2700K) oculta en la espiral interna. Sellado con cera natural.',
    dimensions: 'Alto: 45cm | Diámetro base: 15cm',
    capacity: 'Incluye fuente de poder 12V. Consumo energético mínimo (15W). Emite una luz ambiental suave ideal para estudios o salas de estar.'
  }
];

const PORTFOLIO_PROJECTS = [
  { id: 1, title: 'Consola Paramétrica "Olas"', category: 'Diseño en Madera & CNC', image: 'https://placehold.co/1000x1200/cbd5e1/475569?text=Mueble+Paramétrico', span: 'md:col-span-2 md:row-span-2' },
  { id: 2, title: 'Carcasa para Sensor IoT', category: 'Ingeniería Inversa & 3D (ASA)', image: 'https://placehold.co/800x600/e2e8f0/3b82f6?text=Carcasa+Industrial', span: 'md:col-span-1 md:row-span-1' },
  { id: 3, title: 'Pabellón de Cristal', category: 'ArchViz / Renderización Exterior', image: 'https://placehold.co/800x600/f1f5f9/475569?text=Render+Exterior', span: 'md:col-span-1 md:row-span-1' },
  { id: 4, title: 'Levantamiento Viñedo 50ha', category: 'Fotogrametría Drone', image: 'https://placehold.co/1600x800/e2e8f0/3b82f6?text=Mapa+Topográfico', span: 'md:col-span-2 md:row-span-1' }
];

const MOCK_ORDERS = [
  { id: 'ORD-1042', date: '10 Abril, 2026', status: 'En Fabricación', total: 120000, items: ['Mesa Auxiliar "Zeta"'] },
  { id: 'ORD-0988', date: '25 Marzo, 2026', status: 'Entregado', total: 45000, items: ['Tabla de Cortar "End Grain" Nogal'] }
];

// --- LISTA DE ADMINISTRADORES AUTORIZADOS ---
const ADMIN_EMAILS = ['erniaravena@gmail.com', 'efs.saiserk@gmail.com', 'cliente@saiserk.cl']; // cliente@saiserk.cl se deja temporalmente para que puedas probar el botón de testeo

const INITIAL_REVIEWS = [
  { name: "Carlos M.", role: "Cliente Verificado", product: "Visualización Inmobiliaria 8K", text: "Los renders que entregaron para mi proyecto superaron todas las expectativas. Lograron captar la iluminación exacta que buscaba.", rating: 5 },
  { name: "Valentina R.", role: "Cliente Verificado", product: "Mesa Auxiliar \"Zeta\"", text: "Compré la mesa Zeta y es el centro de atención de mi sala. La calidad de la madera y las terminaciones son de primer nivel.", rating: 5 },
  { name: "Estudio Taller Sur", role: "Cliente Verificado", product: "Soporte Articulado para Soldadura", text: "Sus herramientas impresas en 3D nos han ahorrado horas de trabajo. El soporte articulado es súper resistente al uso diario.", rating: 5 }
];

// --- DATOS FAQ ---
const FAQ_ITEMS = [
  { q: "¿Hacen envíos a todo Chile?", a: "Sí, enviamos a todas las regiones a través de Starken o Chilexpress en modalidad 'Por Pagar'. También ofrecemos retiro gratuito en nuestro taller ubicado en Machalí/Rancagua." },
  { q: "¿Cuánto demoran en fabricar un pedido a medida?", a: "Los tiempos varían. Las piezas en impresión 3D toman entre 3 a 5 días hábiles. El mobiliario a medida en madera toma entre 15 a 20 días hábiles desde la confirmación del anticipo." },
  { q: "¿Qué garantía tienen los productos?", a: "Todos nuestros productos físicos tienen 3 meses de garantía por defectos de fabricación (no cubre daños por mal uso o caídas). Los muebles de madera tienen 1 año de garantía estructural." },
  { q: "¿Cómo contrato un levantamiento con Drone?", a: "Debes ir a 'Proyectos a Medida', seleccionar 'Topografía Drone' y dejarnos el pin exacto de tu terreno. Revisaremos la factibilidad aérea de la DGAC y te enviaremos la cotización." }
];

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // home, products, custom, cart, checkout, orders, faq, legal, admin
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [user, setUser] = useState(null); 
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [customRequests, setCustomRequests] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0); 

  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [itemToReview, setItemToReview] = useState(null);

  // Variable de seguridad derivada
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  // --- EFECTOS INICIALES ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    let unsubscribe = () => {};
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser({
            name: currentUser.displayName || 'Usuario',
            email: currentUser.email,
            photoURL: currentUser.photoURL
          });
        } else {
          setUser(null);
        }
        setIsAuthLoading(false);
      });
    } else {
      setIsAuthLoading(false);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (selectedProduct) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [selectedProduct]);

  // --- FUNCIONES DEL CARRITO ---
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity < product.stock) {
          return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return prev;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => setCart((prev) => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, Math.min(item.quantity + delta, item.stock)) } : item));
  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
  
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (price) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);

  // --- LÓGICA DE SIMULACIÓN DE PAGO DESDE CHECKOUT ---
  const handleProcessPayment = (shippingCost, shippingMethodName) => {
    setIsProcessingPayment(true);
    
    setTimeout(() => {
      const newOrder = {
        id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
        date: new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'Pago Recibido',
        total: cartTotal + shippingCost,
        items: cart.map(item => `${item.name} (x${item.quantity})`),
        shipping: shippingMethodName
      };
      
      setOrders(prev => [newOrder, ...prev]);
      
      // Update actual product stock upon purchase
      const updatedProducts = products.map(p => {
        const cartItem = cart.find(ci => ci.id === p.id);
        if (cartItem && !p.isService) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      });
      setProducts(updatedProducts);

      setCart([]); 
      setIsProcessingPayment(false);
      setCurrentView('orders'); 
    }, 2000);
  };

  // --- LÓGICA DE AUTENTICACIÓN ---
  const handleLogin = async () => {
    setIsAuthLoading(true);
    try {
      if (!auth || window.location.hostname.includes('usercontent.goog') || window.location.hostname.includes('localhost')) {
        setTimeout(() => {
          setUser({ name: 'Usuario Autorizado', email: 'cliente@saiserk.cl', photoURL: 'https://placehold.co/100x100/2563eb/ffffff?text=U' });
          setIsAuthLoading(false);
        }, 800);
        return;
      }
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.warn("Autenticación bloqueada por el entorno:", error.message);
      setUser({ name: 'Usuario Autorizado', email: 'cliente@saiserk.cl', photoURL: 'https://placehold.co/100x100/2563eb/ffffff?text=U' });
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (auth && !window.location.hostname.includes('usercontent.goog')) {
      try { await signOut(auth); } catch(e) { console.warn("Error cerrando sesión:", e); }
    }
    setUser(null);
    if (currentView === 'orders' || currentView === 'checkout' || currentView === 'admin') setCurrentView('home'); 
  };

  // --- VISTAS PRINCIPALES ---
  const HomeView = () => (
    <div className="animate-in fade-in duration-1000">
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-6 bg-slate-50">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-100 rounded-full blur-[100px] opacity-60 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-indigo-100 rounded-full blur-[100px] opacity-60 pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e140_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e140_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-blue-600 mb-8 uppercase tracking-widest shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span> Estudio de Diseño Integral
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6 leading-[1.1]">
            Diseño <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Tangible</span> & <br /> Fabricación.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium mb-10 max-w-2xl text-balance">
            Creamos mobiliario, objetos utilitarios y herramientas técnicas. Combinamos la calidez del trabajo artesanal con la exactitud de la fabricación digital.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => setCurrentView('products')} className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all">
              <span className="relative z-10">Visitar Tienda</span><ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => setCurrentView('custom')} className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-full font-bold hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all">
              <PenTool size={20} className="text-blue-600 group-hover:rotate-12 transition-transform" /> Proyectos a Medida
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Proyectos Destacados</h2>
            <p className="text-slate-500 max-w-xl text-lg">Una selección de nuestros desarrollos. Llevamos los materiales y la técnica al límite de sus capacidades.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[300px]">
          {PORTFOLIO_PROJECTS.map((project) => (
            <div key={project.id} className={`relative rounded-3xl overflow-hidden group bg-slate-100 border border-slate-200 hover:shadow-xl transition-all duration-500 cursor-pointer ${project.span}`}>
              <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"/>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <p className="text-blue-300 font-bold text-xs uppercase tracking-widest mb-2 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">{project.category}</p>
                <div className="flex justify-between items-end">
                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">{project.title}</h3>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500"><ExternalLink size={18} /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-24 px-6 md:px-12 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Lo que dicen nuestros clientes</h2>
            <p className="text-slate-400 text-lg">Resultados reales de compradores verificados.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-slate-800 p-8 rounded-3xl border border-slate-700 relative hover:-translate-y-1 transition-transform">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                  </div>
                  {review.product && (
                    <span className="bg-slate-700/50 text-slate-300 text-[10px] uppercase tracking-widest px-2 py-1 rounded-md border border-slate-600 truncate max-w-[130px]" title={review.product}>
                      {review.product.replace(/ \(x\d+\)/, '')} 
                    </span>
                  )}
                </div>
                <p className="text-slate-300 italic mb-6 leading-relaxed">"{review.text}"</p>
                <div>
                  <h4 className="font-bold text-white flex items-center gap-2">{review.name} <Check size={14} className="text-green-400"/></h4>
                  <p className="text-slate-500 text-sm">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTÓN WHATSAPP FLOTANTE */}
      <a href="https://wa.me/56900000000" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-2xl transition-all flex items-center justify-center group">
        <MessageCircle size={28} />
        <span className="absolute right-full mr-4 bg-white text-slate-900 text-sm font-bold py-2 px-4 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          ¡Chatea con nosotros!
        </span>
      </a>
    </div>
  );

  const ProductsView = () => {
    const filteredProducts = products.filter(p => {
      const matchCategory = selectedCategory === 'Todo' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });

    return (
      <div className="py-24 px-6 md:px-12 max-w-7xl mx-auto animate-in fade-in duration-500 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 border-b border-slate-200 pb-8">
          <div className="w-full md:w-auto">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Tienda</h2>
            <p className="text-slate-500 text-lg max-w-xl mb-6">Herramientas técnicas, mobiliario y servicios listos para tu proyecto.</p>
            
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder="Buscar productos, materiales o servicios..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === category ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400 hover:text-slate-900'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-[480px] cursor-pointer"
              onClick={() => { setSelectedProduct(product); setActiveMediaIndex(0); }}
            >
              <div className="relative h-56 overflow-hidden bg-slate-100 shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4"><span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full text-slate-800 shadow-sm border border-slate-200/50">{product.category}</span></div>
                
                {/* GATILLOS FOMO Y EDICIÓN LIMITADA */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                  {(product.stock === 0 && !product.isService) && <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">Agotado</span>}
                  {(product.stock > 0 && product.stock <= 3 && !product.isService && !product.isLimitedEdition) && <span className="bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 animate-pulse"><Zap size={12}/> ¡Solo quedan {product.stock}!</span>}
                  {product.isLimitedEdition && <span className="bg-purple-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1"><Star size={12}/> Pieza Única 1/1</span>}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h3>
                <p className="text-slate-500 text-sm line-clamp-3 mb-4">{product.description}</p>
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900">
                    {product.isService ? 'Cotizar' : formatPrice(product.price)}
                  </span>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if(product.isService) { setSelectedProduct(product); } 
                      else { addToCart(product); }
                    }}
                    disabled={product.stock === 0 && !product.isService}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all z-10 relative ${
                      (product.stock === 0 && !product.isService) 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm'
                    }`}
                  >
                    {product.isService ? <Mail size={20} /> : (product.stock === 0 ? <Minus size={20} /> : <ShoppingCart size={20} />)}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ProductModal = () => {
    if (!selectedProduct) return null;
    const mediaItems = [...selectedProduct.gallery, selectedProduct.video];

    // Lógica para Cross-Selling (Productos relacionados)
    const relatedProducts = products.filter(p => p.id !== selectedProduct.id && !p.isService).slice(0, 2);

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
        <div className="relative bg-white w-full max-w-6xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 animate-in zoom-in-95 duration-300">
          
          <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/80 backdrop-blur-md md:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-full flex items-center justify-center shadow-sm"><X size={20} /></button>

          <div className="md:w-1/2 bg-slate-100 p-6 md:p-8 flex flex-col overflow-y-auto">
            <div className="w-full aspect-square md:aspect-[4/3] bg-slate-200 rounded-2xl overflow-hidden mb-4 relative shadow-inner">
              {activeMediaIndex < 2 ? (
                <img src={mediaItems[activeMediaIndex]} alt={selectedProduct.name} className="w-full h-full object-cover animate-in fade-in duration-300" />
              ) : (
                <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center relative group cursor-pointer">
                  <img src={mediaItems[activeMediaIndex]} alt="Video" className="w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center"><div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><PlayCircle size={32} /></div></div>
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur text-white text-xs px-3 py-2 rounded-lg font-mono flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> DEMOSTRACIÓN TÉCNICA</div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {mediaItems.map((item, idx) => (
                <button key={idx} onClick={() => setActiveMediaIndex(idx)} className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeMediaIndex === idx ? 'border-blue-600 opacity-100 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={idx < 2 ? item : selectedProduct.gallery[0]} alt={`Thumb ${idx}`} className={`w-full h-full object-cover ${idx === 2 ? 'grayscale blur-[1px]' : ''}`} />
                  {idx === 2 && <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center"><PlayCircle size={20} className="text-white" /></div>}
                </button>
              ))}
            </div>
          </div>

          <div className="md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto bg-white">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 block">{selectedProduct.category}</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">{selectedProduct.name}</h2>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
              <span className="text-3xl font-black text-slate-900">
                {selectedProduct.isService ? 'Proyecto a Medida' : formatPrice(selectedProduct.price)}
              </span>
              {!selectedProduct.isService && (
                selectedProduct.stock > 0 ? (
                  <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                    {selectedProduct.isLimitedEdition ? 'Disponible: 1 Unidad' : `${selectedProduct.stock} en stock`}
                  </span>
                ) : (
                  <span className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-full border border-red-200">Agotado</span>
                )
              )}
            </div>

            <p className="text-slate-600 mb-8 leading-relaxed text-lg">{selectedProduct.description}</p>

            <div className="space-y-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-1"><Settings size={16} className="text-blue-600" /> {selectedProduct.isService ? 'Metodología Técnica' : 'Fabricación'}</h4>
                <p className="text-sm text-slate-600">{selectedProduct.howItsMade}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-1"><Ruler size={16} className="text-blue-600" /> {selectedProduct.isService ? 'Valores y Alcance' : 'Dimensiones'}</h4>
                  <p className="text-xs text-slate-600 font-mono">{selectedProduct.dimensions}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-1"><Wrench size={16} className="text-blue-600" /> {selectedProduct.isService ? 'Entregables' : 'Capacidad'}</h4>
                  <p className="text-xs text-slate-600">{selectedProduct.capacity}</p>
                </div>
              </div>
            </div>

            {/* SECCIÓN VENTA CRUZADA (CROSS-SELLING) */}
            {!selectedProduct.isService && relatedProducts.length > 0 && (
              <div className="mb-8 pt-6 border-t border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">También te podría interesar</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedProducts.map(rp => (
                    <div 
                      key={rp.id} 
                      onClick={() => { setSelectedProduct(rp); setActiveMediaIndex(0); }} 
                      className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors group"
                    >
                      <img src={rp.image} alt={rp.name} className="w-14 h-14 rounded-lg object-cover" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 line-clamp-1">{rp.name}</p>
                        <p className="text-[10px] font-medium text-slate-500">{formatPrice(rp.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto pt-4 bg-white sticky bottom-0 border-t border-slate-100">
              {selectedProduct.isService ? (
                <button 
                  onClick={() => { setSelectedProduct(null); setCurrentView('custom'); }} 
                  className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-md bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Ir a Cotizar Proyecto <ArrowRight size={20} />
                </button>
              ) : (
                <button 
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} 
                  disabled={selectedProduct.stock === 0} 
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-md ${selectedProduct.stock === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'}`}
                >
                  {selectedProduct.stock === 0 ? 'Sin Stock Disponible' : 'Agregar al Carrito'} {selectedProduct.stock > 0 && <ShoppingCart size={20} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CustomOrderView = () => {
    const [formData, setFormData] = useState({ 
      name: '', email: '', area: 'madera', specs: '', 
      file: null, region: '', mapPin: null 
    });

    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
        alert("El archivo supera el límite de 10MB.");
        return;
      }
      setFormData({ ...formData, file: selectedFile });
    };

    const handleMapClick = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setFormData({ ...formData, mapPin: { x, y } });
    };

    return (
      <div className="py-24 px-6 md:px-12 max-w-5xl mx-auto animate-in slide-in-from-bottom-8 duration-500 min-h-screen">
        <div className="mb-12 border-b border-slate-200 pb-8 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Proyectos a Medida</h2>
          <p className="text-slate-500 text-lg max-w-2xl">Diseñamos y fabricamos piezas exclusivas. Desde un mueble hasta el prototipo funcional en 3D.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Protocolo de Trabajo</h3>
              <ul className="space-y-6">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">1</div><div><h4 className="text-slate-900 font-bold mb-1">Brief Técnico</h4><p className="text-slate-500 text-sm">Rellena el formulario con las especificaciones de tu proyecto.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">2</div><div><h4 className="text-slate-900 font-bold mb-1">Evaluación</h4><p className="text-slate-500 text-sm">Analizamos la factibilidad técnica y te respondemos con cotización.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">3</div><div><h4 className="text-slate-900 font-bold mb-1">Fabricación</h4><p className="text-slate-500 text-sm">Al aprobar, pasamos a las máquinas de fabricación o diseño.</p></div></li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-8 rounded-3xl flex flex-col items-center text-center gap-4 shadow-sm">
              <div className="p-4 bg-green-100 text-green-600 rounded-full"><MessageCircle size={32} /></div>
              <div>
                <h4 className="text-slate-900 font-bold text-xl mb-2">¿Atención más rápida?</h4>
                <p className="text-slate-600 text-sm mb-6">Si tu proyecto es urgente o prefieres explicarlo por audio, envíame un mensaje directo.</p>
                <a href="https://wa.me/56900000000" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-6 py-4 rounded-xl transition-all shadow-md active:scale-95">
                  <MessageCircle size={20} /> ¡Habla directamente conmigo!
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <form 
              className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-10 shadow-sm" 
              onSubmit={(e) => { 
                e.preventDefault(); 
                const newRequest = { ...formData, id: `REQ-${Math.floor(Math.random() * 9000) + 1000}`, date: new Date().toLocaleDateString('es-CL') };
                setCustomRequests([newRequest, ...customRequests]);
                alert("¡Solicitud enviada con éxito! El taller la revisará a la brevedad."); 
                setFormData({ name: '', email: '', area: 'madera', specs: '', file: null, region: '', mapPin: null });
              }}
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Detalles Formales de Cotización</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nombre / Empresa</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="Ej. Juan Pérez" /></div>
                <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email</label><input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="juan@correo.com" /></div>
              </div>
              <div className="space-y-2 mb-6">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Área del Proyecto</label>
                <select value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all">
                  <option value="madera">Carpintería / Muebles</option><option value="impresion">Prototipo Impresión 3D</option><option value="render">Renderizado / ArchViz</option><option value="drone">Topografía Drone</option><option value="mixto">Proyecto Mixto</option>
                </select>
              </div>

              {formData.area === 'drone' && (
                <div className="space-y-4 mb-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl animate-in fade-in zoom-in-95">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2"><Compass size={18} className="text-blue-600"/> Logística de Vuelo</h4>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Región de Operación (Solo cobertura habilitada)</label>
                    <select required value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 transition-all">
                      <option value="">Selecciona tu región...</option><option value="ohiggins">Región de O'Higgins</option><option value="rm">Región Metropolitana (Santiago)</option>
                    </select>
                  </div>
                  <div className="space-y-2 mt-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Ubicación Aproximada (Fija un pin en el mapa)</label>
                    <div className="relative w-full h-48 bg-slate-200 rounded-xl overflow-hidden cursor-crosshair border border-slate-300" onClick={handleMapClick}>
                      <img src="https://placehold.co/800x400/e2e8f0/94a3b8?text=Haz+clic+para+fijar+tu+terreno" alt="Mapa" className="w-full h-full object-cover opacity-60" />
                      {formData.mapPin && (
                        <div className="absolute text-red-600 drop-shadow-md transform -translate-x-1/2 -translate-y-full" style={{ left: `${formData.mapPin.x}%`, top: `${formData.mapPin.y}%` }}>
                          <MapPin size={32} fill="currentColor" className="text-red-500" />
                        </div>
                      )}
                    </div>
                    {formData.mapPin && <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1"><Check size={14}/> Coordenadas fijadas</p>}
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-6">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Especificaciones Técnicas</label>
                <textarea required rows="8" value={formData.specs} onChange={e => setFormData({...formData, specs: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"></textarea>
              </div>
              
              <div className="mb-8">
                <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.png,.stl,.dwg" />
                <label htmlFor="file-upload" className={`w-full border-2 border-dashed rounded-xl px-4 py-6 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${formData.file ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-300 bg-slate-50 text-slate-500 hover:border-blue-300 hover:text-blue-600'}`}>
                  {formData.file ? (
                    <><Check size={28} className="text-blue-600" /><span className="text-sm font-bold">{formData.file.name}</span><span className="text-xs">{(formData.file.size / (1024*1024)).toFixed(2)} MB - Haz clic para cambiar</span></>
                  ) : (
                    <><UploadCloud size={28} /><span className="text-sm font-medium">Adjuntar Planos o Referencias (.pdf, .jpg, .stl)</span><span className="text-xs text-slate-400">Máximo 10 MB</span></>
                  )}
                </label>
              </div>

              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all active:scale-95 flex justify-center items-center gap-2 shadow-md">Enviar al Taller <Send size={20} /></button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const CartView = () => (
    <div className="py-24 px-6 md:px-12 max-w-6xl mx-auto animate-in slide-in-from-bottom-8 duration-500 min-h-screen">
      <div className="flex items-center gap-4 mb-12 border-b border-slate-200 pb-8">
        <ShoppingCart size={40} className="text-slate-400" />
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Tu Carrito</h2>
      </div>
      
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-50 border border-slate-200 rounded-[2rem] border-dashed">
          <p className="text-slate-500 text-lg mb-6">El carrito está vacío.</p>
          <button onClick={() => setCurrentView('products')} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-md">Ir a la Tienda</button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="group bg-white p-4 md:p-6 rounded-3xl flex items-center gap-6 border border-slate-200 shadow-sm">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100"><img src={item.image} alt={item.name} className="w-full h-full object-cover" /></div>
                <div className="flex-grow">
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{item.name}</h4>
                  <p className="text-slate-500 font-medium">{formatPrice(item.price)}</p>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
                  <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-full border border-slate-200">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white"><Minus size={16} /></button>
                    <span className="w-6 text-center font-bold text-slate-900">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white"><Plus size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:w-1/3">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 sticky top-32 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Resumen</h3>
              <div className="flex justify-between items-end mb-8 border-b border-slate-100 pb-8">
                <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Subtotal</span>
                <span className="text-3xl font-black text-slate-900">{formatPrice(cartTotal)}</span>
              </div>
              <button 
                onClick={() => {
                  if(!user) { alert("Inicia Sesión para continuar con el envío."); handleLogin(); } 
                  else { setCurrentView('checkout'); }
                }} 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 shadow-md transition-all active:scale-95"
              >
                Completar Datos de Envío <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const CheckoutView = () => {
    const [checkoutData, setCheckoutData] = useState({
      fullName: user ? user.name : '',
      email: user ? user.email : '',
      phone: '', region: '', comuna: '', address: '',
      shippingMethod: 'por_pagar' // 'retiro', 'por_pagar'
    });

    let shippingCost = 0;
    let shippingMethodName = "";
    if (checkoutData.shippingMethod === 'retiro') {
      shippingMethodName = "Retiro en Taller (Gratis)";
    } else {
      shippingMethodName = "Envío por Pagar (Starken/Chilexpress)";
    }

    const finalTotal = cartTotal + shippingCost;

    const handleSubmitCheckout = (e) => {
      e.preventDefault();
      handleProcessPayment(shippingCost, shippingMethodName);
    };

    if (cart.length === 0) {
      setCurrentView('cart');
      return null;
    }

    return (
      <div className="py-24 px-6 md:px-12 max-w-6xl mx-auto animate-in slide-in-from-right-8 duration-500 min-h-screen">
        <div className="flex items-center gap-4 mb-12 border-b border-slate-200 pb-8">
          <button onClick={() => setCurrentView('cart')} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors mr-4">
            <ArrowRight size={20} className="rotate-180 text-slate-600" />
          </button>
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Checkout</h2>
            <p className="text-slate-500 font-medium">Datos de entrega y facturación</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3">
            <form id="checkout-form" onSubmit={handleSubmitCheckout} className="space-y-8">
              
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><User size={20} className="text-blue-600"/> Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Nombre para el envío</label>
                    <input type="text" required value={checkoutData.fullName} onChange={e => setCheckoutData({...checkoutData, fullName: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Email de comprobante</label>
                    <input type="email" required value={checkoutData.email} onChange={e => setCheckoutData({...checkoutData, email: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Teléfono / WhatsApp (Para coordinar envío)</label>
                    <input type="tel" required value={checkoutData.phone} onChange={e => setCheckoutData({...checkoutData, phone: e.target.value})} placeholder="+56 9 1234 5678" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Truck size={20} className="text-blue-600"/> Opciones de Entrega</h3>
                
                <div className="grid grid-cols-1 gap-4 mb-8">
                  <label className={`relative flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${checkoutData.shippingMethod === 'por_pagar' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                    <input type="radio" name="shipping" value="por_pagar" checked={checkoutData.shippingMethod === 'por_pagar'} onChange={() => setCheckoutData({...checkoutData, shippingMethod: 'por_pagar'})} className="sr-only" />
                    <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${checkoutData.shippingMethod === 'por_pagar' ? 'border-blue-600' : 'border-slate-300'}`}>
                      {checkoutData.shippingMethod === 'por_pagar' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-slate-900">Envío por Pagar (Starken / Chilexpress)</h4>
                      <p className="text-xs text-slate-500 mt-1">Pagas el costo exacto del despacho al recibir en tu domicilio o sucursal. Seguro y transparente.</p>
                    </div>
                    <span className="font-bold text-blue-600">$0 ahora</span>
                  </label>

                  <label className={`relative flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${checkoutData.shippingMethod === 'retiro' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                    <input type="radio" name="shipping" value="retiro" checked={checkoutData.shippingMethod === 'retiro'} onChange={() => setCheckoutData({...checkoutData, shippingMethod: 'retiro'})} className="sr-only" />
                    <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${checkoutData.shippingMethod === 'retiro' ? 'border-blue-600' : 'border-slate-300'}`}>
                      {checkoutData.shippingMethod === 'retiro' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-slate-900">Retiro en Taller</h4>
                      <p className="text-xs text-slate-500 mt-1">Machalí / Rancagua. Te avisaremos cuando esté listo para retirar.</p>
                    </div>
                    <span className="font-bold text-green-600">Gratis</span>
                  </label>
                </div>

                {checkoutData.shippingMethod !== 'retiro' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Región</label>
                      <input type="text" required placeholder="Ej: Región Metropolitana" value={checkoutData.region} onChange={e => setCheckoutData({...checkoutData, region: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Comuna</label>
                      <input type="text" required placeholder="Ej: Providencia" value={checkoutData.comuna} onChange={e => setCheckoutData({...checkoutData, comuna: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Dirección completa o Sucursal</label>
                      <input type="text" required placeholder="Ej: Av. Nueva Providencia 1234, Depto 56 o 'Sucursal Starken Centro'" value={checkoutData.address} onChange={e => setCheckoutData({...checkoutData, address: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none" />
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 sticky top-32 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><CreditCard size={20} className="text-blue-600"/> Pago</h3>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-100 text-sm">
                <div className="flex justify-between text-slate-600"><span>Productos ({cartItemsCount})</span><span className="font-medium text-slate-900">{formatPrice(cartTotal)}</span></div>
                <div className="flex justify-between text-slate-600">
                  <span>Envío</span>
                  <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : 'text-slate-900'}`}>
                    {shippingCost === 0 ? (checkoutData.shippingMethod === 'retiro' ? 'Gratis' : 'Por Pagar') : formatPrice(shippingCost)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Total a Pagar Hoy</span>
                <span className="text-3xl font-black text-slate-900">{formatPrice(finalTotal)}</span>
              </div>
              
              <button 
                type="submit"
                form="checkout-form"
                disabled={isProcessingPayment} 
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 shadow-md transition-all active:scale-95"
              >
                {isProcessingPayment ? <><Loader2 size={20} className="animate-spin" /> Procesando con MercadoPago...</> : <>Ir a Pagar <ArrowRight size={20} /></>}
              </button>

              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                  <ShieldCheck size={16} className="text-green-500" /> Transacción encriptada y segura
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OrdersView = () => {
    if (!user) { setCurrentView('home'); return null; }
    
    return (
      <div className="py-24 px-6 md:px-12 max-w-5xl mx-auto min-h-screen animate-in fade-in">
        <div className="flex items-center gap-6 mb-10 border-b border-slate-200 pb-8">
           <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100 flex-shrink-0">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-grow">
            <h2 className="text-3xl font-black text-slate-900">Mis Pedidos</h2>
            <p className="text-slate-500 font-medium">{user.name} • {user.email}</p>
          </div>
          
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold transition-colors text-sm shadow-sm">
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
        <div className="space-y-6">
          {orders.map((order, idx) => {
            const isRetiro = order.shipping && order.shipping.toLowerCase().includes('retiro');
            const step3 = isRetiro ? 'Listo para Retiro' : 'Enviado';
            const orderSteps = ['Pago Recibido', 'En Fabricación', step3, 'Entregado'];

            let currentStepIndex = orderSteps.indexOf(order.status);
            if (currentStepIndex === -1) {
               if (order.status === 'Empacado') currentStepIndex = 2; 
               else currentStepIndex = 0; 
            }

            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col shadow-sm gap-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
                  <div className="flex-grow">
                    <div className="flex flex-wrap gap-2 items-center mb-1">
                      <span className="font-bold text-slate-900 text-lg">{order.id}</span>
                      <span className="text-slate-500 text-sm">• {order.date}</span>
                    </div>
                    {order.shipping && <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-1"><Truck size={12}/> {order.shipping}</p>}
                  </div>
                  
                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-xl font-black text-slate-900">{formatPrice(order.total)}</span>
                  </div>
                </div>

                <div className="w-full py-6 px-2 md:px-8 mt-2 mb-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="relative flex justify-between items-center w-full">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-slate-200 rounded-full z-0"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-blue-600 rounded-full z-0 transition-all duration-1000 ease-out" style={{ width: `${(currentStepIndex / (orderSteps.length - 1)) * 100}%` }}></div>

                    {orderSteps.map((step, stepIdx) => {
                      const isCompleted = stepIdx <= currentStepIndex;
                      const isActive = stepIdx === currentStepIndex;
                      return (
                        <div key={step} className="relative z-10 flex flex-col items-center gap-3">
                          <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center border-[3px] text-[10px] md:text-xs font-bold transition-all duration-500 ${isCompleted ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white border-slate-300 text-slate-400'}`}>
                            {isCompleted ? <Check size={14} /> : stepIdx + 1}
                          </div>
                          <span className={`absolute top-full mt-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-center w-20 leading-tight ${isActive ? 'text-blue-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <ul className="text-slate-600 text-sm mt-4 space-y-2 w-full">
                  {order.items.map((item, i) => (
                    <li key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                      <span className="flex items-center gap-2"><Package size={16} className="text-slate-400"/> {item}</span>
                      {order.status === 'Entregado' && (
                        <button onClick={() => { setItemToReview(item); setShowReviewModal(true); }} className="text-[10px] uppercase tracking-widest font-bold text-blue-600 hover:text-white border border-blue-200 hover:bg-blue-600 px-4 py-2 rounded-full transition-all self-start sm:self-auto flex items-center gap-1 shadow-sm">
                          <Star size={12}/> Dejar Reseña
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const FAQView = () => (
    <div className="py-24 px-6 md:px-12 max-w-4xl mx-auto animate-in fade-in duration-500 min-h-screen">
      <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Preguntas Frecuentes</h2>
      <div className="space-y-6">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-3">{item.q}</h3>
            <p className="text-slate-600 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 p-8 bg-blue-50 rounded-3xl border border-blue-100 text-center">
        <h4 className="font-bold text-blue-900 mb-2">¿Tienes otra consulta?</h4>
        <p className="text-blue-700 text-sm mb-4">Estamos aquí para ayudarte técnica y comercialmente.</p>
        <button onClick={() => setCurrentView('custom')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all">Ir a Contacto</button>
      </div>
    </div>
  );

  const LegalView = () => (
    <div className="py-24 px-6 md:px-12 max-w-4xl mx-auto animate-in fade-in duration-500 min-h-screen">
      <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Términos y Condiciones Legales</h2>
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm prose prose-slate max-w-none text-slate-600 leading-relaxed">
        <h3 className="text-slate-900 font-bold text-xl mb-4">1. Fabricación a Medida</h3>
        <p className="mb-6">Todo proyecto de fabricación a medida (madera, impresión 3D u otros polímeros) comenzará su producción únicamente tras la confirmación de factibilidad y el pago inicial acordado en la cotización formal. Dado que son productos únicos e intransferibles, no existen devoluciones por "arrepentimiento de compra" una vez iniciada la fase de corte o impresión, acorde a la Ley del Consumidor (Derecho a Retracto no aplicable a bienes confeccionados a medida).</p>
        
        <h3 className="text-slate-900 font-bold text-xl mb-4">2. Propiedad Intelectual</h3>
        <p className="mb-6">Los diseños de autor, planimetrías generadas por nuestro taller, y renders finales entregados (ArchViz) están protegidos por derechos de autor. El cliente adquiere una licencia de uso comercial de las imágenes o del producto físico, pero Saiserk se reserva el derecho de exhibir el trabajo finalizado en su portafolio web o redes sociales con fines demostrativos, a menos que se firme un Acuerdo de Confidencialidad (NDA) previo.</p>

        <h3 className="text-slate-900 font-bold text-xl mb-4">3. Logística y Despachos</h3>
        <p className="mb-6">La empresa no se hace responsable por daños sufridos en tránsito cuando la modalidad elegida es "Envío por Pagar" a través de empresas logísticas externas (Starken, Chilexpress, etc.). Nos aseguramos de embalar con máxima protección de grado industrial (plástico burbuja, esquineros, cajas reforzadas). Cualquier reclamo por daño en transporte debe hacerse directamente a la empresa logística con el número de seguimiento proporcionado.</p>
      </div>
    </div>
  );

  const WriteReviewModal = () => {
    const [newReview, setNewReview] = useState({ text: '', rating: 5 });

    const handleSubmitReview = (e) => {
      e.preventDefault();
      const reviewToSave = { name: user.name, role: "Cliente Verificado", product: itemToReview, text: newReview.text, rating: newReview.rating };
      setReviews([reviewToSave, ...reviews]);
      setShowReviewModal(false);
      setItemToReview(null);
      setNewReview({ text: '', rating: 5 }); 
      alert("¡Gracias por tu reseña! Ha sido publicada en la página principal.");
    };

    if (!showReviewModal) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowReviewModal(false)}></div>
        <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl p-8 z-10 animate-in zoom-in-95">
          <button onClick={() => setShowReviewModal(false)} className="absolute top-4 right-4 w-10 h-10 bg-slate-100 text-slate-500 hover:text-slate-900 rounded-full flex items-center justify-center transition-colors"><X size={20} /></button>
          <h3 className="text-2xl font-black text-slate-900 mb-1">Califica tu compra</h3>
          <p className="text-blue-600 text-sm font-bold mb-6 truncate">Producto: {itemToReview}</p>
          
          <form onSubmit={handleSubmitReview} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Calificación</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(star => (
                  <button key={star} type="button" onClick={() => setNewReview({...newReview, rating: star})} className="transition-transform hover:scale-110">
                    <Star size={32} fill={star <= newReview.rating ? "currentColor" : "none"} className={star <= newReview.rating ? "text-amber-400" : "text-slate-300"} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Tu Opinión</label>
              <textarea required rows="4" value={newReview.text} onChange={e => setNewReview({...newReview, text: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none" placeholder="¿Qué te pareció el producto, la calidad o el tiempo de entrega?"></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-md mt-2 flex items-center justify-center gap-2">Publicar Reseña <Check size={18} /></button>
          </form>
        </div>
      </div>
    );
  };

  const AdminView = () => {
    const [adminTab, setAdminTab] = useState('dashboard'); 
    const [showAddProduct, setShowAddProduct] = useState(false); // Estado para el modal de nuevo producto

    if (!isAdmin) {
      setCurrentView('home');
      return null;
    }

    const totalVentas = orders.reduce((sum, o) => sum + o.total, 0);
    const pedidosPendientes = orders.filter(o => o.status !== 'Entregado').length;
    const productosAgotados = products.filter(p => p.stock === 0 && !p.isService).length;

    const handleUpdateOrderStatus = (orderId, newStatus) => {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };

    const handleUpdateProductStock = (productId, newStock) => {
      setProducts(products.map(p => p.id === productId ? { ...p, stock: parseInt(newStock) || 0 } : p));
    };

    return (
      <div className="py-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen animate-in fade-in flex flex-col md:flex-row gap-8">
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-slate-900 rounded-3xl p-6 text-white sticky top-32 shadow-xl">
            <h2 className="text-xl font-black tracking-tight mb-8 flex items-center gap-2"><LayoutDashboard size={24} className="text-blue-400"/> Taller Admin</h2>
            <nav className="space-y-2">
              <button onClick={() => setAdminTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${adminTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}><LayoutDashboard size={18}/> Resumen</button>
              <button onClick={() => setAdminTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${adminTab === 'products' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}><Box size={18}/> Inventario</button>
              <button onClick={() => setAdminTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${adminTab === 'orders' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
                <ClipboardList size={18}/> Pedidos
                {pedidosPendientes > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{pedidosPendientes}</span>}
              </button>
              <button onClick={() => setAdminTab('requests')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${adminTab === 'requests' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
                <Inbox size={18}/> Cotizaciones
                {customRequests.length > 0 && <span className="ml-auto bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{customRequests.length}</span>}
              </button>
            </nav>
          </div>
        </div>

        <div className="flex-grow overflow-x-auto">
          {adminTab === 'dashboard' && (
            <div className="animate-in fade-in">
              <h3 className="text-3xl font-black text-slate-900 mb-6">Panel de Control</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Ingresos Históricos</p>
                  <p className="text-3xl font-black text-slate-900">{formatPrice(totalVentas)}</p>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Órdenes en Curso</p>
                  <p className="text-3xl font-black text-blue-600">{pedidosPendientes}</p>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Avisos de Stock</p>
                  <p className="text-3xl font-black text-red-600">{productosAgotados}</p>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'products' && (
            <div className="animate-in fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-black text-slate-900">Inventario</h3>
                <button onClick={() => setShowAddProduct(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors"><Plus size={16}/> Nuevo Producto</button>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[600px]">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    <tr><th className="p-4">Producto</th><th className="p-4">Categoría</th><th className="p-4">Precio</th><th className="p-4">Stock</th><th className="p-4 text-right">Acciones</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                          <span className="font-bold text-slate-900 max-w-[150px] md:max-w-[200px] truncate" title={p.name}>{p.name}</span>
                        </td>
                        <td className="p-4 text-slate-600 whitespace-nowrap">{p.category}</td>
                        <td className="p-4 font-medium whitespace-nowrap">{formatPrice(p.price)}</td>
                        <td className="p-4">
                          {p.isService ? (
                            <span className="text-slate-400 italic text-xs">Servicio Digital</span>
                          ) : (
                            <input 
                              type="number" 
                              min="0"
                              value={p.stock} 
                              onChange={(e) => handleUpdateProductStock(p.id, e.target.value)}
                              className="w-16 px-2 py-1 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 font-bold"
                            />
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white rounded-lg border border-slate-200 shadow-sm" title="Editar"><Edit size={14}/></button>
                            <button onClick={() => setProducts(products.filter(prod => prod.id !== p.id))} className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-white rounded-lg border border-slate-200 shadow-sm" title="Eliminar"><Trash2 size={14}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {adminTab === 'orders' && (
            <div className="animate-in fade-in">
              <h3 className="text-3xl font-black text-slate-900 mb-6">Gestión de Pedidos</h3>
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                      <div>
                        <span className="font-black text-slate-900 text-lg mr-2">{order.id}</span>
                        <span className="text-slate-500 text-sm">{order.date}</span>
                      </div>
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <label className="text-xs font-bold text-slate-500 uppercase">Estado:</label>
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="bg-slate-50 border border-slate-300 text-slate-900 font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 flex-grow"
                        >
                          <option value="Pago Recibido">Pago Recibido</option>
                          <option value="En Fabricación">En Fabricación</option>
                          <option value="Enviado">Enviado</option>
                          <option value="Listo para Retiro">Listo para Retiro</option>
                          <option value="Entregado">Entregado</option>
                        </select>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 border border-slate-100">
                      <p className="font-bold text-slate-900 mb-2">Contenido de la orden:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {order.items.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                      <div className="mt-4 flex justify-between items-center pt-4 border-t border-slate-200">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1"><Truck size={12}/> {order.shipping || 'Retiro Local'}</span>
                        <span className="font-black text-slate-900 text-lg">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'requests' && (
            <div className="animate-in fade-in">
              <h3 className="text-3xl font-black text-slate-900 mb-6">Bandeja de Cotizaciones</h3>
              {customRequests.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500 shadow-sm flex flex-col items-center">
                  <Inbox size={48} className="text-slate-300 mb-4" />
                  <p className="font-bold">Bandeja vacía</p>
                  <p className="text-sm">Las solicitudes de 'Proyectos a Medida' aparecerán aquí.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {customRequests.map(req => (
                    <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
                      <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4 pl-4">
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg">{req.name}</h4>
                          <a href={`mailto:${req.email}`} className="text-blue-600 text-sm hover:underline">{req.email}</a>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md uppercase tracking-widest">{req.area}</span>
                          <p className="text-xs text-slate-400 mt-2 font-mono">{req.date} • {req.id}</p>
                        </div>
                      </div>
                      <div className="pl-4">
                        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{req.specs}</p>
                        
                        {req.region && (
                          <div className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-700 bg-orange-50 p-3 rounded-xl border border-orange-200">
                            <MapPin size={16} className="text-orange-600" /> Región: {req.region === 'rm' ? 'Metropolitana (Santiago)' : "O'Higgins"} 
                            {req.mapPin && " (Coordenadas adjuntas)"}
                          </div>
                        )}
                        
                        <div className="mt-6 flex justify-end">
                          <a href={`mailto:${req.email}?subject=Cotización Saiserk: Proyecto ${req.id}`} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md">
                            <Mail size={16}/> Responder Cliente
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* MODAL: AÑADIR NUEVO PRODUCTO */}
        {showAddProduct && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddProduct(false)}></div>
            <div className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-[2rem] shadow-2xl p-8 z-10 flex flex-col overflow-y-auto animate-in zoom-in-95">
              <button onClick={() => setShowAddProduct(false)} className="absolute top-4 right-4 w-10 h-10 bg-slate-100 text-slate-500 hover:text-slate-900 rounded-full flex items-center justify-center transition-colors"><X size={20} /></button>
              
              <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2"><Box className="text-blue-600"/> Añadir Nuevo Producto</h3>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  
                  // Crear URL temporal para la imagen si se subió un archivo
                  const imageFile = formData.get('image');
                  const imageUrl = imageFile.size > 0 ? URL.createObjectURL(imageFile) : 'https://placehold.co/800x1000/e2e8f0/475569?text=Nuevo+Producto';

                  const newProduct = {
                    id: Math.floor(Math.random() * 10000),
                    name: formData.get('name'),
                    price: parseInt(formData.get('price')),
                    category: formData.get('category'),
                    stock: parseInt(formData.get('stock')),
                    isService: formData.get('category') === 'Servicios Profesionales',
                    isLimitedEdition: formData.get('category') === 'Edición Limitada',
                    image: imageUrl,
                    gallery: [imageUrl],
                    video: 'https://placehold.co/800x600/94a3b8/ffffff?text=Video+Demo',
                    description: formData.get('description'),
                    howItsMade: formData.get('howItsMade'),
                    dimensions: formData.get('dimensions'),
                    capacity: formData.get('capacity')
                  };
                  
                  setProducts([newProduct, ...products]);
                  setShowAddProduct(false);
                  alert("Producto añadido exitosamente al inventario (Modo Prototipo).");
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Nombre del Producto</label>
                    <input type="text" name="name" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500" placeholder="Ej. Lámpara de Roble..." />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Precio (CLP)</label>
                    <input type="number" name="price" required min="0" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500" placeholder="45000" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-grow">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Categoría</label>
                      <select name="category" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500">
                        <option value="Mobiliario">Mobiliario</option><option value="Herramientas & Taller">Herramientas & Taller</option><option value="Accesorios">Accesorios</option><option value="Edición Limitada">Edición Limitada</option><option value="Servicios Profesionales">Servicios Profesionales</option>
                      </select>
                    </div>
                    <div className="w-1/3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Stock</label>
                      <input type="number" name="stock" required min="0" defaultValue="1" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Descripción Principal</label>
                  <textarea name="description" required rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none" placeholder="Breve resumen comercial del producto..."></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">⚙️ Fabricación</label>
                    <textarea name="howItsMade" required rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500 resize-none" placeholder="Técnicas y materiales..."></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">📏 Dimensiones</label>
                    <textarea name="dimensions" required rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500 resize-none" placeholder="Alto x Ancho..."></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">💪 Capacidad / Extra</label>
                    <textarea name="capacity" required rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500 resize-none" placeholder="Soporta hasta..."></textarea>
                  </div>
                </div>

                <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center relative hover:bg-slate-100 transition-colors">
                  <UploadCloud size={32} className="text-slate-400 mb-2" />
                  <p className="text-sm font-bold text-slate-700">Subir Imagen Principal</p>
                  <p className="text-xs text-slate-500 mb-4">En producción esto se subirá a la nube.</p>
                  <input type="file" name="image" accept="image/*" className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100 gap-4 mt-6">
                  <button type="button" onClick={() => setShowAddProduct(false)} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
                  <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95 flex items-center gap-2">
                    <Check size={18}/> Publicar Producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200 selection:text-blue-900 flex flex-col">
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="cursor-pointer flex items-center gap-2" onClick={() => setCurrentView('home')}>
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center"><span className="text-white font-black">S</span></div>
            <span className="text-xl font-black tracking-tight text-slate-900 hidden sm:block">SAISERK</span>
          </div>

          <nav className="hidden md:flex gap-8 items-center bg-slate-100/50 px-6 py-2 rounded-full border border-slate-200 backdrop-blur-sm">
            <button onClick={() => setCurrentView('home')} className={`text-sm font-semibold transition-colors ${currentView === 'home' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>Inicio</button>
            <button onClick={() => setCurrentView('products')} className={`text-sm font-semibold transition-colors ${currentView === 'products' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>Tienda</button>
            <button onClick={() => setCurrentView('custom')} className={`text-sm font-semibold transition-colors flex items-center gap-1 ${currentView === 'custom' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}><Sparkles size={14}/> Proyectos a Medida</button>
          </nav>

          <div className="flex items-center gap-4 sm:gap-6">
            {isAuthLoading ? (
              <div className="hidden sm:block w-20 h-6 bg-slate-200 animate-pulse rounded-full"></div>
            ) : !user ? (
              <button onClick={handleLogin} className="hidden sm:flex items-center gap-2 text-sm font-bold text-white bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition-colors shadow-md">
                <LogIn size={16} /> Ingresar
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-4 border-r border-slate-200 pr-4">
                <button onClick={() => setCurrentView('orders')} className={`transition-colors flex items-center gap-2 ${currentView === 'orders' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`} title="Ver mi Perfil">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                    {user.photoURL ? <img src={user.photoURL} alt="Perfil" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">{user.name.charAt(0).toUpperCase()}</div>}
                  </div>
                </button>
                {isAdmin && (
                  <button onClick={() => setCurrentView('admin')} className="text-slate-700 hover:text-blue-600 transition-colors" title="Panel de Administración"><LayoutDashboard size={20} /></button>
                )}
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-500" title="Cerrar Sesión"><LogOut size={18} /></button>
              </div>
            )}

            <button onClick={() => setCurrentView('cart')} className="relative p-2 text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-2">
              <span className="hidden md:block text-sm font-bold">Carrito</span>
              <div className="relative">
                <ShoppingCart size={22} />
                {cartItemsCount > 0 && <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">{cartItemsCount}</span>}
              </div>
            </button>
            
            <button className="md:hidden p-2 text-slate-700 bg-slate-100 rounded-lg" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96' : 'max-h-0 border-transparent'}`}>
          <div className="flex flex-col p-6 gap-4">
            <button onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); }} className="text-left text-lg font-bold text-slate-900">Inicio</button>
            <button onClick={() => { setCurrentView('products'); setIsMobileMenuOpen(false); }} className="text-left text-lg font-bold text-slate-900">Tienda</button>
            <button onClick={() => { setCurrentView('custom'); setIsMobileMenuOpen(false); }} className="text-left text-lg font-bold text-blue-600 flex items-center gap-2"><Sparkles size={18}/> Proyectos a Medida</button>
            <hr className="border-slate-100 my-2" />
            {!user ? (
              <button onClick={() => { handleLogin(); setIsMobileMenuOpen(false); }} className="text-left text-lg font-bold text-slate-600 flex items-center gap-2"><LogIn size={20} /> Ingresar con Google</button>
            ) : (
              <>
                <button onClick={() => { setCurrentView('orders'); setIsMobileMenuOpen(false); }} className="text-left text-lg font-bold text-slate-900 flex items-center gap-2">
                  {user.photoURL ? <img src={user.photoURL} alt="P" className="w-6 h-6 rounded-full" /> : <User size={20} />} Mis Pedidos
                </button>
                {isAdmin && (
                  <button onClick={() => { setCurrentView('admin'); setIsMobileMenuOpen(false); }} className="text-left text-lg font-bold text-blue-600 flex items-center gap-2">
                    <LayoutDashboard size={20} /> Panel Admin
                  </button>
                )}
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-left text-base font-medium text-red-500 flex items-center gap-2"><LogOut size={18} /> Cerrar Sesión</button>
              </>
            )}
          </div>
        </div>
      </header>

      <ProductModal />
      <WriteReviewModal />

      <main className="flex-grow pt-20">
        {currentView === 'home' && <HomeView />}
        {currentView === 'products' && <ProductsView />}
        {currentView === 'custom' && <CustomOrderView />}
        {currentView === 'cart' && <CartView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'orders' && <OrdersView />}
        {currentView === 'faq' && <FAQView />}
        {currentView === 'legal' && <LegalView />}
        {currentView === 'admin' && <AdminView />}
      </main>

      <footer className="bg-slate-900 pt-20 pb-10 px-6 relative z-0 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center"><span className="text-slate-900 font-black">S</span></div>
              <span className="text-xl font-black tracking-tight text-white">SAISERK</span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">Diseño integral operando en la intersección de la fabricación digital y el oficio artesanal.</p>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Navegación</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li><button onClick={() => setCurrentView('products')} className="hover:text-white transition-colors">Catálogo de Tienda</button></li>
              <li><button onClick={() => setCurrentView('faq')} className="hover:text-white transition-colors">Preguntas Frecuentes (FAQ)</button></li>
              <li><button onClick={() => setCurrentView('legal')} className="hover:text-white transition-colors">Términos y Condiciones</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Redes</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all"><Mail size={18} /></a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Saiserk Estudio. Todos los derechos reservados.</p>
          <p className="mt-2 md:mt-0 flex items-center gap-2">Despachos a todo Chile continental.</p>
        </div>
      </footer>
    </div>
  );
}
