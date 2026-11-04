// Styles, each with [name, swatch, image file] in display order
const styles = [
  { name: 'Tonal', key: '', colors: [['All Black','#151515','black'],['Pink','#ff2fa0','pink'],['White','#ffffff','white'],['Neon Green','#b9ff13','neon'],['Royal Blue','#1f45e0','blue'],['Red','#e82836','red'],['Maroon','#7a1428','maroon'],['Navy','#1c2a5c','navy'],['Purple','#8a2be2','purple'],['Teal','#16a99a','teal']] },
  { name: 'Gray Pads', key: 'Gray Pads ', colors: [['All Black','#151515','gp-black'],['White','#ffffff','gp-white'],['Neon Green','#7dff00','gp-neon'],['Royal Blue','#1f45e0','gp-blue'],['Red','#b0101c','gp-red']] },
  { name: 'Black Piping', key: 'Black Piping ', colors: [['White','#ffffff','bp-white'],['Neon Green','#a6ff1a','bp-neon'],['Royal Blue','#1f45e0','bp-blue'],['Red','#e8101c','bp-red'],['Purple','#7a1fd6','bp-purple'],['Teal','#16b0a6','bp-teal']] }
];
let styleIndex = 0;
let variants = styles[0].colors;
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

let buttons = [];
let images = [];
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
function buildColors() {
  variants = styles[styleIndex].colors;
  rail.replaceChildren(); swatches.replaceChildren();
  buttons = []; images = [];
  variants.forEach(([name,hex,file], index) => {
    const img = document.createElement('img');
    img.src = 'assets/bra-' + file + '.webp';
    img.alt = name + ' ' + styles[styleIndex].name + ' BRAGUARD padded sports bra';
    img.draggable = false;
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
  rail.scrollLeft = 0;
  show(0);
}
// Style picker
const stylePills = document.querySelector('.style-pills');
const styleName = document.querySelector('#style-name');
const styleButtons = styles.map((s, i) => {
  const b = document.createElement('button');
  b.type = 'button'; b.textContent = s.name;
  b.onclick = () => { styleIndex = i; styleName.textContent = s.name; styleButtons.forEach((x,j) => x.setAttribute('aria-pressed', j === i)); buildColors(); };
  stylePills.append(b);
  return b;
});
styleButtons[0].setAttribute('aria-pressed', true);
styleName.textContent = styles[0].name;
buildColors();
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
  const link = window.BRAGUARD_PAYMENT_LINKS[styles[styleIndex].key + variants[selected][0]+'|'+size.value];
  if (typeof link === 'string' && /^https:\/\/buy\.stripe\.com\/[A-Za-z0-9_]+$/.test(link)) location.assign(link);
  else status.textContent = 'Live checkout is pending. No payment has been taken.';
};
const gallery = document.querySelector('.gallery');
const rotation = document.querySelector('.rotation');
let rotating = !reducedMotion.matches;
function setRotation(value) {
  rotating = value;
  rotation.textContent = value ? 'Pause slideshow' : 'Play slideshow';
}
setRotation(rotating);
rotation.onclick = () => setRotation(!rotating);
[rail,swatches,stylePills,document.querySelector('.prev'),document.querySelector('.next')].forEach(element => {
  element.addEventListener('pointerdown', () => setRotation(false));
  element.addEventListener('keydown', () => setRotation(false));
});
size.addEventListener('focus', () => setRotation(false));
document.querySelector('#buy').addEventListener('focus', () => setRotation(false));
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) setRotation(false); });
setInterval(() => {
  if (rotating && !document.hidden && !gallery.matches(':hover,:focus-within')) move(selected+1);
}, 5500);

// Spotlight video: autoplay muted; tap to play with sound; tap video to pause/resume
const spotVideo = document.querySelector('#spot-video');
const spotPlay = document.querySelector('#spot-play');
if (spotVideo && spotPlay) {
  const tryPlay = () => spotVideo.play().catch(() => {});
  tryPlay();
  spotPlay.addEventListener('click', () => {
    spotVideo.muted = false;
    spotVideo.currentTime = 0;
    spotVideo.controls = true;
    tryPlay();
    spotPlay.hidden = true;
  });
  spotVideo.addEventListener('click', () => {
    if (!spotVideo.controls) { spotPlay.click(); return; }
  });
  if (reducedMotion.matches) { spotVideo.pause(); spotVideo.removeAttribute('autoplay'); }
}

