/**
 * https://www.digitalocean.com/community/tools/minify
 * https://javascript.info/indexeddb
 **/

let config = {
  appRoot:   './',
  searchURL: 'https://wdob.dev.adsd.census.gov/qf_test/search/json/?type=geo&search=',
  searchEmpty: {
    label: 'No matches',
    level: 'empty'
  },
  Fuse: {
    URL: './query/search.json',
    options: {
      includeScore: true,
      isCaseSensitive: false,
      useExtendedSearch: true,
      minMatchCharLength: 2,
      keys: ['label']
    },
    indexOptions: {
      keys: ['label']
    },
    usIndexOptions: {
      keys: ['search']
    }
  },
  dataset: {
    en: {
      descMeta: 'population demographics and economic statistics',
      creaMeta: 'United States Census Bureau',
      liseMeta: 'https://creativecommons.org/publicdomain/zero/1.0/',
    }
  },
  quickInfo: {
    URL:   './assets/quickinfo/$1.htm',
    en: {
      title: 'Quick Info: Sources, Definitions, Methodology'
    }
  },
  quickLink: {
    URL:   './assets/quicklink/$1/$2.htm',
    en: {
      header: '$1 Quicklinks',
      title:  'Browse Quicklinks for $1: Related Surveys, Characteristics, Estimates, Datasets'
    }
  },
  factSelect: {
    en: {
      openSelect: '-- Filter to a Fact, Topic. or Group --'
    }
  },
  icons: {
    sourcenote: {
      clear: String.fromCodePoint(0xE83F), // &#xE83F;
      solid: String.fromCodePoint(0xE840)  // &#xe840;
    }
  },
  schema: {
    '@context': 'https://schema.org',
    '@type': 'Website',
    'keywords': 'US Census Bureau, Census Bureau QuickFacts',
    'text': 'Census Bureau Data',
    'description': 'Explore the thousands of tables we have. Build customized maps from any variable in our data tables. Learn about America\'s communities through our data profiles. They cover 100,000+ different geographies: states , counties , places , tribal areas , zip codes , and congressional districts. For each, we cover topics like education, employment, health, and housing just to name a few. Get record-level access to our Public Use Microdata Sample (PUMS) files. Check out our help resources, FAQs, quick start guides, and release information.',
    'countryOfOrigin': 'United States Of America',
    'creator': {
      '@type': 'GovernmentOrganization',
      'name': 'United States Census Bureau',
      'email': 'census.data@census.gov',
      'address': '4600 Silver Hill Road Washington, DC 20233',
      'department': {
        '@type': 'Organization',
        'name': 'Center for New Media Promotion',
        'alternateName': 'CNMP'
      },
      'logo': 'https://www.census.gov/etc.clientlibs/census/clientlibs/census-pattern-library/resources/images/USCENSUS_IDENTITY_SOLO_BLACK_1.5in_R_no_padding.svg',
      'telephone': '301-763-4636',
      'slogan': 'Measuring America\'s People, Places, and Economy',
      'description': 'The Census Bureau\'s mission is to serve as the nation\'s leading provider of quality data about its people and economy.'
    }
  }
}

export { config };