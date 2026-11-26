import { UI } from './components/UI';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { FooterLinks } from './components/Marketplace';
import { startMarketplace } from './marketplace';
import { CursorGlow } from './components/CursorGlow';
import { ThemeToggle } from './components/ThemeToggle';
import { restoreTokens } from './design/tokens';
import './theme.css';
import { restoreStyles } from './design/componentStyles';

function Shell() {
  return (
    <>
      <CursorGlow />
      <UI.Skip href="#main">Skip to content</UI.Skip>
      <UI.PageHeader>
        <UI.Shell className="nav">
          <div className="brand-controls"><UI.Brand href="#home" aria-label="Termlet home">
            <UI.Mark aria-hidden="true">
              <i />
              <i />
              <i />
            </UI.Mark>
            termlet<UI.BrandDot>.</UI.BrandDot>
          </UI.Brand><ThemeToggle/></div>
          <UI.Navigation aria-label="Main navigation">
            <UI.Link href="#browse" aria-label="Find a sublet">
              <span className="nav-wide">Find a sublet</span>
              <span className="nav-small">Browse</span>
            </UI.Link>
            <UI.Link href="#dashboard">My listing</UI.Link>
            <UI.Link href="#stays">My stay</UI.Link>
          </UI.Navigation>
        </UI.Shell>
      </UI.PageHeader>
      <UI.StorageStatus as="p" className="shell" role="status" id="storage-status" />
      <UI.Shell as="main" id="main" tabIndex="-1" />
      <UI.PageFooter className="shell">
        <strong>
          termlet<span>.</span>
        </strong>
        <FooterLinks />
        <span>
          Student housing demo · Fictional listings and payments
          <br />
          AI-assisted design, code and sample imagery
        </span>
      </UI.PageFooter>
    </>
  );
}

restoreTokens();
restoreStyles();
flushSync(() => createRoot(document.getElementById('app')).render(<Shell />));
startMarketplace();
