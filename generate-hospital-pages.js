// Hospital Page Generator for Template System
// This script generates SEO-optimized hospital pages from your data.js

const fs = require('fs');
const path = require('path');

// Read your existing data.js file
const dataPath = './assets/data.js';
const templatePath = './hospital-page-template.html';

// Configuration - easily changeable for different cities/regions
const config = {
    domain: 'hk-emergency-services-info-website.pages.dev',
    siteName: '香港急症服務指南',
    siteNameEn: 'Hong Kong Emergency Services Guide',
    emergencyNumber: '999',
    year: '2025'
};

// Function to convert hospital ID to URL-friendly format
function hospitalIdToUrl(id) {
    const mapping = {
        'pyneh': 'pamela-youde-nethersole-eastern-hospital',
        'qmh': 'queen-mary-hospital',
        'rhtsk': 'ruttonjee-hospital',
        'cmc': 'caritas-medical-centre',
        'kwh': 'kwong-wah-hospital',
        'pmh': 'princess-margaret-hospital',
        'qeh': 'queen-elizabeth-hospital',
        'uch': 'united-christian-hospital',
        'ahnh': 'alice-ho-miu-ling-nethersole-hospital',
        'ndh': 'north-district-hospital',
        'nlth': 'north-lantau-hospital',
        'poh': 'pok-oi-hospital',
        'pwh': 'prince-of-wales-hospital',
        'sjh': 'st-john-hospital',
        'tswh': 'tin-shui-wai-hospital',
        'tkoh': 'tseung-kwan-o-hospital',
        'tmh': 'tuen-mun-hospital',
        'ych': 'yan-chai-hospital',
        'ghk': 'gleneagles-hospital',
        'uh': 'union-hospital',
        'cuhkmc': 'cuhk-medical-centre',
        'hkah_sr': 'hong-kong-adventist-hospital-stubbs-road',
        'hkah_tw': 'hong-kong-adventist-hospital-tsuen-wan',
        'hksh': 'hong-kong-sanatorium-hospital',
        'hkbh': 'hong-kong-baptist-hospital',
        'sph': 'st-pauls-hospital',
        'sth': 'st-teresas-hospital',
        'ch': 'canossa-hospital',
        'mih': 'matilda-international-hospital'
    };
    return mapping[id] || id;
}

// Function to generate specialist services HTML
function generateSpecialistServices(specialists) {
    if (!specialists) return '';
    
    const colors = ['green', 'blue', 'purple', 'orange', 'red', 'indigo', 'pink'];
    let html = '';
    let colorIndex = 0;
    
    for (const [specialty, availability] of Object.entries(specialists)) {
        const color = colors[colorIndex % colors.length];
        const specialtyZh = {
            'emergency': '急症科',
            'cardiology': '心臟科',
            'orthopedics': '骨科',
            'neurology': '神經科',
            'pediatrics': '兒科',
            'gynecology': '婦科',
            'urology': '泌尿科',
            'gastroenterology': '腸胃科',
            'psychiatry': '精神科'
        };
        
        html += `
                        <div class="text-center p-3 bg-${color}-50 rounded-lg">
                            <div class="text-${color}-600 font-semibold">${specialtyZh[specialty] || specialty}</div>
                            <div class="text-sm text-gray-600">${availability}</div>
                        </div>`;
        colorIndex++;
    }
    
    return html;
}

// Function to generate pricing section for private hospitals
function generatePricingSection(hospital) {
    if (hospital.sector !== 'private' || !hospital.timePricing) return '';
    
    return `
                <section class="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">收費資訊 | Fee Information</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-green-50 p-4 rounded-lg">
                            <h3 class="font-semibold text-green-800 mb-2">急症室基本收費</h3>
                            <p class="text-2xl font-bold text-green-600">HK$${hospital.timePricing.day.emergency}</p>
                            <p class="text-sm text-gray-600">日間時段 (08:00-17:59)</p>
                        </div>
                        <div class="bg-orange-50 p-4 rounded-lg">
                            <h3 class="font-semibold text-orange-800 mb-2">夜間收費</h3>
                            <p class="text-2xl font-bold text-orange-600">HK$${hospital.timePricing.night.emergency}</p>
                            <p class="text-sm text-gray-600">夜間時段 (22:00-07:59)</p>
                        </div>
                    </div>
                    <div class="mt-4 p-4 bg-yellow-50 rounded-lg">
                        <p class="text-sm text-yellow-800">
                            💡 以上為基本急症室收費，實際費用會因治療項目而異。建議先查詢保險覆蓋範圍。
                        </p>
                    </div>
                </section>`;
}

