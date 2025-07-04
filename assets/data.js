/* Hospital data for HK Emergency Services Info Website */

const hospitalData = [
    {
        id: 'pyneh', name_en: 'Pamela Youde Nethersole Eastern Hospital', name_zh: '東區尤德夫人那打素醫院', sector: 'public', region: 'HKI',
        address_zh: '香港柴灣樂民道3號', address_en: '3 Lok Man Road, Chai Wan, Hong Kong', phone: '25956111', lat: 22.2649, lon: 114.2383,
        details_zh: '24小時公立醫院急症室，由醫院管理局管理。',
        details_en: '24-hour public A&E department, managed by the Hospital Authority.'
    },
    {
        id: 'qmh', name_en: 'Queen Mary Hospital', name_zh: '瑪麗醫院', sector: 'public', region: 'HKI',
        address_zh: '香港薄扶林道102號', address_en: '102 Pok Fu Lam Road, Hong Kong', phone: '22553838', lat: 22.2710, lon: 114.1292,
        details_zh: '24小時公立醫院急症室，為港島西聯網的主要醫院及教學醫院。',
        details_en: '24-hour public A&E, the major hospital and teaching hospital for the Hong Kong West Cluster.'
    },
    {
        id: 'rhtsk', name_en: 'Ruttonjee Hospital', name_zh: '律敦治醫院', sector: 'public', region: 'HKI',
        address_zh: '香港灣仔皇后大道東266號', address_en: '266 Queen\'s Road East, Wan Chai, Hong Kong', phone: '22912000', lat: 22.2747, lon: 114.1733,
        details_zh: '24小時公立醫院急症室，服務灣仔區居民。',
        details_en: '24-hour public A&E, serving residents of Wan Chai district.'
    },
    {
        id: 'cmc', name_en: 'Caritas Medical Centre', name_zh: '明愛醫院', sector: 'public', region: 'KLN',
        address_zh: '九龍深水埗永康街111號', address_en: '111 Wing Hong Street, Sham Shui Po, Kowloon', phone: '34085678', lat: 22.3386, lon: 114.1556,
        details_zh: '24小時公立醫院急症室，服務九龍西區。',
        details_en: '24-hour public A&E, serving West Kowloon.'
    },
    {
        id: 'kwh', name_en: 'Kwong Wah Hospital', name_zh: '廣華醫院', sector: 'public', region: 'KLN',
        address_zh: '九龍油麻地窩打老道25號', address_en: '25 Waterloo Road, Yau Ma Tei, Kowloon', phone: '23322311', lat: 22.3135, lon: 114.1714,
        details_zh: '24小時公立醫院急症室，為九龍中聯網的主要醫院。',
        details_en: '24-hour public A&E, the major hospital for the Kowloon Central Cluster.'
    },
    {
        id: 'pmh', name_en: 'Princess Margaret Hospital', name_zh: '瑪嘉烈醫院', sector: 'public', region: 'KLN',
        address_zh: '九龍荔枝角瑪嘉烈醫院道2-10號', address_en: '2-10 Princess Margaret Hospital Road, Lai Chi Kok, Kowloon', phone: '29901111', lat: 22.3396, lon: 114.1396,
        details_zh: '24小時公立醫院急症室，為九龍西聯網的主要創傷中心。',
        details_en: '24-hour public A&E, the major trauma center for the Kowloon West Cluster.'
    },
    {
        id: 'qeh', name_en: 'Queen Elizabeth Hospital', name_zh: '伊利沙伯醫院', sector: 'public', region: 'KLN',
        address_zh: '九龍油麻地加士居道30號', address_en: '30 Gascoigne Road, Yau Ma Tei, Kowloon', phone: '35068888', lat: 22.3088, lon: 114.1754,
        details_zh: '24小時公立醫院急症室，是九龍區的主要三級醫院。',
        details_en: '24-hour public A&E, a major tertiary hospital in Kowloon.'
    },
    {
        id: 'uch', name_en: 'United Christian Hospital', name_zh: '基督教聯合醫院', sector: 'public', region: 'KLN',
        address_zh: '九龍觀塘協和街130號', address_en: '130 Hip Wo Street, Kwun Tong, Kowloon', phone: '23799611', lat: 22.3149, lon: 114.2259,
        details_zh: '24小時公立醫院急症室，服務九龍東區。',
        details_en: '24-hour public A&E, serving Kowloon East.'
    },
    {
        id: 'ahnh', name_en: 'Alice Ho Miu Ling Nethersole Hospital', name_zh: '雅麗氏何妙齡那打素醫院', sector: 'public', region: 'NT',
        address_zh: '新界大埔全安路11號', address_en: '11 Chuen On Road, Tai Po, New Territories', phone: '26892000', lat: 22.4556, lon: 114.1761,
        details_zh: '24小時公立醫院急症室，服務大埔區。',
        details_en: '24-hour public A&E, serving Tai Po district.'
    },
    {
        id: 'ndh', name_en: 'North District Hospital', name_zh: '北區醫院', sector: 'public', region: 'NT',
        address_zh: '新界上水保健路9號', address_en: '9 Po Kin Road, Sheung Shui, New Territories', phone: '26838888', lat: 22.5005, lon: 114.1245,
        details_zh: '24小時公立醫院急症室，服務北區。',
        details_en: '24-hour public A&E, serving the North District.'
    },
    {
        id: 'nlth', name_en: 'North Lantau Hospital', name_zh: '北大嶼山醫院', sector: 'public', region: 'NT',
        address_zh: '大嶼山東涌松仁路8號', address_en: '8 Chung Yan Road, Tung Chung, Lantau Island', phone: '34677000', lat: 22.2868, lon: 113.9422,
        details_zh: '24小時公立醫院急症室，服務東涌及大嶼山居民。',
        details_en: '24-hour public A&E, serving residents of Tung Chung and Lantau Island.'
    },
    {
        id: 'poh', name_en: 'Pok Oi Hospital', name_zh: '博愛醫院', sector: 'public', region: 'NT',
        address_zh: '新界元朗坳頭', address_en: 'Au Tau, Yuen Long, New Territories', phone: '24868000', lat: 22.4385, lon: 114.0322,
        details_zh: '24小時公立醫院急症室，服務元朗區。',
        details_en: '24-hour public A&E, serving Yuen Long district.'
    },
    {
        id: 'pwh', name_en: 'Prince of Wales Hospital', name_zh: '威爾斯親王醫院', sector: 'public', region: 'NT',
        address_zh: '新界沙田銀城街30-32號', address_en: '30-32 Ngan Shing Street, Sha Tin, New Territories', phone: '35052211', lat: 22.3794, lon: 114.2022,
        details_zh: '24小時公立醫院急症室，為新界東的主要醫院及教學醫院。',
        details_en: '24-hour public A&E, the major hospital and teaching hospital for the New Territories East Cluster.'
    },
    {
        id: 'sjh', name_en: 'St. John Hospital', name_zh: '長洲醫院', sector: 'public', region: 'NT',
        address_zh: '長洲東灣長洲醫院路', address_en: 'Cheung Chau Hospital Road, Tung Wan, Cheung Chau', phone: '29862100', lat: 22.2070, lon: 114.0310,
        details_zh: '24小時公立醫院急症室，服務長洲居民。',
        details_en: '24-hour public A&E, serving residents of Cheung Chau.'
    },
    {
        id: 'tswh', name_en: 'Tin Shui Wai Hospital', name_zh: '天水圍醫院', sector: 'public', region: 'NT',
        address_zh: '新界天水圍天壇街11號', address_en: '11 Tin Tan Street, Tin Shui Wai, New Territories', phone: '35135000', lat: 22.4646, lon: 113.9996,
        details_zh: '24小時公立醫院急症室，服務天水圍區。',
        details_en: '24-hour public A&E, serving Tin Shui Wai district.'
    },
    {
        id: 'tkoh', name_en: 'Tseung Kwan O Hospital', name_zh: '將軍澳醫院', sector: 'public', region: 'NT',
        address_zh: '將軍澳坑口寶寧里2號', address_en: '2 Po Ning Lane, Hang Hau, Tseung Kwan O, New Territories', phone: '22080111', lat: 22.3146, lon: 114.2631,
        details_zh: '24小時公立醫院急症室，服務將軍澳區。',
        details_en: '24-hour public A&E, serving Tseung Kwan O district.'
    },
    {
        id: 'tmh', name_en: 'Tuen Mun Hospital', name_zh: '屯門醫院', sector: 'public', region: 'NT',
        address_zh: '新界屯門青松觀路23號', address_en: '23 Tsing Chung Koon Road, Tuen Mun, New Territories', phone: '24685111', lat: 22.4042, lon: 113.9762,
        details_zh: '24小時公立醫院急症室，為新界西的主要創傷中心。',
        details_en: '24-hour public A&E, the major trauma center for the New Territories West Cluster.'
    },
    {
        id: 'ych', name_en: 'Yan Chai Hospital', name_zh: '仁濟醫院', sector: 'public', region: 'NT',
        address_zh: '新界荃灣仁濟街7-11號', address_en: '7-11 Yan Chai Street, Tsuen Wan, New Territories', phone: '24178383', lat: 22.3742, lon: 114.1192,
        details_zh: '24小時公立醫院急症室，服務荃灣區。',
        details_en: '24-hour public A&E, serving Tsuen Wan district.'
    },
    {
        id: 'ghk', name_en: 'Gleneagles Hospital Hong Kong', name_zh: '港怡醫院', sector: 'private', region: 'HKI', privateTier: 'A',
        address_zh: '香港黃竹坑南風徑1號', address_en: '1 Nam Fung Path, Wong Chuk Hang, Hong Kong', phone: '31539000', lat: 22.2475, lon: 114.1757,
        details_zh: '港島區唯一設有24小時急症室的私家醫院，由急症科專科醫生主理。',
        details_en: 'The only private hospital on HK Island with a 24-hour A&E, run by Emergency Medicine Specialists.',
        is24Hour: true,
        emergencyFee: 950,
        costCategory: 'high',
        timePricing: {
            day: { emergency: 950, standard: 1000, semi_private: 2200, private: 4600 },     // 08:00-17:59
            evening: { emergency: 1140, standard: 1200, semi_private: 2640, private: 5520 }, // 18:00-21:59 (+20%)
            night: { emergency: 1425, standard: 1500, semi_private: 3300, private: 6900 }   // 22:00-07:59 (+50%)
        },
        fees: { consultation: [420, 1500], standard: [1000, 1200], semi_private: [2200, 2950], private: [4600, 9800] }
    },
    {
        id: 'uh', name_en: 'Union Hospital', name_zh: '仁安醫院', sector: 'private', region: 'NT', privateTier: 'A',
        address_zh: '新界沙田大圍富健街18號', address_en: '18 Fu Kin Street, Tai Wai, Sha Tin, New Territories', phone: '26083355', lat: 22.3739, lon: 114.1862,
        details_zh: '新界區首間獲認可的私家急症科中心，由急症科專科醫生主理。設有24小時心臟病及中風急救服務。',
        details_en: 'The first recognized private Emergency Medicine Centre in NT, run by EM Specialists. Offers 24-hour cardiac and stroke rescue.',
        is24Hour: true,
        emergencyFee: 785,
        costCategory: 'medium',
        timePricing: {
            day: { emergency: 785, standard: 500, semi_private: 900, private: 2500 },      // 08:00-17:59
            evening: { emergency: 942, standard: 600, semi_private: 1080, private: 3000 }, // 18:00-21:59 (+20%)
            night: { emergency: 1178, standard: 750, semi_private: 1350, private: 3750 }   // 22:00-07:59 (+50%)
        },
        fees: { consultation: [270, 1300], standard: [500, 950], semi_private: [900, 2000], private: [2500, 8000] }
    },
    {
        id: 'cuhkmc', name_en: 'CUHK Medical Centre', name_zh: '香港中文大學醫院', sector: 'private', region: 'NT', privateTier: 'A',
        address_zh: '新界沙田澤祥街9號', address_en: '9 Chak Cheung Street, Sha Tin, New Territories', phone: '39466333', lat: 22.3888, lon: 114.2093,
        details_zh: '私家教學醫院，設有24小時急症醫學中心，由急症科專科醫生團隊主理。',
        details_en: 'A private teaching hospital with a 24-hour Emergency Medicine Centre run by a team of EM Specialists.',
        is24Hour: true,
        emergencyFee: 1350,
        costCategory: 'high',
        timePricing: {
            day: { emergency: 1350, standard: 900, semi_private: 1500, private: 3600 },      // 08:00-17:59
            evening: { emergency: 1620, standard: 1080, semi_private: 1800, private: 4320 }, // 18:00-21:59 (+20%)
            night: { emergency: 2025, standard: 1350, semi_private: 2250, private: 5400 }    // 22:00-07:59 (+50%)
        },
        fees: { consultation: [300, 2400], standard: [900, 1000], semi_private: [1500, 2500], private: [3600, 4800] }
    },
    {
        id: 'hkah_sr', name_en: 'Hong Kong Adventist Hospital – Stubbs Road', name_zh: '香港港安醫院–司徒拔道', sector: 'private', region: 'HKI', privateTier: 'B',
        address_zh: '香港跑馬地司徒拔道40號', address_en: '40 Stubbs Road, Happy Valley, Hong Kong', phone: '36518888', whatsapp: '36518808', lat: 22.2680, lon: 114.1830,
        details_zh: '設有24小時緊急護理中心，由急症科專科醫生管理，提供24小時心臟介入治療及中風治療。設有先進診斷設備包括超聲波、CT及MRI。',
        details_en: 'Features a 24-hour Urgent Care Centre managed by EM Specialists. Advanced diagnostics including ultrasound, CT, and MRI. Cardiac intervention and stroke treatment available.',
        is24Hour: true, 
        emergencyFee: 1200,
        costCategory: 'high',
        timePricing: {
            day: { emergency: 1200, standard: 900, semi_private: 2300, private: 3400 },      // 08:00-17:59
            evening: { emergency: 1440, standard: 1080, semi_private: 2760, private: 4080 }, // 18:00-21:59 (+20%)
            night: { emergency: 1800, standard: 1350, semi_private: 3450, private: 5100 }    // 22:00-07:59 (+50%)
        },
        fees: { consultation: [1200, 1200], standard: [900, 900], semi_private: [2300, 2800], private: [3400, 9000] }
    },
    {
        id: 'hkah_tw', name_en: 'Hong Kong Adventist Hospital – Tsuen Wan', name_zh: '香港港安醫院–荃灣', sector: 'private', region: 'NT', privateTier: 'B',
        address_zh: '新界荃灣荃景圍199號', address_en: '199 Tsuen King Circuit, Tsuen Wan, New Territories', phone: '22756888', lat: 22.3783, lon: 114.1083,
        details_zh: '設有24小時緊急護理中心，由急症科專科醫生駐診，為新界西區提供私家緊急服務。',
        details_en: 'Features a 24-hour Urgent Care Centre with EM Specialists on duty, providing private emergency services in NT West.',
        is24Hour: true,
        emergencyFee: 575,
        costCategory: 'medium',
        fees: { consultation: [450, 700], standard: [1000, 1000], semi_private: [1250, 1600], private: [2500, 4000] }
    },
    {
        id: 'hksh', name_en: 'Hong Kong Sanatorium & Hospital', name_zh: '養和醫院', sector: 'private', region: 'HKI', privateTier: 'B',
        address_zh: '香港跑馬地山村道2號', address_en: '2 Village Road, Happy Valley, Hong Kong', phone: '28358600', lat: 22.2700, lon: 114.1842,
        details_zh: '設有24小時家庭醫學及基層醫療中心（門診），由普通科醫生主理。',
        details_en: 'Features a 24-hour Family Medicine and Primary Care Centre (outpatient), run by general practitioners.',
        is24Hour: true,
        emergencyFee: 550,
        costCategory: 'medium',
        fees: { consultation: [400, 700], standard: [1300, 1900], semi_private: [2800, 3800], private: [4600, 6800] }
    },
    {
        id: 'hkbh', name_en: 'Hong Kong Baptist Hospital', name_zh: '香港浸信會醫院', sector: 'private', region: 'KLN', privateTier: 'B',
        address_zh: '九龍九龍塘窩打老道222號', address_en: '222 Waterloo Road, Kowloon Tong, Kowloon', phone: '23398941', lat: 22.3292, lon: 114.1782,
        details_zh: '設有24小時門診中心，由普通科醫生及駐院醫生主理。',
        details_en: 'Features a 24-hour Out-patient Centre, run by general practitioners and resident doctors.',
        is24Hour: true,
        emergencyFee: 625,
        costCategory: 'medium',
        fees: { consultation: [350, 900], standard: [850, 1020], semi_private: [1900, 2320], private: [3800, 4680] }
    },
    {
        id: 'sph', name_en: 'St. Paul\'s Hospital', name_zh: '聖保祿醫院', sector: 'private', region: 'HKI', privateTier: 'B',
        address_zh: '香港銅鑼灣東院道2號', address_en: '2 Eastern Hospital Road, Causeway Bay, Hong Kong', phone: '28308774', lat: 22.2783, lon: 114.1863,
        details_zh: '設有24小時普通科門診，院方明確指出此非急症服務。危重病人會被轉介至公立醫院。',
        details_en: 'Features a 24-hour General Outpatient Clinic. The hospital states this is not an A&E service. Critical patients will be transferred to public hospitals.',
        is24Hour: true,
        emergencyFee: 375,
        costCategory: 'low',
        fees: { consultation: [280, 470], standard: [760, 900], semi_private: [1380, 1480], private: [3800, 6800] }
    },
    {
        id: 'sth', name_en: 'St. Teresa\'s Hospital', name_zh: '聖德肋撒醫院', sector: 'private', region: 'KLN', privateTier: 'B',
        address_zh: '九龍太子道327號', address_en: '327 Prince Edward Road, Kowloon', phone: '22003102', lat: 22.3248, lon: 114.1828,
        details_zh: '設有24小時門診服務，由普通科醫生及駐院醫生主理。',
        details_en: 'Features a 24-hour Outpatient Service, run by general practitioners and resident doctors.',
        is24Hour: true,
        emergencyFee: 275,
        costCategory: 'low',
        fees: { consultation: [180, 370], standard: [560, 750], semi_private: [850, 1600], private: [1900, 14800] }
    },
    {
        id: 'ch', name_en: 'Canossa Hospital (Caritas)', name_zh: '嘉諾撒醫院', sector: 'private', region: 'HKI', privateTier: 'B',
        address_zh: '香港半山舊山頂道1號', address_en: '1 Old Peak Road, Mid-Levels, Hong Kong', phone: '28255805', lat: 22.2755, lon: 114.1555,
        details_zh: '設有24小時門診服務，由駐院醫生主理。危重病人會被轉介至公立醫院。',
        details_en: 'Features a 24-hour Outpatient Service, run by resident doctors. Critical patients will be transferred to public hospitals.',
        is24Hour: true,
        emergencyFee: 544,
        costCategory: 'medium',
        fees: { consultation: [388, 700], standard: [800, 1100], semi_private: [2600, 2600], private: [4200, 10300] }
    },
    {
        id: 'mih', name_en: 'Matilda International Hospital', name_zh: '明德國際醫院', sector: 'private', region: 'HKI', privateTier: 'B',
        address_zh: '香港山頂加列山道41號', address_en: '41 Mount Kellett Road, The Peak, Hong Kong', phone: '28491500', lat: 22.2678, lon: 114.1458,
        details_zh: '設有24小時門診服務，處理各種急症。院方建議遇上危急情況應致電999。',
        details_en: 'Features a 24-hour Outpatient Service for various urgent conditions. The hospital advises calling 999 for emergencies.',
        is24Hour: true,
        emergencyFee: 695,
        costCategory: 'medium',
        fees: { consultation: [590, 800], standard: [900, 900], semi_private: [1990, 1990], private: [3300, 3300] }
    },
    {
        id: 'pbh', name_en: 'Precious Blood Hospital (Caritas)', name_zh: '寶血醫院（明愛）', sector: 'private', region: 'KLN',
        address_zh: '九龍深水埗青山道113號', address_en: '113 Castle Peak Road, Sham Shui Po, Kowloon', phone: '39719900', lat: 22.3325, lon: 114.1623,
        details_zh: '提供普通科及專科門診服務。此非24小時服務。',
        details_en: 'Provides general and specialist outpatient services. This is not a 24-hour service.',
        is24Hour: false, fees: { consultation: [null, null], standard: [850, 850], semi_private: [1180, 1580], private: [2100, 2100] }
    },
    {
        id: 'eh', name_en: 'Evangel Hospital', name_zh: '播道醫院', sector: 'private', region: 'KLN',
        address_zh: '九龍九龍城亞皆老街222號', address_en: '222 Argyle Street, Kowloon City, Kowloon', phone: '27115221', lat: 22.3276, lon: 114.1848,
        details_zh: '普通門診服務時間為每日早上7時至晚上9時。此非24小時急症服務。',
        details_en: 'General outpatient clinic service hours are 7:00 am to 9:00 pm daily. This is not a 24-hour A&E service.',
        is24Hour: false, fees: { consultation: [285, 395], standard: [790, 950], semi_private: [1200, 1800], private: [2200, 2200] }
    }
];