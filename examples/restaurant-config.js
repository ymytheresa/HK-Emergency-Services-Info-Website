/* Example: Restaurant Guide Configuration
 * This shows how the same template can be used for a restaurant directory
 */

const siteConfig = {
    // Basic site information
    domain: 'restaurants',
    version: '1.0.0',
    
    // Item terminology (changed for restaurants)
    itemType: {
        singular: 'restaurant',
        plural: 'restaurants',
        singular_zh: '餐廳',
        plural_zh: '餐廳'
    },
    
    // Feature toggles - different features for restaurants
    features: {
        locationFinder: true,           // Find nearby restaurants
        priceComparison: true,          // Compare price ranges
        waitingTimes: false,            // Not applicable for restaurants
        emergencyBanner: false,         // No emergency warnings needed
        specialistFiltering: true,      // Filter by cuisine type
        appDownloads: true,             // Reservation apps
        timePricing: false,             // Regular pricing
        ratings: true,                  // Restaurant ratings (new feature)
        openingHours: true,             // Operating hours (new feature)
        faq: true,                      
        disclaimer: true                
    },
    
    // API configurations
    api: {
        waitingTimes: {
            enabled: false
        },
        ratings: {
            enabled: true,
            source: 'openrice' // or 'google', 'yelp'
        },
        geocoding: 'builtin-hk'
    },
    
    // Data structure configuration
    dataStructure: {
        // Required fields for restaurants
        requiredFields: ['id', 'name_en', 'name_zh', 'cuisine', 'district', 'lat', 'lon'],
        
        // Optional fields
        optionalFields: ['phone', 'address_en', 'address_zh', 'website', 'priceRange', 
                        'rating', 'openingHours', 'features', 'reservationApp'],
        
        // Filter categories for restaurants
        filterCategories: {
            district: {
                field: 'district',
                options: ['central', 'wanchai', 'causeway-bay', 'tsim-sha-tsui', 'mongkok'],
                labels: {
                    zh: { 
                        'central': '中環', 
                        'wanchai': '灣仔', 
                        'causeway-bay': '銅鑼灣',
                        'tsim-sha-tsui': '尖沙咀',
                        'mongkok': '旺角'
                    },
                    en: { 
                        'central': 'Central', 
                        'wanchai': 'Wan Chai', 
                        'causeway-bay': 'Causeway Bay',
                        'tsim-sha-tsui': 'Tsim Sha Tsui',
                        'mongkok': 'Mong Kok'
                    }
                }
            },
            cuisine: {
                field: 'cuisine',
                options: ['chinese', 'western', 'japanese', 'korean', 'thai', 'italian'],
                labels: {
                    zh: { 
                        chinese: '中菜', 
                        western: '西餐', 
                        japanese: '日本菜',
                        korean: '韓國菜',
                        thai: '泰國菜',
                        italian: '意大利菜'
                    },
                    en: { 
                        chinese: 'Chinese', 
                        western: 'Western', 
                        japanese: 'Japanese',
                        korean: 'Korean',
                        thai: 'Thai',
                        italian: 'Italian'
                    }
                }
            },
            priceRange: {
                field: 'priceRange',
                options: ['$', '$$', '$$$', '$$$$'],
                labels: {
                    zh: { '$': '經濟', '$$': '中等', '$$$': '高級', '$$$$': '奢華' },
                    en: { '$': 'Budget', '$$': 'Moderate', '$$$': 'Upscale', '$$$$': 'Luxury' }
                }
            }
        },
        
        // Restaurant features instead of specialists
        attributes: {
            field: 'features',
            options: ['vegetarian', 'vegan', 'halal', 'michelin', 'delivery', 
                     'outdoor-seating', 'private-room', 'bar', 'live-music'],
            labels: {
                zh: {
                    vegetarian: '素食',
                    vegan: '純素',
                    halal: '清真',
                    michelin: '米芝蓮',
                    delivery: '外送',
                    'outdoor-seating': '戶外座位',
                    'private-room': '包廂',
                    bar: '酒吧',
                    'live-music': '現場音樂'
                },
                en: {
                    vegetarian: 'Vegetarian',
                    vegan: 'Vegan',
                    halal: 'Halal',
                    michelin: 'Michelin',
                    delivery: 'Delivery',
                    'outdoor-seating': 'Outdoor Seating',
                    'private-room': 'Private Room',
                    bar: 'Bar',
                    'live-music': 'Live Music'
                }
            }
        }
    },
    
    // Display configuration
    display: {
        // Card display settings
        cards: {
            showImage: true,        // Show restaurant photos
            showRating: true,       // Show ratings
            showPrice: true,        // Show price range
            showWaitingTime: false, // No waiting times
            showAttributes: true,   // Show features
            showApp: true,          // Reservation apps
            showOpeningHours: true  // Show if open now
        },
        
        // Sorting options
        sorting: {
            default: 'rating', // Sort by rating by default
            options: ['rating', 'distance', 'priceRange', 'name']
        },
        
        // Grid layout
        layout: {
            mobile: 1,
            tablet: 2,
            desktop: 3
        }
    },
    
    // Branding and styling
    branding: {
        primaryColor: '#F97316',  // Orange for food
        accentColor: '#7C3AED',   // Purple accent
        emergencyColor: '#EF4444',
        successColor: '#10B981',
        warningColor: '#F59E0B'
    },
    
    // Language configuration
    languages: {
        default: 'zh',
        available: ['zh', 'en']
    },
    
    // No emergency configuration for restaurants
    urgency: {
        enabled: false
    }
};

// Example data structure for a restaurant:
const exampleRestaurant = {
    id: 'dimsum-palace',
    name_en: 'Dim Sum Palace',
    name_zh: '點心皇宮',
    cuisine: 'chinese',
    district: 'central',
    lat: 22.2783,
    lon: 114.1747,
    phone: '28881234',
    address_en: '123 Des Voeux Road Central, Hong Kong',
    address_zh: '香港中環德輔道中123號',
    website: 'https://dimsumpalace.com.hk',
    priceRange: '$$',
    rating: 4.5,
    openingHours: {
        mon: '07:00-22:00',
        tue: '07:00-22:00',
        wed: '07:00-22:00',
        thu: '07:00-22:00',
        fri: '07:00-23:00',
        sat: '07:00-23:00',
        sun: '07:00-22:00'
    },
    features: ['vegetarian', 'michelin', 'private-room'],
    reservationApp: {
        name: 'OpenTable',
        ios: 'https://apps.apple.com/app/opentable',
        android: 'https://play.google.com/store/apps/details?id=com.opentable'
    }
};