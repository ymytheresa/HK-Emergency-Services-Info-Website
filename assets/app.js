/* Main application logic - Template System Version */

// Load site configuration
const config = typeof siteConfig !== 'undefined' ? siteConfig : {
    // Fallback config for backwards compatibility
    features: {
        waitingTimes: true,
        emergencyBanner: true,
        timePricing: true
    },
    itemType: {
        singular: 'hospital',
        plural: 'hospitals'
    }
};

let currentLanguage = 'zh';
let appState = { region: 'all', sector: 'all', privateTier: 'all', specialist: 'all' };
const hospitalList = document.getElementById('hospital-list');
let costChart;

// Waiting time cache and management
let waitingTimeCache = {
    data: null,
    lastUpdated: null,
    isLoading: false
};

// Item name mapping for API matching (only used if waiting times feature is enabled)
const hospitalNameMapping = config.features.waitingTimes ? {
    'Alice Ho Miu Ling Nethersole Hospital': 'ahnh',
    'Caritas Medical Centre': 'cmc', 
    'Kwong Wah Hospital': 'kwh',
    'North District Hospital': 'ndh',
    'North Lantau Hospital': 'nlth',
    'Pamela Youde Nethersole Eastern Hospital': 'pyneh',
    'Pok Oi Hospital': 'poh',
    'Princess Margaret Hospital': 'pmh',
    'Prince of Wales Hospital': 'pwh',
    'Queen Elizabeth Hospital': 'qeh',
    'Queen Mary Hospital': 'qmh',
    'Ruttonjee Hospital': 'rhtsk',
    'St. John Hospital': 'sjh',
    'Tin Shui Wai Hospital': 'tswh',
    'Tseung Kwan O Hospital': 'tkoh',
    'Tuen Mun Hospital': 'tmh',
    'United Christian Hospital': 'uch',
    'Yan Chai Hospital': 'ych'
} : {};

// Waiting time functions (only available if feature is enabled)
async function fetchWaitingTimes() {
    if (!config.features.waitingTimes) {
        return {};
    }
    if (waitingTimeCache.isLoading) return waitingTimeCache.data;
    
    // Check if cache is still valid (less than 1 minute old)
    const now = Date.now();
    if (waitingTimeCache.data && waitingTimeCache.lastUpdated && 
        (now - waitingTimeCache.lastUpdated) < 60000) {
        return waitingTimeCache.data;
    }
    
    waitingTimeCache.isLoading = true;
    
    try {
        const response = await fetch('https://www.ha.org.hk/opendata/aed/aedwtdata-en.json');
        const data = await response.json();
        
        // Transform API data to hospital ID mapping
        const waitingTimes = {};
        data.waitTime.forEach(hospital => {
            const hospitalId = hospitalNameMapping[hospital.hospName];
            if (hospitalId) {
                waitingTimes[hospitalId] = {
                    waitTime: hospital.topWait,
                    updateTime: data.updateTime
                };
            }
        });
        
        // Check if data has actually changed
        const dataChanged = JSON.stringify(waitingTimeCache.data) !== JSON.stringify(waitingTimes);
        
        waitingTimeCache.data = waitingTimes;
        waitingTimeCache.lastUpdated = now;
        waitingTimeCache.isLoading = false;
        
        console.log('Updated waiting times:', waitingTimes);
        
        // If data changed and we're on the hospital browser view, refresh the display
        if (dataChanged && document.getElementById('hospital-list').children.length > 0) {
            console.log('Waiting time data changed, refreshing hospital list...');
            renderHospitalCards();
        }
        
        return waitingTimes;
        
    } catch (error) {
        console.error('Failed to fetch waiting times:', error);
        waitingTimeCache.isLoading = false;
        return waitingTimeCache.data || {};
    }
}

function getWaitingTimeColor(waitTime) {
    if (!waitTime || !config.features.waitingTimes) return '#3B82F6'; // Blue for no data
    
    switch(waitTime) {
        case 'Around 1 hour':
            return '#10B981'; // Green
        case 'Over 1 hour':
            return '#F59E0B'; // Yellow/Orange
        case 'Over 2 hours':
        case 'Over 3 hours':
        case 'Over 4 hours':
        default:
            return '#EF4444'; // Red for long waits
    }
}

function getWaitingTimeLevel(waitTime) {
    if (!waitTime) return 4; // No data should come last
    
    switch(waitTime) {
        case 'Around 1 hour': return 1;
        case 'Over 1 hour': return 2; 
        case 'Over 2 hours': return 3;
        default: return 4;
    }
}

function formatWaitingTime(waitTime, lang) {
    if (!waitTime) {
        return lang === 'zh' ? '數據不可用' : 'No data';
    }
    
    const translations = {
        'Around 1 hour': lang === 'zh' ? '約1小時' : 'Around 1 hour',
        'Over 1 hour': lang === 'zh' ? '超過1小時' : 'Over 1 hour', 
        'Over 2 hours': lang === 'zh' ? '超過2小時' : 'Over 2 hours'
    };
    
    return translations[waitTime] || waitTime;
}

// Specialist helper functions
function getSpecialtyName(specialty) {
    const t = langContent[currentLanguage];
    const specialtyMap = {
        emergency: t.specialistEmergency,
        cardiology: t.specialistCardiology,
        orthopedics: t.specialistOrthopedics,
        neurology: t.specialistNeurology,
        pediatrics: t.specialistPediatrics,
        gynecology: t.specialistGynecology,
        urology: t.specialistUrology,
        gastroenterology: t.specialistGastroenterology,
        psychiatry: t.specialistPsychiatry
    };
    return specialtyMap[specialty] || specialty;
}

function getAvailabilityText(availability) {
    const t = langContent[currentLanguage];
    const availabilityMap = {
        '24/7': t.specialist24h,
        'on-call': t.specialistOnCall,
        'referral': t.specialistReferral,
        'gp': t.specialistGP
    };
    return availabilityMap[availability] || availability;
}

function getAvailabilityColor(availability) {
    const colorMap = {
        '24/7': 'bg-green-100 text-green-800',      // Excellent - always available
        'on-call': 'bg-orange-100 text-orange-800', // Good - available when needed  
        'referral': 'bg-gray-100 text-gray-800',    // Basic - referral required
        'gp': 'bg-blue-100 text-blue-800'          // General practitioner level
    };
    return colorMap[availability] || 'bg-gray-100 text-gray-800';
}

function toggleSpecialists(cardId) {
    const content = document.getElementById(cardId);
    const button = content.previousElementSibling;
    const toggleText = button.querySelector('.specialist-toggle-text');
    const arrow = button.querySelector('.specialist-arrow');
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        toggleText.textContent = currentLanguage === 'zh' ? '收起' : 'Hide';
        arrow.textContent = '▲';
    } else {
        content.classList.add('hidden');
        toggleText.textContent = currentLanguage === 'zh' ? '查看專科' : 'View Specialists';
        arrow.textContent = '▼';
    }
}

function toggleApp(appId) {
    const content = document.getElementById(appId);
    const button = content.previousElementSibling;
    const toggleText = button.querySelector('.app-toggle-text');
    const arrow = button.querySelector('.app-arrow');
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        toggleText.textContent = currentLanguage === 'zh' ? '📱 收起應用程式' : '📱 Hide App';
        arrow.textContent = '▲';
    } else {
        content.classList.add('hidden');
        toggleText.textContent = currentLanguage === 'zh' ? '📱 排隊應用程式' : '📱 Queue App';
        arrow.textContent = '▼';
    }
}

// Time-based pricing functions
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

async function setCurrentTime() {
    document.getElementById('time-input').value = getCurrentTime();
    updateChart('consultation');
    await renderHospitalCards(); // Update hospital cards with new time-based pricing
}

function getTimePeriod(timeString) {
    const [hours] = timeString.split(':').map(Number);
    if (hours >= 8 && hours < 18) return 'day';      // 08:00-17:59
    if (hours >= 18 && hours < 22) return 'evening'; // 18:00-21:59
    return 'night';                                   // 22:00-07:59
}

function getPriceForTime(hospital, costType, timeString) {
    if (!hospital.timePricing) {
        // Fallback to emergency fee or basic fees
        if (costType === 'consultation') {
            return hospital.emergencyFee || (hospital.fees?.consultation?.[0]) || 0;
        }
        return hospital.fees?.[costType]?.[0] || 0;
    }
    
    const period = getTimePeriod(timeString);
    const pricing = hospital.timePricing[period];
    
    if (costType === 'consultation') return pricing.emergency;
    return pricing[costType] || 0;
}

