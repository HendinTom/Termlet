import { useLayoutEffect, useRef, useState } from 'react';
import { ListingCard, PriceRow } from '../components/Marketplace';
import { ColorControl } from './ColorControl';
import { iterations } from './history';
import { tokens, restoreTokens, saveTokens } from './tokens';

function ChangeIndex({ iteration, selected }) {
  const areas = [...new Set(iteration.changes.map(c => c.area))];
  return <aside className="change-index lab-panel" aria-label="Change index">
    <label>Iteration<select value={iteration.id} onChange={e => location.hash='design/changes/'+e.target.value}>
      {iterations.map(i => <option key={i.id} value={i.id}>{i.id} · {i.name}</option>)}</select></label>
    {areas.map(area => <details open key={area}><summary>{area}</summary><ul>
      {iteration.changes.filter(c => c.area === area).map(c => <li key={c.id}><a
        aria-current={selected.id === c.id ? 'page' : undefined} href={'#design/changes/'+iteration.id+'/'+c.id}>
        {c.name}<small>{c.status}</small></a></li>)}</ul></details>)}</aside>;
}

function Comparison({ iteration, change }) {
  const [side,setSide] = useState(change.after ? 'After' : 'Before');
  return <section className="comparison lab-panel">
    <span className="kicker">{change.area} / {change.status}</span><h2>{change.name}</h2>
    <p>{change.note}</p>
    <div className="mobile-sides">{['Before','After'].map(label => <button key={label} aria-pressed={side===label} onClick={()=>setSide(label)}>{label}</button>)}</div>
    <div className="compare-grid">{['Before','After'].map(label=>{
      const snap=change[label.toLowerCase()];
      return <figure key={label} className={side===label?'visible':''}>
        <figcaption>{label}<small>{snap ? 'Iteration '+snap.iteration : 'Component absent'}</small></figcaption>
        <div className="capture">{snap ? <picture><source media="(max-width: 700px)" srcSet={snap.mobile}/><img src={snap.desktop} alt={change.name+' in iteration '+snap.iteration}/></picture> :
          <span>{label==='Before'?'Introduced in ':'Removed in '}{iteration.id}</span>}</div></figure>;
    })}</div><div className="comparison-links"><a className="view-link" href={change.context}>View in context ↗</a>
    <a className="back" href={iteration.previousPreview}>Open previous iteration ↗</a></div>
  </section>;
}

function Adjustments({ sample }) {
  const [values,setValues] = useState(restoreTokens);
  const [resetCount, setResetCount] = useState(0);
  function update(next) { saveTokens(next); setValues(next); }
  return <div className="lab-layout"><section className="lab-panel adjustment-controls"><h2>Adjustments</h2><p>Saved in this browser for iteration {iterations[0].id}.</p>
    {tokens.map(t=>!t.max ? <ColorControl key={t.key + resetCount} name={t.name} value={values[t.key]}
      onChange={color=>update({...values,[t.key]:color})}/> : <label key={t.key}>{t.name}<output>{values[t.key]}{t.max?'px':''}</output>
      <input type="range" min={t.min || 0} max={t.max} value={values[t.key]}
        onChange={e=>update({...values,[t.key]:Number(e.target.value)})}/></label>)}
    <button className="plain-button" onClick={()=>{update(Object.fromEntries(tokens.map(t=>[t.key,t.initial])));setResetCount(n=>n+1);}}>Reset to defaults</button></section>
    <section className="lab-panel"><h2>Live preview</h2><div className="live-grid"><ListingCard item={sample}/>
      <div className="panel"><p className="metric-label">Monthly sublet rent</p><h2>{sample.price} <small>/ month</small></h2>
      <a className="btn" href="#room/sample">Open listing</a></div></div></section></div>;
}

