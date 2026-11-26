import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { PaymentTable } from './components/PaymentTable';
import { SearchFilters } from './components/SearchFilters';
import { Gallery } from './components/Gallery';
import { StudentCheck } from './components/StudentCheck';
import { Home } from './components/Home';
import { SearchResults } from './components/Marketplace';
import { DesignDashboard } from './design/Dashboard';
import { termletRooms, termletRegions, termletGalleryLabels } from './catalog';

export function startMarketplace(){
  const roots = new Map();
  function mount(container, content) {
    if (!roots.has(container)) roots.set(container, createRoot(container));
    const viewRoot = roots.get(container);
    flushSync(() => viewRoot.render(content));
  }
  const main=document.querySelector('main');
  const storeKey='termlet-student-prototype-v1';
  const coverage=.10;
  const promotionPlans = {
    standard: {name:'Standard',rate:.15,rank:0,detail:'Regular search placement. We still handle the search.'},
    boosted: {name:'Boosted',rate:.18,rank:1,detail:'Eligible for one of two sponsored spots in matching searches.'},
    featured: {name:'Featured',rate:.20,rank:2,detail:'Homepage spotlight, plus priority for matching sponsored spots.'}
  };
  const promotionFor = l => promotionPlans[Object.hasOwn(promotionPlans,l?.promotion) ? l.promotion : 'standard'];
  const rateFor = l => promotionFor(l).rate;
  const percent = rate => Math.round(rate*100)+'%';
  const money=n=>new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD',maximumFractionDigits:Number.isInteger(n)?0:2}).format(n);
  const cents=n=>Math.round((n+Number.EPSILON)*100)/100;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const numMonth=s=>{const [year,month]=s.split('-').map(Number);return year*12+month-1};
  const monthName=(s,offset=0)=>new Date(2000,numMonth(s)-24000+offset,1).toLocaleDateString('en-CA',{month:'short',year:'numeric'});
  const duration=l=>numMonth(l.end)-numMonth(l.start)+1;
  const roundMonth=(rate,fraction)=>cents(rate*fraction);
  const link=(href,label,alt=false)=>`<a class="btn${alt?' alt':''}" href="#${href}">${esc(label)} <span aria-hidden="true" class="arrow">↗</span></a>`;
  const act=(key,label,alt=false)=>`<button type="button" class="btn${alt?' alt':''}" data-act="${key}">${esc(label)}</button>`;
  const head=(title,sub,back='home',bl='Home')=>`<div class="page-head"><a class="back" href="#${back}">← ${esc(bl)}</a><h1 class="page-title">${esc(title)}</h1><p class="lede">${esc(sub)}</p></div>`;
  const row=(label,value,total=false)=>`<div class="data-row${total?' total':''}"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`;
  const note=s=>`<div class="demo-note">${esc(s)}</div>`;
  const sample=termletRooms.sample;
  const photo=l=>mediaUrl(storedPhotos(l)[0] || 'room.jpg');
  let model={listing:null,requests:{}};try{const prev=JSON.parse(sessionStorage.getItem(storeKey));if(prev&&prev.requests)model=prev}catch{}
  function save(){
    try {sessionStorage.setItem(storeKey,JSON.stringify(model));}
    catch {document.getElementById('storage-status').textContent='This tab could not save your changes. Keep it open to continue this demo.';}
  }
  let newPhotos=[],photoPending=false,photoJob=0;
  const budgetKnee=4500,budgetCeiling=10000;
  let filterSchool='',filterMin='',filterBudget=String(budgetCeiling),filterTerm='',filterStart='',filterEnd='',filterType='',filterHousehold='';
  let budgetCleanup = null;
  const mediaUrl = path => path;
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const samplePhotos = ['room.jpg','gallery/sample-1.webp','gallery/sample-2.webp','gallery/sample-3.webp'];
  const verified = () => model.studentCheck === 'enrolled-demo';
  function storedPhotos(room) {
    const source = room.photos ?? (room.photo ? [room.photo] : []);
    return source.filter(src => typeof src === 'string' && (samplePhotos.includes(src) || src.startsWith('data:image/jpeg;base64,')));
  }
  function listingMonthField(name, label, value) {
    const [year, month] = value.split('-');
    return `<fieldset class="month-field"><legend>${label}</legend><div class="input-pair"><select name="${name}Month" aria-label="${label}, month">${months.map((m,i)=>option(String(i+1).padStart(2,'0'),m,month)).join('')}</select><input name="${name}Year" aria-label="${label}, year" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" required value="${esc(year)}"></div></fieldset>`;
  }
  function termFilters(rooms) {
    const all = Object.values(rooms);
    const years=[...new Set(all.flatMap(l=>[availableFrom(l).slice(0,4),l.end.slice(0,4)]))].sort();
    const monthChoices=years.flatMap(year=>months.map((_,i)=>year+'-'+String(i+1).padStart(2,'0')));
    const periods = [...new Set(all.map(l=>availableFrom(l)+'/'+l.end))].sort();
    const standard = {'01/04':'Winter','05/08':'Summer','09/12':'Fall'};
    const termOptions = periods.map(period=>{
      const [from,to]=period.split('/');
      const season=from.slice(0,4)===to.slice(0,4) && standard[from.slice(5)+'/'+to.slice(5)];
      const label=season ? season+' '+from.slice(0,4)+' · '+months[Number(from.slice(5))-1].slice(0,3)+'–'+months[Number(to.slice(5))-1].slice(0,3) : monthName(from)+' – '+monthName(to);
      return [period,label];
    });
    return { terms: termOptions, months: monthChoices.map(d=>[d,monthName(d)]) };
  }
  function budgetValueAt(position) {
    const p=Math.max(0,Math.min(1,position));
    if(p<=.75)return budgetKnee*p/.75;
    const t=(p-.75)/.25,entry=budgetKnee/3;
    return budgetKnee+entry*t+(budgetCeiling-budgetKnee-entry)*t*t;
  }
  function budgetPositionFor(value) {
    const v=Math.max(0,Math.min(budgetCeiling,value));
    if(v<=budgetKnee)return .75*v/budgetKnee;
    const entry=budgetKnee/3,curve=budgetCeiling-budgetKnee-entry;
    return .75+.25*(Math.sqrt(entry*entry+4*curve*(v-budgetKnee))-entry)/(2*curve);
  }
  function budgetFields() {
    return <fieldset className="budget-field"><legend>Monthly rent (CAD)</legend>
      <div className="budget-track" aria-describedby="budget-step">
        <div className="budget-rail" aria-hidden="true"><div className="budget-selection"></div></div>
        <input id="rent-min" type="range" name="minBudget" min="0" max={budgetCeiling} step="50" defaultValue={filterMin || 0} aria-label="Minimum monthly rent" aria-describedby="budget-step"/>
        <input id="rent-max" type="range" name="budget" min="0" max={budgetCeiling} step="50" defaultValue={filterBudget} aria-label="Maximum monthly rent" aria-describedby="budget-step"/>
        <span className="budget-handle budget-lower" aria-hidden="true"></span>
        <span className="budget-handle budget-upper" aria-hidden="true"></span>
        <output className="budget-bubble" aria-hidden="true"></output>
        <div className="budget-axis" aria-hidden="true"><span>{money(0)}</span><span>{money(budgetKnee)}</span><span>{money(budgetCeiling)}</span></div>
      </div>
      <div className="budget-endpoints"><label htmlFor="rent-min">Minimum <output id="rent-min-value"></output></label><label htmlFor="rent-max">Maximum <output id="rent-max-value"></output></label></div>
      <p id="budget-step" className="sr-only">Drag either end to set the budget, or drag the middle to move both ends. The first three quarters run from $0 to $4,500; the last quarter increases faster to $10,000. Arrow keys adjust the amount; Shift plus an arrow moves the range.</p>
    </fieldset>;
  }
  function updateBudgetSlider(form, changed) {
    const lower = form.elements.minBudget, upper = form.elements.budget;
    if (changed === lower) lower.value = Math.min(Number(lower.value), Number(upper.value));
    if (changed === upper) upper.value = Math.max(Number(upper.value), Number(lower.value));
    const track = form.querySelector('.budget-track');
    const low = Number(lower.value), high = Number(upper.value);
    const lowPosition=budgetPositionFor(low),highPosition=budgetPositionFor(high);
    track.style.setProperty('--low', lowPosition);
    track.style.setProperty('--high', highPosition);
    const lowText = low === 0 ? 'No min' : money(low),highText = money(high);
    form.querySelector('#rent-min-value').textContent = lowText;
    form.querySelector('#rent-max-value').textContent = highText;
    lower.setAttribute('aria-valuetext', low === 0 ? 'No minimum' : money(low) + ' per month');
    upper.setAttribute('aria-valuetext', money(high) + ' per month');
    lower.setAttribute('aria-valuemax', high);
    upper.setAttribute('aria-valuemin', low);
    if (changed) {
      const range = changed === 'range';
      track.style.setProperty('--active-position', range ? (lowPosition+highPosition)/2 : changed===lower?lowPosition:highPosition);
      track.querySelector('.budget-bubble').textContent = range ? money(low) + ' – ' + highText : changed === lower ? lowText : highText;
    }
  }
  function setupBudgetSlider(form) {
    const track=form.querySelector('.budget-track'),lower=form.elements.minBudget,upper=form.elements.budget;
    const step=50,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),snap=v=>Math.round(v/step)*step;
    let dragging=null,frame=0;
    const listeners=new AbortController(),opts={signal:listeners.signal};
    const paint=(low,high,active)=>{
      lower.value=snap(low);upper.value=snap(high);
      updateBudgetSlider(form,active);
      const lp=budgetPositionFor(low),hp=budgetPositionFor(high);
      track.style.setProperty('--low',lp);track.style.setProperty('--high',hp);
      track.style.setProperty('--active-position',active==='range'?(lp+hp)/2:active===lower?lp:hp);
    };
    const commit=(low,high,active,span)=>{
      const lowValue=span==null?snap(low):snap(high)-span;
      const changed=Number(lower.value)!==lowValue||Number(upper.value)!==snap(high);
      paint(low,high,active);
      if(span!=null)lower.value=lowValue;
      if(changed&&form.isConnected)applyFilters(form);
    };
    const draw=()=>{
      frame=0;if(!dragging||!form.isConnected)return;
      const d=dragging,p=clamp((d.x-d.offset-d.left)/d.width,0,1);
      if(d.mode===lower)commit(Math.min(budgetValueAt(p),d.high),d.high,lower);
      else if(d.mode===upper)commit(d.low,Math.max(d.low,budgetValueAt(p)),upper);
      else {
        // Keep the grabbed point beneath the pointer while preserving the dollar span.
        let a=d.span,b=budgetCeiling;
        for(let i=0;i<40;i++){
          const high=(a+b)/2;
          const grab=budgetPositionFor(high-d.span)*(1-d.grab)+budgetPositionFor(high)*d.grab;
          if(grab<p)a=high;else b=high;
        }
        const high=(a+b)/2;commit(high-d.span,high,'range',d.span);
      }
    };
    const move=event=>{if(!dragging||event.pointerId!==dragging.id)return;dragging.x=event.clientX;if(!frame)frame=requestAnimationFrame(draw);};
    const finish=event=>{
      if(!dragging)return;
      if(event?.type==='pointerup'&&event.pointerId===dragging.id)dragging.x=event.clientX;
      cancelAnimationFrame(frame);draw();
      const {mode,id}=dragging;dragging=null;track.classList.remove('is-dragging');
      paint(Number(lower.value),Number(upper.value),mode);
      if(track.hasPointerCapture(id))track.releasePointerCapture(id);
    };
    paint(Number(lower.value),Number(upper.value));
    track.addEventListener('pointerdown',event=>{
      if(!event.isPrimary||event.button!==0||dragging)return;event.preventDefault();
      const r=track.getBoundingClientRect(),width=r.width-32,left=r.left+16;
      const low=Number(lower.value),high=Number(upper.value),lx=left+width*budgetPositionFor(low),hx=left+width*budgetPositionFor(high);
      const a=Math.abs(event.clientX-lx),b=Math.abs(event.clientX-hx),onHandle=Math.min(a,b)<=Math.min(22,(hx-lx)/3);
      const nearest=low===high?(event.clientX<lx?lower:upper):a<b?lower:upper;
      const mode=!onHandle&&event.clientX>lx&&event.clientX<hx?'range':nearest;
      (mode==='range'?lower:mode).focus({preventScroll:true});track.classList.remove('is-keyboard');
      track.dataset.active=mode==='range'?'range':mode.name;track.classList.toggle('is-range',mode==='range');track.classList.add('is-dragging');
      dragging={id:event.pointerId,mode,low,high,span:high-low,grab:high===low?.5:clamp((event.clientX-lx)/(hx-lx),0,1),left,width,offset:mode!=='range'&&onHandle?event.clientX-(mode===lower?lx:hx):0,x:event.clientX};
      track.setPointerCapture(event.pointerId);draw();
    },opts);
    track.addEventListener('pointermove',move,opts);track.addEventListener('pointerup',finish,opts);track.addEventListener('pointercancel',finish,opts);
    track.addEventListener('lostpointercapture',finish,opts);window.addEventListener('blur',finish,opts);
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&dragging){event.preventDefault();finish();}},opts);
    budgetCleanup=()=>{finish();listeners.abort();cancelAnimationFrame(frame);budgetCleanup=null;};
    for(const input of [lower,upper]){
      input.addEventListener('focus',()=>{track.dataset.active=input.name;track.classList.add('is-keyboard');track.classList.remove('is-range');updateBudgetSlider(form,input);},opts);
      input.addEventListener('keydown',event=>{
        const arrow=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key);if(!arrow&&!['Home','End'].includes(event.key))return;
        event.preventDefault();track.classList.add('is-keyboard');let low=Number(lower.value),high=Number(upper.value);
        const direction=['ArrowRight','ArrowUp'].includes(event.key)?1:-1,range=arrow&&event.shiftKey;
        if(range){const shift=clamp(direction*step,-low,budgetCeiling-high);low+=shift;high+=shift;}
        else if(input===lower)low=event.key==='Home'?0:event.key==='End'?high:clamp(low+direction*step,0,high);
        else high=event.key==='Home'?low:event.key==='End'?budgetCeiling:clamp(high+direction*step,low,budgetCeiling);
        track.dataset.active=range?'range':input.name;track.classList.toggle('is-range',range);commit(low,high,range?'range':input);
      },opts);
      input.addEventListener('input',()=>{
        track.dataset.active=input.name;track.classList.remove('is-range');
        paint(Math.min(Number(lower.value),Number(upper.value)),Number(upper.value),input);
      },opts);
    }
  }
  function limitChoices(form) {
    const bound = (select,test) => { for (const o of select.options) o.disabled=!!o.value && test(o.value); };
    const {from,until}=form.elements;
    bound(until,v=>from.value && v<from.value);
    bound(from,v=>until.value && v>until.value);
  }
  const pickerButtons = new WeakMap();
  let activePicker = null, pickerSerial = 0;
  function focusField(input) {
    const button = pickerButtons.get(input);
    if (button) {
      for (const attr of ['aria-invalid','aria-describedby']) {
        if (input.hasAttribute(attr)) button.setAttribute(attr, input.getAttribute(attr));
      }
    }
    (button || input).focus();
  }
  function setupPickers() {
    if (typeof HTMLDialogElement === 'undefined') return;
    for (const select of main.querySelectorAll('select')) {
      const label = select.getAttribute('aria-label') || [...(select.labels?.[0]?.childNodes || [])].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join('').trim() || 'Choose an option';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'picker-trigger';
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-expanded', 'false');
      const sync = () => {
        const value = select.selectedOptions[0]?.textContent || 'Choose…';
        button.innerHTML = `<span>${esc(value)}</span><svg aria-hidden="true" viewBox="0 0 16 16"><path d="m5 6 3-3 3 3M5 10l3 3 3-3"/></svg>`;
        button.setAttribute('aria-label', label + ': ' + value);
        button.disabled = select.disabled;
      };
      sync();
      select.hidden = true;
      select.after(button);
      pickerButtons.set(select, button);
      select.addEventListener('change', () => {
        select.removeAttribute('aria-invalid');
        button.removeAttribute('aria-invalid');
        sync();
      });
      button.addEventListener('click', () => openPicker(select, button, label));
      button.addEventListener('keydown', event => {
        if (['ArrowDown','ArrowUp'].includes(event.key)) {event.preventDefault();openPicker(select, button, label);}
      });
    }
  }
  function openPicker(select, trigger, label) {
    if (activePicker) return;
    const id = 'picker-' + ++pickerSerial, dialog = document.createElement('dialog');
    const searchable = select.options.length > 8;
    dialog.className = 'picker-window';
    dialog.id = id;
    dialog.setAttribute('aria-labelledby', id + '-title');
    dialog.innerHTML = `<div class="picker-header"><h2 id="${id}-title">${esc(label)}</h2><button type="button" class="picker-close" aria-label="Close selection"><svg aria-hidden="true" viewBox="0 0 20 20"><path d="m6 6 8 8M14 6l-8 8"/></svg></button></div>${searchable ? `<div class="picker-search-wrap"><input class="picker-search" type="search" placeholder="Search options" aria-label="Search ${esc(label.toLowerCase())}" autocomplete="off"></div>` : ''}<div class="picker-options" role="listbox" aria-label="${esc(label)}" tabindex="0"></div>`;
    document.body.append(dialog);
    activePicker = dialog;
    trigger.setAttribute('aria-expanded', 'true');
    trigger.setAttribute('aria-controls', id);
    const list = dialog.querySelector('.picker-options');
    const search = dialog.querySelector('.picker-search');
    let activeIndex = select.selectedIndex, closing = false;
    const options = [...select.options];
    const enabled = option => !option.disabled && !option.parentElement.disabled;
    const visible = () => [...list.querySelectorAll('[role=option]:not([aria-disabled=true])')];
    const highlight = index => {
      const item = list.querySelector(`[data-index="${index}"]`);
      list.querySelector('.is-active')?.classList.remove('is-active');
      if (!item || item.getAttribute('aria-disabled') === 'true') {activeIndex=-1;list.removeAttribute('aria-activedescendant');return;}
      activeIndex = index;
      item.classList.add('is-active');
      list.setAttribute('aria-activedescendant', item.id);
      item.scrollIntoView({block:'nearest'});
    };
    const draw = () => {
      const query = (search?.value || '').trim().toLocaleLowerCase();
      let group = null, html = '', count = 0;
      options.forEach((option,index) => {
        const groupName = option.parentElement.tagName === 'OPTGROUP' ? option.parentElement.label : '';
        if (query && !(option.textContent + ' ' + groupName).toLocaleLowerCase().includes(query)) return;
        if (group !== groupName) {
          if (group !== null) html += '</div>';
          group = groupName;
          html += `<div role="group"${group ? ` aria-label="${esc(group)}"` : ''}>${group ? `<p class="picker-group" aria-hidden="true">${esc(group)}</p>` : ''}`;
        }
        count++;
        html += `<div id="${id}-option-${index}" class="picker-option" role="option" data-index="${index}" aria-selected="${option.selected}"${enabled(option) ? '' : ' aria-disabled="true"'}><span>${esc(option.textContent)}</span><svg class="picker-check" aria-hidden="true" viewBox="0 0 20 20"><path d="m5 10 3.5 3.5L15 7"/></svg></div>`;
      });
      if (group !== null) html += '</div>';
      list.innerHTML = count ? html : '<p class="picker-empty" role="status">No matching options</p>';
      const current = list.querySelector(`[data-index="${activeIndex}"]:not([aria-disabled=true])`);
      highlight(Number((current || visible()[0])?.dataset.index ?? -1));
    };
    const close = () => {
      if (closing) return;
      closing = true;
      dialog.classList.add('is-closing');
      const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 140;
      setTimeout(() => {dialog.close();dialog.remove();if (activePicker === dialog) activePicker = null;trigger.setAttribute('aria-expanded','false');trigger.removeAttribute('aria-controls');if (trigger.isConnected) trigger.focus({preventScroll:true});}, delay);
    };
    const choose = index => {
      if (closing || !options[index] || !enabled(options[index])) return;
      select.selectedIndex = index;
      select.dispatchEvent(new Event('change', {bubbles:true}));
      close();
    };
    dialog.querySelector('.picker-close').addEventListener('click', close);
    dialog.addEventListener('cancel', event => {event.preventDefault();close();});
    dialog.addEventListener('keydown', event => {if(event.key==='Escape'){event.preventDefault();close();}});
    dialog.addEventListener('click', event => {
      if (event.target === dialog) {const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}
    });
    list.addEventListener('click', event => {const item=event.target.closest('[role=option]');if(item)choose(Number(item.dataset.index));});
    list.addEventListener('keydown', event => {
      const items = visible(), current = items.findIndex(item => Number(item.dataset.index) === activeIndex);
      let next;
      if(event.key==='ArrowDown')next=Math.min(current+1,items.length-1);
      if(event.key==='ArrowUp')next=Math.max(current-1,0);
      if(event.key==='Home')next=0;
      if(event.key==='End')next=items.length-1;
      if(next!==undefined){event.preventDefault();if(items[next])highlight(Number(items[next].dataset.index));}
      else if(['Enter',' '].includes(event.key)){event.preventDefault();choose(activeIndex);}
      else if(event.key.length===1&&!event.ctrlKey&&!event.metaKey){const match=items.slice(current+1).concat(items.slice(0,current+1)).find(item=>item.textContent.trim().toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()));if(match){event.preventDefault();highlight(Number(match.dataset.index));}}
    });
    search?.addEventListener('input', draw);
    search?.addEventListener('keydown', event => {
      if(event.key==='ArrowDown'){event.preventDefault();list.focus();}
      if(event.key==='Enter'){event.preventDefault();choose(activeIndex);}
    });
    dialog.showModal();
    const rect = trigger.getBoundingClientRect();
    if(innerWidth>620){
      const width=Math.min(410,Math.max(rect.width,320));
      dialog.style.width=width+'px';
      dialog.style.left=Math.max(16,Math.min(innerWidth-width-16,rect.left))+'px';
      const available=innerHeight-rect.bottom-24;
      dialog.style.top=(available>=260?rect.bottom+8:Math.max(16,rect.top-Math.min(480,innerHeight-32)-8))+'px';
      dialog.style.maxHeight=Math.min(480,available>=260?available:innerHeight-32)+'px';
    }
    draw();
    list.focus({preventScroll:true});
  }
  function guide() {
    return `${head('Student sublet guide','A guide to share with your student association, housing group or co-op classmates.')}
    <div class="layout"><section class="panel guide-copy"><h2>Listing your own place</h2><p>Start with the student check, then add your dates, rent and apartment photos. In the proposed service, Termlet would review the listing before taking on the search. Businesses and third-party agents can’t post through this flow.</p>
    <h2>Looking for a room</h2><p>Pick your campus, term and monthly budget. Open the listing to compare rooms, check the full-term cost and request the dates. Student status is only one check. Confirm the person has permission to sublet and review the written terms before sending money.</p>
    <div class="actions">${link('browse','Find a sublet')}${link('list','List my place',true)}</div></section>
    <aside class="panel side"><h2>Campus housing resources</h2><ul class="resource-links"><li><a href="https://wusa.ca/advocacy/housing-playbook/" target="_blank" rel="noopener">WUSA Housing Playbook <span class="arrow" aria-hidden="true">↗</span></a></li><li><a href="https://offcampushousing.utoronto.ca/" target="_blank" rel="noopener">U of T Off-Campus Housing <span class="arrow" aria-hidden="true">↗</span></a></li><li><a href="https://www.torontomu.ca/housing/housing-alternatives/off-campus/resources/" target="_blank" rel="noopener">TMU off-campus housing resources <span class="arrow" aria-hidden="true">↗</span></a></li></ul>
    <h2>Share with students</h2><p>Use this guide link in a club newsletter, student group or campus housing resource list.</p>${act('share-guide','Copy guide link',true)}<p id="share-result" role="status" class="help"></p></aside></div>`;
  }
  function photosFor(key,room) {
    if(key==='own') return storedPhotos(room).map((src,i)=>({src:mediaUrl(src),label:'Photo '+(i+1),alt:'Submitted apartment photo '+(i+1)}));
    const labels=termletGalleryLabels[key];
    return labels.map((label,i)=>{
      if(room.gallerySheet)return {src:mediaUrl(room.image),label,alt:label+' in '+room.title,sheet:true,index:i};
      const cover=room.image || (room.tile ? 'gallery/'+key+'-cover.webp' : 'room.jpg');
      return {src:mediaUrl(i?'gallery/'+key+'-'+i+'.webp':cover),label,alt:i?label+' in '+room.title:room.alt};
    });
  }
  function previewPhotos() {
    return newPhotos.map((src,i)=>`<div class="upload-thumb"><img src="${esc(mediaUrl(src))}" alt="Selected apartment photo ${i+1}"><button type="button" data-remove-photo="${i}" aria-label="Remove photo ${i+1}">Remove</button></div>`).join('');
  }
  async function compressPhoto(file) {
    const url=URL.createObjectURL(file),img=new Image();
    try {
      img.src=url; await img.decode();
      const scale=Math.min(1,850/Math.max(img.width,img.height)), canvas=document.createElement('canvas');
      canvas.width=Math.max(1,Math.round(img.width*scale)); canvas.height=Math.max(1,Math.round(img.height*scale));
      canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
      return canvas.toDataURL('image/jpeg',.68);
    } finally {URL.revokeObjectURL(url);}
  }

  function go(page){if(location.hash==='#'+page)render();else location.hash=page}
  const genderOptions={'':'Not shared',woman:'Woman',man:'Man',nonbinary:'Non-binary',self:'Self-describe'};
  const householdOptions={'':'Not shared',mixed:'Mixed genders',women:'All women',men:'All men',nonbinary:'Non-binary household',none:'No other roommates',self:'Self-describe'};
  const documentNames={lease:'Original signed lease',permission:'Permission to sublet (optional)',agreement:'Signed sublet agreement'};
  let draftDocuments={},documentUrls=new Map();
  model.stays ||= {};
  function householdFields(l){return `<fieldset class="household-fields wide"><legend>People &amp; household</legend><p class="help">Optional details shown on your listing. Describe the people sharing the space, not who is allowed to apply.</p><div class="fields"><label>Your gender<select name="gender">${Object.entries(genderOptions).map(([v,t])=>option(v,t,l.gender||'')).join('')}</select></label><label>Household composition<select name="household">${Object.entries(householdOptions).map(([v,t])=>option(v,t,l.household||'')).join('')}</select></label><label class="self-description gender-description" ${l.gender==='self'?'':'hidden'}>Your gender description<input name="genderText" maxlength="60" value="${esc(l.genderText||'')}"></label><label class="self-description household-description" ${l.household==='self'?'':'hidden'}>Household description<input name="householdText" maxlength="80" value="${esc(l.householdText||'')}"></label><label>Roommates during the sublet<select name="roommates">${option('','Not shared',String(l.roommates??''))}${Array.from({length:9},(_,i)=>option(String(i),i===0?'No other roommates':String(i),String(l.roommates??''))).join('')}</select></label></div></fieldset>`;}
  function householdLabel(l){return l.household==='self'?l.householdText||'Not shared':householdOptions[l.household]||'Not shared';}
  function householdSummary(l){return householdLabel(l)+(l.roommates!==''&&l.roommates!=null&&Number(l.roommates)>0?' · '+l.roommates+' '+(Number(l.roommates)===1?'roommate':'roommates'):'');}
  function demoHousehold(key,l){
    const shared={sample:{gender:'woman',household:'mixed',roommates:'2'},kitchener:{gender:'man',household:'men',roommates:'1'},galt:{gender:'nonbinary',household:'mixed',roommates:'3'}};
    if(shared[key])return shared[key];
    if(l.type==='Private room')return {gender:'woman',household:'women',roommates:'2'};
    return {gender:'',household:'none',roommates:'0'};
  }
  function householdDetails(l){return `<section class="household-details"><h3>People &amp; household</h3>${row('Lister gender',l.gender==='self'?l.genderText||'Not shared':genderOptions[l.gender]||'Not shared')}${row('Household',householdLabel(l))}${row('Other roommates',l.roommates===''||l.roommates==null?'Not shared':String(l.roommates))}</section>`;}
  function docsFor(scope){if(scope==='draft')return draftDocuments;if(scope==='owner')return model.listing.documents ||= {};return model.stays[scope.slice(5)].documents ||= {};}
  function documentList(scope){return Object.entries(docsFor(scope)).map(([kind,d])=>`<div class="document-item"><div><strong>${esc(documentNames[kind])}</strong><span>${esc(d.name)} · ${d.sample?'Sample document':Math.max(1,Math.round(d.size/1024))+' KB'}</span></div><div>${documentUrls.has(d.previewId)?`<a class="inline" href="${esc(documentUrls.get(d.previewId))}" target="_blank" rel="noopener">Preview</a>`:''}<button class="plain-button" type="button" data-remove-doc="${kind}" data-scope="${esc(scope)}"${documentLocked(scope,kind)?' hidden':''}>Remove</button></div></div>`).join('')||'<p class="help">No documents added yet.</p>';}
  function documentPanel(scope,kinds){return `<section class="document-panel ${scope==='draft'?'wide':'panel'}"><h3>Lease documents</h3><p class="help">Use sample documents or fictional PDF, JPG or PNG files, up to 10 MB each. File contents stay in this tab; only filenames and demo status are saved.</p><div class="document-inputs">${kinds.map(kind=>`<div><label>${documentNames[kind]}<input type="file" accept=".pdf,.jpg,.jpeg,.png" data-document="${kind}" data-scope="${esc(scope)}"></label><button class="plain-button" type="button" data-sample-doc="${kind}" data-scope="${esc(scope)}">Use sample ${kind==='agreement'?'signed agreement':kind==='permission'?'permission':'lease'}</button></div>`).join('')}</div><div class="document-list" data-doc-list="${esc(scope)}">${documentList(scope)}</div><p class="error" role="alert" data-doc-error="${esc(scope)}"></p></section>`;}
  function refreshDocuments(scope){const box=main.querySelector(`[data-doc-list="${scope}"]`);if(box)box.innerHTML=documentList(scope);if(scope!=='draft')save();}
  function documentLocked(scope,kind){return scope==='owner'&&kind==='lease'&&model.listing.status!=='review'||scope.startsWith('stay:')&&kind==='agreement'&&model.stays[scope.slice(5)].status==='active';}
  function handleDocument(input){
    const file=input.files?.[0];if(!file)return;
    const scope=input.dataset.scope,kind=input.dataset.document,error=main.querySelector(`[data-doc-error="${scope}"]`);
    input.value='';error.textContent='';
    if(!/\.(pdf|jpe?g|png)$/i.test(file.name)||file.size>10*1024*1024||!file.size){error.textContent='Choose a non-empty PDF, JPG or PNG up to 10 MB.';return;}
    const previous=docsFor(scope)[kind]?.previewId;if(documentUrls.has(previous)){URL.revokeObjectURL(documentUrls.get(previous));documentUrls.delete(previous);}
    const key='doc-'+Date.now()+'-'+Math.random().toString(36).slice(2);
    documentUrls.set(key,URL.createObjectURL(file));docsFor(scope)[kind]={name:file.name,size:file.size,sample:false,previewId:key};refreshDocuments(scope);
  }
  function monthKey(start,offset){const n=numMonth(start)+offset;return Math.floor(n/12)+'-'+String(n%12+1).padStart(2,'0');}
  const dueDate = key => new Date(Number(key.slice(0,4)),Number(key.slice(5))-1,1).toLocaleDateString('en-CA',{day:'numeric',month:'short',year:'numeric'});
  function ownerBills(l){return Array.from({length:duration(l)},(_,i)=>{const key=monthKey(l.start,i),vacant=i<l.vacant,matched=l.status==='matched'&&!vacant;const support=vacant?roundMonth(l.rent,coverage):0,net=matched?cents(l.ask-roundMonth(l.ask,rateFor(l))):0;const balance=cents(l.rent-support-net),paid=l.payments?.[key]?.amount||0;return {key,amount:Math.max(0,balance),credit:Math.max(0,cents(paid-balance)),paid,confirmed:vacant||matched,kind:vacant?'Vacancy support applied':matched?'Net sublet rent scheduled':'Projected · search active'};});}
  function ownerPayments(l){
    const bills=ownerBills(l),confirmed=bills.filter(b=>b.confirmed),paid=cents(bills.reduce((s,b)=>s+b.paid,0)),outstanding=cents(confirmed.reduce((s,b)=>s+Math.max(0,b.amount-b.paid),0)),next=confirmed.find(b=>b.paid<b.amount);
    return `<section class="panel payments-panel"><div class="section-head"><div><div class="kicker">Leaseholder portal</div><h2>Your payments through Termlet</h2></div><span class="pill">Demo payments</span></div><div class="portal-metrics">${metric('Confirmed balance remaining',money(outstanding))}${metric('Paid in this demo',money(paid))}${metric('Next payment',next?dueDate(next.key):confirmed.length?'No payment pending':'Awaiting a confirmed bill')}</div><p class="help">Monthly due dates are the first of each month in this example. Your balance is lease rent minus net subtenant rent or vacancy support. Projected months update when a match or vacant month is confirmed.</p><div data-bills="owner"></div><p class="help">Termlet would coordinate the lease payment. These buttons record simulated payments only.</p></section>`;
  }
  const metric=(label,value)=>`<div><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`;
  function stayBills(s){return Array.from({length:duration(s.listing)},(_,i)=>{const key=monthKey(s.listing.start,i);return {key,amount:s.listing.ask,paid:s.payments?.[key]?.amount||0,confirmed:s.status==='active'};});}
  function stays(){const entries=Object.entries(model.stays);return head('My stay','Your applications, agreements and rent payments in one place.')+(entries.length?`<div class="stay-cards">${entries.map(([key,s])=>`<section class="panel"><span class="pill">${s.status==='active'?'Active sublet':s.status==='agreement'?'Approved · Agreement needed':'Application in review'}</span><h2>${esc(s.listing.title)}</h2><p>${esc(monthName(s.listing.start))} – ${esc(monthName(s.listing.end))} · ${money(s.listing.ask)} / month</p>${link('stay/'+key,'Open my stay')}</section>`).join('')}</div>`:`<section class="empty"><h2>No applications yet</h2><p>Choose a room and request its listed dates to start.</p>${link('browse','Find a sublet')}</section>`);}
  function stayPortal(key){
    const s=model.stays[key];if(!s)return stays();const l=s.listing,bills=stayBills(s),paid=cents(bills.reduce((sum,b)=>sum+b.paid,0)),remaining=cents(l.ask*duration(l)-paid),next=bills.find(b=>b.paid<b.amount);
    const state=s.status==='active'?'Active sublet':s.status==='agreement'?'Application approved':'Application in review';
    return `${head('My stay',l.title,'stays','All my stays')}<div class="layout"><div><section class="panel"><span class="pill">${state}</span><h2 class="portal-title">${s.status==='review'?'Your request is being reviewed':s.status==='agreement'?'Your room is approved':'You’re ready for your stay'}</h2><div class="stage"><strong>Request sent</strong><small>${esc(monthName(l.start))} – ${esc(monthName(l.end))}, at ${money(l.ask)} per month.</small></div><div class="stage"><strong>${s.status==='review'?'Review pending':'Review approved'}</strong><small>Identity, dates and the sublet arrangement would be checked.</small></div><div class="stage"><strong>${s.status==='active'?'Signed agreement added':'Signed agreement needed'}</strong><small>The payment schedule opens after the agreement is added.</small></div>${s.status==='review'?`<div class="actions">${act('stay-approve-'+key,'Simulate approval')}${act('stay-withdraw-'+key,'Withdraw application',true)}</div>`:s.status==='agreement'?`<div class="actions">${act('stay-activate-'+key,'Confirm signed agreement')}</div><p class="error" role="alert" id="stay-error"></p>`:''}</section>${documentPanel('stay:'+key,['agreement'])}<section class="panel"><h3>About your household</h3><p>${esc(householdSummary(l))}</p></section></div><aside class="panel side"><div class="kicker">Renter portal</div><h2>Your rent</h2>${row('Monthly rent paid to Termlet',money(l.ask))}${row('Term dates',monthName(l.start)+' – '+monthName(l.end))}${row('Total rent for the term',money(cents(l.ask*duration(l))))}${row('Paid in this demo',money(paid))}${row(s.status==='active'?'Remaining scheduled rent':'Projected term balance',money(remaining),true)}${row('Next payment date',s.status==='active'&&next?dueDate(next.key):s.status==='active'?'All paid':'After signed agreement')}<p class="help mini">The leaseholder’s service fee is deducted from their proceeds. It is not added to your rent. Payments here are simulated.</p></aside></div><section class="panel payments-panel"><h2>Monthly payment schedule</h2><p class="help">For this demo, rent is due on the first of each month. Payment buttons unlock when your signed agreement is confirmed.</p><div data-bills="stay:${esc(key)}"></div></section>`;
  }
  function newStay(key,l){model.stays[key]={listing:{...l,start:monthKey(l.start,l.vacant),vacant:0},status:'review',documents:{},payments:{}};}

  function promotionChoices(l) {
    const selected = Object.hasOwn(promotionPlans,l.promotion) ? l.promotion : 'standard';
    return `<fieldset class="promotion-options wide"><legend>Choose your reach</legend><p class="help">Optional promotion. These are total fees, including the standard service fee, charged only on rent collected.</p><div class="promotion-grid">${Object.entries(promotionPlans).map(([key,plan])=>`<label class="promotion-card"><input type="radio" name="promotion" value="${key}"${key===selected?' checked':''}><span><strong>${plan.name}</strong><b>${percent(plan.rate)} <small>total fee</small></b><span class="promotion-detail">${plan.detail}</span><span class="promotion-cost" data-plan-cost="${key}"></span></span></label>`).join('')}</div><p class="help">Sponsored spaces are shared and clearly labelled. Promotion does not guarantee views or a match. Vacancy support stays at 10% for every plan. Demo rates; no real charges.</p></fieldset>`;
  }
  function sponsoredFirst(entries) {
    const slots=entries.filter(([,l])=>promotionFor(l).rank>0).sort((a,b)=>promotionFor(b[1]).rank-promotionFor(a[1]).rank).slice(0,2);
    const selected=new Set(slots.map(([key])=>key));
    return [...slots,...entries.filter(([key])=>!selected.has(key))];
  }
  const sponsorBadge = l => promotionFor(l).rank ? `<span class="sponsor-badge">Sponsored · ${promotionFor(l).name}</span>` : '';
  function home() {
    const entries = Object.entries(listings());
    const [id, room] = entries.find(([,room])=>promotionFor(room).rank === 2) || ['sample',listings().sample];
    const spotlight = { item: cardItem([id,room]), picture: photosFor(id,room)[0] };
    return <Home hasListing={!!model.listing} spotlight={spotlight} cards={sponsoredFirst(entries).slice(0,3).map(cardItem)}/>;
  }
  function list(){
    const l=model.listing||{...sample,title:'',photo:''};
    newPhotos=storedPhotos(l);draftDocuments={...(l.documents||{})};photoPending=false;photoJob++;
    return `${head('List your place','Tell us what you’re leaving behind for the term. Use fictional details to try the review process.')}<div class="layout"><form id="listing-form" class="panel" novalidate><p class="student-status">✓ Student status confirmed · Demo</p><h2>Apartment details</h2><div class="fields"><label class="wide">Listing title<input name="title" value="${esc(l.title)}" required maxlength="70" placeholder="e.g. Sunny room near campus"></label><label class="wide">Nearby campus<select name="campus">${campusOptions(l.campus,false)}</select></label><label class="wide">Place type<select name="type">${['Private room','Entire studio','Entire apartment'].map(type=>option(type,type,l.type)).join('')}</select></label><label>Lease rent / month (CAD)<input name="rent" type="number" min="1" max="20000" step=".01" required value="${l.rent}"></label><label>Sublet asking rent / month (CAD)<input name="ask" type="number" min="1" max="20000" step=".01" required value="${l.ask}"></label>${listingMonthField('start','First month away',l.start)}${listingMonthField('end','Last month away',l.end)}${householdFields(l)}${promotionChoices(l)}${documentPanel('draft',['lease','permission'])}<div class="wide"><label>Apartment photos<input name="photo" type="file" multiple accept="image/jpeg,image/png,image/webp"></label><p class="help">Add up to six images. Your first photo is the cover. For this demo, you can use the four sample photos below.</p><button class="plain-button photo-choice" type="button" data-act="photo">Use sample apartment photos</button><div id="photo-preview" class="photo-preview">${previewPhotos()}</div></div></div><p class="error" id="form-error" role="alert"></p><div class="actions"><button type="submit" class="btn">Send for review <span class="arrow" aria-hidden="true">→</span></button></div></form><aside class="panel side"><h2>After you list</h2><div class="step"><strong>We review the apartment</strong><p>Your photos, dates and rent go together for review.</p></div><div class="step"><strong>We handle the search</strong><p>Once approved, the listing becomes available to students looking near your university.</p></div><div class="step"><strong>You can follow the money</strong><p>Your dashboard shows rent still owed whether the place is vacant or matched.</p></div>${rentPreview()}</aside></div>`}
  function empty(){return head('My listing','Track approval, the search and your rent in one place.')+`<div class="empty"><h2>No listing yet</h2><p>Start with an apartment, a photo and your months away.</p>${link('list','List my place')}</div>`}
  const statuses={review:'Awaiting review',active:'Approved · Searching',away:'Moved out · Searching',matched:'Subtenant matched',ended:'Term ended'};
  function dashboard(){
    const l=model.listing;if(!l)return empty();
    const total=duration(l),left=total-l.vacant,matched=l.status==='matched',remainingIncome=matched?cents((l.ask-roundMonth(l.ask,rateFor(l)))*left):0;
    const support=cents(roundMonth(l.rent,coverage)*l.vacant),base=cents(l.rent*total),potential=cents(base-support-remainingIncome);
    const events=[['Sent for review','Your photos, dates and rent are in the application.']];
    if(l.status!=='review')events.push(['Listing approved','Termlet took over the search. The listing is available to prospective subtenants while the search is active.']);
    if(l.moved)events.push(['Move-out date reached','The search continued after Alex moved away.']);
    if(l.vacant)events.push([`${l.vacant} fully vacant ${l.vacant===1?'month':'months'}`,`${money(support)} in total vacancy support for ${l.vacant===1?monthName(l.start):monthName(l.start)+' – '+monthName(l.start,l.vacant-1)}.`]);
    if(matched)events.push(['Subtenant matched',`The demo match covers ${monthName(l.start,l.vacant)} through ${monthName(l.end)} at ${money(l.ask)}/month.`]);
    if(l.status==='ended')events.push(['Term ended','The search has finished for these dates.']);
    const request=model.requests.own;
    const options={review:`<p>Preview what happens when the team approves Alex’s listing.</p>${act('approve','Simulate approval')}`,active:`<p>Try an immediate match, or move forward to see what happens if the apartment is still empty.</p><div class="actions">${act('move','Advance to move-out')}${act('match','Review a possible match',true)}</div>`,away:`<p>The search is active for ${monthName(l.start,l.vacant)}. A month can be either vacant or matched.</p><div class="actions">${act('vacant','Simulate a full vacant month')}${act('match','Review a possible match',true)}</div>`,ended:`<p>Try the same dates again and explore the matched outcome.</p>${act('replay','Replay search',true)}`,matched:`<p>Try the same listing again to see a different search outcome.</p>${act('replay','Replay search',true)}`};
    return `${head('My listing',l.title+' · '+l.campus)}<div class="layout"><div><section class="panel"><span class="pill">${statuses[l.status]}</span><h2 style="margin-top:15px">Listing timeline</h2>${l.status==='review'?`<p class="review-summary">Application received. Photos, lease documents and apartment details are ready for the demo review.</p>`:`<p class="review-summary">Approved in this demo. Your listing is live; documents and payment history are below.</p>`}${events.map(e=>`<div class="stage"><strong>${esc(e[0])}</strong><small>${esc(e[1])}</small></div>`).join('')}${request&&['active','away'].includes(l.status)?`<p class="status-note"><strong>A student requested this room.</strong> Termlet can now arrange a match in the demo.</p>`:''}</section><section class="panel"><div class="kicker">Demo controls</div><h2>Explore the next step</h2>${l.offer&&available(l)?offerReview(l):options[l.status]}${l.status==='review'?`<div class="mini"><a class="inline" href="#list">Edit application</a></div>`:''}</section></div><aside class="panel side"><img src="${photo(l)}" class="sidebar-photo" alt="Submitted apartment"><div class="kicker">Alex’s rent · CAD</div><h2>Term estimate</h2>${row('Promotion plan',promotionFor(l).name+' · '+percent(rateFor(l)))}${row('Months away',monthName(l.start)+' – '+monthName(l.end))}${row('Lease rent for the term',money(base))}${row('Vacancy support to date',money(support))}${matched?row('Sublet rent over matched months',money(cents(l.ask*left)))+row(percent(rateFor(l))+' service fee over matched months',money(cents(roundMonth(l.ask,rateFor(l))*left)))+row('Net sublet income',money(remainingIncome)):row('Sublet income to date',money(0))}${row(potential<0?'Surplus after lease rent':'Alex’s total share for the term',money(Math.abs(potential)),true)}<p class="help mini">${matched?'Estimate for the simulated agreement. Vacancy support stops when the match starts.':'The estimate counts completed vacant months. Future income or support will change it.'}</p>${monthBreakdown(l,matched)}</aside></div>${ownerPayments(l)}${documentPanel('owner',['lease','permission','agreement'])}`}
  function available(l){return l&&['active','away'].includes(l.status)}
  const featuredPlaces = { sample: termletRooms.sample, annex: termletRooms.annex, newToronto: termletRooms.newToronto };
  function listings(){const rooms={...(verified()&&available(model.listing)?{own:model.listing}:{}),...featuredPlaces,...termletRooms};return Object.fromEntries(Object.entries(rooms).map(([key,l])=>[key,{...(key==='own'?{}:demoHousehold(key,l)),...l,promotion:l.promotion||({sample:'featured',annex:'boosted'}[key])||'standard'}]));}
