import { useDesignLink } from '../design/navigation';
import { UI } from './UI';
export function FooterLinks() {
  const designLink = useDesignLink();
  return (
    <UI.FooterLinks>
      <UI.ViewLink href="#guide">Student guide</UI.ViewLink>
      <UI.ViewLink href={designLink}>Design system</UI.ViewLink>
    </UI.FooterLinks>
  );
}

export function PriceRow({ price }) {
  return (
    <UI.CardBottom>
      <span>
        <strong>{price}</strong> <UI.Text as="small">/ month</UI.Text>
      </span>
    </UI.CardBottom>
  );
}

export function ListingCard({ item }) {
  const { id, room, image, price, dates, household, sponsor } = item;
  const href = '#room/' + id;
  const place = room.area && room.area !== room.city ? room.area + ' · ' + room.city : room.city || room.campus;
  const alt = room.alt || room.title;
  return (
    <UI.ListingCard data-listing={id} data-promotion={room.promotion}>
      <UI.CardImageLink href={href} aria-label={'View ' + room.title}>
        {room.tile ? (
          <div className={'room-pic room-tile tile-' + room.tile} role="img" aria-label={alt} />
        ) : (
          <UI.RoomPic>
            {room.gallerySheet ? (
              <UI.GalleryMain
                as="span"
                className="sheet-view"
                role="img"
                aria-label={alt}
                style={{ '--photo-x': 0, '--photo-y': 0 }}
              >
                <UI.Image src={image} alt="" />
              </UI.GalleryMain>
            ) : (
              <UI.Image src={image} alt={alt} decoding="async" loading="lazy" />
            )}
          </UI.RoomPic>
        )}
      </UI.CardImageLink>
      <UI.Copy>
        {sponsor && <UI.SponsorBadge>Sponsored · {sponsor}</UI.SponsorBadge>}
        {room.luxury && <UI.LuxuryTag>Luxury</UI.LuxuryTag>}
        <UI.CardPlace>{place}</UI.CardPlace>
        <UI.CardTitle>
          <UI.Link href={href}>{room.title}</UI.Link>
        </UI.CardTitle>
        <UI.CardCampus>{room.campusLabel || room.campus}</UI.CardCampus>
        <UI.CardHousehold>{household}</UI.CardHousehold>
        <UI.CardFacts>
          {room.type || 'Student sublet'} · {dates}
        </UI.CardFacts>
        <PriceRow price={price} />
      </UI.Copy>
    </UI.ListingCard>
  );
}

export function CardGrid({ items }) {
  return (
    <UI.GridCards>
      {items.length ? (
        items.map((item) => <ListingCard key={item.id} item={item} />)
      ) : (
        <UI.Empty as="div">
          <UI.Heading as="h3">No rooms fit these filters</UI.Heading>
          <UI.Text>
            Try another campus, place type or household, raise the budget, or leave a month open.
          </UI.Text>
        </UI.Empty>
      )}
    </UI.GridCards>
  );
}

export function SearchResults({ items, applied, budgetSummary }) {
  const one = items.length === 1;
  return (
    <>
      <UI.ResultSummary as="div">
        <UI.Heading id="results-title" tabIndex="-1" aria-live="polite">
          {items.length} {one ? 'place' : 'places'}{' '}
          {applied ? (one ? 'matches your search' : 'match your search') : 'to explore'}
        </UI.Heading>
        {applied && (
          <UI.PlainButton type="button" data-act="clear">
            Clear filters
          </UI.PlainButton>
        )}
      </UI.ResultSummary>
      {budgetSummary && <UI.BudgetSummary>{budgetSummary}</UI.BudgetSummary>}
      <UI.MarketNote>
        Sample listings in real neighbourhoods. Rents are illustrative and shown in Canadian dollars. Up to two
        sponsored matches appear first; every result meets your filters.
      </UI.MarketNote>
      <CardGrid items={items} />
    </>
  );
}
