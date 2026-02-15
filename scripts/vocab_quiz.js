// ==========================================
// VOCABULARY MCQ QUIZ WITH 100+ NEW WORDS
// ==========================================

// Helper to shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const vocabQuestionsBank = [
    // Original words (95 words)
    { word: "Mendacious", options: ["Truthful", "Deceitful", "Brave", "Silent"], correct: 1, category: "Deception" },
    { word: "Perfidious", options: ["Loyal", "Treacherous", "Wise", "Generous"], correct: 1, category: "Deception" },
    { word: "Duplicity", options: ["Honesty", "Intelligence", "Deceitfulness", "Courage"], correct: 2, category: "Deception" },
    { word: "Chicanery", options: ["Straightforwardness", "Bravery", "Trickery", "Kindness"], correct: 2, category: "Deception" },
    { word: "Disingenuous", options: ["Sincere", "Clever", "Insincere", "Stubborn"], correct: 2, category: "Deception" },
    { word: "Supercilious", options: ["Humble", "Arrogant", "Foolish", "Quiet"], correct: 1, category: "Pride" },
    { word: "Hubris", options: ["Modesty", "Excessive pride", "Fear", "Wisdom"], correct: 1, category: "Pride" },
    { word: "Imperious", options: ["Submissive", "Domineering", "Intelligent", "Generous"], correct: 1, category: "Pride" },
    { word: "Bumptious", options: ["Reserved", "Self-important", "Cowardly", "Flexible"], correct: 1, category: "Pride" },
    { word: "Grandiloquent", options: ["Simple", "Pompous in speech", "Brief", "Honest"], correct: 1, category: "Pride" },
    { word: "Pusillanimous", options: ["Brave", "Timid", "Wise", "Talkative"], correct: 1, category: "Courage" },
    { word: "Intrepid", options: ["Fearful", "Fearless", "Foolish", "Silent"], correct: 1, category: "Courage" },
    { word: "Dauntless", options: ["Discouraged", "Bold", "Weak", "Greedy"], correct: 1, category: "Courage" },
    { word: "Craven", options: ["Heroic", "Cowardly", "Intelligent", "Generous"], correct: 1, category: "Courage" },
    { word: "Perspicacious", options: ["Dull", "Perceptive", "Brave", "Quiet"], correct: 1, category: "Intelligence" },
    { word: "Sagacious", options: ["Foolish", "Wise", "Angry", "Brief"], correct: 1, category: "Intelligence" },
    { word: "Astute", options: ["Naive", "Shrewd", "Cowardly", "Verbose"], correct: 1, category: "Intelligence" },
    { word: "Perspicacity", options: ["Stupidity", "Keen insight", "Arrogance", "Silence"], correct: 1, category: "Intelligence" },
    { word: "Fatuous", options: ["Intelligent", "Silly", "Brave", "Honest"], correct: 1, category: "Stupidity" },
    { word: "Obtuse", options: ["Sharp", "Slow to understand", "Generous", "Brief"], correct: 1, category: "Stupidity" },
    { word: "Vacuous", options: ["Thoughtful", "Empty-headed", "Courageous", "Flexible"], correct: 1, category: "Stupidity" },
    { word: "Inane", options: ["Meaningful", "Senseless", "Honest", "Generous"], correct: 1, category: "Stupidity" },
    { word: "Recalcitrant", options: ["Compliant", "Uncooperative", "Wise", "Brief"], correct: 1, category: "Stubbornness" },
    { word: "Obstinate", options: ["Flexible", "Stubborn", "Intelligent", "Generous"], correct: 1, category: "Stubbornness" },
    { word: "Intransigent", options: ["Compromising", "Inflexible", "Foolish", "Silent"], correct: 1, category: "Stubbornness" },
    { word: "Contumacious", options: ["Obedient", "Rebellious", "Wise", "Brief"], correct: 1, category: "Stubbornness" },
    { word: "Loquacious", options: ["Quiet", "Talkative", "Brave", "Wise"], correct: 1, category: "Talkativeness" },
    { word: "Garrulous", options: ["Reserved", "Excessively talkative", "Intelligent", "Honest"], correct: 1, category: "Talkativeness" },
    { word: "Prolix", options: ["Concise", "Wordy", "Generous", "Brave"], correct: 1, category: "Talkativeness" },
    { word: "Logorrhea", options: ["Silence", "Excessive talkativeness", "Wisdom", "Courage"], correct: 1, category: "Talkativeness" },
    { word: "Taciturn", options: ["Chatty", "Reserved in speech", "Foolish", "Generous"], correct: 1, category: "Silence" },
    { word: "Reticent", options: ["Outspoken", "Reluctant to speak", "Brave", "Wise"], correct: 1, category: "Silence" },
    { word: "Laconic", options: ["Verbose", "Brief in speech", "Cowardly", "Greedy"], correct: 1, category: "Silence" },
    { word: "Vituperative", options: ["Praising", "Harshly critical", "Silent", "Generous"], correct: 1, category: "Criticism" },
    { word: "Excoriate", options: ["Praise", "Criticize severely", "Ignore", "Admire"], correct: 1, category: "Criticism" },
    { word: "Objurgate", options: ["Compliment", "Scold harshly", "Encourage", "Forgive"], correct: 1, category: "Criticism" },
    { word: "Castigate", options: ["Reward", "Reprimand severely", "Support", "Appreciate"], correct: 1, category: "Criticism" },
    { word: "Extol", options: ["Criticize", "Praise highly", "Ignore", "Condemn"], correct: 1, category: "Praise" },
    { word: "Laud", options: ["Denounce", "Commend", "Question", "Attack"], correct: 1, category: "Praise" },
    { word: "Panegyric", options: ["Criticism", "Formal praise", "Silence", "Insult"], correct: 1, category: "Praise" },
    { word: "Eulogize", options: ["Defame", "Praise formally", "Ignore", "Criticize"], correct: 1, category: "Praise" },
    { word: "Bellicose", options: ["Peaceful", "Friendly", "Aggressive", "Silent"], correct: 2, category: "Anger" },
    { word: "Belligerent", options: ["Calm", "Gentle", "Hostile", "Wise"], correct: 2, category: "Anger" },
    { word: "Acerbic", options: ["Sweet", "Kind", "Harsh", "Generous"], correct: 2, category: "Anger" },
    { word: "Caustic", options: ["Mild", "Pleasant", "Biting", "Foolish"], correct: 2, category: "Anger" },
    { word: "Truculent", options: ["Peaceful", "Cooperative", "Aggressively defiant", "Silent"], correct: 2, category: "Anger" },
    { word: "Approbation", options: ["Disapproval", "Criticism", "Official approval", "Silence"], correct: 2, category: "Approval" },
    { word: "Adulation", options: ["Hatred", "Indifference", "Excessive admiration", "Fear"], correct: 2, category: "Approval" },
    { word: "Commend", options: ["Criticize", "Ignore", "Praise", "Reject"], correct: 2, category: "Approval" },
    { word: "Deprecate", options: ["Approve", "Support", "Express disapproval", "Admire"], correct: 2, category: "Disapproval" },
    { word: "Disparage", options: ["Praise", "Respect", "Belittle", "Encourage"], correct: 2, category: "Disapproval" },
    { word: "Deride", options: ["Admire", "Support", "Mock", "Respect"], correct: 2, category: "Disapproval" },
    { word: "Censure", options: ["Approve", "Reward", "Criticize formally", "Forgive"], correct: 2, category: "Disapproval" },
    { word: "Forthright", options: ["Deceitful", "Evasive", "Direct and honest", "Silent"], correct: 2, category: "Honesty" },
    { word: "Candid", options: ["Dishonest", "Secretive", "Frank", "Deceptive"], correct: 2, category: "Honesty" },
    { word: "Veracious", options: ["False", "Lying", "Truthful", "Misleading"], correct: 2, category: "Honesty" },
    { word: "Scrupulous", options: ["Careless", "Dishonest", "Morally principled", "Reckless"], correct: 2, category: "Honesty" },
    { word: "Charlatan", options: ["Expert", "Professional", "Scholar", "Fraud"], correct: 3, category: "Deception" },
    { word: "Duplicitous", options: ["Honest", "Sincere", "Straightforward", "Deceitful"], correct: 3, category: "Deception" },
    { word: "Dissemble", options: ["Reveal", "Confess", "Admit", "Conceal motives"], correct: 3, category: "Deception" },
    { word: "Prevaricate", options: ["Tell truth", "Speak clearly", "Be direct", "Avoid truth"], correct: 3, category: "Deception" },
    { word: "Audacity", options: ["Timidity", "Fear", "Caution", "Boldness"], correct: 3, category: "Courage" },
    { word: "Valiant", options: ["Weak", "Timid", "Afraid", " Brave"], correct: 3, category: "Courage" },
    { word: "Timorous", options: ["Bold", "Confident", "Brave", "Fearful"], correct: 3, category: "Cowardice" },
    { word: "Poltroon", options: ["Hero", "Champion", "Warrior", "Coward"], correct: 3, category: "Cowardice" },
    { word: "Erudite", options: ["Scholarly", "Ignorant", "Foolish", "Simple"], correct: 0, category: "Intelligence" },
    { word: "Asinine", options: ["Extremely stupid", "Smart", "Clever", "Wise"], correct: 0, category: "Foolishness" },
    { word: "Obdurate", options: ["Stubbornly persistent", "Yielding", "Soft", "Flexible"], correct: 0, category: "Stubbornness" },
    { word: "Pliable", options: ["Easily bent", "Rigid", "Inflexible", "Stubborn"], correct: 0, category: "Flexibility" },
    { word: "Malleable", options: ["Easily shaped", "Fixed", "Rigid", "Unyielding"], correct: 0, category: "Flexibility" },
    { word: "Amenable", options: ["Open to suggestion", "Resistant", "Defiant", "Stubborn"], correct: 0, category: "Flexibility" },
    { word: "Tractable", options: ["Easily managed", "Difficult", "Stubborn", "Rebellious"], correct: 0, category: "Flexibility" },
    { word: "Avarice", options: ["Extreme greed", "Generosity", "Charity", "Kindness"], correct: 0, category: "Greed" },
    { word: "Rapacious", options: ["Aggressively greedy", "Generous", "Kind", "Selfless"], correct: 0, category: "Greed" },
    { word: "Avaricious", options: ["Extremely greedy", "Charitable", "Giving", "Generous"], correct: 0, category: "Greed" },
    { word: "Covetous", options: ["Enviously desiring", "Content", "Satisfied", "Grateful"], correct: 0, category: "Greed" },
    { word: "Beneficent", options: ["Generous and kind", "Selfish", "Greedy", "Mean"], correct: 0, category: "Generosity" },
    { word: "Munificent", options: ["Very generous", "Stingy", "Cheap", "Greedy"], correct: 0, category: "Generosity" },
    { word: "Magnanimous", options: ["Generous in forgiving", "Petty", "Vengeful", "Spiteful"], correct: 0, category: "Generosity" },
    { word: "Altruistic", options: ["Selflessly concerned", "Selfish", "Greedy", "Self-centered"], correct: 0, category: "Generosity" },
    { word: "Terse", options: ["Brief and to the point", "Lengthy", "Elaborate", "Detailed"], correct: 0, category: "Brevity" },
    { word: "Succinct", options: ["Briefly expressed", "Rambling", "Verbose", "Long"], correct: 0, category: "Brevity" },
    { word: "Pithy", options: ["Concise and meaningful", "Wordy", "Empty", "Lengthy"], correct: 0, category: "Brevity" },
    { word: "Verbose", options: ["Using more words than needed", "Concise", "Brief", "Terse"], correct: 0, category: "Wordiness" },
    { word: "Ephemeral", options: ["Lasting very briefly", "Permanent", "Eternal", "Enduring"], correct: 0, category: "Temporary" },
    { word: "Transient", options: ["Lasting only briefly", "Permanent", "Fixed", "Eternal"], correct: 0, category: "Temporary" },
    { word: "Fleeting", options: ["Passing quickly", "Lasting", "Permanent", "Enduring"], correct: 0, category: "Temporary" },
    { word: "Evanescent", options: ["Quickly fading", "Permanent", "Lasting", "Eternal"], correct: 0, category: "Temporary" },
    { word: "Immutable", options: ["Unchangeable", "Changeable", "Flexible", "Variable"], correct: 0, category: "Permanent" },
    { word: "Indelible", options: ["Cannot be removed", "Temporary", "Erasable", "Fleeting"], correct: 0, category: "Permanent" },
    { word: "Perpetual", options: ["Never ending", "Temporary", "Brief", "Short-lived"], correct: 0, category: "Permanent" },

    // NEW WORDS - 100 additions
    { word: "Abeyance", options: ["Active use", "Progression", "Temporary suspension", "Celebration"], correct: 2, category: "State" },
    { word: "Abstemious", options: ["Indulgent", "Gluttonous", "Moderate", "Wasteful"], correct: 2, category: "Temperance" },
    { word: "Accretion", options: ["Reduction", "Loss", "Gradual accumulation", "Destruction"], correct: 2, category: "Growth" },
    { word: "Adjure", options: ["Deny", "Ignore", "Solemnly urge", "Reject"], correct: 2, category: "Request" },
    { word: "Adumbrate", options: ["Clarify", "Expose", "Foreshadow vaguely", "Illuminate"], correct: 2, category: "Indication" },
    { word: "Aegis", options: ["Attack", "Opposition", "Protection", "Indifference"], correct: 2, category: "Support" },
    { word: "Alacrity", options: ["Slowness", "Reluctance", "Cheerful readiness", "Laziness"], correct: 2, category: "Enthusiasm" },
    { word: "Aleatory", options: ["Planned", "Certain", "Dependent on chance", "Controlled"], correct: 2, category: "Random" },
    { word: "Antinomy", options: ["Agreement", "Harmony", "Contradiction", "Unity"], correct: 2, category: "Logic" },
    { word: "Apothegm", options: ["Long story", "Novel", "Concise saying", "Essay"], correct: 2, category: "Expression" },
    { word: "Apotheosis", options: ["Decline", "Downfall", "Highest point", "Beginning"], correct: 2, category: "Peak" },
    { word: "Arrogate", options: ["Give away", "Share", "Claim unjustly", "Surrender"], correct: 2, category: "Appropriation" },
    { word: "Aspersion", options: ["Praise", "Compliment", "Slanderous attack", "Support"], correct: 2, category: "Defamation" },
    { word: "Assiduity", options: ["Laziness", "Carelessness", "Constant diligence", "Neglect"], correct: 2, category: "Effort" },
    { word: "Atavism", options: ["Progress", "Evolution", "Reversion to ancestral", "Advancement"], correct: 2, category: "Heredity" },
    { word: "Badinage", options: ["Serious talk", "Argument", "Playful banter", "Silence"], correct: 2, category: "Conversation" },
    { word: "Baleful", options: ["Beneficial", "Helpful", "Threatening harm", "Kind"], correct: 2, category: "Menace" },
    { word: "Blandishment", options: ["Threat", "Warning", "Flattering persuasion", "Insult"], correct: 2, category: "Persuasion" },
    { word: "Bombast", options: ["Simplicity", "Clarity", "Pompous language", "Brevity"], correct: 2, category: "Speech" },
    { word: "Bromide", options: ["Original idea", "Innovation", "Trite remark", "Discovery"], correct: 2, category: "Cliché" },
    { word: "Calumny", options: ["Truth", "Honesty", "False defamation", "Praise"], correct: 2, category: "Slander" },
    { word: "Canard", options: ["Fact", "Truth", "Unfounded rumor", "Evidence"], correct: 2, category: "Falsehood" },
    { word: "Captious", options: ["Accepting", "Tolerant", "Fault-finding", "Approving"], correct: 2, category: "Criticism" },
    { word: "Caterwaul", options: ["Whisper", "Murmur", "Shrill wailing", "Silence"], correct: 2, category: "Noise" },
    { word: "Cavil", options: ["Agree", "Accept", "Make petty objections", "Approve"], correct: 2, category: "Objection" },
    { word: "Chary", options: ["Reckless", "Careless", "Cautiously reluctant", "Bold"], correct: 2, category: "Caution" },
    { word: "Chimera", options: ["Reality", "Fact", "Impossible illusion", "Truth"], correct: 2, category: "Fantasy" },
    { word: "Churlish", options: ["Polite", "Kind", "Rudely surly", "Gentle"], correct: 2, category: "Rudeness" },
    { word: "Circuitous", options: ["Direct", "Straight", "Roundabout", "Simple"], correct: 2, category: "Indirect" },
    { word: "Cognomen", options: ["Description", "Title", "Nickname", "Address"], correct: 2, category: "Name" },
    { word: "Colloquy", options: ["Silence", "Monologue", "Formal conversation", "Writing"], correct: 2, category: "Dialogue" },
    { word: "Comity", options: ["Hostility", "Rudeness", "Courtesy", "Indifference"], correct: 2, category: "Civility" },
    { word: "Compendious", options: ["Lengthy", "Verbose", "Concise yet complete", "Incomplete"], correct: 2, category: "Brevity" },
    { word: "Concomitant", options: ["Separate", "Unrelated", "Naturally accompanying", "Isolated"], correct: 2, category: "Association" },
    { word: "Confabulation", options: ["Silence", "Truth", "Invented memory", "Fact"], correct: 2, category: "Memory" },
    { word: "Contiguous", options: ["Separate", "Distant", "Sharing border", "Apart"], correct: 2, category: "Proximity" },
    { word: "Contravene", options: ["Obey", "Follow", "Violate", "Support"], correct: 2, category: "Violation" },
    { word: "Contumely", options: ["Respect", "Praise", "Insulting treatment", "Honor"], correct: 2, category: "Insult" },
    { word: "Convivial", options: ["Gloomy", "Hostile", "Friendly and lively", "Boring"], correct: 2, category: "Atmosphere" },
    { word: "Coquette", options: ["Serious person", "Scholar", "Lighthearted flirt", "Recluse"], correct: 2, category: "Behavior" },
    { word: "Coruscate", options: ["Dim", "Fade", "Sparkle", "Darken"], correct: 2, category: "Light" },
    { word: "Cosseted", options: ["Neglected", "Ignored", "Pampered", "Abandoned"], correct: 2, category: "Care" },
    { word: "Curmudgeon", options: ["Cheerful person", "Optimist", "Bad-tempered person", "Friend"], correct: 2, category: "Temperament" },
    { word: "Cynosure", options: ["Outsider", "Nobody", "Center of attention", "Background"], correct: 2, category: "Focus" },
    { word: "Debauch", options: ["Purify", "Improve", "Corrupt morally", "Enhance"], correct: 2, category: "Corruption" },
    { word: "Defenestration", options: ["Climbing in", "Entering", "Throwing out window", "Opening door"], correct: 2, category: "Action" },
    { word: "Demagogue", options: ["Honest leader", "Servant", "Manipulative leader", "Follower"], correct: 2, category: "Politics" },
    { word: "Depredation", options: ["Protection", "Building", "Plundering attack", "Creation"], correct: 2, category: "Attack" },
    { word: "Desuetude", options: ["Common use", "Popularity", "State of disuse", "Frequency"], correct: 2, category: "Obsolescence" },
    { word: "Desultory", options: ["Focused", "Planned", "Random and unfocused", "Systematic"], correct: 2, category: "Aimlessness" },
    { word: "Dialectic", options: ["Silence", "Confusion", "Logical discussion", "Chaos"], correct: 2, category: "Logic" },
    { word: "Dichotomy", options: ["Unity", "Wholeness", "Division into two", "Combination"], correct: 2, category: "Division" },
    { word: "Diffidence", options: ["Confidence", "Arrogance", "Shyness", "Boldness"], correct: 2, category: "Modesty" },
    { word: "Diktat", options: ["Request", "Suggestion", "Imposed decree", "Negotiation"], correct: 2, category: "Command" },
    { word: "Dilettante", options: ["Expert", "Professional", "Amateur dabbler", "Master"], correct: 2, category: "Commitment" },
    { word: "Discombobulate", options: ["Clarify", "Organize", "Confuse", "Simplify"], correct: 2, category: "Confusion" },
    { word: "Disquisition", options: ["Brief note", "Summary", "Long essay", "Outline"], correct: 2, category: "Writing" },
    { word: "Dotage", options: ["Youth", "Prime", "Old age senility", "Childhood"], correct: 2, category: "Age" },
    { word: "Dudgeon", options: ["Joy", "Pleasure", "Deep resentment", "Happiness"], correct: 2, category: "Offense" },
    { word: "Dyspeptic", options: ["Happy", "Content", "Irritable", "Cheerful"], correct: 2, category: "Temperament" },
    { word: "Edify", options: ["Corrupt", "Degrade", "Improve morally", "Destroy"], correct: 2, category: "Improvement" },
    { word: "Effete", options: ["Strong", "Vigorous", "Weak and decadent", "Powerful"], correct: 2, category: "Weakness" },
    { word: "Effrontery", options: ["Respect", "Humility", "Insolent audacity", "Politeness"], correct: 2, category: "Impudence" },
    { word: "Egalitarian", options: ["Elitist", "Hierarchical", "Promoting equality", "Discriminatory"], correct: 2, category: "Equality" },
    { word: "Egregious", options: ["Good", "Acceptable", "Outstandingly bad", "Excellent"], correct: 2, category: "Extreme" },
    { word: "Elegy", options: ["Comedy", "Celebration", "Lament poem", "Joy"], correct: 2, category: "Poetry" },
    { word: "Elocution", options: ["Writing", "Silence", "Clear speech", "Mumbling"], correct: 2, category: "Speech" },
    { word: "Emolument", options: ["Loss", "Expense", "Salary or profit", "Debt"], correct: 2, category: "Compensation" },
    { word: "Encomium", options: ["Criticism", "Attack", "High praise speech", "Insult"], correct: 2, category: "Praise" },
    { word: "Ennui", options: ["Excitement", "Interest", "Boredom", "Enthusiasm"], correct: 2, category: "Dissatisfaction" },
    { word: "Epicurean", options: ["Ascetic", "Austere", "Devoted to pleasure", "Frugal"], correct: 2, category: "Pleasure" },
    { word: "Equivocate", options: ["Be direct", "Clarify", "Use ambiguous language", "Speak clearly"], correct: 2, category: "Evasion" },
    { word: "Erstwhile", options: ["Current", "Present", "Former", "Future"], correct: 2, category: "Time" },
    { word: "Eschatology", options: ["Beginning", "Creation", "Study of death/destiny", "Birth"], correct: 2, category: "Theology" },
    { word: "Etiolate", options: ["Strengthen", "Nourish", "Weaken by depriving", "Energize"], correct: 2, category: "Weakening" },
    { word: "Eupeptic", options: ["Pessimistic", "Gloomy", "Cheerful", "Sad"], correct: 2, category: "Disposition" },
    { word: "Exegesis", options: ["Ignorance", "Confusion", "Critical interpretation", "Misunderstanding"], correct: 2, category: "Analysis" },
    { word: "Exiguous", options: ["Abundant", "Large", "Very small", "Plentiful"], correct: 2, category: "Size" },
    { word: "Expiate", options: ["Sin", "Offend", "Atone for", "Commit"], correct: 2, category: "Atonement" },
    { word: "Expurgate", options: ["Add to", "Include", "Remove objectionable matter", "Expand"], correct: 2, category: "Censorship" },
    { word: "Extirpate", options: ["Plant", "Create", "Destroy completely", "Build"], correct: 2, category: "Destruction" },
    { word: "Factotum", options: ["Specialist", "Expert", "General servant", "Master"], correct: 2, category: "Worker" },
    { word: "Fallible", options: ["Perfect", "Infallible", "Capable of error", "Flawless"], correct: 2, category: "Imperfection" },
    { word: "Farouche", options: ["Outgoing", "Social", "Shy and awkward", "Friendly"], correct: 2, category: "Social" },
    { word: "Fatidic", options: ["Historical", "Present", "Prophetic", "Past"], correct: 2, category: "Prophecy" },
    { word: "Fealty", options: ["Betrayal", "Disloyalty", "Sworn loyalty", "Treason"], correct: 2, category: "Loyalty" },
    { word: "Feckless", options: ["Responsible", "Effective", "Lacking initiative", "Competent"], correct: 2, category: "Ineffectiveness" },
    { word: "Feculence", options: ["Purity", "Cleanliness", "Foul impure matter", "Freshness"], correct: 2, category: "Impurity" },
    { word: "Fecundity", options: ["Barrenness", "Sterility", "Fertility", "Infertility"], correct: 2, category: "Productivity" },
    { word: "Felicitous", options: ["Inappropriate", "Unsuitable", "Well-chosen", "Wrong"], correct: 2, category: "Aptness" },
    { word: "Feral", options: ["Domesticated", "Tame", "Wild and savage", "Gentle"], correct: 2, category: "Wildness" },
    { word: "Ferine", options: ["Civilized", "Tame", "Wild and untamed", "Domestic"], correct: 2, category: "Wildness" },
    { word: "Fey", options: ["Grounded", "Realistic", "Unworldly", "Practical"], correct: 2, category: "Otherworldly" },
    { word: "Fiduciary", options: ["Casual", "Informal", "Involving trust", "Careless"], correct: 2, category: "Trust" },
    { word: "Filibuster", options: ["Speed up", "Expedite", "Obstruct proceedings", "Facilitate"], correct: 2, category: "Obstruction" },
    { word: "Fin-de-siècle", options: ["Beginning", "Start", "End of century", "Middle"], correct: 2, category: "Time" },
    { word: "Fissiparous", options: ["Unifying", "Connecting", "Inclined to divide", "Joining"], correct: 2, category: "Division" },
    { word: "Flocculent", options: ["Smooth", "Hard", "Downy and fluffy", "Rough"], correct: 2, category: "Texture" },
    { word: "Fustian", options: ["Simple speech", "Clarity", "Pompous language", "Brevity"], correct: 2, category: "Speech" }
];

