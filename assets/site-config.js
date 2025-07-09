/* Site Configuration for Template System
 * This file defines the domain-specific settings that make the template work for different content types
 */

const siteConfig = {
    // Basic site information
    domain: 'emergency-services',
    version: '1.0.0',
    
    // Item terminology (change these for different domains)
    itemType: {
        singular: 'hospital',
        plural: 'hospitals',
        singular_zh: '醫院',
        plural_zh: '醫院'
    },
    
    // Feature toggles - turn on/off features based on domain needs
    features: {
        locationFinder: true,           // GPS/address search
        priceComparison: true,          // Price/fee comparison charts
        waitingTimes: true,             // Real-time waiting data
        emergencyBanner: true,          // Emergency warning banner
        specialistFiltering: true,      // Specialist/attribute filtering
        appDownloads: true,             // App download links
        timePricing: true,              // Time-based pricing
        faq: true,                      // FAQ section
        disclaimer: true                // Legal disclaimer
    },
    
    // API configurations
    api: {
        waitingTimes: {
            enabled: true,
            url: 'https://www.ha.org.hk/opendata/aed/aedwtdata-en.json',
            refreshInterval: 60000 // 1 minute
        },
        geocoding: 'builtin-hk' // or 'google', 'mapbox', etc.
    },
    
    // Data structure configuration
    dataStructure: {
        // Required fields for all items
        requiredFields: ['id', 'name_en', 'name_zh', 'sector', 'region', 'lat', 'lon'],
        
        // Optional fields that can be displayed
        optionalFields: ['phone', 'address_en', 'address_zh', 'details_en', 'details_zh', 
                        'specialists', 'app', 'timePricing', 'emergencyFee', 'fees'],
        
        // Filter categories
        filterCategories: {
            region: {
                field: 'region',
                options: ['HKI', 'KLN', 'NT'],
                labels: {
                    zh: { HKI: '港島', KLN: '九龍', NT: '新界及離島' },
                    en: { HKI: 'HK Island', KLN: 'Kowloon', NT: 'NT & Islands' }
                }
            },
            sector: {
                field: 'sector',
                options: ['public', 'private'],
                labels: {
                    zh: { public: '公立醫院', private: '私家醫院' },
                    en: { public: 'Public', private: 'Private' }
                }
            },
            privateTier: {
                field: 'privateTier',
                options: ['A', 'B'],
                showWhen: { sector: 'private' },
                labels: {
                    zh: { A: '持牌急症中心', B: '24小時門診' },
                    en: { A: 'Licensed A&E Centre', B: '24-Hour Outpatient' }
                }
            }
        },
        
        // Specialist/attribute configuration
        attributes: {
            field: 'specialists',
            options: ['emergency', 'cardiology', 'orthopedics', 'neurology', 
                     'pediatrics', 'gynecology', 'urology', 'gastroenterology', 'psychiatry'],
            labels: {
                zh: {
                    emergency: '急症科',
                    cardiology: '心臟科',
                    orthopedics: '骨科',
                    neurology: '腦神經科',
                    pediatrics: '兒科',
                    gynecology: '婦科',
                    urology: '泌尿科',
                    gastroenterology: '腸胃科',
                    psychiatry: '精神科'
                },
                en: {
                    emergency: 'Emergency',
                    cardiology: 'Cardiology',
                    orthopedics: 'Orthopedics',
                    neurology: 'Neurology',
                    pediatrics: 'Pediatrics',
                    gynecology: 'Gynecology',
                    urology: 'Urology',
                    gastroenterology: 'Gastroenterology',
                    psychiatry: 'Psychiatry'
                }
            }
        }
    },
    
    // Display configuration
    display: {
        // Card display settings
        cards: {
            showImage: false,
            showRating: false,
            showPrice: true,
            showWaitingTime: true,
            showAttributes: true,
            showApp: true
        },
        
        // Sorting options
        sorting: {
            default: 'waitingTime', // or 'distance', 'price', 'name'
            options: ['waitingTime', 'distance', 'price']
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
        primaryColor: '#5F9EA0',
        accentColor: '#434242',
        emergencyColor: '#EF4444',
        successColor: '#10B981',
        warningColor: '#F59E0B'
    },
    
    // Language configuration
    languages: {
        default: 'zh',
        available: ['zh', 'en'],
        // Language content is still in lang.js but can be domain-specific
    },
    
    // Emergency/urgent configuration (domain-specific)
    urgency: {
        enabled: true,
        phone: '999',
        showModal: true,
        modalKey: 'emergency999Acknowledged'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = siteConfig;
}