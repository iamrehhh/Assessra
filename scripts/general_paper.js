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
    // --- FEBRUARY / MARCH 2024 (Variant 12) ---
    'gp_2024_fm_12': {
        title: "Essay Paper 12 (Feb/March '24)",
        pdf: "", // No PDF yet
        questions: Array.from({ length: 10 }, (_, i) => ({
            n: (i + 1).toString(), m: 30, l: '600-700',
            t: `Question ${i + 1} text pending...`,
            i: ["Point 1", "Point 2"]
        }))
    },

    // --- MAY / JUNE 2024 (Variant 11) ---
    'gp_2024_mj_11': {
        title: "Essay Paper 11 (May/June '24)",
        pdf: "",
        questions: Array.from({ length: 10 }, (_, i) => ({
            n: (i + 1).toString(), m: 30, l: '600-700',
            t: `Question ${i + 1} text pending...`,
            i: ["Point 1", "Point 2"]
        }))
    },
    // --- MAY / JUNE 2024 (Variant 12) ---
    'gp_2024_mj_12': {
        title: "Essay Paper 12 (May/June '24)",
        pdf: "",
        questions: Array.from({ length: 10 }, (_, i) => ({
            n: (i + 1).toString(), m: 30, l: '600-700',
            t: `Question ${i + 1} text pending...`,
            i: ["Point 1", "Point 2"]
        }))
    },
    // --- MAY / JUNE 2024 (Variant 13) ---
    'gp_2024_mj_13': {
        title: "Essay Paper 13 (May/June '24)",
        pdf: "",
        questions: Array.from({ length: 10 }, (_, i) => ({
            n: (i + 1).toString(), m: 30, l: '600-700',
            t: `Question ${i + 1} text pending...`,
            i: ["Point 1", "Point 2"]
        }))
    },

    // --- OCT / NOV 2024 (Variant 11) ---
    'gp_2024_on_11': {
        title: "Essay Paper 11 (Oct/Nov '24)",
        pdf: "",
        questions: Array.from({ length: 10 }, (_, i) => ({
            n: (i + 1).toString(), m: 30, l: '600-700',
            t: `Question ${i + 1} text pending...`,
            i: ["Point 1", "Point 2"]
        }))
    },
    // --- OCT / NOV 2024 (Variant 12) ---
    'gp_2024_on_12': {
        title: "Essay Paper 12 (Oct/Nov '24)",
        pdf: "",
        questions: Array.from({ length: 10 }, (_, i) => ({
            n: (i + 1).toString(), m: 30, l: '600-700',
            t: `Question ${i + 1} text pending...`,
            i: ["Point 1", "Point 2"]
        }))
    },
    // --- OCT / NOV 2024 (Variant 13) ---
    'gp_2024_on_13': {
        title: "Essay Paper 13 (Oct/Nov '24)",
        pdf: "",
        questions: Array.from({ length: 10 }, (_, i) => ({
            n: (i + 1).toString(), m: 30, l: '600-700',
            t: `Question ${i + 1} text pending...`,
            i: ["Point 1", "Point 2"]
        }))
    }
}
});

// === 2. THE VISUAL CARDS ===
const gpCardsP1 = `
    <div style="text-align:center; margin-bottom:30px;">
        <h2 style="font-size:2rem; color:var(--lime-dark); font-family:'Playfair Display', serif;">🌍 General Paper</h2>
        <p style="color:#666;">Paper 1: Essay Questions (30 Marks)</p>
    </div>
    
    <div class="series-header"><div class="year-big">2025</div><div class="series-name">Key Series</div></div>
    <div class="papers-grid">
        <div class="paper-card" onclick="openPaper('gp_2025_fm_12')">
            <span class="paper-tag">8021/12</span>
            <h3>Feb/March '25</h3>
            <p style="color:#888; margin-top:5px;">10 Questions</p>
        </div>
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

    <!-- 2024 PAPERS -->
    <div class="series-header"><div class="year-big">2024</div><div class="series-name">All Series</div></div>
    <div class="papers-grid">
        <!-- Oct/Nov Series -->
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

        <!-- May/June Series -->
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

        <!-- Feb/March Series -->
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

    <div class="series-header"><div class="year-big">Coming Soon</div></div>
    <div style="text-align:center; color:#999; padding:40px; border: 2px dashed #eee; border-radius:12px;">
        <h3 style="margin-bottom:10px;">🚧 Paper 2 Questions Under Development</h3>
        <p>We are currently digitizing the comprehension passages and questions.</p>
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