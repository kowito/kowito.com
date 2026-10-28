export interface City {
  name: string;
  lat: number;
  lon: number;
}

export interface Country {
  id: number;
  name: string;
  /** ISO 3166-1 alpha-2, matching the map's polygon ids. */
  code: string;
  cities: City[];
  description: string;
  highlights: string[];
  visited?: boolean;
}

export const countries: Country[] = [
  {
    id: 1,
    name: "Canada",
    code: "CA",
    cities: [{ name: "Toronto", lat: 43.65, lon: -79.38 }, { name: "Vancouver", lat: 49.28, lon: -123.12 }],
    description: "A vast country with stunning natural landscapes, from Niagara Falls to the Canadian Rockies. Known for its friendliness, multiculturalism, and outdoor adventures.",
    highlights: ["Niagara Falls", "Rocky Mountains", "Friendly culture", "Natural beauty"],
    visited: true,
  },
  {
    id: 2,
    name: "China",
    code: "CN",
    cities: [{ name: "Beijing", lat: 39.9, lon: 116.4 }, { name: "Shanghai", lat: 31.23, lon: 121.47 }],
    description: "An ancient civilization meeting modern development. From the Great Wall and Forbidden City to ultra-modern skyscrapers, it's a study in contrasts.",
    highlights: ["Great Wall", "Forbidden City", "Ancient history", "Modern cities"],
    visited: true,
  },
  {
    id: 3,
    name: "Japan",
    code: "JP",
    cities: [{ name: "Tokyo", lat: 35.68, lon: 139.69 }, { name: "Kyoto", lat: 35.01, lon: 135.77 }],
    description: "Living here feels like stepping into a parallel universe. You get a hyper-futuristic metropolis, cyberpunk neon streets, ancient Shinto shrines, flawless train systems, and a design aesthetic that will completely reset your creative standards.",
    highlights: [
      "Hyper-futuristic metropolis",
      "Ancient Shinto shrines",
      "Perfect train systems",
      "Design excellence",
    ],
    visited: true,
  },
  {
    id: 4,
    name: "Malaysia",
    code: "MY",
    cities: [{ name: "Kuala Lumpur", lat: 3.14, lon: 101.69 }, { name: "Penang", lat: 5.41, lon: 100.33 }],
    description: "A melting pot of cultures, cuisines, and landscapes. From bustling urban centers to lush rainforests, Malaysia offers an incredible mix of modernity and nature.",
    highlights: ["Petronas Towers", "Rainforests", "Food culture", "Cultural diversity"],
    visited: true,
  },
  {
    id: 5,
    name: "Netherlands",
    code: "NL",
    cities: [{ name: "Amsterdam", lat: 52.37, lon: 4.9 }, { name: "Rotterdam", lat: 51.92, lon: 4.48 }],
    description: "A cycling paradise with picturesque canals, charming villages, and world-class museums. The Dutch have mastered the art of living well.",
    highlights: ["Canal cities", "Cycling culture", "Art museums", "Tulips"],
    visited: true,
  },
  {
    id: 6,
    name: "Singapore",
    code: "SG",
    cities: [{ name: "Singapore", lat: 1.35, lon: 103.82 }],
    description: "A stunning city-state that's hyper-efficient, ultra-modern, and incredibly clean. Shopping, food, and business hub of Southeast Asia.",
    highlights: ["Marina Bay", "Efficiency", "Shopping", "Street food"],
    visited: true,
  },
  {
    id: 7,
    name: "Taiwan",
    code: "TW",
    cities: [{ name: "Taipei", lat: 25.03, lon: 121.57 }],
    description: "A neon-soaked valley surrounded by green mountains and hot springs. It boasts the best night markets in the world, an incredible tech-forward subculture, and a deeply welcoming, progressive society.",
    highlights: ["Night markets", "Hot springs", "Tech-forward", "Progressive society"],
    visited: true,
  },
  {
    id: 8,
    name: "US",
    code: "US",
    cities: [{ name: "New York", lat: 40.71, lon: -74.01 }, { name: "Los Angeles", lat: 34.05, lon: -118.24 }],
    description: "The land of opportunity with incredible diversity—from bustling metropolises to natural wonders. Each region has its own distinct culture and energy.",
    highlights: ["NYC energy", "Natural wonders", "Diverse culture", "American dream"],
    visited: true,
  },
  {
    id: 9,
    name: "Laos",
    code: "LA",
    cities: [{ name: "Luang Prabang", lat: 19.89, lon: 102.13 }, { name: "Vientiane", lat: 17.97, lon: 102.63 }],
    description: "A peaceful, laid-back country where time moves slowly. Known for its spiritual traditions, stunning temples, and the mighty Mekong River.",
    highlights: ["Luang Prabang temples", "Mekong River", "Spiritual traditions", "Laid-back vibe"],
    visited: true,
  },
  {
    id: 10,
    name: "Thailand",
    code: "TH",
    cities: [{ name: "Bangkok", lat: 13.76, lon: 100.5 }, { name: "Chiang Mai", lat: 18.79, lon: 98.98 }],
    description: "The Land of Smiles offers vibrant street life, ornate Buddhist temples, and tropical beaches. From the bustling markets and street food scene of Bangkok to the serene mountains and digital nomad hubs of Chiang Mai, Thailand blends tradition with modernity.",
    highlights: ["Street food culture", "Buddhist temples", "Tropical beaches", "Digital nomad hubs"],
    visited: true,
  },
  {
    id: 11,
    name: "Mexico",
    code: "MX",
    cities: [{ name: "Mexico City", lat: 19.43, lon: -99.13 }, { name: "Oaxaca", lat: 17.07, lon: -96.73 }],
    description:
      "Nowhere matches the raw energy, color, and depth of Mexico. From eating street tacos next to Aztec ruins to exploring the surrealist art scene in Roma, it is an absolute assault on the senses in the best way possible.",
    highlights: [
      "Raw energy and color",
      "Aztec ruins",
      "Street tacos",
      "Surrealist art scene",
    ],
  },
  {
    id: 12,
    name: "Argentina",
    code: "AR",
    cities: [{ name: "Buenos Aires", lat: -34.6, lon: -58.38 }],
    description:
      "A city of pure passion, fading European grandeur, and intense late-night culture. You will find yourself eating world-class steaks, drinking Malbec, and watching street tango in San Telmo at 2:00 AM on a Tuesday.",
    highlights: ["Pure passion", "World-class steaks", "Street tango", "Malbec wine"],
  },
  {
    id: 13,
    name: "Colombia",
    code: "CO",
    cities: [{ name: "Medellín", lat: 6.24, lon: -75.58 }, { name: "Cartagena", lat: 10.39, lon: -75.48 }],
    description:
      "A country that completely reinvented itself. Living in Medellín—a city built inside a lush green bowl of mountains with cable cars scaling the peaks—gives you an infectious energy of resilience, warmth, and constant nightlife.",
    highlights: [
      "Mountain bowl setting",
      "Cable car peaks",
      "Infectious energy",
      "Reinvented city",
    ],
  },
  {
    id: 14,
    name: "Turkey",
    code: "TR",
    cities: [{ name: "Istanbul", lat: 41.01, lon: 28.98 }],
    description:
      "The only place on Earth where you can literally cross continents for breakfast. Living between Europe and Asia, surrounded by Byzantine domes, chaotic spice bazaars, and the constant calls to prayer over the Bosphorus strait, is deeply surreal.",
    highlights: [
      "Two continents",
      "Byzantine domes",
      "Spice bazaars",
      "Bosphorus strait",
    ],
  },
  {
    id: 15,
    name: "Indonesia",
    code: "ID",
    cities: [{ name: "Bali", lat: -8.65, lon: 115.22 }, { name: "Ubud", lat: -8.51, lon: 115.26 }, { name: "Uluwatu", lat: -8.83, lon: 115.09 }],
    description:
      "Beyond the tourist traps, Bali has a unique spiritual heartbeat. Living among active volcanic landscapes, ancient Hindu water temples, and terraced rice paddies creates a headspace that completely changes how you view work and life.",
    highlights: [
      "Spiritual heartbeat",
      "Volcanic landscapes",
      "Water temples",
      "Rice paddies",
    ],
  },
  {
    id: 16,
    name: "Peru",
    code: "PE",
    cities: [{ name: "Cusco", lat: -13.53, lon: -71.97 }, { name: "Lima", lat: -12.05, lon: -77.04 }],
    description:
      "Imagine taking a weekend trip to Machu Picchu or hiking through the Sacred Valley of the Incas. Lima is also the culinary capital of South America, offering some of the most mind-blowing gastronomy on the planet.",
    highlights: ["Machu Picchu", "Sacred Valley", "Inca heritage", "World-class gastronomy"],
  },
  {
    id: 17,
    name: "South Korea",
    code: "KR",
    cities: [{ name: "Seoul", lat: 37.57, lon: 126.98 }],
    description:
      "A hyper-digitized society where 24/7 convenience meets ancient palaces. The contrast between ultra-modern K-culture, futuristic architecture, and hidden mountain temples makes it endlessly fascinating to explore.",
    highlights: ["Hyper-digitized", "K-culture", "Ancient palaces", "Mountain temples"],
  },
  {
    id: 18,
    name: "Georgia",
    code: "GE",
    cities: [{ name: "Tbilisi", lat: 41.72, lon: 44.79 }],
    description:
      "A hidden gem at the crossroads of Eastern Europe and Asia. It features brutalist Soviet architecture mixed with medieval fortresses, a legendary natural sulfur bath culture, and the oldest winemaking history in the world (dating back 8,000 years).",
    highlights: [
      "Brutalist architecture",
      "Medieval fortresses",
      "Sulfur baths",
      "8,000-year wine history",
    ],
  },
  {
    id: 19,
    name: "South Africa",
    code: "ZA",
    cities: [{ name: "Cape Town", lat: -33.92, lon: 18.42 }],
    description:
      "Nowhere else does a massive table-shaped mountain drop directly into two crashing oceans. You can finish a work meeting and go surf with penguins, hike up Lion's Head for sunset, or drive through world-famous vineyards within 30 minutes.",
    highlights: ["Table Mountain", "Penguin surfing", "Lion's Head", "Vineyards"],
  },
  {
    id: 20,
    name: "Portugal",
    code: "PT",
    cities: [{ name: "Lisbon", lat: 38.72, lon: -9.14 }, { name: "Porto", lat: 41.16, lon: -8.63 }],
    description:
      "A coastal fairytale city built on seven hills, covered in hand-painted ceramic tiles (azulejos), echoing with the hauntingly beautiful sounds of traditional Fado music at night.",
    highlights: ["Seven hills", "Azulejos tiles", "Fado music", "Coastal charm"],
  },
  {
    id: 21,
    name: "Italy",
    code: "IT",
    cities: [{ name: "Florence", lat: 43.77, lon: 11.26 }, { name: "Palermo", lat: 38.12, lon: 13.36 }],
    description:
      "Living in Italy means treating history as your backyard. You can grab an espresso and walk past buildings designed by Michelangelo, or base yourself in Sicily to experience raw, chaotic, and beautiful Mediterranean island culture.",
    highlights: ["Michelangelo legacy", "Renaissance art", "Mediterranean culture", "Ancient history"],
  },
  {
    id: 22,
    name: "Brazil",
    code: "BR",
    cities: [{ name: "Rio de Janeiro", lat: -22.91, lon: -43.17 }, { name: "Florianópolis", lat: -27.6, lon: -48.55 }],
    description:
      "Rio is pure, unadulterated drama—towering green granite peaks rising out of white-sand beaches, overlooked by Christ the Redeemer. The energy, the music (Samba and Bossa Nova), and the sheer joy of life here are unmatched.",
    highlights: ["Christ the Redeemer", "Granite peaks", "Samba and Bossa Nova", "Unmatched energy"],
  },
  {
    id: 23,
    name: "Egypt",
    code: "EG",
    cities: [{ name: "Cairo", lat: 30.04, lon: 31.24 }, { name: "Dahab", lat: 28.5, lon: 34.51 }],
    description:
      "Working with a view of the Great Pyramids of Giza is an unmatched bucket-list experience. When you need to escape the chaotic energy of Cairo, you can retreat to Dahab on the Red Sea for a laid-back, bohemian bedouin lifestyle.",
    highlights: ["Great Pyramids", "Giza views", "Red Sea", "Bedouin lifestyle"],
  },
  {
    id: 24,
    name: "India",
    code: "IN",
    cities: [{ name: "Mumbai", lat: 19.08, lon: 72.88 }, { name: "Goa", lat: 15.3, lon: 74.12 }],
    description:
      "India is an absolute sensory overload. From the intense, fast-paced financial hustle of Mumbai to the laid-back, Portuguese-influenced beach shacks of Goa, it is a subcontinent that forces you to grow and see the world differently.",
    highlights: [
      "Sensory overload",
      "Financial hustle",
      "Beach shacks",
      "Cultural diversity",
    ],
  },
  {
    id: 25,
    name: "Spain",
    code: "ES",
    cities: [{ name: "Barcelona", lat: 41.39, lon: 2.17 }, { name: "Seville", lat: 37.39, lon: -5.98 }],
    description:
      "A country that refuses to rush. Living here means adapting to a culture that values tapas, mid-day siestas, late-night dinners, and architectural marvels like Gaudi's Sagrada Família.",
    highlights: ["Gaudi's Sagrada Família", "Tapas culture", "Siestas", "Late-night living"],
  },
  {
    id: 26,
    name: "Greece",
    code: "GR",
    cities: [{ name: "Athens", lat: 37.98, lon: 23.73 }, { name: "Crete", lat: 35.34, lon: 25.13 }],
    description:
      "Base your temporary office in the birthplace of Western philosophy. You can spend your afternoons walking through the ancient Acropolis and your weekends sailing across deep blue Aegean waters.",
    highlights: ["Acropolis", "Western philosophy", "Aegean waters", "Ancient ruins"],
  },
  {
    id: 27,
    name: "Morocco",
    code: "MA",
    cities: [{ name: "Marrakech", lat: 31.63, lon: -7.99 }, { name: "Taghazout", lat: 30.54, lon: -9.71 }],
    description:
      "A world of labyrinth-like medinas, towering Atlas mountains, and Sahara desert dunes. You can get lost in the bustling souks of Marrakech or live in a sleepy surf village on the Atlantic coast.",
    highlights: ["Medinas", "Atlas mountains", "Sahara dunes", "Surf villages"],
  },
  {
    id: 28,
    name: "Vietnam",
    code: "VN",
    cities: [{ name: "Hanoi", lat: 21.03, lon: 105.85 }, { name: "Da Nang", lat: 16.05, lon: 108.2 }],
    description:
      "Hanoi is beautifully chaotic—scooters buzzing past French-colonial architecture, hidden cafes serving egg coffee, and the incredible, misty limestone pillars of Ha Long Bay just a short trip away.",
    highlights: ["French-colonial architecture", "Egg coffee", "Ha Long Bay", "Limestone pillars"],
  },
  {
    id: 29,
    name: "Iceland",
    code: "IS",
    cities: [{ name: "Reykjavik", lat: 64.15, lon: -21.94 }],
    description:
      "It feels like living on Mars. The infrastructure is hyper-modern and perfect for remote work, but step outside the city and you are surrounded by active volcanoes, massive glaciers, geysers, and roaring waterfalls under the Northern Lights.",
    highlights: ["Active volcanoes", "Glaciers", "Northern Lights", "Waterfalls"],
  },
  {
    id: 30,
    name: "New Zealand",
    code: "NZ",
    cities: [{ name: "Queenstown", lat: -45.03, lon: 168.66 }, { name: "Auckland", lat: -36.85, lon: 174.76 }],
    description:
      "The ultimate destination for outdoor adrenaline and cinematic landscapes (literally Middle-earth). Perfect if your idea of \"interesting\" involves bungee jumping, glacier hiking, and pristine fjords after work.",
    highlights: ["Middle-earth", "Bungee jumping", "Glacier hiking", "Pristine fjords"],
  },
  {
    id: 31,
    name: "Costa Rica",
    code: "CR",
    cities: [{ name: "Santa Teresa", lat: 9.65, lon: -85.17 }, { name: "Nosara", lat: 9.98, lon: -85.65 }],
    description:
      "Living deep inside the jungle right where it meets the Pacific Ocean. The \"Pura Vida\" (pure life) philosophy means your daily routine is dictated by surf tides, toucans, and spectacular beach sunsets.",
    highlights: ["Pura Vida", "Jungle living", "Surfing", "Beach sunsets"],
  },
  {
    id: 32,
    name: "Germany",
    code: "DE",
    cities: [{ name: "Berlin", lat: 52.52, lon: 13.4 }],
    description:
      "The alternative cultural capital of Europe. It is gritty, raw, heavily scarred by 20th-century history, and home to the most avant-garde art, techno, and underground subcultures on earth.",
    highlights: ["Alternative culture", "Avant-garde art", "Techno scene", "History"],
  },
  {
    id: 33,
    name: "Czech Republic",
    code: "CZ",
    cities: [{ name: "Prague", lat: 50.08, lon: 14.44 }],
    description:
      "Living inside a gothic fairytale. The city escaped the heavy bombings of WWII, leaving its breathtaking 1,000-year-old architecture, winding cobblestone streets, and historic castles perfectly intact.",
    highlights: ["Gothic fairytale", "Ancient architecture", "Castles", "Cobblestone streets"],
  },
  {
    id: 34,
    name: "Jordan",
    code: "JO",
    cities: [{ name: "Amman", lat: 31.95, lon: 35.93 }, { name: "Petra", lat: 30.33, lon: 35.44 }],
    description:
      "Middle Eastern hospitality at its absolute finest. Living here gives you access to the ancient rose-red city of Petra carved into canyon walls, floating in the Dead Sea, and camping in the Martian landscapes of Wadi Rum.",
    highlights: ["Petra city", "Dead Sea", "Wadi Rum", "Ancient hospitality"],
  },
  {
    id: 35,
    name: "France",
    code: "FR",
    cities: [{ name: "Paris", lat: 48.86, lon: 2.35 }, { name: "Lyon", lat: 45.76, lon: 4.84 }],
    description:
      "Yes, it's a cliché, but living there is different from visiting. Buying your morning baguette, sitting at a sidewalk cafe for hours writing code, and walking along the Seine at night offers an unmatched romanticism.",
    highlights: ["Baguettes", "Seine riverside", "Sidewalk cafes", "Romanticism"],
  },
  {
    id: 36,
    name: "Croatia",
    code: "HR",
    cities: [{ name: "Split", lat: 43.51, lon: 16.44 }, { name: "Dubrovnik", lat: 42.65, lon: 18.09 }],
    description:
      "Live inside ancient history. In Split, the city's cafes and shops are literally built inside the walls of a 1,700-year-old Roman Emperor's palace, right on the edge of the crystal-clear Adriatic Sea.",
    highlights: ["Roman palace", "Adriatic Sea", "Ancient history", "Crystal-clear waters"],
  },
  {
    id: 37,
    name: "Sri Lanka",
    code: "LK",
    cities: [{ name: "Colombo", lat: 6.93, lon: 79.86 }, { name: "Hiriketiya", lat: 5.96, lon: 80.7 }],
    description:
      "An island tear-drop in the Indian Ocean filled with wild elephants, ancient Buddhist ruins hidden in jungles, legendary colonial train rides through tea plantations, and world-class surf bays.",
    highlights: ["Wild elephants", "Buddhist ruins", "Train rides", "Surf bays"],
  },
  {
    id: 38,
    name: "United Kingdom",
    code: "GB",
    cities: [{ name: "London", lat: 51.51, lon: -0.13 }, { name: "Edinburgh", lat: 55.95, lon: -3.19 }],
    description:
      "London is a global cultural melting pot where every neighborhood feels like a different country, while Edinburgh offers a moody, gothic atmosphere with a castle sitting right on top of an extinct volcano in the middle of the city.",
    highlights: ["Cultural melting pot", "Gothic atmosphere", "Castle on volcano", "Global influence"],
  },
];

/** Where every trip starts. */
export const home: City = { name: "Bangkok", lat: 13.76, lon: 100.5 };

/** "TH" -> 🇹🇭, built from regional indicator letters. */
export const flagOf = (code: string) =>
  String.fromCodePoint(...[...code.toUpperCase()].map((ch) => 0x1f1a5 + ch.charCodeAt(0)));

/** Great-circle distance in km. */
export function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
