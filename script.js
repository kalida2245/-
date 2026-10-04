'use strict';
const $ = s => document.querySelector(s), clone = o => JSON.parse(JSON.stringify(o));
const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true } catch { return false } } };
const COL = ['#7357ff', '#3d8bff', '#1fc8b0', '#ff5c93', '#ffb02e', '#8a6cff'];
const CRIT = ['5 упай — бардыгы туура, жообун түшүндүрөт.', '4 упай — 1 ката кетти.', '3 упай — 2–3 ката кетти.', '2 упай — көп ката, кошумча жардам керек.'];
const COMPS = ['Предметтик: темадагы эсептөөлөрдү туура аткарат.', 'Маалыматтык: маалыматты талдап, сүрөттөн жана диаграммадан окуйт.', 'Социалдык-коммуникативдик: жуптарда жана топто иштейт.', 'Өз алдынча уюштуруу: жообун өзү текшерет.'];
const STG = [
  { n: 'Уюштуруу', m: 3, t: 'Саламдашат, даярдыкты текшерет, кызыктуу суроо берет.', s: 'Саламдашат, сабакка даярданат.' },
  { n: 'Үй тапшырмасын текшерүү жана кайталоо', m: 7, t: 'Суроолорду берет, ката кеткен жерлерди түшүндүрөт.', s: 'Тапшырманы көрсөтөт, суроолорго жооп берет.' },
  { n: 'Жаңы теманы түшүндүрүү', m: 15, t: 'Материалды мисалдар жана визуалдык лаборатория менен түшүндүрөт.', s: 'Угат, өзү сынап көрөт, дептерге жазат.' },
  { n: 'Бекитүү', m: 12, t: 'Тапшырма берет, жуптарда иштөөнү уюштурат.', s: 'Тапшырмаларды жуптарда чыгарат.' },
  { n: 'Өз алдынча иш', m: 5, t: 'Көзөмөлдөйт, жардам берет.', s: 'Тапшырманы өз алдынча аткарат.' },
  { n: 'Жыйынтык, баалоо жана үй тапшырмасы', m: 3, t: 'Жыйынтыктайт, баа коёт, үй тапшырмасын түшүндүрөт.', s: 'Рефлексия жүргүзөт, үй тапшырмасын жазып алат.' }];
