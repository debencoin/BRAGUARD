const variants = [['Royal Blue','#153ef5'],['Red','#e82836'],['Neon Green','#b9ff13'],['Pink','#f54a9d'],['Purple','#753dcc'],['White','#fff'],['All Black','#151515'],['Teal','#00a89e'],['Maroon & Gold','linear-gradient(135deg,#900020 50%,#ffcc00 50%)'],['Black with Gray Padding','linear-gradient(135deg,#151515 50%,#ccc 50%)'],['Maroon with Gray Padding','linear-gradient(135deg,#900020 50%,#ccc 50%)']];
const rail = document.querySelector('.rail');
const swatches = document.querySelector('.swatches');
const color = document.querySelector('#color');
const size = document.querySelector('#size');
const status = document.querySelector('#status');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let selected = 0;

// Mobile menu
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
function setMenu(open) {
  nav.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', open);
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
menuToggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

const buttons = [];
const images = [];
function show(index) {
  selected = index;
  color.textContent = variants[index][0];
  document.querySelector('.counter').textContent = (index + 1) + ' / ' + variants.length;
  buttons.forEach((button,i) => button.setAttribute('aria-pressed', i === index));
}
function move(index) {
  index = (index + variants.length) % variants.length;
  show(index);
  rail.scrollTo({left:images[index].offsetLeft,behavior:reducedMotion.matches?'instant':'smooth'});
}
variants.forEach(([name,hex], index) => {
  const img = document.createElement('img');
  img.src = 'assets/color-' + index + '.webp';
  img.alt = name + ' BRAGUARD padded sports bra';
  img.draggable = false;
  img.width = 900;
  img.height = 900;
  img.decoding = 'async';
  if (index > 0) img.loading = 'lazy';
  rail.append(img);
  images.push(img);
  const button = document.createElement('button');
  button.type = 'button';
  button.title = name;
  button.setAttribute('aria-label',name);
  button.style.setProperty('--swatch',hex);
  button.onclick = () => move(index);
  swatches.append(button);
  buttons.push(button);
});
rail.addEventListener('scroll', () => {
  if (rail.clientWidth) show(Math.min(variants.length-1,Math.round(rail.scrollLeft/rail.clientWidth)));
},{passive:true});
document.querySelector('.prev').onclick = () => move(selected-1);
document.querySelector('.next').onclick = () => move(selected+1);
rail.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    move(selected + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
document.querySelector('#buy').onclick = () => {
  if (!size.value) { status.textContent = 'Choose a size to continue.'; size.focus(); return; }
  const link = window.BRAGUARD_PAYMENT_LINKS[variants[selected][0]+'|'+size.value];
  if (typeof link === 'string' && /^https:\/\/buy\.stripe\.com\/[A-Za-z0-9_]+$/.test(link)) location.assign(link);
  else status.textContent = 'Live checkout is pending. No payment has been taken.';
};
show(0);
const gallery = document.querySelector('.gallery');
const rotation = document.querySelector('.rotation');
let rotating = !reducedMotion.matches;
function setRotation(value) {
  rotating = value;
  rotation.textContent = value ? 'Pause slideshow' : 'Play slideshow';
}
setRotation(rotating);
rotation.onclick = () => setRotation(!rotating);
[rail,swatches,document.querySelector('.prev'),document.querySelector('.next')].forEach(element => {
  element.addEventListener('pointerdown', () => setRotation(false));
  element.addEventListener('keydown', () => setRotation(false));
});
size.addEventListener('focus', () => setRotation(false));
document.querySelector('#buy').addEventListener('focus', () => setRotation(false));
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) setRotation(false); });
setInterval(() => {
  if (rotating && !document.hidden && !gallery.matches(':hover,:focus-within')) move(selected+1);
}, 5500);
