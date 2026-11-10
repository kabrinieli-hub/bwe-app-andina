const http = require('http');
const os = require('os');

const VERSION = '3.0';
const INICIO = new Date();
const pedidos = [];

const PRODUCTOS = [
  { id: 1,  nombre: 'Quinua blanca',        peso: '500 g',     categoria: 'Granos',         emoji: '🌾', precio: 14.90, origen: 'Puno',          fondo: '#fff3cf', desc: 'Grano andino de cocción rápida. Ideal para sopas, ensaladas y desayunos.' },
  { id: 2,  nombre: 'Kiwicha',              peso: '400 g',     categoria: 'Granos',         emoji: '🌱', precio: 12.50, origen: 'Cusco',         fondo: '#e4f6d8', desc: 'Pequeño grano dorado que se usa reventado, en mazamorras o mezclado con avena.' },
  { id: 3,  nombre: 'Papa nativa mixta',    peso: '1 kg',      categoria: 'Tubérculos',     emoji: '🥔', precio: 9.80,  origen: 'Huancavelica',  fondo: '#f6e6d2', desc: 'Variedades de colores y formas distintas. Perfectas para sancochar u hornear.' },
  { id: 4,  nombre: 'Chuño blanco',         peso: '500 g',     categoria: 'Tubérculos',     emoji: '❄️', precio: 11.00, origen: 'Puno',          fondo: '#e3effa', desc: 'Papa deshidratada de forma tradicional. Se hidrata y se usa en guisos y sopas.' },
  { id: 5,  nombre: 'Maca en polvo',        peso: '250 g',     categoria: 'Superalimentos', emoji: '🌿', precio: 24.90, origen: 'Junín',         fondo: '#efe6d9', desc: 'Raíz de altura molida. Se mezcla en batidos, avena o jugos.' },
  { id: 6,  nombre: 'Camu camu en polvo',   peso: '100 g',     categoria: 'Superalimentos', emoji: '🍒', precio: 29.90, origen: 'Loreto',        fondo: '#fde1e1', desc: 'Fruta amazónica deshidratada con sabor ácido. Va bien en jugos y postres.' },
  { id: 7,  nombre: 'Café de altura',       peso: '250 g',     categoria: 'Bebidas',        emoji: '☕', precio: 26.00, origen: 'Chanchamayo',   fondo: '#ead9cc', desc: 'Café tostado medio en grano, de notas achocolatadas y acidez suave.' },
  { id: 8,  nombre: 'Infusión de muña',     peso: '20 sobres', categoria: 'Bebidas',        emoji: '🍵', precio: 8.50,  origen: 'Ayacucho',      fondo: '#dff3e6', desc: 'Hierba andina aromática. Se toma caliente después de las comidas.' },
  { id: 9,  nombre: 'Cacao en barra 70%',   peso: '100 g',     categoria: 'Dulces',         emoji: '🍫', precio: 13.90, origen: 'Cusco',         fondo: '#e7d6d0', desc: 'Chocolate oscuro de cacao peruano, con poca azúcar y sabor intenso.' },
  { id: 10, nombre: 'Miel de abeja',        peso: '350 g',     categoria: 'Dulces',         emoji: '🍯', precio: 18.00, origen: 'Apurímac',      fondo: '#fdebc0', desc: 'Miel natural, espesa y aromática. Para infusiones, panes y postres.' },
  { id: 11, nombre: 'Ají amarillo molido',  peso: '200 g',     categoria: 'Condimentos',    emoji: '🌶️', precio: 7.90,  origen: 'Huaral',        fondo: '#ffe9c2', desc: 'La base de muchos platos peruanos. Aporta color y un picante moderado.' },
  { id: 12, nombre: 'Sal de Maras',         peso: '300 g',     categoria: 'Condimentos',    emoji: '🧂', precio: 9.50,  origen: 'Cusco',         fondo: '#ececf0', desc: 'Sal rosada obtenida en salineras tradicionales de los Andes.' }
];

const HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#f2f2f7">
<title>Andina Market</title>
<style>
:root{
  --bg:#f2f2f7; --card:#ffffff; --text:#1c1c1e; --muted:#8e8e93; --sep:rgba(60,60,67,.16);
  --fill:rgba(118,118,128,.12); --blue:#007aff; --green:#34c759; --red:#ff3b30;
  --glass:rgba(249,249,249,.78); --shadow:0 1px 2px rgba(0,0,0,.05),0 6px 20px rgba(0,0,0,.05);
}
@media (prefers-color-scheme: dark){
  :root{
    --bg:#000000; --card:#1c1c1e; --text:#ffffff; --muted:#98989f; --sep:rgba(84,84,88,.55);
    --fill:rgba(118,118,128,.24); --blue:#0a84ff; --green:#30d158; --red:#ff453a;
    --glass:rgba(30,30,30,.78); --shadow:none;
  }
}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html{scroll-behavior:smooth}
body{
  background:var(--bg);color:var(--text);
  font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  font-size:17px;line-height:1.35;-webkit-font-smoothing:antialiased;
  padding-bottom:calc(110px + env(safe-area-inset-bottom));
}
button{font:inherit;color:inherit;border:0;background:none;cursor:pointer}
input,select{font:inherit;color:inherit}
.wrap{max-width:1000px;margin:0 auto;padding:0 20px}

.nav{
  position:sticky;top:0;z-index:20;
  background:var(--glass);-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px);
  border-bottom:.5px solid var(--sep);
}
.nav .wrap{height:52px;display:flex;align-items:center;justify-content:space-between}
.marca{font-weight:600;font-size:17px;letter-spacing:-.2px}
.marca span{color:var(--blue)}
.ver{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--muted);background:var(--fill);padding:5px 11px;border-radius:99px}
.ver i{width:7px;height:7px;border-radius:50%;background:var(--green);display:block}

