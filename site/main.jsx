import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { FooterLinks } from './components/Marketplace';
import { startMarketplace } from './marketplace';
import { restoreTokens } from './design/tokens';
import './style.css';
import './design/design.css';

function Shell() {
  return <><a className="skip" href="#main">Skip to content</a>
    <header className="top"><div className="shell nav"><a className="brand" href="#home" aria-label="Termlet home"><span className="mark" aria-hidden="true"><i/><i/><i/></span>termlet<span className="brand-dot">.</span></a>
    <nav aria-label="Main navigation"><a href="#browse" aria-label="Find a sublet"><span className="nav-wide">Find a sublet</span><span className="nav-small">Browse</span></a><a href="#dashboard">My listing</a><a href="#stays">My stay</a></nav></div></header>
    <p className="shell storage-status" role="status" id="storage-status"/>
    <main className="shell" id="main" tabIndex="-1"/>
    <footer className="shell footer"><strong>termlet<span>.</span></strong><FooterLinks/>
    <span>Student housing demo · Fictional listings and payments<br/>AI-assisted design, code and sample imagery</span></footer></>;
}

restoreTokens();
flushSync(() => createRoot(document.getElementById('app')).render(<Shell/>));
startMarketplace();
