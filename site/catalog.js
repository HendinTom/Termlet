'use strict';
const termletCampuses = [
  'University of Waterloo',
  'Wilfrid Laurier University',
  'UW Health Sciences · Kitchener',
  'UW Architecture · Cambridge'
];

const termletRooms = {
  sample: {
    title: 'Northdale study room', campus: termletCampuses[0], otherCampuses: [termletCampuses[1]],
    area: 'Northdale', city: 'Waterloo', type: 'Private room', ask: 850, rent: 1000,
    start: '2027-01', end: '2027-04', vacant: 0, photo: 'room.jpg',
    alt: 'Furnished room with green bedding and a wooden desk at the window.',
    description: 'A furnished room in a three-bedroom apartment. There’s a desk by the window and a shared kitchen for cooking with two housemates.',
    features: ['Furnished', '2 housemates', 'Utilities included'],
    local: 'Northdale sits between the University of Waterloo and Wilfrid Laurier University.',
    source: 'https://www.waterloo.ca/council-and-city-administration/plans-projects-studies-and-strategies/studies/'
  },
  uptown: {
    title: 'Uptown light-filled studio', campus: termletCampuses[1],
    area: 'Uptown West', city: 'Waterloo', type: 'Entire studio', ask: 1225,
    start: '2027-01', end: '2027-08', vacant: 0, tile: 'studio',
    alt: 'A furnished studio with a terracotta duvet and its own light-wood kitchenette.',
    description: 'A self-contained studio with a compact kitchen, a private bathroom and a table for two. The eight-month window works for a longer placement.',
    features: ['Furnished', 'Private kitchen', 'Utilities included'],
    local: 'Uptown West is a Waterloo neighbourhood. The Laurel Trail connects uptown and the University of Waterloo.',
    source: 'https://www.waterloo.ca/parks-and-trails/waterloo-park/waterloo-park-trails-gardens-and-public-art/'
  },
  kitchener: {
    title: 'Victoria Street study room', campus: termletCampuses[2],
    area: 'Downtown', city: 'Kitchener', type: 'Private room', ask: 790,
    start: '2027-01', end: '2027-04', vacant: 0, tile: 'brick',
    alt: 'A blue duvet, black study desk and a bookshelf in a bright brick-walled bedroom.',
    description: 'A furnished bedroom in a two-bedroom walk-up. Share the kitchen and bathroom with one housemate. The desk and bookshelf stay for the winter term.',
    features: ['Furnished', '1 housemate', 'Utilities included'],
    local: 'Waterloo’s Health Sciences Campus is on Victoria Street South in Kitchener.',
    source: 'https://uwaterloo.ca/future-students/tours-events/location-directions'
  },
  galt: {
    title: 'Galt attic room', campus: termletCampuses[3],
    area: 'Galt', city: 'Cambridge', type: 'Private room', ask: 825,
    start: '2027-05', end: '2027-08', vacant: 0, tile: 'attic',
    alt: 'Upstairs room with a sloping ceiling and a drawing desk beside the bed.',
    description: 'An upstairs bedroom in a shared house with a large worktable for drawings or a second monitor. The kitchen, laundry and bathroom are shared.',
    features: ['Furnished', 'Drawing desk', 'Utilities included'],
    local: 'Waterloo’s School of Architecture is in the old Galt neighbourhood of Cambridge, beside the Grand River.',
    source: 'https://uwaterloo.ca/about/maps-and-directions'
  },
  park: {
    title: 'Waterloo Park one-bedroom', campus: termletCampuses[1], otherCampuses: [termletCampuses[0]],
    area: 'Waterloo Park area', city: 'Waterloo', type: 'Entire apartment', ask: 1150,
    start: '2027-05', end: '2027-08', vacant: 0, tile: 'living',
    alt: 'An apartment sitting room with a blue sofa, reading lamp and dining nook.',
    description: 'An entire one-bedroom apartment with a separate living room and dining corner. The furniture stays throughout the four-month summer sublet.',
    features: ['Furnished', 'Private kitchen', 'Utilities included'],
    local: 'The Laurel Trail runs from uptown through Waterloo Park and the University of Waterloo.',
    source: 'https://www.waterloo.ca/parks-and-trails/waterloo-park/waterloo-park-trails-gardens-and-public-art/'
  }
};