.vista{display:none}
.vista.on{display:block;animation:ent .28s ease}
@keyframes ent{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

.titulo{font-size:34px;font-weight:700;letter-spacing:-.6px;margin:18px 0 2px}
.sub{color:var(--muted);font-size:15px;margin-bottom:14px}

.buscar{position:relative;margin-bottom:12px}
.buscar input{
  width:100%;height:38px;border:0;border-radius:10px;background:var(--fill);
  padding:0 12px 0 36px;font-size:17px;outline:none;
}
.buscar input::placeholder{color:var(--muted)}
.buscar svg{position:absolute;left:11px;top:10px;width:18px;height:18px;stroke:var(--muted);fill:none;stroke-width:2;stroke-linecap:round}

.chips{display:flex;gap:8px;overflow-x:auto;padding:2px 0 12px;scrollbar-width:none}
.chips::-webkit-scrollbar{display:none}
.chip{
  flex:none;padding:7px 14px;border-radius:99px;background:var(--card);font-size:15px;font-weight:500;
  box-shadow:var(--shadow);transition:.15s
}
.chip.on{background:var(--blue);color:#fff}

.barra{display:flex;justify-content:space-between;align-items:center;margin:2px 0 12px;font-size:15px;color:var(--muted)}
.barra select{
  appearance:none;-webkit-appearance:none;border:0;background:var(--fill);border-radius:8px;
  padding:6px 28px 6px 10px;font-size:15px;color:var(--blue);outline:none;
  background-image:linear-gradient(45deg,transparent 50%,var(--blue) 50%),linear-gradient(135deg,var(--blue) 50%,transparent 50%);
  background-position:calc(100% - 15px) 14px,calc(100% - 10px) 14px;background-size:5px 5px,5px 5px;background-repeat:no-repeat;
}

.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
@media(min-width:640px){.grid{grid-template-columns:repeat(3,1fr);gap:16px}}
@media(min-width:900px){.grid{grid-template-columns:repeat(4,1fr)}}
.prod{background:var(--card);border-radius:18px;overflow:hidden;box-shadow:var(--shadow);cursor:pointer;transition:transform .15s}
.prod:active{transform:scale(.97)}
.foto{height:112px;display:flex;align-items:center;justify-content:center;font-size:54px;position:relative}
.fav{position:absolute;top:8px;right:8px;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.7);
  -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);font-size:16px;line-height:30px;color:#ff2d55}
.info{padding:10px 12px 12px}
.info h3{font-size:16px;font-weight:600;letter-spacing:-.2px}
.info p{font-size:13px;color:var(--muted);margin-top:1px}
.fila{display:flex;align-items:center;justify-content:space-between;margin-top:10px}
.precio{font-weight:600;font-size:16px}
.mas{width:30px;height:30px;border-radius:50%;background:var(--blue);color:#fff;font-size:20px;line-height:28px;text-align:center;font-weight:500}
.vacio{text-align:center;color:var(--muted);padding:60px 0}
.vacio b{display:block;font-size:44px;margin-bottom:8px}

.grupo{background:var(--card);border-radius:14px;overflow:hidden;box-shadow:var(--shadow);margin-bottom:18px}
.item{display:flex;align-items:center;gap:12px;padding:12px 14px;position:relative}
.item + .item::before{content:'';position:absolute;top:0;left:14px;right:0;border-top:.5px solid var(--sep)}
.mini{width:52px;height:52px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:28px;flex:none}
.item .t{flex:1;min-width:0}
.item .t b{display:block;font-weight:600;font-size:16px}
.item .t span{font-size:13px;color:var(--muted)}
.paso{display:flex;align-items:center;background:var(--fill);border-radius:99px}
.paso button{width:32px;height:32px;font-size:20px;color:var(--blue)}
.paso span{min-width:18px;text-align:center;font-weight:600;font-size:15px}
.rotulo{font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.3px;margin:0 14px 7px}
.resumen .item{justify-content:space-between;font-size:16px}
.resumen .total{font-weight:700;font-size:18px}
.btn{display:block;width:100%;height:50px;border-radius:14px;background:var(--blue);color:#fff;font-weight:600;font-size:17px;transition:.15s}
.btn:active{opacity:.7}
.btn[disabled]{background:var(--fill);color:var(--muted)}
.nota{font-size:13px;color:var(--muted);text-align:center;margin-top:10px}

.tabs{
  position:fixed;left:50%;transform:translateX(-50%);bottom:calc(14px + env(safe-area-inset-bottom));z-index:30;
  display:flex;gap:4px;padding:6px;border-radius:99px;
  background:var(--glass);-webkit-backdrop-filter:saturate(180%) blur(24px);backdrop-filter:saturate(180%) blur(24px);
  box-shadow:0 8px 30px rgba(0,0,0,.18);border:.5px solid var(--sep);
}
.tab{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;width:84px;padding:7px 0 5px;border-radius:99px;color:var(--muted);font-size:11px;font-weight:500}
.tab svg{width:24px;height:24px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.tab.on{color:var(--blue);background:var(--fill)}
.badge{position:absolute;top:2px;right:20px;min-width:18px;height:18px;border-radius:9px;background:var(--red);color:#fff;font-size:11px;font-weight:700;line-height:18px;text-align:center;padding:0 5px;display:none}

.velo{position:fixed;inset:0;background:rgba(0,0,0,.4);opacity:0;pointer-events:none;transition:.25s;z-index:40}
.velo.on{opacity:1;pointer-events:auto}
.hoja{
  position:fixed;left:50%;bottom:0;transform:translate(-50%,100%);width:100%;max-width:560px;z-index:50;
  background:var(--bg);border-radius:22px 22px 0 0;padding:10px 20px calc(24px + env(safe-area-inset-bottom));
  transition:transform .32s cubic-bezier(.2,.8,.2,1);max-height:90vh;overflow:auto;
}
.hoja.on{transform:translate(-50%,0)}
.asa{width:36px;height:5px;border-radius:3px;background:var(--sep);margin:0 auto 14px}
.detalle .foto{border-radius:18px;height:170px;font-size:84px;margin-bottom:14px}
.detalle h2{font-size:26px;letter-spacing:-.4px}
.detalle .meta{color:var(--muted);font-size:15px;margin:2px 0 12px}
.detalle p.d{font-size:16px;margin-bottom:16px}
.acciones{display:flex;gap:12px;align-items:center}
.acciones .paso{height:50px}
.acciones .paso button{width:44px;height:50px;font-size:22px}
.ok{text-align:center;padding:10px 0}
.ok .chulo{width:72px;height:72px;border-radius:50%;background:var(--green);color:#fff;font-size:38px;line-height:72px;margin:6px auto 14px}
.ok h2{font-size:24px}
.ok p{color:var(--muted);margin:6px 0 20px}

.toast{
  position:fixed;top:64px;left:50%;transform:translate(-50%,-30px);opacity:0;z-index:60;
  background:var(--glass);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);
  padding:10px 18px;border-radius:99px;font-size:15px;font-weight:500;box-shadow:0 6px 24px rgba(0,0,0,.18);
  transition:.3s;pointer-events:none;white-space:nowrap
}
.toast.on{opacity:1;transform:translate(-50%,0)}

.kv{display:flex;justify-content:space-between;gap:16px;padding:13px 14px;font-size:16px;position:relative}
.kv + .kv::before{content:'';position:absolute;top:0;left:14px;right:0;border-top:.5px solid var(--sep)}
.kv span{color:var(--muted);text-align:right}
.kv a{color:var(--blue);text-decoration:none}
.hero-info{display:flex;align-items:center;gap:14px;padding:16px 14px}
.hero-info .ic{width:60px;height:60px;border-radius:14px;background:linear-gradient(180deg,#ffb340,#ff9500);color:#fff;font-size:30px;font-weight:700;display:flex;align-items:center;justify-content:center}
.hero-info b{font-size:20px;display:block}
.hero-info small{color:var(--muted);font-size:14px}
</style>
</head>
<body>

<header class="nav"><div class="wrap">
  <div class="marca">Andina <span>Market</span></div>
  <div class="ver"><i></i>Versión __VERSION__</div>
</div></header>

<main class="wrap">

  <section id="v-tienda" class="vista on">
    <h1 class="titulo">Tienda</h1>
    <p class="sub">Productos de los Andes y la selva · Envío gratis desde S/ 100</p>
    <div class="buscar">
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
      <input id="q" type="search" placeholder="Buscar productos" oninput="buscar(this.value)">
    </div>
    <div class="chips" id="chips"></div>
    <div class="barra">
      <span id="cuenta"></span>
      <select id="orden" onchange="ordenar(this.value)">
        <option value="dest">Destacados</option>
        <option value="asc">Precio: menor a mayor</option>
        <option value="desc">Precio: mayor a menor</option>
        <option value="fav">Solo favoritos</option>
      </select>
    </div>
    <div class="grid" id="grid"></div>
  </section>

  <section id="v-carrito" class="vista">
    <h1 class="titulo">Carrito</h1>
    <p class="sub" id="carrito-sub"></p>
    <div id="carrito"></div>
  </section>

  <section id="v-info" class="vista">
    <h1 class="titulo">Acerca de</h1>
    <p class="sub">Estado de la aplicación y del despliegue</p>
    <div id="info"></div>
  </section>

</main>

<nav class="tabs">
  <button class="tab on" id="t-tienda" onclick="ir('tienda')">
    <svg viewBox="0 0 24 24"><path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>Tienda
  </button>
  <button class="tab" id="t-carrito" onclick="ir('carrito')">
    <svg viewBox="0 0 24 24"><path d="M6 8h12l1 12H5z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>Carrito<b class="badge" id="badge">0</b>
  </button>
  <button class="tab" id="t-info" onclick="ir('info')">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>Acerca de
  </button>
</nav>

<div class="velo" id="velo" onclick="cerrar()"></div>
<div class="hoja" id="hoja"></div>
<div class="toast" id="toast"></div>

<script>
var P = [], C = {}, F = {}, cat = 'Todos', q = '', orden = 'dest';
var CATS = ['Todos', 'Granos', 'Tubérculos', 'Superalimentos', 'Bebidas', 'Dulces', 'Condimentos'];

function $(s){ return document.querySelector(s); }
function money(n){ return 'S/ ' + n.toFixed(2); }
function leer(k, d){ try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } }
function guardar(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
function prod(id){ return P.filter(function(p){ return p.id === id; })[0]; }
function totalItems(){ var n = 0; for (var k in C) n += C[k]; return n; }

function toast(t){
  var e = $('#toast'); e.textContent = t; e.classList.add('on');
  clearTimeout(toast.h); toast.h = setTimeout(function(){ e.classList.remove('on'); }, 1600);
}

function ir(v){
  ['tienda','carrito','info'].forEach(function(x){
    $('#v-' + x).classList.toggle('on', x === v);
    $('#t-' + x).classList.toggle('on', x === v);
  });
  if (v === 'carrito') pintarCarrito();
  if (v === 'info') pintarInfo();
  window.scrollTo(0, 0);
}

function pintarChips(){
  $('#chips').innerHTML = CATS.map(function(c){
    return '<button class="chip' + (c === cat ? ' on' : '') + '" onclick="setCat(\\'' + c + '\\')">' + c + '</button>';
  }).join('');
}
function setCat(c){ cat = c; pintarChips(); pintarGrid(); }
function buscar(v){ q = v.toLowerCase().trim(); pintarGrid(); }
function ordenar(v){ orden = v; pintarGrid(); }

function filtrar(){
  var r = P.filter(function(p){
    var texto = (p.nombre + ' ' + p.origen + ' ' + p.categoria).toLowerCase();
    return (cat === 'Todos' || p.categoria === cat) && texto.indexOf(q) > -1 && (orden !== 'fav' || F[p.id]);
  });
  if (orden === 'asc') r.sort(function(a, b){ return a.precio - b.precio; });
  if (orden === 'desc') r.sort(function(a, b){ return b.precio - a.precio; });
  return r;
}

function pintarGrid(){
  var r = filtrar();
  $('#cuenta').textContent = r.length + (r.length === 1 ? ' producto' : ' productos');
  if (!r.length){
    $('#grid').innerHTML = '<div class="vacio" style="grid-column:1/-1"><b>🔎</b>No encontramos productos</div>';
    return;
  }
  $('#grid').innerHTML = r.map(function(p){
    return '<article class="prod" onclick="abrir(' + p.id + ')">' +
      '<div class="foto" style="background:' + p.fondo + '">' + p.emoji +
      '<button class="fav" onclick="fav(' + p.id + ', event)">' + (F[p.id] ? '♥' : '♡') + '</button></div>' +
      '<div class="info"><h3>' + p.nombre + '</h3><p>' + p.peso + ' · ' + p.origen + '</p>' +
      '<div class="fila"><span class="precio">' + money(p.precio) + '</span>' +
      '<button class="mas" onclick="agregar(' + p.id + ', 1, event)">+</button></div></div></article>';
  }).join('');
}

function fav(id, ev){
  if (ev) ev.stopPropagation();
  if (F[id]) delete F[id]; else F[id] = 1;
  guardar('am_fav', F); pintarGrid();
}

function actualizarBadge(){
  var n = totalItems(), b = $('#badge');
  b.textContent = n; b.style.display = n ? 'block' : 'none';
}
function agregar(id, n, ev){
  if (ev) ev.stopPropagation();
  C[id] = Math.min((C[id] || 0) + n, 20);
  guardar('am_cart', C); actualizarBadge();
  toast('Agregado al carrito');
}
function cambiar(id, d){
  C[id] = (C[id] || 0) + d;
  if (C[id] <= 0) delete C[id];
  guardar('am_cart', C); actualizarBadge(); pintarCarrito();
}

function abrir(id){
  var p = prod(id), n = 1;
  $('#hoja').innerHTML = '<div class="asa"></div><div class="detalle">' +
    '<div class="foto" style="background:' + p.fondo + '">' + p.emoji + '</div>' +
    '<h2>' + p.nombre + '</h2><div class="meta">' + p.categoria + ' · ' + p.peso + ' · Origen: ' + p.origen + '</div>' +
    '<p class="d">' + p.desc + '</p>' +
    '<div class="acciones"><div class="paso"><button onclick="cant(-1)">−</button><span id="cant">1</span><button onclick="cant(1)">+</button></div>' +
    '<button class="btn" id="btn-add">Agregar · ' + money(p.precio) + '</button></div></div>';
  window.cantidad = 1; window.actual = p;
  $('#btn-add').onclick = function(){ agregar(p.id, window.cantidad); cerrar(); };
  $('#velo').classList.add('on'); $('#hoja').classList.add('on');
}
function cant(d){
  window.cantidad = Math.max(1, Math.min(20, window.cantidad + d));
  $('#cant').textContent = window.cantidad;
  $('#btn-add').textContent = 'Agregar · ' + money(window.actual.precio * window.cantidad);
}
function cerrar(){ $('#velo').classList.remove('on'); $('#hoja').classList.remove('on'); }

function calc(){
  var sub = 0;
  for (var id in C){ sub += prod(+id).precio * C[id]; }
  var envio = sub === 0 || sub >= 100 ? 0 : 10;
  return { sub: sub, envio: envio, total: sub + envio };
}

function pintarCarrito(){
  var ids = Object.keys(C);
  var el = $('#carrito');
  $('#carrito-sub').textContent = ids.length ? totalItems() + ' artículos' : '';
  if (!ids.length){
    el.innerHTML = '<div class="vacio"><b>🛒</b>Tu carrito está vacío<br><br>' +
      '<button class="btn" style="max-width:260px;margin:0 auto" onclick="ir(\\'tienda\\')">Ver productos</button></div>';
    return;
  }
  var t = calc();
  el.innerHTML = '<div class="grupo">' + ids.map(function(id){
    var p = prod(+id);
    return '<div class="item"><div class="mini" style="background:' + p.fondo + '">' + p.emoji + '</div>' +
      '<div class="t"><b>' + p.nombre + '</b><span>' + p.peso + ' · ' + money(p.precio) + '</span></div>' +
      '<div class="paso"><button onclick="cambiar(' + p.id + ', -1)">−</button><span>' + C[id] + '</span>' +
      '<button onclick="cambiar(' + p.id + ', 1)">+</button></div></div>';
  }).join('') + '</div>' +
  '<div class="rotulo">Resumen</div><div class="grupo resumen">' +
  '<div class="item"><span>Subtotal</span><span>' + money(t.sub) + '</span></div>' +
  '<div class="item"><span>Envío</span><span>' + (t.envio ? money(t.envio) : 'Gratis') + '</span></div>' +
  '<div class="item total"><span>Total</span><span>' + money(t.total) + '</span></div></div>' +
  '<button class="btn" id="pagar" onclick="pagar()">Finalizar compra</button>' +
  '<p class="nota">Es una tienda de práctica: no se realiza ningún cobro real.</p>';
}

function pagar(){
  var items = Object.keys(C).map(function(id){ return { id: +id, cant: C[id] }; });
  var b = $('#pagar'); b.disabled = true; b.textContent = 'Procesando...';
  fetch('/api/pedido', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(items) })
    .then(function(r){ return r.json(); })
    .then(function(d){
      if (d.error){ toast(d.error); pintarCarrito(); return; }
      C = {}; guardar('am_cart', C); actualizarBadge(); pintarCarrito();
      $('#hoja').innerHTML = '<div class="asa"></div><div class="ok"><div class="chulo">✓</div>' +
        '<h2>¡Pedido confirmado!</h2><p>Número de pedido <b>' + d.numero + '</b><br>Total: ' + money(d.total) + '</p>' +
        '<button class="btn" onclick="cerrar(); ir(\\'tienda\\')">Seguir comprando</button></div>';
      $('#velo').classList.add('on'); $('#hoja').classList.add('on');
    })
    .catch(function(){ toast('No se pudo enviar el pedido'); pintarCarrito(); });
}

function dur(s){
  var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h ? h + ' h ' + m + ' min' : (m ? m + ' min ' + (s % 60) + ' s' : s + ' s');
}
function pintarInfo(){
  fetch('/api/info').then(function(r){ return r.json(); }).then(function(d){
    $('#info').innerHTML =
      '<div class="grupo"><div class="hero-info"><div class="ic">A</div><div><b>Andina Market</b>' +
      '<small>Desplegado automáticamente desde GitHub</small></div></div></div>' +
      '<div class="rotulo">Despliegue</div><div class="grupo">' +
      '<div class="kv">Versión<span>' + d.version + '</span></div>' +
      '<div class="kv">Servidor<span>' + d.servidor + '</span></div>' +
      '<div class="kv">Iniciado<span>' + d.iniciado + '</span></div>' +
      '<div class="kv">Tiempo activo<span>' + dur(d.activo) + '</span></div>' +
      '<div class="kv">Node.js<span>' + d.node + '</span></div></div>' +
      '<div class="rotulo">Actividad</div><div class="grupo">' +
      '<div class="kv">Productos en catálogo<span>' + d.productos + '</span></div>' +
      '<div class="kv">Pedidos recibidos<span>' + d.pedidos + '</span></div></div>' +
      '<div class="rotulo">Enlaces</div><div class="grupo">' +
      '<div class="kv"><a href="/salud">Estado de salud</a><span>/salud</span></div>' +
      '<div class="kv"><a href="/api/productos">Catálogo en JSON</a><span>/api/productos</span></div></div>';
  });
}

C = leer('am_cart', {}); F = leer('am_fav', {});
pintarChips(); actualizarBadge();
fetch('/api/productos').then(function(r){ return r.json(); }).then(function(d){
  P = d;
  for (var id in C){ if (!prod(+id)) delete C[id]; }
  actualizarBadge(); pintarGrid();
});
</script>
</body>
</html>`;

function json(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}

function infoServidor() {
  return {
    version: VERSION,
    servidor: os.hostname(),
    iniciado: INICIO.toLocaleString('es-PE', { timeZone: 'America/Lima' }),
    activo: Math.floor((Date.now() - INICIO.getTime()) / 1000),
    node: process.version,
    productos: PRODUCTOS.length,
    pedidos: pedidos.length
  };
}

http.createServer((req, res) => {
  const ruta = req.url.split('?')[0];

  if (req.method === 'GET' && ruta === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(HTML.replace(/__VERSION__/g, VERSION));
  }
  if (req.method === 'GET' && ruta === '/api/productos') return json(res, 200, PRODUCTOS);
  if (req.method === 'GET' && ruta === '/api/info') return json(res, 200, infoServidor());
  if (req.method === 'GET' && ruta === '/salud') {
    return json(res, 200, { estado: 'ok', version: VERSION, servidor: os.hostname(), activo: infoServidor().activo });
  }

  if (req.method === 'POST' && ruta === '/api/pedido') {
    let cuerpo = '';
    req.on('data', (c) => { cuerpo += c; if (cuerpo.length > 10000) req.destroy(); });
    req.on('end', () => {
      let items;
      try { items = JSON.parse(cuerpo); } catch (e) { return json(res, 400, { error: 'Pedido inválido' }); }
      if (!Array.isArray(items) || !items.length) return json(res, 400, { error: 'El carrito está vacío' });

      let subtotal = 0;
      for (const it of items) {
        const p = PRODUCTOS.find((x) => x.id === it.id);
        if (!p || !Number.isInteger(it.cant) || it.cant < 1 || it.cant > 20) {
          return json(res, 400, { error: 'Producto o cantidad inválidos' });
        }
        subtotal += p.precio * it.cant;
      }
      const envio = subtotal >= 100 ? 0 : 10;
      const total = Math.round((subtotal + envio) * 100) / 100;
      const numero = 'AM-' + String(pedidos.length + 1).padStart(4, '0');
      pedidos.push({ numero, total, fecha: new Date().toISOString() });
      json(res, 200, { numero, total });
    });
    return;
  }

  json(res, 404, { error: 'No encontrado' });
}).listen(3000);
