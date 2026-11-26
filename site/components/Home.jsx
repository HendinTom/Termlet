import { UI } from './UI';
import { CardGrid } from './Marketplace';

function RouteButton({ to, secondary, children }) {
  const Button = secondary ? UI.SecondaryButton : UI.PrimaryButton;
  return (
    <Button as="a" href={'#' + to}>
      {children} <UI.Arrow aria-hidden="true">↗</UI.Arrow>
    </Button>
  );
}

export function Home({ hasListing, spotlight, cards }) {
  const { item, picture } = spotlight;
  const href = '#room/' + item.id;
  return (
    <>
      <UI.Hero>
        <div>
          <UI.Kicker as="div">Waterloo Region &amp; Greater Toronto</UI.Kicker>
          <UI.HeroTitle>
            A sublet for your <em>away term.</em>
          </UI.HeroTitle>
          <UI.Intro>
            List your place before co-op. Once it’s approved, we find a student to take it and help cover part
            of the rent if it stays empty.
          </UI.Intro>
          <UI.Actions>
            <RouteButton to={hasListing ? 'dashboard' : 'list'}>
              {hasListing ? 'Track my listing' : 'List my place'}
            </RouteButton>
            <RouteButton to="browse" secondary>
              Find a sublet
            </RouteButton>
          </UI.Actions>
        </div>
        <UI.HeroSponsored as="figure">
          <UI.HeroImageLink href={href} aria-label={'View ' + item.room.title}>
            <UI.Image src={picture.src} alt={picture.alt} />
          </UI.HeroImageLink>
          <UI.HeroCaption as="figcaption">
            {item.sponsor && <UI.SponsorBadge>Sponsored · {item.sponsor}</UI.SponsorBadge>}
            <UI.Link href={href}>
              <strong>{item.room.title}</strong>
              <span>
                {item.room.city || item.room.campus} · {item.price} / month
              </span>
            </UI.Link>
          </UI.HeroCaption>
        </UI.HeroSponsored>
      </UI.Hero>
      <UI.Terms>
        <UI.SectionHead as="div">
          <UI.Heading>How the rent works</UI.Heading>
        </UI.SectionHead>
        <UI.Rates>
          <UI.Rate as="div">
            <UI.Number as="div">10%</UI.Number>
            <div>
              <UI.Heading as="h3">Support when it’s empty</UI.Heading>
              <UI.Text>
                Of lease rent for each fully vacant month of an approved listing. We keep searching during the
                term.
              </UI.Text>
            </div>
          </UI.Rate>
          <UI.Rate as="div">
            <UI.Number as="div">15%</UI.Number>
            <div>
              <UI.Heading as="h3">Standard fee when rented</UI.Heading>
              <UI.Text>
                Of collected sublet rent; you keep 85%. Optional Boosted (18%) and Featured (20%) plans add
                sponsored placement.
              </UI.Text>
            </div>
          </UI.Rate>
        </UI.Rates>
        <UI.Footnote>
          Illustrative prototype rates. Support starts with the approved term. Each month is counted once.
        </UI.Footnote>
      </UI.Terms>
      <UI.Featured>
        <UI.SectionHead as="div">
          <UI.Heading>Explore student sublets</UI.Heading>
          <UI.ViewLink href="#browse">
            Browse all <span aria-hidden="true">→</span>
          </UI.ViewLink>
        </UI.SectionHead>
        <CardGrid items={cards} />
        <UI.Footnote>
          Sample homes in Waterloo Region and the Greater Toronto Area. Sponsored listings reflect optional paid
          promotion.
        </UI.Footnote>
      </UI.Featured>
      <UI.GuideCallout>
        <div>
          <UI.Heading>Student sublet guide</UI.Heading>
          <UI.Text>Find out who can list a room and where to get campus housing help.</UI.Text>
        </div>
        <RouteButton to="guide" secondary>
          Open the guide
        </RouteButton>
      </UI.GuideCallout>
    </>
  );
}