async function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang === 'zh' ? 'zh-HK' : 'en';

    document.getElementById('lang-zh').classList.toggle('active-lang', lang === 'zh');
    document.getElementById('lang-zh').classList.toggle('inactive-lang', lang !== 'zh');
    document.getElementById('lang-en').classList.toggle('active-lang', lang === 'en');
    document.getElementById('lang-en').classList.toggle('inactive-lang', lang !== 'en');

    const t = langContent[lang];
    console.log('Language content loaded:', !!t, t?.mainTitle);

    document.getElementById('main-title').textContent = t.mainTitle;
    document.getElementById('sub-title').textContent = t.subTitle;
    // Removed finder-title element
    document.getElementById('finder-desc').textContent = t.finderDesc;
    document.getElementById('browser-title').textContent = t.browserTitle;
    document.getElementById('browser-desc').textContent = t.browserDesc;
    document.getElementById('geo-title').textContent = t.geoTitle;
    
    document.getElementById('waiting-legend-title').textContent = t.waitingLegendTitle;
    document.getElementById('legend-fast').textContent = t.legendFast;
    document.getElementById('legend-medium').textContent = t.legendMedium;
    document.getElementById('legend-slow').textContent = t.legendSlow;
    document.getElementById('legend-private').textContent = t.legendPrivate;
    document.getElementById('legend-update-info').textContent = t.legendUpdateInfo;
    document.getElementById('sorted-by-waiting-time').textContent = t.sortedByWaitingTime;
    
    // Location finder new UI elements - with error handling
    const safeSetText = (id, text) => {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    };
    
    const safeSetPlaceholder = (id, text) => {
        const element = document.getElementById(id);
        if (element) element.placeholder = text;
    };
    
    safeSetText('gps-btn-text', t.gpsButtonText);
    safeSetText('address-btn-text', t.addressButtonText);
    safeSetText('use-location-text', t.useLocationText);
    safeSetPlaceholder('address-input', t.addressPlaceholder);
    safeSetText('search-btn-text', t.searchButtonText);
    safeSetText('address-helper-text', t.addressHelperText);
    safeSetText('public-options-label', t.publicOptionsLabel);
    safeSetText('private-options-label', t.privateOptionsLabel);
    safeSetText('closest-distance-text', t.closestDistanceText);
    safeSetText('shortest-wait-text', t.shortestWaitText);
    safeSetText('nearest-private-text', t.nearestPrivateText);
    safeSetText('geo-choose-prompt', t.geoChoosePrompt);
    
    document.getElementById('filter-region-label').textContent = t.filterRegionLabel;
    document.getElementById('filter-region-all').textContent = t.filterRegionAll;
    document.getElementById('filter-region-hki').textContent = t.filterRegionHki;
    document.getElementById('filter-region-kln').textContent = t.filterRegionKln;
    document.getElementById('filter-region-nt').textContent = t.filterRegionNt;
    
    document.getElementById('filter-sector-label').textContent = t.filterSectorLabel;
    document.getElementById('filter-sector-all').textContent = t.filterSectorAll;
    document.getElementById('filter-sector-public').textContent = t.filterSectorPublic;
    document.getElementById('filter-sector-private').textContent = t.filterSectorPrivate;

    document.getElementById('filter-tier-label').textContent = t.filterTierLabel;
    document.getElementById('filter-tier-all').textContent = t.filterTierAll;
    document.getElementById('filter-tier-a').textContent = t.filterTierA;
    document.getElementById('filter-tier-b').textContent = t.filterTierB;

    document.getElementById('filter-specialist-label').textContent = t.filterSpecialistLabel;
    document.getElementById('filter-specialist-all').textContent = t.filterSpecialistAll;
    document.getElementById('filter-cardiology-text').textContent = t.filterCardiologyText;
    document.getElementById('filter-orthopedics-text').textContent = t.filterOrthopedicsText;
    document.getElementById('filter-neurology-text').textContent = t.filterNeurologyText;
    document.getElementById('filter-pediatrics-text').textContent = t.filterPediatricsText;
    document.getElementById('filter-gynecology-text').textContent = t.filterGynecologyText;
    document.getElementById('filter-urology-text').textContent = t.filterUrologyText;
    document.getElementById('filter-gastroenterology-text').textContent = t.filterGastroenterologyText;
    document.getElementById('filter-psychiatry-text').textContent = t.filterPsychiatryText;

    document.getElementById('cost-title').textContent = t.costTitle;
    document.getElementById('cost-desc').textContent = t.costDesc;
    document.getElementById('insurance-reminder').textContent = t.insuranceReminder;
    document.getElementById('time-section-title').textContent = t.timeSectionTitle;
    document.getElementById('time-label').textContent = t.timeLabel;
    document.getElementById('current-time-btn-text').textContent = t.currentTimeBtnText;
    document.getElementById('time-helper-text').textContent = t.timeHelperText;
    document.getElementById('cost-compare-label').textContent = t.costCompareLabel;
    document.getElementById('cost-btn-consult').textContent = t.costBtnConsult;
    document.getElementById('cost-btn-standard').textContent = t.costBtnStandard;
    document.getElementById('cost-btn-semi').textContent = t.costBtnSemi;
    document.getElementById('cost-btn-private').textContent = t.costBtnPrivate;
    
    document.getElementById('faq-title').textContent = t.faqTitle;
    document.getElementById('faq0-q').textContent = t.faq0_q;
    document.getElementById('faq0-a').innerHTML = t.faq0_a;
    document.getElementById('faq1-q').textContent = t.faq1_q;
    document.getElementById('faq1-a').innerHTML = t.faq1_a;
    document.getElementById('faq2-q').textContent = t.faq2_q;
    document.getElementById('faq2-a').innerHTML = t.faq2_a;
    document.getElementById('faq3-q').textContent = t.faq3_q;
    document.getElementById('faq3-a').innerHTML = t.faq3_a;

    document.getElementById('footer-text').textContent = t.footerText;
    document.getElementById('feedback-text').innerHTML = t.feedbackText;
    
    // Disclaimer section
    document.getElementById('disclaimer-title').textContent = t.disclaimerTitle;
    document.getElementById('disclaimer-content').innerHTML = t.disclaimerShort;
    document.getElementById('disclaimer-toggle').textContent = t.disclaimerToggleShow;
    
    document.getElementById('nearest-hospital-result').innerHTML = '';
    document.getElementById('geo-error').textContent = '';

    // Initialize time input with current time if empty
    const timeInput = document.getElementById('time-input');
    if (!timeInput.value) {
        timeInput.value = getCurrentTime();
    }

    await renderHospitalCards();
    updateChart(costChart.data.costType || 'consultation');
    
    // Update emergency 999 elements if they exist
    if (document.getElementById('emergency-999-banner-text')) {
        updateEmergency999Language();
    }
    
    // Update price chart toggle if it exists
    if (document.getElementById('cost-toggle-text')) {
        initializePriceChartToggle();
    }
}

async function getServiceType(hospital) {
    const t = langContent[currentLanguage];
    let serviceTag = '';
    let waitingTag = '';
    
    if (hospital.sector === 'public') {
        serviceTag = `<span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">${t.serviceTypePublic}</span>`;
        
        // Add waiting time indicator for public hospitals
        try {
            const waitingTimes = await fetchWaitingTimes();
            const waitTime = waitingTimes[hospital.id]?.waitTime;
            if (waitTime) {
                const color = getWaitingTimeColor(waitTime);
                const formattedTime = formatWaitingTime(waitTime, currentLanguage);
                const prefix = currentLanguage === 'zh' ? '排隊: ' : 'Wait: ';
                waitingTag = `<span class="text-xs font-medium px-2.5 py-0.5 rounded-full mr-2" style="background-color: ${color}20; color: ${color};">${prefix}${formattedTime}</span>`;
            }
        } catch (error) {
            console.log('Waiting time fetch failed for service type:', error);
            // Continue without waiting time indicator
        }
    }
    if (hospital.sector === 'private') {
        if (hospital.is24Hour) {
            if (hospital.privateTier === 'A') {
                serviceTag = `<span class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">${t.serviceTypePrivateA}</span>`;
            } else {
                serviceTag = `<span class="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">${t.serviceTypePrivateB}</span>`;
            }
        } else {
            serviceTag = `<span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">${t.serviceTypePrivateOther}</span>`;
        }
    }
    
    return serviceTag + waitingTag;
}

