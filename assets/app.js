/* Main application logic for HK Emergency Services Info Website */

let currentLanguage = 'zh';
let appState = { region: 'all', sector: 'all', privateTier: 'all' };
const hospitalList = document.getElementById('hospital-list');
let costChart;

// Waiting time cache and management
let waitingTimeCache = {
    data: null,
    lastUpdated: null,
    isLoading: false
};

// Hospital name mapping for API matching
const hospitalNameMapping = {
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
};

// Waiting time functions
async function fetchWaitingTimes() {
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
        
        waitingTimeCache.data = waitingTimes;
        waitingTimeCache.lastUpdated = now;
        waitingTimeCache.isLoading = false;
        
        console.log('Updated waiting times:', waitingTimes);
        return waitingTimes;
        
    } catch (error) {
        console.error('Failed to fetch waiting times:', error);
        waitingTimeCache.isLoading = false;
        return waitingTimeCache.data || {};
    }
}

function getWaitingTimeColor(waitTime) {
    if (!waitTime) return '#6B7280'; // Gray for no data
    
    switch(waitTime) {
        case 'Around 1 hour':
            return '#10B981'; // Green
        case 'Over 1 hour':
            return '#F59E0B'; // Yellow/Orange
        case 'Over 2 hours':
            return '#EF4444'; // Red
        default:
            return '#6B7280'; // Gray
    }
}

