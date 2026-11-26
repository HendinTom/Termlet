export function FooterLinks() {
  return <div className="footer-links"><a className="view-link" href="#guide">Student guide</a>
    <a className="view-link" href="#design">Design system</a></div>;
}

export function PriceRow({ price, title, href }) {
  return <div className="card-bottom"><span><strong>{price}</strong> <small>/ month</small></span>
    <a href={href} className="view-link" aria-label={'View room: ' + title}>View room <span aria-hidden="true">→</span></a></div>;
}

export function ListingCard({ item }) {
  const { id, room, image, price, dates, household, sponsor } = item;
  const href = '#room/' + id;
  const place = room.area && room.area !== room.city ? room.area + ' · ' + room.city : room.city || room.campus;
  const alt = room.alt || room.title;
  return <article className="card listing-card" data-listing={id} data-promotion={room.promotion}>
    <a className="card-image-link" href={href} aria-label={'View ' + room.title}>
      {room.tile ? <div className={'room-pic room-tile tile-' + room.tile} role="img" aria-label={alt}/> :
        <div className="room-pic">{room.gallerySheet ?
          <span className="sheet-view gallery-main" role="img" aria-label={alt} style={{'--photo-x':0,'--photo-y':0}}><img src={image} alt="" /></span> :
          <img src={image} alt={alt} decoding="async" loading="lazy"/>}</div>}
    </a>
    <div className="copy">
      {sponsor && <span className="sponsor-badge">Sponsored · {sponsor}</span>}
      {room.luxury && <span className="luxury-tag">Luxury</span>}
      <p className="card-place">{place}</p><h3 className="card-title"><a href={href}>{room.title}</a></h3>
      <p className="card-campus">{room.campusLabel || room.campus}</p><p className="card-household">{household}</p>
      <p className="card-facts">{room.type || 'Student sublet'} · {dates}</p>
      <PriceRow title={room.title} price={price} href={href}/>
    </div></article>;
}

export function CardGrid({ items }) {
  return <div className="grid-cards">{items.length ? items.map(item => <ListingCard key={item.id} item={item}/>) :
    <div className="empty"><h3>No rooms fit these filters</h3><p>Try another campus, place type or household, raise the budget, or leave a month open.</p></div>}</div>;
}

export function SearchResults({ items, applied, budgetSummary }) {
  const one = items.length === 1;
  return <><div className="result-summary"><h2 id="results-title" tabIndex="-1" aria-live="polite">
    {items.length} {one ? 'place' : 'places'} {applied ? one ? 'matches your search' : 'match your search' : 'to explore'}</h2>
    {applied && <button type="button" className="plain-button" data-act="clear">Clear filters</button>}</div>
    {budgetSummary && <p className="budget-summary">{budgetSummary}</p>}
    <p className="market-note">Sample listings in real neighbourhoods. Rents are illustrative and shown in Canadian dollars. Up to two sponsored matches appear first; every result meets your filters.</p>
    <CardGrid items={items}/></>;
}
