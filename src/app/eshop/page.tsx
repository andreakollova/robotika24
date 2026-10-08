'use client';

import { useState } from 'react';

const products = [
  {
    id: 'mikina-less-talk',
    name: 'Mikina "Less Talk, More Torque"',
    price: '49,90 €',
    description: 'Prémiová mikina robotika24 so sloganom "Less Talk, More Torque" - menej rečí, viac krútiaceho momentu. Odkaz pre každého, kto radšej tvorí a buduje, než rozpráva. Krútiaci moment je to, čo poháňa každý motor aj každého robota - a presne tak fungujú aj tí najlepší inžinieri.',
    details: ['100% organická bavlna', 'Vnútorný fleece', 'Unisex strih', 'Potlač: sieťotlač', 'Farba: tmavo modrá'],
    images: ['/eshop/mikina-front.png', '/eshop/mikina-back.png'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'mikina-99-problems',
    name: 'Mikina "99 Problems. 6 DOF."',
    price: '49,90 €',
    description: 'Biela mikina so sloganom "99 Problems. 6 DOF." - 99 problémov, ale pohyb medzi nimi nie je jeden z nich. DOF znamená Degrees of Freedom - stupne voľnosti, teda počet smerov, ktorými sa robot dokáže hýbať. Šesť stupňov voľnosti je štandard pre priemyselné robotické ramená. Ak máš 6 DOF, zvládneš čokoľvek.',
    details: ['100% organická bavlna', 'Vnútorný fleece', 'Unisex strih', 'Potlač: sieťotlač', 'Farba: biela'],
    images: ['/eshop/mikina-biela-front.png', '/eshop/mikina-biela-back.png'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'mikina-inverse',
    name: 'Mikina "Trust Me. I\'ve Done the Inverse."',
    price: '49,90 €',
    description: 'Červená mikina so sloganom "Trust Me. I\'ve Done the Inverse." - ver mi, urobil som inverznú úlohu. V robotike je inverzná kinematika jeden z najťažších výpočtov - keď potrebuješ zistiť, ako nastaviť kĺby robota, aby sa jeho ruka dostala presne tam, kam chceš. Kto to zvládol, tomu môžeš veriť.',
    details: ['100% organická bavlna', 'Vnútorný fleece', 'Unisex strih', 'Potlač: sieťotlač', 'Farba: červená'],
    images: ['/eshop/mikina-cervena-front.png', '/eshop/mikina-cervena-back.png'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'tricko-revolute',
    name: 'Tričko "Revolute Joints, Revolutionary Ideas"',
    price: '29,90 €',
    description: 'Biele tričko s nápisom "My joints are revolute. My ideas are revolutionary." - moje kĺby sú rotačné, moje nápady sú revolučné. Revolute joint je základný typ kĺbu v robotike, ktorý sa otáča okolo jednej osi - rovnako ako ľudský lakeť. Slovná hračka spája robotiku s odvahou myslieť inak.',
    details: ['100% organická bavlna', 'Priedušný materiál', 'Unisex strih', 'Potlač: sieťotlač', 'Farba: biela'],
    images: ['/eshop/tricko-front.png', '/eshop/tricko-back.png'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'zapisnik-r24',
    name: 'Zápisník robotika24',
    price: '14,90 €',
    description: 'Elegantný tmavo modrý zápisník s logom robotika24 a guľôčkovým perom. Linkované strany, tvrdé dosky, gumička na zatváranie. Ideálny na poznámky z prednášok, skicovanie robotov alebo plánovanie ďalšieho projektu. Pero s logom robotika24 v balení.',
    details: ['Tvrdé dosky A5', 'Linkované strany', 'Gumička na zatváranie', 'Pero v balení', 'Farba: tmavo modrá'],
    images: ['/eshop/zapisnik.png'],
    sizes: [],
  },
];

function ProductCard({ product, onOrder }: { product: typeof products[0]; onOrder: (p: typeof products[0]) => void }) {
  const [imgIdx, setImgIdx] = useState(0);

  return (
    <div className="product-grid">
      <div>
        <div style={{ backgroundColor: '#f9fafb', borderRadius: 8, overflow: 'hidden', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <img src={product.images[imgIdx]} alt={product.name} style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {product.images.map((img, i) => (
            <button key={i} onClick={() => setImgIdx(i)} style={{ width: 72, height: 72, borderRadius: 6, overflow: 'hidden', border: imgIdx === i ? '2px solid #cb1e26' : '2px solid #e5e7eb', cursor: 'pointer', padding: 0, backgroundColor: '#f9fafb' }}>
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#cb1e26', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Iba na objednávku</span>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0c1a26', marginTop: 8, marginBottom: 8 }}>{product.name}</h2>
        <p style={{ fontSize: 28, fontWeight: 700, color: '#0c1a26', marginBottom: 16 }}>{product.price}</p>
        <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.6, marginBottom: 20 }}>{product.description}</p>
        <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>
          {product.details.map((d) => (
            <li key={d} style={{ fontSize: 14, color: '#374151', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#cb1e26' }}>-</span> {d}
            </li>
          ))}
        </ul>
        <button onClick={() => onOrder(product)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', fontSize: 15, fontWeight: 700, color: '#fff', backgroundColor: '#cb1e26', borderRadius: 24, border: 'none', cursor: 'pointer' }}>
          Objednať
        </button>
        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 12 }}>Po objednávke vás budeme kontaktovať na potvrdenie a dohodnutie doručenia.</p>
      </div>
    </div>
  );
}

function OrderModal({ product, onClose }: { product: typeof products[0]; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', size: 'M', note: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, product: product.name }),
      });
      const data = await res.json();
      setStatus(res.ok ? 'success' : 'error');
      setMsg(data.message || data.error);
    } catch {
      setStatus('error');
      setMsg('Nastala chyba.');
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
      <div style={{ position: 'relative', backgroundColor: '#fff', borderRadius: 12, padding: 32, maxWidth: 480, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9ca3af' }}>x</button>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <img src="/mascot-small.png" alt="" style={{ width: 80, height: 80, margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#166534', marginBottom: 8 }}>Ďakujeme!</h3>
            <p style={{ color: '#15803d', fontSize: 14 }}>{msg}</p>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0c1a26', marginBottom: 4 }}>Objednávka</h3>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>{product.name}</p>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input required placeholder="Meno a priezvisko *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none' }} />
              <input required type="email" placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none' }} />
              <input placeholder="Telefón (voliteľné)" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none' }} />
              {product.sizes.length > 0 && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Veľkosť *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {product.sizes.map(s => (
                    <button key={s} type="button" onClick={() => setForm({ ...form, size: s })} style={{ padding: '8px 16px', fontSize: 14, fontWeight: 600, borderRadius: 8, border: form.size === s ? '2px solid #cb1e26' : '2px solid #e5e7eb', backgroundColor: form.size === s ? '#fef2f2' : '#fff', color: form.size === s ? '#cb1e26' : '#374151', cursor: 'pointer' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              )}
              <textarea placeholder="Poznámka (voliteľné)" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} rows={2} style={{ padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', resize: 'vertical' }} />
              <button type="submit" disabled={status === 'loading'} style={{ padding: '14px', fontSize: 15, fontWeight: 700, color: '#fff', backgroundColor: '#cb1e26', borderRadius: 24, border: 'none', cursor: 'pointer', opacity: status === 'loading' ? 0.7 : 1 }}>
                {status === 'loading' ? 'Odosiela sa...' : 'Odoslať objednávku'}
              </button>
            </form>
            {status === 'error' && <p style={{ color: '#dc2626', fontSize: 13, marginTop: 8, textAlign: 'center' }}>{msg}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default function EshopPage() {
  const [orderProduct, setOrderProduct] = useState<typeof products[0] | null>(null);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 20px 80px' }}>
      <div style={{ borderBottom: '2px solid #cb1e26', marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0c1a26', paddingBottom: 8 }}>Eshop</h1>
      </div>

      {products.map((p) => (
        <ProductCard key={p.id} product={p} onOrder={setOrderProduct} />
      ))}

      {orderProduct && <OrderModal product={orderProduct} onClose={() => setOrderProduct(null)} />}
    </div>
  );
}
