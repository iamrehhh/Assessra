const fs = require('fs');

const userData = {
    "documents": [
        {
            "fileName": "8021_w25_qp_21.pdf",
            "metadata": {
                "subject": "ENGLISH GENERAL PAPER",
                "paper": "Paper 2 Comprehension",
                "paperCode": "8021/21",
                "session": "October/November 2025",
                "documentType": "Question Paper",
                "duration": "1 hour 45 minutes",
                "totalMarks": 50
            },
            "structure": {
                "sectionA": [
                    "1(a) With reference to the Background and the Additional Information only, identify two pieces of evidence showing that Ereeka might not have the necessary experience to organise a 'memorable' press launch.",
                    "1(b) Identify the disadvantage with The Beeches.",
                    "1(c) Identify the likely date for the press launch.",
                    "1(d) Explain why Ereeka will have to ask Caradoc Schmidt for an increased budget for the press launch.",
                    "1(e) Apart from the cost, explain the disadvantages of The Tuila Hotel and Conference Centre as a venue for the press launch.",
                    "1(f) Explain why working with Orlando Teeme has been a particularly stressful time for Klaus, the Director of Manufacturing.",
                    "1(g) With reference to the Additional Information, identify the reason why Caradoc Schmidt might soon regret linking his company's reputation with that of Orlando Teeme.",
                    "1(h) In your opinion, explain why, as Schmidt + Daughters Tableware has its own design team, Caradoc Schmidt asked Orlando Teeme to design a product range for them.",
                    "1(i) In your opinion, suggest why celebrities feel the need to be chauffeured in limousines."
                ],
                "sectionB": [
                    "2(a) Identify when Iulia Bochis started to become interested in illustrations, specifically.",
                    "2(b) Using your own words as far as possible, explain the meaning of the following five phrases as used in the material: (i) 'something changed in me', (ii) 'felt a strong desire to travel', (iii) 'obstacles that got in the way', (iv) 'after much deliberation', (v) 'there wasn't a better moment than \"now\"'.",
                    "2(c) Identify the exact word or phrase in the material which means the following: (i) life-changing, (ii) imagination, (iii) affect emotionally, (iv) remedy, (v) encouraging.",
                    "2(d) Regarding Iulia's site: (i) describe what makes her feel humble, (ii) identify the comparison she makes to describe her site.",
                    "2(e) According to Iulia, identify one advantage and one disadvantage of an easily accessible virtual world.",
                    "2(f) Explain the structure of Iulia's book.",
                    "2(g) State the exact meaning of the following five words as they are used in the material: (i) thought-provoking, (ii) perspective, (iii) resilient, (iv) solace, (v) superficial."
                ]
            }
        },
        {
            "fileName": "8021_w25_qp_22.pdf",
            "metadata": {
                "subject": "ENGLISH GENERAL PAPER",
                "paper": "Paper 2 Comprehension",
                "paperCode": "8021/22",
                "session": "October/November 2025"
            },
            "structure": {
                "sectionA": [
                    "1(a) Explain how Sarantown University would be more likely to recover the building costs if they were to choose Sarantown Select's proposal.",
                    "1(b) With reference to the Additional Information only: (i) state the one piece of information which suggests that Georg Walters' claim to offer 'fully costed construction plans' might be untrue, (ii) state two pieces of information which suggest that tourists may not wish to stay in the new building.",
                    "1(c) Apart from financial reasons, explain why Bilal Mendes-Smith is more likely to choose Sarantown Select to design the new student accommodation block.",
                    "1(d) Apart from any financial considerations, explain four reasons which suggest that Georg Walters has not read the contract brief properly.",
                    "1(e) Explain how Bilal Mendes-Smith could have made the contract brief more specific."
                ],
                "sectionB": [
                    "2(a) Identify three different informal language features in lines 1-3.",
                    "2(b) Identify three reasons why an individual might consider quiet quitting.",
                    "2(c) Identify four of the ways in which the working from home (WFH) phenomenon has changed people's attitudes to work and leisure time.",
                    "2(d) Using your own words as far as possible, state the meaning of the following five phrases... (i) most of us are eager to please, (ii) even more so if we like our boss, (iii) those who choose not to join in may be criticised, (iv) existing issues are never addressed, (v) further burdens your colleagues.",
                    "2(e) Identify the exact word or phrase in the material which means the following: (i) withdrawing, (ii) sidelined, (iii) stop working, (iv) mutinous, (v) harmful, (vi) work beyond expectations.",
                    "2(f) In your opinion, suggest one example of a reward an employee might be able to negotiate with their supervisor.",
                    "2(g) In your opinion, explain what is meant by the following quotation: 'You can't change someone who doesn't see an issue in their actions'."
                ]
            }
        },
        {
            "fileName": "8021_w25_qp_23.pdf",
            "metadata": {
                "subject": "ENGLISH GENERAL PAPER",
                "paper": "Paper 2 Comprehension",
                "paperCode": "8021/23",
                "session": "October/November 2025"
            },
            "structure": {
                "sectionA": [
                    "1(a) According to the Background, identify the two main reasons for the increase in the volume of traffic.",
                    "1(b) With reference to Option A: (i) explain the problem for the taxi drivers, (ii) explain the advantages for the tourists.",
                    "1(c) Explain the advantages and one disadvantage for students if Option B were chosen.",
                    "1(d) Explain why Option B may create a problem for the residents of Battax.",
                    "1(e) Explain why the engineering department's accreditation application may not be successful.",
                    "1(f) Identify three reasons why the student questionnaire feedback may not provide accurate data.",
                    "1(g) In your opinion, explain one way a busy town could reduce the amount of traffic."
                ],
                "sectionB": [
                    "2(a) Identify the exact word in the material which means the following: (i) shared, (ii) acknowledged, (iii) control.",
                    "2(b) Identify one of the benefits for the volunteers who ate a large breakfast.",
                    "2(c) According to Brady Holmer, state one of the problems caused by missing breakfast.",
                    "2(d) Explain why going for a walk 'might be good advice'.",
                    "2(e) (i) Explain the benefit for a person who achieved seven to eight hours of sleep, (ii) Identify the three disadvantages for people who lacked sleep, (iii) According to Steve Magness, identify three different ways we can improve the way we sleep.",
                    "2(f) Explain why Brady Holmer says, 'The five servings recommendation is sound advice, but also somewhat arbitrary'.",
                    "2(g) Identify the two different reasons why 'the recommendation to drink two litres of water a day is not based on hard science'.",
                    "2(h) State the exact meaning of the following four phrases... (i) sift fact from fiction, (ii) bottom line, (iii) stepping up the pace, (iv) cognitive decline."
                ]
            }
        },
        {
            "fileName": "8021_m25_qp_22.pdf",
            "metadata": {
                "subject": "ENGLISH GENERAL PAPER",
                "paper": "Paper 2 Comprehension",
                "paperCode": "8021/22",
                "session": "February/March 2025"
            },
            "structure": {
                "sectionA": [
                    "1(a) Considering the advantages, explain why the commemorative statue is more likely to be chosen.",
                    "1(b) Explain three disadvantages of choosing the new road bridge.",
                    "1(c) With reference to the Additional Information only, (i) state the one piece of information which is the least relevant when deciding which proposal to choose, (ii) state the one piece of information which suggests that Justina's claim... is untrue.",
                    "1(d) With reference to the television interview extracts only, (i) explain why Justina has a vested interest in favouring the new road bridge, (ii) identify the comment by Bernardo which supports Justina's claim...",
                    "1(e) In your opinion, explain two possible problems with the format of the proposed referendum, as outlined in the Background."
                ],
                "sectionB": [
                    "2(a) (i) Identify two of the main aims of Operation Mincemeat during the Second World War..., (ii) Identify two reasons given for the success of the deception...",
                    "2(b) Suggest what each of the three pieces of 'wallet litter' was intended to show about 'Major Martin'...",
                    "2(c) Explain why Macintyre uses the term 'hidden hero' in connection with the people who devised the plan...",
                    "2(d) Explain the importance of creativity in Operation Mincemeat...",
                    "2(e) Identify the two ways in which the theatre company updated the story for modern audiences...",
                    "2(f) (i) Explain how creating Martin could be seen as 'morally doubtful', (ii) Explain how Michelle Ashford justifies 'the less ethical aspects of the story'...",
                    "2(g) Explain the present-day justifications offered for having used the dead man in Operation Mincemeat.",
                    "2(h) Referring to lines 14-25 only, identify the exact word or phrase in the material which means: (i) impeded, (ii) wily, (iii) appropriate for."
                ]
            }
        },
        {
            "fileName": "8021_s25_qp_21.pdf",
            "metadata": {
                "subject": "ENGLISH GENERAL PAPER",
                "paper": "Paper 2 Comprehension",
                "paperCode": "8021/21",
                "session": "May/June 2025"
            },
            "structure": {
                "sectionA": [
                    "1(a) Explain one of the reasons why 300 years ago Anakii Old Town could not continue to be the capital city.",
                    "1(b) With reference to the descriptions of the two attractions and the Additional Information: (i) identify the exaggerated claim made by Mayor Ena Voun. Justify your choice. (ii) identify the exaggerated claim made by Ivo Grix. Justify your choice.",
                    "1(c) Identify the personal reason why Linus Frijmann would probably not give Jorjina permission to review Sottiex Marina.",
                    "1(d) Identify the reason why the Neeniot Echo reserves the right to refuse to publish a review not up to its standards.",
                    "1(e) Explain why Jorjina would need to declare conflicts of interest: (i) if Serge were to accompany her to Anakii Old Town, (ii) if Amalie were to accompany her to Sottiex Marina.",
                    "1(f) Identify the problem for Jorjina of delivering a review of Sottiex Marina by Friday 1 December.",
                    "1(g) Explain why it could be important for Jorjina's career that she impresses Linus Frijmann.",
                    "1(h) Apart from impressing Linus Frijmann, explain why Jorjina would most likely prefer to review Sottiex Marina.",
                    "1(i) Explain two factors which might make Jorjina choose to review Anakii Old Town."
                ],
                "sectionB": [
                    "2(a) Identify the memory that drives Francisco Elle deep into the dense rainforests day after day.",
                    "2(b) Identify the exact word or phrase in the material which means the following: (i) move in at speed, (ii) a person arranging business deals between other people, (iii) sticky, (iv) not worried.",
                    "2(c) State three pieces of evidence that show it is difficult to walk through the rainforest.",
                    "2(d) According to Francisco, identify what 'nature's revenge' was.",
                    "2(e) State the three reasons given as to why landslides and flash floods are occurring more regularly.",
                    "2(f) Explain how Marc justifies his illegal logging activities.",
                    "2(g) Explain how Francisco now regards trees.",
                    "2(h) According to the material, suggest why Francisco is a brave individual.",
                    "2(i) State the exact meaning of the following four words or phrases as they are used in the material: (i) (have) taken their toll, (ii) (to) defy, (iii) vows, (iv) (to) ensure."
                ]
            }
        },
        {
            "fileName": "8021_s25_qp_22.pdf",
            "metadata": {
                "subject": "ENGLISH GENERAL PAPER",
                "paper": "Paper 2 Comprehension",
                "paperCode": "8021/22",
                "session": "May/June 2025"
            },
            "structure": {
                "sectionA": [
                    "1(a) Considering the advantages, explain why Tony and Paula Larsen would be most likely to choose Camp Imagi as the summer camp for Zendy and Julian.",
                    "1(b) Considering two advantages, explain why Zendy might choose Camp Venchure as her summer camp destination.",
                    "1(c) Explain three reasons why Paula might choose Camp Anim8.",
                    "1(d) In your opinion, explain why Tony might prefer his children to attend an international summer camp.",
                    "1(e) Identify the one piece of the Additional Information that is the least relevant when Tony and Paula are deciding which summer camp to choose for Zendy and Julian.",
                    "1(f) With reference to the description of Camp Venchure, identify two different informal language features."
                ],
                "sectionB": [
                    "2(a) Identify the creature which has inspired the robotic innovation.",
                    "2(b) Explain the meaning of the following five phrases in the material: (i) excellent burrowers, (ii) spaces that might be difficult to access, (iii) filled with gel, (iv) though it's not as fast on a flat surface, (v) it's able to move deeper.",
                    "2(c) Describe three ways robotic worms can imitate earthworms.",
                    "2(d) Explain why the Italian Institute of Technology (IIT) group's earthworm-type robot is a significant innovation.",
                    "2(e) Regarding bioinspired earthworm robots, identify one practical function researchers aim to copy.",
                    "2(f) Identify two differences between earthworms and bioinspired earthworm robots.",
                    "2(g) Identify the organisation which continues to work with General Electric (GE) on tunnelling robots.",
                    "2(h) (i) Identify three different advantages of the GE robot for commercial clients. (ii) Identify two different disadvantages of GE's connection with the military.",
                    "2(i) Identify two advantages of using earthworm-like robots after an earthquake.",
                    "2(j) Identify the exact word in the material which means the following: (i) forthcoming, (ii) strategic, (iii) furtive."
                ]
            }
        },
        {
            "fileName": "8021_s25_qp_23.pdf",
            "metadata": {
                "subject": "ENGLISH GENERAL PAPER",
                "paper": "Paper 2 Comprehension",
                "paperCode": "8021/23",
                "session": "May/June 2025"
            },
            "structure": {
                "sectionA": [
                    "1(a) (i) Identify two reasons why Jonah's language ability did not improve while in Sellacka. (ii) According to Mrs K, identify the two different ways the Bonngat Private Language School promotes language learning.",
                    "1(b) Apart from the cost, explain three possible disadvantages for the students of Muttumbox High School if their teachers choose Bonngat Private Language School.",
                    "1(c) Considering only the advantages, explain why the Language Exchange Programme to Sellacka would be the better option for Muttumbox High School.",
                    "1(d) Explain what Mrs Yoder means when she says, 'I'm working flat out.'",
                    "1(e) Explain why Mrs Yoder might be against a visit to Sellacka Community School.",
                    "1(f) In your opinion, explain why it is important to learn a foreign language."
                ],
                "sectionB": [
                    "2(a) Identify one of the reasons why 'the days of single-dimensional viewing of monuments and museums' have gone.",
                    "2(b) (i) Identify the reason why monuments are likely to become outdated soon. (ii) Identify the solution offered to prevent a monument from becoming outdated.",
                    "2(c) Identify the exact word or phrase in the material which means the following: (i) improving, (ii) new ideas, (iii) fixed.",
                    "2(d) According to Prime Minister Narendra Modi, state three benefits of technology.",
                    "2(e) According to monument-goers, state the two different aims of visiting heritage sites.",
                    "2(f) Answering using your own words as far as possible, state the meaning of the following five phrases as they are used in the material: (i) a multilingual audio guide system, (ii) the levitating emblem at the reception, (iii) visitors travel back in time, (iv) bring alive the words, (v) making it engaging.",
                    "2(g) (i) Explain how technology is helping to amplify campaigns around the cultural heritage of India. (ii) Explain how smart technologies are enhancing the experience beyond the actual monument visit.",
                    "2(h) State the exact meaning of the following two words as they are used in the material: (i) disseminating, (ii) emergence."
                ]
            }
        },
        {
            "fileName": "8021_m24_qp_22.pdf",
            "metadata": {
                "subject": "ENGLISH GENERAL PAPER",
                "paper": "Paper 2 Comprehension",
                "paperCode": "8021/22",
                "session": "February/March 2024"
            },
            "structure": {
                "sectionA": [
                    "1(a) Considering the advantages and one disadvantage, explain why Francesca is most likely to choose the zoo trip.",
                    "1(b) (i) Explain two reasons why Antony and Maria might like the luxury hotel weekend. (ii) Explain two reasons why Antony and Maria might not like the surprise party.",
                    "1(c) State the one piece of the Additional Information provided which is the least relevant when Francesca is deciding which celebration to organise.",
                    "1(d) Using only evidence from Katarina's email: (i) justify James's claim that Katarina likes to tell other people what to do, (ii) justify James's claim that Katarina is not telling the truth when saying she cannot contribute financially, (iii) justify James's claim that Katarina will not help with the organisation."
                ],
                "sectionB": [
                    "2(a) Identify how American prisons have been portrayed in some films and on TV.",
                    "2(b) Identify Brian Roettinger's goal in running art classes for prisoners in California.",
                    "2(c) Using only lines 1 to 18 of the material, identify the exact word which means the following: (i) to redefine, (ii) partnership, (iii) reflective self-awareness.",
                    "2(d) Explain why Willo Perron believes 'in the transformative power of art and the redemptive potential of self-expression' for prisoners.",
                    "2(e) According to Perron, explain how the duo's proposed arts programme demonstrates their views relating to prison reform.",
                    "2(f) According to Annie Buckley, identify the 'overwhelmingly positive' features of the guest artist programme for prisoners.",
                    "2(g) Suggest why Buckley might find the example of the prisoner's daughter 'powerful'.",
                    "2(h) Explain why the organisers of the arts programme do not ask prisoners 'why they're there or what they've done'.",
                    "2(i) In your opinion, explain why art therapy for prisoners might not be successful."
                ]
            }
        }
    ]
};

