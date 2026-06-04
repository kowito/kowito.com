export interface Country {
  id: number;
  name: string;
  cities: string[];
  description: string;
  highlights: string[];
  visited?: boolean;
}

export const countries: Country[] = [
  {
    id: 1,
    name: "Canada",
    cities: ["Toronto", "Vancouver"],
    description: "A vast country with stunning natural landscapes, from Niagara Falls to the Canadian Rockies. Known for its friendliness, multiculturalism, and outdoor adventures.",
    highlights: ["Niagara Falls", "Rocky Mountains", "Friendly culture", "Natural beauty"],
    visited: true,
  },
  {
    id: 2,
    name: "China",
    cities: ["Beijing", "Shanghai"],
    description: "An ancient civilization meeting modern development. From the Great Wall and Forbidden City to ultra-modern skyscrapers, it's a study in contrasts.",
    highlights: ["Great Wall", "Forbidden City", "Ancient history", "Modern cities"],
    visited: true,
  },
  {
    id: 3,
    name: "Japan",
    cities: ["Tokyo", "Kyoto"],
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
    cities: ["Kuala Lumpur", "Penang"],
    description: "A melting pot of cultures, cuisines, and landscapes. From bustling urban centers to lush rainforests, Malaysia offers an incredible mix of modernity and nature.",
    highlights: ["Petronas Towers", "Rainforests", "Food culture", "Cultural diversity"],
    visited: true,
  },
  {
    id: 5,
    name: "Netherlands",
    cities: ["Amsterdam", "Rotterdam"],
    description: "A cycling paradise with picturesque canals, charming villages, and world-class museums. The Dutch have mastered the art of living well.",
    highlights: ["Canal cities", "Cycling culture", "Art museums", "Tulips"],
    visited: true,
  },
  {
    id: 6,
    name: "Singapore",
    cities: ["Singapore"],
    description: "A stunning city-state that's hyper-efficient, ultra-modern, and incredibly clean. Shopping, food, and business hub of Southeast Asia.",
    highlights: ["Marina Bay", "Efficiency", "Shopping", "Street food"],
    visited: true,
  },
  {
    id: 7,
    name: "Taiwan",
    cities: ["Taipei"],
    description: "A neon-soaked valley surrounded by green mountains and hot springs. It boasts the best night markets in the world, an incredible tech-forward subculture, and a deeply welcoming, progressive society.",
    highlights: ["Night markets", "Hot springs", "Tech-forward", "Progressive society"],
    visited: true,
  },
  {
    id: 8,
    name: "US",
    cities: ["New York", "Los Angeles"],
    description: "The land of opportunity with incredible diversity—from bustling metropolises to natural wonders. Each region has its own distinct culture and energy.",
    highlights: ["NYC energy", "Natural wonders", "Diverse culture", "American dream"],
    visited: true,
  },
  {
    id: 9,
    name: "Laos",
    cities: ["Luang Prabang", "Vientiane"],
    description: "A peaceful, laid-back country where time moves slowly. Known for its spiritual traditions, stunning temples, and the mighty Mekong River.",
    highlights: ["Luang Prabang temples", "Mekong River", "Spiritual traditions", "Laid-back vibe"],
    visited: true,
  },
  {
    id: 10,
    name: "Thailand",
    cities: ["Bangkok", "Chiang Mai"],
    description: "The Land of Smiles offers vibrant street life, ornate Buddhist temples, and tropical beaches. From the bustling markets and street food scene of Bangkok to the serene mountains and digital nomad hubs of Chiang Mai, Thailand blends tradition with modernity.",
    highlights: ["Street food culture", "Buddhist temples", "Tropical beaches", "Digital nomad hubs"],
    visited: true,
  },
  {
    id: 11,
    name: "Mexico",
    cities: ["Mexico City", "Oaxaca"],
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
    cities: ["Buenos Aires"],
    description:
      "A city of pure passion, fading European grandeur, and intense late-night culture. You will find yourself eating world-class steaks, drinking Malbec, and watching street tango in San Telmo at 2:00 AM on a Tuesday.",
    highlights: ["Pure passion", "World-class steaks", "Street tango", "Malbec wine"],
  },
  {
    id: 13,
    name: "Colombia",
    cities: ["Medellín", "Cartagena"],
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
    cities: ["Istanbul"],
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
    cities: ["Bali", "Ubud", "Uluwatus"],
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
    cities: ["Cusco", "Lima"],
    description:
      "Imagine taking a weekend trip to Machu Picchu or hiking through the Sacred Valley of the Incas. Lima is also the culinary capital of South America, offering some of the most mind-blowing gastronomy on the planet.",
    highlights: ["Machu Picchu", "Sacred Valley", "Inca heritage", "World-class gastronomy"],
  },
  {
    id: 17,
    name: "South Korea",
    cities: ["Seoul"],
    description:
      "A hyper-digitized society where 24/7 convenience meets ancient palaces. The contrast between ultra-modern K-culture, futuristic architecture, and hidden mountain temples makes it endlessly fascinating to explore.",
    highlights: ["Hyper-digitized", "K-culture", "Ancient palaces", "Mountain temples"],
  },
  {
    id: 18,
    name: "Georgia",
    cities: ["Tbilisi"],
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
    cities: ["Cape Town"],
    description:
      "Nowhere else does a massive table-shaped mountain drop directly into two crashing oceans. You can finish a work meeting and go surf with penguins, hike up Lion's Head for sunset, or drive through world-famous vineyards within 30 minutes.",
    highlights: ["Table Mountain", "Penguin surfing", "Lion's Head", "Vineyards"],
  },
  {
    id: 20,
    name: "Portugal",
    cities: ["Lisbon", "Porto"],
    description:
      "A coastal fairytale city built on seven hills, covered in hand-painted ceramic tiles (azulejos), echoing with the hauntingly beautiful sounds of traditional Fado music at night.",
    highlights: ["Seven hills", "Azulejos tiles", "Fado music", "Coastal charm"],
  },
  {
    id: 21,
    name: "Italy",
    cities: ["Florence", "Palermo"],
    description:
      "Living in Italy means treating history as your backyard. You can grab an espresso and walk past buildings designed by Michelangelo, or base yourself in Sicily to experience raw, chaotic, and beautiful Mediterranean island culture.",
    highlights: ["Michelangelo legacy", "Renaissance art", "Mediterranean culture", "Ancient history"],
  },
  {
    id: 22,
    name: "Brazil",
    cities: ["Rio de Janeiro", "Florianópolis"],
    description:
      "Rio is pure, unadulterated drama—towering green granite peaks rising out of white-sand beaches, overlooked by Christ the Redeemer. The energy, the music (Samba and Bossa Nova), and the sheer joy of life here are unmatched.",
    highlights: ["Christ the Redeemer", "Granite peaks", "Samba and Bossa Nova", "Unmatched energy"],
  },
  {
    id: 23,
    name: "Egypt",
    cities: ["Cairo", "Dahab"],
    description:
      "Working with a view of the Great Pyramids of Giza is an unmatched bucket-list experience. When you need to escape the chaotic energy of Cairo, you can retreat to Dahab on the Red Sea for a laid-back, bohemian bedouin lifestyle.",
    highlights: ["Great Pyramids", "Giza views", "Red Sea", "Bedouin lifestyle"],
  },
  {
    id: 24,
    name: "India",
    cities: ["Mumbai", "Goa"],
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
    cities: ["Barcelona", "Seville"],
    description:
      "A country that refuses to rush. Living here means adapting to a culture that values tapas, mid-day siestas, late-night dinners, and architectural marvels like Gaudi's Sagrada Família.",
    highlights: ["Gaudi's Sagrada Família", "Tapas culture", "Siestas", "Late-night living"],
  },
  {
    id: 26,
    name: "Greece",
    cities: ["Athens", "Crete"],
    description:
      "Base your temporary office in the birthplace of Western philosophy. You can spend your afternoons walking through the ancient Acropolis and your weekends sailing across deep blue Aegean waters.",
    highlights: ["Acropolis", "Western philosophy", "Aegean waters", "Ancient ruins"],
  },
  {
    id: 27,
    name: "Morocco",
    cities: ["Marrakech", "Taghazout"],
    description:
      "A world of labyrinth-like medinas, towering Atlas mountains, and Sahara desert dunes. You can get lost in the bustling souks of Marrakech or live in a sleepy surf village on the Atlantic coast.",
    highlights: ["Medinas", "Atlas mountains", "Sahara dunes", "Surf villages"],
  },
  {
    id: 28,
    name: "Vietnam",
    cities: ["Hanoi", "Da Nang"],
    description:
      "Hanoi is beautifully chaotic—scooters buzzing past French-colonial architecture, hidden cafes serving egg coffee, and the incredible, misty limestone pillars of Ha Long Bay just a short trip away.",
    highlights: ["French-colonial architecture", "Egg coffee", "Ha Long Bay", "Limestone pillars"],
  },
  {
    id: 29,
    name: "Iceland",
    cities: ["Reykjavik"],
    description:
      "It feels like living on Mars. The infrastructure is hyper-modern and perfect for remote work, but step outside the city and you are surrounded by active volcanoes, massive glaciers, geysers, and roaring waterfalls under the Northern Lights.",
    highlights: ["Active volcanoes", "Glaciers", "Northern Lights", "Waterfalls"],
  },
  {
    id: 30,
    name: "New Zealand",
    cities: ["Queenstown", "Auckland"],
    description:
      "The ultimate destination for outdoor adrenaline and cinematic landscapes (literally Middle-earth). Perfect if your idea of \"interesting\" involves bungee jumping, glacier hiking, and pristine fjords after work.",
    highlights: ["Middle-earth", "Bungee jumping", "Glacier hiking", "Pristine fjords"],
  },
  {
    id: 31,
    name: "Costa Rica",
    cities: ["Santa Teresa", "Nosara"],
    description:
      "Living deep inside the jungle right where it meets the Pacific Ocean. The \"Pura Vida\" (pure life) philosophy means your daily routine is dictated by surf tides, toucans, and spectacular beach sunsets.",
    highlights: ["Pura Vida", "Jungle living", "Surfing", "Beach sunsets"],
  },
  {
    id: 32,
    name: "Germany",
    cities: ["Berlin"],
    description:
      "The alternative cultural capital of Europe. It is gritty, raw, heavily scarred by 20th-century history, and home to the most avant-garde art, techno, and underground subcultures on earth.",
    highlights: ["Alternative culture", "Avant-garde art", "Techno scene", "History"],
  },
  {
    id: 33,
    name: "Czech Republic",
    cities: ["Prague"],
    description:
      "Living inside a gothic fairytale. The city escaped the heavy bombings of WWII, leaving its breathtaking 1,000-year-old architecture, winding cobblestone streets, and historic castles perfectly intact.",
    highlights: ["Gothic fairytale", "Ancient architecture", "Castles", "Cobblestone streets"],
  },
  {
    id: 34,
    name: "Jordan",
    cities: ["Amman", "Petra"],
    description:
      "Middle Eastern hospitality at its absolute finest. Living here gives you access to the ancient rose-red city of Petra carved into canyon walls, floating in the Dead Sea, and camping in the Martian landscapes of Wadi Rum.",
    highlights: ["Petra city", "Dead Sea", "Wadi Rum", "Ancient hospitality"],
  },
  {
    id: 35,
    name: "France",
    cities: ["Paris", "Lyon"],
    description:
      "Yes, it's a cliché, but living there is different from visiting. Buying your morning baguette, sitting at a sidewalk cafe for hours writing code, and walking along the Seine at night offers an unmatched romanticism.",
    highlights: ["Baguettes", "Seine riverside", "Sidewalk cafes", "Romanticism"],
  },
  {
    id: 36,
    name: "Croatia",
    cities: ["Split", "Dubrovnik"],
    description:
      "Live inside ancient history. In Split, the city's cafes and shops are literally built inside the walls of a 1,700-year-old Roman Emperor's palace, right on the edge of the crystal-clear Adriatic Sea.",
    highlights: ["Roman palace", "Adriatic Sea", "Ancient history", "Crystal-clear waters"],
  },
  {
    id: 37,
    name: "Sri Lanka",
    cities: ["Colombo", "Hiriketiya"],
    description:
      "An island tear-drop in the Indian Ocean filled with wild elephants, ancient Buddhist ruins hidden in jungles, legendary colonial train rides through tea plantations, and world-class surf bays.",
    highlights: ["Wild elephants", "Buddhist ruins", "Train rides", "Surf bays"],
  },
  {
    id: 38,
    name: "United Kingdom",
    cities: ["London", "Edinburgh"],
    description:
      "London is a global cultural melting pot where every neighborhood feels like a different country, while Edinburgh offers a moody, gothic atmosphere with a castle sitting right on top of an extinct volcano in the middle of the city.",
    highlights: ["Cultural melting pot", "Gothic atmosphere", "Castle on volcano", "Global influence"],
  },
];