// College edition carousel
(() => {
  const schools = [
    ['Cal', 'cal', 'Cal blue and gold with gold piping.'],
    ['ASU', 'asu', 'ASU maroon and gold with gold piping.'],
    ['Arizona', 'arizona', 'Arizona navy and red with red piping.']
  ];
  const rail = document.querySelector('.school-rail');
  if (!rail) return;
  const pills = document.querySelector('.school-pills');
  const name = document.querySelector('#school-name');
  const desc = document.querySelector('#school-desc');
  const counter = document.querySelector('.school-counter');
  const size = document.querySelector('#school-size');
  const status = document.querySelector('#school-status');
  const imgs = [], btns = [];
  let current = 0;
  function show(i) {
    current = i;
    name.textContent = schools[i][0];
    desc.textContent = schools[i][2] + ' Same four-pad protection, racerback straps and wide underband.';
    counter.textContent = (i + 1) + ' / ' + schools.length;
    btns.forEach((b, j) => b.setAttribute('aria-pressed', j === i));
  }
  function go(i) {
    i = (i + schools.length) % schools.length;
    show(i);
    rail.scrollTo({ left: imgs[i].offsetLeft, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
  schools.forEach(([label, file], i) => {
    const img = document.createElement('img');
    img.src = 'assets/school-' + file + '.webp';
    img.alt = label + ' college edition BRAGUARD sports bra';
    img.width = 900; img.height = 900; img.loading = 'lazy'; img.decoding = 'async'; img.draggable = false;
    rail.append(img); imgs.push(img);
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = label;
    b.onclick = () => go(i);
    pills.append(b); btns.push(b);
  });
  rail.addEventListener('scroll', () => {
    if (rail.clientWidth) show(Math.min(schools.length - 1, Math.round(rail.scrollLeft / rail.clientWidth)));
  }, { passive: true });
  document.querySelector('.school-prev').onclick = () => go(current - 1);
  document.querySelector('.school-next').onclick = () => go(current + 1);
  rail.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); go(current + (e.key === 'ArrowRight' ? 1 : -1)); }
  });
  document.querySelector('#school-buy').onclick = () => {
    if (!size.value) { status.textContent = 'Choose a size to continue.'; size.focus(); return; }
    const link = window.BRAGUARD_PAYMENT_LINKS[schools[current][0] + '|' + size.value];
    if (typeof link === 'string' && /^https:\/\/buy\.stripe\.com\/[A-Za-z0-9_]+$/.test(link)) location.assign(link);
    else status.textContent = 'Live checkout is pending. No payment has been taken.';
  };
  show(0);
  let auto = !reducedMotion.matches;
  const stop = () => { auto = false; };
  [rail, pills, document.querySelector('.school-prev'), document.querySelector('.school-next'), size].forEach(el => { el.addEventListener('pointerdown', stop); el.addEventListener('keydown', stop); });
  setInterval(() => { if (auto && !document.hidden && !rail.parentElement.matches(':hover,:focus-within')) go(current + 1); }, 5000);
})();

// Preorder carousel (coming soon)
(() => {
  const items = [
    ['Black with Gray Pads','linear-gradient(135deg,#151515 50%,#ddd 50%)','black-gray'],
    ['White with Black Piping','#ffffff','white-piping'],
    ['Navy with Black Pads','linear-gradient(135deg,#1c2a5c 50%,#151515 50%)','navy-black'],
    ['Red with Gray Pads','linear-gradient(135deg,#b0101c 50%,#ddd 50%)','red-gray'],
    ['Neon Green with Gray Pads','linear-gradient(135deg,#7dff00 50%,#ddd 50%)','neon-gray'],
    ['White with Gray Pads','linear-gradient(135deg,#ffffff 50%,#ccc 50%)','white-gray'],
    ['Royal Blue with Gray Pads','linear-gradient(135deg,#1f45e0 50%,#ddd 50%)','blue-gray'],
    ['Maroon with Black Piping','#7a1428','maroon-piping'],
    ['Neon Green with Black Piping','#a6ff1a','neon-piping'],
    ['Red with Black Piping','#e8101c','red-piping'],
    ['Purple with Black Piping','#7a1fd6','purple-piping'],
    ['Royal Blue with Black Piping','#1f45e0','blue-piping'],
    ['Teal with Black Piping','#16b0a6','teal-piping'],
    ['Maroon & Gold','linear-gradient(135deg,#8a0f14 50%,#ffc20e 50%)','maroon-gold']
  ];
  const rail = document.querySelector('.pre-rail');
  if (!rail) return;
  const sw = document.querySelector('.pre-swatches');
  const colorEl = document.querySelector('#pre-color');
  const counter = document.querySelector('.pre-counter');
  const size = document.querySelector('#pre-size');
  const status = document.querySelector('#pre-status');
  const imgs = [], btns = [];
  let current = 0;
  function show(i) {
    current = i;
    colorEl.textContent = items[i][0];
    counter.textContent = (i + 1) + ' / ' + items.length;
    btns.forEach((b, j) => b.setAttribute('aria-pressed', j === i));
  }
  function go(i) {
    i = (i + items.length) % items.length;
    show(i);
    rail.scrollTo({ left: imgs[i].offsetLeft, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
  items.forEach(([label, swatch, file], i) => {
    const img = document.createElement('img');
    img.src = 'assets/pre-' + file + '.webp';
    img.alt = label + ' BRAGUARD sports bra, coming soon';
    img.loading = 'lazy'; img.decoding = 'async'; img.draggable = false;
    rail.append(img); imgs.push(img);
    const b = document.createElement('button');
    b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
    b.style.setProperty('--swatch', swatch);
    b.onclick = () => go(i);
    sw.append(b); btns.push(b);
  });
  rail.addEventListener('scroll', () => {
    if (rail.clientWidth) show(Math.min(items.length - 1, Math.round(rail.scrollLeft / rail.clientWidth)));
  }, { passive: true });
  document.querySelector('.pre-prev').onclick = () => go(current - 1);
  document.querySelector('.pre-next').onclick = () => go(current + 1);
  rail.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); go(current + (e.key === 'ArrowRight' ? 1 : -1)); }
  });
  document.querySelector('#pre-buy').onclick = () => {
    if (!size.value) { status.textContent = 'Choose a size to continue.'; size.focus(); return; }
    const link = window.BRAGUARD_PAYMENT_LINKS['Preorder ' + items[current][0] + '|' + size.value];
    if (typeof link === 'string' && /^https:\/\/buy\.stripe\.com\/[A-Za-z0-9_]+$/.test(link)) location.assign(link);
    else status.textContent = 'Preorders open soon. No payment has been taken.';
  };
  show(0);
  let auto = !reducedMotion.matches;
  const stop = () => { auto = false; };
  [rail, sw, document.querySelector('.pre-prev'), document.querySelector('.pre-next'), size].forEach(el => { el.addEventListener('pointerdown', stop); el.addEventListener('keydown', stop); });
  setInterval(() => { if (auto && !document.hidden && !rail.parentElement.matches(':hover,:focus-within')) go(current + 1); }, 5000);
})();