function cardItem([id, room]) {
  const plan = promotionFor(room);
  return { id, room, image: room.image || photo(room), price: money(room.ask),
    dates: monthName(room.start,room.vacant)+' – '+monthName(room.end),
    household: householdSummary(room), sponsor: plan.rank ? plan.name : '' };
}

function monthBreakdown(l,matched){
  const vacancyPayment=roundMonth(l.rent,coverage),fee=roundMonth(l.ask,rateFor(l));
  const leaseGap=matched?cents(l.rent-l.ask+fee):cents(l.rent-vacancyPayment);
  const title=matched?'A matched month':'A fully vacant month';
  return `<section class="monthly"><h3>${title}</h3>${row('Your lease rent',money(l.rent))}${matched?row('Sublet rent collected',money(l.ask))+row(percent(rateFor(l))+' service fee',money(fee)):row('Termlet support',money(vacancyPayment))}${row(leaseGap<0?'Monthly surplus':'You cover for the month',money(Math.abs(leaseGap)),true)}<p class="help">${matched?'Applies in each month covered by the match.':'Illustration for a complete vacant month after approval.'}</p></section>`;
}

function offerReview(l){
  const fee=roundMonth(l.ask,rateFor(l));
  return `<div class="offer"><h3>Review a proposed match</h3><p>Termlet found a student for the remaining dates. Review the terms before you decide.</p>${row('Requested dates',monthName(l.start,l.vacant)+' – '+monthName(l.end))}${row('Monthly sublet rent',money(l.ask))}${row('Monthly fee · '+percent(rateFor(l)),money(fee))}${row('Toward your lease each month',money(cents(l.ask-fee)),true)}<div class="actions">${act('accept-match','Accept match')}${act('decline-match','Keep searching',true)}</div></div>`;
}

