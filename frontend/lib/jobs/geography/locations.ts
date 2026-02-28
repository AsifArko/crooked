/**
 * City × country seed for location-based job crawling.
 * ~200 major cities across ~50 countries. Expand as needed.
 */

export type LocationSeed = {
  countryCode: string;
  countryName: string;
  city: string;
  citySlug: string;
};

export const LOCATIONS: LocationSeed[] = [
  // US
  { countryCode: "us", countryName: "United States", city: "San Francisco", citySlug: "san-francisco" },
  { countryCode: "us", countryName: "United States", city: "New York", citySlug: "new-york" },
  { countryCode: "us", countryName: "United States", city: "Los Angeles", citySlug: "los-angeles" },
  { countryCode: "us", countryName: "United States", city: "Seattle", citySlug: "seattle" },
  { countryCode: "us", countryName: "United States", city: "Austin", citySlug: "austin" },
  { countryCode: "us", countryName: "United States", city: "Boston", citySlug: "boston" },
  { countryCode: "us", countryName: "United States", city: "Denver", citySlug: "denver" },
  { countryCode: "us", countryName: "United States", city: "Chicago", citySlug: "chicago" },
  { countryCode: "us", countryName: "United States", city: "Miami", citySlug: "miami" },
  { countryCode: "us", countryName: "United States", city: "Washington DC", citySlug: "washington-dc" },
  // UK
  { countryCode: "gb", countryName: "United Kingdom", city: "London", citySlug: "london" },
  { countryCode: "gb", countryName: "United Kingdom", city: "Manchester", citySlug: "manchester" },
  { countryCode: "gb", countryName: "United Kingdom", city: "Edinburgh", citySlug: "edinburgh" },
  { countryCode: "gb", countryName: "United Kingdom", city: "Birmingham", citySlug: "birmingham" },
  { countryCode: "gb", countryName: "United Kingdom", city: "Bristol", citySlug: "bristol" },
  // Germany
  { countryCode: "de", countryName: "Germany", city: "Berlin", citySlug: "berlin" },
  { countryCode: "de", countryName: "Germany", city: "Munich", citySlug: "munich" },
  { countryCode: "de", countryName: "Germany", city: "Hamburg", citySlug: "hamburg" },
  { countryCode: "de", countryName: "Germany", city: "Frankfurt", citySlug: "frankfurt" },
  { countryCode: "de", countryName: "Germany", city: "Cologne", citySlug: "cologne" },
  // France
  { countryCode: "fr", countryName: "France", city: "Paris", citySlug: "paris" },
  { countryCode: "fr", countryName: "France", city: "Lyon", citySlug: "lyon" },
  { countryCode: "fr", countryName: "France", city: "Marseille", citySlug: "marseille" },
  { countryCode: "fr", countryName: "France", city: "Toulouse", citySlug: "toulouse" },
  // Netherlands
  { countryCode: "nl", countryName: "Netherlands", city: "Amsterdam", citySlug: "amsterdam" },
  { countryCode: "nl", countryName: "Netherlands", city: "Rotterdam", citySlug: "rotterdam" },
  { countryCode: "nl", countryName: "Netherlands", city: "Utrecht", citySlug: "utrecht" },
  // Spain
  { countryCode: "es", countryName: "Spain", city: "Madrid", citySlug: "madrid" },
  { countryCode: "es", countryName: "Spain", city: "Barcelona", citySlug: "barcelona" },
  { countryCode: "es", countryName: "Spain", city: "Valencia", citySlug: "valencia" },
  // Canada
  { countryCode: "ca", countryName: "Canada", city: "Toronto", citySlug: "toronto" },
  { countryCode: "ca", countryName: "Canada", city: "Vancouver", citySlug: "vancouver" },
  { countryCode: "ca", countryName: "Canada", city: "Montreal", citySlug: "montreal" },
  { countryCode: "ca", countryName: "Canada", city: "Calgary", citySlug: "calgary" },
  { countryCode: "ca", countryName: "Canada", city: "Ottawa", citySlug: "ottawa" },
  // Australia
  { countryCode: "au", countryName: "Australia", city: "Sydney", citySlug: "sydney" },
  { countryCode: "au", countryName: "Australia", city: "Melbourne", citySlug: "melbourne" },
  { countryCode: "au", countryName: "Australia", city: "Brisbane", citySlug: "brisbane" },
  { countryCode: "au", countryName: "Australia", city: "Perth", citySlug: "perth" },
  // India
  { countryCode: "in", countryName: "India", city: "Bangalore", citySlug: "bangalore" },
  { countryCode: "in", countryName: "India", city: "Mumbai", citySlug: "mumbai" },
  { countryCode: "in", countryName: "India", city: "Hyderabad", citySlug: "hyderabad" },
  { countryCode: "in", countryName: "India", city: "Delhi", citySlug: "delhi" },
  { countryCode: "in", countryName: "India", city: "Chennai", citySlug: "chennai" },
  // Ireland
  { countryCode: "ie", countryName: "Ireland", city: "Dublin", citySlug: "dublin" },
  { countryCode: "ie", countryName: "Ireland", city: "Cork", citySlug: "cork" },
  // Poland
  { countryCode: "pl", countryName: "Poland", city: "Warsaw", citySlug: "warsaw" },
  { countryCode: "pl", countryName: "Poland", city: "Krakow", citySlug: "krakow" },
  { countryCode: "pl", countryName: "Poland", city: "Wroclaw", citySlug: "wroclaw" },
  // Sweden
  { countryCode: "se", countryName: "Sweden", city: "Stockholm", citySlug: "stockholm" },
  { countryCode: "se", countryName: "Sweden", city: "Gothenburg", citySlug: "gothenburg" },
  // Switzerland
  { countryCode: "ch", countryName: "Switzerland", city: "Zurich", citySlug: "zurich" },
  { countryCode: "ch", countryName: "Switzerland", city: "Geneva", citySlug: "geneva" },
  // Portugal
  { countryCode: "pt", countryName: "Portugal", city: "Lisbon", citySlug: "lisbon" },
  { countryCode: "pt", countryName: "Portugal", city: "Porto", citySlug: "porto" },
  // Brazil
  { countryCode: "br", countryName: "Brazil", city: "São Paulo", citySlug: "sao-paulo" },
  { countryCode: "br", countryName: "Brazil", city: "Rio de Janeiro", citySlug: "rio-de-janeiro" },
  // Mexico
  { countryCode: "mx", countryName: "Mexico", city: "Mexico City", citySlug: "mexico-city" },
  { countryCode: "mx", countryName: "Mexico", city: "Guadalajara", citySlug: "guadalajara" },
  // Argentina
  { countryCode: "ar", countryName: "Argentina", city: "Buenos Aires", citySlug: "buenos-aires" },
  // Israel
  { countryCode: "il", countryName: "Israel", city: "Tel Aviv", citySlug: "tel-aviv" },
  { countryCode: "il", countryName: "Israel", city: "Jerusalem", citySlug: "jerusalem" },
  // Japan
  { countryCode: "jp", countryName: "Japan", city: "Tokyo", citySlug: "tokyo" },
  { countryCode: "jp", countryName: "Japan", city: "Osaka", citySlug: "osaka" },
  // Singapore
  { countryCode: "sg", countryName: "Singapore", city: "Singapore", citySlug: "singapore" },
  // South Korea
  { countryCode: "kr", countryName: "South Korea", city: "Seoul", citySlug: "seoul" },
  // UAE
  { countryCode: "ae", countryName: "United Arab Emirates", city: "Dubai", citySlug: "dubai" },
  { countryCode: "ae", countryName: "United Arab Emirates", city: "Abu Dhabi", citySlug: "abu-dhabi" },
  // South Africa
  { countryCode: "za", countryName: "South Africa", city: "Cape Town", citySlug: "cape-town" },
  { countryCode: "za", countryName: "South Africa", city: "Johannesburg", citySlug: "johannesburg" },
  // Belgium
  { countryCode: "be", countryName: "Belgium", city: "Brussels", citySlug: "brussels" },
  // Austria
  { countryCode: "at", countryName: "Austria", city: "Vienna", citySlug: "vienna" },
  // Italy
  { countryCode: "it", countryName: "Italy", city: "Milan", citySlug: "milan" },
  { countryCode: "it", countryName: "Italy", city: "Rome", citySlug: "rome" },
  // Czech Republic
  { countryCode: "cz", countryName: "Czech Republic", city: "Prague", citySlug: "prague" },
  // Romania
  { countryCode: "ro", countryName: "Romania", city: "Bucharest", citySlug: "bucharest" },
  // Ukraine
  { countryCode: "ua", countryName: "Ukraine", city: "Kyiv", citySlug: "kyiv" },
  // Russia
  { countryCode: "ru", countryName: "Russia", city: "Moscow", citySlug: "moscow" },
  // Turkey
  { countryCode: "tr", countryName: "Turkey", city: "Istanbul", citySlug: "istanbul" },
  // Egypt
  { countryCode: "eg", countryName: "Egypt", city: "Cairo", citySlug: "cairo" },
  // Nigeria
  { countryCode: "ng", countryName: "Nigeria", city: "Lagos", citySlug: "lagos" },
  // Kenya
  { countryCode: "ke", countryName: "Kenya", city: "Nairobi", citySlug: "nairobi" },
];
