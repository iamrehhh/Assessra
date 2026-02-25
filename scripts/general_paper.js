// ==========================================
// GENERAL PAPER (8021) STORAGE & GENERATOR
// ==========================================

// Global variable to store GP data if not already defined
if (typeof paperData === 'undefined') {
    var paperData = {};
}

// === 1. ADD DATA TO THE DATABASE ===
Object.assign(paperData, {

    // --- FEBRUARY / MARCH 2025 (Variant 12) ---
    'gp_2025_fm_12': {
        title: "Essay Paper 12",
        pdf: "papers/8021_m25_qp_12.pdf",
        questions: [
            {
                n: '1', m: 30, l: '600-700',
                t: "International aid never reaches those communities that are most in need. Discuss.",
                i: [
                    "giving aid to countries where there is conflict increases the chance of aid going missing",
                    "the danger of such aid being misappropriated by corrupt regimes",
                    "the need for aid being linked to policy commitments from the recipient nation",
                    "aid provided not being suitable for the communities it is being sent to",
                    "people most in need of financial aid being difficult to reach",
                    "financial aid being used as a lever to influence the governments of other countries",
                    "how financial aid is being targeted to ensure it only goes to those most in need of it",
                    "cooperation between donor countries being essential for ensuring suitable distribution of aid."
                ]
            },
            {
                n: '2', m: 30, l: '600-700',
                t: "Evaluate the view that increasing surveillance threatens people's privacy.",
                i: [
                    "privacy being negligible in certain countries both now and in the past",
                    "companies using data and profiling to target individuals without their consent",
                    "smart devices invading users' privacy through monitoring their everyday behaviour",
                    "increasing use of CCTV monitoring decreasing privacy in public spaces",
                    "cybercrime being successfully defeated as a result of individuals allowing themselves to be monitored",
                    "legislation protecting individuals from having their personal data shared without their consent",
                    "surveillance methods overriding people's right to privacy in cases where criminal acts have been committed",
                    "how surveillance is being used to protect people without impacting their right to privacy."
                ]
            },
            {
                n: '3', m: 30, l: '600-700',
                t: "People achieve more success working in a group than on their own. Discuss.",
                i: [
                    "a group approach leading to a wider scope of ideas and better problem solving",
                    "enabling larger complex tasks to be broken down into more manageable steps leading to more efficiency",
                    "the sharing of responsibilities and pressures ensuring people work to their strengths",
                    "improving communication skills by listening to and interacting with a wide range of people",
                    "working at one's own pace and being reliant on others to meet deadlines",
                    "the importance of being self-motivated when groups can provide much-needed enthusiasm",
                    "suffering alone when difficulties arise without having the option of team support",
                    "poor mental health being caused by having a limited or non-existent social network."
                ]
            },
            {
                n: '4', m: 30, l: '600-700',
                t: "A person's welfare is the responsibility of their family. To what extent is this true in your country?",
                i: [
                    "the family being the centre of most people's lives and having the most influence",
                    "the family having intimate, personal knowledge of the conditions and environment affecting welfare",
                    "families giving moral and financial support beyond the limits that other agencies can provide",
                    "the love and care given by a family having no limits and cannot be replicated",
                    "medical and social professionals having expertise that a family cannot access",
                    "the individual taking responsibility for their own welfare for a variety of reasons",
                    "some issues requiring levels of funding which are beyond the reach of most families",
                    "outsiders giving a neutral voice that provides a fair and honest view and solutions to issues."
                ]
            },
            {
                n: '5', m: 30, l: '600-700',
                t: "Not enough is being done in your country to tackle climate change. Discuss.",
                i: [
                    "funding to tackle climate change being essential to save lives",
                    "there being scepticism on the part of governments and individuals about the validity of climate change",
                    "climate change having the potential to cause an ever-increasingly unpredictable range of challenges",
                    "the future needs of people being considered when developing policies",
                    "preventative investment already having made a difference in a variety of ways",
                    "the climate becoming increasingly volatile meaning the need to prepare is more urgent",
                    "the return on investment for disaster mitigation is not usually immediate",
                    "there being more pressing issues within a country requiring attention."
                ]
            },
            {
                n: '6', m: 30, l: '600-700',
                t: "To what extent is migration from rural to urban areas beneficial to a country?",
                i: [
                    "the historical importance of urban migration in some countries in achieving industrialisation",
                    "the benefits to individuals of access to a wider range of employment, leisure and services",
                    "state provision of services and infrastructure potentially being more centralised and coordinated",
                    "the negative impact on deserted rural communities, especially as younger people tend to leave",
                    "the possible reduction in farmed land impacting the provision of sufficient food for the population",
                    "the cultural and societal differences between rural and urban living creating problems with integration",
                    "the dangers inherent in rapid population growth and building in urban areas",
                    "increased poverty when those arriving in cities are unsuccessful in finding suitable work."
                ]
            },
            {
                n: '7', m: 30, l: '600-700',
                t: "Clinical trials for new medications should always be ethical. Discuss.",
                i: [
                    "ethical considerations being central to the practice of clinical trials",
                    "the rights and safety of the trial subjects being the most important consideration",
                    "clear and detailed protocols being essential to the success of an ethical trial",
                    "principles being removed resulting in a variety of negative short and long term impacts",
                    "risks weighed against the anticipated benefits being considered before a trial",
                    "during an outbreak the risks may not be clear meaning risk benefit analysis becomes difficult",
                    "the needs of the many superseding those of the individual",
                    "protocols and procedures taking up valuable time when humanity may be faced with a crisis."
                ]
            },
            {
                n: '8', m: 30, l: '600-700',
                t: "To what extent are works of non-fiction more important than fictional works?",
                i: [
                    "non-fiction writing encouraging those who are resistant to reading fiction",
                    "learning about important issues in the world through engaging with non-fiction",
                    "non-fiction writing providing answers, facts and knowledge about a wide range of topics",
                    "whatever a person's interest, there being a range of non-fiction works available relating to that interest",
                    "fiction helping people to see the world from the perspectives of different characters",
                    "the development of imagination being supported by a diverse range of fictional works",
                    "fiction being accessible to struggling readers as it is available in a variety of forms",
                    "reading fiction helping students to escape to different worlds and experience adventures."
                ]
            },
            {
                n: '9', m: 30, l: '600-700',
                t: "The ability to communicate in more than one language is unnecessary. Discuss.",
                i: [
                    "some concepts not being easy to translate from one language to another",
                    "the number of speakers of any other languages, by indigenous or immigrant communities",
                    "languages being used for official purposes, such as education and government",
                    "communication with other nations for various reasons requiring one commonly spoken language",
                    "the role of minority languages in ethnic and cultural heritage as well as identity",
                    "emphasis being placed on multilingualism in education and the workplace",
                    "the relative ease of digital translation of speech or documents nowadays",
                    "the prevalence of only major world languages on the internet."
                ]
            },
            {
                n: '10', m: 30, l: '600-700',
                t: "Evaluate the importance of live music to people in your country.",
                i: [
                    "traditional music continuing to play a significant role in cultural events and rituals",
                    "the popularity of live musical events as a form of entertainment",
                    "events like concerts and festivals contributing to the country economically",
                    "live musical events having an important role for the community and in bringing people together",
                    "the significance of live music in comparison with other artistic or cultural events",
                    "live music declining in appeal in comparison with pre-recorded music",
                    "the rise of certain types of music leading to the declining popularity of music performed live",
                    "licensing and other difficulties creating obstacles for music venues and promoters."
                ]
            }
        ]
    },

    // --- MAY / JUNE 2025 (Variant 11) ---
    'gp_2025_mj_11': {
        title: "Essay Paper 11",
        pdf: "papers/8021_s25_qp_11.pdf",
        questions: [
            {
                n: '1', m: 30, l: '600-700',
                t: "To what extent does the government provide effective public services to the people of your country?",
                i: [
                    "the absence or the poor performance of services provoking discontent",
                    "instances when corruption is affecting the quality and cost of services",
                    "the desire for making a profit surpassing all other concerns",
                    "how deregulation of service provision can lead to misuse of natural resources",
                    "where service provision is respected, used and valued within the community",
                    "instances when innovation, both public and private, is having positive effects",
                    "how those who work in the public services are respected and valued",
                    "where competition from private providers has positive effects in the public sphere."
                ]
            },
            {
                n: '2', m: 30, l: '600-700',
                t: "Discuss the view that the news media should never be censored in your country.",
                i: [
                    "censorship going against the human right of freedom of expression",
                    "not always being able to trust those in power to respect the news media's independence",
                    "censoring as a potential tool for suppressing the views of certain groups",
                    "the news media having a responsibility to report and share the truth",
                    "news media censorship protecting people from a range of potentially harmful views",
                    "censorship enabling a range of national security matters to be taken into account",
                    "censorship helping to prevent conflict between groups of differing views",
                    "censorship potentially preventing extremist views being aired which could be very damaging."
                ]
            },
            {
                n: '3', m: 30, l: '600-700',
                t: "To what extent are art galleries and museums still necessary?",
                i: [
                    "art galleries and museums providing an opportunity to learn from the past",
                    "the cultural significance of the items being displayed in art galleries and museums",
                    "the role of national and regional arts galleries and museums in preserving the history of a country",
                    "the education programmes being provided by art galleries and museums for their local communities",
                    "no longer having to travel to see objects when they can be viewed online at any time",
                    "the lack of relevance of many historic artworks and artefacts to the modern world",
                    "items displayed in art galleries and museums not being appropriate to modern values",
                    "most people preferring other forms of entertainment over visiting art galleries and museums."
                ]
            },
            {
                n: '4', m: 30, l: '600-700',
                t: "Marriage is no longer necessary in modern society. Evaluate this view.",
                i: [
                    "marriage being an indicator of a couple's serious level of commitment",
                    "demonstrating respect between people and the continuance of a family's lineage",
                    "marriage maintaining social and financial security for all family members",
                    "building a relationship that will lead to emotional support and companionship in later life",
                    "people proving that to live as partners without marrying can lead to the same level of commitment",
                    "aspects of the modern world possibly leading to the breakdown of relationships",
                    "media publicity causing marriage to lose its sanctity and moral standing",
                    "being seen as an out-of-date institution that is too restrictive."
                ]
            },
            {
                n: '5', m: 30, l: '600-700',
                t: "New medicines should always be fully tested before people use them. To what extent do you agree with this statement?",
                i: [
                    "the full range of tests being available to researchers in laboratories",
                    "the ethical and commercial importance of ensuring that medicinal drugs given to the population are safe",
                    "the role of governments in regulating new medicines and testing procedures",
                    "the requirement for public confidence in new medical products made available to them",
                    "the possible doubts over the ethics of testing medicines on animals, before progressing to human subjects",
                    "the difficulties of extrapolating any findings of animal testing to the human population due to physiological differences",
                    "the difficulty of predicting or testing for long-term impacts or rarer side effects in humans",
                    "the occasional necessity for speed of development, such as vaccinations during a pandemic."
                ]
            },
            {
                n: '6', m: 30, l: '600-700',
                t: "To what extent is your country adequately prepared for natural disasters?",
                i: [
                    "the frequency, scale and impact of natural disasters occurring in the chosen country",
                    "the financial costs of developing warning systems and preventative measures",
                    "the time, money and other resources required following a natural disaster",
                    "the ease with which different natural disasters can be mitigated and prepared for",
                    "the changing nature and frequency of some natural disasters due to climate change",
                    "the relative importance of alternative spending, planning and developmental priorities",
                    "the role of the international community in supporting those countries worst affected by natural disasters",
                    "the imbalance between wealthier and poorer nations in terms of impact and preparedness."
                ]
            },
            {
                n: '7', m: 30, l: '600-700',
                t: "All new house-building projects should include some green spaces within their plans. Evaluate this view.",
                i: [
                    "fewer building materials resulting in a reduction of the carbon footprint",
                    "research confirming the physical and mental benefits of living near green spaces",
                    "green spaces providing areas for play, relaxation and communication with neighbours",
                    "increasing nature-rich habitats increases flora and fauna, building resilience to climate change",
                    "developers wanting to build as many dwellings as possible in the area to maximise profits",
                    "maintenance of communal green spaces leading to disagreements about responsibility",
                    "needing a balance between communal green spaces and some private outdoor space for each dwelling",
                    "other facilities and infrastructure being seen as more of a priority."
                ]
            },
            {
                n: '8', m: 30, l: '600-700',
                t: "Advertising has become an unwelcome feature of our lives. To what extent do you agree with this statement?",
                i: [
                    "the prevalence of advertising in a range of contexts, especially on digital devices",
                    "advertising being an immensely profitable activity with highly sophisticated strategies employed",
                    "the increasingly innovative methods used to target advertising to potentially interested consumers",
                    "the degree to which data analytics used in targeted advertising are unwelcome",
                    "the requirement for consumers to pay to access television and online content without advertisements",
                    "growing consumer awareness of the many varied tactics used in advertising",
                    "the ability to select preferences and privacy settings on devices, websites and apps",
                    "the creative appeal or entertainment value that some advertisements have."
                ]
            },
            {
                n: '9', m: 30, l: '600-700',
                t: "People should be allowed to protest in any way they choose. Evaluate this statement.",
                i: [
                    "how freedom of expression is being upheld in different parts of the world",
                    "situations compelling individuals to highlight threats to our well-being",
                    "where raising awareness of issues has led to positive changes",
                    "how protest has given individuals and groups a voice in national conversations",
                    "the risk of non-violent protest descending into violence and serious disruption",
                    "national security considerations that might justify the restriction of the freedom to protest",
                    "legitimate debate losing a safe space in which to continue",
                    "the infrastructure we depend upon should never be put at risk."
                ]
            },
            {
                n: '10', m: 30, l: '600-700',
                t: "International aid benefits the people providing the aid more than the people receiving it. Discuss",
                i: [
                    "the damaging impact that aid may have on the recipient country's economy",
                    "corruption preventing foreign financial support from reaching its intended recipients",
                    "aid benefitting the providers through increased influence and soft power in the targeted region",
                    "reliance on foreign aid resulting in countries becoming overly dependent on others",
                    "donor countries potentially placing economic and political pressure on the receiving country",
                    "most aid only benefiting large corporations rather than intended recipients",
                    "the donor country benefiting from increased trade opportunities in the region",
                    "the recipient country accessing improved infrastructure, health care, security, and education systems."
                ]
            }
        ]
    },

    // --- MAY / JUNE 2025 (Variant 12) ---
    'gp_2025_mj_12': {
        title: "Essay Paper 12",
        pdf: "papers/8021_s25_qp_12.pdf",
        questions: [
            {
                n: '1', m: 30, l: '600-700',
                t: "Governments should prioritise the needs of people living in rural areas over the needs of people living in cities. Discuss.",
                i: [
                    "differences in economic and employment opportunities and activities",
                    "weather-related incidents having a greater impact on those in rural areas",
                    "access to services being more limited in rural locations compared to urban ones",
                    "investment in infrastructure being more apparent in built-up communities than in rural areas",
                    "governments having to provide funding to solve issues exclusively faced by those in rural areas",
                    "citizens having equivalent voting rights and taxation burdens regardless of where they live in a country",
                    "different needs of rural and urban communities which relate to socio-economic factors",
                    "governments passing laws that have a national rather than regional-specific impact."
                ]
            },
            {
                n: '2', m: 30, l: '600-700',
                t: "To what extent do traditional arts and crafts provide an understanding of your country's history?",
                i: [
                    "arts and crafts helping us to understand our own past and relationship to our present",
                    "arts and crafts being sold in souvenir shops and to tourists and the role they play",
                    "arts and crafts showing us how society and civilisation has changed and adapted",
                    "keeping alive traditional skills and crafts at risk of being forgotten",
                    "helping to ensure that future generations have access to these artefacts of their heritage",
                    "competition from mass produced goods threatening the production and future of traditional crafts",
                    "the decline in traditional skills and knowledge posing a threat to these practices",
                    "the traditions of a country being preserved in alternative, more modern, ways."
                ]
            },
            {
                n: '3', m: 30, l: '600-700',
                t: "The world is more divided now than ever. Examine this statement.",
                i: [
                    "whether or not there are barriers that restrict freedom of trade",
                    "the impact of armed conflict in different regions of the world",
                    "how the availability of resources constitutes a problem or an advantage",
                    "the influence of different religious beliefs in promoting unity or disunity",
                    "how seriously current and future environmental concerns are taken internationally and locally",
                    "the importance that is given to equal rights and opportunities",
                    "whether or not social media and creative industries promote global cohesion",
                    "political, cultural and religious organisations which assist in promoting international understanding and unity."
                ]
            },
            {
                n: '4', m: 30, l: '600-700',
                t: "Prisons play a positive role in keeping societies safe. Evaluate this view.",
                i: [
                    "the need to protect society from people who have committed violent crimes",
                    "inmates being offered opportunities for rehabilitation, education and support",
                    "the likelihood of people reoffending after being released from prison",
                    "how prison can act as a deterrent and help to prevent people from committing crimes",
                    "the size of the prison population, overcrowding and human rights issues",
                    "rehabilitation being more important than punishing people by sending them to prison",
                    "prisons being less appropriate for juvenile or minor offenders",
                    "alternative methods of dealing with offenders such as community work or restorative justice."
                ]
            },
            {
                n: '5', m: 30, l: '600-700',
                t: "Online learning is the future of education. Discuss.",
                i: [
                    "people being able to access lessons at any time and in any place",
                    "online learning fitting in with the preferred learning styles of many learners",
                    "potential money savings for educational institutions that could be passed on to learners",
                    "the ability to access a wider range of courses than would be possible in just one area",
                    "technology issues that could prevent some people from accessing online learning",
                    "social disadvantages of learning online, rather than in schools and colleges",
                    "the possibility of people becoming distracted by other things they can do on their devices",
                    "health issues that could be caused by people spending more time looking at screens."
                ]
            },
            {
                n: '6', m: 30, l: '600-700',
                t: "To what extent has genetic engineering positively changed people's lives?",
                i: [
                    "the ability to treat and prevent life-threatening conditions before birth",
                    "eradicating some diseases that are responsible for many human deaths",
                    "improving the quantity and quality of food resources including pest resistance",
                    "cloning and the creation of designer and customisable organisms",
                    "widespread use resulting in the lack of biodiversity or rogue strains",
                    "ethical dilemmas and impact on religious beliefs",
                    "access to genetic therapy only available to the rich due to high costs",
                    "allowing businesses to have power over producers by controlling food production and supply."
                ]
            },
            {
                n: '7', m: 30, l: '600-700',
                t: "The lack of clean water is a significant threat to human survival. Discuss.",
                i: [
                    "humans needing water to survive means access to clean water is a necessity",
                    "agriculture and associated food production processes requiring access to clean water",
                    "clean water scarcity potentially leading to regional tensions and conflict",
                    "water playing a vital role in sanitation and effective waste disposal processes",
                    "pollution and development impacting the clean water supply and the wider consequences of this",
                    "ageing drainage systems and infrastructure posing a threat to the clean water supply",
                    "the dangers posed by water-borne diseases and epidemics",
                    "science and technology solutions potentially mitigating or removing threats to clean water supplies."
                ]
            },
            {
                n: '8', m: 30, l: '600-700',
                t: "Works of fiction have no relevance to the reality of everyday life. Evaluate this statement.",
                i: [
                    "works of fiction offer an escape from everyday life and the challenges of the real world",
                    "those works of fiction set in alternate realities having a profound or lasting influence",
                    "those issues that matter being trivialised or misrepresented in works of fiction",
                    "close depictions of the reality of everyday life in specific genres and by authors",
                    "fictional works highlighting those matters of concern and promoting awareness",
                    "the difficulties encountered when trying to define what constitutes reality of everyday life",
                    "fiction helping us to imagine possible future scenarios both good and bad",
                    "fiction does not need to transmit factual information but always has a basis in reality."
                ]
            },
            {
                n: '9', m: 30, l: '600-700',
                t: "Effective censorship of the media is not possible today. Discuss.",
                i: [
                    "the international nature of modern media making censorship difficult",
                    "difficulties around policing or eliminating sensitive content in social media",
                    "the ineffectiveness of attempts to block distribution of material on the internet",
                    "the dark web evading attempts at regulation or removal of content",
                    "censorship serving only to draw attention to the original material means it is self-defeating",
                    "successful use of firewalls and other mechanisms in many countries",
                    "prosecution of those evading censorship at least discouraging or deterring potential offenders",
                    "censorship discrediting or de-legitimising certain media items means it may be indirectly effective."
                ]
            },
            {
                n: '10', m: 30, l: '600-700',
                t: "To what extent do you agree that it is possible to achieve equality of wealth in your country?",
                i: [
                    "people inheriting wealth passed down through generations have a choice how to use their money",
                    "differing levels of education influencing a person's future income and prosperity",
                    "household income varying significantly between regions due to differing levels of investment around the country",
                    "both race and gender affecting income levels due to discrimination or choice of employment",
                    "improving education for all leading to more people obtaining better paid jobs",
                    "tax policies aimed at reducing the level of income equality",
                    "wealth inequality being a growing problem with cost-of-living increases affecting the poorest the most",
                    "immigration and movement of people leading to an imbalance of employed and unemployed people in certain areas."
                ]
            }
        ]
    },

    // --- MAY / JUNE 2025 (Variant 13) ---
    'gp_2025_mj_13': {
        title: "Essay Paper 13",
        pdf: "papers/8021_s25_qp_13.pdf",
        questions: [
            {
                n: '1', m: 30, l: '600-700',
                t: "Everyone must help their country in times of war. To what extent do you agree with this statement?",
                i: [
                    "allowing people to understand war and its consequences through being directly involved",
                    "developing and securing a sense of national unity in a time of crisis",
                    "ensuring access to the many areas of skill and expertise that will be required",
                    "a feeling of having contributed to the preservation of a way of life",
                    "refusal to participate resulting in rejection and isolation from society",
                    "disunity and pacifism being seen as a sign of weakness by aggressors",
                    "not everyone being able to contribute reducing the options for defence",
                    "removing people's right to object to war as a matter of conscience."
                ]
            },
            {
                n: '2', m: 30, l: '600-700',
                t: "To what extent should towns be designed to support people's needs?",
                i: [
                    "proximity to local facilities and services being an important consideration for residents",
                    "public transport systems ensuring quick access to all areas of the urban centre",
                    "prioritising parking facilities and ease of access for motor vehicles",
                    "positioning of shopping centres, retail parks and other commercial outlets",
                    "the different special needs of people needing to be considered",
                    "urban spread being a limiting factor in ensuring all parts of a town or city are linked",
                    "environmental considerations being important and affecting priorities in urban planning",
                    "commuting and access for inhabitants from outside the urban area being a further consideration."
                ]
            },
            {
                n: '3', m: 30, l: '600-700',
                t: "Non-fiction books will never be as popular as fiction books. To what extent do you agree with this statement?",
                i: [
                    "non-fiction books often being viewed as factual and educational, rather than entertaining",
                    "subjects of non-fiction books which appeal only to a small number of interested people",
                    "works of non-fiction often being longer and less accessible, so unappealing in busy modern lives",
                    "the wide range of non-fiction books now available, including those written by or about celebrities and modern times",
                    "some works of literature becoming more or less popular over time as tastes and standards change",
                    "the popularity of fiction books of all genres, given an infinite range of themes and characters",
                    "television or film adaptations making the original fictional works more popular",
                    "social media's role in increasing awareness and generating excitement about the latest works of fiction."
                ]
            },
            {
                n: '4', m: 30, l: '600-700',
                t: "Evaluate the view that the aim of prison should be to improve people rather than punish them.",
                i: [
                    "the main reasons for imprisonment being for punishment and deterrence",
                    "enabling rehabilitated offenders to be of service or value to society",
                    "rehabilitation schemes having a positive impact on rates of reoffending in some areas of the world",
                    "moral arguments in favour of reforming rather than punishing individuals",
                    "rehabilitation enforcing certain social norms and values to the disadvantage of those that have been incarcerated",
                    "the severity of the punishment depending on the severity of the crime committed",
                    "the requirement that offenders repay their debt to society before being allowed the opportunity of rehabilitation",
                    "whether prison is a suitable environment for improving the lives of offenders."
                ]
            },
            {
                n: '5', m: 30, l: '600-700',
                t: "The rights of people to protest on the streets should always be protected. Examine this statement.",
                i: [
                    "matters of conscience varying from person to person and region to region",
                    "protests inconveniencing or endangering people going about their daily business",
                    "there being different ways of drawing attention to perceived injustice",
                    "the risk that street protests are interfering with legitimate security concerns",
                    "confident nations or institutions having nothing to fear from dissent",
                    "freedom to protest provoking debate and spreading knowledge about issues",
                    "there being no alternative but to take to the streets in some contexts",
                    "protests which may empower marginalised or minority groups in societies."
                ]
            },
            {
                n: '6', m: 30, l: '600-700',
                t: "To what extent has globalisation improved people's lives in your country?",
                i: [
                    "opening of markets resulting in trading opportunities and reduction of bureaucracy",
                    "bringing countries together to encourage greater tolerance and a better mutual understanding",
                    "enabling their country to work with others to solve global problems",
                    "a greater choice of goods and services being made available to people in their country",
                    "opening up global markets resulting in concentrations of money and power",
                    "globalisation leading to a disempowerment of their country's government and people",
                    "global trade adversely affecting the environment and living standards in their country",
                    "globalisation leading to tensions and rivalries that may increase conflict."
                ]
            },
            {
                n: '7', m: 30, l: '600-700',
                t: "Government investment is essential for local community arts to survive. Discuss.",
                i: [
                    "spending money on the arts does not necessarily mean there will be more interest or participation generated",
                    "more businesses and private individuals investing in the arts reducing the need for government subsidy",
                    "encouraging people to take part in art events thereby developing a sense of local community",
                    "local community arts being a way of preserving cultural heritage and unique traditional skills",
                    "maintaining the arts in the local community can result in the creation of jobs and the promotion of tourism",
                    "arts investment having an impact on the education of young people by making them aware of their heritage",
                    "some local communities possessing a strong tradition for art and needing no external support",
                    "those communities where the arts are an important link with the past."
                ]
            },
            {
                n: '8', m: 30, l: '600-700',
                t: "To what extent does a plant-based diet ensure a healthy lifestyle?",
                i: [
                    "eating vegetables containing essential vitamins and nutrients being part of a healthy lifestyle",
                    "avoidance of meat and dairy products reducing intake of calories and fats",
                    "consumers of vegetable-based foods being less susceptible to certain diseases",
                    "diet not being the only component of a healthy lifestyle meaning fitness and exercise are necessary also",
                    "plant-based diets risking a low intake of protein and certain important vitamins",
                    "monitoring of such diets being important to ensure a healthy balance",
                    "some plant-based foods being of more nutritional value and conducive to a healthy lifestyle than others",
                    "lack of commercial availability of certain plant-based foods limiting their potential impact."
                ]
            },
            {
                n: '9', m: 30, l: '600-700',
                t: "Actors playing leading roles in movies are too often chosen for their physical appearance. Discuss.",
                i: [
                    "movies, being commercial entertainment forms, aim to attract a large audience",
                    "seeing actors deemed attractive helping viewers like and relate to the leading characters",
                    "there being cultural expectations regarding desirable physical appearance, reflected in the most popular actors",
                    "historically, heroes and villains in movies often being stereotyped by physical appearance",
                    "changing views regarding which actors should play particular roles moving away from clichés",
                    "modern movie viewers expecting greater diversity in the actors they see on screen",
                    "the need for greater equality and representation of all groups in society",
                    "acting skill and empathy with the role and character being the more worthwhile considerations when casting."
                ]
            },
            {
                n: '10', m: 30, l: '600-700',
                t: "To what extent is the introduction of electric vehicles a positive development?",
                i: [
                    "the zero emissions of these vehicles reducing our carbon footprint",
                    "low-cost maintenance being a significant economic factor for individuals and businesses",
                    "noise pollution being less prevalent in cities and rural areas",
                    "vehicle manufacturers and their employees having a guaranteed and stable future",
                    "not all electricity being resourced from renewable sources of energy",
                    "the exploitation of finite mineral deposits needed for electric vehicle manufacture",
                    "electric cars taking up as much space as their predecessors",
                    "other forms of transport and mobility offering a greener future."
                ]
            }
        ]
    },

    // --- OCTOBER / NOVEMBER 2025 (Variant 11) ---
    'gp_2025_on_11': {
        title: "Essay Paper 11 (Oct/Nov '25)",
        pdf: "papers/8021_w25_qp_11.pdf",
        questions: [
            {
                n: '1', m: 30, l: '600-700',
                t: "International organisations are of essential importance in today's world. To what extent do you agree with this statement?",
                i: [
                    "exploring what international organisations are and what they do",
                    "evaluating the extent to which international organisations are of essential importance",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '2', m: 30, l: '600-700',
                t: "Technological advances will make learning to speak other languages unnecessary. Evaluate to what extent this statement is true.",
                i: [
                    "exploring how technology can be used when learning to speak other languages",
                    "assessing whether technology might end the need for learning to speak other languages",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '3', m: 30, l: '600-700',
                t: "To what extent is health education effective in your country?",
                i: [
                    "assessing the importance of education in understanding and maintaining one's health",
                    "evaluating the effectiveness and limitations of current health education provision",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '4', m: 30, l: '600-700',
                t: "Evaluate the extent to which literature can change how people think.",
                i: [
                    "examining a variety of examples of literature",
                    "assessing the extent to which literature can change people's attitudes",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '5', m: 30, l: '600-700',
                t: "Traditional arts and crafts are not appreciated enough in your country. To what extent do you agree with this statement?",
                i: [
                    "examining the traditional arts and crafts of a country",
                    "assessing the extent to which these traditional arts and crafts are appreciated",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '6', m: 30, l: '600-700',
                t: "The desire to make a lot of money is having a positive effect on today's world. Discuss.",
                i: [
                    "exploring the concept of the desire to make a lot of money",
                    "evaluating the extent to which making a lot of money can be seen as positive or negative",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '7', m: 30, l: '600-700',
                t: "Evaluate the view that space exploration should be publicly funded.",
                i: [
                    "examining a range of benefits and drawbacks of space exploration",
                    "evaluating reasons why the exploration of space may not be the best use of public funds",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '8', m: 30, l: '600-700',
                t: "To what extent has digital media negatively impacted attendance at live performances?",
                i: [
                    "exploring differences between live performances and digital media",
                    "evaluating how attendance at live performances has been impacted by digital media",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '9', m: 30, l: '600-700',
                t: "Human rights are still not given enough importance in today's world. Discuss.",
                i: [
                    "assessing what human rights are",
                    "evaluating how valued human rights are in a range of different contexts",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '10', m: 30, l: '600-700',
                t: "To what extent are the problems of water pollution being successfully addressed in your country?",
                i: [
                    "discussing the current state of water pollution in the chosen country",
                    "exploring developments which aim to improve water quality",
                    "making a judgement based on the evidence and argument"
                ]
            }
        ]
    },

    // --- OCTOBER / NOVEMBER 2025 (Variant 12) ---
    'gp_2025_on_12': {
        title: "Essay Paper 12 (Oct/Nov '25)",
        pdf: "papers/8021_w25_qp_12.pdf",
        questions: [
            {
                n: '1', m: 30, l: '600-700',
                t: "Tourism ensures the survival of remote communities. To what extent is this true in your country?",
                i: [
                    "considering the extent to which tourism can ensure survival of communities",
                    "discussing positive and negative effects of tourism on local communities and traditions",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '2', m: 30, l: '600-700',
                t: "Successful leaders have to make unpopular decisions. Discuss.",
                i: [
                    "examining the requirements for successful leadership",
                    "considering whether successful leaders are willing to make unpopular decisions",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '3', m: 30, l: '600-700',
                t: "Human migration from one place to another brings many benefits. To what extent do you agree with this statement?",
                i: [
                    "examining the places impacted by human migration",
                    "evaluating the extent to which migration can be beneficial or problematic",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '4', m: 30, l: '600-700',
                t: "To what extent does social media enable young people to communicate more positively?",
                i: [
                    "discussing how social media platforms can allow young people to communicate positively",
                    "considering ways in which it could be less beneficial",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '5', m: 30, l: '600-700',
                t: "The study of history focuses too much on what people have done wrong. Discuss.",
                i: [
                    "exploring why historical study focuses on people's wrongdoings",
                    "discussing the extent of this focus",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '6', m: 30, l: '600-700',
                t: "Financial security is the responsibility of the individual. To what extent do you agree with this statement?",
                i: [
                    "exploring what financial security is",
                    "considering the extent to which financial security is an individual's responsibility",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '7', m: 30, l: '600-700',
                t: "What an individual chooses to eat and drink is of no concern to anyone else. Evaluate this statement.",
                i: [
                    "exploring health, personal and social issues related to dietary choices",
                    "discussing to what extent others should be concerned with individual choices",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '8', m: 30, l: '600-700',
                t: "Visual forms of art express emotions in ways that written words cannot achieve. Discuss.",
                i: [
                    "exploring differences between visual arts and the written word",
                    "assessing strengths and weaknesses of visual arts in expressing emotion compared to written word",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '9', m: 30, l: '600-700',
                t: "The biggest concern about climate change is the threat that it creates for the people of the world. To what extent do you agree with this view?",
                i: [
                    "exploring the concept of climate change",
                    "examining the extent to which climate change poses a threat to humanity",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '10', m: 30, l: '600-700',
                t: "Songs have the power to divide as well as unite people. Discuss.",
                i: [
                    "examining a range of songs",
                    "evaluating what can cause division or unity among people",
                    "making a judgement based on the evidence and argument"
                ]
            }
        ]
    },

    // --- OCTOBER / NOVEMBER 2025 (Variant 13) ---
    'gp_2025_on_13': {
        title: "Essay Paper 13 (Oct/Nov '25)",
        pdf: "papers/8021_w25_qp_13.pdf",
        questions: [
            {
                n: '1', m: 30, l: '600-700',
                t: "The government should protect the health of all citizens in your country. To what extent do you agree with this view?",
                i: [
                    "exploring different ways governments can protect citizens' health",
                    "evaluating the extent to which governments should intervene in protecting health",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '2', m: 30, l: '600-700',
                t: "Space travel and exploration should be managed by private companies rather than governments. Discuss this view.",
                i: [
                    "exploring the importance of space travel and exploration",
                    "assessing the capacity of private companies vs national governments for managing space exploration",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '3', m: 30, l: '600-700',
                t: "Books inspire the minds of children. To what extent do you agree with this claim?",
                i: [
                    "discussing a range of books children are likely to have read",
                    "assessing the extent to which books can inspire children",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '4', m: 30, l: '600-700',
                t: "Designers should always ensure that what they create is visually attractive. To what extent do you agree with this statement?",
                i: [
                    "exploring different areas and types of design",
                    "assessing the extent to which designers should create visually appealing products",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '5', m: 30, l: '600-700',
                t: "Spending on foreign aid should be a priority for wealthy countries. Discuss.",
                i: [
                    "evaluating the importance of spending on foreign aid by wealthy countries",
                    "assessing the extent to which spending on foreign aid should be a higher priority",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '6', m: 30, l: '600-700',
                t: "To what extent is it desirable for all people in your country to earn the same amount of money?",
                i: [
                    "discussing benefits and drawbacks of equitable distribution of wealth",
                    "exploring the extent to which equality of wealth is desirable",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '7', m: 30, l: '600-700',
                t: "Ageing populations bring many benefits to society. To what extent do you agree?",
                i: [
                    "exploring the roles of elderly people in society",
                    "evaluating potential problems or benefits brought by increasing numbers of older people",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '8', m: 30, l: '600-700',
                t: "To what extent should environmental impacts influence what people choose to wear?",
                i: [
                    "examining relevant environmental impacts",
                    "exploring how choices of clothing are influenced by environmental impacts",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '9', m: 30, l: '600-700',
                t: "It is unacceptable to monitor people using information obtained from their mobile devices. Discuss.",
                i: [
                    "assessing ways mobile devices can be used for surveillance",
                    "evaluating how acceptable it is to use information obtained from mobile devices",
                    "making a judgement based on the evidence and argument"
                ]
            },
            {
                n: '10', m: 30, l: '600-700',
                t: "Any media with disturbing content should always begin with a clear warning for viewers. Discuss.",
                i: [
                    "examining contexts where content warnings might occur",
                    "evaluating whether these warnings are intrusive or helpful",
                    "making a judgement based on the evidence and argument"
                ]
            }
        ]
    },

    // --- FEBRUARY / MARCH 2024 (Variant 12) ---
    'gp_2024_fm_12': {
        title: "Essay Paper 12 (Feb/March '24)",
        pdf: "", // No PDF yet
        questions: [
            { n: '1', m: 30, l: '600-700', t: "For many people, the past is more appealing than the present or the future. Discuss.", i: ["nostalgia", "historical continuity", "comfort in the known", "idealisation of the past", "fear of the future", "dissatisfaction with current events", "lessons learned vs repeating mistakes"] },
            { n: '2', m: 30, l: '600-700', t: "Evaluate the view that it is justifiable to use animals in scientific research.", i: ["medical advancements", "ethical considerations", "animal suffering", "alternative testing methods", "regulatory frameworks", "speciesism", "cost vs benefit analysis"] },
            { n: '3', m: 30, l: '600-700', t: "Water is becoming a major reason for conflict between nations. Discuss.", i: ["scarcity due to climate change", "transboundary water sharing agreements", "population growth demands", "pollution of resources", "weaponisation of water supplies", "international law and arbitration", "technological solutions"] },
            { n: '4', m: 30, l: '600-700', t: "To what extent are workers' rights respected in your country?", i: ["minimum wage enforcement", "health and safety regulations", "trade union activity", "gig economy exploitation", "discrimination laws", "working hours and leave", "impact of globalisation"] },
            { n: '5', m: 30, l: '600-700', t: "All countries are now better prepared to prevent the spread of disease. Evaluate this statement.", i: ["lessons from recent pandemics", "vaccine development speed", "global sharing of medical data", "inequality in healthcare access", "funding for public health", "surveillance systems", "vaccine hesitancy"] },
            { n: '6', m: 30, l: '600-700', t: "Tourism always has a damaging effect on the environment. To what extent do you agree with this statement?", i: ["carbon emissions from travel", "destruction of habitats for infrastructure", "waste generation", "depletion of local resources", "ecotourism initiatives", "conservation funding from tourism", "sustainable practices"] },
            { n: '7', m: 30, l: '600-700', t: "To what extent do you agree that reading is the best way to acquire knowledge?", i: ["depth of understanding", "development of critical thinking", "accessibility of books", "experiential learning comparison", "visual/auditory learning styles", "internet and digital media", "historical reliance on texts"] },
            { n: '8', m: 30, l: '600-700', t: "Using statistical data is crucial when making decisions. Discuss.", i: ["objective evidence vs intuition", "identifying trends and patterns", "risk assessment", "misinterpretation or manipulation of data", "ignoring human factors", "data collection biases", "over-reliance on algorithms"] },
            { n: '9', m: 30, l: '600-700', t: "To what extent does online news remove the need for printed newspapers?", i: ["immediacy of updates", "cost and accessibility", "environmental impact", "decline in physical sales", "tactile experience of print", "trustworthiness and fake news", "digital divide"] },
            { n: '10', m: 30, l: '600-700', t: "Participation in drama or other performing arts brings only benefits to young people. Discuss.", i: ["building confidence", "teamwork and collaboration", "creative expression", "empathy and understanding", "time commitment and academic pressure", "fear of public speaking", "focusing on self-image and competition"] }
        ]
    },

    // --- MAY / JUNE 2024 (Variant 11) ---
    'gp_2024_mj_11': {
        title: "Essay Paper 11 (May/June '24)",
        pdf: "",
        questions: [
            { n: '1', m: 30, l: '600-700', t: "Not enough is being done to ensure safety at sporting events. To what extent do you agree with this view?", i: ["importance of safety at sporting events", "sports being inherently dangerous", "high-profile sporting disasters", "older sports stadia risks", "modernisation of stadia", "mental and physical health of participants", "cost of safety measures"] },
            { n: '2', m: 30, l: '600-700', t: "Wealthy celebrities have a duty to give time and money to charitable causes. To what extent do you agree with this statement?", i: ["wealthy being in position to give", "celebrities wanting to help favourite causes", "setting a good example", "raising awareness", "moral obligation vs personal choice", "paying taxes vs voluntary donation", "resentment of choices"] },
            { n: '3', m: 30, l: '600-700', t: "To what extent can a nation's written constitution safeguard people's rights?", i: ["autocratic rule prohibiting free expression", "rights of minorities respected", "recognition of gender parity", "fixed terminology stifling change", "contested wording interpretations", "colonial legacies", "constitution as no barrier to power seekers"] },
            { n: '4', m: 30, l: '600-700', t: "To what extent should war always be the last option when countries attempt to resolve conflicts?", i: ["suffering and loss of human lives", "high economic cost", "devastating impacts of modern weaponry", "diplomacy and sanctions as alternatives", "unjustified motives for war", "defending territory and sovereignty", "resisting aggressive policies"] },
            { n: '5', m: 30, l: '600-700', t: "The problems caused by tourism are always greater than the benefits. Examine this statement.", i: ["economic benefits", "raising profile of area", "infrastructure investment", "sustainable employment", "negative environmental impacts", "impact on traditional ways of life", "inflation and cost of living", "seasonal employment"] },
            { n: '6', m: 30, l: '600-700', t: "Artificial intelligence should be welcomed not feared. To what extent do you agree with this statement?", i: ["improving health services", "freedom from mundane tasks", "accurate prediction of threats", "targeted support to learners", "neglect of human care", "manipulation of data", "loss of confidence in human creativity", "fear of creations turning on us"] },
            { n: '7', m: 30, l: '600-700', t: "Assess the importance of mathematics in education.", i: ["need for mathematics in jobs", "logical reasoning", "basic arithmetic in daily life", "basis for scientific inquiry", "role in computer programming", "students turned off by imposed study", "arts studied without maths", "proportionate to individual needs"] },
            { n: '8', m: 30, l: '600-700', t: "Reading more books would have a positive impact on society. Discuss.", i: ["improving quality of thinking", "teaching attitudes and behaviours", "fiction giving developed perspectives", "nonfiction developing knowledge", "solitary activity for relaxation", "books considered outdated", "decreasing influence on society", "influencing people negatively"] },
            { n: '9', m: 30, l: '600-700', t: "Evaluate the view that the arts should not be about making money.", i: ["art not primarily for financial gain", "market feedback impacting integrity", "avoiding being a brand", "commercialisation reducing creativity", "freedom of expression inhibited", "expensive art restricting audience", "making art accessible", "earning money supporting artistic endeavours"] },
            { n: '10', m: 30, l: '600-700', t: "To what extent has technology had a negative impact on the music industry?", i: ["impact on production and sound quality", "improvements to distribution", "synthesising instruments", "accessibility via apps", "video technology", "stifling innovation", "recovery of vinyl", "digital piracy and small returns"] }
        ]
    },
    // --- MAY / JUNE 2024 (Variant 12) ---
    'gp_2024_mj_12': {
        title: "Essay Paper 12 (May/June '24)",
        pdf: "",
        questions: [
            { n: '1', m: 30, l: '600-700', t: "To what extent do schools in your country encourage creativity?", i: ["curriculum flexibility", "arts and music programs", "emphasis on exams over creativity", "extracurricular opportunities", "teacher encouragement", "resource limitations", "cultural attitudes to creativity"] },
            { n: '2', m: 30, l: '600-700', t: "To what extent has science made the lives of people easier?", i: ["medical advances", "technology in daily life", "agricultural improvements", "environmental concerns", "weapons of mass destruction", "digital divide", "dependency on technology"] },
            { n: '3', m: 30, l: '600-700', t: "People do not need a lot of money to be happy. Evaluate this statement.", i: ["basic needs must be met", "happiness from relationships", "materialism vs contentment", "poverty and stress", "wealth and mental health", "cultural perspectives on happiness", "experiences vs possessions"] },
            { n: '4', m: 30, l: '600-700', t: "To what extent should more be done to prepare for possible natural disasters in your country?", i: ["frequency of natural disasters", "current preparedness levels", "infrastructure improvements", "early warning systems", "education and awareness", "government responsibility", "cost of preparation vs recovery"] },
            { n: '5', m: 30, l: '600-700', t: "Political leaders create fear rather than hope. Discuss.", i: ["use of fear in politics", "populism and division", "leaders who inspire hope", "media amplification", "historical examples", "accountability and trust", "impact on citizens"] },
            { n: '6', m: 30, l: '600-700', t: "To what extent is it important to be tolerant of the beliefs of others?", i: ["diversity and coexistence", "freedom of belief", "limits of tolerance", "extremism and hate speech", "education promoting tolerance", "cultural clashes", "tolerance vs acceptance"] },
            { n: '7', m: 30, l: '600-700', t: "To what extent has satellite technology improved the lives of people in your country?", i: ["communication improvements", "GPS and navigation", "weather forecasting", "agricultural monitoring", "military surveillance", "digital divide", "privacy concerns"] },
            { n: '8', m: 30, l: '600-700', t: "Stories written in the past still have relevance today. To what extent do you agree with this statement?", i: ["timeless themes", "historical context and lessons", "cultural heritage", "changing social norms", "literary canon debates", "adaptation and reinterpretation", "accessibility of older texts"] },
            { n: '9', m: 30, l: '600-700', t: "Television has no educational benefits. To what extent do you agree with this statement?", i: ["documentaries and news", "children's educational programming", "passive consumption", "misinformation risks", "cultural awareness", "screen time concerns", "alternative learning platforms"] },
            { n: '10', m: 30, l: '600-700', t: "Musicians not only make music, but also make a significant contribution to society and culture. Discuss.", i: ["cultural identity", "social commentary through music", "charitable work by musicians", "music as therapy", "influence on youth", "political activism", "economic contributions"] }
        ]
    },
    // --- MAY / JUNE 2024 (Variant 13) ---
    'gp_2024_mj_13': {
        title: "Essay Paper 13 (May/June '24)",
        pdf: "",
        questions: [
            { n: '1', m: 30, l: '600-700', t: "History is always written from the point of view of the powerful. Discuss.", i: ["victors writing history", "marginalised voices", "revisionist history", "access to records", "oral traditions", "power and narrative", "modern efforts at inclusion"] },
            { n: '2', m: 30, l: '600-700', t: "To what extent is financial management the responsibility of the individual?", i: ["personal budgeting", "financial literacy education", "government welfare systems", "predatory lending", "economic inequality", "savings and investment", "systemic barriers"] },
            { n: '3', m: 30, l: '600-700', t: "Assess the importance of everyone in a community being a good neighbour.", i: ["community cohesion", "mutual support", "safety and security", "loneliness and isolation", "cultural differences", "urbanisation challenges", "reciprocity and trust"] },
            { n: '4', m: 30, l: '600-700', t: "To what extent should humans be responsible for the welfare of animals?", i: ["animal rights", "factory farming", "endangered species", "pet ownership", "medical testing", "cultural practices", "environmental stewardship"] },
            { n: '5', m: 30, l: '600-700', t: "Food is a work of art not just a necessity. Discuss.", i: ["culinary arts", "food presentation", "cultural significance", "Michelin star culture", "food as sustenance first", "food inequality", "social media and food aesthetics"] },
            { n: '6', m: 30, l: '600-700', t: "To what extent has online shopping improved people's lives?", i: ["convenience and accessibility", "price comparison", "impact on high street", "delivery and returns", "environmental impact", "data privacy", "digital divide"] },
            { n: '7', m: 30, l: '600-700', t: "Surveillance is only justified in the pursuit of criminals. Discuss.", i: ["crime prevention", "public safety", "privacy rights", "government overreach", "facial recognition technology", "data misuse", "chilling effect on freedom"] },
            { n: '8', m: 30, l: '600-700', t: "Evaluate the importance of traditional stories to the people of your country.", i: ["cultural identity", "moral lessons", "oral tradition preservation", "relevance to modern life", "educational value", "generational bonding", "risk of outdated values"] },
            { n: '9', m: 30, l: '600-700', t: "Learning is more effective when students travel to places outside the classroom. Discuss.", i: ["experiential learning", "field trips and excursions", "engagement and motivation", "cost and access barriers", "curriculum connections", "safety concerns", "virtual alternatives"] },
            { n: '10', m: 30, l: '600-700', t: "Free speech should mean that news media is never censored. To what extent do you agree with this statement?", i: ["press freedom", "accountability and fact-checking", "hate speech and harm", "state censorship", "media bias", "public interest", "self-regulation vs government control"] }
        ]
    },

    // --- OCT / NOV 2024 (Variant 11) ---
    'gp_2024_on_11': {
        title: "Essay Paper 11 (Oct/Nov '24)",
        pdf: "",
        questions: [
            { n: '1', m: 30, l: '600-700', t: "Evaluate the view that horror movies no longer have the impact they once did.", i: ["desensitisation to violence", "evolution of horror genre", "psychological vs graphic horror", "cultural context", "audience expectations", "streaming and accessibility", "nostalgia factor"] },
            { n: '2', m: 30, l: '600-700', t: "Assess whether travelling by aeroplane is the best form of travel.", i: ["speed and efficiency", "environmental impact", "cost considerations", "comfort and convenience", "alternative transport modes", "accessibility", "safety record"] },
            { n: '3', m: 30, l: '600-700', t: "People should reduce the amount of meat they eat to protect the environment. Discuss.", i: ["carbon emissions from livestock", "deforestation for grazing", "water usage", "plant-based alternatives", "cultural dietary traditions", "nutritional considerations", "economic impact on farmers"] },
            { n: '4', m: 30, l: '600-700', t: "Improvements in society are more likely to be achieved by groups rather than individuals. To what extent do you agree with this statement?", i: ["collective action and movements", "individual leadership and innovation", "grassroots organisations", "political parties", "historical examples", "social media mobilisation", "individual vs systemic change"] },
            { n: '5', m: 30, l: '600-700', t: "Assess the view that comedy can never successfully deal with serious topics.", i: ["satire and social commentary", "humour as coping mechanism", "trivialising serious issues", "comedic traditions", "audience reception", "political comedy", "boundaries of taste"] },
            { n: '6', m: 30, l: '600-700', t: "People who obey the law have nothing to fear from surveillance. To what extent do you agree with this statement?", i: ["privacy as fundamental right", "data collection and misuse", "chilling effect on behaviour", "false positives", "government accountability", "crime prevention benefits", "totalitarian surveillance"] },
            { n: '7', m: 30, l: '600-700', t: "Creative arts have no value other than as a leisure activity. Discuss.", i: ["economic contributions of arts", "therapeutic value", "cultural identity", "education and skill development", "social commentary", "community building", "arts funding debates"] },
            { n: '8', m: 30, l: '600-700', t: "Schools should encourage students to be competitive to prepare them for adulthood. Discuss.", i: ["workplace competition", "motivation and achievement", "mental health impact", "collaboration vs competition", "sports and academics", "cultural attitudes", "building resilience"] },
            { n: '9', m: 30, l: '600-700', t: "Essential workers are not appreciated enough in your country. To what extent do you agree with this statement?", i: ["pandemic recognition", "wage disparities", "working conditions", "public perception", "government support", "essential worker categories", "long-term appreciation vs temporary applause"] },
            { n: '10', m: 30, l: '600-700', t: "Evaluate the effectiveness of the treatment of criminals in your country.", i: ["rehabilitation vs punishment", "prison conditions", "recidivism rates", "restorative justice", "community sentencing", "capital punishment debates", "support after release"] }
        ]
    },
    // --- OCT / NOV 2024 (Variant 12) ---
    'gp_2024_on_12': {
        title: "Essay Paper 12 (Oct/Nov '24)",
        pdf: "",
        questions: [
            { n: '1', m: 30, l: '600-700', t: "To what extent should people be proud of the nation they belong to?", i: ["national identity", "patriotism vs nationalism", "cultural heritage", "historical atrocities", "diversity within nations", "globalisation", "civic pride"] },
            { n: '2', m: 30, l: '600-700', t: "Mathematics has more importance in the classroom than in the outside world. Discuss.", i: ["practical applications of maths", "financial literacy", "STEM careers", "abstract vs applied maths", "everyday problem-solving", "technology doing calculations", "mathematical thinking skills"] },
            { n: '3', m: 30, l: '600-700', t: "To what extent is animal welfare everyone's responsibility?", i: ["pet ownership duties", "factory farming practices", "wildlife conservation", "government legislation", "consumer choices", "cultural attitudes to animals", "animal testing"] },
            { n: '4', m: 30, l: '600-700', t: "Evaluate how important it is for young people to spend more time with their families.", i: ["family bonds and support", "mental health benefits", "cultural values", "busy modern lifestyles", "generational differences", "peer influence vs family", "technology and family time"] },
            { n: '5', m: 30, l: '600-700', t: "Assess whether the novel or poetry is more effective in expressing how we experience life.", i: ["narrative depth of novels", "emotional intensity of poetry", "accessibility", "cultural traditions", "personal expression", "length and commitment", "literary impact"] },
            { n: '6', m: 30, l: '600-700', t: "Passengers should not have to pay for public transport in your country. Discuss.", i: ["reducing pollution and traffic", "social equity", "funding challenges", "quality of service", "economic impact", "examples of free transport", "taxpayer burden"] },
            { n: '7', m: 30, l: '600-700', t: "Evaluate the importance of the arts such as painting, drama and music in education.", i: ["creative development", "emotional expression", "cultural awareness", "career opportunities", "academic balance", "funding priorities", "STEAM vs STEM"] },
            { n: '8', m: 30, l: '600-700', t: "Assess the view that sport should be about enjoyment rather than winning.", i: ["participation vs elite sport", "mental health benefits", "commercial pressures", "sportsmanship values", "youth development", "professional athlete demands", "Olympic spirit"] },
            { n: '9', m: 30, l: '600-700', t: "To what extent is surveillance in public places essential in your country?", i: ["crime deterrence", "public safety", "privacy rights", "CCTV effectiveness", "government oversight concerns", "technology advances", "balance of security and freedom"] },
            { n: '10', m: 30, l: '600-700', t: "Examine the view that live theatre is not an accessible art form in your country.", i: ["ticket prices", "geographical access", "cultural relevance", "community theatre initiatives", "language barriers", "digital alternatives", "government support for arts"] }
        ]
    },
    // --- OCT / NOV 2024 (Variant 13) ---
    'gp_2024_on_13': {
        title: "Essay Paper 13 (Oct/Nov '24)",
        pdf: "",
        questions: [
            { n: '1', m: 30, l: '600-700', t: "To what extent are disadvantaged people prevented from participating in sport?", i: ["cost of equipment and facilities", "geographical barriers", "discrimination", "disability access", "grassroots programmes", "government funding", "social inclusion through sport"] },
            { n: '2', m: 30, l: '600-700', t: "Evaluate the usefulness of science fiction in solving current problems.", i: ["inspiring innovation", "exploring ethical dilemmas", "predicting technology", "escapism vs reality", "public engagement with science", "creative problem-solving", "cautionary tales"] },
            { n: '3', m: 30, l: '600-700', t: "No nation can be truly happy unless all its citizens are equal. Discuss.", i: ["economic equality", "social equality", "gender and racial equality", "utopian ideals", "meritocracy vs equality", "measuring happiness", "Scandinavian model"] },
            { n: '4', m: 30, l: '600-700', t: "Telling the truth is always the right thing to do. To what extent do you agree with this advice?", i: ["honesty and trust", "white lies", "consequences of truth-telling", "cultural attitudes to honesty", "professional contexts", "protective deception", "moral philosophy"] },
            { n: '5', m: 30, l: '600-700', t: "To what extent do individuals have the power to influence how your country is governed?", i: ["voting and elections", "activism and protest", "social media influence", "lobbying", "civic engagement", "political apathy", "democratic structures"] },
            { n: '6', m: 30, l: '600-700', t: "It is increasingly important that people have access to frozen fruit and vegetables. Discuss.", i: ["food preservation", "nutrition and waste reduction", "affordability", "accessibility in remote areas", "fresh vs frozen debate", "environmental impact", "food security"] },
            { n: '7', m: 30, l: '600-700', t: "To what extent do online appointments with patients improve the way doctors provide care?", i: ["accessibility improvements", "convenience for patients", "limitations of virtual diagnosis", "digital divide", "patient-doctor relationship", "data security", "pandemic legacy"] },
            { n: '8', m: 30, l: '600-700', t: "To what extent do you agree that individuals should be free to choose their work or school hours?", i: ["work-life balance", "productivity research", "flexible working benefits", "operational requirements", "inequality of access", "education structure", "cultural attitudes to working hours"] },
            { n: '9', m: 30, l: '600-700', t: "The impact of music on people's lives is always positive. Discuss.", i: ["emotional wellbeing", "cultural connection", "music therapy", "negative lyrics and influence", "noise pollution", "addiction to headphones", "community through music"] },
            { n: '10', m: 30, l: '600-700', t: "To what extent is advertising a form of art?", i: ["creative design and storytelling", "commercial intent vs artistic expression", "iconic advertisements", "manipulation and persuasion", "artistic merit debate", "advertising awards", "cultural impact"] }
        ]
    },
    // --- COMPREHENSION PAPER 21 (May/June '24) ---
    'gp_2024_mj_21': {
        title: "Comprehension Paper 21 (May/June '24)",
        pdf: "papers/8021_s24_qp_21.pdf",
        ms: "papers/8021_s24_ms_11.pdf",
        insert: "papers/8021_s24_in_21.pdf",
        questions: [
            { n: '1(a)(i)', m: 2, l: '', t: "Identify two pieces of evidence which show that Mungo uses a controlling style of leadership: with reference to only the Background", i: [] },
            { n: '1(a)(ii)', m: 2, l: '', t: "Identify two pieces of evidence which show that Mungo uses a controlling style of leadership: with reference to only the material in brackets (...) in the Extract from the morning meeting on 31 January.", i: [] },
            { n: '1(b)(i)', m: 2, l: '', t: "With reference to the Additional Information: explain why Khris addressed Mungo as Mr Martiines at the meeting", i: [] },
            { n: '1(b)(ii)', m: 2, l: '', t: "With reference to the Additional Information: explain why Gina spoke with authority at the meeting", i: [] },
            { n: '1(b)(iii)', m: 2, l: '', t: "With reference to the Additional Information: explain why Denis looked very pleased at the meeting.", i: [] },
            { n: '1(c)', m: 2, l: '', t: "With reference to the Additional Information, identify the statement made by Mungo during the meeting that was untrue. Justify your choice.", i: [] },
            { n: '1(d)(i)', m: 1, l: '', t: "For each of the three restaurants, identify one contradiction between claims made by the restaurants on their websites and opinions expressed by customers in the online reviews. (i) Feast of Frugali", i: [] },
            { n: '1(d)(ii)', m: 1, l: '', t: "For each of the three restaurants, identify one contradiction between claims made by the restaurants on their websites and opinions expressed by customers in the online reviews. (ii) Mama Ana Knows Best", i: [] },
            { n: '1(d)(iii)', m: 1, l: '', t: "For each of the three restaurants, identify one contradiction between claims made by the restaurants on their websites and opinions expressed by customers in the online reviews. (iii) Restaurant International at Hotel Gambetta", i: [] },
            { n: '1(e)', m: 8, l: '', t: "Explain the disadvantages of both the content of the voting slip and the process of how to cast a vote. Answer in continuous prose.", i: [] },
            { n: '1(f)', m: 2, l: '', t: "Explain one reason why Frugali City Life\'s readers might vote for Restaurant International at Hotel Gambetta. Do not refer to the website extract of Restaurant International at Hotel Gambetta.", i: [] },
            { n: '2(a)', m: 1, l: '', t: "Identify the reason why hula-hooping is growing in popularity once again (lines 4 to 7).", i: [] },
            { n: '2(b)', m: 4, l: '', t: "Identify the four physical benefits of hula-hooping.", i: [] },
            { n: '2(c)', m: 1, l: '', t: "Identify the financial benefit of hula-hooping.", i: [] },
            { n: '2(d)(i)', m: 1, l: '', t: "Identify the exact word in the material that means the following (lines 1 to 17): people who like, know about and appreciate a particular interest or activity", i: [] },
            { n: '2(d)(ii)', m: 1, l: '', t: "Identify the exact word in the material that means the following (lines 1 to 17): out of practice.", i: [] },
            { n: '2(e)(i)', m: 1, l: '', t: "Regarding Caitlynd Boychuk hula-hooping in the mountains: identify the reason given why she gets \'funny looks and comments from other hikers\'", i: [] },
            { n: '2(e)(ii)', m: 3, l: '', t: "Regarding Caitlynd Boychuk hula-hooping in the mountains: identify the three benefits to her mental and emotional well-being.", i: [] },
            { n: '2(f)', m: 6, l: '', t: "Explain how hula-hooping changed Fi Hull\'s life (lines 26 to 34). Answer in about 60 words.", i: [] },
            { n: '2(g)', m: 4, l: '', t: "Explain why Supriya Srivastav started playing with a hoop (lines 41 to 43). Answer using your own words as far as possible.", i: [] },
            { n: '2(h)(i)', m: 1, l: '', t: "State the exact meaning of the following three words as they are used in the material: elation (line 47)", i: [] },
            { n: '2(h)(ii)', m: 1, l: '', t: "State the exact meaning of the following three words as they are used in the material: mesmerising (line 50)", i: [] },
            { n: '2(h)(iii)', m: 1, l: '', t: "State the exact meaning of the following three words as they are used in the material: inhibition (line 59).", i: [] }
        ]
    },
    // --- COMPREHENSION PAPER 22 (May/June '24) ---
    'gp_2024_mj_22': {
        title: "Comprehension Paper 22 (May/June '24)",
        pdf: "papers/8021_s24_qp_22.pdf",
        ms: "papers/8021_s24_ms_12.pdf",
        insert: "papers/8021_s24_in_22.pdf",
        questions: [
            { n: '1(a)', m: 2, l: '', t: "With reference to the Additional Information, explain why Olivia \'refused emphatically\' to put herself forward for election, despite Mr Beppe\'s pleas.", i: [] },
            { n: '1(b)', m: 10, l: '', t: "With reference to Elisavetta\'s leaflet and the Additional Information, explain why she might not be a suitable candidate. Do not refer to Armando. Answer in continuous prose.", i: [] },
            { n: '1(c)(i)', m: 2, l: '', t: "With reference to the Additional Information, identify the exaggerated claim Armando made in his leaflet regarding his skills. Justify your choice.", i: [] },
            { n: '1(c)(ii)', m: 2, l: '', t: "With reference to the Additional Information, identify the promise Armando made in his leaflet that he would not be able to keep. Justify your choice.", i: [] },
            { n: '1(c)(iii)', m: 2, l: '', t: "With reference to the Additional Information, explain how Armando could get help from Brianna to carry out his duties as class representative if he was to be elected.", i: [] },
            { n: '1(d)', m: 2, l: '', t: "Explain why Mr Beppe might overturn the election result if Elisavetta was to be elected. Answer with reference to her question-and-answer session only.", i: [] },
            { n: '1(e)', m: 3, l: '', t: "Explain why some of the college rules might actually be abolished if Armando was to be elected. Answer with reference to his question-and-answer session only.", i: [] },
            { n: '1(f)', m: 2, l: '', t: "In your opinion, explain why the ballot boxes are placed in the college reception rather than the classrooms.", i: [] },
            { n: '2(a)', m: 3, l: '', t: "Identify three of the reasons given why chess was not very popular before millions tuned in to watch The Queen\'s Gambit series.", i: [] },
            { n: '2(b)', m: 3, l: '', t: "Explain how Allan Scott and the game of chess are similar in character. Answer in about 30 words.", i: [] },
            { n: '2(c)', m: 2, l: '', t: "Explain the origins of chess as stated in lines 12 to 16. Answer using your own words as far as possible.", i: [] },
            { n: '2(d)(i)', m: 3, l: '', t: "According to Elena Touroni, identify three different cognitive benefits of playing chess (lines 19 to 24). Answer in about 30 words.", i: [] },
            { n: '2(d)(ii)', m: 5, l: '', t: "According to Elena Touroni, identify two different reasons why mastering a skill is important (lines 25 to 32).", i: [] },
            { n: '2(e)', m: 3, l: '', t: "Describe Jon McKnight\'s current approach to playing chess (lines 37 to 45). Answer in about 30 words.", i: [] },
            { n: '2(f)', m: 2, l: '', t: "Identify two different reasons why chess is used in therapy sessions (lines 47 to 53). Answer in about 20 words.", i: [] },
            { n: '2(g)(i)', m: 1, l: '', t: "Identify the exact word or phrase in the material that means the following: steal the attention at the expense of others (lines 1 to 7)", i: [] },
            { n: '2(g)(ii)', m: 1, l: '', t: "Identify the exact word or phrase in the material that means the following: young person with exceptional qualities or abilities (lines 25 to 32)", i: [] },
            { n: '2(g)(iii)', m: 1, l: '', t: "Identify the exact word or phrase in the material that means the following: experiences from which useful knowledge or principles can be learned (lines 44 to 53)", i: [] },
            { n: '2(g)(iv)', m: 1, l: '', t: "Identify the exact word or phrase in the material that means the following: able to be successful in the end (lines 54 to 59).", i: [] }
        ]
    },
    // --- COMPREHENSION PAPER 23 (May/June '24) ---
    'gp_2024_mj_23': {
        title: "Comprehension Paper 23 (May/June '24)",
        pdf: "papers/8021_s24_qp_23.pdf",
        ms: "papers/8021_s24_ms_13.pdf",
        insert: "papers/8021_s24_in_23.pdf",
        questions: [
            { n: '1(a)', m: 1, l: '', t: "With reference to the Background, identify the Royberts\' two aims for their much-needed family break.", i: [] },
            { n: '1(b)', m: 8, l: '', t: "Considering the advantages, explain why the Royberts might choose Beautiful Breaks. Do not refer to Finton\'s Farm Tour. Answer in continuous prose.", i: [] },
            { n: '1(c)', m: 6, l: '', t: "Explain three reasons why Martina and Diego would be less likely to choose Finton\'s Farm Tour. Do not refer to Beautiful Breaks.", i: [] },
            { n: '1(d)', m: 2, l: '', t: "Explain why Lucas might like to visit Finton\'s Farm Tours. Do not refer to Beautiful Breaks.", i: [] },
            { n: '1(e)(i)', m: 2, l: '', t: "Referring only to the conversation: explain what you learn about Martina\'s character that is negative", i: [] },
            { n: '1(e)(ii)', m: 2, l: '', t: "Referring only to the conversation: explain why Diego could be described as family-orientated.", i: [] },
            { n: '1(f)', m: 2, l: '', t: "In your opinion, state two reasons why people need quality family time. Do not repeat material from Section A.", i: [] },
            { n: '1(g)', m: 2, l: '', t: "In your opinion, explain what the philosopher George Santayana meant when he said, \'The family is one of nature\'s masterpieces.\' Do not repeat answers from 1(f).", i: [] },
            { n: '2(a)(i)', m: 1, l: '', t: "With reference to the material: identify the reason why Polarstern and its crew spent nearly a year in the Arctic", i: [] },
            { n: '2(a)(ii)', m: 1, l: '', t: "With reference to the material: identify why this expedition made history.", i: [] },
            { n: '2(b)(i)', m: 1, l: '', t: "According to Esther Horvath: state what she decided to do when she returned from her first Arctic assignment", i: [] },
            { n: '2(b)(ii)', m: 2, l: '', t: "According to Esther Horvath: state why MOSAIC was different from her other polar expeditions.", i: [] },
            { n: '2(c)', m: 5, l: '', t: "Explain how the participants trained for the expedition (lines 15 to 21). Answer in about 50 words.", i: [] },
            { n: '2(d)', m: 3, l: '', t: "Explain why the author found participating in the firefighting training so difficult (lines 22 to 27). Answer using your own words as far as possible.", i: [] },
            { n: '2(e)', m: 3, l: '', t: "Identify the three problems which needed to be solved during the sea survival training.", i: [] },
            { n: '2(f)(i)', m: 2, l: '', t: "With reference to the material: explain why photographing was difficult for the author and how she overcame the issue", i: [] },
            { n: '2(f)(ii)', m: 1, l: '', t: "With reference to the material: explain why the author\'s final day as polar bear guard was particularly demanding on her eyes.", i: [] },
            { n: '2(g)', m: 2, l: '', t: "Describe what the author did when the orange signal shot into the air (lines 50 to 55). Answer in about 20 words.", i: [] },
            { n: '2(h)(i)', m: 1, l: '', t: "State the exact meaning of the following two words as they are used in the material: unsteady (line 39)", i: [] },
            { n: '2(h)(ii)', m: 1, l: '', t: "State the exact meaning of the following two words as they are used in the material: vigilant (line 59).", i: [] },
            { n: '2(i)', m: 2, l: '', t: "In your opinion, explain the benefit to people of experiencing extreme challenges. Do not repeat material from Section B.", i: [] }
        ]
    },
    // --- COMPREHENSION PAPER 21 (Oct/Nov '24) ---
    'gp_2024_on_21': {
        title: "Comprehension Paper 21 (Oct/Nov '24)",
        pdf: "papers/8021_w24_qp_21.pdf",
        ms: "papers/8021_w24_ms_11.pdf",
        insert: "papers/8021_w24_in_21.pdf",
        questions: [
            { n: '1(a)', m: 2, l: '', t: "With reference to the Additional Information, explain why Mrs Mattieu\'s statement about the sales figures in the Background is inaccurate.", i: [] },
            { n: '1(b)(i)', m: 1, l: '', t: "Regarding the design team: explain which member has the most relevant experience of toddlers", i: [] },
            { n: '1(b)(ii)', m: 1, l: '', t: "Regarding the design team: identify the reason why it was not surprising that Arno created the Dual-Purpose Racing Car", i: [] },
            { n: '1(b)(iii)', m: 1, l: '', t: "Regarding the design team: explain which member is likely to help Mrs Mattieu understand her rivals the best", i: [] },
            { n: '1(b)(iv)', m: 2, l: '', t: "Regarding the design team: identify two pieces of evidence that show Nils was not working at his best.", i: [] },
            { n: '1(c)', m: 8, l: '', t: "Explain the advantages for Monorio as a country if the Clever Chair were to be manufactured. Do not refer to the Dual-Purpose Racing Car. Answer in continuous prose.", i: [] },
            { n: '1(d)', m: 4, l: '', t: "Explain two different advantages for Monorio as a country if the Dual-Purpose Racing Car were to be manufactured. Do not refer to the Clever Chair.", i: [] },
            { n: '1(e)', m: 4, l: '', t: "With reference to the Extract from the design team meeting and the Additional Information, explain two different reasons why Mrs Mattieu might choose the Clever Chair. Do not refer to the Dual-Purpose Racing Car.", i: [] },
            { n: '1(f)', m: 2, l: '', t: "In your opinion, explain why teenagers, in particular, might exercise for only 30 minutes every day. Do not repeat any material from Section A.", i: [] },
            { n: '2(a)(i)', m: 1, l: '', t: "Identify the reason why: Gary Marr entered the perfume trade.", i: [] },
            { n: '2(a)(ii)', m: 1, l: '', t: "Identify the reason why: Gary Marr\'s employer offered to train him to make scents of his own.", i: [] },
            { n: '2(b)', m: 5, l: '', t: "Explain the differences, according to Marr, between the work needed to make fine fragrances and that needed to make fragrances for home or body care (lines 9 to 15). Answer in about 50 words using continuous prose.", i: [] },
            { n: '2(c)(i)', m: 1, l: '', t: "In your opinion: explain why airlines, in particular, perfume their air", i: [] },
            { n: '2(c)(ii)', m: 1, l: '', t: "In your opinion: explain why cinemas perfume their air specifically with the artificial scent of popcorn. Do not repeat material offered in 2(c)(i).", i: [] },
            { n: '2(d)', m: 2, l: '', t: "Explain how Marr realised that his perfumer\'s nose was becoming more sensitive (lines 23 to 25). Answer in about 20 words using continuous prose.", i: [] },
            { n: '2(e)', m: 2, l: '', t: "Explain one aspect of Marr\'s job that he does not like.", i: [] },
            { n: '2(f)(i)', m: 1, l: '', t: "From the material: identify the statement made by Firmenich that highlights the economic \'reach\' of these products", i: [] },
            { n: '2(f)(ii)', m: 2, l: '', t: "From the material: identify the two statements that highlight the financial importance of this industry. Do not repeat material offered in 2(f)(i)", i: [] },
            { n: '2(f)(iii)', m: 3, l: '', t: "From the material: identify three pieces of information indicating that it is a lengthy task to create a perfume.", i: [] },
            { n: '2(g)', m: 2, l: '', t: "Identify the two stages required when testing different versions of Magus in the laboratory.", i: [] },
            { n: '2(h)(i)', m: 1, l: '', t: "State the exact meaning of the following five words as they are used in the material: indifferent (line 32)", i: [] },
            { n: '2(h)(ii)', m: 1, l: '', t: "State the exact meaning of the following five words as they are used in the material: repelled (line 33)", i: [] },
            { n: '2(h)(iii)', m: 1, l: '', t: "State the exact meaning of the following five words as they are used in the material: morph (line 39)", i: [] },
            { n: '2(h)(iv)', m: 1, l: '', t: "State the exact meaning of the following five words as they are used in the material: consensus (line 46)", i: [] },
            { n: '2(h)(v)', m: 1, l: '', t: "State the exact meaning of the following five words as they are used in the material: droning (line 52)", i: [] }
        ]
    },
    // --- COMPREHENSION PAPER 22 (Oct/Nov '24) ---
    'gp_2024_on_22': {
        title: "Comprehension Paper 22 (Oct/Nov '24)",
        pdf: "papers/8021_w24_qp_22.pdf",
        ms: "papers/8021_w24_ms_12.pdf",
        insert: "papers/8021_w24_in_22.pdf",
        questions: [
            { n: '1(a)', m: 10, l: '', t: "Considering only the advantages, explain why the free distribution of the newspaper to all households might be successful. Do not refer to Strategy 1. Answer in continuous prose.", i: [] },
            { n: '1(b)', m: 6, l: '', t: "Explain three advantages of launching the local newspaper as an online-only publication. Do not refer to Strategy 2.", i: [] },
            { n: '1(c)', m: 2, l: '', t: "Referring to Question 2: \'How often would you access local news online?\' and its graph only, identify evidence which suggests Mr Gabriels is incorrect when claiming that \'everyone wants to access stories online\'.", i: [] },
            { n: '1(d)', m: 2, l: '', t: "Identify two pieces of the Additional Information which are the least relevant when Mr Gabriels is deciding whether to adopt Strategy 1 or Strategy 2.", i: [] },
            { n: '1(e)', m: 3, l: '', t: "Referring only to the method of data collection outlined in the material, suggest three reasons why the results might be unreliable/inaccurate.", i: [] },
            { n: '1(f)', m: 2, l: '', t: "With reference to Point 1 of the Additional Information, suggest two alternative ways for Mr Gabriels to reduce the newspaper company\'s costs. Do not refer to Strategy 1 or Strategy 2.", i: [] },
            { n: '2(a)(i)', m: 2, l: '', t: "From the material identify two reasons why Sada Mire felt she \'stood out more than usual\' in her first archaeology class at Sweden\'s Lund University.", i: [] },
            { n: '2(a)(ii)', m: 2, l: '', t: "From the material identify Sada Mire\'s feelings when the stone axe was passed to her.", i: [] },
            { n: '2(a)(iii)', m: 1, l: '', t: "From the material identify one of the goals of Sada Mire\'s new digital museum.", i: [] },
            { n: '2(b)', m: 3, l: '', t: "Referring to lines 22 to 32, describe the importance of the hominid discoveries. Answer in about 30 words using continuous prose.", i: [] },
            { n: '2(c)', m: 3, l: '', t: "Explain the significance of Heywood Walter Seton-Karr\'s finds (lines 33 to 38). Answer using your own words as far as possible.", i: [] },
            { n: '2(d)', m: 3, l: '', t: "Describe what the author learned when surveying the same area where Seton-Karr stumbled on the stone axes (lines 39 to 45). Answer using your own words as far as possible.", i: [] },
            { n: '2(e)', m: 2, l: '', t: "Identify the achievements made by the founders of the new archive.", i: [] },
            { n: '2(f)', m: 4, l: '', t: "Identify the evidence Sada Mire offers in support of her claim that the project \'is not just about the past\' (lines 54 to 64). Answer in about 40 words using continuous prose.", i: [] },
            { n: '2(g)', m: 2, l: '', t: "Identify what Sada Mire sees as the most significant impact of her digital African archive project.", i: [] },
            { n: '2(h)(i)', m: 1, l: '', t: "Using only lines 13 to 32 of the material, identify the exact word or phrase which means the following: beginning to form", i: [] },
            { n: '2(h)(ii)', m: 1, l: '', t: "Using only lines 13 to 32 of the material, identify the exact word or phrase which means the following: appeared on the scene", i: [] },
            { n: '2(h)(iii)', m: 1, l: '', t: "Using only lines 13 to 32 of the material, identify the exact word or phrase which means the following: achieved greater recognition.", i: [] }
        ]
    },
    // --- COMPREHENSION PAPER 23 (Oct/Nov '24) ---
    'gp_2024_on_23': {
        title: "Comprehension Paper 23 (Oct/Nov '24)",
        pdf: "papers/8021_w24_qp_23.pdf",
        ms: "papers/8021_w24_ms_13.pdf",
        insert: "papers/8021_w24_in_23.pdf",
        questions: [
            { n: '1(a)', m: 2, l: '', t: "Explain the one reason why a wedding reception at The Beauville Hotel could be difficult for Jasmine, Carla\'s sister.", i: [] },
            { n: '1(b)', m: 4, l: '', t: "Explain two reasons why Lydia, Max\'s mother, might prefer a wedding reception at The Beauville Hotel.", i: [] },
            { n: '1(c)', m: 4, l: '', t: "Explain two reasons why Lydia, Max\'s mother, might prefer a wedding reception at the family farm.", i: [] },
            { n: '1(d)', m: 10, l: '', t: "Explain why Henry and Matilda, Carla\'s parents, might prefer to host the wedding reception on their family farm. Do not refer to The Beauville Hotel. Answer in continuous prose.", i: [] },
            { n: '1(e)', m: 1, l: '', t: "Identify the one piece of evidence that suggests Lydia might be scared to attend a wedding reception on the family farm.", i: [] },
            { n: '1(f)', m: 2, l: '', t: "Explain one reason why a wedding reception at The Beauville Hotel might be Carla and Max\'s preferred option.", i: [] },
            { n: '1(g)', m: 2, l: '', t: "With reference to the phone conversation only, explain why Henry might be having doubts about Carla\'s engagement.", i: [] },
            { n: '2(a)', m: 2, l: '', t: "Identify two different language features used to capture the reader\'s attention (lines 1-5).", i: [] },
            { n: '2(b)(i)', m: 1, l: '', t: "Identify the exact word in the material that means the following: superficial (lines 3-9)", i: [] },
            { n: '2(b)(ii)', m: 1, l: '', t: "Identify the exact word in the material that means the following: visible (lines 10-15)", i: [] },
            { n: '2(b)(iii)', m: 1, l: '', t: "Identify the exact word in the material that means the following: flourished (lines 42-47)", i: [] },
            { n: '2(b)(iv)', m: 1, l: '', t: "Identify the exact word in the material that means the following: possibility (lines 42-47).", i: [] },
            { n: '2(c)', m: 3, l: '', t: "Explain how using fire transformed life for early humans (lines 20-27). Answer in about 30 words.", i: [] },
            { n: '2(d)(i)', m: 1, l: '', t: "Using your own words as far as possible, state the meaning of the following five phrases as they are used in the material: the talk was relatively mundane (line 28)", i: [] },
            { n: '2(d)(ii)', m: 1, l: '', t: "Using your own words as far as possible, state the meaning of the following five phrases as they are used in the material: devoted to complaints about group members (lines 29-30)", i: [] },
            { n: '2(d)(iii)', m: 1, l: '', t: "Using your own words as far as possible, state the meaning of the following five phrases as they are used in the material: some were funny, others exciting (line 31)", i: [] },
            { n: '2(d)(iv)', m: 1, l: '', t: "Using your own words as far as possible, state the meaning of the following five phrases as they are used in the material: contained information about social behaviour (line 32)", i: [] },
            { n: '2(d)(v)', m: 1, l: '', t: "Using your own words as far as possible, state the meaning of the following five phrases as they are used in the material: visited for help during times of hardship (lines 33-34).", i: [] },
            { n: '2(e)', m: 3, l: '', t: "Explain how having a campfire encouraged cooperation between early humans (lines 36-41). Answer in about 30 words.", i: [] },
            { n: '2(f)', m: 1, l: '', t: "In your opinion, suggest one way fire could occur naturally in the environment of early humans.", i: [] },
            { n: '2(g)(i)', m: 1, l: '', t: "Contrast the effects on volunteers when they watched a video of a campfire and a static upside-down image of a fire.", i: [] },
            { n: '2(g)(ii)', m: 1, l: '', t: "Identify another factor that affected blood pressure in the same experiment.", i: [] },
            { n: '2(h)', m: 2, l: '', t: "Explain the possible link between watching flickering flames and dramatic scene-cuts in movies.", i: [] },
            { n: '2(i)', m: 3, l: '', t: "In your opinion, suggest one example of a negative effect of watching television. Justify your choice. Do not repeat material from Section B.", i: [] }
        ]
    },

    // --- COMPREHENSION PAPER 21 (OCT/NOV '25) ---
    'gp_2025_on_21': {
        title: "Comprehension Paper 21 (Oct/Nov '25)",
        pdf: "papers/8021_w25_qp_21.pdf",
        ms: "papers/8021_w25_ms_11.pdf",
        insert: "papers/8021_w25_in_21.pdf",
        questions: [
            { n: '1(a)', m: 2, l: '', t: 'With reference to the Background and the Additional Information only, identify two pieces of evidence showing that Ereeka might not have the necessary experience to organise a \'memorable\' press launch.', i: [] },
            { n: '1(b)', m: 1, l: '', t: 'Identify the disadvantage with The Beeches.', i: [] },
            { n: '1(c)', m: 1, l: '', t: 'Identify the likely date for the press launch.', i: [] },
            { n: '1(d)', m: 3, l: '', t: 'Explain why Ereeka will have to ask Caradoc Schmidt for an increased budget for the press launch.', i: [] },
            { n: '1(e)', m: 8, l: '', t: 'Apart from the cost, explain the disadvantages of The Tuila Hotel and Conference Centre as a venue for the press launch. Answer in continuous prose.', i: [] },
            { n: '1(f)', m: 3, l: '', t: 'Explain why working with Orlando Teeme has been a particularly stressful time for Klaus, the Director of Manufacturing.', i: [] },
            { n: '1(g)', m: 1, l: '', t: 'With reference to the Additional Information, identify the reason why Caradoc Schmidt might soon regret linking his company\'s reputation with that of Orlando Teeme.', i: [] },
            { n: '1(h)', m: 4, l: '', t: 'In your opinion, explain why, as Schmidt + Daughters Tableware has its own design team, Caradoc Schmidt asked Orlando Teeme to design a product range for them.', i: [] },
            { n: '1(i)', m: 2, l: '', t: 'In your opinion, suggest why celebrities feel the need to be chauffeured in limousines.', i: [] },
            { n: '2(a)', m: 1, l: '', t: 'Identify when lulia Bochis started to become interested in illustrations, specifically.', i: [] },
            { n: '2(b)(i)', m: 1, l: '', t: 'Using your own words as far as possible, explain the meaning of the following five phrases as used in the material: \'something changed in me\' (lines 9-10)', i: [] },
            { n: '2(b)(ii)', m: 1, l: '', t: 'Using your own words as far as possible, explain the meaning of the following five phrases as used in the material: \'felt a strong desire to travel\' (line 10)', i: [] },
            { n: '2(b)(iii)', m: 1, l: '', t: 'Using your own words as far as possible, explain the meaning of the following five phrases as used in the material: \'obstacles that got in the way\' (line 12)', i: [] },
            { n: '2(b)(iv)', m: 1, l: '', t: 'Using your own words as far as possible, explain the meaning of the following five phrases as used in the material: \'after much deliberation\' (line 12)', i: [] },
            { n: '2(b)(v)', m: 1, l: '', t: 'Using your own words as far as possible, explain the meaning of the following five phrases as used in the material: \'there wasn\'t a better moment than "now"\' (lines 12-13).', i: [] },
            { n: '2(c)(i)', m: 1, l: '', t: 'Identify the exact word or phrase in the material which means the following: life-changing (lines 9-18)', i: [] },
            { n: '2(c)(ii)', m: 1, l: '', t: 'Identify the exact word or phrase in the material which means the following: imagination (lines 20-25)', i: [] },
            { n: '2(c)(iii)', m: 1, l: '', t: 'Identify the exact word or phrase in the material which means the following: affect emotionally (lines 20-25)', i: [] },
            { n: '2(c)(iv)', m: 1, l: '', t: 'Identify the exact word or phrase in the material which means the following: remedy (lines 29-34)', i: [] },
            { n: '2(c)(v)', m: 1, l: '', t: 'Identify the exact word or phrase in the material which means the following: encouraging (lines 44-56).', i: [] },
            { n: '2(d)(i)', m: 1, l: '', t: 'Regarding lulia\'s site: describe what makes her feel humble', i: [] },
            { n: '2(d)(ii)', m: 1, l: '', t: 'Regarding lulia\'s site: identify the comparison she makes to describe her site.', i: [] },
            { n: '2(e)', m: 2, l: '', t: 'According to lulia, identify one advantage and one disadvantage of an easily accessible virtual world.', i: [] },
            { n: '2(f)', m: 5, l: '', t: 'Explain the structure of lulia\'s book (lines 44-52). Answer in about 50 words using continuous prose.', i: [] },
            { n: '2(g)(i)', m: 1, l: '', t: 'State the exact meaning of the following five words as they are used in the material: thought-provoking (line 7)', i: [] },
            { n: '2(g)(ii)', m: 1, l: '', t: 'State the exact meaning of the following five words as they are used in the material: perspective (line 20)', i: [] },
            { n: '2(g)(iii)', m: 1, l: '', t: 'State the exact meaning of the following five words as they are used in the material: resilient (line 26)', i: [] },
            { n: '2(g)(iv)', m: 1, l: '', t: 'State the exact meaning of the following five words as they are used in the material: solace (line 31)', i: [] },
            { n: '2(g)(v)', m: 1, l: '', t: 'State the exact meaning of the following five words as they are used in the material: superficial (line 35).', i: [] }
        ]
    },
    // --- COMPREHENSION PAPER 22 (OCT/NOV '25) ---
    'gp_2025_on_22': {
        title: "Comprehension Paper 22 (Oct/Nov '25)",
        pdf: "papers/8021_w25_qp_22.pdf",
        ms: "papers/8021_w25_ms_12.pdf",
        insert: "papers/8021_w25_in_22.pdf",
        questions: [
            { n: '1(a)', m: 2, l: '', t: 'Explain how Sarantown University would be more likely to recover the building costs if they were to choose Sarantown Select\'s proposal.', i: [] },
            { n: '1(b)(i)', m: 1, l: '', t: 'With reference to the Additional Information only: state the one piece of information which suggests that Georg Walters\' claim to offer \'fully costed construction plans\' might be untrue.', i: [] },
            { n: '1(b)(ii)', m: 2, l: '', t: 'With reference to the Additional Information only: state two pieces of information which suggest that tourists may not wish to stay in the new building.', i: [] },
            { n: '1(c)', m: 10, l: '', t: 'Apart from financial reasons, explain why Bilal Mendes-Smith is more likely to choose Sarantown Select to design the new student accommodation block. Do not refer to Barton Build. Answer in continuous prose.', i: [] },
            { n: '1(d)', m: 8, l: '', t: 'Apart from any financial considerations, explain four reasons which suggest that Georg Walters has not read the contract brief properly. Do not refer to Sarantown Select.', i: [] },
            { n: '1(e)', m: 2, l: '', t: 'Explain how Bilal Mendes-Smith could have made the contract brief more specific.', i: [] },
            { n: '2(a)', m: 3, l: '', t: 'Identify three different informal language features in lines 1-3.', i: [] },
            { n: '2(b)', m: 3, l: '', t: 'Identify three reasons why an individual might consider quiet quitting (lines 9-16). Answer in about 30 words using continuous prose.', i: [] },
            { n: '2(c)', m: 4, l: '', t: 'Identify four of the ways in which the working from home (WFH) phenomenon has changed people\'s attitudes to work and leisure time.', i: [] },
            { n: '2(d)(i)', m: 1, l: '', t: 'Using your own words as far as possible, state the meaning of the following five phrases, as they are used in the material: most of us are eager to please (line 31)', i: [] },
            { n: '2(d)(ii)', m: 1, l: '', t: 'Using your own words as far as possible, state the meaning of the following five phrases, as they are used in the material: even more so if we like our boss (line 32)', i: [] },
            { n: '2(d)(iii)', m: 1, l: '', t: 'Using your own words as far as possible, state the meaning of the following five phrases, as they are used in the material: those who choose not to join in may be criticised (line 33)', i: [] },
            { n: '2(d)(iv)', m: 1, l: '', t: 'Using your own words as far as possible, state the meaning of the following five phrases, as they are used in the material: existing issues are never addressed (line 40)', i: [] },
            { n: '2(d)(v)', m: 1, l: '', t: 'Using your own words as far as possible, state the meaning of the following five phrases, as they are used in the material: further burdens your colleagues (lines 41-42).', i: [] },
            { n: '2(e)(i)', m: 1, l: '', t: 'Identify the exact word or phrase in the material which means the following: withdrawing (from) (lines 1-13)', i: [] },
            { n: '2(e)(ii)', m: 1, l: '', t: 'Identify the exact word or phrase in the material which means the following: sidelined (lines 30-43)', i: [] },
            { n: '2(e)(iii)', m: 1, l: '', t: 'Identify the exact word or phrase in the material which means the following: (to) stop working (lines 39-57)', i: [] },
            { n: '2(e)(iv)', m: 1, l: '', t: 'Identify the exact word or phrase in the material which means the following: mutinous (lines 50-60)', i: [] },
            { n: '2(e)(v)', m: 1, l: '', t: 'Identify the exact word or phrase in the material which means the following: harmful (lines 50-60)', i: [] },
            { n: '2(e)(vi)', m: 1, l: '', t: 'Identify the exact word or phrase in the material which means the following: (to) work beyond expectations (lines 61-71).', i: [] },
            { n: '2(f)', m: 2, l: '', t: 'In your opinion, suggest one example of a reward an employee might be able to negotiate with their supervisor. Justify your response.', i: [] },
            { n: '2(g)', m: 2, l: '', t: 'In your opinion, explain what is meant by the following quotation: \'You can\'t change someone who doesn\'t see an issue in their actions\' (Unknown). Do not repeat any material from Section B.', i: [] }
        ]
    },
    // --- COMPREHENSION PAPER 23 (OCT/NOV '25) ---
    'gp_2025_on_23': {
        title: "Comprehension Paper 23 (Oct/Nov '25)",
        pdf: "papers/8021_w25_qp_23.pdf",
        ms: "papers/8021_w25_ms_13.pdf",
        insert: "papers/8021_w25_in_23.pdf",
        questions: [
            { n: '1(a)', m: 2, l: '', t: 'According to the Background, identify the two main reasons for the increase in the volume of traffic.', i: [] },
            { n: '1(b)(i)', m: 2, l: '', t: 'With reference to Option A: explain the problem for the taxi drivers. Do not refer to Option B.', i: [] },
            { n: '1(b)(ii)', m: 2, l: '', t: 'With reference to Option A: explain the advantages for the tourists. Do not refer to Option B.', i: [] },
            { n: '1(c)', m: 10, l: '', t: 'Explain the advantages and one disadvantage for students if Option B were chosen. Do not refer to Option A. Answer in continuous prose.', i: [] },
            { n: '1(d)', m: 2, l: '', t: 'Explain why Option B may create a problem for the residents of Battax.', i: [] },
            { n: '1(e)', m: 2, l: '', t: 'Explain why the engineering department\'s accreditation application may not be successful.', i: [] },
            { n: '1(f)', m: 3, l: '', t: 'Identify three reasons why the student questionnaire feedback may not provide accurate data.', i: [] },
            { n: '1(g)', m: 2, l: '', t: 'In your opinion, explain one way a busy town could reduce the amount of traffic. Do not repeat any material from Section A.', i: [] },
            { n: '2(a)(i)', m: 1, l: '', t: 'Identify the exact word in the material which means the following: shared (lines 3-7)', i: [] },
            { n: '2(a)(ii)', m: 1, l: '', t: 'Identify the exact word in the material which means the following: acknowledged (lines 9-14)', i: [] },
            { n: '2(a)(iii)', m: 1, l: '', t: 'Identify the exact word in the material which means the following: (to) control (lines 15-20).', i: [] },
            { n: '2(b)', m: 1, l: '', t: 'Identify one of the benefits for the volunteers who ate a large breakfast.', i: [] },
            { n: '2(c)', m: 1, l: '', t: 'According to Brady Holmer, state one of the problems caused by missing breakfast.', i: [] },
            { n: '2(d)', m: 5, l: '', t: 'Explain why going for a walk \'might be good advice\' (lines 26-29). Answer using your own words as far as possible.', i: [] },
            { n: '2(e)(i)', m: 1, l: '', t: 'Explain the benefit for a person who achieved seven to eight hours of sleep.', i: [] },
            { n: '2(e)(ii)', m: 3, l: '', t: 'Identify the three disadvantages for people who lacked sleep (lines 38-41). Answer in about 30 words using continuous prose.', i: [] },
            { n: '2(e)(iii)', m: 3, l: '', t: 'According to Steve Magness, identify three different ways we can improve the way we sleep.', i: [] },
            { n: '2(f)', m: 2, l: '', t: 'Explain why Brady Holmer says, \'The five servings recommendation is sound advice, but also somewhat arbitrary\' (lines 50-53). Answer in about 20 words using continuous prose.', i: [] },
            { n: '2(g)', m: 2, l: '', t: 'Identify the two different reasons why \'the recommendation to drink two litres of water a day is not based on hard science\' (lines 58-64). Answer in about 20 words using continuous prose.', i: [] },
            { n: '2(h)(i)', m: 1, l: '', t: 'State the exact meaning of the following four phrases as they are used in the material: (to) sift fact from fiction (lines 1-2)', i: [] },
            { n: '2(h)(ii)', m: 1, l: '', t: 'State the exact meaning of the following four phrases as they are used in the material: (the) bottom line (line 21)', i: [] },
            { n: '2(h)(iii)', m: 1, l: '', t: 'State the exact meaning of the following four phrases as they are used in the material: stepping up the pace (line 29)', i: [] },
            { n: '2(h)(iv)', m: 1, l: '', t: 'State the exact meaning of the following four phrases as they are used in the material: cognitive decline (line 54).', i: [] }
        ]
    },
    // --- COMPREHENSION PAPER 22 (FEB/MARCH '25) ---
    'gp_2025_fm_22': {
        title: "Comprehension Paper 22 (Feb/March '25)",
        pdf: "papers/8021_m25_qp_22.pdf",
        ms: "papers/8021_m25_ms_12.pdf",
        insert: "papers/8021_m25_in_22.pdf",
        questions: [
            { n: '1(a)', m: 10, l: '', t: 'Considering the advantages, explain why the commemorative statue is more likely to be chosen. Do not refer to the new road bridge. Answer in continuous prose.', i: [] },
            { n: '1(b)', m: 6, l: '', t: 'Explain three disadvantages of choosing the new road bridge. Do not refer to the commemorative statue.', i: [] },
            { n: '1(c)(i)', m: 1, l: '', t: 'With reference to the Additional Information only, state the one piece of information which is the least relevant when deciding which proposal to choose.', i: [] },
            { n: '1(c)(ii)', m: 1, l: '', t: 'With reference to the Additional Information only, state the one piece of information which suggests that Justina\'s claim that \'decision-makers in Mosman have done absolutely nothing to help us here\' is untrue.', i: [] },
            { n: '1(d)(i)', m: 2, l: '', t: 'With reference to the television interview extracts only, explain why Justina has a vested interest in favouring the new road bridge.', i: [] },
            { n: '1(d)(ii)', m: 1, l: '', t: 'With reference to the television interview extracts only, identify the comment by Bernardo which supports Justina\'s claim that her \'region is too often neglected\'.', i: [] },
            { n: '1(e)', m: 4, l: '', t: 'In your opinion, explain two possible problems with the format of the proposed referendum, as outlined in the Background.', i: [] },
            { n: '2(a)(i)', m: 2, l: '', t: 'Identify two of the main aims of Operation Mincemeat during the Second World War, as stated in lines 1-6.', i: [] },
            { n: '2(a)(ii)', m: 2, l: '', t: 'Identify two reasons given for the success of the deception (lines 9-13). Answer in about 20 words using continuous prose.', i: [] },
            { n: '2(b)', m: 3, l: '', t: 'Suggest what each of the three pieces of \'wallet litter\' was intended to show about \'Major Martin\' (lines 19-25). Answer in about 30 words using continuous prose.', i: [] },
            { n: '2(c)', m: 4, l: '', t: 'Explain why Macintyre uses the term \'hidden hero\' in connection with the people who devised the plan (lines 26-29). Answer using your own words as far as possible.', i: [] },
            { n: '2(d)', m: 2, l: '', t: 'Explain the importance of creativity in Operation Mincemeat (lines 30-35). Answer in about 40 words using continuous prose.', i: [] },
            { n: '2(e)', m: 2, l: '', t: 'Identify the two ways in which the theatre company updated the story for modern audiences (lines 43-48). Answer in about 20 words using continuous prose.', i: [] },
            { n: '2(f)(i)', m: 2, l: '', t: 'Explain how creating Martin could be seen as \'morally doubtful\' (lines 49-51). Answer using your own words as far as possible.', i: [] },
            { n: '2(f)(ii)', m: 2, l: '', t: 'Explain how Michelle Ashford justifies \'the less ethical aspects of the story\' (lines 56-59). Answer using your own words as far as possible.', i: [] },
            { n: '2(g)', m: 3, l: '', t: 'Explain the present-day justifications offered for having used the dead man in Operation Mincemeat.', i: [] },
            { n: '2(h)(i)', m: 1, l: '', t: 'Referring to lines 14-25 only, identify the exact word or phrase in the material which means: impeded', i: [] },
            { n: '2(h)(ii)', m: 1, l: '', t: 'Referring to lines 14-25 only, identify the exact word or phrase in the material which means: wily', i: [] },
            { n: '2(h)(iii)', m: 1, l: '', t: 'Referring to lines 14-25 only, identify the exact word or phrase in the material which means: appropriate for.', i: [] }
        ]
    },
    // --- COMPREHENSION PAPER 22 (FEB/MARCH '24) ---
    'gp_2024_fm_22': {
        title: "Comprehension Paper 22 (Feb/March '24)",
        pdf: "papers/8021_m24_qp_22.pdf",
        ms: "papers/8021_m24_ms_12.pdf",
        insert: "papers/8021_m24_in_22.pdf",
        questions: [
            { n: '1(a)', m: 10, l: '', t: 'Considering the advantages and one disadvantage, explain why Francesca is most likely to choose the zoo trip. Do not refer to the other celebration ideas. Answer in continuous prose.', i: [] },
            { n: '1(b)(i)', m: 4, l: '', t: 'Explain two reasons why Antony and Maria might like the luxury hotel weekend. Do not refer to the other celebration ideas.', i: [] },
            { n: '1(b)(ii)', m: 4, l: '', t: 'Explain two reasons why Antony and Maria might not like the surprise party. Do not refer to the other celebration ideas.', i: [] },
            { n: '1(c)', m: 1, l: '', t: 'State the one piece of the Additional Information provided which is the least relevant when Francesca is deciding which celebration to organise.', i: [] },
            { n: '1(d)(i)', m: 2, l: '', t: 'Using only evidence from Katarina\'s email: justify James\'s claim that Katarina likes to tell other people what to do', i: [] },
            { n: '1(d)(ii)', m: 2, l: '', t: 'Using only evidence from Katarina\'s email: justify James\'s claim that Katarina is not telling the truth when saying she cannot contribute financially', i: [] },
            { n: '1(d)(iii)', m: 2, l: '', t: 'Using only evidence from Katarina\'s email: justify James\'s claim that Katarina will not help with the organisation.', i: [] },
            { n: '2(a)', m: 2, l: '', t: 'Identify how American prisons have been portrayed in some films and on TV.', i: [] },
            { n: '2(b)', m: 1, l: '', t: 'Identify Brian Roettinger\'s goal in running art classes for prisoners in California.', i: [] },
            { n: '2(c)(i)', m: 1, l: '', t: 'Using only lines 1 to 18 of the material, identify the exact word which means the following: to redefine', i: [] },
            { n: '2(c)(ii)', m: 1, l: '', t: 'Using only lines 1 to 18 of the material, identify the exact word which means the following: partnership', i: [] },
            { n: '2(c)(iii)', m: 1, l: '', t: 'Using only lines 1 to 18 of the material, identify the exact word which means the following: reflective self-awareness.', i: [] },
            { n: '2(d)', m: 5, l: '', t: 'Explain why Willo Perron believes \'in the transformative power of art and the redemptive potential of self-expression\' for prisoners (lines 25 to 31). Answer using your own words as far as possible.', i: [] },
            { n: '2(e)', m: 5, l: '', t: 'According to Perron, explain how the duo\'s proposed arts programme demonstrates their views relating to prison reform (lines 32 to 44). Answer in about 50 words.', i: [] },
            { n: '2(f)', m: 3, l: '', t: 'According to Annie Buckley, identify the \'overwhelmingly positive\' features of the guest artist programme for prisoners (lines 45 to 55). Answer in about 30 words.', i: [] },
            { n: '2(g)', m: 2, l: '', t: 'Suggest why Buckley might find the example of the prisoner\'s daughter \'powerful\'.', i: [] },
            { n: '2(h)', m: 2, l: '', t: 'Explain why the organisers of the arts programme do not ask prisoners \'why they\'re there or what they\'ve done\' (lines 59 to 64). Answer in about 20 words.', i: [] },
            { n: '2(i)', m: 2, l: '', t: 'In your opinion, explain why art therapy for prisoners might not be successful.', i: [] }
        ]
    },
});

// === 2. THE VISUAL CARDS ===
const gpCardsP1 = `
    <div style="text-align:center; margin-bottom:30px;">
        <h2 style="font-size:2rem; color:var(--lime-dark); font-family:'Playfair Display', serif;">🌍 General Paper</h2>
        <p style="color:#666;">Paper 1: Essay Questions (30 Marks)</p>
    </div>
    
    <div class="series-header"><div class="year-big">2025</div><div class="series-name">Oct / Nov Series</div></div>
    <div class="papers-grid">
        <div class="paper-card" onclick="openPaper('gp_2025_on_11')">
            <span class="paper-tag">8021/11</span>
            <h3>Oct/Nov '25</h3>
            <p style="color:#888; margin-top:5px;">10 Questions</p>
        </div>
        <div class="paper-card" onclick="openPaper('gp_2025_on_12')">
            <span class="paper-tag">8021/12</span>
            <h3>Oct/Nov '25</h3>
            <p style="color:#888; margin-top:5px;">10 Questions</p>
        </div>
        <div class="paper-card" onclick="openPaper('gp_2025_on_13')">
            <span class="paper-tag">8021/13</span>
            <h3>Oct/Nov '25</h3>
            <p style="color:#888; margin-top:5px;">10 Questions</p>
        </div>
    </div>

    <div class="series-header"><div class="year-big">2025</div><div class="series-name">May / June Series</div></div>
    <div class="papers-grid">
        <div class="paper-card" onclick="openPaper('gp_2025_mj_11')">
            <span class="paper-tag">8021/11</span>
            <h3>May/June '25</h3>
            <p style="color:#888; margin-top:5px;">10 Questions</p>
        </div>
        <div class="paper-card" onclick="openPaper('gp_2025_mj_12')">
            <span class="paper-tag">8021/12</span>
            <h3>May/June '25</h3>
            <p style="color:#888; margin-top:5px;">10 Questions</p>
        </div>
        <div class="paper-card" onclick="openPaper('gp_2025_mj_13')">
            <span class="paper-tag">8021/13</span>
            <h3>May/June '25</h3>
            <p style="color:#888; margin-top:5px;">10 Questions</p>
        </div>
    </div>

    <div class="series-header"><div class="year-big">2025</div><div class="series-name">Feb / March Series</div></div>
    <div class="papers-grid">
        <div class="paper-card" onclick="openPaper('gp_2025_fm_12')">
            <span class="paper-tag">8021/12</span>
            <h3>Feb/March '25</h3>
            <p style="color:#888; margin-top:5px;">10 Questions</p>
        </div>
    </div>


    <!-- 2025 PAPERS -->
    <div class="series-header"><div class="year-big">2025</div><div class="series-name">Oct / Nov Series</div></div>
    <div class="papers-grid">
        <div class="paper-card" onclick="openPaper('gp_2025_on_21')">
            <span class="paper-tag">8021/21</span>
            <h3>Oct/Nov '25</h3>
            <p style="color:#888; margin-top:5px;">29 Questions</p>
        </div>
        <div class="paper-card" onclick="openPaper('gp_2025_on_22')">
            <span class="paper-tag">8021/22</span>
            <h3>Oct/Nov '25</h3>
            <p style="color:#888; margin-top:5px;">22 Questions</p>
        </div>
        <div class="paper-card" onclick="openPaper('gp_2025_on_23')">
            <span class="paper-tag">8021/23</span>
            <h3>Oct/Nov '25</h3>
            <p style="color:#888; margin-top:5px;">23 Questions</p>
        </div>
    </div>
    <div class="series-header"><div class="year-big">2025</div><div class="series-name">Feb / March Series</div></div>
    <div class="papers-grid">
        <div class="paper-card" onclick="openPaper('gp_2025_fm_22')">
            <span class="paper-tag">8021/22</span>
            <h3>Feb/March '25</h3>
            <p style="color:#888; margin-top:5px;">19 Questions</p>
        </div>
    </div>
    <!-- 2024 PAPERS -->
    <div class="series-header"><div class="year-big">2024</div><div class="series-name">Oct / Nov Series</div></div>
    <div class="papers-grid">
        <div class="paper-card" onclick="openPaper('gp_2024_on_11')">
            <span class="paper-tag">8021/11</span>
            <h3>Oct/Nov '24</h3>
            <p style="color:#888; margin-top:5px;">10 Questions</p>
        </div>
        <div class="paper-card" onclick="openPaper('gp_2024_on_12')">
            <span class="paper-tag">8021/12</span>
            <h3>Oct/Nov '24</h3>
            <p style="color:#888; margin-top:5px;">10 Questions</p>
        </div>
        <div class="paper-card" onclick="openPaper('gp_2024_on_13')">
            <span class="paper-tag">8021/13</span>
            <h3>Oct/Nov '24</h3>
            <p style="color:#888; margin-top:5px;">10 Questions</p>
        </div>
    </div>

    <div class="series-header"><div class="year-big">2024</div><div class="series-name">May / June Series</div></div>
    <div class="papers-grid">
        <div class="paper-card" onclick="openPaper('gp_2024_mj_11')">
            <span class="paper-tag">8021/11</span>
            <h3>May/June '24</h3>
            <p style="color:#888; margin-top:5px;">10 Questions</p>
        </div>
        <div class="paper-card" onclick="openPaper('gp_2024_mj_12')">
            <span class="paper-tag">8021/12</span>
            <h3>May/June '24</h3>
            <p style="color:#888; margin-top:5px;">10 Questions</p>
        </div>
        <div class="paper-card" onclick="openPaper('gp_2024_mj_13')">
            <span class="paper-tag">8021/13</span>
            <h3>May/June '24</h3>
            <p style="color:#888; margin-top:5px;">10 Questions</p>
        </div>
    </div>

    <div class="series-header"><div class="year-big">2024</div><div class="series-name">Feb / March Series</div></div>
    <div class="papers-grid">
        <div class="paper-card" onclick="openPaper('gp_2024_fm_12')">
            <span class="paper-tag">8021/12</span>
            <h3>Feb/March '24</h3>
            <p style="color:#888; margin-top:5px;">10 Questions</p>
        </div>
    </div>
`;

const gpCardsP2 = `
    <div style="text-align:center; margin-bottom:30px;">
        <h2 style="font-size:2rem; color:var(--lime-dark); font-family:'Playfair Display', serif;">📰 General Paper</h2>
        <p style="color:#666;">Paper 2: Comprehension (50 Marks)</p>
    </div>


    <!-- 2025 PAPERS -->
    <div class="series-header"><div class="year-big">2025</div><div class="series-name">Oct / Nov Series</div></div>
    <div class="papers-grid">
        <div class="paper-card" onclick="openPaper('gp_2025_on_21')">
            <span class="paper-tag">8021/21</span>
            <h3>Oct/Nov '25</h3>
            <p style="color:#888; margin-top:5px;">29 Questions</p>
        </div>
        <div class="paper-card" onclick="openPaper('gp_2025_on_22')">
            <span class="paper-tag">8021/22</span>
            <h3>Oct/Nov '25</h3>
            <p style="color:#888; margin-top:5px;">22 Questions</p>
        </div>
        <div class="paper-card" onclick="openPaper('gp_2025_on_23')">
            <span class="paper-tag">8021/23</span>
            <h3>Oct/Nov '25</h3>
            <p style="color:#888; margin-top:5px;">23 Questions</p>
        </div>
    </div>
    <div class="series-header"><div class="year-big">2025</div><div class="series-name">Feb / March Series</div></div>
    <div class="papers-grid">
        <div class="paper-card" onclick="openPaper('gp_2025_fm_22')">
            <span class="paper-tag">8021/22</span>
            <h3>Feb/March '25</h3>
            <p style="color:#888; margin-top:5px;">19 Questions</p>
        </div>
    </div>
    <!-- 2024 PAPERS -->
    <div class="series-header"><div class="year-big">2024</div><div class="series-name">Oct / Nov Series</div></div>
    <div class="papers-grid">
        <div class="paper-card" onclick="openPaper('gp_2024_on_21')">
            <span class="paper-tag">8021/21</span>
            <h3>Oct/Nov '24</h3>
            <p style="color:#888; margin-top:5px;">25 Questions</p>
        </div>
        <div class="paper-card" onclick="openPaper('gp_2024_on_22')">
            <span class="paper-tag">8021/22</span>
            <h3>Oct/Nov '24</h3>
            <p style="color:#888; margin-top:5px;">18 Questions</p>
        </div>
        <div class="paper-card" onclick="openPaper('gp_2024_on_23')">
            <span class="paper-tag">8021/23</span>
            <h3>Oct/Nov '24</h3>
            <p style="color:#888; margin-top:5px;">24 Questions</p>
        </div>
    </div>
    <div class="series-header"><div class="year-big">2024</div><div class="series-name">May / June Series</div></div>
    <div class="papers-grid">
        <div class="paper-card" onclick="openPaper('gp_2024_mj_21')">
            <span class="paper-tag">8021/21</span>
            <h3>May/June '24</h3>
            <p style="color:#888; margin-top:5px;">23 Questions</p>
        </div>
        <div class="paper-card" onclick="openPaper('gp_2024_mj_22')">
            <span class="paper-tag">8021/22</span>
            <h3>May/June '24</h3>
            <p style="color:#888; margin-top:5px;">19 Questions</p>
        </div>
        <div class="paper-card" onclick="openPaper('gp_2024_mj_23')">
            <span class="paper-tag">8021/23</span>
            <h3>May/June '24</h3>
            <p style="color:#888; margin-top:5px;">21 Questions</p>
        </div>
    </div>
    <div class="series-header"><div class="year-big">2024</div><div class="series-name">Feb / March Series</div></div>
    <div class="papers-grid">
        <div class="paper-card" onclick="openPaper('gp_2024_fm_22')">
            <span class="paper-tag">8021/22</span>
            <h3>Feb/March '24</h3>
            <p style="color:#888; margin-top:5px;">18 Questions</p>
        </div>
    </div>
`;

// === 3. INJECT INTO INDEX.HTML IMMEDIATELY ===
const gpContainerP1 = document.getElementById('container-general-p1');
if (gpContainerP1) {
    gpContainerP1.innerHTML = gpCardsP1;
}

const gpContainerP2 = document.getElementById('container-general-p2');
if (gpContainerP2) {
    gpContainerP2.innerHTML = gpCardsP2;
}