function rentPreview(){
  return `<div class="preview-math"><h3>What would I pay in one month?</h3><p class="help">Change the rent or promotion plan to compare your monthly cost.</p><div id="live-estimate" aria-live="polite"></div></div>`;
}

function updateEstimate(){
  const form=document.querySelector('#listing-form'),box=document.querySelector('#live-estimate');if(!form||!box)return;
  const rent=form.elements.rent.valueAsNumber,ask=form.elements.ask.valueAsNumber;
  if(!form.elements.rent.validity.valid||!form.elements.ask.validity.valid){box.textContent='Enter both monthly rents to see the estimate.';for(const cost of form.querySelectorAll('[data-plan-cost]'))cost.textContent='Enter valid rents to compare.';return}
  const plan=promotionFor({promotion:form.elements.promotion.value}),support=roundMonth(rent,coverage),fee=roundMonth(ask,plan.rate),gap=cents(rent-ask+fee);
  for(const cost of form.querySelectorAll('[data-plan-cost]')){const charge=roundMonth(ask,promotionPlans[cost.dataset.planCost].rate);cost.textContent='Fee '+money(charge)+' · You keep '+money(cents(ask-charge));}
  box.innerHTML=row(plan.name+' fee · '+percent(plan.rate),money(fee))+row('You keep from matched rent',money(cents(ask-fee)))+row('Extra fee versus Standard',money(cents(fee-roundMonth(ask,promotionPlans.standard.rate))))+row('If fully vacant, you cover',money(cents(rent-support)))+row(gap<0?'If matched, monthly surplus':'If matched, you cover',money(Math.abs(gap)))+`<p class="help">Includes ${money(support)} of vacancy support or a ${money(fee)} fee on the rent collected.</p>`;
}