async function createHospitalCard(h, distance = null) {
    const card = document.createElement('div');
    const t = langContent[currentLanguage];
    
    // Get waiting time data first to determine card color
    const waitingTimes = await fetchWaitingTimes();
    const waitTime = waitingTimes[h.id]?.waitTime;
    const waitingColor = getWaitingTimeColor(waitTime);
    
    // Set card background based on waiting time
    let cardBgColor = '';
    let textColorClass = '';
    
    if (waitTime) {
        // Apply colored background based on waiting time
        switch(waitTime) {
            case 'Around 1 hour':
                cardBgColor = 'bg-green-50 border-green-300 hover:bg-green-100';
                break;
            case 'Over 1 hour':
                cardBgColor = 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100';
                break;
            case 'Over 2 hours':
            case 'Over 3 hours':
            case 'Over 4 hours':
                cardBgColor = 'bg-red-50 border-red-300 hover:bg-red-100';
                break;
            default:
                cardBgColor = 'bg-gray-50 border-gray-300 hover:bg-gray-100';
        }
    } else {
        // No waiting time data (private hospitals)
        cardBgColor = 'bg-blue-50 border-blue-300 hover:bg-blue-100';
    }
    
    card.className = `hospital-card ${cardBgColor} rounded-lg shadow-md p-2 md:p-3 flex flex-col justify-between border hover:shadow-xl transition-all duration-200`;
    
    // Get service type with waiting time
    const serviceTypeHTML = await getServiceType(h);
    
    let feeInfo = '';
    let waitingTimeInfo = '';
    
    if (h.sector === 'private' && h.is24Hour) {
        // Time-based pricing display
        const timeInput = document.getElementById('time-input');
        const selectedTime = timeInput?.value || getCurrentTime();
        const currentPrice = getPriceForTime(h, 'consultation', selectedTime);
        const period = getTimePeriod(selectedTime);
        
        const periodLabels = {
            zh: { day: '日間', evening: '傍晚', night: '夜間' },
            en: { day: 'Day', evening: 'Evening', night: 'Night' }
        };
        const periodLabel = periodLabels[currentLanguage][period];
        
        // Dynamic color based on price
        let priceColor = 'text-green-600';
        let priceLevel = currentLanguage === 'zh' ? '較便宜' : 'Lower Cost';
        if (currentPrice >= 1200) {
            priceColor = 'text-red-600';
            priceLevel = currentLanguage === 'zh' ? '較昂貴' : 'Higher Cost';
        } else if (currentPrice >= 600) {
            priceColor = 'text-yellow-600';
            priceLevel = currentLanguage === 'zh' ? '中等收費' : 'Medium Cost';
        }
        
        feeInfo = `
            <div class="text-xs mt-1">
                <p class="font-semibold ${priceColor}">${currentLanguage === 'zh' ? '收費' : 'Fee'}: HK$${currentPrice}</p>
            </div>
        `;
    } else if (h.sector === 'public') {
        // Add waiting time info for public hospitals (reuse already fetched data)
        const updateTime = waitingTimes[h.id]?.updateTime;
        
        if (waitTime) {
            const formattedTime = formatWaitingTime(waitTime, currentLanguage);
            waitingTimeInfo = `
                <div class="text-xs mt-2">
                    <p class="font-semibold text-gray-700">
                        🕐 ${currentLanguage === 'zh' ? '等候時間' : 'Waiting Time'}: ${formattedTime}
                    </p>
                    ${updateTime ? `<p class="text-gray-500 text-xs mt-1">${currentLanguage === 'zh' ? '更新' : 'Updated'}: ${updateTime}</p>` : ''}
                </div>
            `;
        }
        
        feeInfo = `
            <div class="text-xs mt-1 inline-block">
                <div class="text-gray-700">
                    <span class="font-semibold">${t.feeEligible}: HK$180</span>
                    <span class="text-gray-500 block">${t.feeOthers}: HK$1,230</span>
                </div>
            </div>
        `;
    } else if (h.sector === 'private' && !h.is24Hour) {
        feeInfo = `
            <div class="text-xs mt-2">
                <p class="text-gray-600">${currentLanguage === 'zh' ? '非24小時服務' : 'Not 24-hour service'}</p>
            </div>
        `;
    }

    const distanceInfo = distance !== null ? `<p class="font-bold text-indigo-600">${t.distancePrefix} ${distance.toFixed(2)} ${t.distanceSuffix}</p>` : '';
    const address = currentLanguage === 'zh' ? h.address_zh : h.address_en;
    
    // Specialist services section
    let specialistSection = '';
    if (h.specialists) {
        const specialistsList = Object.entries(h.specialists).map(([specialty, availability]) => {
            const specialtyName = getSpecialtyName(specialty);
            const availabilityText = getAvailabilityText(availability);
            const colorClass = getAvailabilityColor(availability);
            
            return `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass} mr-1 mb-1">
                ${specialtyName}: ${availabilityText}
            </span>`;
        }).join('');
        
        const cardId = `specialist-${h.id}`;
        specialistSection = `
            <div class="mt-2">
                <button onclick="toggleSpecialists('${cardId}')" class="w-full text-center text-xs text-indigo-600 hover:text-indigo-800 font-medium py-1 border border-indigo-300 rounded hover:bg-indigo-50 transition-all">
                    <span class="specialist-toggle-text">${currentLanguage === 'zh' ? '查看專科' : 'View Specialists'}</span>
                    <span class="specialist-arrow ml-1">▼</span>
                </button>
                <div id="${cardId}" class="specialist-content hidden mt-1">
                    <div class="text-xs mb-1 font-medium text-gray-700">${currentLanguage === 'zh' ? '急症專科服務' : 'Emergency Specialists'}:</div>
                    <div class="flex flex-wrap">${specialistsList}</div>
                </div>
            </div>
        `;
    }

    // App download section for hospitals with apps - collapsible
    let appSection = '';
    if (h.app) {
        const appId = `app-${h.id}`;
        appSection = `
            <div class="mt-2">
                <button onclick="toggleApp('${appId}')" class="w-full text-center text-xs text-purple-600 hover:text-purple-800 font-medium py-1 border border-purple-300 rounded hover:bg-purple-50 transition-all">
                    <span class="app-toggle-text">📱 ${currentLanguage === 'zh' ? '排隊應用程式' : 'Queue App'}</span>
                    <span class="app-arrow ml-1">▼</span>
                </button>
                <div id="${appId}" class="app-content hidden mt-1 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded border border-purple-200">
                    <p class="text-xs text-gray-600 mb-2">${currentLanguage === 'zh' ? h.app.features_zh : h.app.features_en}</p>
                    <div class="flex gap-2 justify-center">
                        ${h.app.ios ? `<a href="${h.app.ios}" target="_blank" class="bg-black text-white px-2 py-1 rounded text-xs hover:bg-gray-800 transition flex items-center gap-1">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                            iOS
                        </a>` : ''}
                        ${h.app.android ? `<a href="${h.app.android}" target="_blank" class="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition flex items-center gap-1">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1518-.5972.416.416 0 00-.5972.1518l-2.0223 3.5046C15.5889 8.6039 13.8952 8.2652 12 8.2652s-3.5889.3387-5.1851.7897L4.7926 5.4503a.4161.4161 0 00-.5972-.1518.4161.4161 0 00-.1518.5972L6.0409 9.3214C2.9847 10.8064.9999 13.6829.9999 17.0015c0 .5557.4477 1.0034 1.0034 1.0034h19.9932c.5557 0 1.0034-.4477 1.0034-1.0034 0-3.3186-1.9848-6.1951-5.0409-7.6801"/>
                            </svg>
                            Android
                        </a>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    card.innerHTML = `
        <div class="text-center relative">
            <h3 class="text-sm md:text-base font-bold text-[#434242] mt-1">${currentLanguage === 'zh' ? h.name_zh : h.name_en}</h3>
            
            <div class="my-1">${serviceTypeHTML}</div>
            
            <div class="text-xs text-gray-600">
                <div class="flex justify-between items-center">
                    <p>📍 ${address}</p>
                    <p>📞 <a href="tel:${h.phone}" class="text-blue-600 hover:underline">${h.phone}</a></p>
                </div>
            </div>
            
            ${feeInfo}
            ${(specialistSection || appSection) ? `<div class="flex gap-1 mt-2">
                ${specialistSection ? specialistSection.replace('<div class="mt-2">', '<div class="flex-1">').replace('class="w-full', 'class="w-full') : ''}
                ${appSection ? appSection.replace('<div class="mt-2">', '<div class="flex-1">').replace('class="w-full', 'class="w-full') : ''}
            </div>` : ''}
            
            <div class="mt-2">
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name_en + ' ' + h.address_en)}" target="_blank" class="w-full text-center inline-block bg-[#5F9EA0] text-white px-2 py-1 rounded text-xs font-semibold hover:bg-[#4A8284] shadow-sm transition">${t.mapLinkText}</a>
            </div>
        </div>
    `;
    return card;
}

async function renderHospitalCards() {
    hospitalList.innerHTML = '';
    const filteredData = hospitalData.filter(h => {
        const regionMatch = appState.region === 'all' || h.region === appState.region;
        const sectorMatch = appState.sector === 'all' || h.sector === appState.sector;
        
        // Specialist filtering
        const specialistMatch = appState.specialist === 'all' || 
            (h.specialists && h.specialists[appState.specialist]);
        
        if (appState.sector === 'private') {
            const tierMatch = appState.privateTier === 'all' || (h.is24Hour && h.privateTier === appState.privateTier);
            return regionMatch && sectorMatch && specialistMatch && (appState.privateTier === 'all' ? true : tierMatch);
        }
        return regionMatch && sectorMatch && specialistMatch;
    });

    if (filteredData.length === 0) {
        hospitalList.innerHTML = `<p class="col-span-full text-center text-gray-500">${langContent[currentLanguage].noResults}</p>`;
        return;
    }

    // Get waiting times for sorting
    const waitingTimes = await fetchWaitingTimes();
    
    console.log('Sorting hospitals by waiting time...');
    
    // Sort ALL hospitals by waiting time (regardless of sector)
    const sortedData = [...filteredData].sort((a, b) => {
        const aWaitLevel = getWaitingTimeLevel(waitingTimes[a.id]?.waitTime);
        const bWaitLevel = getWaitingTimeLevel(waitingTimes[b.id]?.waitTime);
        
        // If both have waiting time data, sort by wait level
        if (aWaitLevel !== 4 && bWaitLevel !== 4) {
            return aWaitLevel - bWaitLevel;
        }
        
        // If only one has waiting time data, it comes first
        if (aWaitLevel !== 4 && bWaitLevel === 4) return -1;
        if (aWaitLevel === 4 && bWaitLevel !== 4) return 1;
        
        // If neither has waiting time data (both private), sort by emergency fee
        if (a.sector === 'private' && b.sector === 'private') {
            const aFee = a.emergencyFee || 9999;
            const bFee = b.emergencyFee || 9999;
            return aFee - bFee;
        }
        
        // Default: maintain original order
        return 0;
    });

    // Log first few sorted hospitals for debugging
    console.log('First 5 sorted hospitals:', sortedData.slice(0, 5).map(h => ({
        name: h.name_en,
        waitTime: waitingTimes[h.id]?.waitTime || 'No data',
        level: getWaitingTimeLevel(waitingTimes[h.id]?.waitTime),
        sector: h.sector
    })));

    // Create cards one by one to avoid blocking
    for (const h of sortedData) {
        try {
            const card = await createHospitalCard(h);
            hospitalList.appendChild(card);
        } catch (error) {
            console.error('Error creating card for hospital:', h.id, error);
            // Fallback: create basic card without waiting times
            const basicCard = createBasicHospitalCard(h);
            hospitalList.appendChild(basicCard);
        }
    }
}

// Fallback function for basic cards without waiting times
function createBasicHospitalCard(h) {
    const card = document.createElement('div');
    card.className = 'hospital-card bg-gray-50 border-gray-300 hover:bg-gray-100 rounded-lg shadow-md p-2 md:p-3 flex flex-col justify-between border hover:shadow-xl transition-all duration-200';
    const t = langContent[currentLanguage];
    
    let serviceTag = '';
    if (h.sector === 'public') {
        serviceTag = `<span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">${t.serviceTypePublic}</span>`;
    } else if (h.sector === 'private' && h.is24Hour) {
        if (h.privateTier === 'A') {
            serviceTag = `<span class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">${t.serviceTypePrivateA}</span>`;
        } else {
            serviceTag = `<span class="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">${t.serviceTypePrivateB}</span>`;
        }
    } else {
        serviceTag = `<span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">${t.serviceTypePrivateOther}</span>`;
    }
    
    let feeInfo = '';
    if (h.sector === 'public') {
        feeInfo = `
            <div class="text-xs mt-2 p-2 bg-blue-50 rounded">
                <p class="font-bold text-blue-600 mb-1">${currentLanguage === 'zh' ? '急症收費' : 'Emergency Fee'}:</p>
                <p class="text-gray-700"><span class="font-semibold">${t.feeEligible}: HK$180</span></p>
                <p class="text-gray-500">${t.feeOthers}: HK$1,230</p>
            </div>
        `;
    }
    
    const address = currentLanguage === 'zh' ? h.address_zh : h.address_en;
    
    card.innerHTML = `
        <div class="text-center relative">
            <h3 class="text-lg font-bold text-[#434242] mb-1">${currentLanguage === 'zh' ? h.name_zh : h.name_en}</h3>
            <p class="text-sm text-gray-500 mb-2">${currentLanguage === 'zh' ? h.name_en : h.name_zh}</p>
            
            <div class="mb-3">${serviceTag}</div>
            
            <p class="text-sm text-gray-700 mb-1">📍 ${address}</p>
            <p class="text-sm text-gray-700 mb-2">📞 <a href="tel:${h.phone}" class="text-blue-600 hover:underline">${h.phone}</a></p>
            <p class="text-xs text-gray-500 mb-3">${currentLanguage === 'zh' ? h.details_zh : h.details_en}</p>
            
            ${feeInfo}
            
            <div class="mt-4">
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name_en + ' ' + h.address_en)}" target="_blank" class="w-full text-center inline-block bg-[#5F9EA0] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-opacity-90 transition">${t.mapLinkText}</a>
            </div>
        </div>
    `;
    return card;
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const privateTierContainer = document.getElementById('private-tier-filter-container');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.dataset.filterGroup;
            const value = btn.dataset.filterValue;
            
            appState[group] = value;
            
            document.querySelectorAll(`.${group}-filter`).forEach(b => b.classList.replace('active-filter', 'inactive-filter'));
            btn.classList.replace('inactive-filter', 'active-filter');
            
            if(group === 'sector') {
                if (value === 'private') {
                    privateTierContainer.classList.remove('hidden');
                } else {
                    privateTierContainer.classList.add('hidden');
                    appState.privateTier = 'all'; 
                    document.querySelectorAll('.private-tier-filter').forEach(b => b.classList.replace('active-filter', 'inactive-filter'));
                    document.querySelector('.private-tier-filter[data-filter-value="all"]').classList.add('active-filter');
                }
            }
            
            renderHospitalCards().catch(err => console.error('Filter render error:', err));
        });
    });
}