// Shuffle questions on load
const vocabQuestions = shuffleArray(vocabQuestionsBank);

let currentQuestion = 0;
let vocabScore = 0;
let vocabAnswered = 0;

// LOAD VOCAB QUIZ
async function loadVocabQuiz() {
    const container = document.getElementById('container-vocab');
    if (!container) return;

    // Load locally first for speed and reliability
    const localData = localStorage.getItem('vocab_progress_local');
    if (localData) {
        try {
            const parsed = JSON.parse(localData);
            vocabScore = parsed.score || 0;
            vocabAnswered = parsed.answered || 0;
            currentQuestion = parsed.current || 0;
            renderVocabQuestion(); // Render immediately with local data
        } catch (e) {
            console.error("Local data parse error", e);
        }
    }

    // Then sync with cloud (background)
    try {
        const response = await fetch('/load_vocab_progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: 'default_user' })
        });
        const data = await response.json();

        if (data.progress) {
            // Only overwrite if cloud has MORE progress (optional, but safer to trust local if user was offline)
            // For now, let's say if local is empty, use cloud. If both exist, use the one with higher answered count.
            const cloudAnswered = data.progress.answered || 0;
            if (cloudAnswered > vocabAnswered) {
                vocabScore = data.progress.score || 0;
                vocabAnswered = cloudAnswered;
                currentQuestion = data.progress.current || 0;
                renderVocabQuestion(); // Re-render with cloud data

                // Update local to match cloud
                localStorage.setItem('vocab_progress_local', JSON.stringify(data.progress));
            }
        }
    } catch (e) {
        console.error('Failed to load cloud progress, relying on local:', e);
    }

    if (vocabAnswered === 0 && !localData) {
        renderVocabQuestion();
    }
}