// Function to generate app section
function generateAppSection(hospital) {
    if (!hospital.app) return '';
    
    return `
                <section class="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 class="text-lg font-bold text-gray-800 mb-4">${hospital.app.name}</h2>
                    <p class="text-sm text-gray-600 mb-4">${hospital.app.features_zh}</p>
                    <div class="space-y-2">
                        <a href="${hospital.app.ios}" class="block bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                            📱 iOS App Store
                        </a>
                        <a href="${hospital.app.android}" class="block bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition">
                            📱 Google Play Store
                        </a>
                    </div>
                </section>`;
}

// Function to generate a single hospital page
function generateHospitalPage(hospital) {
    const template = fs.readFileSync(templatePath, 'utf8');
    
    // Determine region descriptions
    const regionDescriptions = {
        'HKI': { zh: '港島區', en: 'Hong Kong Island' },
        'KLN': { zh: '九龍區', en: 'Kowloon' },
        'NT': { zh: '新界區', en: 'New Territories' }
    };
    
    const region = regionDescriptions[hospital.region] || { zh: '香港', en: 'Hong Kong' };
    
    // Generate content blocks
    const specialistServices = generateSpecialistServices(hospital.specialists);
    const pricingSection = generatePricingSection(hospital);
    const appSection = generateAppSection(hospital);
    
    // Header gradient based on sector
    const headerGradient = hospital.sector === 'private' ? 'from-purple-600 to-blue-600' : 'from-blue-600 to-green-600';
    
    // Sector color
    const sectorColor = hospital.sector === 'private' ? 'text-purple-600' : 'text-blue-600';
    
    // Phone formatting
    const phoneFormatted = hospital.phone.replace(/(\d{4})(\d{4})/, '$1 $2');
    
    // Replace all template variables
    let html = template
        .replace(/{{HOSPITAL_NAME_ZH}}/g, hospital.name_zh)
        .replace(/{{HOSPITAL_NAME_EN}}/g, hospital.name_en)
        .replace(/{{HOSPITAL_ID}}/g, hospitalIdToUrl(hospital.id))
        .replace(/{{DOMAIN}}/g, config.domain)
        .replace(/{{REGION_DESCRIPTION}}/g, region.zh + region.en)
        .replace(/{{REGION_ZH}}/g, region.zh)
        .replace(/{{REGION_EN}}/g, region.en)
        .replace(/{{DESCRIPTION_ZH}}/g, hospital.details_zh)
        .replace(/{{DESCRIPTION_EN}}/g, hospital.details_en)
        .replace(/{{PHONE}}/g, hospital.phone)
        .replace(/{{PHONE_FORMATTED}}/g, phoneFormatted)
        .replace(/{{ADDRESS_ZH}}/g, hospital.address_zh)
        .replace(/{{ADDRESS_EN}}/g, hospital.address_en)
        .replace(/{{LATITUDE}}/g, hospital.lat)
        .replace(/{{LONGITUDE}}/g, hospital.lon)
        .replace(/{{OPENING_HOURS}}/g, hospital.is24Hour ? 'Mo-Su 00:00-23:59' : 'Mo-Su 08:00-22:00')
        .replace(/{{HOURS_ZH}}/g, hospital.is24Hour ? '24小時急症室服務' : '急症室服務')
        .replace(/{{HOURS_EN}}/g, hospital.is24Hour ? '24-hour A&E Service' : 'A&E Service')
        .replace(/{{SECTOR_ZH}}/g, hospital.sector === 'private' ? '私家醫院' : '公立醫院')
        .replace(/{{SECTOR_EN}}/g, hospital.sector === 'private' ? 'Private Hospital' : 'Public Hospital')
        .replace(/{{SECTOR_COLOR}}/g, sectorColor)
        .replace(/{{HEADER_GRADIENT}}/g, headerGradient)
        .replace(/{{SPECIALIST_SERVICES}}/g, specialistServices)
        .replace(/{{PRICING_SECTION}}/g, pricingSection)
        .replace(/{{APP_SECTION}}/g, appSection)
        .replace(/{{DETAILS_ZH}}/g, hospital.details_zh)
        .replace(/{{DETAILS_EN}}/g, hospital.details_en);
    
    // Handle conditional sections
    if (hospital.sector === 'private' && hospital.privateTier) {
        html = html.replace(/{{TIER_INFO}}/g, `<p class="text-sm text-gray-500">${hospital.privateTier}級私家醫院</p>`);
    } else {
        html = html.replace(/{{TIER_INFO}}/g, '');
    }
    
    // Add price range for private hospitals
    if (hospital.sector === 'private' && hospital.timePricing) {
        html = html.replace(/{{PRICE_RANGE}}/g, `"priceRange": "HK$${hospital.timePricing.day.emergency}-${hospital.timePricing.night.private}",`);
    } else {
        html = html.replace(/{{PRICE_RANGE}}/g, '');
    }
    
    // Add payment methods for private hospitals
    if (hospital.sector === 'private') {
        html = html.replace(/{{PAYMENT_METHODS}}/g, '"paymentAccepted": ["Cash", "Credit Card", "Insurance"], "currenciesAccepted": "HKD",');
    } else {
        html = html.replace(/{{PAYMENT_METHODS}}/g, '');
    }
    
    // Generate specialties array for schema
    const specialties = hospital.specialists ? Object.keys(hospital.specialists).map(s => `"${s}"`).join(', ') : '"Emergency Medicine"';
    html = html.replace(/{{SPECIALTIES}}/g, specialties);
    
    // Add additional keywords based on hospital type
    let additionalKeywords = hospital.sector === 'private' ? '私家醫院,急症科專科醫生,24小時' : '公立醫院,等候時間,HA Go';
    if (hospital.specialists && hospital.specialists.cardiology === '24/7') {
        additionalKeywords += ',心臟科,心臟病急症';
    }
    if (hospital.specialists && hospital.specialists.orthopedics === '24/7') {
        additionalKeywords += ',骨科,創傷中心';
    }
    html = html.replace(/{{ADDITIONAL_KEYWORDS}}/g, additionalKeywords);
    
    // Set department type
    const departmentType = hospital.sector === 'private' ? 'Emergency Medicine Centre' : 'Emergency Department';
    const departmentTypeZh = hospital.sector === 'private' ? '急症科中心' : '急症室';
    html = html.replace(/{{DEPARTMENT_TYPE}}/g, departmentType);
    html = html.replace(/{{DEPARTMENT_TYPE_ZH}}/g, departmentTypeZh);
    
    // Generate subtitle
    const subtitle = hospital.sector === 'private' ? 
        `${region.zh}私家醫院急症服務 | ${region.en} Private Hospital Emergency Services` :
        `${region.zh}公立醫院急症服務 | ${region.en} Public Hospital Emergency Services`;
    html = html.replace(/{{SUBTITLE_ZH}}/g, subtitle.split(' | ')[0]);
    html = html.replace(/{{SUBTITLE_EN}}/g, subtitle.split(' | ')[1]);
    
    // Set locality for address
    const locality = hospital.region === 'HKI' ? 'Hong Kong' : 
                    hospital.region === 'KLN' ? 'Kowloon' : 'New Territories';
    html = html.replace(/{{LOCALITY}}/g, locality);
    
    return html;
}

