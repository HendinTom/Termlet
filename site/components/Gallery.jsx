import { UI } from './UI';
import { useState } from 'react';

function Photo({ photo, main }) {
  if (!photo.sheet)
    return (
      <UI.Image
        className={main ? 'gallery-main' : undefined}
        src={photo.src}
        alt={main ? photo.alt : ''}
        decoding="async"
      />
    );
  return (
    <span
      className={'sheet-view' + (main ? ' gallery-main' : '')}
      role={main ? 'img' : undefined}
      aria-label={main ? photo.alt : undefined}
      aria-hidden={main ? undefined : true}
      style={{ '--photo-x': photo.index % 2, '--photo-y': Math.floor(photo.index / 2) }}
    >
      <UI.Image src={photo.src} alt="" loading={main ? 'eager' : 'lazy'} decoding="async" />
    </span>
  );
}

export function Gallery({ photos }) {
  const [index, setIndex] = useState(0);
  if (!photos.length) return null;
  const multiple = photos.length > 1;
  const next = (step) => (index + step + photos.length) % photos.length;
  return (
    <UI.PhotoGallery
      as="section"
      aria-label="Listing photos"
      onKeyDown={(e) => {
        if (!multiple || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
        e.preventDefault();
        const target = next(e.key === 'ArrowLeft' ? -1 : 1);
        setIndex(target);
        if (e.target.matches('[data-photo-index]'))
          e.currentTarget.querySelector('[data-photo-index="' + target + '"]').focus();
      }}
    >
      <UI.GalleryStage>
        <Photo photo={photos[index]} main />
        {multiple && (
          <>
            <UI.PreviousPhoto onClick={() => setIndex(next(-1))} aria-label="Previous photo">
              ‹
            </UI.PreviousPhoto>
            <UI.NextPhoto onClick={() => setIndex(next(1))} aria-label="Next photo">
              ›
            </UI.NextPhoto>
          </>
        )}
      </UI.GalleryStage>
      <UI.GalleryCaption aria-live="polite">
        <strong>{photos[index].label}</strong>
        <span>
          {index + 1} of {photos.length}
        </span>
      </UI.GalleryCaption>
      {multiple && (
        <UI.GalleryThumbs aria-label="Choose photo">
          {photos.map((p, i) => (
            <UI.Button
              type="button"
              key={i}
              data-photo-index={i}
              aria-pressed={i === index}
              aria-label={'Show ' + p.label + ', photo ' + (i + 1)}
              onClick={() => setIndex(i)}
            >
              <Photo photo={p} />
              <span>{p.label}</span>
            </UI.Button>
          ))}
        </UI.GalleryThumbs>
      )}
    </UI.PhotoGallery>
  );
}
