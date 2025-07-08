/* Language content for HK Emergency Services Info Website */

const langContent = {
    zh: {
        mainTitle: "香港次緊急及非緊急急症服務指南",
        subTitle: "即時查看急症室等候時間、收費比較及最近醫院位置",
        finderTitle: "尋找最近醫院",
        finderDesc: "使用GPS定位功能快速找到最近的醫院，支援按距離或等候時間篩選。",
        browserTitle: "瀏覽所有醫院",
        browserDesc: "瀏覽完整醫院清單，使用篩選器找出最適合您需求的醫院。",
        geoTitle: "尋找最近的醫院",
        geoBtnText: "啟動定位尋找",
        filterRegionLabel: "地區:",
        filterRegionAll: "全部",
        filterRegionHki: "港島",
        filterRegionKln: "九龍",
        filterRegionNt: "新界及離島",
        filterSectorLabel: "類別:",
        filterSectorAll: "全部",
        filterSectorPublic: "公立醫院",
        filterSectorPrivate: "私家醫院",
        filterTierLabel: "私家服務級別:",
        filterTierAll: "全部",
        filterTierA: "持牌急症中心",
        filterTierB: "24小時門診",
        noResults: "沒有符合篩選條件的醫院。",
        costTitle: "私家醫院急症收費比較",
        costDesc: "輸入時間查看該時段的收費，按價格由低至高排序。",
        insuranceReminder: "💡 提醒：如有醫療保險，請先確認每日房間津貼上限",
        costToggleShow: "顯示價格比較",
        costToggleHide: "隱藏價格比較",
        timeSectionTitle: "⏰ 時間相關收費",
        timeLabel: "查詢時間:",
        currentTimeBtn: "現在時間",
        currentTimeBtnText: "現在時間",
        timeHelperText: "私家醫院在不同時段收費不同。公立醫院顯示實時等候時間。",
        costCompareLabel: "顯示:",
        costBtnConsult: "急症收費",
        costBtnStandard: "普通房",
        costBtnSemi: "半私家房",
        costBtnPrivate: "私家房",
        faqTitle: "重要資訊及常見問題",
        feeEligible: "身份證持有人",
        feeOthers: "非身份證持有人",
        faq0_q: "誰符合急症室$180收費？",
        faq0_a: "<p><strong>符合$180收費：</strong>持有香港身份證人士（包括永久居民）</p><p class=\"mt-2\"><strong>需付$1,230：</strong>非香港身份證持有人（包括遊客、內地居民等）</p><p class=\"mt-2\">注意：2026年將實施新收費制度，危急病人免費，非緊急病人收費將提高至$300-400。</p>",
        faq1_q: "什麼是「分流」制度？",
        faq1_a: "<p>所有公立醫院急症室及部分私家醫院都採用分流制度，由資深護士根據病人的病情、維生指數等臨床數據，將病人分為危殆、危急、緊急、次緊急和非緊急五個類別。這個制度確保最危重的病人能優先獲得治療，而非按先到先得的次序。因此，次緊急和非緊急的病人等候時間可能會較長。</p>",
        faq2_q: "公立與私家急症服務的主要分別？",
        faq2_a: "<p><strong>公立醫院:</strong> 提供全面、收費低廉 (合資格人士$180) 的服務，是處理嚴重創傷和複雜病症的核心。缺點是需求極大，非緊急個案輪候時間長。</p><p class=\"mt-2\"><strong>私家醫院:</strong> 提供更快捷、舒適的服務，但費用高昂。私家服務分為兩種：<br><strong class=\"text-black\">1. 持牌急症/急症科中心:</strong> 由急症科專科醫生主理，設備較齊全，能處理較嚴重的緊急狀況。<br><strong class=\"text-black\">2. 24小時門診:</strong> 由普通科或駐院醫生主理，適合處理一般急症，但遇上危重病人時，主要作初步穩定處理，然後轉送公立醫院。</p><p class=\"mt-2\"><strong>關鍵：</strong>選擇私家服務時，必須分清是「急症中心」還是「24小時門診」，以免在危急關頭延誤治療。</p>",
        faq3_q: "私家醫院的費用是怎樣計算的？",
        faq3_a: "<p>私家醫院的收費遠比您看到的「診金」複雜。總費用通常包括：</p><ul class=\"list-disc list-inside mt-2\"><li>醫生診金</li><li>藥物費</li><li>化驗及影像診斷費 (如X光、CT掃描)</li><li>醫療物料及儀器使用費</li><li>任何治療或手術程序的費用</li></ul><p class=\"mt-2\">最終賬單金額可能是診金的數倍甚至數十倍。如有醫療保險，建議先了解保障範圍，但緊急情況下通常需要先付款，後向保險公司索償。</p>",
        footerText: "此應用程式根據公開資料整理，所有資訊僅供參考，並非醫療建議。如有疑問，請諮詢醫生。",
        feedbackText: '如有資料更新，請<a href="mailto:ymy.theresa@gmail.com" class="underline hover:text-blue-600">電郵我們</a>。',
        geoErrorBrowser: "您的瀏覽器不支援定位功能。",
        geoErrorPermission: "無法獲取您的位置。請檢查您的定位服務設定並授權此網站使用。",
        waitingLegendTitle: "🕐 公立醫院等候時間指南",
        legendFast: "約1小時 (較快)",
        legendMedium: "超過1小時 (中等)",
        legendSlow: "超過2小時 (較慢)",
        legendPrivate: "私家醫院 (致電查詢)",
        legendUpdateInfo: "等候時間每15分鐘更新一次，本網站每分鐘自動刷新",
        sortedByWaitingTime: "醫院按等候時間排序（公立醫院按等候時間，私家醫院按收費）",
        gpsButtonText: "使用目前位置",
        addressButtonText: "輸入地址",
        useLocationText: "啟動定位尋找",
        addressPlaceholder: "輸入香港地址，例如：中環、銅鑼灣、旺角",
        searchButtonText: "搜尋",
        addressHelperText: "輸入香港任何地區、街道名稱或地標",
        publicOptionsLabel: "公立醫院選項",
        privateOptionsLabel: "私家醫院",
        closestDistanceText: "最近距離",
        shortestWaitText: "最短等候",
        nearestPrivateText: "最近的私家醫院",
        geoChoosePrompt: "選擇醫院類型：",
        geoBtnPublic: "最近的公立醫院",
        geoBtnPrivate: "最近的私家醫院",
        geoResultTitle: "最近的{sector}醫院是：",
        geoNoResult: "找不到附近的{sector}醫院。",
        serviceTypePublic: "公立急症室",
        serviceTypePrivateA: "私家急症中心",
        serviceTypePrivateB: "24小時門診",
        serviceTypePrivateOther: "門診服務",
        feeConsultation: "診金:",
        feeStandardRoom: "普通房:",
        feeFrom: "起",
        distancePrefix: "距離約",
        distanceSuffix: "公里",
        mapLinkText: "地圖及導航",
        chartLabelMinConsult: "最低診金 (HK$)",
        chartLabelMaxConsult: "最高診金 (HK$)",
        chartLabelMinRoom: "最低日租 - {roomType} (HK$)",
        chartLabelMaxRoom: "最高日租 - {roomType} (HK$)",
        roomStandard: "普通房",
        roomSemiPrivate: "半私家房",
        roomPrivate: "私家房",
        specialistsTitle: "急症專科服務",
        specialistEmergency: "急症科",
        specialistCardiology: "心臟科", 
        specialistOrthopedics: "骨科",
        specialistNeurology: "腦神經科",
        specialistPediatrics: "兒科",
        specialistGynecology: "婦科",
        specialistUrology: "泌尿科",
        specialistGastroenterology: "腸胃科",
        specialistPsychiatry: "精神科",
        specialist24h: "24小時",
        specialistOnCall: "隨時候命",
        specialistReferral: "轉介",
        specialistGP: "普通科",
        specialistsViewMore: "查看急症專科",
        specialistsViewLess: "收起",
        filterSpecialistLabel: "急症專科篩選:",
        filterSpecialistAll: "全部急症專科",
        filterCardiologyText: "心臟科",
        filterOrthopedicsText: "骨科", 
        filterNeurologyText: "腦神經科",
        filterPediatricsText: "兒科",
        filterGynecologyText: "婦科",
        filterUrologyText: "泌尿科",
        filterGastroenterologyText: "腸胃科",
        filterPsychiatryText: "精神科",
        disclaimerTitle: "免責聲明及服務條款",
        disclaimerShort: "本網站資料僅供參考。如遇緊急情況，請立即致電 999。使用本網站即表示您接受我們的條款。",
        disclaimerToggleShow: "顯示完整條款",
        disclaimerToggleHide: "隱藏完整條款",
        emergency999Banner: "🚨 如遇危急情況，請立即致電 999 - 切勿延誤！",
        emergency999BannerSub: "本網站僅供非緊急情況參考使用",
        emergency999BeforeList: "⚠️ 重要提醒：如情況危急，請立即致電 999，不要花時間比較醫院",
        emergency999Location: "📍 使用位置服務前，請確認這不是緊急情況",
        emergency999ModalTitle: "重要安全提醒",
        emergency999ModalContent: "本網站是為<strong>非緊急</strong>情況設計的。如果您或他人有以下情況，請立即致電 <strong class='text-red-600'>999</strong>：<br><br>• 嚴重胸痛或呼吸困難<br>• 中風症狀（面部下垂、手臂無力、言語不清）<br>• 大量出血或嚴重創傷<br>• 失去意識或嚴重頭部創傷<br>• 嚴重過敏反應<br><br>對於輕微急症，您可以繼續使用本網站尋找合適的醫療服務。",
        emergency999ModalConfirm: "我明白，繼續使用",
        emergency999ModalCall: "立即致電 999",
        disclaimerFull: `<h3 class="font-bold mb-2">香港次緊急及非緊急急症服務指南 – 網站免責聲明及服務條款</h3>
<p class="text-xs text-gray-600 mb-3">最後更新：2025年7月7日</p>

<h4 class="font-semibold mt-3">1. 免責聲明 – 僅供一般參考 / 風險自負</h4>
<p>本網站（香港次緊急及非緊急急症服務指南 – <a href="https://hkemergencyservices.help/" class="text-blue-600 hover:underline">https://hkemergencyservices.help/</a>）所載資料僅供一般參考之用。資料由網站營運者提供（聯絡：<a href="mailto:ymy.theresa@gmail.com" class="text-blue-600 hover:underline">ymy.theresa@gmail.com</a>）。雖然我們致力保持資料最新及正確，但對於本網站或其所載資料、輪候時間估算、地圖、聯絡資料或相關圖像的完整性、準確性、可靠性、適用性或可用性，無論明示或暗示，均不作任何陳述或保證。營運者不會獨立核實第三方資料。閣下對該等資料的任何依賴，均須自行承擔風險。</p>

<h4 class="font-semibold mt-3">2. 非專業意見</h4>
<p>本網站所載內容並不構成任何醫療、法律或其他專業意見。如需專業協助，請諮詢合資格專家。</p>

<h4 class="font-semibold mt-3">3. 緊急情況優先</h4>
<p class="font-bold text-red-600">如遇緊急情況，請立即致電 999。切勿依賴本網站作緊急求助用途。</p>

<h4 class="font-semibold mt-3">4. 責任限制</h4>
<p>在香港法律允許的最大範圍內，營運者對因使用本網站或依賴其內容而引致的任何損失或損害（包括但不限於間接或後果性損失或損害，或任何因資料或利潤損失而產生的損失或損害）概不負責。</p>

<h4 class="font-semibold mt-3">5. 條款接受</h4>
<p>閣下進入或使用本網站，即無條件接受本免責聲明及服務條款。本條款可隨時更改，恕不另行通知。</p>

<h4 class="font-semibold mt-3">6. 外部連結</h4>
<p>本網站包含指向外部網站的連結，該等網站不受我們控制。我們對其內容、性質或可用性概不負責。任何連結的出現，並不表示我們推薦或認同其所表達的觀點。</p>

<h4 class="font-semibold mt-3">7. 語言版本</h4>
<p>本免責聲明及服務條款備有英文及繁體中文版本。如有歧義，以英文版本為準。</p>

<h4 class="font-semibold mt-3">8. 管轄法律及司法管轄權</h4>
<p>本條款受香港特別行政區法律管轄，香港法院擁有專屬司法管轄權。</p>

<h4 class="font-semibold mt-3">9. 私隱聲明</h4>
<p>本網站現時不收集個人資料。如日後開始收集個人資料，將會公佈私隱政策。我們只使用不具識別性的流量統計以改進本站。</p>`
    },
    en: {
        mainTitle: "HK Semi-urgent and Non-urgent Emergency Service Guide",
        subTitle: "Real-time A&E waiting times, fee comparison & nearest hospital locator",
        finderTitle: "Find Nearest Hospital",
        finderDesc: "Use GPS location to quickly find the nearest hospital, with options to filter by distance or waiting time.",
        browserTitle: "Browse All Hospitals", 
        browserDesc: "Browse the complete hospital directory with filters to find the best option for your needs.",
        geoTitle: "Find the Nearest Hospital",
        geoBtnText: "Activate Location Search",
        filterRegionLabel: "Region:",
        filterRegionAll: "All",
        filterRegionHki: "HK Island",
        filterRegionKln: "Kowloon",
        filterRegionNt: "NT & Islands",
        filterSectorLabel: "Sector:",
        filterSectorAll: "All",
        filterSectorPublic: "Public",
        filterSectorPrivate: "Private",
        filterTierLabel: "Private Service Level:",
        filterTierAll: "All",
        filterTierA: "Licensed A&E Centre",
        filterTierB: "24-Hour Outpatient",
        noResults: "No hospitals match the selected filters.",
        costTitle: "Private Hospital Emergency Fee Comparison",
        costDesc: "Enter time to view pricing for that period, sorted by price (lowest first).",
        insuranceReminder: "💡 Reminder: If you have medical insurance, check your daily room allowance limit first",
        costToggleShow: "Show Price Comparison",
        costToggleHide: "Hide Price Comparison",
        timeSectionTitle: "⏰ Time-Based Pricing",
        timeLabel: "Time:",
        currentTimeBtn: "Current Time",
        currentTimeBtnText: "Current Time",
        timeHelperText: "Private hospitals charge different rates by time period. Public hospitals show real-time waiting times.",
        costCompareLabel: "Show:",
        costBtnConsult: "Emergency Fee",
        costBtnStandard: "Standard Ward",
        costBtnSemi: "Semi-Private Ward",
        costBtnPrivate: "Private Ward",
        faqTitle: "Important Information & FAQ",
        feeEligible: "HKID",
        feeOthers: "Non-HKID",
        faq0_q: "Who qualifies for the HK$180 emergency fee?",
        faq0_a: "<p><strong>HK$180 fee:</strong> Hong Kong Identity Card holders (including permanent residents)</p><p class=\"mt-2\"><strong>HK$1,230 fee:</strong> Non-HKID holders (including tourists, mainland residents, etc.)</p><p class=\"mt-2\">Note: New fee structure coming in 2026 - critical patients free, non-urgent patients will pay HK$300-400.</p>",
        faq1_q: "What is the 'Triage' system?",
        faq1_a: "<p>All public A&E departments and some private hospitals use a triage system. An experienced nurse assesses a patient's condition based on clinical data (like vital signs) and classifies them into five categories: Critical, Emergency, Urgent, Semi-urgent, and Non-urgent. This ensures that the most critical patients receive priority treatment, not based on arrival time. As a result, wait times for semi-urgent and non-urgent cases can be long.</p>",
        faq2_q: "What are the main differences between public and private emergency services?",
        faq2_a: "<p><strong>Public Hospitals:</strong> Provide comprehensive, low-cost services (HK$180 for eligible persons) and are the core for handling severe trauma and complex cases. The downside is extremely high demand, leading to long waits for non-urgent cases.</p><p class=\"mt-2\"><strong>Private Hospitals:</strong> Offer faster, more comfortable services at a much higher cost. There are two types:<br><strong class=\"text-black\">1. Licensed A&E/Emergency Medicine Centres:</strong> Run by Emergency Medicine Specialists, better equipped for serious emergencies.<br><strong class=\"text-black\">2. 24-Hour Outpatient Clinics:</strong> Run by General Practitioners or resident doctors, suitable for general urgent cases. They stabilize and transfer critical patients to public hospitals.</p><p class=\"mt-2\"><strong>Key takeaway:</strong> When choosing a private service, it's crucial to distinguish between an 'A&E Centre' and a '24-Hour Outpatient Clinic' to avoid delays in critical situations.</p>",
        faq3_q: "How are private hospital fees calculated?",
        faq3_a: "<p>The total bill at a private hospital is much more complex than just the 'consultation fee'. The final cost typically includes:</p><ul class=\"list-disc list-inside mt-2\"><li>Doctor's consultation fee</li><li>Medication costs</li><li>Lab and imaging fees (e.g., X-ray, CT scan)</li><li>Charges for medical supplies and equipment</li><li>Fees for any treatments or procedures performed</li></ul><p class=\"mt-2\">The final bill can be several or even tens of times the initial consultation fee. If you have medical insurance, it's advisable to understand your coverage, but in an emergency, you will likely need to pay first and claim reimbursement later.</p>",
        footerText: "This application is compiled from public data and is for reference only, not medical advice. If in doubt, please consult a doctor.",
        feedbackText: 'For information updates, please <a href="mailto:ymy.theresa@gmail.com" class="underline hover:text-blue-600">email us</a>.',
        geoErrorBrowser: "Your browser does not support geolocation.",
        geoErrorPermission: "Could not get your location. Please check your location service settings and grant permission.",
        waitingLegendTitle: "🕐 Public Hospital Waiting Time Guide",
        legendFast: "Around 1 hour (Fast)",
        legendMedium: "Over 1 hour (Medium)",
        legendSlow: "Over 2 hours (Slow)",
        legendPrivate: "Private hospitals (Call to ask)",
        legendUpdateInfo: "Wait times updated every 15 minutes, site refreshes every minute",
        sortedByWaitingTime: "Hospitals sorted by wait time (public by wait time, private by cost)",
        gpsButtonText: "Use My Location",
        addressButtonText: "Enter Address",
        useLocationText: "Activate Location Search", 
        addressPlaceholder: "Enter Hong Kong address, e.g.: Central, Causeway Bay, Mong Kok",
        searchButtonText: "Search",
        addressHelperText: "Enter any Hong Kong district, street name, or landmark",
        publicOptionsLabel: "Public Hospital Options",
        privateOptionsLabel: "Private Hospitals", 
        closestDistanceText: "Closest Distance",
        shortestWaitText: "Shortest Wait",
        nearestPrivateText: "Nearest Private Hospital",
        geoChoosePrompt: "Choose hospital type:",
        geoBtnPublic: "Nearest Public Hospital",
        geoBtnPrivate: "Nearest Private Hospital",
        geoResultTitle: "The nearest {sector} hospital is:",
        geoNoResult: "Could not find a nearby {sector} hospital.",
        serviceTypePublic: "Public A&E",
        serviceTypePrivateA: "Private A&E Centre",
        serviceTypePrivateB: "24-Hour Outpatient",
        serviceTypePrivateOther: "Outpatient Service",
        feeConsultation: "Consultation:",
        feeStandardRoom: "Standard Ward:",
        feeFrom: "from",
        distancePrefix: "Approx.",
        distanceSuffix: "km away",
        mapLinkText: "Map & Directions",
        chartLabelMinConsult: "Min Consultation (HK$)",
        chartLabelMaxConsult: "Max Consultation (HK$)",
        chartLabelMinRoom: "Min Daily Rate - {roomType} (HK$)",
        chartLabelMaxRoom: "Max Daily Rate - {roomType} (HK$)",
        roomStandard: "Standard",
        roomSemiPrivate: "Semi-Private", 
        roomPrivate: "Private",
        specialistsTitle: "Emergency Specialists",
        specialistEmergency: "Emergency",
        specialistCardiology: "Cardiology",
        specialistOrthopedics: "Orthopedics", 
        specialistNeurology: "Neurology",
        specialistPediatrics: "Pediatrics",
        specialistGynecology: "Gynecology",
        specialistUrology: "Urology",
        specialistGastroenterology: "Gastroenterology",
        specialistPsychiatry: "Psychiatry",
        specialist24h: "24/7",
        specialistOnCall: "On-call",
        specialistReferral: "Referral",
        specialistGP: "GP",
        specialistsViewMore: "View Emergency Specialists",
        specialistsViewLess: "Hide",
        filterSpecialistLabel: "Emergency Specialists:",
        filterSpecialistAll: "All Emergency Specialists",
        filterCardiologyText: "Cardiology",
        filterOrthopedicsText: "Orthopedics",
        filterNeurologyText: "Neurology",
        filterPediatricsText: "Pediatrics",
        filterGynecologyText: "Gynecology",
        filterUrologyText: "Urology",
        filterGastroenterologyText: "Gastroenterology",
        filterPsychiatryText: "Psychiatry",
        disclaimerTitle: "Disclaimer and Terms of Service",
        disclaimerShort: "Information is for reference only. In an emergency, call 999 immediately. Using this website means you accept our terms.",
        disclaimerToggleShow: "Show full terms",
        disclaimerToggleHide: "Hide full terms",
        emergency999Banner: "🚨 For life-threatening emergencies, call 999 immediately - do not delay!",
        emergency999BannerSub: "This website is for non-emergency reference only",
        emergency999BeforeList: "⚠️ Important reminder: If this is an emergency, call 999 immediately - don't waste time comparing hospitals",
        emergency999Location: "📍 Before using location services, confirm this is not an emergency",
        emergency999ModalTitle: "Important Safety Reminder",
        emergency999ModalContent: "This website is designed for <strong>non-emergency</strong> situations. If you or someone else has any of the following, call <strong class='text-red-600'>999</strong> immediately:<br><br>• Severe chest pain or difficulty breathing<br>• Stroke symptoms (facial drooping, arm weakness, speech difficulty)<br>• Major bleeding or severe trauma<br>• Loss of consciousness or severe head injury<br>• Severe allergic reaction<br><br>For minor urgent conditions, you may continue using this website to find appropriate medical services.",
        emergency999ModalConfirm: "I understand, continue",
        emergency999ModalCall: "Call 999 now",
        disclaimerFull: `<h3 class="font-bold mb-2">HK Semi-urgent and Non-urgent Emergency Service Guide – Website Disclaimer and Terms of Service</h3>
<p class="text-xs text-gray-600 mb-3">Last updated: 7 July 2025</p>

<h4 class="font-semibold mt-3">1. Disclaimer – General Information Only / Use at Your Own Risk</h4>
<p>The information contained on this website (HK Semi-urgent and Non-urgent Emergency Service Guide – <a href="https://hkemergencyservices.help/" class="text-blue-600 hover:underline">https://hkemergencyservices.help/</a>) is for general reference purposes only. The information is provided by the site operator (contact: <a href="mailto:ymy.theresa@gmail.com" class="text-blue-600 hover:underline">ymy.theresa@gmail.com</a>). While we endeavour to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, queue-time estimates, maps, contact details, or related graphics contained on the website for any purpose. The operator does not independently verify third-party data. Any reliance you place on such information is strictly at your own risk.</p>

<h4 class="font-semibold mt-3">2. No Professional Advice</h4>
<p>Nothing on this website constitutes medical, legal, or other professional advice. For professional assistance, please consult a qualified expert.</p>

<h4 class="font-semibold mt-3">3. Emergency Override</h4>
<p class="font-bold text-red-600">If you have a medical emergency, dial 999 immediately. Do not rely on this website for emergency assistance.</p>

<h4 class="font-semibold mt-3">4. Limitation of Liability</h4>
<p>To the maximum extent permitted under Hong Kong law, the operator is not liable for any loss or damage of any kind, including without limitation indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits, arising out of or in connection with the use of this website or reliance on its content.</p>

<h4 class="font-semibold mt-3">5. Acceptance of Terms</h4>
<p>By accessing or using this website, you accept this disclaimer and the terms of service unconditionally. These terms may be updated at any time without prior notice.</p>

<h4 class="font-semibold mt-3">6. External Links</h4>
<p>This website contains links to external websites which are not under our control. We are not responsible for the content, nature, or availability of those sites. The inclusion of any links does not imply recommendation or endorsement of the views expressed within them.</p>

<h4 class="font-semibold mt-3">7. Language Control</h4>
<p>This disclaimer and terms of service are provided in both English and Traditional Chinese. In case of inconsistency, the English version shall prevail.</p>

<h4 class="font-semibold mt-3">8. Governing Law & Jurisdiction</h4>
<p>These terms are governed by the laws of the Hong Kong Special Administrative Region. The courts of Hong Kong have exclusive jurisdiction.</p>

<h4 class="font-semibold mt-3">9. Privacy Notice</h4>
<p>This website does not collect personal data. If personal data collection begins in the future, a privacy policy will be posted. We use non-identifying traffic statistics to improve the site.</p>`
    }
};