function option(value,label,selected){
  return `<option value="${esc(value)}"${value===selected?' selected':''}>${esc(label)}</option>`;
}

function campusOptions(selected,includeRegions){
  const groups=Object.entries(termletRegions);
  const regions=includeRegions
    ? option('','All campuses and regions',selected)+'<optgroup label="By region">'+groups.map(([key,region])=>option('region:'+key,region.name,selected)).join('')+'</optgroup>'
    : '';
  return regions+groups.map(([,group])=>
    `<optgroup label="${esc(group.name)} campuses">${group.campuses.map(name=>option(name,name,selected)).join('')}</optgroup>`
  ).join('');
}

function availableFrom(l){
  const index=numMonth(l.start)+l.vacant;
  return Math.floor(index/12)+'-'+String(index%12+1).padStart(2,'0');
}

function searchResults(rooms){
  const targetCampuses=filterSchool.startsWith('region:') ? termletRegions[filterSchool.slice(7)].campuses : [filterSchool];
  const filtered=Object.entries(rooms).filter(([,l])=>{
    if(filterSchool&&!targetCampuses.some(campus=>l.campus===campus||l.otherCampuses?.includes(campus)))return false;
    if(filterType==='entire'&&!['Entire apartment','Entire studio'].includes(l.type))return false;
    if(filterType==='private'&&l.type!=='Private room')return false;
    if(filterHousehold&&l.household!==filterHousehold)return false;
    if(filterMin&&l.ask<Number(filterMin)||filterBudget&&l.ask>Number(filterBudget))return false;
    const start=availableFrom(l);
    return (!filterStart||filterStart===start)&&(!filterEnd||filterEnd===l.end);
  });
  const applied=!!(filterSchool||filterType||filterHousehold||filterMin||Number(filterBudget)<budgetCeiling||filterStart||filterEnd);
  const limitedBudget=Number(filterBudget)<budgetCeiling;
  const budgetSummary = filterMin && limitedBudget
    ? money(Number(filterMin))+'–'+money(Number(filterBudget))+' per month'
    : limitedBudget ? 'Up to '+money(Number(filterBudget))+' per month'
    : filterMin ? 'From '+money(Number(filterMin))+' per month' : '';
  return <SearchResults items={sponsoredFirst(filtered).map(cardItem)} applied={applied} budgetSummary={budgetSummary}/>;
}