function initChart() {
    const ctx = document.getElementById('costChart').getContext('2d');
    costChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { callback: value => 'HK$' + value } },
                x: { ticks: { autoSkip: false, maxRotation: 75, minRotation: 45 } }
            },
            plugins: {
                legend: { position: 'top' },
                tooltip: { callbacks: { label: context => `${context.dataset.label}: HK$${context.parsed.y}` } }
            }
        }
    });
}

function updateChart(costType) {
    const timeInput = document.getElementById('time-input');
    const selectedTime = timeInput.value || getCurrentTime();
    const privateHospitals = hospitalData.filter(h => h.sector === 'private' && h.is24Hour);
    const t = langContent[currentLanguage];

    // Get prices for the selected time and create hospital-price pairs
    const hospitalPrices = privateHospitals.map(h => ({
        hospital: h,
        price: getPriceForTime(h, costType, selectedTime)
    })).filter(hp => hp.price > 0);

    // Sort by price ascending (cheapest first)
    hospitalPrices.sort((a, b) => a.price - b.price);

    console.log(`Time: ${selectedTime}, Period: ${getTimePeriod(selectedTime)}`);
    console.log('Hospitals sorted by price:', hospitalPrices.map(hp => ({ name: hp.hospital.name_en, price: hp.price })));

    document.querySelectorAll('.cost-filter-btn').forEach(b => b.classList.replace('active-filter', 'inactive-filter'));
    
    // Map cost types to button IDs
    const buttonIdMap = {
        'consultation': 'cost-btn-consult',
        'standard': 'cost-btn-standard', 
        'semi_private': 'cost-btn-semi',
        'private': 'cost-btn-private'
    };
    
    const buttonId = buttonIdMap[costType];
    if (buttonId) {
        document.getElementById(buttonId).classList.replace('inactive-filter', 'active-filter');
    }

    const period = getTimePeriod(selectedTime);
    const periodLabels = {
        zh: { day: '日間', evening: '傍晚', night: '夜間' },
        en: { day: 'Day', evening: 'Evening', night: 'Night' }
    };
    const periodLabel = periodLabels[currentLanguage][period];

    let chartLabel;
    const roomTypes = { standard: t.roomStandard, semi_private: t.roomSemiPrivate, private: t.roomPrivate };
    switch(costType) {
        case 'consultation':
            chartLabel = currentLanguage === 'zh' ? `急症收費 - ${periodLabel} (HK$)` : `Emergency Fee - ${periodLabel} (HK$)`;
            break;
        case 'standard':
        case 'semi_private':
        case 'private':
            chartLabel = `${roomTypes[costType]} - ${periodLabel} (HK$)`;
            break;
        default:
            chartLabel = `${costType} - ${periodLabel} (HK$)`;
            break;
    }

    const newDatasets = [{
        label: chartLabel,
        data: hospitalPrices.map(hp => hp.price),
        backgroundColor: hospitalPrices.map(hp => {
            const price = hp.price;
            // Dynamic color based on price range
            if (price < 600) return 'rgba(34, 197, 94, 0.6)';      // Green - cheap
            if (price < 1200) return 'rgba(234, 179, 8, 0.6)';    // Yellow - medium  
            return 'rgba(239, 68, 68, 0.6)';                      // Red - expensive
        }),
        borderColor: hospitalPrices.map(hp => {
            const price = hp.price;
            if (price < 600) return 'rgba(34, 197, 94, 1)';
            if (price < 1200) return 'rgba(234, 179, 8, 1)';
            return 'rgba(239, 68, 68, 1)';
        }),
        borderWidth: 1
    }];

    // Set chart labels and data
    costChart.data.costType = costType;
    costChart.data.labels = hospitalPrices.map(hp => currentLanguage === 'zh' ? hp.hospital.name_zh : hp.hospital.name_en);
    costChart.data.datasets = newDatasets;
    costChart.update();
}

function setupAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('span:last-child');
            const isOpen = content.style.maxHeight;

            if (isOpen && isOpen !== '0px') {
                content.style.maxHeight = '0';
                icon.classList.remove('rotate-45');
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.classList.add('rotate-45');
            }
        });
    });
    
    // Setup disclaimer toggle
    const disclaimerToggle = document.getElementById('disclaimer-toggle');
    const disclaimerContent = document.getElementById('disclaimer-content');
    let isFullDisclaimer = false;
    
    disclaimerToggle.addEventListener('click', () => {
        const t = langContent[currentLanguage];
        isFullDisclaimer = !isFullDisclaimer;
        
        if (isFullDisclaimer) {
            disclaimerContent.innerHTML = t.disclaimerFull;
            disclaimerToggle.textContent = t.disclaimerToggleHide;
        } else {
            disclaimerContent.innerHTML = t.disclaimerShort;
            disclaimerToggle.textContent = t.disclaimerToggleShow;
        }
    });
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

async function findNearest(sector, criteria = 'distance') {
    const loader = document.getElementById('loader');
    const resultDiv = document.getElementById('nearest-hospital-result');
    const errorDiv = document.getElementById('geo-error');
    const t = langContent[currentLanguage];
    
    loader.classList.remove('hidden');
    resultDiv.innerHTML = '';
    errorDiv.textContent = '';

    if (!navigator.geolocation) {
        errorDiv.textContent = t.geoErrorBrowser;
        loader.classList.add('hidden');
        return;
    }

    navigator.geolocation.getCurrentPosition(async position => {
        const { latitude, longitude } = position.coords;
        let bestHospital = null;
        let bestValue = Infinity;
        let bestDistance = null;
        
        const hospitals = hospitalData.filter(h => h.sector === sector);
        
        if (criteria === 'waiting' && sector === 'public') {
            // Find hospital with shortest waiting time, considering distance as tiebreaker
            const waitingTimes = await fetchWaitingTimes();
            
            hospitals.forEach(h => {
                const distance = haversineDistance(latitude, longitude, h.lat, h.lon);
                const waitTime = waitingTimes[h.id]?.waitTime;
                const waitLevel = getWaitingTimeLevel(waitTime);
                
                // Score: waiting time level + distance penalty (1km = 0.1 level)
                const score = waitLevel + (distance * 0.1);
                
                if (score < bestValue) {
                    bestValue = score;
                    bestHospital = h;
                    bestDistance = distance;
                }
            });
        } else {
            // Find by distance
            hospitals.forEach(h => {
                const distance = haversineDistance(latitude, longitude, h.lat, h.lon);
                if (distance < bestValue) {
                    bestValue = distance;
                    bestHospital = h;
                    bestDistance = distance;
                }
            });
        }
        
        loader.classList.add('hidden');
        const sectorName = sector === 'public' ? t.filterSectorPublic : t.filterSectorPrivate;
        const criteriaName = criteria === 'waiting' ? 
            (currentLanguage === 'zh' ? '最短等候時間' : 'shortest waiting time') : 
            (currentLanguage === 'zh' ? '最近距離' : 'closest distance');
        
        if (bestHospital) {
            resultDiv.innerHTML = `<h4 class="font-bold text-lg mb-2">${currentLanguage === 'zh' ? `根據${criteriaName}，最合適的${sectorName}是：` : `Best ${sectorName} by ${criteriaName}:`}</h4>`;
            const card = await createHospitalCard(bestHospital, bestDistance);
            resultDiv.appendChild(card);
        } else {
            resultDiv.innerHTML = `<p>${t.geoNoResult.replace('{sector}', sectorName)}</p>`;
        }

    }, () => {
        errorDiv.textContent = t.geoErrorPermission;
        loader.classList.add('hidden');
    });
}

// Global variable to store current location coordinates
let currentLocationCoords = null;

