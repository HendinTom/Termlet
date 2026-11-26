import { CardGrid } from './Marketplace';

function RouteButton({ to, secondary, children }) {
  return <a className={'btn' + (secondary ? ' alt' : '')} href={'#' + to}>{children} <span className="arrow" aria-hidden="true">↗</span></a>;
}

export function Home({ hasListing, spotlight, cards }) {
  const { item, picture } = spotlight;
  const href = '#room/' + item.id;
  return <><section className="hero"><div><div className="kicker">Waterloo Region &amp; Greater Toronto</div>
    <h1>A sublet for your <em>away term.</em></h1>
    <p className="intro">List your place before co-op. Once it’s approved, we find a student to take it and help cover part of the rent if it stays empty.</p>
    <div className="actions"><RouteButton to={hasListing?'dashboard':'list'}>{hasListing?'Track my listing':'List my place'}</RouteButton>
    <RouteButton to="browse" secondary>Find a sublet</RouteButton></div></div>
    <figure className="hero-sponsored"><a className="hero-image-link" href={href} aria-label={'View '+item.room.title}><img src={picture.src} alt={picture.alt}/></a>
    <figcaption className="hero-caption">{item.sponsor && <span className="sponsor-badge">Sponsored · {item.sponsor}</span>}
    <a href={href}><strong>{item.room.title}</strong><span>{item.room.city || item.room.campus} · {item.price} / month</span></a></figcaption></figure></section>
    <section className="terms"><div className="section-head"><h2>How the rent works</h2></div><div className="rates">
    <div className="rate"><div className="number">10%</div><div><h3>Support when it’s empty</h3><p>Of lease rent for each fully vacant month of an approved listing. We keep searching during the term.</p></div></div>
    <div className="rate"><div className="number">15%</div><div><h3>Standard fee when rented</h3><p>Of collected sublet rent; you keep 85%. Optional Boosted (18%) and Featured (20%) plans add sponsored placement.</p></div></div></div>
    <p className="footnote">Illustrative prototype rates. Support starts with the approved term. Each month is counted once.</p></section>
    <section className="featured"><div className="section-head"><h2>Explore student sublets</h2><a className="view-link" href="#browse">Browse all <span aria-hidden="true">→</span></a></div>
    <CardGrid items={cards}/><p className="footnote">Sample homes in Waterloo Region and the Greater Toronto Area. Sponsored listings reflect optional paid promotion.</p></section>
    <section className="guide-callout"><div><h2>Student sublet guide</h2><p>Find out who can list a room and where to get campus housing help.</p></div><RouteButton to="guide" secondary>Open the guide</RouteButton></section></>;
}