function browse(){
  const current = { school:filterSchool, type:filterType, household:filterHousehold, term:filterTerm, from:filterStart, until:filterEnd };
  const households = ['women','men','mixed','nonbinary','none'].map(value=>[value,householdOptions[value]]);
  return <SearchFilters current={current} {...termFilters(listings())} households={households} budget={budgetFields()}/>;
}

function applyFilters(form){
  const data=new FormData(form),term=String(data.get('term'));
  const [from,until]=term==='custom'?[String(data.get('from')),String(data.get('until'))]:term?term.split('/'):['',''];
  filterTerm=term;filterStart=from;filterEnd=until;
  filterSchool=String(data.get('school'));filterType=String(data.get('placeType'));filterHousehold=String(data.get('household')||'');
  filterBudget=String(data.get('budget'));
  filterMin=data.get('minBudget')==='0'?'':String(data.get('minBudget'));
  const results=document.getElementById('search-results');
  const previous=new Map([...results.querySelectorAll('.listing-card')].map(card=>[card.dataset.listing,card]));
  mount(results, searchResults(listings()));
  const keys=[...results.querySelectorAll('.listing-card')].map(card=>card.dataset.listing);
  if(keys.join('|')!==[...previous.keys()].join('|'))fadeResults(results.querySelector('.grid-cards'),previous);

}