function setupGeolocation() {
    const gpsTab = document.getElementById('gps-tab');
    const addressTab = document.getElementById('address-tab');
    const gpsContent = document.getElementById('gps-content');
    const addressContent = document.getElementById('address-content');
    const gpsBtn = document.getElementById('use-gps-btn');
    const searchBtn = document.getElementById('search-address-btn');
    const addressInput = document.getElementById('address-input');
    const resultDiv = document.getElementById('nearest-hospital-result');
    const errorDiv = document.getElementById('geo-error');
    
    // Tab switching
    gpsTab.addEventListener('click', () => {
        gpsTab.classList.add('bg-white', 'shadow-sm', 'text-gray-700');
        gpsTab.classList.remove('text-gray-500');
        addressTab.classList.remove('bg-white', 'shadow-sm', 'text-gray-700');
        addressTab.classList.add('text-gray-500');
        gpsContent.classList.remove('hidden');
        addressContent.classList.add('hidden');
        
        // Clear any existing results when switching tabs
        document.getElementById('hospital-type-selection').classList.add('hidden');
        resultDiv.innerHTML = '';
        errorDiv.textContent = '';
        currentLocationCoords = null;
    });
    
    addressTab.addEventListener('click', () => {
        addressTab.classList.add('bg-white', 'shadow-sm', 'text-gray-700');
        addressTab.classList.remove('text-gray-500');
        gpsTab.classList.remove('bg-white', 'shadow-sm', 'text-gray-700');
        gpsTab.classList.add('text-gray-500');
        addressContent.classList.remove('hidden');
        gpsContent.classList.add('hidden');
        
        // Clear any existing results when switching tabs
        document.getElementById('hospital-type-selection').classList.add('hidden');
        resultDiv.innerHTML = '';
        errorDiv.textContent = '';
        currentLocationCoords = null;
        
        // Focus on address input
        addressInput.focus();
    });
    
    // GPS Location Button
    gpsBtn.addEventListener('click', () => {
        useGPSLocation();
    });
    
    // Search Address Button
    searchBtn.addEventListener('click', () => {
        searchByAddress();
    });
    
    // Enter key on address input
    addressInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const suggestions = document.getElementById('address-suggestions');
            const firstSuggestion = suggestions.querySelector('.suggestion-item.highlighted');
            if (firstSuggestion && !suggestions.classList.contains('hidden')) {
                selectSuggestion(firstSuggestion.textContent);
            } else {
                searchByAddress();
            }
        }
    });
    
    // Autocomplete functionality
    addressInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length >= 1) {
            showAddressSuggestions(query);
        } else {
            hideAddressSuggestions();
        }
    });
    
    // Handle keyboard navigation in suggestions
    addressInput.addEventListener('keydown', (e) => {
        const suggestions = document.getElementById('address-suggestions');
        const items = suggestions.querySelectorAll('.suggestion-item');
        let highlighted = suggestions.querySelector('.suggestion-item.highlighted');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!highlighted) {
                items[0]?.classList.add('highlighted');
            } else {
                highlighted.classList.remove('highlighted');
                const next = highlighted.nextElementSibling || items[0];
                next.classList.add('highlighted');
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!highlighted) {
                items[items.length - 1]?.classList.add('highlighted');
            } else {
                highlighted.classList.remove('highlighted');
                const prev = highlighted.previousElementSibling || items[items.length - 1];
                prev.classList.add('highlighted');
            }
        } else if (e.key === 'Escape') {
            hideAddressSuggestions();
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        const addressContent = document.getElementById('address-content');
        if (addressContent && !addressContent.contains(e.target)) {
            hideAddressSuggestions();
        }
    });
    
    // Hospital type selection buttons
    document.getElementById('find-public-distance').addEventListener('click', () => {
        findNearestWithLocation('public', 'distance');
    });
    
    document.getElementById('find-public-waiting').addEventListener('click', () => {
        findNearestWithLocation('public', 'waiting');
    });
    
    document.getElementById('find-private-distance').addEventListener('click', () => {
        findNearestWithLocation('private', 'distance');
    });
}


function useGPSLocation() {
    const loader = document.getElementById('loader');
    const errorDiv = document.getElementById('geo-error');
    const hospitalSelection = document.getElementById('hospital-type-selection');
    const t = langContent[currentLanguage];
    
    loader.classList.remove('hidden');
    errorDiv.textContent = '';
    document.getElementById('nearest-hospital-result').innerHTML = '';
    
    if (!navigator.geolocation) {
        errorDiv.textContent = t.geoErrorBrowser;
        loader.classList.add('hidden');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            currentLocationCoords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            loader.classList.add('hidden');
            hospitalSelection.classList.remove('hidden');
        },
        (error) => {
            loader.classList.add('hidden');
            errorDiv.textContent = t.geoErrorPermission;
        }
    );
}

async function searchByAddress() {
    const addressInput = document.getElementById('address-input');
    const loader = document.getElementById('loader');
    const errorDiv = document.getElementById('geo-error');
    const hospitalSelection = document.getElementById('hospital-type-selection');
    const address = addressInput.value.trim();
    
    if (!address) {
        errorDiv.textContent = currentLanguage === 'zh' ? '請輸入地址' : 'Please enter an address';
        return;
    }
    
    loader.classList.remove('hidden');
    errorDiv.textContent = '';
    document.getElementById('nearest-hospital-result').innerHTML = '';
    
    try {
        // Use a geocoding service - for now, we'll use a simple Hong Kong district mapping
        const coords = await geocodeHongKongAddress(address);
        
        if (coords) {
            currentLocationCoords = coords;
            loader.classList.add('hidden');
            hospitalSelection.classList.remove('hidden');
        } else {
            throw new Error('Address not found');
        }
    } catch (error) {
        loader.classList.add('hidden');
        errorDiv.textContent = currentLanguage === 'zh' ? '找不到該地址，請嘗試輸入香港地區名稱' : 'Address not found, please try a Hong Kong district name';
    }
}