const PRE = [
  {
    id: 'p1', viz: 'pct', name: 'Пайыздар', fm: ['%', 'p = a : b · 100', '20% = 0,2', 'a · p : 100'],
    goal: 'Окуучулар санды пайызын жана пайызы боюнча санды таба билип, турмуштук маселелерде колдонушат.',
    results: ['Санды пайызын табат.', 'Пайызы боюнча санды табат.', 'Эки санды пайыз менен салыштырат.'],
    examples: ['200 санынын 15% = 200 · 15 : 100 = 30', 'Санынын 20% 40 болсо: сан = 40 : 20 · 100 = 200', '60 санынан 15 канча пайыз? 15 : 60 · 100 = 25%'],
    life: ['Соода: 2500 сомдук көйнөккө 20% арзандатуу болду. Жаңы баасы? (2000 сом)', 'Акча: банкка 10 000 сом салынды, жылына 8% өсөт. Бир жылдан кийин канча болот? (10 800 сом)', 'Курулуш: 50 м² бөлмөнүн 30% ин боёо керек. Канча м²? (15 м²)', 'Күнүмдүк: класста 30 окуучу, 24ү олимпиадага катышты. Канча пайыз? (80%)'],
    tasks: ['80 санынын 25% ин тапкыла. — Жообу: 20', 'Китеп 400 сом, 10% арзандады. Жаңы баасы? — Жообу: 360 сом', 'Санынын 30% 45 болсо, санды тап. — Жообу: 150'],
    hw: 'Китептен 6 пайыз маселеси. Үйдөн дүкөндөгү 3 буюмдун арзандатуудагы баасын эсептөө.'
  },
  {
    id: 'p2', viz: 'eq', name: 'Сызыктуу теңдемелер', fm: ['ax + b = c', 'x = (c − b) : a', '2x + 3 = 11', 'x = 4'],
    goal: 'Окуучулар ax + b = c түрүндөгү теңдемени чыгарып, жообун текшере билишет.',
    results: ['Теңдеменин тамырын түшүндүрөт.', 'Барабардыктын касиеттерин колдонот.', 'Жообун коюп текшерет.'],
    examples: ['2x + 3 = 11 → 2x = 11 − 3 → 2x = 8 → x = 4. Текшерүү: 2·4 + 3 = 11 ✔', '5x − 7 = 18 → 5x = 25 → x = 5', 'x : 3 = 4 → x = 4 · 3 = 12'],
    life: ['Аралык: автобус саатына 60 км жүрөт. 210 км жолго канча убакыт кетет? (3,5 саат)', 'Соода: 3 дептер жана 20 сомдук калем 110 сом турат. Бир дептер канча? (30 сом)', 'Убакыт: сабак 45 мүнөт, x мүнөт өттү, 18 мүнөт калды. x = ? (27 мүнөт)', 'Акча: 500 сом топтоо үчүн күнүнө 25 сом сактайт. Канча күн? (20 күн)'],
    tasks: ['x + 9 = 15 — Жообу: x = 6', '3x = 21 — Жообу: x = 7', '2x − 4 = 10 — Жообу: x = 7', '5x + 2 = 27 — Жообу: x = 5'],
    hw: '6 теңдеме чыгарып, ар бирин текшерүү. 1 турмуштук маселе түзүү.'
  },
  {
    id: 'p3', viz: 'tri', name: 'Үч бурчтуктун бурчтарынын суммасы', fm: ['α + β + γ = 180°', '∠A', '△ABC', '180° − 110° = 70°'],
    goal: 'Окуучулар үч бурчтуктун ички бурчтарынын суммасы 180° экенин билип, белгисиз бурчту табышат.',
    results: ['Теореманы айтып берет.', 'Тең капталдуу жана тик бурчтуу үч бурчтукта бурчту табат.', 'Маселе чыгарууда колдонот.'],
    examples: ['50° + 60° + x = 180° → x = 180° − 110° = 70°', 'Тең капталдуу, чокусу 40° → түбүндөгү бурч (180° − 40°) : 2 = 70°', 'Тик бурчтуу, бир курч бурч 35° → экинчиси 90° − 35° = 55°'],
    life: ['Курулуш: тең капталдуу чатырдын чокусу 80°. Түбүндөгү бурч канча? (50°)', 'Жол белгиси тең жактуу үч бурчтук формасында. Бир бурчу канча? (60°)', 'Аралык: үч бурчтук формасындагы бактын бурчтары 45° жана 65°. Үчүнчүсү? (70°)'],
    tasks: ['Бурчтар 45° жана 65°. Үчүнчүсү? — Жообу: 70°', 'Тик бурчтуу үч бурчтукта курч бурч 28°. Экинчиси? — Жообу: 62°', 'Тең капталдуу, чокусу 100°. Түбүндөгү бурч? — Жообу: 40°'],
    hw: 'Китептен 5 маселе. Үйдөн үч бурчтук формасындагы буюмду таап, бурчун эсептөө.'
  }];