function fadeResults(grid,previous=new Map()) {
  if(!grid||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const dragging=!!document.querySelector('.budget-track.is-dragging');
  const targets=dragging?[...grid.querySelectorAll('.listing-card')].filter(card=>!previous.has(card.dataset.listing)):[grid];
  for(const target of targets){
    target.getAnimations().forEach(animation=>animation.cancel());
    target.animate([{opacity:dragging?.65:.45,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:dragging?160:230,easing:'cubic-bezier(.2,.65,.3,1)'});
  }
}


function room(key){
  const rooms=listings();
  const l=Object.hasOwn(rooms,key)?rooms[key]:null;
  if(!l)return head('Room unavailable','This listing is unavailable for this term. Your search filters are saved.','browse','Search results')+link('browse','Back to results');
  const where=l.area&&l.area!==l.city?`${l.area} · ${l.city}, Ontario`:l.city?`${l.city}, Ontario`:l.campus;
  const requested=!!model.requests[key];
  if(requested&&!model.stays[key]){newStay(key,l);save();}
  const months=duration(l)-l.vacant;
  return `${head(l.title,where,'browse','Search results')}${promotionFor(l).rank?`<p class="sponsor-disclosure">${sponsorBadge(l)} <span>The leaseholder chose paid promotion.</span></p>`:''}<div class="layout details">
    <section class="panel detail-room"><div id="room-gallery"></div><h2>About this place</h2><p>${esc(l.description||'A student sublet listed for the dates shown. Termlet handles the search and coordinates requests with the leaseholder.')}</p>
    ${l.features?`<ul class="amenities">${l.features.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`:''}
    ${l.luxury?'<p class="help mini">Luxury demo apartment · The monthly price covers the entire unit. Interiors and pricing are illustrative.</p>':''}${householdDetails(l)}<h3>Campus and neighbourhood</h3><p>${esc(l.local||l.campus)}</p>${l.source?`<a href="${esc(l.source)}" target="_blank" rel="noopener" class="inline local-source">${l.image?'Official campus guide':'Local area guide'} <span class="arrow" aria-hidden="true">↗</span></a>`:''}</section>
    <aside class="panel side request-panel"><p class="metric-label">Monthly sublet rent</p><h2>${money(l.ask)} <small>/ month</small></h2>
    ${row('Available from',monthName(l.start,l.vacant))}${row('Through',monthName(l.end))}${row('Full listing term',months+' '+(months===1?'month':'months'))}${row('Total rent for these dates',money(cents(months*l.ask)),true)}
    ${requested?`<div class="status-note" role="status"><h3>Request received</h3><p>Termlet would coordinate this request with the leaseholder. You can withdraw it if your plans change.</p></div><div class="actions">${link('stay/'+key,'Open my stay')}${act('withdraw-'+key,'Withdraw request',true)}</div>`:`<p class="help mini">Your request covers all listed months. Termlet’s service fee is paid from the leaseholder’s sublet income.</p><div class="actions">${act('request-'+key,'Request these dates')}</div>`}</aside></div>`;
}
  function marketplaceView(path) {
    if (path === 'stays') return stays();
    if (path.startsWith('stay/')) return stayPortal(path.slice(5));
    if (path === 'guide') return guide();
    if (path === 'list' || path === 'dashboard') {
      if (!verified() && (path === 'list' || model.listing)) return <StudentCheck/>;
      if (path === 'dashboard' || (model.listing && model.listing.status !== 'review')) return dashboard();
      return list();
    }
    if (path === 'browse') return browse();
    if (path.startsWith('room/')) return room(path.slice(5));
    return home();
  }

  function render(){
    if(budgetCleanup)budgetCleanup();
    if(activePicker){activePicker.close();activePicker.remove();activePicker=null;}
    const path=location.hash.slice(1)||'home';
    for (const root of [...roots.values()].reverse()) root.unmount();
    roots.clear();
    if (path === 'design' || path.startsWith('design/')) {
      main.replaceChildren();
      mount(main, <DesignDashboard route={path} sample={cardItem(['sample', listings().sample])}/>);
      document.title = 'Design system · Termlet';
      document.querySelectorAll('.top [aria-current]').forEach(link => link.removeAttribute('aria-current'));
      window.scrollTo(0,0);
      return;
    }
    const view = marketplaceView(path);
    if (typeof view === 'string') main.innerHTML = view;
    else mount(main, view);
    const payments = main.querySelector('[data-bills]');
    if (payments) {
      const scope = payments.dataset.bills;
      const bills = scope==='owner' ? ownerBills(model.listing) : stayBills(model.stays[scope.slice(5)]);
      mount(payments, <PaymentTable bills={bills} scope={scope} money={money} dueDate={dueDate}/>);
    }
    const gallery = main.querySelector('#room-gallery');
    if (gallery) {
      const key = path.slice(5);
      mount(gallery, <Gallery photos={photosFor(key, listings()[key])}/>);
    }
    if (path === 'browse') mount(main.querySelector('#search-results'), searchResults(listings()));
    for(const item of document.querySelectorAll('nav a')){
      const active=item.hash==='#browse'?(path==='browse'||path.startsWith('room/')):item.hash==='#stays'?(path==='stays'||path.startsWith('stay/')):(path==='list'||path==='dashboard');
      if(active)item.setAttribute('aria-current','page');else item.removeAttribute('aria-current');
    }
    if(path==='list')updateEstimate();
    if(path==='browse'){const form=document.getElementById('filter-form');limitChoices(form);setupBudgetSlider(form);}
    setupPickers();
    window.scrollTo(0,0);document.title=(main.querySelector('h1')?.textContent||'Student sublets')+' · Termlet';
  }
  function focusPanel(selector){
    const panel=document.querySelector(selector);
    if(panel){panel.tabIndex=-1;panel.focus({preventScroll:true});panel.scrollIntoView({block:'nearest'})}
  }
  main.addEventListener('input',e=>{
    e.target.removeAttribute('aria-invalid');
    if(['rent','ask','promotion'].includes(e.target.name))updateEstimate();
    if(e.target.matches('#filter-form input[type=range]')){
      updateBudgetSlider(e.target.form, e.target);
      applyFilters(e.target.form);
    }
  });
  function drawPhotos(){const p=document.querySelector('#photo-preview');if(p)p.innerHTML=previewPhotos();}
  main.addEventListener('change',async e=>{
    const input=e.target,form=input.form;
    if(input.matches('[data-document]')){handleDocument(input);return;}
    if(form?.id==='listing-form'&&['gender','household','type'].includes(input.name)){
      form.querySelector('.gender-description').hidden=form.elements.gender.value!=='self';
      form.querySelector('.household-description').hidden=form.elements.household.value!=='self';
      if(input.name==='household'&&input.value==='none')form.elements.roommates.value='0';
      return;
    }
    if(form?.id==='filter-form'){
      if(input.name==='term') form.querySelector('.custom-months').hidden=input.value!=='custom';
      limitChoices(form);applyFilters(form);return;
    }
    if(form?.id==='verify-form'){form.querySelector('#verify-error').textContent='';return}
    if(input.name!=='photo'||!input.files?.length)return;
    const error=form.querySelector('#form-error'),files=Array.from(input.files);
    input.value='';error.textContent='';
    if(files.length+newPhotos.length>6){error.textContent='Choose up to six photos in total. Remove a photo to make space.';return}
    if(files.some(f=>!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>12*1024*1024)){error.textContent='Choose JPG, PNG or WebP images under 12 MB each.';return}
    const job=++photoJob;photoPending=true;input.disabled=true;
    try {
      const batch=[];
      for(const file of files)batch.push(await compressPhoto(file));
      if(input.isConnected&&job===photoJob){newPhotos.push(...batch);drawPhotos();}
    } catch {if(input.isConnected&&job===photoJob)error.textContent='One image could not be opened. Try another file.';}
    finally {if(job===photoJob){photoPending=false;input.disabled=false;}}
  });
  main.addEventListener('submit',e=>{
    e.preventDefault();const form=e.target,fd=new FormData(form);
    if(form.id==='verify-form'){
      const profile=fd.get('profile'),err=form.querySelector('#verify-error');
      if(profile!=='student'){
        err.textContent=profile==='business'?'Only individual students can post. Company listings are ineligible.':profile==='unconfirmed'?'Enrolment could not be confirmed. Posting is unavailable with this profile.':'Choose a demo profile to continue.';
        focusField(form.elements.profile);return;
      }
      if(!fd.has('personal')){err.textContent='Confirm that you’re listing your own leased place.';form.elements.personal.focus();return;}
      model.studentCheck='enrolled-demo';save();go(model.listing&&model.listing.status!=='review'?'dashboard':'list');main.focus();return;
    }
    if(form.id==='filter-form'){
      applyFilters(form);document.querySelector('#results-title').focus();return;
    }
    if(form.id!=='listing-form'||!verified())return;
    const title=String(fd.get('title')).trim(),rent=Number(fd.get('rent')),ask=Number(fd.get('ask')),start=fd.get('startYear')+'-'+fd.get('startMonth'),end=fd.get('endYear')+'-'+fd.get('endMonth'),campus=String(fd.get('campus'));
    const error=(msg,field)=>{document.querySelector('#form-error').textContent=msg;if(field){const input=form.elements[field];input.setAttribute('aria-invalid','true');input.setAttribute('aria-describedby','form-error');focusField(input)}};
    if(!title)return error('Give the room a short listing title.','title');
    if(!form.elements.rent.validity.valid||!form.elements.ask.validity.valid)return error('Enter positive monthly rents up to $20,000, with at most two decimal places.',!form.elements.rent.validity.valid?'rent':'ask');
    if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(start)||!/^\d{4}-(0[1-9]|1[0-2])$/.test(end)||end<start)return error('The last month must be the same as or later than the first month. Use a four-digit year.','endYear');
    if(fd.get('gender')==='self'&&!String(fd.get('genderText')).trim())return error('Add your gender description or choose Not shared.','genderText');
    if(fd.get('household')==='self'&&!String(fd.get('householdText')).trim())return error('Add a household description or choose Not shared.','householdText');
    if(fd.get('household')==='none'&&fd.get('roommates')!=='0')return error('Choose no other roommates for this household.','roommates');
    if(!draftDocuments.lease)return error('Add your original signed lease, or use the sample lease for this demo.');
    if(numMonth(end)-numMonth(start)>=24)return error('Choose a sublet term of up to 24 months for this demo.','endYear');
    if(photoPending)return error('Please wait for your photo to finish loading.');
    if(!newPhotos.length)return error('Add a photo or choose the sample apartment photos before sending.','photo');
    model.listing={title,campus,gender:String(fd.get('gender')),genderText:String(fd.get('genderText')).trim(),household:String(fd.get('household')),householdText:String(fd.get('householdText')).trim(),roommates:String(fd.get('roommates')),documents:{...draftDocuments},payments:{},type:String(fd.get('type')),promotion:Object.hasOwn(promotionPlans,fd.get('promotion'))?String(fd.get('promotion')):'standard',rent,ask,start,end,photos:[...newPhotos],status:'review',moved:false,vacant:0};delete model.requests.own;save();go('dashboard');
  });
  main.addEventListener('click',e=>{
    const doc=e.target.closest('[data-sample-doc],[data-remove-doc]');
    if(doc){const scope=doc.dataset.scope,kind=doc.dataset.sampleDoc||doc.dataset.removeDoc,key=docsFor(scope)[kind]?.previewId;
      if(doc.dataset.removeDoc&&documentLocked(scope,kind))return;
      if(documentUrls.has(key)){URL.revokeObjectURL(documentUrls.get(key));documentUrls.delete(key);}
      if(doc.dataset.sampleDoc)docsFor(scope)[kind]={name:'Sample '+documentNames[kind].replace(' (optional)','')+'.pdf',size:0,sample:true};else delete docsFor(scope)[kind];
      refreshDocuments(scope);main.querySelector(`[data-doc-error="${scope}"]`).textContent='';return;
    }
    const payment=e.target.closest('[data-pay]');
    if(payment){const scope=payment.dataset.scope,key=payment.dataset.pay,owner=scope==='owner',target=owner?model.listing:model.stays[scope.slice(5)];
      if(!target)return;const bill=(owner?ownerBills(target):stayBills(target)).find(b=>b.key===key);
      if(bill?.confirmed&&bill.paid<bill.amount){target.payments ||= {};target.payments[key]={amount:bill.amount,receipt:'DEMO-'+key.replace('-','')};save();render();focusPanel('.payments-panel');}return;
    }
    const remove=e.target.closest('[data-remove-photo]');
    if(remove){newPhotos.splice(Number(remove.dataset.removePhoto),1);drawPhotos();document.querySelector('.photo-choice').focus();return;}
    const button=e.target.closest('[data-act]');if(!button)return;
    const key=button.dataset.act,l=model.listing;
    if(key.startsWith('stay-')){
      const match=key.match(/^stay-(approve|activate|withdraw)-(.+)$/);if(!match)return;
      const [,action,id]=match,s=model.stays[id];if(!s)return;
      if(action==='approve'&&s.status==='review')s.status='agreement';
      else if(action==='activate'&&s.status==='agreement'){
        if(!s.documents?.agreement){document.getElementById('stay-error').textContent='Add your signed sublet agreement or use the sample agreement first.';return;}
        s.status='active';if(id==='own'&&model.listing&&available(model.listing)){model.listing.status='matched';model.listing.offer=false;}
      }else if(action==='withdraw'&&s.status==='review'){delete model.stays[id];delete model.requests[id];save();go('stays');return;}else return;
      save();render();focusPanel('.panel');return;
    }
    if(key==='share-guide'){
      const url=location.protocol==='file:'?'https://hendintom.github.io/Termlet/iterations/001-original/#guide':location.origin+location.pathname+'#guide';
      const result=document.getElementById('share-result');
      navigator.clipboard?.writeText(url).then(()=>result.textContent='Guide link copied.').catch(()=>result.textContent=url);
      if(!navigator.clipboard)result.textContent=url;return;
    }
    if(key==='photo'){photoJob++;photoPending=false;newPhotos=[...samplePhotos];const input=document.querySelector('[name=photo]');input.disabled=false;input.value='';input.removeAttribute('aria-invalid');document.querySelector('#form-error').textContent='';drawPhotos();return;}
    if(key==='clear'){filterSchool='';filterType='';filterHousehold='';filterMin='';filterBudget=String(budgetCeiling);filterTerm='';filterStart='';filterEnd='';render();fadeResults(document.querySelector('.grid-cards'));document.querySelector('#results-title').focus();return}
    if(key.startsWith('request-')||key.startsWith('withdraw-')){
      const sending=key.startsWith('request-'),id=key.substring(key.indexOf('-')+1);
      if(Object.hasOwn(listings(),id)){if(sending){model.requests[id]=true;newStay(id,listings()[id]);}else if(model.stays[id]?.status==='active'){go('stay/'+id);return;}else{delete model.requests[id];delete model.stays[id];}save();render();focusPanel('.request-panel')}
      return;
    }
    if(!l||!verified())return;
    if(key==='approve'&&l.status==='review'){if(!l.documents?.lease){go('list');return;}l.status='active';}
    else if(key==='move'&&l.status==='active'){l.status='away';l.moved=true}
    else if(key==='vacant'&&l.status==='away'){l.offer=false;delete model.requests.own;l.vacant++;if(l.vacant>=duration(l))l.status='ended'}
    else if(key==='match'&&available(l))l.offer=true;
    else if(key==='accept-match'&&available(l)&&l.offer){l.status='matched';l.offer=false;if(model.stays.own)model.stays.own.status='agreement';}
    else if(key==='decline-match'&&available(l)&&l.offer){l.offer=false;delete model.requests.own}
    else if(key==='replay'&&['ended','matched'].includes(l.status)){l.status='active';l.vacant=0;l.moved=false;l.payments={};delete model.requests.own;delete model.stays.own}
    else return;save();render();focusPanel(l.offer?'.offer':'.panel');
  });
  document.querySelector('.skip').addEventListener('click',e=>{e.preventDefault();main.focus();main.scrollIntoView()});
  window.addEventListener('hashchange',()=>{render();main.focus({preventScroll:true})});render();
}