// Comprehensive Hong Kong locations database
const hkLocationsDB = [
    // Hong Kong Island - Central & Western District
    { zh: '中環', en: 'Central', coords: { latitude: 22.2783, longitude: 114.1747 }, keywords: ['central', '中環', 'ifc', '國際金融中心', 'central station'] },
    { zh: '金鐘', en: 'Admiralty', coords: { latitude: 22.2779, longitude: 114.1652 }, keywords: ['admiralty', '金鐘', 'pacific place', '太古廣場'] },
    { zh: '上環', en: 'Sheung Wan', coords: { latitude: 22.2864, longitude: 114.1501 }, keywords: ['sheung wan', '上環', '信德中心', 'shun tak', 'macau ferry'] },
    { zh: '西環', en: 'Sai Ying Pun', coords: { latitude: 22.2850, longitude: 114.1450 }, keywords: ['sai ying pun', 'syp', '西環', '西營盤'] },
    { zh: '堅尼地城', en: 'Kennedy Town', coords: { latitude: 22.2816, longitude: 114.1289 }, keywords: ['kennedy town', '堅尼地城', 'kennedy town station'] },
    { zh: '石塘咀', en: 'Shek Tong Tsui', coords: { latitude: 22.2836, longitude: 114.1374 }, keywords: ['shek tong tsui', '石塘咀', 'hku station'] },
    { zh: '薄扶林', en: 'Pok Fu Lam', coords: { latitude: 22.2710, longitude: 114.1292 }, keywords: ['pok fu lam', '薄扶林', '港大', 'hku', 'university of hong kong'] },
    
    // Hong Kong Island - Wan Chai District
    { zh: '灣仔', en: 'Wan Chai', coords: { latitude: 22.2747, longitude: 114.1733 }, keywords: ['wan chai', 'wanchai', '灣仔', '會展', 'convention centre'] },
    { zh: '跑馬地', en: 'Happy Valley', coords: { latitude: 22.2716, longitude: 114.1831 }, keywords: ['happy valley', '跑馬地', 'racecourse', '馬場'] },
    { zh: '銅鑼灣', en: 'Causeway Bay', coords: { latitude: 22.2800, longitude: 114.1860 }, keywords: ['causeway bay', 'cwb', '銅鑼灣', '時代廣場', 'times square', 'sogo'] },
    { zh: '天后', en: 'Tin Hau', coords: { latitude: 22.2832, longitude: 114.1913 }, keywords: ['tin hau', '天后', 'tin hau station'] },
    { zh: '炮台山', en: 'Fortress Hill', coords: { latitude: 22.2886, longitude: 114.1944 }, keywords: ['fortress hill', '炮台山', 'fortress hill station'] },
    { zh: '北角', en: 'North Point', coords: { latitude: 22.2925, longitude: 114.2000 }, keywords: ['north point', '北角', 'north point station', 'cityplaza'] },
    { zh: '鰂魚涌', en: 'Quarry Bay', coords: { latitude: 22.2880, longitude: 114.2139 }, keywords: ['quarry bay', '鰂魚涌', 'taikoo place', '太古坊'] },
    { zh: '太古', en: 'Taikoo', coords: { latitude: 22.2850, longitude: 114.2200 }, keywords: ['taikoo', 'tai koo', '太古', '康怡', 'kornhill'] },
    { zh: '西灣河', en: 'Sai Wan Ho', coords: { latitude: 22.2816, longitude: 114.2254 }, keywords: ['sai wan ho', '西灣河', 'sai wan ho station'] },
    { zh: '筲箕灣', en: 'Shau Kei Wan', coords: { latitude: 22.2789, longitude: 114.2304 }, keywords: ['shau kei wan', '筲箕灣', 'shau kei wan station'] },
    { zh: '柴灣', en: 'Chai Wan', coords: { latitude: 22.2669, longitude: 114.2366 }, keywords: ['chai wan', '柴灣', 'chai wan station'] },
    
    // Hong Kong Island - Southern District
    { zh: '香港仔', en: 'Aberdeen', coords: { latitude: 22.2480, longitude: 114.1550 }, keywords: ['aberdeen', '香港仔', 'aberdeen centre'] },
    { zh: '黃竹坑', en: 'Wong Chuk Hang', coords: { latitude: 22.2464, longitude: 114.1694 }, keywords: ['wong chuk hang', '黃竹坑', 'ocean park'] },
    { zh: '海洋公園', en: 'Ocean Park', coords: { latitude: 22.2464, longitude: 114.1694 }, keywords: ['ocean park', '海洋公園', 'ocean park station'] },
    { zh: '深水灣', en: 'Deep Water Bay', coords: { latitude: 22.2372, longitude: 114.1978 }, keywords: ['deep water bay', '深水灣', 'repulse bay'] },
    { zh: '淺水灣', en: 'Repulse Bay', coords: { latitude: 22.2372, longitude: 114.1978 }, keywords: ['repulse bay', '淺水灣', 'repulse bay beach'] },
    { zh: '赤柱', en: 'Stanley', coords: { latitude: 22.2194, longitude: 114.2086 }, keywords: ['stanley', '赤柱', 'stanley market', 'stanley beach'] },
    { zh: '鴨脷洲', en: 'Ap Lei Chau', coords: { latitude: 22.2417, longitude: 114.1528 }, keywords: ['ap lei chau', '鴨脷洲', 'lei tung', '利東'] },
    { zh: '利東', en: 'Lei Tung', coords: { latitude: 22.2417, longitude: 114.1528 }, keywords: ['lei tung', '利東', 'lei tung station'] },
    { zh: '海怡半島', en: 'South Horizons', coords: { latitude: 22.2400, longitude: 114.1528 }, keywords: ['south horizons', '海怡半島', 'south horizons station'] },
    
    // Kowloon - Yau Tsim Mong District
    { zh: '尖沙咀', en: 'Tsim Sha Tsui', coords: { latitude: 22.2976, longitude: 114.1722 }, keywords: ['tsim sha tsui', 'tst', '尖沙咀', '海港城', 'harbour city', 'star ferry'] },
    { zh: '尖沙咀東', en: 'Tsim Sha Tsui East', coords: { latitude: 22.2984, longitude: 114.1777 }, keywords: ['tsim sha tsui east', 'tst east', '尖沙咀東', 'space museum'] },
    { zh: '尖東', en: 'East Tsim Sha Tsui', coords: { latitude: 22.2984, longitude: 114.1777 }, keywords: ['east tsim sha tsui', '尖東', 'east tst', 'east tsim sha tsui station'] },
    { zh: '佐敦', en: 'Jordan', coords: { latitude: 22.3048, longitude: 114.1708 }, keywords: ['jordan', '佐敦', 'jordan station', 'austin'] },
    { zh: '油麻地', en: 'Yau Ma Tei', coords: { latitude: 22.3088, longitude: 114.1700 }, keywords: ['yau ma tei', 'ymt', '油麻地', '廟街', 'temple street'] },
    { zh: '旺角', en: 'Mong Kok', coords: { latitude: 22.3193, longitude: 114.1694 }, keywords: ['mong kok', 'mongkok', '旺角', '花園街', 'fa yuen street', 'ladies market'] },
    { zh: '旺角東', en: 'Mong Kok East', coords: { latitude: 22.3220, longitude: 114.1726 }, keywords: ['mong kok east', '旺角東', 'mong kok east station'] },
    { zh: '大角咀', en: 'Tai Kok Tsui', coords: { latitude: 22.3167, longitude: 114.1636 }, keywords: ['tai kok tsui', '大角咀', 'olympic station'] },
    { zh: '奧運', en: 'Olympic', coords: { latitude: 22.3167, longitude: 114.1636 }, keywords: ['olympic', '奧運', 'olympic station'] },
    
    // Kowloon - Sham Shui Po District
    { zh: '深水埗', en: 'Sham Shui Po', coords: { latitude: 22.3320, longitude: 114.1620 }, keywords: ['sham shui po', 'ssp', '深水埗', '鴨寮街', 'ap liu street'] },
    { zh: '長沙灣', en: 'Cheung Sha Wan', coords: { latitude: 22.3373, longitude: 114.1556 }, keywords: ['cheung sha wan', '長沙灣', 'cheung sha wan station'] },
    { zh: '荔枝角', en: 'Lai Chi Kok', coords: { latitude: 22.3378, longitude: 114.1448 }, keywords: ['lai chi kok', '荔枝角', 'lai chi kok station'] },
    { zh: '美孚', en: 'Mei Foo', coords: { latitude: 22.3378, longitude: 114.1369 }, keywords: ['mei foo', '美孚', 'mei foo station'] },
    { zh: '石硤尾', en: 'Shek Kip Mei', coords: { latitude: 22.3378, longitude: 114.1697 }, keywords: ['shek kip mei', '石硤尾', 'shek kip mei station'] },
    
    // Kowloon - Kowloon City District
    { zh: '九龍城', en: 'Kowloon City', coords: { latitude: 22.3276, longitude: 114.1848 }, keywords: ['kowloon city', '九龍城', 'kai tak', '啟德'] },
    { zh: '土瓜灣', en: 'To Kwa Wan', coords: { latitude: 22.3165, longitude: 114.1882 }, keywords: ['to kwa wan', '土瓜灣', 'to kwa wan station'] },
    { zh: '馬頭圍', en: 'Ma Tau Wai', coords: { latitude: 22.3165, longitude: 114.1882 }, keywords: ['ma tau wai', '馬頭圍', 'ma tau wai station'] },
    { zh: '紅磡', en: 'Hung Hom', coords: { latitude: 22.3028, longitude: 114.1825 }, keywords: ['hung hom', '紅磡', 'hung hom station', 'whampoa'] },
    { zh: '黃埔', en: 'Whampoa', coords: { latitude: 22.3028, longitude: 114.1825 }, keywords: ['whampoa', '黃埔', 'whampoa station'] },
    { zh: '何文田', en: 'Ho Man Tin', coords: { latitude: 22.3084, longitude: 114.1826 }, keywords: ['ho man tin', '何文田', 'ho man tin station'] },
    { zh: '啟德', en: 'Kai Tak', coords: { latitude: 22.3276, longitude: 114.1950 }, keywords: ['kai tak', '啟德', 'kai tak station'] },
    
    // Kowloon - Wong Tai Sin District
    { zh: '黃大仙', en: 'Wong Tai Sin', coords: { latitude: 22.3420, longitude: 114.1950 }, keywords: ['wong tai sin', 'wts', '黃大仙', 'wong tai sin temple'] },
    { zh: '彩虹', en: 'Choi Hung', coords: { latitude: 22.3356, longitude: 114.2089 }, keywords: ['choi hung', '彩虹', 'choi hung station'] },
    { zh: '九龍灣', en: 'Kowloon Bay', coords: { latitude: 22.3224, longitude: 114.2133 }, keywords: ['kowloon bay', '九龍灣', 'kowloon bay station', 'telford plaza'] },
    { zh: '牛頭角', en: 'Ngau Tau Kok', coords: { latitude: 22.3149, longitude: 114.2259 }, keywords: ['ngau tau kok', '牛頭角', 'ngau tau kok station'] },
    { zh: '鑽石山', en: 'Diamond Hill', coords: { latitude: 22.3407, longitude: 114.2020 }, keywords: ['diamond hill', '鑽石山', 'diamond hill station'] },
    { zh: '樂富', en: 'Lok Fu', coords: { latitude: 22.3372, longitude: 114.1849 }, keywords: ['lok fu', '樂富', 'lok fu station'] },
    { zh: '九龍塘', en: 'Kowloon Tong', coords: { latitude: 22.3370, longitude: 114.1760 }, keywords: ['kowloon tong', '九龍塘', 'festival walk', 'kowloon tong station'] },
    
    // Kowloon - Kwun Tong District  
    { zh: '觀塘', en: 'Kwun Tong', coords: { latitude: 22.3149, longitude: 114.2259 }, keywords: ['kwun tong', '觀塘', 'kwun tong station', 'apm'] },
    { zh: '藍田', en: 'Lam Tin', coords: { latitude: 22.3066, longitude: 114.2378 }, keywords: ['lam tin', '藍田', 'lam tin station'] },
    { zh: '油塘', en: 'Yau Tong', coords: { latitude: 22.3019, longitude: 114.2373 }, keywords: ['yau tong', '油塘', 'yau tong station'] },
    { zh: '調景嶺', en: 'Tiu Keng Leng', coords: { latitude: 22.3018, longitude: 114.2531 }, keywords: ['tiu keng leng', '調景嶺', 'tiu keng leng station'] },
    
    // New Territories - Tsuen Wan District
    { zh: '荃灣', en: 'Tsuen Wan', coords: { latitude: 22.3742, longitude: 114.1192 }, keywords: ['tsuen wan', '荃灣', 'tsuen wan station', 'nina tower'] },
    { zh: '荃灣西', en: 'Tsuen Wan West', coords: { latitude: 22.3742, longitude: 114.1192 }, keywords: ['tsuen wan west', '荃灣西', 'tsuen wan west station'] },
    { zh: '深井', en: 'Sham Tseng', coords: { latitude: 22.3742, longitude: 114.1019 }, keywords: ['sham tseng', '深井', 'sham tseng station'] },
    { zh: '汀九', en: 'Ting Kau', coords: { latitude: 22.3742, longitude: 114.1019 }, keywords: ['ting kau', '汀九', 'ting kau bridge'] },
    { zh: '青衣', en: 'Tsing Yi', coords: { latitude: 22.3572, longitude: 114.1078 }, keywords: ['tsing yi', '青衣', 'tsing yi station'] },
    { zh: '葵涌', en: 'Kwai Chung', coords: { latitude: 22.3572, longitude: 114.1331 }, keywords: ['kwai chung', '葵涌', 'kwai hing', '葵興'] },
    { zh: '葵興', en: 'Kwai Hing', coords: { latitude: 22.3619, longitude: 114.1331 }, keywords: ['kwai hing', '葵興', 'kwai hing station'] },
    { zh: '葵芳', en: 'Kwai Fong', coords: { latitude: 22.3572, longitude: 114.1331 }, keywords: ['kwai fong', '葵芳', 'kwai fong station'] },
    { zh: '大窩口', en: 'Tai Wo Hau', coords: { latitude: 22.3721, longitude: 114.1239 }, keywords: ['tai wo hau', '大窩口', 'tai wo hau station'] },
    
    // New Territories - Sha Tin District
    { zh: '沙田', en: 'Sha Tin', coords: { latitude: 22.3794, longitude: 114.2022 }, keywords: ['sha tin', 'shatin', '沙田', 'new town plaza', '新城市廣場'] },
    { zh: '沙田市中心', en: 'Sha Tin Town Centre', coords: { latitude: 22.3794, longitude: 114.2022 }, keywords: ['sha tin town centre', '沙田市中心', 'sha tin station'] },
    { zh: '大圍', en: 'Tai Wai', coords: { latitude: 22.3728, longitude: 114.1789 }, keywords: ['tai wai', '大圍', 'tai wai station'] },
    { zh: '車公廟', en: 'Che Kung Temple', coords: { latitude: 22.3728, longitude: 114.1789 }, keywords: ['che kung temple', '車公廟', 'che kung temple station'] },
    { zh: '沙田圍', en: 'Sha Tin Wai', coords: { latitude: 22.3728, longitude: 114.1866 }, keywords: ['sha tin wai', '沙田圍', 'sha tin wai station'] },
    { zh: '城門河', en: 'Shing Mun River', coords: { latitude: 22.3728, longitude: 114.1866 }, keywords: ['shing mun river', '城門河', 'shing mun river station'] },
    { zh: '石門', en: 'Shek Mun', coords: { latitude: 22.3889, longitude: 114.2056 }, keywords: ['shek mun', '石門', 'shek mun station'] },
    { zh: '第一城', en: 'City One', coords: { latitude: 22.3889, longitude: 114.2056 }, keywords: ['city one', '第一城', 'city one shatin'] },
    { zh: '火炭', en: 'Fo Tan', coords: { latitude: 22.3972, longitude: 114.2081 }, keywords: ['fo tan', '火炭', 'fo tan station'] },
    { zh: '馬料水', en: 'Ma Liu Shui', coords: { latitude: 22.4194, longitude: 114.2083 }, keywords: ['ma liu shui', '馬料水', 'university station', 'cuhk'] },
    { zh: '大學', en: 'University', coords: { latitude: 22.4194, longitude: 114.2083 }, keywords: ['university', '大學', 'university station', 'cuhk'] },
    { zh: '馬鞍山', en: 'Ma On Shan', coords: { latitude: 22.4250, longitude: 114.2350 }, keywords: ['ma on shan', 'mos', '馬鞍山', 'ma on shan station'] },
    { zh: '烏溪沙', en: 'Wu Kai Sha', coords: { latitude: 22.4250, longitude: 114.2556 }, keywords: ['wu kai sha', '烏溪沙', 'wu kai sha station'] },
    { zh: '恒安', en: 'Heng On', coords: { latitude: 22.4250, longitude: 114.2350 }, keywords: ['heng on', '恒安', 'heng on station'] },
    
    // New Territories - Tai Po District
    { zh: '大埔', en: 'Tai Po', coords: { latitude: 22.4556, longitude: 114.1761 }, keywords: ['tai po', '大埔', 'tai po market', '大埔墟'] },
    { zh: '大埔墟', en: 'Tai Po Market', coords: { latitude: 22.4556, longitude: 114.1761 }, keywords: ['tai po market', '大埔墟', 'tai po market station'] },
    { zh: '大埔中心', en: 'Tai Po Centre', coords: { latitude: 22.4556, longitude: 114.1761 }, keywords: ['tai po centre', '大埔中心', 'tai po central'] },
    { zh: '大埔滘', en: 'Tai Po Kau', coords: { latitude: 22.4556, longitude: 114.1761 }, keywords: ['tai po kau', '大埔滘', 'tai po kau station'] },
    { zh: '太和', en: 'Tai Wo', coords: { latitude: 22.4722, longitude: 114.1653 }, keywords: ['tai wo', '太和', 'tai wo station'] },
    { zh: '元朗公路', en: 'Yuen Long Highway', coords: { latitude: 22.4722, longitude: 114.1653 }, keywords: ['yuen long highway', '元朗公路'] },
    
    // New Territories - North District
    { zh: '粉嶺', en: 'Fanling', coords: { latitude: 22.4942, longitude: 114.1386 }, keywords: ['fanling', '粉嶺', 'fanling station'] },
    { zh: '上水', en: 'Sheung Shui', coords: { latitude: 22.5005, longitude: 114.1245 }, keywords: ['sheung shui', '上水', 'sheung shui station'] },
    { zh: '羅湖', en: 'Lo Wu', coords: { latitude: 22.5281, longitude: 114.1133 }, keywords: ['lo wu', '羅湖', 'lo wu station', 'border'] },
    { zh: '落馬洲', en: 'Lok Ma Chau', coords: { latitude: 22.5281, longitude: 114.0653 }, keywords: ['lok ma chau', '落馬洲', 'lok ma chau station'] },
    
    // New Territories - Yuen Long District
    { zh: '元朗', en: 'Yuen Long', coords: { latitude: 22.4385, longitude: 114.0322 }, keywords: ['yuen long', '元朗', 'yuen long station', 'yoho mall'] },
    { zh: '朗屏', en: 'Long Ping', coords: { latitude: 22.4385, longitude: 114.0322 }, keywords: ['long ping', '朗屏', 'long ping station'] },
    { zh: '天水圍', en: 'Tin Shui Wai', coords: { latitude: 22.4681, longitude: 114.0011 }, keywords: ['tin shui wai', '天水圍', 'tin shui wai station'] },
    { zh: '兆康', en: 'Siu Hong', coords: { latitude: 22.4681, longitude: 114.0011 }, keywords: ['siu hong', '兆康', 'siu hong station'] },
    { zh: '天逸', en: 'Tin Yat', coords: { latitude: 22.4681, longitude: 114.0011 }, keywords: ['tin yat', '天逸', 'tin yat estate'] },
    { zh: '錦上路', en: 'Kam Sheung Road', coords: { latitude: 22.4264, longitude: 114.0636 }, keywords: ['kam sheung road', '錦上路', 'kam sheung road station'] },
    
    // New Territories - Tuen Mun District
    { zh: '屯門', en: 'Tuen Mun', coords: { latitude: 22.4042, longitude: 113.9762 }, keywords: ['tuen mun', '屯門', 'tuen mun station', 'town plaza'] },
    { zh: '屯門市中心', en: 'Tuen Mun Town Centre', coords: { latitude: 22.4042, longitude: 113.9762 }, keywords: ['tuen mun town centre', '屯門市中心', 'tuen mun central'] },
    { zh: '兆康', en: 'Siu Hong', coords: { latitude: 22.4042, longitude: 113.9762 }, keywords: ['siu hong', '兆康', 'siu hong station'] },
    { zh: '天水圍', en: 'Tin Shui Wai', coords: { latitude: 22.4681, longitude: 114.0011 }, keywords: ['tin shui wai', '天水圍', 'tin shui wai station'] },
    { zh: '輕鐵', en: 'Light Rail', coords: { latitude: 22.4042, longitude: 113.9762 }, keywords: ['light rail', '輕鐵', 'lrt'] },
    
    // New Territories - Sai Kung District
    { zh: '將軍澳', en: 'Tseung Kwan O', coords: { latitude: 22.3146, longitude: 114.2631 }, keywords: ['tseung kwan o', 'tko', '將軍澳', 'tko station'] },
    { zh: '寶琳', en: 'Po Lam', coords: { latitude: 22.3146, longitude: 114.2631 }, keywords: ['po lam', '寶琳', 'po lam station'] },
    { zh: '坑口', en: 'Hang Hau', coords: { latitude: 22.3146, longitude: 114.2631 }, keywords: ['hang hau', '坑口', 'hang hau station'] },
    { zh: '將軍澳市中心', en: 'Tseung Kwan O Town Centre', coords: { latitude: 22.3146, longitude: 114.2631 }, keywords: ['tseung kwan o town centre', '將軍澳市中心', 'tko town centre'] },
    { zh: '康城', en: 'Lohas Park', coords: { latitude: 22.3146, longitude: 114.2756 }, keywords: ['lohas park', '康城', 'lohas park station'] },
    { zh: '西貢', en: 'Sai Kung', coords: { latitude: 22.3817, longitude: 114.2747 }, keywords: ['sai kung', '西貢', 'sai kung town'] },
    { zh: '清水灣', en: 'Clear Water Bay', coords: { latitude: 22.3146, longitude: 114.2756 }, keywords: ['clear water bay', '清水灣', 'clearwater bay'] },
    
    // New Territories - Islands District
    { zh: '東涌', en: 'Tung Chung', coords: { latitude: 22.2868, longitude: 113.9422 }, keywords: ['tung chung', '東涌', 'tung chung station', '機場', 'airport'] },
    { zh: '機場', en: 'Airport', coords: { latitude: 22.3080, longitude: 113.9185 }, keywords: ['airport', '機場', 'hkia', 'hong kong international airport'] },
    { zh: '博覽館', en: 'AsiaWorld-Expo', coords: { latitude: 22.3223, longitude: 113.9424 }, keywords: ['asiaworld-expo', '博覽館', 'asiaworld expo station'] },
    { zh: '中環碼頭', en: 'Central Pier', coords: { latitude: 22.2876, longitude: 114.1603 }, keywords: ['central pier', '中環碼頭', 'star ferry pier'] },
    { zh: '迪士尼', en: 'Disneyland', coords: { latitude: 22.3129, longitude: 114.0434 }, keywords: ['disneyland', '迪士尼', 'disneyland resort station', 'disney'] },
    { zh: '愉景灣', en: 'Discovery Bay', coords: { latitude: 22.2868, longitude: 114.0422 }, keywords: ['discovery bay', '愉景灣', 'db'] },
    { zh: '長洲', en: 'Cheung Chau', coords: { latitude: 22.2086, longitude: 114.0289 }, keywords: ['cheung chau', '長洲', 'cheung chau ferry'] },
    { zh: '南丫島', en: 'Lamma Island', coords: { latitude: 22.2086, longitude: 114.1289 }, keywords: ['lamma island', '南丫島', 'lamma'] },
    { zh: '梅窩', en: 'Mui Wo', coords: { latitude: 22.2586, longitude: 113.9889 }, keywords: ['mui wo', '梅窩', 'silvermine bay'] },
    { zh: '大嶼山', en: 'Lantau Island', coords: { latitude: 22.2586, longitude: 113.9889 }, keywords: ['lantau island', '大嶼山', 'lantau'] },
    
    // Additional Major Shopping Areas and Landmarks
    { zh: '海港城', en: 'Harbour City', coords: { latitude: 22.2976, longitude: 114.1722 }, keywords: ['harbour city', '海港城', 'canton road'] },
    { zh: '時代廣場', en: 'Times Square', coords: { latitude: 22.2800, longitude: 114.1860 }, keywords: ['times square', '時代廣場', 'causeway bay'] },
    { zh: '太古廣場', en: 'Pacific Place', coords: { latitude: 22.2779, longitude: 114.1652 }, keywords: ['pacific place', '太古廣場', 'admiralty'] },
    { zh: '國際金融中心', en: 'IFC', coords: { latitude: 22.2783, longitude: 114.1747 }, keywords: ['ifc', '國際金融中心', 'international finance centre'] },
    { zh: '朗豪坊', en: 'Langham Place', coords: { latitude: 22.3193, longitude: 114.1694 }, keywords: ['langham place', '朗豪坊', 'mong kok'] },
    { zh: '新城市廣場', en: 'New Town Plaza', coords: { latitude: 22.3794, longitude: 114.2022 }, keywords: ['new town plaza', '新城市廣場', 'sha tin'] },
    { zh: '圓方', en: 'Elements', coords: { latitude: 22.3028, longitude: 114.1613 }, keywords: ['elements', '圓方', 'kowloon station'] },
    { zh: '又一城', en: 'Festival Walk', coords: { latitude: 22.3370, longitude: 114.1760 }, keywords: ['festival walk', '又一城', 'kowloon tong'] }
];

