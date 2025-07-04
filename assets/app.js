/* Main application logic for HK Emergency Services Info Website */

let currentLanguage = 'zh';
let appState = { region: 'all', sector: 'all', privateTier: 'all' };
const hospitalList = document.getElementById('hospital-list');
let costChart;

// Time-based pricing functions
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function setCurrentTime() {
    document.getElementById('time-input').value = getCurrentTime();
    updateChart('consultation');
    renderHospitalCards(); // Update hospital cards with new time-based pricing
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

function setLanguage(lang) {
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
    document.getElementById('geo-title').textContent = t.geoTitle;
    document.getElementById('geo-btn-text').textContent = t.geoBtnText;
    
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
    document.getElementById('time-label').textContent = t.timeLabel;
    document.getElementById('current-time-btn').textContent = t.currentTimeBtn;
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

    renderHospitalCards();
    updateChart(costChart.data.costType || 'consultation');
}

function getServiceType(hospital) {
    const t = langContent[currentLanguage];
    if (hospital.sector === 'public') {
        return `<span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">${t.serviceTypePublic}</span>`;
    }
    if (hospital.sector === 'private') {
        if (hospital.is24Hour) {
            if (hospital.privateTier === 'A') {
                return `<span class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">${t.serviceTypePrivateA}</span>`;
            }
            return `<span class="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">${t.serviceTypePrivateB}</span>`;
        } else {
            return `<span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">${t.serviceTypePrivateOther}</span>`;
        }
    }
    return '';
}

function createHospitalCard(h, distance = null) {
    const card = document.createElement('div');
    card.className = 'hospital-card bg-white rounded-lg shadow-md p-4 flex flex-col justify-between border border-gray-200 hover:shadow-xl hover:border-[#5F9EA0]';
    const t = langContent[currentLanguage];
    
    let feeInfo = '';
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
    
    card.innerHTML = `
        <div>
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h3 class="text-lg font-bold text-[#434242]">${currentLanguage === 'zh' ? h.name_zh : h.name_en}</h3>
                    <p class="text-sm text-gray-500 mb-2">${currentLanguage === 'zh' ? h.name_en : h.name_zh}</p>
                </div>
                ${distanceInfo}
            </div>
            <div class="mb-2">${getServiceType(h)}</div>
            <p class="text-sm text-gray-700 mb-1">📍 ${address}</p>
            <p class="text-sm text-gray-700">📞 <a href="tel:${h.phone}" class="text-blue-600 hover:underline">${h.phone}</a></p>
            <p class="text-xs text-gray-500 mt-2">${currentLanguage === 'zh' ? h.details_zh : h.details_en}</p>
            ${feeInfo}
        </div>
         <div class="mt-4">
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name_en + ' ' + h.address_en)}" target="_blank" class="w-full text-center inline-block bg-[#5F9EA0] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-opacity-90 transition">${t.mapLinkText}</a>
        </div>
    `;
    return card;
}

function renderHospitalCards() {
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

    filteredData.forEach(h => {
        hospitalList.appendChild(createHospitalCard(h));
    });
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
            
            renderHospitalCards();
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

function findNearest(sector) {
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

    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        let closestHospital = null;
        let minDistance = Infinity;

        hospitalData
            .filter(h => h.sector === sector)
            .forEach(h => {
                const distance = haversineDistance(latitude, longitude, h.lat, h.lon);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestHospital = h;
                }
            });
        
        loader.classList.add('hidden');
        const sectorName = sector === 'public' ? t.filterSectorPublic : t.filterSectorPrivate;
        if (closestHospital) {
            resultDiv.innerHTML = `<h4 class="font-bold text-lg mb-2">${t.geoResultTitle.replace('{sector}', sectorName)}</h4>`;
            resultDiv.appendChild(createHospitalCard(closestHospital, minDistance));
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
            <p class="mb-2">${t.geoChoosePrompt}</p>
            <div class="flex justify-center gap-4">
                <button onclick="findNearest('public')" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">${t.geoBtnPublic}</button>
                <button onclick="findNearest('private')" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">${t.geoBtnPrivate}</button>
            </div>
        `;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initChart();
    setLanguage('zh');
    setupFilters();
    setupAccordions();
    setupGeolocation();
});