function DesignMap({ sample }) {
  const viewport=useRef(null), board=useRef(null), drag=useRef(null);
  const [zoom,setZoom]=useState(1), [size,setSize]=useState({width:0,height:0});
  function fit() {
    if(board.current && viewport.current) {
      const width = (viewport.current.clientWidth-32)/board.current.offsetWidth;
      const height = (viewport.current.clientHeight-32)/board.current.offsetHeight;
      setZoom(Math.min(1,width,height));
    }
    viewport.current?.scrollTo(0,0);
  }
  useLayoutEffect(()=>{
    const measure=()=>setSize({width:board.current.offsetWidth,height:board.current.offsetHeight});
    const observer=new ResizeObserver(measure);observer.observe(board.current);measure();fit();
    return ()=>observer.disconnect();
  },[]);
  return <section className="map-panel lab-panel"><div className="lab-heading"><h2>Component map</h2>
    <div className="map-tools"><button aria-label="Zoom out" onClick={()=>setZoom(Math.max(.5,zoom-.15))}>−</button>
    <output>{Math.round(zoom*100)}%</output><button aria-label="Zoom in" onClick={()=>setZoom(Math.min(2,zoom+.15))}>+</button><button onClick={fit}>Fit</button></div></div>
    <div className="map-viewport" ref={viewport} tabIndex="0" aria-label="Component map canvas"
      onPointerDown={e=>{if(e.button!==0 || e.target.closest('a,button') || matchMedia('(max-width:700px)').matches)return;
        drag.current=[e.clientX,e.clientY,e.currentTarget.scrollLeft,e.currentTarget.scrollTop];e.currentTarget.setPointerCapture(e.pointerId);}}
      onPointerMove={e=>{if(drag.current){const [x,y,left,top]=drag.current;e.currentTarget.scrollTo(left+x-e.clientX,top+y-e.clientY);}}}
      onLostPointerCapture={()=>drag.current=null}>
      <div className="map-size" style={{width:size.width*zoom,height:size.height*zoom}}>
      <div className="map-board" ref={board} style={{transform:'scale('+zoom+')'}}>
        <section><h3>Foundations</h3><div className="map-node"><h4>Color &amp; surface</h4>{tokens.map(t=><div className="token-line" key={t.key}>
          {t.max?<i className="dimension">↔</i>:<i style={{background:'var('+t.key+')'}}/>}{t.name}<small>{t.initial}{t.max ? 'px' : ''}</small></div>)}
          <a className="view-link" href="#design/adjust">Try adjustments →</a></div></section>
        <section><h3>Components</h3><ListingCard item={sample}/><div className="map-node"><h4>Listing card / Price row</h4><PriceRow price={sample.price} title={sample.room.title} href="#room/sample"/></div></section>
        <section><h3>Screens</h3><div className="map-node"><h4>Listing discovery</h4><a href="#home">Homepage highlights ↗</a><a href="#browse">Search results ↗</a></div>
          <div className="map-node"><h4>Listing destination</h4><a href="#room/sample">Room detail ↗</a></div></section>
      </div></div></div></section>;
}

export function DesignDashboard({ route, sample }) {
  const [,tab='changes',id,component] = route.split('/');
  const iteration=iterations.find(i=>i.id===id) || iterations[0];
  const selected=iteration.changes.find(c=>c.id===component) || iteration.changes[0];
  return <div className="design"><header className="page-head"><a className="back" href="#home">← Marketplace</a>
    <h1 className="page-title">Design system</h1></header>
    <nav className="lab-tabs" aria-label="Design system views">{[['changes','Changes'],['map','Design map'],['adjust','Adjustments']].map(([key,name])=>
      <a key={key} href={'#design/'+key} aria-current={tab===key?'page':undefined}>{name}</a>)}</nav>
    {tab==='map'?<DesignMap sample={sample}/>:tab==='adjust'?<Adjustments sample={sample}/>:
      <div className="lab-layout"><ChangeIndex iteration={iteration} selected={selected}/><Comparison iteration={iteration} change={selected}/></div>}
  </div>;
}