const uoftGuide = 'https://future.utoronto.ca/our-three-campuses';
const humberGuide = 'https://www.careers.humber.ca/contact-us.php';
const sheridanGuide = 'https://www.sheridancollege.ca/about/campus-locations';

const gtaCampuses = {
  stGeorge: {
    name: 'University of Toronto · St. George', short: 'U of T St. George', guide: uoftGuide,
    context: 'The St. George campus is in downtown Toronto, around King’s College Circle.'
  },
  scarborough: {
    name: 'University of Toronto Scarborough', short: 'U of T Scarborough', guide: uoftGuide,
    context: 'The Scarborough campus is on Military Trail in Toronto’s east end.'
  },
  mississauga: {
    name: 'University of Toronto Mississauga', short: 'U of T Mississauga', guide: uoftGuide,
    context: 'The Mississauga campus is on Mississauga Road, along the Credit River.'
  },
  tmu: {
    name: 'Toronto Metropolitan University (TMU)', short: 'TMU', guide: 'https://www.torontomu.ca/student-life-and-learning/first-year/orientation/getting-here/',
    context: 'TMU’s main campus is downtown, around Victoria, Gould and Church streets.'
  },
  york: {
    name: 'York University · Keele', short: 'York Keele', guide: 'https://maps.info.yorku.ca/keele-transit-directions/',
    context: 'York University and Pioneer Village stations both serve the Keele campus on Line 1.'
  },
  humberNorth: {
    name: 'Humber Polytechnic · North', short: 'Humber North', guide: humberGuide,
    context: 'Humber’s North campus is on Humber College Boulevard in north Etobicoke.'
  },
  humberLakeshore: {
    name: 'Humber Polytechnic · Lakeshore', short: 'Humber Lakeshore', guide: humberGuide,
    context: 'Humber’s Lakeshore campus is in south Etobicoke, by Colonel Samuel Smith Park Drive.'
  },
  casaLoma: {
    name: 'George Brown Polytechnic · Casa Loma', short: 'George Brown Casa Loma', guide: 'https://www.georgebrown.ca/about/campuses-locations/casa-loma',
    context: 'George Brown’s Casa Loma campus is in Toronto, around Kendal Avenue and Davenport Road.'
  },
  stJames: {
    name: 'George Brown Polytechnic · St. James', short: 'George Brown St. James', guide: 'https://www.georgebrown.ca/about/campuses-locations/st-james',
    context: 'George Brown’s St. James campus is on the east side of downtown Toronto, around King Street East.'
  },
  davis: {
    name: 'Sheridan College · Davis', short: 'Sheridan Davis', guide: sheridanGuide,
    context: 'Sheridan’s Davis campus is on McLaughlin Road in Brampton.'
  },
  trafalgar: {
    name: 'Sheridan College · Trafalgar Road', short: 'Sheridan Trafalgar Road', guide: sheridanGuide,
    context: 'Sheridan’s Oakville campus is on Trafalgar Road.'
  }
};

const termletRegions = {
  waterloo: { name: 'Waterloo Region', campuses: termletCampuses },
  gta: { name: 'Greater Toronto Area', campuses: Object.values(gtaCampuses).map(campus => campus.name) }
};