function getWaitingTimeLevel(waitTime) {
    if (!waitTime) return 3;
    
    switch(waitTime) {
        case 'Around 1 hour': return 1;
        case 'Over 1 hour': return 2; 
        case 'Over 2 hours': return 3;
        default: return 3;
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

    document.getElementById('main-title').textContent = t.mainTitle;
    document.getElementById('sub-title').textContent = t.subTitle;
    document.getElementById('critical-title').textContent = t.criticalTitle;
    document.getElementById('critical-desc').textContent = t.criticalDesc;
    document.getElementById('call-999-btn').textContent = t.call999Btn;
    document.getElementById('finder-title').textContent = t.finderTitle;
    document.getElementById('finder-desc').textContent = t.finderDesc;
    document.getElementById('browser-title').textContent = t.browserTitle;
    document.getElementById('browser-desc').textContent = t.browserDesc;
    document.getElementById('geo-title').textContent = t.geoTitle;
    document.getElementById('geo-btn-text').textContent = t.geoBtnText;
    
    document.getElementById('waiting-legend-title').textContent = t.waitingLegendTitle;
    document.getElementById('legend-fast').textContent = t.legendFast;
    document.getElementById('legend-medium').textContent = t.legendMedium;
    document.getElementById('legend-slow').textContent = t.legendSlow;
    document.getElementById('legend-private').textContent = t.legendPrivate;
    document.getElementById('legend-update-info').textContent = t.legendUpdateInfo;
    
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

    document.getElementById('cost-title').textContent = t.costTitle;
    document.getElementById('cost-desc').textContent = t.costDesc;
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
    document.getElementById('faq1-q').textContent = t.faq1_q;
    document.getElementById('faq1-a').innerHTML = t.faq1_a;
    document.getElementById('faq2-q').textContent = t.faq2_q;
    document.getElementById('faq2-a').innerHTML = t.faq2_a;
    document.getElementById('faq3-q').textContent = t.faq3_q;
    document.getElementById('faq3-a').innerHTML = t.faq3_a;

    document.getElementById('footer-text').textContent = t.footerText;
    document.getElementById('feedback-text').innerHTML = t.feedbackText;
    
    document.getElementById('nearest-hospital-result').innerHTML = '';
    document.getElementById('geo-error').textContent = '';

    // Initialize time input with current time if empty
    const timeInput = document.getElementById('time-input');
    if (!timeInput.value) {
        timeInput.value = getCurrentTime();
    }

    await renderHospitalCards();
    updateChart(costChart.data.costType || 'consultation');
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
                waitingTag = `<span class="text-xs font-medium px-2.5 py-0.5 rounded-full mr-2" style="background-color: ${color}20; color: ${color};">${formattedTime}</span>`;
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
    card.className = 'hospital-card bg-white rounded-lg shadow-md p-4 flex flex-col justify-between border border-gray-200 hover:shadow-xl hover:border-[#5F9EA0]';
    const t = langContent[currentLanguage];
    
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
            <div class="text-xs mt-2 p-2 bg-gray-50 rounded">
                <p class="font-bold ${priceColor}">${currentLanguage === 'zh' ? '急症收費' : 'Emergency Fee'} (${periodLabel}): HK$${currentPrice}</p>
                <p class="text-gray-500 text-xs">${priceLevel}</p>
            </div>
        `;
    } else if (h.sector === 'public') {
        // Add waiting time info for public hospitals
        const waitingTimes = await fetchWaitingTimes();
        const waitTime = waitingTimes[h.id]?.waitTime;
        const updateTime = waitingTimes[h.id]?.updateTime;
        
        if (waitTime) {
            const color = getWaitingTimeColor(waitTime);
            const formattedTime = formatWaitingTime(waitTime, currentLanguage);
            waitingTimeInfo = `
                <div class="text-xs mt-2 p-2 rounded border-l-4" style="border-color: ${color}; background-color: ${color}10;">
                    <p class="font-bold" style="color: ${color};">${currentLanguage === 'zh' ? '等候時間' : 'Waiting Time'}: ${formattedTime}</p>
                    ${updateTime ? `<p class="text-gray-500 text-xs">${currentLanguage === 'zh' ? '更新時間' : 'Updated'}: ${updateTime}</p>` : ''}
                </div>
            `;
        }
        
        feeInfo = `
            <div class="text-xs mt-2 p-2 bg-blue-50 rounded">
                <p class="font-bold text-blue-600">${currentLanguage === 'zh' ? '急症收費' : 'Emergency Fee'}: HK$180</p>
                <p class="text-gray-500 text-xs">(${currentLanguage === 'zh' ? '合資格人士' : 'Eligible Persons'})</p>
            </div>
        `;
    } else if (h.sector === 'private' && !h.is24Hour) {
        feeInfo = `
            <div class="text-xs mt-2 p-2 bg-gray-50 rounded">
                <p class="text-gray-500">${currentLanguage === 'zh' ? '非24小時服務' : 'Not 24-hour service'}</p>
            </div>
        `;
    }

    const distanceInfo = distance !== null ? `<p class="font-bold text-indigo-600">${t.distancePrefix} ${distance.toFixed(2)} ${t.distanceSuffix}</p>` : '';
    const address = currentLanguage === 'zh' ? h.address_zh : h.address_en;
    
    // App download section for hospitals with apps
    let appSection = '';
    if (h.app) {
        appSection = `
            <div class="mt-3 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <p class="text-xs font-semibold text-purple-700 mb-2">📱 ${currentLanguage === 'zh' ? '快速排隊應用程式' : 'Quick Queue App'}</p>
                <p class="text-xs text-gray-600 mb-2">${currentLanguage === 'zh' ? h.app.features_zh : h.app.features_en}</p>
                <div class="flex gap-2 justify-center">
                    ${h.app.ios ? `<a href="${h.app.ios}" target="_blank" class="bg-black text-white px-2 py-1 rounded text-xs hover:bg-gray-800 transition flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                        iOS
                    </a>` : ''}
                    ${h.app.android ? `<a href="${h.app.android}" target="_blank" class="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1518-.5972.416.416 0 00-.5972.1518l-2.0223 3.5046C15.5889 8.6039 13.8952 8.2652 12 8.2652s-3.5889.3387-5.1851.7897L4.7926 5.4503a.4161.4161 0 00-.5972-.1518.4161.4161 0 00-.1518.5972L6.0409 9.3214C2.9847 10.8064.9999 13.6829.9999 17.0015c0 .5557.4477 1.0034 1.0034 1.0034h19.9932c.5557 0 1.0034-.4477 1.0034-1.0034 0-3.3186-1.9848-6.1951-5.0409-7.6801"/>
                        </svg>
                        Android
                    </a>` : ''}
                </div>
            </div>
        `;
    }

    card.innerHTML = `
        <div class="text-center relative">
            ${distance !== null ? `<div class="absolute top-0 right-0"><p class="font-bold text-indigo-600 text-sm">${t.distancePrefix} ${distance.toFixed(2)} ${t.distanceSuffix}</p></div>` : ''}
            
            <h3 class="text-lg font-bold text-[#434242] mb-1">${currentLanguage === 'zh' ? h.name_zh : h.name_en}</h3>
            <p class="text-sm text-gray-500 mb-2">${currentLanguage === 'zh' ? h.name_en : h.name_zh}</p>
            
            <div class="mb-3">${serviceTypeHTML}</div>
            
            <p class="text-sm text-gray-700 mb-1">📍 ${address}</p>
            <p class="text-sm text-gray-700 mb-2">📞 <a href="tel:${h.phone}" class="text-blue-600 hover:underline">${h.phone}</a></p>
            <p class="text-xs text-gray-500 mb-3">${currentLanguage === 'zh' ? h.details_zh : h.details_en}</p>
            
            ${waitingTimeInfo}
            ${feeInfo}
            ${appSection}
            
            <div class="mt-4">
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name_en + ' ' + h.address_en)}" target="_blank" class="w-full text-center inline-block bg-[#5F9EA0] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-opacity-90 transition">${t.mapLinkText}</a>
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
        
        if (appState.sector === 'private') {
            const tierMatch = appState.privateTier === 'all' || (h.is24Hour && h.privateTier === appState.privateTier);
            return regionMatch && sectorMatch && (appState.privateTier === 'all' ? true : tierMatch);
        }
        return regionMatch && sectorMatch;
    });

    if (filteredData.length === 0) {
        hospitalList.innerHTML = `<p class="col-span-full text-center text-gray-500">${langContent[currentLanguage].noResults}</p>`;
        return;
    }

    // Create cards one by one to avoid blocking
    for (const h of filteredData) {
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
    card.className = 'hospital-card bg-white rounded-lg shadow-md p-4 flex flex-col justify-between border border-gray-200 hover:shadow-xl hover:border-[#5F9EA0]';
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
                <p class="font-bold text-blue-600">${currentLanguage === 'zh' ? '急症收費' : 'Emergency Fee'}: HK$180</p>
                <p class="text-gray-500 text-xs">(${currentLanguage === 'zh' ? '合資格人士' : 'Eligible Persons'})</p>
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

function setupGeolocation() {
    const findBtn = document.getElementById('find-nearest-btn');
    const resultDiv = document.getElementById('nearest-hospital-result');
    
    findBtn.addEventListener('click', () => {
        const t = langContent[currentLanguage];
        resultDiv.innerHTML = `
            <p class="mb-3 font-semibold">${t.geoChoosePrompt}</p>
            <div class="space-y-3">
                <div class="text-center">
                    <p class="text-sm text-gray-600 mb-2">${currentLanguage === 'zh' ? '公立醫院選項' : 'Public Hospital Options'}</p>
                    <div class="flex justify-center gap-2 flex-wrap">
                        <button onclick="findNearest('public', 'distance')" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded text-sm">
                            ${currentLanguage === 'zh' ? '最近距離' : 'Closest Distance'}
                        </button>
                        <button onclick="findNearest('public', 'waiting')" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded text-sm">
                            ${currentLanguage === 'zh' ? '最短等候' : 'Shortest Wait'}
                        </button>
                    </div>
                </div>
                <div class="text-center">
                    <p class="text-sm text-gray-600 mb-2">${currentLanguage === 'zh' ? '私家醫院' : 'Private Hospitals'}</p>
                    <button onclick="findNearest('private', 'distance')" class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">
                        ${currentLanguage === 'zh' ? '最近的私家醫院' : 'Nearest Private'}
                    </button>
                </div>
            </div>
        `;
    });
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

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize chart first
    initChart();
    
    // Set language and load content
    await setLanguage('zh');
    
    // Setup other components
    setupFilters();
    setupAccordions();
    setupGeolocation();
    
    // Start waiting time updates
    startWaitingTimeUpdates();
    
    // Initialize chart with data after language is set
    if (costChart) {
        updateChart('consultation');
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