let output = '';

userData.documents.forEach(doc => {
    if (!doc.structure) return;

    let parts = doc.fileName.split('_'); // 8021, w25, qp, 21.pdf
    let sessionCode = parts[1]; // w25
    let variant = parts[3].split('.')[0]; // 21

    let yr = '20' + sessionCode.substring(1); // 2025
    let s = sessionCode[0]; // w

    let dbKeySession = '';
    let displayTitle = '';
    if (s === 'w') {
        dbKeySession = 'on';
        displayTitle = "Comprehension Paper " + variant + " (Oct/Nov '" + sessionCode.substring(1) + ")";
    } else if (s === 'm') {
        dbKeySession = 'fm';
        displayTitle = "Comprehension Paper " + variant + " (Feb/March '" + sessionCode.substring(1) + ")";
    } else if (s === 's') {
        dbKeySession = 'mj';
        displayTitle = "Comprehension Paper " + variant + " (May/June '" + sessionCode.substring(1) + ")";
    }

    let dbKey = 'gp_' + yr + '_' + dbKeySession + '_' + variant;

    let msFile = doc.fileName.replace('_qp_', '_ms_');
    let inFile = doc.fileName.replace('_qp_', '_in_');

    let qs = [];
    if (doc.structure.sectionA) {
        doc.structure.sectionA.forEach(q => {
            let spaceObj = q.indexOf(' ');
            let n = q.substring(0, spaceObj);
            let t = q.substring(spaceObj + 1).replace(/"/g, "'");
            qs.push(\`            { n: '\${n}', m: 0, l: '', t: "\${t}", i: [] }\`);
        });
    }
    if (doc.structure.sectionB) {
        doc.structure.sectionB.forEach(q => {
            let spaceObj = q.indexOf(' ');
            let n = q.substring(0, spaceObj);
            let t = q.substring(spaceObj + 1).replace(/"/g, "'");
            qs.push(\`            { n: '\${n}', m: 0, l: '', t: "\${t}", i: [] }\`);
        });
    }

    output += \`
    // --- COMPREHENSION PAPER \${variant} (\${s === 'w' ? 'OCTOBER / NOVEMBER' : (s === 'm' ? 'FEBRUARY / MARCH' : 'MAY / JUNE')} \${yr}) ---
    '\${dbKey}': {
        title: "\${displayTitle}",
        pdf: "papers/\${doc.fileName}",
        ms: "papers/\${msFile}",
        insert: "papers/\${inFile}",
        questions: [
\${qs.join(',\\n')}
        ]
    },\`;
});

fs.writeFileSync('/Users/abdulrehan/Documents/Assessra/format_gp2_output.js', output);
console.log('Done!');