let custom = store.get('topics', []), saved = store.get('plans', {}), cur = store.get('cur', 'p1'), S, raf = 0;
const topics = () => PRE.concat(custom), ft = id => topics().find(t => t.id === id) || PRE[0];
const fresh = id => { const t = ft(id); return { teacher: '', date: '', goal: t.goal || '', results: clone(t.results || ['']), comps: clone(COMPS), examples: clone(t.examples || ['']), life: clone(t.life || ['']), tasks: clone(t.tasks || ['']), criteria: clone(CRIT), hw: t.hw || '', stages: clone(STG) } };
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 2200) }
const fit = e => { e.style.height = 'auto'; e.style.height = e.scrollHeight + 'px' };
function bind(e, g, s) { e.value = g(); fit(e); e.oninput = () => { s(e.value); fit(e) } }
function renderSel() { $('#sel').innerHTML = ''; topics().forEach(t => { const o = document.createElement('option'); o.value = t.id; o.textContent = t.name; o.selected = t.id === cur; $('#sel').appendChild(o) }) }
function renderList(k) {
  const box = document.querySelector(`[data-list="${k}"]`); box.innerHTML = '';
  S[k].forEach((v, i) => {
    const r = document.createElement('div'); r.className = 'li'; const ta = document.createElement('textarea'); bind(ta, () => S[k][i], x => { S[k][i] = x });
    const d = document.createElement('button'); d.textContent = '✕'; d.title = 'Өчүрүү'; d.setAttribute('aria-label', 'Өчүрүү'); d.onclick = () => { S[k].splice(i, 1); renderList(k) }; r.append(ta, d); box.appendChild(r); requestAnimationFrame(() => fit(ta))
  })
}
function renderStages() {
  const box = $('#stages'); box.innerHTML = '';
  S.stages.forEach((st, i) => {
    const d = document.createElement('div'); d.className = 'stage'; d.style.borderLeftColor = COL[i % 6];
    d.innerHTML = '<div class="sh"><input class="nm" aria-label="Этап"><div class="mn"><input type="number" min="0" max="45" aria-label="Мүнөт"><span>мүн</span></div></div><div class="cols"><div class="t"><b>👩‍🏫 Мугалимдин иш-аракети</b><textarea></textarea></div><div class="s"><b>🧑‍🎓 Окуучунун иш-аракети</b><textarea></textarea></div></div>';
    const [n, m] = d.querySelectorAll('input'), [a, b] = d.querySelectorAll('textarea');
    n.value = st.n; n.oninput = () => { st.n = n.value; bar() }; m.value = st.m; m.oninput = () => { st.m = Math.max(0, parseInt(m.value) || 0); bar() };
    bind(a, () => st.t, v => { st.t = v }); bind(b, () => st.s, v => { st.s = v }); box.appendChild(d)
  });
  bar(); requestAnimationFrame(() => box.querySelectorAll('textarea').forEach(fit))
}
function bar() {
  const sum = S.stages.reduce((a, s) => a + s.m, 0), df = sum - 45;
  $('#bar').innerHTML = S.stages.map((s, i) => `<i style="flex:${s.m || .01};background:${COL[i % 6]}" title="${s.n}">${s.m}</i>`).join('');
  const t = $('#total'); t.className = 'total ' + (df ? 'bad' : 'ok'); t.textContent = df ? `Жалпы: ${sum} мүн (${df > 0 ? df + ' мүнөткө ашык' : -df + ' мүнөт жетишпейт'})` : 'Жалпы убакыт: 45 мүнөт ✔'
}
function floaters() {
  const f = ft(cur).fm || ['π', '∑', 'x²', '%', '√', '=', '∠'];
  $('#fl').innerHTML = Array.from({ length: 12 }, (_, i) => `<span style="left:${i * 8.5}%;animation-duration:${9 + i % 4 * 3}s;animation-delay:-${i * 1.7}s">${f[i % f.length]}</span>`).join('')
}
/* Визуалдык лаборатория */
function viz() {
  cancelAnimationFrame(raf); const t = ft(cur), v = $('#viz'); $('#vizCard').hidden = !t.viz; v.innerHTML = ''; if (!t.viz) return;
  ({ pct: vPct, eq: vEq, tri: vTri })[t.viz](v)
}
function vPct(v) {
  v.innerHTML = '<div class="vz"><div class="ctl"><label>Баасы (сом)<input id="pp" type="number" value="2500" min="0"></label><label>Пайыз (%)<input id="pq" type="number" value="20" min="0" max="100"></label><button class="btn" id="pb">▶ Көрсөт</button></div><svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="54" class="donut" stroke="#e9e8ff"/><circle id="dn" cx="80" cy="80" r="54" class="donut" stroke="#ff5c93" transform="rotate(-90 80 80)" stroke-dasharray="0 339.3" stroke-linecap="round"/><text id="dt" x="80" y="88" text-anchor="middle" font-family="Unbounded" font-weight="800" font-size="24" fill="#242552"></text></svg><div class="bars"><div id="b1" style="background:#7357ff"></div><div id="b2" style="background:#1fc8b0"></div></div><p class="res" id="pr"></p></div>';
  const go = () => {
    const P = +$('#pp').value || 0, q = Math.min(100, Math.max(0, +$('#pq').value || 0)), d = P * q / 100, n = P - d;
    $('#dn').setAttribute('stroke-dasharray', `${339.3 * q / 100} 339.3`); $('#dt').textContent = q + '%';
    $('#b1').style.width = '100%'; $('#b1').textContent = 'Баштапкы баа: ' + P + ' сом';
    $('#b2').style.width = (P ? Math.max(n / P * 100, 25) : 25) + '%'; $('#b2').textContent = 'Жаңы баа: ' + (+n.toFixed(2)) + ' сом';
    $('#pr').textContent = `${P} · ${q} : 100 = ${+d.toFixed(2)} сом арзандады`
  };
  $('#pb').onclick = () => { $('#dn').setAttribute('stroke-dasharray', '0 339.3'); $('#b2').style.width = '0'; setTimeout(go, 60) }; setTimeout(go, 300)
}
function vEq(v) {
  v.innerHTML = '<div class="vz"><div class="ctl"><label>a<input id="ea" type="number" value="2"></label><label>b<input id="eb" type="number" value="3"></label><label>c<input id="ec" type="number" value="11"></label><button class="btn" id="en">Кийинки кадам ▶</button><button class="btn soft" id="er">↺ Кайра</button></div><ol class="steps" id="es"></ol></div>';
  let k = 0, L = []; const sg = b => b < 0 ? '−' : '+';
  const build = () => {
    const a = +$('#ea').value, b = +$('#eb').value, c = +$('#ec').value; if (!a) { L = ['a нөлгө барабар болбошу керек (a ≠ 0)']; return }
    const r = c - b, x = +(r / a).toFixed(3); L = [`${a}x ${sg(b)} ${Math.abs(b)} = ${c}`, `${a}x = ${c} ${b < 0 ? '+' : '−'} ${Math.abs(b)}   (${b < 0 ? 'терс' : 'оң'} санды өткөрдүк)`, `${a}x = ${r}`, `x = ${r} : ${a}`, `x = ${x}`, `Текшерүү: ${a} · ${x} ${sg(b)} ${Math.abs(b)} = ${+(a * x + b).toFixed(3)} ✔`]
  };
  const draw = () => { $('#es').innerHTML = L.slice(0, k).map(s => `<li>${s}</li>`).join('') };
  $('#en').onclick = () => { build(); k = Math.min(L.length, k + 1); draw() }; $('#er').onclick = () => { k = 0; draw() };
  ['#ea', '#eb', '#ec'].forEach(s => $(s).oninput = () => { k = 0; draw() }); $('#en').click()
}
function vTri(v) {
  v.innerHTML = '<div class="vz"><svg viewBox="0 0 320 230"><polygon id="tp" fill="rgba(115,87,255,.15)" stroke="#7357ff" stroke-width="4" stroke-linejoin="round"/><text id="ta" font-weight="800" fill="#ff5c93"></text><text id="tb2" font-weight="800" fill="#1fc8b0"></text><text id="tc" font-weight="800" fill="#3d8bff"></text></svg><p class="res" id="ts"></p><div class="ctl"><button class="btn soft" id="tpz">⏸ Тыныгуу</button></div></div>';
  let run = true, t0 = 0; $('#tpz').onclick = () => { run = !run; $('#tpz').textContent = run ? '⏸ Тыныгуу' : '▶ Улантуу' };
  const B = [40, 200], C = [280, 200], ang = (P, Q, R) => { const a = [Q[0] - P[0], Q[1] - P[1]], b = [R[0] - P[0], R[1] - P[1]]; return Math.acos((a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b))) * 180 / Math.PI };
  const f = ts => {
    if (!$('#tp')) return; if (run) t0 += .016; const A = [160 + 95 * Math.sin(t0 * .8), 45 + 25 * Math.cos(t0 * 1.3)];
    $('#tp').setAttribute('points', [A, B, C].join(' '));
    const a = ang(A, B, C), b = ang(B, A, C), c = 180 - a - b, set = (id, p, val, dx, dy) => { const e = $(id); e.setAttribute('x', p[0] + dx); e.setAttribute('y', p[1] + dy); e.textContent = val.toFixed(0) + '°' };
    set('#ta', A, a, -14, -10); set('#tb2', B, b, -6, 24); set('#tc', C, c, -16, 24);
    $('#ts').textContent = `${a.toFixed(0)}° + ${b.toFixed(0)}° + ${c.toFixed(0)}° = ${(a + b + c).toFixed(0)}°`; raf = requestAnimationFrame(f)
  }; raf = requestAnimationFrame(f)
}
function render() {
  S = saved[cur] ? clone(saved[cur]) : fresh(cur); $('#ptitle').textContent = ft(cur).name;
  bind($('#teacher'), () => S.teacher, v => { S.teacher = v }); bind($('#date'), () => S.date, v => { S.date = v }); bind($('#goal'), () => S.goal, v => { S.goal = v }); bind($('#hw'), () => S.hw, v => { S.hw = v });
  ['results', 'comps', 'examples', 'life', 'tasks', 'criteria'].forEach(renderList); renderStages(); floaters(); viz(); $('#bDel').hidden = !cur.startsWith('c'); document.title = ft(cur).name + ' — сабак планы'
}
$('#sel').onchange = e => { cur = e.target.value; store.set('cur', cur); render() };
document.querySelectorAll('[data-add]').forEach(b => b.onclick = () => { const k = b.dataset.add; S[k].push(''); renderList(k); const a = document.querySelectorAll(`[data-list="${k}"] textarea`); a[a.length - 1].focus() });
$('#bNew').onclick = () => {
  const i = $('#newName'), n = i.value.trim(); if (!n) { toast('Теманын аталышын жазыңыз'); i.focus(); return }
  custom.push({ id: 'c' + Date.now(), name: n, goal: '', results: [''], examples: [''], life: [''], tasks: [''] }); store.set('topics', custom); cur = custom[custom.length - 1].id; store.set('cur', cur); i.value = ''; renderSel(); render(); toast('Жаңы тема кошулду 🎉')
};
$('#bSave').onclick = () => { saved[cur] = clone(S); toast(store.set('plans', saved) ? 'План сакталды ✔' : 'Сактоо мүмкүн болгон жок') };
$('#bReset').onclick = () => { if (confirm('Бул теманын сакталган өзгөртүүлөрү өчүрүлсүнбү?')) { delete saved[cur]; store.set('plans', saved); render(); toast('Баштапкы план кайтарылды') } };
$('#bDel').onclick = () => { if (confirm('Тема жана анын планы өчүрүлсүнбү?')) { custom = custom.filter(t => t.id !== cur); store.set('topics', custom); delete saved[cur]; store.set('plans', saved); cur = 'p1'; store.set('cur', cur); renderSel(); render(); toast('Тема өчүрүлдү') } };
const fitAll = () => document.querySelectorAll('textarea').forEach(fit);
$('#bPrint').onclick = () => { fitAll(); print() }; addEventListener('beforeprint', fitAll);
if (!topics().some(t => t.id === cur)) cur = 'p1'; renderSel(); render();