const gtaPlaces = {
  annex: {
    title: 'Annex walk-up one-bedroom', school: 'stGeorge', area: 'The Annex', city: 'Toronto',
    type: 'Entire apartment', ask: 1850, start: '2027-01', end: '2027-04',
    description: 'A furnished one-bedroom with an oak desk in the bedroom and a separate kitchen. The apartment is up one flight of stairs. Laundry is shared with the building.',
    features: ['1 bedroom', 'Furnished', 'Shared laundry'], alt: 'Bedroom with a burgundy quilt and a wooden study desk.'
  },
  harbord: {
    title: 'Harbord Village studio', school: 'stGeorge', area: 'Harbord Village', city: 'Toronto',
    type: 'Entire studio', ask: 1625, start: '2027-05', end: '2027-08',
    description: 'The bed and sitting area share one open room. A small private kitchen makes cooking at home easy, and the table folds away when you need floor space.',
    features: ['Private kitchen', 'Furnished', 'Wi-Fi included'], alt: 'Compact studio with a green sofa and wood-finished kitchenette.'
  },
  church: {
    title: 'Church Street one-bedroom', school: 'tmu', area: 'Church–Wellesley', city: 'Toronto',
    type: 'Entire apartment', ask: 1795, start: '2027-01', end: '2027-04',
    description: 'A separate bedroom faces the courtyard, away from the sitting room. A desk, bed frame and dishes stay in the apartment for the winter term.',
    features: ['1 bedroom', 'Study desk', 'Furnished'], alt: 'Bedroom with blue striped bedding beside a broad window.'
  },
  mossPark: {
    title: 'Moss Park corner apartment', school: 'tmu', area: 'Moss Park', city: 'Toronto',
    type: 'Entire apartment', ask: 1975, start: '2027-05', end: '2027-08',
    description: 'A one-bedroom with a corner living room and a table that seats four. The bedroom has a door, so one person can work while another uses the kitchen.',
    features: ['1 bedroom', 'Dining table', 'In-unit laundry'], alt: 'Apartment living room with an olive sofa and a tall floor lamp.'
  },
  highlandCreek: {
    title: 'Highland Creek garden suite', school: 'scarborough', area: 'Highland Creek', city: 'Toronto',
    type: 'Entire apartment', ask: 1290, start: '2027-01', end: '2027-04',
    description: 'A one-bedroom garden suite with its own entrance and kitchen. There’s a desk in the bedroom and room to store a bicycle by the side entrance.',
    features: ['1 bedroom', 'Private entrance', 'Bike storage'], alt: 'A furnished bedroom with a sage duvet and a pine desk.'
  },
  morningside: {
    title: 'Morningside two-bedroom', school: 'scarborough', area: 'Morningside', city: 'Toronto',
    type: 'Entire apartment', ask: 2075, start: '2027-09', end: '2027-12',
    description: 'Two separate bedrooms share a kitchen and living room. The advertised rent covers the whole apartment, so two students can plan the term together.',
    features: ['2 bedrooms', 'Full kitchen', 'Furnished'], alt: 'A shared living and dining space with rust-coloured seating.'
  },
  erindale: {
    title: 'Erindale one-bedroom', school: 'mississauga', area: 'Erindale', city: 'Mississauga',
    type: 'Entire apartment', ask: 1450, start: '2027-05', end: '2027-08',
    description: 'A furnished apartment with a separate bedroom and a kitchen table that doubles as a second work surface. Water and electricity are included for the summer.',
    features: ['1 bedroom', 'Utilities included', 'Study desk'], alt: 'A room with a blue duvet, a light wooden desk and a leafy window.'
  },
  sheridanPark: {
    title: 'Sheridan Park studio', school: 'mississauga', area: 'Sheridan Park', city: 'Mississauga',
    type: 'Entire studio', ask: 1375, start: '2027-01', end: '2027-08',
    description: 'A ground-floor studio with a private bathroom, a kitchenette and a round table for two. The eight-month term spans winter and summer.',
    features: ['Ground floor', 'Private bathroom', 'Furnished'], alt: 'A studio with a light-coloured bed, a kitchenette and a round table.'
  },
  yorkVillage: {
    title: 'York Village one-bedroom suite', school: 'york', area: 'York University Heights', city: 'Toronto',
    type: 'Entire apartment', ask: 1310, start: '2027-01', end: '2027-04',
    description: 'A self-contained suite in a townhouse with its own kitchen and bathroom. The bedroom has a full-size desk. Laundry is shared with the upstairs unit.',
    features: ['1 bedroom', 'Private kitchen', 'Shared laundry'], alt: 'Bedroom with an indigo duvet and an oak desk.'
  },
  vaughan: {
    title: 'Vaughan Centre two-bedroom', school: 'york', area: 'Vaughan Metropolitan Centre', city: 'Vaughan',
    type: 'Entire apartment', ask: 2190, start: '2027-05', end: '2027-08',
    description: 'Two bedrooms open onto a shared living and dining area. The whole unit comes with a full kitchen, a sofa and a washer and dryer.',
    features: ['2 bedrooms', 'In-unit laundry', 'Elevator'], alt: 'Living room with a grey sectional sofa and a yellow accent chair.'
  },
  rexdale: {
    title: 'Rexdale room in a shared flat', school: 'humberNorth', area: 'Rexdale', city: 'Toronto',
    type: 'Private room', ask: 825, start: '2027-01', end: '2027-04',
    description: 'Rent the upstairs bedroom and share the kitchen and bathroom with one housemate. The single monthly price includes Wi-Fi and utilities.',
    features: ['1 housemate', 'Utilities included', 'Furnished'], alt: 'Upstairs bedroom with a white duvet and a reading lamp.'
  },
  newToronto: {
    title: 'New Toronto lakeshore studio', school: 'humberLakeshore', area: 'New Toronto', city: 'Toronto',
    type: 'Entire studio', ask: 1495, start: '2027-05', end: '2027-08',
    description: 'An open-plan studio with a daybed, a private kitchenette and a dining nook. The furniture stays for the summer, including a small desk.',
    features: ['Private kitchenette', 'Study desk', 'Furnished'], alt: 'Studio sitting area with a daybed, a blue rug and a white kitchenette.'
  },
  christie: {
    title: 'Christie loft apartment', school: 'casaLoma', area: 'Christie Pits', city: 'Toronto',
    type: 'Entire apartment', ask: 1740, start: '2027-01', end: '2027-04',
    description: 'An upstairs one-bedroom with a sloping ceiling and a worktable for projects. The private kitchen has a full-size oven. The entrance is up a flight of stairs.',
    features: ['1 bedroom', 'Project table', 'Private kitchen'], alt: 'Loft bedroom with artwork and a dark writing desk.'
  },
  stLawrence: {
    title: 'St. Lawrence market flat', school: 'stJames', area: 'St. Lawrence', city: 'Toronto',
    type: 'Entire apartment', ask: 1890, start: '2027-09', end: '2027-12',
    description: 'A one-bedroom flat with a dining alcove and a living room separate from the bedroom. A full kitchen and laundry in the building suit a four-month stay.',
    features: ['1 bedroom', 'Full kitchen', 'Shared laundry'], alt: 'An apartment living room with a yellow sofa and a dining alcove.'
  },
  fletchers: {
    title: 'Fletcher’s Creek one-bedroom', school: 'davis', area: 'Fletcher’s Creek South', city: 'Brampton',
    type: 'Entire apartment', ask: 1350, start: '2027-01', end: '2027-04',
    description: 'A furnished one-bedroom with a full kitchen. A deep window brings light into the bedroom, and the desk has space for a laptop and monitor.',
    features: ['1 bedroom', 'Study desk', 'Utilities included'], alt: 'A bedroom with warm orange bedding and a dark desk.'
  },
  collegePark: {
    title: 'College Park one-bedroom', school: 'trafalgar', area: 'College Park', city: 'Oakville',
    type: 'Entire apartment', ask: 1510, start: '2027-05', end: '2027-08',
    description: 'A one-bedroom apartment with a separate living area and a maple dining table. There’s a full kitchen and a dedicated space for a bike downstairs.',
    features: ['1 bedroom', 'Bike storage', 'Full kitchen'], alt: 'A bright living room with a pale blue sofa and wooden dining table.'
  }
};