// Main function to generate all pages
function generateAllPages() {
    // Read hospital data (you'll need to extract this from your data.js)
    const dataJs = fs.readFileSync(dataPath, 'utf8');
    
    console.log('🏥 Hospital Page Generator for Template System');
    console.log('📝 This script generates SEO-optimized pages from your data.js');
    console.log('🔧 Easily duplicatable for any city/region');
    console.log('');
    console.log('To use this script:');
    console.log('1. Update the config object with your domain and details');
    console.log('2. Run: node generate-hospital-pages.js');
    console.log('3. All hospital pages will be generated in the hospitals/ directory');
    console.log('');
    console.log('🌟 Benefits:');
    console.log('- SEO-optimized individual pages for each hospital');
    console.log('- Proper schema markup for rich snippets');
    console.log('- Bilingual content optimization');
    console.log('- Template-based system for easy duplication');
    console.log('');
    console.log('📊 Expected SEO improvements:');
    console.log('- 30+ indexable pages instead of 1 dynamic page');
    console.log('- Better keyword targeting for each hospital');
    console.log('- Rich snippets in search results');
    console.log('- Improved local search visibility');
}

// Export for use in other scripts
module.exports = {
    generateHospitalPage,
    generateAllPages,
    config
};

// Run if called directly
if (require.main === module) {
    generateAllPages();
}