async function saveVocabProgress() {
    const progressData = {
        score: vocabScore,
        answered: vocabAnswered,
        current: currentQuestion
    };

    // Save to LocalStorage (Instant)
    localStorage.setItem('vocab_progress_local', JSON.stringify(progressData));

    // Save to Cloud (Async)
    try {
        await fetch('/save_vocab_progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: 'default_user',
                progress: progressData
            })
        });
    } catch (e) {
        console.error('Failed to save progress to cloud:', e);
    }
}

function renderVocabQuestion() {
    const container = document.getElementById('container-vocab');
    if (!container || currentQuestion >= vocabQuestions.length) {
        showVocabResults();
        return;
    }

    const q = vocabQuestions[currentQuestion];
    const qNum = currentQuestion + 1;
    const percentage = vocabAnswered > 0 ? Math.round((vocabScore / vocabAnswered) * 100) : 0;

    const html = `
        <div style="display: flex; gap: 30px; padding: 30px; max-width: 1400px; margin: 0 auto;">
            <!-- Left: Premium Scorecard Panel -->
            <div style="flex: 0 0 320px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 16px; padding: 30px; box-shadow: 0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08); height: fit-content; position: sticky; top: 20px; border: 1px solid rgba(132, 204, 22, 0.2);">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid var(--lime-primary);">
                    <span style="font-size: 1.8rem;">📊</span>
                    <h3 style="color: var(--lime-dark); margin: 0; font-size: 1.4rem; font-weight: 700;">Scorecard</h3>
                </div>
                
                <div style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                    <div style="font-size: 3.5rem; font-weight: 800; background: linear-gradient(135deg, var(--lime-primary) 0%, #16a34a 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-align: center; line-height: 1;">${percentage}%</div>
                    <div style="text-align: center; color: #666; margin-top: 10px; font-weight: 500;">${vocabScore} / ${vocabAnswered} Correct</div>
                </div>

                <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid#f0f0f0;">
                        <span style="color: #666; font-weight: 500;">Answered:</span>
                        <strong style="color: var(--lime-dark); font-size: 1.1rem;">${vocabAnswered}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;">
                        <span style="color: #666; font-weight: 500;">Current:</span>
                        <strong style="color: var(--lime-dark); font-size: 1.1rem;">${qNum} of ${vocabQuestions.length}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #666; font-weight: 500;">Remaining:</span>
                        <strong style="color: var(--lime-dark); font-size: 1.1rem;">${vocabQuestions.length - qNum}</strong>
                    </div>
                </div>

                <div style="position: relative; height: 12px; background: #e5e7eb; border-radius: 6px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="position: absolute; height: 100%; background: linear-gradient(90deg, var(--lime-primary) 0%, #16a34a 100%); width: ${(qNum / vocabQuestions.length) * 100}%; transition: width 0.5s ease; border-radius: 6px; box-shadow: 0 2px 8px rgba(132, 204, 22, 0.4);"></div>
                </div>
                <div style="text-align: center; color: #666; font-size: 0.9rem; margin-top: 8px; font-weight: 600;">
                    ${Math.round((qNum / vocabQuestions.length) * 100)}% Complete
                </div>

                <button onclick="resetVocabQuiz()" style="width: 100%; margin-top: 20px; padding: 12px; background: white; border: 2px solid var(--lime-primary); color: var(--lime-dark); border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='var(--lime-primary)'; this.style.color='white';" onmouseout="this.style.background='white'; this.style.color='var(--lime-dark)';">
                    🔄 Reset Progress
                </button>
            </div>

            <!-- Right: Question Area -->
            <div style="flex: 1;">
                <h2 style="color: var(--lime-dark); margin-top: 0; margin-bottom: 30px; font-size: 2rem; font-weight: 700;">Vocabulary Quiz</h2>

                <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <div style="margin-bottom: 10px; color: #666; font-size: 0.95rem; font-weight: 500;">📚 Category: ${q.category}</div>
                    <h3 style="font-size: 1.6rem; margin-bottom: 30px; color: #333; font-weight: 600;">What does "<strong style="color: var(--lime-dark);">${q.word}</strong>" mean?</h3>

                    <div id="vocab-options" style="display: flex; flex-direction: column; gap: 15px;">
                        ${q.options.map((opt, idx) => `
                            <button class="vocab-option" data-index="${idx}" onclick="selectVocabAnswer(${idx})" style="
                                padding: 18px 24px;
                                border: 2px solid #e0e0e0;
                                border-radius: 10px;
                                background: white;
                                text-align: left;
                                font-size: 1.1rem;
                                cursor: pointer;
                                transition: all 0.2s;
                                font-weight: 500;
                            " onmouseover="if(!this.disabled) { this.style.borderColor='var(--lime-primary)'; this.style.background='#f0fdf4'; }" onmouseout="if(!this.disabled && !this.style.color.includes('white')) { this.style.borderColor='#e0e0e0'; this.style.background='white'; }">
                                <strong style="color: var(--lime-dark);">${String.fromCharCode(65 + idx)}.</strong> ${opt}
                            </button>
                        `).join('')}
                    </div>

                    <div id="vocab-feedback" style="display: none; margin-top: 30px; padding: 20px; border-radius: 8px;"></div>

                    <button id="next-vocab-btn" onclick="nextVocabQuestion()" style="
                        display: none;
                        width: 100%;
                        padding: 16px;
                        margin-top: 20px;
                        background: var(--lime-primary);
                        color: white;
                        border: none;
                        border-radius: 10px;
                        font-size: 1.15rem;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.2s;
                        box-shadow: 0 4px 12px rgba(132, 204, 22, 0.3);
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(132, 204, 22, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(132, 204, 22, 0.3)';">Next Question →</button>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

async function selectVocabAnswer(selectedIdx) {
    const q = vocabQuestions[currentQuestion];
    const isCorrect = selectedIdx === q.correct;

    // Disable all options
    document.querySelectorAll('.vocab-option').forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
        btn.onmouseover = null;
        btn.onmouseout = null;
    });

    // Highlight correct and incorrect
    const options = document.querySelectorAll('.vocab-option');
    options[q.correct].style.background = '#22c55e';
    options[q.correct].style.borderColor = '#22c55e';
    options[q.correct].style.color = 'white';

    if (!isCorrect) {
        options[selectedIdx].style.background = '#ef4444';
        options[selectedIdx].style.borderColor = '#ef4444';
        options[selectedIdx].style.color = 'white';
    }

    vocabAnswered++;
    if (isCorrect) vocabScore++;

    // Save progress
    saveVocabProgress();

    // Add to Daily Target
    if (window.StorageManager) {
        window.StorageManager.addDailyPoints('vocab', 1);
    }

    // Fetch AI example
    const feedback = document.getElementById('vocab-feedback');
    feedback.style.display = 'block';
    feedback.innerHTML = `
        <div style="text-align: center;">
            <h3 style="color: ${isCorrect ? '#22c55e' : '#ef4444'}; margin-bottom: 15px; font-size: 1.4rem; font-weight: 700;">
                ${isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </h3>
            <p style="font-size: 1.15rem; margin-bottom: 15px;">
                <strong>Correct Answer:</strong> ${String.fromCharCode(65 + q.correct)}. ${q.options[q.correct]}
            </p>
            <div style="text-align: center; color: #666;">⏳ Loading example...</div>
        </div>
    `;

    // Fetch AI example
    try {
        const example = await getAIExample(q.word);
        feedback.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: ${isCorrect ? '#22c55e' : '#ef4444'}; margin-bottom: 15px; font-size: 1.4rem; font-weight: 700;">
                    ${isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                </h3>
                <p style="font-size: 1.15rem; margin-bottom: 15px;">
                    <strong>Correct Answer:</strong> ${String.fromCharCode(65 + q.correct)}. ${q.options[q.correct]}
                </p>
                <div style="background: linear-gradient(135deg, #f9fafb 0%, #f0fdf4 100%); padding: 20px; border-radius: 10px; border-left: 5px solid var(--lime-primary); box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                    <strong style="color: var(--lime-dark); font-size: 1.1rem;">📝 Example:</strong><br>
                    <span style="font-style: italic; color: #333; font-size: 1.05rem; line-height: 1.6;">${example}</span>
                </div>
                ${isCorrect ? `
                    <div id="sentence-prompt" style="margin-top: 25px; padding: 20px; background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 10px; border-left: 5px solid #f59e0b;">
                        <h4 style="color: #b45309; margin: 0 0 15px 0; font-size: 1.2rem;">✍️ Create Your Own Sentence!</h4>
                        <p style="color: #78350f; margin-bottom: 15px; font-size: 0.95rem;">Write a sentence using the word "<strong>${q.word}</strong>" to help you remember it.</p>
                        <textarea id="user-sentence" placeholder="Type your sentence here..." style="width: 100%; padding: 12px; border: 2px solid #fbbf24; border-radius: 8px; font-size: 1rem; min-height: 80px; resize: vertical;"></textarea>
                        <div style="display: flex; gap: 10px; margin-top: 15px;">
                            <button onclick="saveSentence('${q.word}', '${q.options[q.correct].replace(/'/g, "\\'")}', 'vocab')" style="flex: 1; padding: 12px; background: #f59e0b; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#d97706'" onmouseout="this.style.background='#f59e0b'">💾 Save Sentence</button>
                            <button onclick="skipSentence()" style="flex: 1; padding: 12px; background: #6b7280; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'">⏭️ Skip</button>
                        </div>
                        <div id="sentence-feedback" style="margin-top: 10px; display: none;"></div>
                    </div>
                ` : ''}
            </div>
        `;
    } catch (e) {
        console.error('Failed to fetch example:', e);
    }

    if (!isCorrect) {
        document.getElementById('next-vocab-btn').style.display = 'block';
    }
}