for (const [key, { school, ...place }] of Object.entries(gtaPlaces)) {
  const campus = gtaCampuses[school];
  termletRooms[key] = {
    ...place, vacant: 0, campus: campus.name, campusLabel: campus.short,
    local: campus.context, source: campus.guide, image: 'places/' + key + '.webp'
  };
}

const termletGalleryLabels = {
  sample: ["Bedroom", "Shared kitchen", "Shared living room", "Shared bathroom"],
  uptown: ["Studio", "Kitchenette", "Dining nook", "Bathroom"],
  kitchener: ["Bedroom", "Shared kitchen", "Shared living room", "Shared bathroom"],
  galt: ["Attic bedroom", "Shared kitchen", "Shared living room", "Shared bathroom"],
  park: ["Living room", "Kitchen", "Bedroom", "Bathroom"],
  annex: ["Bedroom", "Kitchen", "Living room", "Bathroom"],
  harbord: ["Studio", "Kitchenette", "Sleeping area", "Bathroom"],
  church: ["Bedroom", "Kitchen", "Living room", "Bathroom"],
  mossPark: ["Living room", "Kitchen", "Bedroom", "Bathroom"],
  highlandCreek: ["Bedroom", "Kitchen", "Living room", "Bathroom"],
  morningside: ["Living room", "Kitchen", "Bedroom", "Bathroom"],
  erindale: ["Bedroom", "Kitchen", "Living room", "Bathroom"],
  sheridanPark: ["Studio", "Kitchenette", "Dining area", "Bathroom"],
  yorkVillage: ["Bedroom", "Kitchen", "Bedroom angle", "Bathroom"],
  vaughan: ["Living room", "Kitchen", "Bedroom", "Bathroom"],
  rexdale: ["Bedroom", "Shared kitchen", "Shared living room", "Shared bathroom"],
  newToronto: ["Studio", "Kitchenette", "Dining nook", "Bathroom"],
  christie: ["Bedroom", "Kitchen", "Living room", "Bathroom"],
  stLawrence: ["Living room", "Kitchen", "Bedroom", "Bathroom"],
  fletchers: ["Bedroom", "Kitchen", "Living room", "Bathroom"],
  collegePark: ["Living room", "Kitchen", "Bedroom", "Bathroom"],
};