function showAddressSuggestions(query) {
    const suggestions = document.getElementById('address-suggestions');
    const normalizedQuery = query.toLowerCase().trim();
    
    // Find matching locations
    const matches = hkLocationsDB.filter(location => {
        return location.keywords.some(keyword => 
            keyword.toLowerCase().includes(normalizedQuery) ||
            normalizedQuery.includes(keyword.toLowerCase())
        );
    }).slice(0, 8); // Limit to 8 suggestions
    
    if (matches.length > 0) {
        suggestions.innerHTML = matches.map((location, index) => `
            <div class="suggestion-item px-3 py-2 cursor-pointer hover:bg-indigo-50 border-b border-gray-100 last:border-b-0 ${index === 0 ? 'highlighted bg-indigo-50' : ''}" 
                 onclick="selectSuggestion('${location.zh}')">
                <div class="flex justify-between items-center">
                    <div>
                        <span class="font-medium text-gray-800">${location.zh}</span>
                        <span class="text-gray-500 text-sm ml-2">${location.en}</span>
                    </div>
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                </div>
            </div>
        `).join('');
        suggestions.classList.remove('hidden');
    } else {
        hideAddressSuggestions();
    }
}

function hideAddressSuggestions() {
    const suggestions = document.getElementById('address-suggestions');
    suggestions.classList.add('hidden');
    suggestions.innerHTML = '';
}

