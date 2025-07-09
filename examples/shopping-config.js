/* Example: Shopping Mall & Retail Guide Configuration
 * This shows how the template works for a shopping directory
 */

const siteConfig = {
    // Basic site information
    domain: 'shopping',
    version: '1.0.0',
    
    // Item terminology (changed for shopping)
    itemType: {
        singular: 'store',
        plural: 'stores',
        singular_zh: '商店',
        plural_zh: '商店'
    },
    
    // Feature toggles - shopping-specific features
    features: {
        locationFinder: true,           // Find nearby stores
        priceComparison: true,          // Compare price levels
        waitingTimes: false,            
        emergencyBanner: false,         
        specialistFiltering: true,      // Filter by store category
        appDownloads: true,             // Shopping apps
        timePricing: false,             
        salesAlerts: true,              // Sales & promotions (new)
        membershipPrograms: true,       // Loyalty programs (new)
        faq: true,                      
        disclaimer: true                
    },
    
    // Data structure configuration
    dataStructure: {
        // Required fields for stores
        requiredFields: ['id', 'name_en', 'name_zh', 'category', 'mall', 'floor', 'lat', 'lon'],
        
        // Optional fields
        optionalFields: ['phone', 'unit', 'website', 'priceLevel', 'brands', 
                        'openingHours', 'paymentMethods', 'currentSales', 'membershipApp'],
        
        // Filter categories for shopping
        filterCategories: {
            mall: {
                field: 'mall',
                options: ['ifc', 'times-square', 'harbour-city', 'festival-walk', 'apm'],
                labels: {
                    zh: { 
                        'ifc': '國際金融中心商場', 
                        'times-square': '時代廣場', 
                        'harbour-city': '海港城',
                        'festival-walk': '又一城',
                        'apm': 'apm'
                    },
                    en: { 
                        'ifc': 'IFC Mall', 
                        'times-square': 'Times Square', 
                        'harbour-city': 'Harbour City',
                        'festival-walk': 'Festival Walk',
                        'apm': 'apm'
                    }
                }
            },
            category: {
                field: 'category',
                options: ['fashion', 'electronics', 'cosmetics', 'sports', 'home', 'food'],
                labels: {
                    zh: { 
                        fashion: '時裝', 
                        electronics: '電子產品', 
                        cosmetics: '化妝品',
                        sports: '運動用品',
                        home: '家居用品',
                        food: '食品'
                    },
                    en: { 
                        fashion: 'Fashion', 
                        electronics: 'Electronics', 
                        cosmetics: 'Cosmetics',
                        sports: 'Sports',
                        home: 'Home',
                        food: 'Food & Beverage'
                    }
                }
            },
            priceLevel: {
                field: 'priceLevel',
                options: ['budget', 'mid-range', 'premium', 'luxury'],
                labels: {
                    zh: { 
                        'budget': '經濟', 
                        'mid-range': '中檔', 
                        'premium': '高級', 
                        'luxury': '奢侈'
                    },
                    en: { 
                        'budget': 'Budget', 
                        'mid-range': 'Mid-Range', 
                        'premium': 'Premium', 
                        'luxury': 'Luxury'
                    }
                }
            }
        },
        
        // Store features/services
        attributes: {
            field: 'services',
            options: ['tax-free', 'personal-shopping', 'gift-wrapping', 'alterations', 
                     'online-order', 'curbside-pickup', 'same-day-delivery', 'vip-lounge'],
            labels: {
                zh: {
                    'tax-free': '免稅',
                    'personal-shopping': '個人導購',
                    'gift-wrapping': '禮品包裝',
                    'alterations': '修改服務',
                    'online-order': '網上訂購',
                    'curbside-pickup': '路邊取貨',
                    'same-day-delivery': '即日送貨',
                    'vip-lounge': 'VIP休息室'
                },
                en: {
                    'tax-free': 'Tax Free',
                    'personal-shopping': 'Personal Shopping',
                    'gift-wrapping': 'Gift Wrapping',
                    'alterations': 'Alterations',
                    'online-order': 'Online Order',
                    'curbside-pickup': 'Curbside Pickup',
                    'same-day-delivery': 'Same Day Delivery',
                    'vip-lounge': 'VIP Lounge'
                }
            }
        }
    },
    
    // Display configuration
    display: {
        cards: {
            showImage: true,         // Store logos/photos
            showRating: false,       // No ratings for stores
            showPrice: true,         // Price level indicators
            showSales: true,         // Current promotions
            showFloor: true,         // Mall floor location
            showBrands: true         // Featured brands
        },
        
        sorting: {
            default: 'name',
            options: ['name', 'category', 'priceLevel', 'floor']
        }
    },
    
    // Branding and styling
    branding: {
        primaryColor: '#EC4899',  // Pink for shopping
        accentColor: '#8B5CF6',   // Purple accent
        emergencyColor: '#EF4444',
        successColor: '#10B981',
        warningColor: '#F59E0B'
    }
};

// Example store data:
const exampleStore = {
    id: 'zara-ifc',
    name_en: 'ZARA',
    name_zh: 'ZARA',
    category: 'fashion',
    mall: 'ifc',
    floor: '1-2',
    unit: '1001-1050',
    lat: 22.2855,
    lon: 114.1577,
    phone: '22341234',
    website: 'https://www.zara.com/hk',
    priceLevel: 'mid-range',
    brands: ['ZARA', 'ZARA Home', 'ZARA Kids'],
    openingHours: {
        'mon-fri': '10:00-22:00',
        'sat-sun': '10:00-23:00'
    },
    paymentMethods: ['cash', 'visa', 'mastercard', 'octopus', 'wechat', 'alipay'],
    currentSales: {
        title: 'End of Season Sale',
        discount: 'Up to 50% off',
        endDate: '2024-02-28'
    },
    services: ['online-order', 'alterations', 'gift-wrapping'],
    membershipApp: {
        name: 'ZARA App',
        ios: 'https://apps.apple.com/app/zara',
        android: 'https://play.google.com/store/apps/details?id=com.zara'
    }
};