// Fictional luxury examples; prices describe the entire apartment, not market quotes.
const luxuryPlaces = {
  yorkvillePenthouse: {
    title: 'Yorkville walnut penthouse', school: 'stGeorge', area: 'Yorkville', city: 'Toronto', ask: 9500,
    start: '2027-01', end: '2027-04',
    description: 'A furnished three-bedroom penthouse with a generous living room, walnut cabinetry and a stone island. The primary bedroom has its own bathroom. The monthly price covers the entire apartment for the winter term.',
    features: ['3 bedrooms', '2 bathrooms', 'Furnished', 'In-unit laundry', 'Kitchen island'],
    alt: 'Luxury living room with a curved cream sofa, walnut panels and tall skyline-facing windows.'
  },
  annexMaisonette: {
    title: 'Annex heritage maisonette', school: 'stGeorge', area: 'The Annex', city: 'Toronto', ask: 5750,
    start: '2027-05', end: '2027-08',
    description: 'A two-bedroom apartment across two floors, with bay windows, herringbone oak and an olive velvet sofa. A large kitchen island doubles as a place to eat or work. The entire furnished unit is available for the summer.',
    features: ['2 bedrooms', '2 bathrooms', 'Two floors', 'Furnished', 'In-unit laundry'],
    alt: 'Elegant living room with bay windows, an olive sofa and herringbone wood floors.'
  },
  bayStreetResidence: {
    title: 'Bay Street corner residence', school: 'tmu', area: 'Bay Street Corridor', city: 'Toronto', ask: 6750,
    start: '2027-01', end: '2027-04',
    description: 'A two-bedroom corner apartment with broad windows, a separate dining area and a charcoal-and-quartz kitchen. Both bedrooms have doors for quieter study time. Rent is for the whole furnished apartment.',
    features: ['2 bedrooms', '2 bathrooms', 'Corner windows', 'Elevator', 'In-unit laundry'],
    alt: 'High-rise corner living room with a charcoal sectional, blue accents and floor-to-ceiling windows.'
  },
  stLawrenceLoft: {
    title: 'St. Lawrence brick loft', school: 'stJames', area: 'St. Lawrence', city: 'Toronto', ask: 6250,
    start: '2027-09', end: '2027-12',
    description: 'A spacious two-bedroom loft with exposed brick, arched windows and a walnut kitchen. The high-ceilinged living room has a large dining table and a leather sofa. The advertised price covers the entire furnished loft.',
    features: ['2 bedrooms', '2 bathrooms', 'High ceilings', 'Furnished', 'In-unit laundry'],
    alt: 'Luxury brick loft living room with arched windows, a cognac leather sofa and oak floors.'
  },
  waterfrontSkyline: {
    title: 'Waterfront panoramic suite', school: 'stJames', area: 'Waterfront', city: 'Toronto', ask: 8750,
    start: '2027-05', end: '2027-08',
    description: 'A three-bedroom apartment with a broad lake-facing living area, pale oak cabinetry and a stone kitchen island. A separate dining space makes room for shared meals. The monthly rent covers the full unit, including its furnishings.',
    features: ['3 bedrooms', '2 bathrooms', 'Lake-facing windows', 'Elevator', 'In-unit laundry'],
    alt: 'Cream and pale-blue living room with expansive waterfront windows and a curved sectional.'
  },
  forestHillResidence: {
    title: 'Forest Hill garden residence', school: 'casaLoma', area: 'Forest Hill', city: 'Toronto', ask: 7950,
    start: '2027-01', end: '2027-04',
    description: 'A furnished three-bedroom apartment with tree-facing windows, panelled walls and a large marble kitchen island. The living and dining rooms are separate from the bedrooms. The price is for the entire apartment.',
    features: ['3 bedrooms', '2 bathrooms', 'Separate dining room', 'Furnished', 'In-unit laundry'],
    alt: 'Refined living room with an oatmeal sofa, panelled walls and large tree-facing windows.'
  },
  portCreditRetreat: {
    title: 'Port Credit lake-view retreat', school: 'mississauga', area: 'Port Credit', city: 'Mississauga', ask: 5250,
    start: '2027-05', end: '2027-08',
    description: 'A two-bedroom apartment with a private balcony, pale wood cabinetry and a light-filled sitting room. The bedroom and living area both face the water. Rent covers the whole furnished apartment for the four-month summer term.',
    features: ['2 bedrooms', '2 bathrooms', 'Private balcony', 'Furnished', 'In-unit laundry'],
    alt: 'Light coastal living room with a cream sectional, oak finishes and balcony doors overlooking water.'
  },
  vaughanSkySuite: {
    title: 'Vaughan skyline residence', school: 'york', area: 'Vaughan Metropolitan Centre', city: 'Vaughan', ask: 4950,
    start: '2027-09', end: '2027-12',
    description: 'A furnished two-bedroom corner apartment with a walnut-and-stone kitchen, full dining table and generous living room. The two bathrooms make sharing the whole unit easier for students arranging a term together.',
    features: ['2 bedrooms', '2 bathrooms', 'Corner windows', 'Elevator', 'In-unit laundry'],
    alt: 'Spacious high-rise living room with a gray sofa, walnut furniture and suburban skyline views.'
  },
  oakvilleTerrace: {
    title: 'Oakville terrace apartment', school: 'trafalgar', area: 'Oakville', city: 'Oakville', ask: 7250,
    start: '2027-05', end: '2027-08',
    description: 'A three-bedroom apartment opening onto a generous private terrace. Warm oak finishes, a cream stone kitchen and separate bedrooms give a group room to settle in. The monthly price is for the full furnished apartment.',
    features: ['3 bedrooms', '2 bathrooms', 'Private terrace', 'Furnished', 'In-unit laundry'],
    alt: 'Cream and sage living room opening onto a furnished terrace with leafy views.'
  },
  uptownGrandSuite: {
    title: 'Uptown Waterloo grand suite', waterloo: true, area: 'Uptown Waterloo', city: 'Waterloo', ask: 4750,
    start: '2027-01', end: '2027-04',
    description: 'A furnished two-bedroom penthouse with a green lounge sofa, wide city-facing windows and a full island kitchen. Separate bedrooms and two bathrooms allow a pair of students to share the entire unit during the winter term.',
    features: ['2 bedrooms', '2 bathrooms', 'Penthouse', 'Furnished', 'In-unit laundry'],
    alt: 'Airy Waterloo penthouse living room with a green sofa, warm wood floors and leafy city views.'
  }
};
for (const [key, { school, waterloo, ...place }] of Object.entries(luxuryPlaces)) {
  const campus = waterloo ? null : gtaCampuses[school];
  termletRooms[key] = {
    ...place, luxury: true, type: 'Entire apartment', vacant: 0,
    household: 'none', roommates: '0', gender: '',
    campus: waterloo ? termletCampuses[0] : campus.name,
    campusLabel: waterloo ? 'Waterloo & Laurier' : campus.short,
    ...(waterloo ? {otherCampuses:[termletCampuses[1]]} : {}),
    local: waterloo ? 'A fictional Uptown Waterloo apartment for students considering the University of Waterloo or Wilfrid Laurier University. Confirm the route that suits your schedule.' : campus.context,
    source: waterloo ? 'https://uwaterloo.ca/about/maps-and-directions' : campus.guide,
    image: 'places/luxury/' + key + '.webp', gallerySheet: true
  };
  termletGalleryLabels[key] = ['Living room', 'Kitchen', 'Primary bedroom', 'Bathroom'];
}
