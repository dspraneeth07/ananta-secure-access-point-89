
const RAPIDAPI_KEY = '326e070dfcmsh6923b1e0a96a942p1c4e42jsnd2c4d585bbd8';

// Drug-related search terms for criminal intelligence
export const DRUG_SEARCH_TERMS = [
  // General Drug Terms
  'drugs', 'narcotics', 'dope', 'illegal drugs', 'contraband', 'substance abuse', 
  'overdose', 'drug cartel', 'trafficking', 'peddler', 'rehab', 'addiction',
  
  // Prescription Drugs
  'oxycodone', 'oxy', 'hydrocodone', 'xanax', 'alprazolam', 'valium', 'codeine', 
  'tramadol', 'fentanyl', 'ritalin', 'adderall',
  
  // Cannabis/Marijuana
  'weed', 'ganja', 'pot', 'grass', 'mary jane', 'cannabis', 'kush', 'thc', 'hash', 
  'hashish', 'bud', 'stoned', '420', 'joint', 'spliff',
  
  // Party/Synthetic Drugs
  'mdma', 'ecstasy', 'molly', 'lsd', 'acid', 'dmt', 'ketamine', 'ket', 'shrooms', 
  'mushrooms', 'psychedelics', 'blotter', 'trip', 'roll', 'tabs', 'hit',
  
  // Hard Drugs
  'cocaine', 'coke', 'crack', 'heroin', 'smack', 'brown sugar', 'meth', 'crystal', 
  'ice', 'speed', 'dope', 'crank', 'black tar',
  
  // Buying/Selling Slang
  'buy weed', 'buy mdma', 'where to get drugs', 'hookup', 'connect', 'score', 
  'plug', 'supplier', 'stuff', 'parcel', 'drop', 'street price', 'how much is',
  
  // Darknet
  'dark web', 'tor', 'onion link', 'buy drugs online', 'stealth shipping', 
  'bitcoin drugs', 'ship discreet', 'escrow', 'darknet market',
  
  // Code Words
  'skittles', 'candy', 'sauce', 'snow', 'gas', 'bars', 'blow', 'lean', 
  'purple drank', 'chill pills', 'beans', 'zaza'
];

export interface RealSearchResults {
  facebook: {
    posts: any[];
    videos: any[];
    pages: any[];
    events: any[];
    count: number;
  };
  instagram: {
    posts: any[];
    users: any[];
    count: number;
  };
  webSearch: {
    results: any[];
    count: number;
  };
  googleSearch: {
    results: any[];
    count: number;
  };
}

export const searchFacebookPosts = async (query: string) => {
  try {
    const response = await fetch(`https://facebook-scraper3.p.rapidapi.com/search/posts?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`Facebook API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Facebook posts search error:', error);
    return { data: [] };
  }
};

export const searchFacebookVideos = async (query: string) => {
  try {
    const response = await fetch(`https://facebook-scraper3.p.rapidapi.com/search/videos?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Facebook videos search error:', error);
    return { data: [] };
  }
};

export const searchFacebookPages = async (query: string) => {
  try {
    const response = await fetch(`https://facebook-scraper3.p.rapidapi.com/search/pages?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Facebook pages search error:', error);
    return { data: [] };
  }
};

export const searchFacebookEvents = async (query: string) => {
  try {
    const response = await fetch(`https://facebook-scraper3.p.rapidapi.com/search/events?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Facebook events search error:', error);
    return { data: [] };
  }
};

export const searchInstagram = async (query: string) => {
  try {
    const response = await fetch('https://instagram-scraper-stable-api.p.rapidapi.com/search_ig.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-rapidapi-host': 'instagram-scraper-stable-api.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      },
      body: `search_query=${encodeURIComponent(query)}`
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Instagram search error:', error);
    return { data: [] };
  }
};

export const searchWeb = async (query: string) => {
  try {
    const response = await fetch(`https://real-time-web-search.p.rapidapi.com/search-advanced-v2?q=${encodeURIComponent(query)}&fetch_ai_overviews=false&num=10&start=0&gl=us&hl=en&device=desktop&nfpr=0&return_organic_result_video_thumbnail=false&extra_speed=false`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'real-time-web-search.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Web search error:', error);
    return { organic: [] };
  }
};

export const searchGoogle = async (query: string) => {
  try {
    const response = await fetch(`https://google-search-master-mega.p.rapidapi.com/search?q=${encodeURIComponent(query)}&gl=us&hl=en&autocorrect=true&num=10&page=1`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'google-search-master-mega.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Google search error:', error);
    return { results: [] };
  }
};

export const performComprehensiveSearch = async (keywords: string[]): Promise<RealSearchResults> => {
  const searchPromises = keywords.map(async (keyword) => {
    const [facebookPosts, facebookVideos, facebookPages, facebookEvents, instagram, webSearch, googleSearch] = await Promise.allSettled([
      searchFacebookPosts(keyword),
      searchFacebookVideos(keyword),
      searchFacebookPages(keyword),
      searchFacebookEvents(keyword),
      searchInstagram(keyword),
      searchWeb(keyword),
      searchGoogle(keyword)
    ]);

    return {
      keyword,
      facebook: {
        posts: facebookPosts.status === 'fulfilled' ? facebookPosts.value.data || [] : [],
        videos: facebookVideos.status === 'fulfilled' ? facebookVideos.value.data || [] : [],
        pages: facebookPages.status === 'fulfilled' ? facebookPages.value.data || [] : [],
        events: facebookEvents.status === 'fulfilled' ? facebookEvents.value.data || [] : []
      },
      instagram: instagram.status === 'fulfilled' ? instagram.value.data || [] : [],
      webSearch: webSearch.status === 'fulfilled' ? webSearch.value.organic || [] : [],
      googleSearch: googleSearch.status === 'fulfilled' ? googleSearch.value.results || [] : []
    };
  });

  const results = await Promise.all(searchPromises);
  
  // Aggregate all results
  const aggregated: RealSearchResults = {
    facebook: {
      posts: [],
      videos: [],
      pages: [],
      events: [],
      count: 0
    },
    instagram: {
      posts: [],
      users: [],
      count: 0
    },
    webSearch: {
      results: [],
      count: 0
    },
    googleSearch: {
      results: [],
      count: 0
    }
  };

  results.forEach(result => {
    aggregated.facebook.posts.push(...result.facebook.posts);
    aggregated.facebook.videos.push(...result.facebook.videos);
    aggregated.facebook.pages.push(...result.facebook.pages);
    aggregated.facebook.events.push(...result.facebook.events);
    aggregated.instagram.posts.push(...result.instagram);
    aggregated.webSearch.results.push(...result.webSearch);
    aggregated.googleSearch.results.push(...result.googleSearch);
  });

  aggregated.facebook.count = aggregated.facebook.posts.length + aggregated.facebook.videos.length + 
                              aggregated.facebook.pages.length + aggregated.facebook.events.length;
  aggregated.instagram.count = aggregated.instagram.posts.length;
  aggregated.webSearch.count = aggregated.webSearch.results.length;
  aggregated.googleSearch.count = aggregated.googleSearch.results.length;

  return aggregated;
};