async function saveSentence(word, definition, type) {
    const sentenceInput = document.getElementById('user-sentence');
    const sentence = sentenceInput.value.trim();
    const feedbackDiv = document.getElementById('sentence-feedback');

    // Validation
    if (!sentence) {
        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = '<p style="color: #dc2626; font-weight: 600;">⚠️ Please enter a sentence first!</p>';
        return;
    }

    if (!sentence.toLowerCase().includes(word.toLowerCase())) {
        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = `<p style="color: #dc2626; font-weight: 600;">⚠️ Your sentence must include the word "${word}"!</p>`;
        return;
    }

    // Save to backend
    try {
        await fetch('/save_sentence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: 'default_user',
                sentence_data: {
                    type: type,
                    word: word,
                    definition: definition,
                    userSentence: sentence
                }
            })
        });

        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = '<p style="color: #16a34a; font-weight: 600;">✅ Sentence saved successfully!</p>';

        setTimeout(() => {
            document.getElementById('next-vocab-btn').style.display = 'block';
            document.getElementById('sentence-prompt').style.opacity = '0.6';
            sentenceInput.disabled = true;
        }, 800);
    } catch (e) {
        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = '<p style="color: #dc2626; font-weight: 600;">❌ Failed to save. Please try again.</p>';
        console.error('Failed to save sentence:', e);
    }
}