function selectSuggestion(locationName) {
    const addressInput = document.getElementById('address-input');
    addressInput.value = locationName;
    hideAddressSuggestions();
    searchByAddress();
}

// Simple Hong Kong address geocoding (approximate coordinates)
async function geocodeHongKongAddress(address) {
    const searchTerm = address.toLowerCase().trim();
    
    // Find exact match in comprehensive database
    const location = hkLocationsDB.find(loc => 
        loc.zh === address || 
        loc.en.toLowerCase() === searchTerm ||
        loc.keywords.some(keyword => keyword.toLowerCase() === searchTerm)
    );
    
    if (location) {
        return location.coords;
    }
    
    // Fallback: partial match
    const partialMatch = hkLocationsDB.find(loc =>
        loc.keywords.some(keyword => 
            searchTerm.includes(keyword.toLowerCase()) || 
            keyword.toLowerCase().includes(searchTerm)
        )
    );
    
    return partialMatch ? partialMatch.coords : null;
}

function findNearestWithLocation(sector, criteria = 'distance') {
    if (!currentLocationCoords) {
        document.getElementById('geo-error').textContent = currentLanguage === 'zh' ? '請先設定位置' : 'Please set location first';
        return;
    }
    
    findNearestFromCoords(currentLocationCoords.latitude, currentLocationCoords.longitude, sector, criteria);
}

async function findNearestFromCoords(latitude, longitude, sector, criteria = 'distance') {
    const loader = document.getElementById('loader');
    const resultDiv = document.getElementById('nearest-hospital-result');
    const errorDiv = document.getElementById('geo-error');
    const t = langContent[currentLanguage];
    
    loader.classList.remove('hidden');
    resultDiv.innerHTML = '';
    errorDiv.textContent = '';

    try {
        let bestHospital = null;
        let bestValue = Infinity;
        let bestDistance = null;
        
        const hospitals = hospitalData.filter(h => h.sector === sector);
        
        if (criteria === 'waiting' && sector === 'public') {
            // Find hospital with shortest waiting time, considering distance as tiebreaker
            const waitingTimes = await fetchWaitingTimes();
            
            hospitals.forEach(h => {
                const distance = haversineDistance(latitude, longitude, h.lat, h.lon);
                const waitTime = waitingTimes[h.id]?.waitTime;
                const waitLevel = getWaitingTimeLevel(waitTime);
                
                // Score: waiting time level + distance penalty (1km = 0.1 level)
                const score = waitLevel + (distance * 0.1);
                
                if (score < bestValue) {
                    bestValue = score;
                    bestHospital = h;
                    bestDistance = distance;
                }
            });
        } else {
            // Find by distance
            hospitals.forEach(h => {
                const distance = haversineDistance(latitude, longitude, h.lat, h.lon);
                if (distance < bestValue) {
                    bestValue = distance;
                    bestHospital = h;
                    bestDistance = distance;
                }
            });
        }

        loader.classList.add('hidden');

        if (bestHospital) {
            const card = await createHospitalCard(bestHospital, bestDistance);
            const sectorText = sector === 'public' ? t.serviceTypePublic : (currentLanguage === 'zh' ? '私家醫院' : 'Private Hospital');
            resultDiv.innerHTML = `
                <h4 class="font-bold text-lg mb-3">${t.geoResultTitle.replace('{sector}', sectorText)}</h4>
                <div class="flex justify-center">
                    <div class="max-w-sm w-full">
                        ${card.outerHTML}
                    </div>
                </div>
            `;
        } else {
            const sectorText = sector === 'public' ? t.serviceTypePublic : (currentLanguage === 'zh' ? '私家醫院' : 'Private Hospital');
            resultDiv.innerHTML = `<p class="text-gray-500">${t.geoNoResult.replace('{sector}', sectorText)}</p>`;
        }
    } catch (error) {
        loader.classList.add('hidden');
        errorDiv.textContent = currentLanguage === 'zh' ? '搜尋時發生錯誤' : 'Error occurred during search';
        console.error('Find nearest error:', error);
    }
}

// Auto-refresh waiting times every minute
function startWaitingTimeUpdates() {
    // Initial fetch
    fetchWaitingTimes();
    
    // Set up interval to refresh every minute
    setInterval(async () => {
        try {
            await fetchWaitingTimes();
            // Re-render cards if any are visible to update waiting times
            if (hospitalList.children.length > 0) {
                await renderHospitalCards();
            }
        } catch (error) {
            console.log('Background waiting time update failed:', error);
        }
    }, 60000); // 60 seconds
}

// Emergency 999 functions (only if feature is enabled)
function setupEmergency999Elements() {
    if (!config.features.emergencyBanner) {
        // Hide emergency elements if feature is disabled
        document.getElementById('emergency-999-banner').style.display = 'none';
        document.getElementById('emergency-999-location').style.display = 'none';
        document.getElementById('emergency-999-before-list').style.display = 'none';
        return;
    }
    const t = langContent[currentLanguage];
    
    // Setup banner
    document.getElementById('emergency-999-banner-text').textContent = t.emergency999Banner;
    document.getElementById('emergency-999-banner-sub').textContent = t.emergency999BannerSub;
    
    // Setup before list reminder
    document.getElementById('emergency-999-before-list-text').textContent = t.emergency999BeforeList;
    
    // Setup location reminder
    document.getElementById('emergency-999-location-text').textContent = t.emergency999Location;
    
    // Setup modal
    document.getElementById('emergency-999-modal-title').textContent = t.emergency999ModalTitle;
    document.getElementById('emergency-999-modal-content').innerHTML = t.emergency999ModalContent;
    document.getElementById('emergency-999-modal-call-text').textContent = t.emergency999ModalCall;
    document.getElementById('emergency-999-modal-continue-text').textContent = t.emergency999ModalConfirm;
    
    // Setup modal event listeners
    document.getElementById('emergency-999-modal-call').onclick = () => {
        window.open('tel:999', '_self');
    };
    
    document.getElementById('emergency-999-modal-continue').onclick = () => {
        localStorage.setItem('emergency999Acknowledged', 'true');
        hideEmergency999Modal();
    };
    
    // Show modal for first-time visitors (only if feature enabled)
    if (config.features.emergencyBanner && !localStorage.getItem('emergency999Acknowledged')) {
        showEmergency999Modal();
    }
}

function showEmergency999Modal() {
    if (config.features.emergencyBanner) {
        document.getElementById('emergency-999-modal').classList.remove('hidden');
    }
}

function hideEmergency999Modal() {
    document.getElementById('emergency-999-modal').classList.add('hidden');
}

function updateEmergency999Language() {
    setupEmergency999Elements();
}

// Price chart toggle function
function togglePriceChart() {
    const content = document.getElementById('cost-chart-content');
    const toggleText = document.getElementById('cost-toggle-text');
    const arrow = document.getElementById('cost-arrow');
    const t = langContent[currentLanguage];
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        toggleText.textContent = t.costToggleHide;
        arrow.textContent = '▲';
        // Save preference
        localStorage.setItem('priceChartExpanded', 'true');
    } else {
        content.classList.add('hidden');
        toggleText.textContent = t.costToggleShow;
        arrow.textContent = '▼';
        // Save preference
        localStorage.setItem('priceChartExpanded', 'false');
    }
}

function initializePriceChartToggle() {
    const t = langContent[currentLanguage];
    const toggleText = document.getElementById('cost-toggle-text');
    const arrow = document.getElementById('cost-arrow');
    const content = document.getElementById('cost-chart-content');
    
    // Check saved preference (default to expanded)
    const isExpanded = localStorage.getItem('priceChartExpanded') !== 'false';
    
    if (isExpanded) {
        content.classList.remove('hidden');
        toggleText.textContent = t.costToggleHide;
        arrow.textContent = '▲';
    } else {
        content.classList.add('hidden');
        toggleText.textContent = t.costToggleShow;
        arrow.textContent = '▼';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, starting initialization...');
    console.log('langContent available:', typeof langContent !== 'undefined');
    console.log('hospitalData available:', typeof hospitalData !== 'undefined');
    
    try {
        // Initialize chart first
        console.log('Initializing chart...');
        initChart();
        
        // Set language and load content
        console.log('Setting language...');
        await setLanguage('zh');
        
        // Setup other components
        console.log('Setting up components...');
        setupFilters();
        setupAccordions();
        setupGeolocation();
        setupEmergency999Elements();
        initializePriceChartToggle();
        
        // Start waiting time updates
        console.log('Starting waiting time updates...');
        startWaitingTimeUpdates();
        
        // Initialize chart with data after language is set
        if (costChart) {
            console.log('Updating chart...');
            updateChart('consultation');
        }
        
        console.log('Initialization completed successfully!');
    } catch (error) {
        console.error('Initialization error:', error);
    }
    
    // Setup time input event listener
    const timeInput = document.getElementById('time-input');
    if (timeInput) {
        timeInput.addEventListener('change', async () => {
            updateChart('consultation');
            await renderHospitalCards();
        });
    }
});