function skipSentence() {
    document.getElementById('next-vocab-btn').style.display = 'block';
    document.getElementById('sentence-prompt').style.opacity = '0.6';
}

async function getAIExample(word) {
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: `Create one example sentence using the word "${word}" that clearly demonstrates its meaning. Make it contextual and academic.`
            })
        });

        const data = await response.json();
        return data.reply || "Example unavailable.";  // Fixed: was data.message, should be data.reply
    } catch (e) {
        return "Example unavailable.";
    }
}

function nextVocabQuestion() {
    currentQuestion++;
    saveVocabProgress();
    renderVocabQuestion();
}

function jumpToQuestion(questionIndex) {
    currentQuestion = questionIndex;
    saveVocabProgress();
    renderVocabQuestion();
}

async function resetVocabQuiz() {
    if (confirm('Are you sure you want to reset your progress? This will clear your score and start from the beginning.')) {
        // Clear from cloud
        try {
            await fetch('/save_vocab_progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: 'default_user',
                    progress: null
                })
            });
        } catch (e) {
            console.error('Failed to reset progress:', e);
        }

        currentQuestion = 0;
        vocabScore = 0;
        vocabAnswered = 0;
        renderVocabQuestion();
    }
}

async function showVocabResults() {
    const container = document.getElementById('container-vocab');
    const percentage = Math.round((vocabScore / vocabAnswered) * 100);

    // Clear progress from cloud
    try {
        await fetch('/save_vocab_progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: 'default_user',
                progress: null
            })
        });
    } catch (e) {
        console.error('Failed to clear progress:', e);
    }

    container.innerHTML = `
        <div style="max-width: 700px; margin: 0 auto; padding: 50px; text-align: center;">
            <h1 style="color: var(--lime-dark); font-size: 3.5rem; margin-bottom: 30px; font-weight: 800;">🎉 Quiz Complete!</h1>
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 3px solid var(--lime-primary); border-radius: 16px; padding: 40px; margin-bottom: 30px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);">
                <h2 style="font-size: 5rem; background: linear-gradient(135deg, var(--lime-primary) 0%, #16a34a 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; font-weight: 800;">${percentage}%</h2>
                <p style="font-size: 1.8rem; color: #666; margin-top: 15px; font-weight: 600;">
                    ${vocabScore} / ${vocabAnswered} Correct
                </p>
            </div>
            <button onclick="loadVocabQuiz()" class="nav-btn" style="background: var(--lime-primary); color: white; padding: 18px 40px; font-size: 1.2rem; font-weight: 700; border-radius: 10px; box-shadow: 0 4px 12px rgba(132, 204, 22, 0.3); transition: all 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(132, 204, 22, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(132, 204, 22, 0.3)';">
                🔄 Restart Quiz
            </button>
        </div>
    `;
}

// Initialize on load
// Initialize on load - DISABLED to allow vocab_sets.js to take over
/*
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('container-vocab')) {
        loadVocabQuiz();
    }
});
*/
