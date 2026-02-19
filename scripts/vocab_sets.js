// ==========================================
// VOCABULARY MONTHLY SETS QUIZ SYSTEM
// ==========================================
// Organizes vocab into monthly sets (5 questions each)
// After 5 questions, user can optionally create a sentence

// NOTE: Expanding to 1800+ questions. Currently 50 AI-generated questions.

// Vocabulary Questions Pool - Will be expanded to 1800+
const vocabQuestionsPool = [
    // Batch 1: 50 AI-Generated Questions (User Provided)
    {
        "word": "Chicanery",
        "options": ["Financial stability", "Political diplomacy", "Sincere negotiation", "Clever deception"],
        "correct": 3,
        "category": "Deception"
    },
    {
        "word": "Mendacity",
        "options": ["Untruthfulness", "Aggressive behavior", "Mental fortitude", "Charitable giving"],
        "correct": 0,
        "category": "Deception"
    },
    {
        "word": "Specious",
        "options": ["Widely accepted", "Thoroughly researched", "Deceptively attractive", "Intentionally vague"],
        "correct": 2,
        "category": "Deception"
    },
    {
        "word": "Equivocate",
        "options": ["To balance exactly", "To speak ambiguously", "To surrender openly", "To promise sincerely"],
        "correct": 1,
        "category": "Deception"
    },
    {
        "word": "Prevaricate",
        "options": ["To deviate from the truth", "To prepare in advance", "To act impulsively", "To state clearly"],
        "correct": 0,
        "category": "Deception"
    },
    {
        "word": "Surreptitious",
        "options": ["Overly confident", "Highly suspicious", "Kept secret", "Aggressively overt"],
        "correct": 2,
        "category": "Deception"
    },
    {
        "word": "Perfidious",
        "options": ["Extremely accurate", "Easily influenced", "Highly respected", "Deliberately disloyal"],
        "correct": 3,
        "category": "Deception"
    },
    {
        "word": "Erudite",
        "options": ["Socially awkward", "Showing great knowledge", "Easily confused", "Speaking softly"],
        "correct": 1,
        "category": "Intelligence"
    },
    {
        "word": "Perspicacious",
        "options": ["Having ready insight", "Lacking clear vision", "Overly complex", "Stubbornly ignorant"],
        "correct": 0,
        "category": "Intelligence"
    },
    {
        "word": "Pedantic",
        "options": ["Teaching effectively", "Lacking formal education", "Overly concerned with rules", "Walking extensively"],
        "correct": 2,
        "category": "Intelligence"
    },
    {
        "word": "Recondite",
        "options": ["Widely celebrated", "Obscure and profound", "Recently discovered", "Easily accessible"],
        "correct": 1,
        "category": "Intelligence"
    },
    {
        "word": "Esoteric",
        "options": ["Universally appealing", "Overly simplified", "Outwardly focused", "Understood by few"],
        "correct": 3,
        "category": "Intelligence"
    },
    {
        "word": "Sagacious",
        "options": ["Having good judgment", "Lacking basic sense", "Acting impulsively", "Speaking loudly"],
        "correct": 0,
        "category": "Intelligence"
    },
    {
        "word": "Acumen",
        "options": ["Financial deficit", "Mathematical error", "Keen business insight", "Corporate restructuring"],
        "correct": 2,
        "category": "Business"
    },
    {
        "word": "Sycophant",
        "options": ["A visionary leader", "An independent thinker", "A harsh critic", "A flattering yes-man"],
        "correct": 3,
        "category": "Business"
    },
    {
        "word": "Fiduciary",
        "options": ["Relating to physical assets", "Involving financial trust", "Lacking legal standing", "Concerning corporate governance"],
        "correct": 1,
        "category": "Business"
    },
    {
        "word": "Pecuniary",
        "options": ["Relating to money", "Unique in nature", "Involving property", "Relating to contracts"],
        "correct": 0,
        "category": "Business"
    },
    {
        "word": "Remuneration",
        "options": ["Job termination", "Performance review", "Financial compensation", "Task delegation"],
        "correct": 2,
        "category": "Business"
    },
    {
        "word": "Lucrative",
        "options": ["Highly risky", "Producing great profit", "Failing consistently", "Requiring immense effort"],
        "correct": 1,
        "category": "Business"
    },
    {
        "word": "Fungible",
        "options": ["Easily broken", "Rapidly growing", "Unique and irreplaceable", "Mutually interchangeable"],
        "correct": 3,
        "category": "Business"
    },
    {
        "word": "Profligate",
        "options": ["Recklessly extravagant", "Highly profitable", "Carefully invested", "Financially secure"],
        "correct": 0,
        "category": "Business"
    },
    {
        "word": "Insolvent",
        "options": ["Highly liquid", "Chemically unstable", "Unable to pay debts", "Earning compound interest"],
        "correct": 2,
        "category": "Business"
    },
    {
        "word": "Obsequious",
        "options": ["Rude and dismissive", "Excessively submissive", "Quietly observant", "Loudly argumentative"],
        "correct": 1,
        "category": "Behavior"
    },
    {
        "word": "Recalcitrant",
        "options": ["Eager to please", "Quick to forgive", "Easily persuaded", "Stubbornly uncooperative"],
        "correct": 3,
        "category": "Behavior"
    },
    {
        "word": "Intransigent",
        "options": ["Unwilling to compromise", "Moving between places", "Acting transparently", "Changing frequently"],
        "correct": 0,
        "category": "Behavior"
    },
    {
        "word": "Capricious",
        "options": ["Steadfast and reliable", "Carefully planned", "Given to sudden mood changes", "Governed by strict logic"],
        "correct": 2,
        "category": "Behavior"
    },
    {
        "word": "Fastidious",
        "options": ["Working very quickly", "Very attentive to detail", "Ignoring basic rules", "Eating indiscriminately"],
        "correct": 1,
        "category": "Behavior"
    },
    {
        "word": "Magnanimous",
        "options": ["Physically imposing", "Highly intelligent", "Extremely wealthy", "Generous and forgiving"],
        "correct": 3,
        "category": "Behavior"
    },
    {
        "word": "Pusillanimous",
        "options": ["Showing a lack of courage", "Demonstrating great strength", "Acting aggressively", "Speaking eloquently"],
        "correct": 0,
        "category": "Behavior"
    },
    {
        "word": "Truculent",
        "options": ["Peaceful and calm", "Highly honest", "Eager or quick to argue", "Easily deceived"],
        "correct": 2,
        "category": "Behavior"
    },
    {
        "word": "Loquacious",
        "options": ["Quiet and reserved", "Tending to talk profusely", "Speaking very softly", "Using complex words"],
        "correct": 1,
        "category": "Communication"
    },
    {
        "word": "Taciturn",
        "options": ["Always complaining", "Speaking rapidly", "Highly expressive", "Uncommunicative in speech"],
        "correct": 3,
        "category": "Communication"
    },
    {
        "word": "Garrulous",
        "options": ["Excessively talkative", "Physically aggressive", "Highly secretive", "Carefully spoken"],
        "correct": 0,
        "category": "Communication"
    },
    {
        "word": "Grandiloquent",
        "options": ["Speaking plainly", "Using vulgar language", "Pompous or extravagant in language", "Whispering quietly"],
        "correct": 2,
        "category": "Communication"
    },
    {
        "word": "Vituperate",
        "options": ["To praise highly", "To blame or insult with strong language", "To speak clearly", "To summarize effectively"],
        "correct": 1,
        "category": "Communication"
    },
    {
        "word": "Polemic",
        "options": ["A brief summary", "A neutral observation", "A poetic verse", "A strong verbal or written attack"],
        "correct": 3,
        "category": "Communication"
    },
    {
        "word": "Platitude",
        "options": ["A remark with empty meaning", "A profound realization", "A complex argument", "A unique perspective"],
        "correct": 0,
        "category": "Communication"
    },
    {
        "word": "Inscrutable",
        "options": ["Easily deciphered", "Thoroughly analyzed", "Impossible to understand", "Carefully organized"],
        "correct": 2,
        "category": "Complexity"
    },
    {
        "word": "Labyrinthine",
        "options": ["Straight and narrow", "Highly intricate and twisting", "Simple and clear", "Short and direct"],
        "correct": 1,
        "category": "Complexity"
    },
    {
        "word": "Convoluted",
        "options": ["Logically sound", "Easily explained", "Highly controversial", "Extremely complex and difficult to follow"],
        "correct": 3,
        "category": "Complexity"
    },
    {
        "word": "Enigmatic",
        "options": ["Mysterious and difficult to interpret", "Clear and obvious", "Scientifically proven", "Historically accurate"],
        "correct": 0,
        "category": "Complexity"
    },
    {
        "word": "Intractable",
        "options": ["Easily managed", "Physically broken", "Hard to control or deal with", "Quickly repaired"],
        "correct": 2,
        "category": "Complexity"
    },
    {
        "word": "Quagmire",
        "options": ["A solid foundation", "A hazardous or complex situation", "A clear pathway", "A sudden realization"],
        "correct": 1,
        "category": "Complexity"
    },
    {
        "word": "Ephemeral",
        "options": ["Lasting forever", "Occurring monthly", "Highly predictable", "Lasting for a very short time"],
        "correct": 3,
        "category": "Time and Change"
    },
    {
        "word": "Evanescent",
        "options": ["Quickly fading from sight or memory", "Growing continually", "Remaining permanently", "Changing periodically"],
        "correct": 0,
        "category": "Time and Change"
    },
    {
        "word": "Mitigate",
        "options": ["To increase in size", "To initiate a process", "To make less severe or painful", "To completely destroy"],
        "correct": 2,
        "category": "Time and Change"
    },
    {
        "word": "Exacerbate",
        "options": ["To heal completely", "To make a problem or bad situation worse", "To ignore entirely", "To solve efficiently"],
        "correct": 1,
        "category": "Time and Change"
    },
    {
        "word": "Ameliorate",
        "options": ["To cause deliberate harm", "To mix thoroughly", "To break apart", "To make something bad better"],
        "correct": 3,
        "category": "Time and Change"
    },
    {
        "word": "Inexorable",
        "options": ["Impossible to stop or prevent", "Easily persuaded", "Highly flexible", "Changing frequently"],
        "correct": 0,
        "category": "Time and Change"
    },
    {
        "word": "Anachronistic",
        "options": ["Perfectly timed", "Chronologically ordered", "Belonging to a period other than that portrayed", "Occurring simultaneously"],
        "correct": 2,
        "category": "Time and Change"
    }
    ,
    {
        "word": "Antipathy",
        "options": [
            "regularly found among particular people or in a certain area",
            "having mixed feelings or contradictory ideas",
            "a deep-seated feeling of dislike",
            "a general law, rule, principle, or criterion"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Concede",
        "options": [
            "to admit that something is true after denying it",
            "having mixed feelings or contradictory ideas",
            "not having enough of a specified quality",
            "to hold someone in very high regard"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Desiccate",
        "options": [
            "extremely or unusually small",
            "to remove the moisture from; dry out",
            "a system in which members are ranked according to status",
            "tending to be different or develop in different directions"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Disparate",
        "options": [
            "essentially different in kind; not comparable",
            "to adopt or support a cause, belief, or way of life",
            "fair and impartial",
            "sarcastic in a scathing and bitter way"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Doctrine",
        "options": [
            "to leave property to a person by a will",
            "a belief or set of beliefs held by a group",
            "to cause or give rise to a feeling or situation",
            "the state of being involved with others in illegal activity"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Fractious",
        "options": [
            "neatly skillful and quick in one's movements",
            "a person who takes particular pleasure in fine food",
            "irritable and quarrelsome",
            "a person falsely claiming to have special knowledge"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Contrite",
        "options": [
            "causing harm or damage",
            "abundant in supply or quantity",
            "feeling or expressing remorse",
            "lasting for a very short time"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Diminutive",
        "options": [
            "to intrude on a person's territory or rights",
            "giving a lot of information clearly in few words",
            "extremely or unusually small",
            "to evade or escape from, typically in a skillful way"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Discomfit",
        "options": [
            "to make someone feel uneasy or embarrassed",
            "to fail to give a true notion or impression of something",
            "to regard with disgust and hatred",
            "to declare one's public approval or support of"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Fallacy",
        "options": [
            "to create or bring about by deliberate effort",
            "open and responsive to suggestion",
            "a mistaken belief based on unsound argument",
            "to remove matter thought to be objectionable"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Discrepancy",
        "options": [
            "a system of government in which decisions are made by state officials",
            "obtained, done by, or involving deception",
            "a lack of compatibility or similarity",
            "producing or capable of producing abundant growth"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Forensic",
        "options": [
            "relating to or denoting the application of scientific methods",
            "a thing with distinct and independent existence",
            "making great demands on one's skill or attention",
            "to express disapproval of"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Extemporaneous",
        "options": [
            "a feeling of intense excitement and happiness",
            "to regard or represent as being of little worth",
            "a system in which members are ranked according to status",
            "spoken or done without preparation"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Forbearance",
        "options": [
            "abundant in supply or quantity",
            "friendly, lively, and enjoyable",
            "patient self-control; restraint and tolerance",
            "to destroy completely; put an end to"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Depict",
        "options": [
            "to express disapproval of",
            "to show or represent by drawing or painting",
            "faithfulness to a person, cause, or belief",
            "showing a great deal of variety"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Alchemy",
        "options": [
            "to cause someone to become hostile",
            "possible to do easily or conveniently",
            "a seemingly magical process of transformation",
            "an official ban on trade or commercial activity"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Concomitant",
        "options": [
            "naturally accompanying or associated",
            "lack of interest, enthusiasm, or concern",
            "lacking significance through having been overused",
            "the ability to speak or write a foreign language easily"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Gallant",
        "options": [
            "brave, heroic, or chivalrous",
            "deserving blame",
            "a person who claims to have supernatural insight",
            "a system in which members are ranked according to status"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Dubious",
        "options": [
            "hesitating or doubting",
            "an expert judge in matters of taste",
            "an attack on the reputation or integrity of someone",
            "showing a critical or disrespectful attitude"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Equivocate",
        "options": [
            "having or showing an ability to accurately assess situations",
            "friendly, lively, and enjoyable",
            "to use ambiguous language to conceal the truth",
            "to persuade someone forcefully to do something"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Convivial",
        "options": [
            "an extensive fire that destroys great areas",
            "to cause someone to feel drained of energy",
            "friendly, lively, and enjoyable",
            "to make someone feel uneasy or embarrassed"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Copious",
        "options": [
            "abundant in supply or quantity",
            "entirely lacking or free from",
            "to perplex someone greatly; bewilder",
            "to match or surpass, typically by imitation"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Erudite",
        "options": [
            "originating in or characteristic of a distant foreign country",
            "having or showing great knowledge or learning",
            "well chosen or suited to the circumstances",
            "to be of the same opinion; agree"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Enumerate",
        "options": [
            "to mention a number of things one by one",
            "regularly found among particular people or in a certain area",
            "unfortunate",
            "an award or privilege granted as special honor"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Fragile",
        "options": [
            "easily broken or damaged",
            "to publicly denounce",
            "to publicly declare to be wrong or evil",
            "to cause someone to become hostile"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Abscond",
        "options": [
            "a thing that completes or brings to perfection",
            "to rise and fall irregularly in number or amount",
            "unfairly prejudiced for or against someone",
            "to leave hurriedly and secretly"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Bolster",
        "options": [
            "to support or strengthen",
            "still in existence; surviving",
            "to ask someone earnestly or anxiously",
            "involving or requiring strenuous effort; difficult"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Condescend",
        "options": [
            "given to sudden and unaccountable changes of mood",
            "to show feelings of superiority; be patronizing",
            "deserving strong condemnation",
            "originating in or characteristic of a distant foreign country"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Fanatical",
        "options": [
            "a person's face or facial expression",
            "filled with excessive enthusiasm or zeal",
            "to erase or remove completely",
            "pressing; demanding"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Animosity",
        "options": [
            "bad-tempered or irritable",
            "to capture the fascinated attention of",
            "strong hostility",
            "a short extract from a text"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Asylum",
        "options": [
            "to praise enthusiastically",
            "to regard or represent as being of little worth",
            "protection from arrest and extradition",
            "a loud, unpleasant, and prolonged noise"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Haughty",
        "options": [
            "to pretend to be affected by a feeling or state",
            "the belief that all events are predetermined",
            "arrogantly superior and disdainful",
            "a statement or proposition regarded as self-evidently true"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Disputatious",
        "options": [
            "a sudden and ignominious failure",
            "fond of having heated arguments",
            "having a red or flushed complexion or excessively ornate",
            "to treat a sacred place with violent disrespect"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Feign",
        "options": [
            "to pretend to be affected by a feeling or state",
            "lacking a plan, purpose, or enthusiasm",
            "to persuade someone not to take a course of action",
            "to discourage someone from doing something"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Extol",
        "options": [
            "ready to accept control or instruction; submissive",
            "unfairly prejudiced for or against someone",
            "to praise enthusiastically",
            "to restrict something within limits"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Expedient",
        "options": [
            "given to sudden and unaccountable changes of mood",
            "to distribute or spread over a wide area",
            "convenient and practical although possibly improper",
            "of doubtful authenticity, although widely circulated"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Fleeting",
        "options": [
            "to obscure the light from or to another celestial body",
            "a person falsely claiming to have special knowledge",
            "deserving hatred and contempt",
            "lasting for a very short time"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Expurgate",
        "options": [
            "a thing that completes or brings to perfection",
            "to make known private or sensitive information",
            "to remove matter thought to be objectionable",
            "very severe or serious"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Compunction",
        "options": [
            "a feeling of guilt or moral scruple",
            "forming a necessary base or core; of central importance",
            "a general law, rule, principle, or criterion",
            "lack of harmony among musical notes or opinions"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Evanescent",
        "options": [
            "soon passing out of sight or existence",
            "complete; including all elements",
            "a short amusing or interesting story",
            "easily persuaded to believe something"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Disheveled",
        "options": [
            "to conceal one's true motives or feelings",
            "changing frequently, especially regarding loyalty",
            "untidy or disordered in appearance",
            "to shock or excite someone into taking action"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Expound",
        "options": [
            "to make known private or sensitive information",
            "showing a skillful use of underhanded tactics",
            "be filled with a feeling of love for",
            "to present and explain a theory or idea systematically"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Earnest",
        "options": [
            "a mild or indirect word substituted for one considered harsh",
            "resulting from or showing sincere conviction",
            "not having enough of a specified quality",
            "to ask someone earnestly or anxiously"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Haphazard",
        "options": [
            "a person or thing that is the direct opposite",
            "a lack of compatibility or similarity",
            "lacking any obvious principle of organization",
            "mental calmness and evenness of temper"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Anachronism",
        "options": [
            "greed for money or possessions",
            "something belonging to a period other than that being portrayed",
            "to make known private or sensitive information",
            "to make someone feel uneasy or embarrassed"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Complacent",
        "options": [
            "not showing proper seriousness or respect",
            "showing smug or uncritical satisfaction",
            "to extract the essential meaning or most important aspects",
            "vivacious and enthusiastic"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Felicitous",
        "options": [
            "deserving strong condemnation",
            "well chosen or suited to the circumstances",
            "to destroy completely; put an end to",
            "expressing feelings of gratitude or approval unrestrainedly"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Cabal",
        "options": [
            "behavior in keeping with good taste",
            "to feel or express strong disapproval of",
            "a secret political clique or faction",
            "to regard or consider in a specified way"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Fervor",
        "options": [
            "showing great care and perseverance",
            "to intrude on a person's territory or rights",
            "intense and passionate feeling",
            "to be a warning or indication of a future event"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Entity",
        "options": [
            "a thing with distinct and independent existence",
            "belief in or acceptance of something as true",
            "to adopt or support a cause, belief, or way of life",
            "done openly and unashamedly"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Aesthetic",
        "options": [
            "open and responsive to suggestion",
            "sharing a common border; touching",
            "concerned with beauty or appreciation of beauty",
            "not having enough of a specified quality"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Farcical",
        "options": [
            "imitative of the work of another person",
            "relating to or resembling a farce; absurd",
            "showing a great deal of variety",
            "to pull or knock down a building"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Dissent",
        "options": [
            "not openly acknowledged or displayed",
            "to make a doubt, feeling, or belief disappear",
            "very old or old-fashioned",
            "to hold or express opinions that differ from official ones"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Desolate",
        "options": [
            "filled with or characterized by lively energy",
            "lax in morals; licentious",
            "feeling or showing misery or loneliness",
            "covering a wide area in terms of space or scope"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Credulous",
        "options": [
            "tending to cause harm",
            "clever or skillful in using hands or mind",
            "having or showing too great a readiness to believe",
            "attempting to avoid notice or attention; secretive"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Berate",
        "options": [
            "the use of many words where fewer would do",
            "to scold or criticize angrily",
            "done openly and unashamedly",
            "the great or extreme scale, seriousness, or extent"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Heresy",
        "options": [
            "concise and exact use of words; briefness",
            "belief or opinion contrary to orthodox religious doctrine",
            "treating serious issues with deliberately inappropriate humor",
            "to happen or occur afterwards or as a result"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Digress",
        "options": [
            "familiar with and at ease in many countries",
            "to leave the main subject temporarily in speech",
            "an action intended to secure an advantage",
            "wishing to do what is right"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Contentious",
        "options": [
            "causing or likely to cause an argument",
            "to restrict or burden someone in a way that prevents action",
            "having or showing a keen interest in or enthusiasm",
            "feeling or expressing remorse"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Esoteric",
        "options": [
            "to use ambiguous language to conceal the truth",
            "anxious or fearful that something bad will happen",
            "treating serious issues with deliberately inappropriate humor",
            "intended for or understood by only a small group"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Endemic",
        "options": [
            "regularly found among particular people or in a certain area",
            "open and responsive to suggestion",
            "a feeling of intense excitement and happiness",
            "to be a warning or indication of a future event"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Extort",
        "options": [
            "an attack on the reputation or integrity of someone",
            "to obtain something by force or threats",
            "a thing that provides resistance or obstruction",
            "extremely stupid or foolish"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Buttress",
        "options": [
            "to provide support or strengthen",
            "to persuade someone forcefully to do something",
            "having or showing great knowledge or learning",
            "high-sounding but with little meaning"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Din",
        "options": [
            "a loud, unpleasant, and prolonged noise",
            "a loud and confused noise",
            "to hold someone in very high regard",
            "a scarcity or lack of something"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Boon",
        "options": [
            "a thing that is helpful or beneficial",
            "to gather or collect something",
            "to pacify or placate someone by acceding to their demands",
            "inspiring fear or respect through being large or powerful"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Apocryphal",
        "options": [
            "of doubtful authenticity, although widely circulated",
            "intended to teach, particularly in moral instruction",
            "having a meaning that is mysterious or obscure",
            "active or occurring spasmodically or intermittently"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Amorphous",
        "options": [
            "stated clearly and in detail",
            "increasing by successive additions",
            "to show or declare that someone is not guilty",
            "without a clearly defined shape or form"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Benign",
        "options": [
            "gentle and kindly; not harmful",
            "to restrict or burden someone in a way that prevents action",
            "no longer existing or functioning",
            "to present and explain a theory or idea systematically"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Gainsay",
        "options": [
            "arrogantly superior and disdainful",
            "robust; capable of enduring difficult conditions",
            "to deny or contradict a fact or statement",
            "sharing a common border; touching"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Excoriate",
        "options": [
            "impressive delicacy and skill",
            "to leave the main subject temporarily in speech",
            "to criticize someone severely",
            "to abandon or leave someone"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Aspersion",
        "options": [
            "the belief that all events are predetermined",
            "to confirm or give support to a statement",
            "a factual written account of important events",
            "an attack on the reputation or integrity of someone"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Efficacious",
        "options": [
            "to deny or contradict a fact or statement",
            "disagreement between people",
            "successful in producing a desired result",
            "to capture the fascinated attention of"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Halcyon",
        "options": [
            "pressing; demanding",
            "friendly and cheerful",
            "denoting a period of time in the past that was peaceful",
            "to match or surpass, typically by imitation"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Hubris",
        "options": [
            "a thing that provides resistance or obstruction",
            "the use of trickery to achieve a political or legal purpose",
            "moral corruption; wickedness",
            "excessive pride or self-confidence"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Espouse",
        "options": [
            "based on a mistaken belief",
            "unconventional and slightly strange",
            "to adopt or support a cause, belief, or way of life",
            "unfortunate"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Deplorable",
        "options": [
            "deserving strong condemnation",
            "separate or disconnected",
            "to reduce in extent or quantity",
            "a minor weakness or eccentricity in someone's character"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Frustrate",
        "options": [
            "corresponding in size or degree; proportionate",
            "a statement or proposition regarded as self-evidently true",
            "filled with or characterized by lively energy",
            "to prevent a plan or action from progressing"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Antithesis",
        "options": [
            "a person's death",
            "diverse in character or content",
            "pressing; demanding",
            "a person or thing that is the direct opposite"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Gullible",
        "options": [
            "untidy or disordered in appearance",
            "a thing that someone believes is real but exists only in imagination",
            "easily persuaded to believe something",
            "no longer existing or functioning"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Altruism",
        "options": [
            "unselfish concern for the welfare of others",
            "neatly skillful and quick in one's movements",
            "an extensive fire that destroys great areas",
            "to ask someone urgently and fervently"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Feasible",
        "options": [
            "to gather or collect something",
            "possible to do easily or conveniently",
            "to shock or excite someone into taking action",
            "to make something greater by adding to it"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Encroach",
        "options": [
            "increasing by successive additions",
            "to intrude on a person's territory or rights",
            "to express severe disapproval of someone",
            "to feel or express strong disapproval of"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Devoid",
        "options": [
            "a person who organizes and operates a business",
            "unreasonably high in price",
            "friendly, lively, and enjoyable",
            "entirely lacking or free from"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Feckless",
        "options": [
            "to bring or recall a feeling or memory to the mind",
            "an award or privilege granted as special honor",
            "lacking initiative or strength of character",
            "to make something greater by adding to it"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Enmity",
        "options": [
            "having mixed feelings or contradictory ideas",
            "convenient and practical although possibly improper",
            "to issue or spread out from a source",
            "the state of being actively opposed or hostile"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Consummate",
        "options": [
            "showing a high degree of skill and flair",
            "separate or disconnected",
            "to expose the falseness of an idea or belief",
            "to erase a mark from a surface"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Exponential",
        "options": [
            "belief or opinion contrary to orthodox religious doctrine",
            "bad-tempered or irritable",
            "conducive to success; favorable",
            "becoming more and more rapid"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Heinous",
        "options": [
            "belief or opinion contrary to orthodox religious doctrine",
            "utterly odious or wicked",
            "an ugly, twisted expression on a person's face",
            "to happen or occur afterwards or as a result"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Elusive",
        "options": [
            "forming a necessary base or core; of central importance",
            "difficult to find, catch, or achieve",
            "characterized by severe self-discipline and abstention",
            "a political leader who seeks support by appealing to prejudices"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Engender",
        "options": [
            "to cause or give rise to a feeling or situation",
            "lacking initiative or strength of character",
            "conspicuously or obviously offensive",
            "to declare one's public approval or support of"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Antecedent",
        "options": [
            "a person who gives money or other help",
            "feelings of anxiety or dismay",
            "a thing that existed before or logically precedes another",
            "to make something bad or unsatisfactory better"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Defunct",
        "options": [
            "making a certain situation or outcome likely",
            "to make a problem or bad situation worse",
            "general agreement",
            "no longer existing or functioning"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Aggrandize",
        "options": [
            "to perceive or recognize something",
            "to increase the power, status, or wealth",
            "unselfish concern for the welfare of others",
            "denoting a period of time in the past that was peaceful"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Flout",
        "options": [
            "the making of false and defamatory statements",
            "to agree or give consent",
            "to openly disregard a rule, law, or convention",
            "to adopt or support a cause, belief, or way of life"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Endorse",
        "options": [
            "to declare one's public approval or support of",
            "a thing with distinct and independent existence",
            "subject to chance; dependent on",
            "inspiring fear or respect through being large or powerful"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Cacophony",
        "options": [
            "a harsh, discordant mixture of sounds",
            "to openly disregard a rule, law, or convention",
            "to praise enthusiastically",
            "impressive delicacy and skill"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Expunge",
        "options": [
            "used in ordinary or familiar conversation",
            "to erase or remove completely",
            "corresponding in size or degree; proportionate",
            "sarcastic in a scathing and bitter way"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Extraneous",
        "options": [
            "extremely delicate and light",
            "irrelevant or unrelated to the subject",
            "a thing with distinct and independent existence",
            "to show or represent by drawing or painting"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Diffuse",
        "options": [
            "spread out over a large area; not concentrated",
            "corresponding in size or degree; proportionate",
            "relating to or denoting the application of scientific methods",
            "lacking ease or grace; unsophisticated"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Fraudulent",
        "options": [
            "a general law, rule, principle, or criterion",
            "used in ordinary or familiar conversation",
            "obtained, done by, or involving deception",
            "to be of the same opinion; agree"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Deem",
        "options": [
            "to cause or give rise to a feeling or situation",
            "filled with or characterized by lively energy",
            "to evade or escape from, typically in a skillful way",
            "to regard or consider in a specified way"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Capricious",
        "options": [
            "humble submission and respect",
            "a person's death",
            "given to sudden and unaccountable changes of mood",
            "serving as a desirable model; very good"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Disingenuous",
        "options": [
            "based on a mistaken belief",
            "based on what is generally done or believed",
            "not candid or sincere, typically pretending ignorance",
            "giving a lot of information clearly in few words"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Fulsome",
        "options": [
            "complimentary or flattering to an excessive degree",
            "a secret political clique or faction",
            "easily persuaded to believe something",
            "possible to do easily or conveniently"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Exotic",
        "options": [
            "diverse in character or content",
            "the quality of behaving to avoid causing offense",
            "to happen or occur afterwards or as a result",
            "originating in or characteristic of a distant foreign country"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Ebullient",
        "options": [
            "deserving hatred and contempt",
            "cheerful and full of energy",
            "to use ambiguous language to conceal the truth",
            "having or displaying a friendly manner"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Enhance",
        "options": [
            "friendly, lively, and enjoyable",
            "forming a necessary base or core; of central importance",
            "to intensify, increase, or further improve the quality",
            "extreme amusement, especially when expressed by laughter"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Burgeon",
        "options": [
            "to begin to grow or increase rapidly",
            "a thing that existed before or logically precedes another",
            "brisk and cheerful readiness",
            "to gradually decline in effectiveness or vigor"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Discredit",
        "options": [
            "to harm the good reputation of someone",
            "to be a warning or indication of a future event",
            "to accept and allow behavior that is wrong",
            "the feeling that someone is unworthy of respect"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Colloquial",
        "options": [
            "a person who claims to have supernatural insight",
            "conducive to success; favorable",
            "causing or likely to cause an argument",
            "used in ordinary or familiar conversation"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Garrulous",
        "options": [
            "excessively talkative, especially on trivial matters",
            "the ability to understand and share the feelings of another",
            "the making of false and defamatory statements",
            "changing frequently, especially regarding loyalty"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Dolorous",
        "options": [
            "showing or having an insensitive and cruel disregard",
            "originating in or characteristic of a distant foreign country",
            "feeling or expressing great sorrow",
            "a person who gives money or other help"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Deign",
        "options": [
            "to struggle or stagger helplessly",
            "to do something that one considers beneath one's dignity",
            "not influenced by personal involvement; impartial",
            "irrelevant or unrelated to the subject"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Coterie",
        "options": [
            "high-sounding but with little meaning",
            "a small group of people with shared interests",
            "to disappear or cause to disappear",
            "the ability to make good judgments and quick decisions"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Hyperbole",
        "options": [
            "comparable in certain respects",
            "a belief or set of beliefs held by a group",
            "vivacious and enthusiastic",
            "exaggerated statements not meant to be taken literally"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Beseech",
        "options": [
            "not influenced by strong emotion; rational",
            "to ask someone urgently and fervently",
            "to depart from an established course",
            "to extend the application of a method or conclusion"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Corroborate",
        "options": [
            "to confirm or give support to a statement",
            "tending to cause harm",
            "sparing or economical with regard to money or food",
            "the state of being involved with others in illegal activity"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Adulation",
        "options": [
            "to ask someone urgently and fervently",
            "showing a high degree of skill and flair",
            "angry or dissatisfied",
            "excessive admiration or praise"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Fastidious",
        "options": [
            "very attentive to accuracy and detail",
            "faithfulness to a person, cause, or belief",
            "causing or affected by great anxiety or stress",
            "individually separate and distinct"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Hierarchy",
        "options": [
            "filled with or characterized by lively energy",
            "a system in which members are ranked according to status",
            "to prevent or obstruct an anticipated event",
            "thinking only of oneself"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Destitute",
        "options": [
            "faithfulness to a person, cause, or belief",
            "to issue or spread out from a source",
            "to find a way around an obstacle",
            "without the basic necessities of life"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Erratic",
        "options": [
            "to perceive or recognize something",
            "not even or regular in pattern or movement",
            "thinking only of oneself",
            "high-sounding but with little meaning"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Compelling",
        "options": [
            "evoking interest, attention, or admiration",
            "to make someone feel uneasy or embarrassed",
            "in keeping with good taste and propriety",
            "lacking ease or grace; unsophisticated"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Fawn",
        "options": [
            "a scarcity or lack of something",
            "not showing proper seriousness or respect",
            "to display exaggerated flattery toward someone",
            "a thing that existed before or logically precedes another"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Germane",
        "options": [
            "characterized by severe self-discipline and abstention",
            "to leave hurriedly and secretly",
            "to regard with disgust and hatred",
            "relevant to a subject under consideration"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Canon",
        "options": [
            "a general law, rule, principle, or criterion",
            "not having enough of a specified quality",
            "to abandon or leave someone",
            "behaving in a way that suggests higher standards than actual behavior"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Glean",
        "options": [
            "having or showing the ability to speak fluently",
            "hostile and aggressive",
            "to extract information from various sources",
            "deriving ideas from a broad range of sources"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Embezzle",
        "options": [
            "to steal or misappropriate money placed in trust",
            "to use ambiguous language to conceal the truth",
            "to treat a sacred place with violent disrespect",
            "not candid or sincere, typically pretending ignorance"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Conciliatory",
        "options": [
            "intended or likely to placate or pacify",
            "irritable and quarrelsome",
            "having or showing care in one's work or duties",
            "something that deviates from what is standard"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Euphemism",
        "options": [
            "naturally accompanying or associated",
            "to be a warning or indication of a future event",
            "a mild or indirect word substituted for one considered harsh",
            "to display something ostentatiously"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Devious",
        "options": [
            "an expert judge in matters of taste",
            "lasting for a very short time",
            "deserving blame",
            "showing a skillful use of underhanded tactics"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Construe",
        "options": [
            "to interpret a word or action in a particular way",
            "unconventional and slightly strange",
            "possible to do easily or conveniently",
            "an agreement made by mutual concession"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Dissipate",
        "options": [
            "an ugly, twisted expression on a person's face",
            "inclined to lay down principles as incontrovertibly true",
            "to disappear or cause to disappear",
            "complimentary or flattering to an excessive degree"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Deplore",
        "options": [
            "to make a doubt, feeling, or belief disappear",
            "to restrict something within limits",
            "to feel or express strong disapproval of",
            "tending to avoid commitment or self-revelation"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Hindrance",
        "options": [
            "a person or thing that is mysterious or difficult to understand",
            "deserving strong condemnation",
            "to express contempt for; ridicule",
            "a thing that provides resistance or obstruction"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Egregious",
        "options": [
            "outstandingly bad; shocking",
            "insolent or impertinent behavior",
            "to persuade someone to do something by flattery",
            "anxious or fearful that something bad will happen"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Harangue",
        "options": [
            "a lengthy and aggressive speech",
            "disagreement between people",
            "a statement or proposition regarded as self-evidently true",
            "clear, logical, and convincing"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Deft",
        "options": [
            "difficult to find, catch, or achieve",
            "neatly skillful and quick in one's movements",
            "the act of insulting or showing contempt for God",
            "an attack on the reputation or integrity of someone"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Flaunt",
        "options": [
            "to do something that one considers beneath one's dignity",
            "greed for money or possessions",
            "to display something ostentatiously",
            "to invent or concoct something false"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Extricate",
        "options": [
            "to free someone from a difficult situation",
            "in a state of disrepair or ruin",
            "courteous and gallant, especially toward women",
            "to feel or express strong disapproval of"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Derogatory",
        "options": [
            "deserving hatred and contempt",
            "corresponding in size or degree; proportionate",
            "a thing that is helpful or beneficial",
            "showing a critical or disrespectful attitude"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Holistic",
        "options": [
            "separate or disconnected",
            "characterized by the belief that parts must be seen as wholes",
            "a sudden and ignominious failure",
            "making a certain situation or outcome likely"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Biased",
        "options": [
            "unfairly prejudiced for or against someone",
            "fair and impartial",
            "a person who is responsible for a crime",
            "a thing with distinct and independent existence"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Adamant",
        "options": [
            "to publicly declare to be wrong or evil",
            "refusing to be persuaded or to change one's mind",
            "having or showing an ability to accurately assess situations",
            "a short amusing or interesting story"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Analogous",
        "options": [
            "to accept something reluctantly but without protest",
            "difficult to understand; obscure",
            "comparable in certain respects",
            "to lose strength or momentum"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Brevity",
        "options": [
            "feeling or showing misery or loneliness",
            "to free from legal, social, or political restrictions",
            "to cause or give rise to a feeling or situation",
            "concise and exact use of words; briefness"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Circumspect",
        "options": [
            "of the same kind; alike",
            "a feeling of intense excitement and happiness",
            "tending to avoid commitment or self-revelation",
            "wary and unwilling to take risks"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Entreat",
        "options": [
            "to ask someone earnestly or anxiously",
            "to pacify or placate someone by acceding to their demands",
            "covering a wide area in terms of space or scope",
            "to make a doubt, feeling, or belief disappear"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Desecrate",
        "options": [
            "careful and circumspect in one's speech or actions",
            "to do something that one considers beneath one's dignity",
            "to treat a sacred place with violent disrespect",
            "to struggle or stagger helplessly"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Avid",
        "options": [
            "having or showing a keen interest in or enthusiasm",
            "subject to chance; dependent on",
            "incapable of producing any useful result",
            "regularly found among particular people or in a certain area"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Cumulative",
        "options": [
            "unselfish concern for the welfare of others",
            "increasing by successive additions",
            "feelings of anxiety or dismay",
            "a thing that someone believes is real but exists only in imagination"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Culprit",
        "options": [
            "involving or requiring strenuous effort; difficult",
            "severe or strict in manner, attitude, or appearance",
            "a person who is responsible for a crime",
            "the use of many words where fewer would do"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Derivative",
        "options": [
            "serving as a desirable model; very good",
            "imitative of the work of another person",
            "a thing that provides resistance or obstruction",
            "to erase a mark from a surface"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Ephemeral",
        "options": [
            "to interpret a word or action in a particular way",
            "lasting for a very short time",
            "to leave property to a person by a will",
            "not influenced by strong emotion; rational"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Fluctuate",
        "options": [
            "to ask someone earnestly or anxiously",
            "a political leader who seeks support by appealing to prejudices",
            "to rise and fall irregularly in number or amount",
            "to begin to grow or increase rapidly"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Banal",
        "options": [
            "so lacking in originality as to be obvious and boring",
            "deceitfulness; double-dealing",
            "serving as a desirable model; very good",
            "irrelevant or unrelated to the subject"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Fidelity",
        "options": [
            "faithfulness to a person, cause, or belief",
            "conducive to success; favorable",
            "an action intended to secure an advantage",
            "to extract the essential meaning or most important aspects"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Furtive",
        "options": [
            "friendly and cheerful",
            "relevant to a subject under consideration",
            "attempting to avoid notice or attention; secretive",
            "the act of insulting or showing contempt for God"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Countenance",
        "options": [
            "familiar with and at ease in many countries",
            "having knowledge or being aware of",
            "difficult to find, catch, or achieve",
            "a person's face or facial expression"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Cogent",
        "options": [
            "clear, logical, and convincing",
            "gentle and kindly; not harmful",
            "written or spoken communication or debate",
            "easily persuaded to believe something"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Concord",
        "options": [
            "agreement or harmony between people or groups",
            "complete; including all elements",
            "uncalled for; lacking good reason",
            "clever or skillful in using hands or mind"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Didactic",
        "options": [
            "based on a mistaken belief",
            "intended to teach, particularly in moral instruction",
            "extremely delicate and light",
            "of the same kind; alike"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Despondent",
        "options": [
            "in low spirits from loss of hope",
            "to conceal one's true motives or feelings",
            "the process of releasing strong or repressed emotions",
            "very attentive to accuracy and detail"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Despicable",
        "options": [
            "having or displaying a friendly manner",
            "deserving hatred and contempt",
            "irritable and quarrelsome",
            "fast and energetic in a rather wild and uncontrolled way"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Disgruntled",
        "options": [
            "having or showing an ability to accurately assess situations",
            "to abandon or leave someone",
            "angry or dissatisfied",
            "a statement or proposition regarded as self-evidently true"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Eclectic",
        "options": [
            "an attack on the reputation or integrity of someone",
            "producing or capable of producing abundant growth",
            "deriving ideas from a broad range of sources",
            "to be of the same opinion; agree"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Frenetic",
        "options": [
            "open to more than one interpretation",
            "sharp and forthright in speech or manner",
            "fast and energetic in a rather wild and uncontrolled way",
            "to scold or criticize angrily"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Abstruse",
        "options": [
            "to attract or tempt by offering pleasure or advantage",
            "to make an action happen sooner or be accomplished quickly",
            "incapable of producing any useful result",
            "difficult to understand; obscure"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Disseminate",
        "options": [
            "in a state of disrepair or ruin",
            "serving as a desirable model; very good",
            "to lose strength or momentum",
            "to spread information widely"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Cryptic",
        "options": [
            "having a meaning that is mysterious or obscure",
            "to extract the essential meaning or most important aspects",
            "having or displaying a passionate intensity",
            "of doubtful authenticity, although widely circulated"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Foreshadow",
        "options": [
            "to be a warning or indication of a future event",
            "extreme greed for wealth or material gain",
            "a deep-seated feeling of dislike",
            "wary and unwilling to take risks"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Demolish",
        "options": [
            "to match or surpass, typically by imitation",
            "essentially different in kind; not comparable",
            "to pull or knock down a building",
            "to feel or express strong disapproval of"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Ennui",
        "options": [
            "to perceive or recognize something",
            "open and responsive to suggestion",
            "a feeling of listlessness and dissatisfaction",
            "the state of being actively opposed or hostile"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Falter",
        "options": [
            "thinking only of oneself",
            "preventing success or development; harmful",
            "to lose strength or momentum",
            "showing a high degree of skill and flair"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Expansive",
        "options": [
            "to evade or escape from, typically in a skillful way",
            "to raise doubts or objections",
            "moral corruption; wickedness",
            "covering a wide area in terms of space or scope"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Dormant",
        "options": [
            "of doubtful authenticity, although widely circulated",
            "temporarily inactive or inoperative",
            "extremely complex and difficult to follow",
            "difficult to find, catch, or achieve"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Discreet",
        "options": [
            "having or displaying a passionate intensity",
            "careful and circumspect in one's speech or actions",
            "evoking interest, attention, or admiration",
            "to display something ostentatiously"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Compliant",
        "options": [
            "inclined to agree with others or obey rules",
            "mental calmness and evenness of temper",
            "showing a willingness to take surprisingly bold risks",
            "to reduce in intensity or amount"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Disperse",
        "options": [
            "to distribute or spread over a wide area",
            "having a red or flushed complexion or excessively ornate",
            "feeling or expressing remorse",
            "to rebuke or reprimand severely"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Detached",
        "options": [
            "cheerful and full of energy",
            "soon passing out of sight or existence",
            "separate or disconnected",
            "arrogantly superior and disdainful"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Atrophy",
        "options": [
            "to gradually decline in effectiveness or vigor",
            "behaving in a way that suggests higher standards than actual behavior",
            "tending to be different or develop in different directions",
            "to make a doubt, feeling, or belief disappear"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Decorous",
        "options": [
            "in keeping with good taste and propriety",
            "to involve someone deeply in an argument or conflict",
            "friendly and cheerful",
            "to make unpleasant feelings less intense"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Dispassionate",
        "options": [
            "the state of being involved with others in illegal activity",
            "refusing to be persuaded or to change one's mind",
            "not influenced by strong emotion; rational",
            "a statement or proposition regarded as self-evidently true"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Decorum",
        "options": [
            "in a state of disrepair or ruin",
            "behavior in keeping with good taste",
            "tending to be different or develop in different directions",
            "a person's death"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Exemplary",
        "options": [
            "serving as a desirable model; very good",
            "to accept and allow behavior that is wrong",
            "a principle or standard by which something is judged",
            "to perplex someone greatly; bewilder"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Debunk",
        "options": [
            "to expose the falseness of an idea or belief",
            "an award or privilege granted as special honor",
            "to support or strengthen",
            "causing or affected by great anxiety or stress"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Deficient",
        "options": [
            "a thing that completes or brings to perfection",
            "deriving ideas from a broad range of sources",
            "entirely lacking or free from",
            "not having enough of a specified quality"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Adroit",
        "options": [
            "to display exaggerated flattery toward someone",
            "clever or skillful in using hands or mind",
            "to gradually decline in effectiveness or vigor",
            "a feeling of worry or unease"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Curtail",
        "options": [
            "to persuade someone not to take a course of action",
            "to publicly declare to be wrong or evil",
            "to encourage or promote the development of something",
            "to reduce in extent or quantity"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Exonerate",
        "options": [
            "to absolve someone from blame for a fault or wrongdoing",
            "to deny or contradict a fact or statement",
            "without the basic necessities of life",
            "conspicuously or obviously offensive"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Empathy",
        "options": [
            "disagreement between people",
            "the ability to understand and share the feelings of another",
            "to warn or reprimand someone firmly",
            "pompous or extravagant in language or style"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Formidable",
        "options": [
            "warm and friendly",
            "inspiring fear or respect through being large or powerful",
            "used in ordinary or familiar conversation",
            "belief in or acceptance of something as true"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Fervent",
        "options": [
            "to match or surpass, typically by imitation",
            "having or displaying a passionate intensity",
            "to describe or portray something precisely",
            "the making of false and defamatory statements"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Discern",
        "options": [
            "the use of many words where fewer would do",
            "to make something bad or unsatisfactory better",
            "to perceive or recognize something",
            "brave, heroic, or chivalrous"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Evince",
        "options": [
            "comparable in certain respects",
            "feeling or showing misery or loneliness",
            "a mistaken belief based on unsound argument",
            "to reveal the presence of a quality or feeling"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Admonish",
        "options": [
            "to warn or reprimand someone firmly",
            "extremely delicate and light",
            "to speak or write at length about a subject",
            "involving many carefully arranged parts"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Enormity",
        "options": [
            "the great or extreme scale, seriousness, or extent",
            "feeling or expressing great sorrow",
            "a harsh, discordant mixture of sounds",
            "anxious or fearful that something bad will happen"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Generic",
        "options": [
            "incapable of producing any useful result",
            "characteristic of or relating to a class or group",
            "lacking significance through having been overused",
            "a person's death"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Hackneyed",
        "options": [
            "the great or extreme scale, seriousness, or extent",
            "lacking significance through having been overused",
            "brisk and cheerful readiness",
            "to be a warning or indication of a future event"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Demagogue",
        "options": [
            "a political leader who seeks support by appealing to prejudices",
            "to be a typical example of",
            "to fail to give a true notion or impression of something",
            "a person or thing that announces or signals the approach"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Depravity",
        "options": [
            "having or showing care in one's work or duties",
            "easily persuaded to believe something",
            "moral corruption; wickedness",
            "to deny or contradict a fact or statement"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Chronicle",
        "options": [
            "a factual written account of important events",
            "not candid or sincere, typically pretending ignorance",
            "familiar with and at ease in many countries",
            "to remove matter thought to be objectionable"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Hardy",
        "options": [
            "a great difference",
            "to criticize unfairly; disparage",
            "to feel or express strong disapproval of",
            "robust; capable of enduring difficult conditions"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Ambivalent",
        "options": [
            "having or showing the ability to speak fluently",
            "having mixed feelings or contradictory ideas",
            "the art of investigating or discussing the truth",
            "the belief that all events are predetermined"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Flounder",
        "options": [
            "to obscure the light from or to another celestial body",
            "to struggle or stagger helplessly",
            "be filled with a feeling of love for",
            "to deprive someone of power, rights, or possessions"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Adverse",
        "options": [
            "preventing success or development; harmful",
            "impressive delicacy and skill",
            "disagreement between people",
            "having or showing the ability to speak fluently"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Facile",
        "options": [
            "corresponding in size or degree; proportionate",
            "lack of interest, enthusiasm, or concern",
            "appearing neat and comprehensive but lacking depth",
            "having or displaying a friendly manner"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Concoct",
        "options": [
            "to create or devise a story or plan",
            "to agree or give consent",
            "wishing to do what is right",
            "extremely or unusually small"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Disdain",
        "options": [
            "to destroy completely; put an end to",
            "the feeling that someone is unworthy of respect",
            "a person or thing that is a perfect example of a quality",
            "to instruct or benefit someone morally or intellectually"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Dilapidated",
        "options": [
            "to steal or misappropriate money placed in trust",
            "mercy; lenience",
            "to mention a number of things one by one",
            "in a state of disrepair or ruin"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Hermetic",
        "options": [
            "insulated or protected from outside influences",
            "warm and friendly",
            "to attract or tempt by offering pleasure or advantage",
            "to recognize a distinction; differentiate"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Deprecate",
        "options": [
            "to express disapproval of",
            "written or spoken communication or debate",
            "to show or declare that someone is not guilty",
            "possible to do easily or conveniently"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Articulate",
        "options": [
            "to strongly encourage or urge someone to do something",
            "having or showing the ability to speak fluently",
            "to admit that something is true after denying it",
            "the top or highest part of something"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Complicity",
        "options": [
            "lacking ease or grace; unsophisticated",
            "protection from arrest and extradition",
            "the state of being involved with others in illegal activity",
            "a lengthy and aggressive speech"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Enthrall",
        "options": [
            "to hold or express opinions that differ from official ones",
            "a scarcity or lack of something",
            "involving or requiring strenuous effort; difficult",
            "to capture the fascinated attention of"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Covert",
        "options": [
            "familiar with and at ease in many countries",
            "not influenced by personal involvement; impartial",
            "sly or cunning intelligence",
            "not openly acknowledged or displayed"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Diverse",
        "options": [
            "to extract the essential meaning or most important aspects",
            "showing a great deal of variety",
            "excessive pride or self-confidence",
            "a lengthy and aggressive speech"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Ameliorate",
        "options": [
            "to make something bad or unsatisfactory better",
            "a loud, unpleasant, and prolonged noise",
            "not having enough of a specified quality",
            "soon passing out of sight or existence"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Cajole",
        "options": [
            "to spread information widely",
            "to persuade someone to do something by flattery",
            "to evoke or draw out a response",
            "characterized by the belief that parts must be seen as wholes"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Dialectic",
        "options": [
            "the art of investigating or discussing the truth",
            "having or showing a keen interest in or enthusiasm",
            "to openly disregard a rule, law, or convention",
            "lacking any obvious principle of organization"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Forsake",
        "options": [
            "extremely stupid or foolish",
            "cheerful and full of energy",
            "to create or devise a story or plan",
            "to abandon or leave someone"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Hilarity",
        "options": [
            "a person or thing that announces or signals the approach",
            "a feeling that something bad will happen",
            "subject to chance; dependent on",
            "extreme amusement, especially when expressed by laughter"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Auspicious",
        "options": [
            "conducive to success; favorable",
            "courteous and gallant, especially toward women",
            "characterized by severe self-discipline and abstention",
            "a great difference"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Dilate",
        "options": [
            "to make or become wider, larger, or more open",
            "friendly, good-natured, or easy to talk to",
            "not influenced by strong emotion; rational",
            "to accept something reluctantly but without protest"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Enamored",
        "options": [
            "to conceal one's true motives or feelings",
            "be filled with a feeling of love for",
            "to happen or occur afterwards or as a result",
            "outward behavior or bearing"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Eminent",
        "options": [
            "extremely bad or unpleasant",
            "sparing or economical with regard to money or food",
            "modest or shy because of a lack of self-confidence",
            "famous and respected within a particular sphere"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Discriminate",
        "options": [
            "a person who organizes and operates a business",
            "naturally accompanying or associated",
            "to recognize a distinction; differentiate",
            "intended to teach, particularly in moral instruction"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Antagonize",
        "options": [
            "to cause someone to become hostile",
            "a person who takes particular pleasure in fine food",
            "a feeling of listlessness and dissatisfaction",
            "to reprimand severely"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Dissemble",
        "options": [
            "impressive or magnificent in appearance or style",
            "to conceal one's true motives or feelings",
            "lacking a plan, purpose, or enthusiasm",
            "to involve someone deeply in an argument or conflict"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Duress",
        "options": [
            "naturally accompanying or associated",
            "making a certain situation or outcome likely",
            "threats or coercion",
            "arrogantly superior and disdainful"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Foster",
        "options": [
            "the use of many words where fewer would do",
            "to encourage or promote the development of something",
            "lacking any obvious principle of organization",
            "a person's death"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Fledgling",
        "options": [
            "intensely enthusiastic or passionate",
            "to persuade someone not to take a course of action",
            "extremely complex and difficult to follow",
            "a person or organization that is immature or inexperienced"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Expedite",
        "options": [
            "very attentive to accuracy and detail",
            "to make an action happen sooner or be accomplished quickly",
            "to describe or portray something precisely",
            "threats or coercion"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Explicit",
        "options": [
            "hostile and aggressive",
            "lack of harmony among musical notes or opinions",
            "causing or likely to cause an argument",
            "stated clearly and in detail"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Debacle",
        "options": [
            "fair and impartial",
            "to perplex someone greatly; bewilder",
            "a sudden and ignominious failure",
            "given to sudden and unaccountable changes of mood"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Fraught",
        "options": [
            "utterly odious or wicked",
            "a thing that existed before or logically precedes another",
            "to praise enthusiastically",
            "causing or affected by great anxiety or stress"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Belie",
        "options": [
            "imitative of the work of another person",
            "mental calmness and evenness of temper",
            "to fail to give a true notion or impression of something",
            "to free from legal, social, or political restrictions"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Deter",
        "options": [
            "regularly found among particular people or in a certain area",
            "sharp and forthright in speech or manner",
            "to intrude on a person's territory or rights",
            "to discourage someone from doing something"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Eradicate",
        "options": [
            "hesitating or doubting",
            "moral corruption; wickedness",
            "to destroy completely; put an end to",
            "a feeling of worry or unease"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Futile",
        "options": [
            "incapable of producing any useful result",
            "to do something that one considers beneath one's dignity",
            "to feel or express strong disapproval of",
            "to provide support or strengthen"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Despot",
        "options": [
            "sparing or economical with regard to money or food",
            "to praise enthusiastically",
            "a ruler who holds absolute power",
            "to be a warning or indication of a future event"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Chivalrous",
        "options": [
            "to obscure the light from or to another celestial body",
            "courteous and gallant, especially toward women",
            "to invent or concoct something false",
            "to happen or occur afterwards or as a result"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Foreboding",
        "options": [
            "characterized by severe self-discipline and abstention",
            "a feeling that something bad will happen",
            "a thing with distinct and independent existence",
            "to fail to give a true notion or impression of something"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Fervid",
        "options": [
            "to remove matter thought to be objectionable",
            "belief or opinion contrary to orthodox religious doctrine",
            "inclined to lay down principles as incontrovertibly true",
            "intensely enthusiastic or passionate"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Flummox",
        "options": [
            "to perplex someone greatly; bewilder",
            "to struggle or stagger helplessly",
            "brisk and cheerful readiness",
            "incapable of producing any useful result"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Acerbic",
        "options": [
            "to publicly denounce",
            "to express contempt for; ridicule",
            "sharp and forthright in speech or manner",
            "to evoke or draw out a response"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Hapless",
        "options": [
            "to do something that one considers beneath one's dignity",
            "deriving ideas from a broad range of sources",
            "moral corruption; wickedness",
            "unfortunate"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Gratuitous",
        "options": [
            "a short amusing or interesting story",
            "to perceive or recognize something",
            "uncalled for; lacking good reason",
            "brave, heroic, or chivalrous"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Collusion",
        "options": [
            "protection from arrest and extradition",
            "secret or illegal cooperation or conspiracy",
            "to free from legal, social, or political restrictions",
            "to express severe disapproval of someone"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Facilitate",
        "options": [
            "vivacious and enthusiastic",
            "to make an action or process easy or easier",
            "to express disapproval of",
            "clear, logical, and convincing"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Divulge",
        "options": [
            "intense and passionate feeling",
            "to establish or settle someone in a comfortable position",
            "given to sudden and unaccountable changes of mood",
            "to make known private or sensitive information"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Cynical",
        "options": [
            "believing that people are motivated purely by self-interest",
            "thinking only of oneself",
            "to reduce in intensity or amount",
            "a harsh, discordant mixture of sounds"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Egocentric",
        "options": [
            "giving a lot of information clearly in few words",
            "showing or having skill in performing tasks",
            "thinking only of oneself",
            "forming a necessary base or core; of central importance"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Effusive",
        "options": [
            "a principle or standard by which something is judged",
            "to make something more attractive by adding details",
            "expressing feelings of gratitude or approval unrestrainedly",
            "having knowledge or being aware of"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Daunt",
        "options": [
            "showing smug or uncritical satisfaction",
            "to make someone feel intimidated or apprehensive",
            "a short amusing or interesting story",
            "the art of investigating or discussing the truth"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Excerpts",
        "options": [
            "based on observation or experience rather than theory",
            "a short extract from a text",
            "the top or highest part of something",
            "having or showing an ability to accurately assess situations"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Hypocritical",
        "options": [
            "a person or thing that is mysterious or difficult to understand",
            "leadership or dominance, especially of one state",
            "behaving in a way that suggests higher standards than actual behavior",
            "to begin to grow or increase rapidly"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Epic",
        "options": [
            "excessively talkative, especially on trivial matters",
            "to treat a sacred place with violent disrespect",
            "showing a high degree of skill and flair",
            "heroic or grand in scale or character"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Frugal",
        "options": [
            "sly or cunning intelligence",
            "untidy or disordered in appearance",
            "sparing or economical with regard to money or food",
            "to disappear or cause to disappear"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Bourgeois",
        "options": [
            "no longer existing or functioning",
            "very old or old-fashioned",
            "fond of company; sociable",
            "of or characteristic of the middle class"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Embroil",
        "options": [
            "to involve someone deeply in an argument or conflict",
            "a political leader who seeks support by appealing to prejudices",
            "to expose the falseness of an idea or belief",
            "based on what is generally done or believed"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Consternation",
        "options": [
            "showing a willingness to take surprisingly bold risks",
            "to obtain something by force or threats",
            "feelings of anxiety or dismay",
            "to leave property to a person by a will"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Belligerent",
        "options": [
            "active or occurring spasmodically or intermittently",
            "involving many carefully arranged parts",
            "corresponding in size or degree; proportionate",
            "hostile and aggressive"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Fatuous",
        "options": [
            "extremely bad or unpleasant",
            "silly and pointless",
            "incapable of producing any useful result",
            "a person or thing that announces or signals the approach"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Castigate",
        "options": [
            "easily broken or damaged",
            "expressing feelings of gratitude or approval unrestrainedly",
            "inclined to agree with others or obey rules",
            "to reprimand severely"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Convoluted",
        "options": [
            "to begin to grow or increase rapidly",
            "extremely complex and difficult to follow",
            "deviating from the normal or expected",
            "without the basic necessities of life"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Appease",
        "options": [
            "to pacify or placate someone by acceding to their demands",
            "robust; capable of enduring difficult conditions",
            "brave, heroic, or chivalrous",
            "a state of disorder due to absence of authority"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Circumvent",
        "options": [
            "making great demands on one's skill or attention",
            "incapable of producing any useful result",
            "to find a way around an obstacle",
            "a secret political clique or faction"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Clandestine",
        "options": [
            "a feeling of listlessness and dissatisfaction",
            "a small group of people with shared interests",
            "kept secret or done secretively",
            "mercy; lenience"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Foment",
        "options": [
            "very severe or serious",
            "a feeling of worry or unease",
            "to interpret a word or action in a particular way",
            "to instigate or stir up undesirable sentiment"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Entice",
        "options": [
            "expressing feelings of gratitude or approval unrestrainedly",
            "deviating from the normal or expected",
            "to attract or tempt by offering pleasure or advantage",
            "intended or likely to placate or pacify"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Bequeath",
        "options": [
            "to make or become wider, larger, or more open",
            "to leave property to a person by a will",
            "convenient and practical although possibly improper",
            "not influenced by strong emotion; rational"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Benevolent",
        "options": [
            "to criticize unfairly; disparage",
            "showing contempt; scornful",
            "to deprive someone of power, rights, or possessions",
            "well meaning and kindly"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Forestall",
        "options": [
            "to prevent or obstruct an anticipated event",
            "difficult to understand; obscure",
            "pompous or extravagant in language or style",
            "to perceive or recognize something"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Elaborate",
        "options": [
            "a secret political clique or faction",
            "irrelevant or unrelated to the subject",
            "irritable and quarrelsome",
            "involving many carefully arranged parts"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Blasphemy",
        "options": [
            "to be a warning or indication of a future event",
            "the act of insulting or showing contempt for God",
            "to rebuke or reprimand severely",
            "to create or bring about by deliberate effort"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Arduous",
        "options": [
            "involving or requiring strenuous effort; difficult",
            "the art of investigating or discussing the truth",
            "an action intended to secure an advantage",
            "neatly skillful and quick in one's movements"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Debase",
        "options": [
            "to destroy completely; put an end to",
            "to reduce in quality or value",
            "belief or opinion contrary to orthodox religious doctrine",
            "not having enough of a specified quality"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Exasperate",
        "options": [
            "to make something greater by adding to it",
            "to free someone from a difficult situation",
            "to be of the same opinion; agree",
            "to irritate intensely; infuriate"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Commensurate",
        "options": [
            "to cause someone to become hostile",
            "to instigate or stir up undesirable sentiment",
            "to warn or reprimand someone firmly",
            "corresponding in size or degree; proportionate"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Bane",
        "options": [
            "a cause of great distress or annoyance",
            "lasting for a very short time",
            "a small group of people with shared interests",
            "sharp and forthright in speech or manner"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Heterogeneous",
        "options": [
            "diverse in character or content",
            "in a state of disrepair or ruin",
            "an opinion or conclusion formed on incomplete information",
            "producing or capable of producing abundant growth"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Entrepreneur",
        "options": [
            "an extensive fire that destroys great areas",
            "a person who organizes and operates a business",
            "showing or having skill in performing tasks",
            "to come together from different directions"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Benefactor",
        "options": [
            "involving or requiring strenuous effort; difficult",
            "a person or thing that is the direct opposite",
            "general agreement",
            "a person who gives money or other help"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Cupidity",
        "options": [
            "vivacious and enthusiastic",
            "to cause or give rise to a feeling or situation",
            "to ask someone urgently and fervently",
            "greed for money or possessions"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Candor",
        "options": [
            "moderate in eating and drinking",
            "sarcastic in a scathing and bitter way",
            "the quality of being open and honest",
            "evoking interest, attention, or admiration"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Accolade",
        "options": [
            "an award or privilege granted as special honor",
            "to begin to grow or increase rapidly",
            "lax in morals; licentious",
            "a political leader who seeks support by appealing to prejudices"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Compromise",
        "options": [
            "an agreement made by mutual concession",
            "to destroy completely; put an end to",
            "excessive admiration or praise",
            "concerned with beauty or appreciation of beauty"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Circumlocution",
        "options": [
            "to make something greater by adding to it",
            "high-sounding but with little meaning",
            "extremely stupid or foolish",
            "the use of many words where fewer would do"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Emancipate",
        "options": [
            "successful in producing a desired result",
            "to free from legal, social, or political restrictions",
            "to ask someone earnestly or anxiously",
            "a thing that is helpful or beneficial"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Acrimony",
        "options": [
            "robust; capable of enduring difficult conditions",
            "bitterness or ill feeling",
            "to rebuke or reprimand severely",
            "general agreement"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Contiguous",
        "options": [
            "sharing a common border; touching",
            "an ugly, twisted expression on a person's face",
            "to produce and discharge something",
            "to make something more attractive by adding details"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Cantankerous",
        "options": [
            "a person who is responsible for a crime",
            "to make or become wider, larger, or more open",
            "bad-tempered, argumentative, and uncooperative",
            "to agree or give consent"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Apathy",
        "options": [
            "lack of interest, enthusiasm, or concern",
            "to produce and discharge something",
            "plowed and harrowed but left unsown",
            "careful and circumspect in one's speech or actions"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Equivocal",
        "options": [
            "gentle and kindly; not harmful",
            "open to more than one interpretation; ambiguous",
            "arrogantly superior and disdainful",
            "of the same kind; alike"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Abate",
        "options": [
            "to reduce in intensity or amount",
            "done openly and unashamedly",
            "an award or privilege granted as special honor",
            "well meaning and kindly"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Condone",
        "options": [
            "to accept and allow behavior that is wrong",
            "deserving blame",
            "ecstatically happy",
            "feelings of anxiety or dismay"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Ascetic",
        "options": [
            "utterly odious or wicked",
            "to reveal the presence of a quality or feeling",
            "open to more than one interpretation; ambiguous",
            "characterized by severe self-discipline and abstention"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Divergent",
        "options": [
            "modest or shy because of a lack of self-confidence",
            "logical and consistent",
            "deviating from the normal or expected",
            "tending to be different or develop in different directions"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Comprehensive",
        "options": [
            "intended to teach, particularly in moral instruction",
            "lack of interest, enthusiasm, or concern",
            "complete; including all elements",
            "diverse in character or content"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Embellish",
        "options": [
            "to make something more attractive by adding details",
            "filled with or characterized by lively energy",
            "to create or devise a story or plan",
            "feeling or expressing remorse"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Cursory",
        "options": [
            "having or showing care in one's work or duties",
            "hasty and therefore not thorough or detailed",
            "to support or strengthen",
            "an official ban on trade or commercial activity"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Consensus",
        "options": [
            "to recognize a distinction; differentiate",
            "general agreement",
            "to come together from different directions",
            "to deny or contradict a fact or statement"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Alacrity",
        "options": [
            "inspiring fear or respect through being large or powerful",
            "unconventional and slightly strange",
            "brisk and cheerful readiness",
            "to criticize unfairly; disparage"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Demeanor",
        "options": [
            "to extract the essential meaning or most important aspects",
            "to extract information from various sources",
            "to do something that one considers beneath one's dignity",
            "outward behavior or bearing"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Amiable",
        "options": [
            "extreme amusement, especially when expressed by laughter",
            "a system in which members are ranked according to status",
            "having or displaying a friendly manner",
            "fluent but insincere and shallow"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Deference",
        "options": [
            "humble submission and respect",
            "the state of being involved with others in illegal activity",
            "to attract or tempt by offering pleasure or advantage",
            "an agreement made by mutual concession"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Culpable",
        "options": [
            "deserving blame",
            "courteous and gallant, especially toward women",
            "filled with excessive enthusiasm or zeal",
            "to cause or give rise to a feeling or situation"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Exploit",
        "options": [
            "to make unpleasant feelings less intense",
            "ready to accept control or instruction; submissive",
            "to make full use of and derive benefit from a resource",
            "excessively talkative, especially on trivial matters"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Bureaucracy",
        "options": [
            "difficult to find, catch, or achieve",
            "the ability to make good judgments and quick decisions",
            "a system of government in which decisions are made by state officials",
            "originating in or characteristic of a distant foreign country"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Facetious",
        "options": [
            "a short amusing or interesting story",
            "treating serious issues with deliberately inappropriate humor",
            "showing or having an insensitive and cruel disregard",
            "extreme amusement, especially when expressed by laughter"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Fickle",
        "options": [
            "to capture the fascinated attention of",
            "difficult to find, catch, or achieve",
            "changing frequently, especially regarding loyalty",
            "conspicuously or obviously offensive"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Conscientious",
        "options": [
            "possible to do easily or conveniently",
            "wishing to do what is right",
            "to perceive or recognize something",
            "based on what is generally done or believed"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Distill",
        "options": [
            "a general law, rule, principle, or criterion",
            "to make an action or process easy or easier",
            "to extract the essential meaning or most important aspects",
            "to make an action happen sooner or be accomplished quickly"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Denigrate",
        "options": [
            "to show or declare that someone is not guilty",
            "to criticize unfairly; disparage",
            "making great demands on one's skill or attention",
            "a person or thing that is a perfect example of a quality"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Diffident",
        "options": [
            "modest or shy because of a lack of self-confidence",
            "showing a great deal of variety",
            "sparing or economical with regard to money or food",
            "to hold or express opinions that differ from official ones"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Assuage",
        "options": [
            "to cause someone to feel drained of energy",
            "the ability to speak or write a foreign language easily",
            "having knowledge or being aware of",
            "to make unpleasant feelings less intense"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Fetid",
        "options": [
            "smelling extremely unpleasant",
            "to speak or write at length about a subject",
            "to warn or reprimand someone firmly",
            "to show or represent by drawing or painting"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Acquiesce",
        "options": [
            "to come together to form one mass or whole",
            "to accept something reluctantly but without protest",
            "to perplex someone greatly; bewilder",
            "without a clearly defined shape or form"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Discourse",
        "options": [
            "to make someone weak and infirm",
            "general agreement",
            "written or spoken communication or debate",
            "kept secret or done secretively"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Effrontery",
        "options": [
            "insolent or impertinent behavior",
            "to ask someone earnestly or anxiously",
            "to obtain something by force or threats",
            "done openly and unashamedly"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Epicure",
        "options": [
            "used in ordinary or familiar conversation",
            "protection from arrest and extradition",
            "a person who takes particular pleasure in fine food",
            "a loud and confused noise"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Accede",
        "options": [
            "to persuade someone not to take a course of action",
            "to make something greater by adding to it",
            "to agree or give consent",
            "to reprimand severely"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Epigram",
        "options": [
            "a pithy saying or remark expressing an idea cleverly",
            "tending to cause harm",
            "deserving strong condemnation",
            "having a meaning that is mysterious or obscure"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Flamboyant",
        "options": [
            "tending to attract attention because of exuberance",
            "to prevent or obstruct an anticipated event",
            "lacking any obvious principle of organization",
            "individually separate and distinct"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Foible",
        "options": [
            "a belief or set of beliefs held by a group",
            "not candid or sincere, typically pretending ignorance",
            "to prevent a plan or action from progressing",
            "a minor weakness or eccentricity in someone's character"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Axiom",
        "options": [
            "a person who has escaped from captivity or is in hiding",
            "to absolve someone from blame for a fault or wrongdoing",
            "a system in which members are ranked according to status",
            "a statement or proposition regarded as self-evidently true"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Blatant",
        "options": [
            "done openly and unashamedly",
            "a system of government in which decisions are made by state officials",
            "lacking ease or grace; unsophisticated",
            "very attentive to accuracy and detail"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Chicanery",
        "options": [
            "to describe or portray something precisely",
            "the state of being actively opposed or hostile",
            "the ability to speak or write a foreign language easily",
            "the use of trickery to achieve a political or legal purpose"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Fortuitous",
        "options": [
            "happening by accident or chance rather than design",
            "to criticize someone severely",
            "the ability to speak or write a foreign language easily",
            "in keeping with good taste and propriety"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Fluency",
        "options": [
            "having or showing great knowledge or learning",
            "the ability to speak or write a foreign language easily",
            "corresponding in size or degree; proportionate",
            "having or displaying a friendly manner"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Grandiloquent",
        "options": [
            "based on what is generally done or believed",
            "to reprimand severely",
            "pompous or extravagant in language or style",
            "to ask someone urgently and fervently"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Disquiet",
        "options": [
            "a feeling of worry or unease",
            "a mild or indirect word substituted for one considered harsh",
            "to depart from an established course",
            "the ability to understand and share the feelings of another"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Grimace",
        "options": [
            "heroic or grand in scale or character",
            "to harm the good reputation of someone",
            "an ugly, twisted expression on a person's face",
            "showing a great deal of variety"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Guile",
        "options": [
            "mercy; lenience",
            "having or showing the ability to speak fluently",
            "sly or cunning intelligence",
            "causing or affected by great anxiety or stress"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Catharsis",
        "options": [
            "lack of harmony among musical notes or opinions",
            "the process of releasing strong or repressed emotions",
            "the use of trickery to achieve a political or legal purpose",
            "friendly and cheerful"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Amenable",
        "options": [
            "to display exaggerated flattery toward someone",
            "the act of insulting or showing contempt for God",
            "open and responsive to suggestion",
            "vivacious and enthusiastic"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Fatalism",
        "options": [
            "extremely complex and difficult to follow",
            "the belief that all events are predetermined",
            "filled with excessive enthusiasm or zeal",
            "to be a typical example of"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Expatiate",
        "options": [
            "to speak or write at length about a subject",
            "lacking a plan, purpose, or enthusiasm",
            "to feel or express strong disapproval of",
            "conspicuously or obviously offensive"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Avarice",
        "options": [
            "an action intended to secure an advantage",
            "neatly skillful and quick in one's movements",
            "extreme greed for wealth or material gain",
            "the use of many words where fewer would do"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Fecund",
        "options": [
            "producing or capable of producing abundant growth",
            "to interpret a word or action in a particular way",
            "impressive delicacy and skill",
            "a thing that existed before or logically precedes another"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Clairvoyant",
        "options": [
            "heroic or grand in scale or character",
            "utterly odious or wicked",
            "imitative of the work of another person",
            "a person who claims to have supernatural insight"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Enunciate",
        "options": [
            "brisk and cheerful readiness",
            "to say or pronounce clearly",
            "a pause or gap in a sequence or process",
            "complimentary or flattering to an excessive degree"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Discord",
        "options": [
            "filled with or characterized by lively energy",
            "strong hostility",
            "disagreement between people",
            "to raise doubts or objections"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Diligent",
        "options": [
            "imitative of the work of another person",
            "an action intended to secure an advantage",
            "having or showing care in one's work or duties",
            "uncalled for; lacking good reason"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Calumny",
        "options": [
            "the making of false and defamatory statements",
            "a ruler who holds absolute power",
            "a seemingly magical process of transformation",
            "to declare one's public approval or support of"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Emulate",
        "options": [
            "protection from arrest and extradition",
            "to leave property to a person by a will",
            "to match or surpass, typically by imitation",
            "moderate in eating and drinking"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Decadent",
        "options": [
            "relating to or resembling a farce; absurd",
            "comparable in certain respects",
            "changing frequently, especially regarding loyalty",
            "characterized by moral or cultural decline"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Conjecture",
        "options": [
            "an opinion or conclusion formed on incomplete information",
            "having or displaying a passionate intensity",
            "irrelevant or unrelated to the subject",
            "courteous and gallant, especially toward women"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Austere",
        "options": [
            "fond of having heated arguments",
            "hasty and therefore not thorough or detailed",
            "not influenced by personal involvement; impartial",
            "severe or strict in manner, attitude, or appearance"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Disconcert",
        "options": [
            "to do something that one considers beneath one's dignity",
            "lacking initiative or strength of character",
            "to expose the falseness of an idea or belief",
            "to disturb the composure of; unsettle"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Abstemious",
        "options": [
            "an official ban on trade or commercial activity",
            "intended to teach, particularly in moral instruction",
            "neatly skillful and quick in one's movements",
            "moderate in eating and drinking"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Aberrant",
        "options": [
            "a belief or set of beliefs held by a group",
            "clear, logical, and convincing",
            "deviating from the normal or expected",
            "a lengthy and aggressive speech"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Delineate",
        "options": [
            "imitative of the work of another person",
            "to cause or give rise to a feeling or situation",
            "a belief or set of beliefs held by a group",
            "to describe or portray something precisely"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Asinine",
        "options": [
            "extremely stupid or foolish",
            "to regard or represent as being of little worth",
            "having or showing care in one's work or duties",
            "famous and respected within a particular sphere"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Clemency",
        "options": [
            "anxious or fearful that something bad will happen",
            "a person's death",
            "mercy; lenience",
            "giving a lot of information clearly in few words"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Epitome",
        "options": [
            "to accept something reluctantly but without protest",
            "a person or thing that is a perfect example of a quality",
            "written or spoken communication or debate",
            "a person who takes particular pleasure in fine food"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Clich\u00e9",
        "options": [
            "greed for money or possessions",
            "intended for or understood by only a small group",
            "a phrase or opinion that is overused",
            "hesitating or doubting"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Efface",
        "options": [
            "to come together from different directions",
            "a person who has escaped from captivity or is in hiding",
            "to leave hurriedly and secretly",
            "to erase a mark from a surface"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Equanimity",
        "options": [
            "to leave property to a person by a will",
            "diverse in character or content",
            "mental calmness and evenness of temper",
            "to instigate or stir up undesirable sentiment"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Execrable",
        "options": [
            "to shock or excite someone into taking action",
            "extremely bad or unpleasant",
            "a thing that provides resistance or obstruction",
            "a cause of great distress or annoyance"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Deviate",
        "options": [
            "disagreement between people",
            "to depart from an established course",
            "to match or surpass, typically by imitation",
            "to regard or represent as being of little worth"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Evasive",
        "options": [
            "tending to avoid commitment or self-revelation",
            "to show feelings of superiority; be patronizing",
            "to warn or reprimand someone firmly",
            "a feeling of guilt or moral scruple"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Extenuate",
        "options": [
            "difficult to find, catch, or achieve",
            "deserving blame",
            "to provide support or strengthen",
            "to make a fault or offense seem less serious"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Conducive",
        "options": [
            "resulting from or showing sincere conviction",
            "to warn or reprimand someone firmly",
            "making a certain situation or outcome likely",
            "to raise doubts or objections"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Fallow",
        "options": [
            "plowed and harrowed but left unsown",
            "to pretend to be affected by a feeling or state",
            "a person or thing that is the direct opposite",
            "to make full use of and derive benefit from a resource"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Effervescent",
        "options": [
            "logical and consistent",
            "the feeling that someone is unworthy of respect",
            "vivacious and enthusiastic",
            "naturally accompanying or associated"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Flippant",
        "options": [
            "excessive admiration or praise",
            "heroic or grand in scale or character",
            "so lacking in originality as to be obvious and boring",
            "not showing proper seriousness or respect"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Detrimental",
        "options": [
            "tending to cause harm",
            "showing a willingness to take surprisingly bold risks",
            "to destroy completely; put an end to",
            "done openly and unashamedly"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Astute",
        "options": [
            "to reduce in quality or value",
            "not influenced by personal involvement; impartial",
            "having or showing an ability to accurately assess situations",
            "covering a wide area in terms of space or scope"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Discrete",
        "options": [
            "clever or skillful in using hands or mind",
            "to obscure the light from or to another celestial body",
            "to strongly encourage or urge someone to do something",
            "individually separate and distinct"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Elicit",
        "options": [
            "showing a great deal of variety",
            "having or showing an ability to accurately assess situations",
            "to come together from different directions",
            "to evoke or draw out a response"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Gregarious",
        "options": [
            "outstandingly bad; shocking",
            "to mention a number of things one by one",
            "fond of company; sociable",
            "covering a wide area in terms of space or scope"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Converge",
        "options": [
            "agreement or harmony between people or groups",
            "to come together from different directions",
            "corresponding in size or degree; proportionate",
            "lack of interest, enthusiasm, or concern"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Anomaly",
        "options": [
            "something that deviates from what is standard",
            "to make someone feel intimidated or apprehensive",
            "without a clearly defined shape or form",
            "to deny or contradict a fact or statement"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Credence",
        "options": [
            "deviating from the normal or expected",
            "robust; capable of enduring difficult conditions",
            "belief in or acceptance of something as true",
            "neatly skillful and quick in one's movements"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Apprehensive",
        "options": [
            "to publicly declare to be wrong or evil",
            "anxious or fearful that something bad will happen",
            "very old or old-fashioned",
            "a ruler who holds absolute power"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Elude",
        "options": [
            "agreement or harmony between people or groups",
            "very severe or serious",
            "secret or illegal cooperation or conspiracy",
            "to evade or escape from, typically in a skillful way"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Bombastic",
        "options": [
            "to make a problem or bad situation worse",
            "a deep-seated feeling of dislike",
            "deviating from the normal or expected",
            "high-sounding but with little meaning"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Cognizant",
        "options": [
            "having knowledge or being aware of",
            "relating to or resembling a farce; absurd",
            "thinking only of oneself",
            "wary and unwilling to take risks"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Ensue",
        "options": [
            "concerned with beauty or appreciation of beauty",
            "temporarily inactive or inoperative",
            "to restrict something within limits",
            "to happen or occur afterwards or as a result"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Galvanize",
        "options": [
            "to invent or concoct something false",
            "easily broken or damaged",
            "to shock or excite someone into taking action",
            "separate or disconnected"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Exhort",
        "options": [
            "to strongly encourage or urge someone to do something",
            "leadership or dominance, especially of one state",
            "to erase or remove completely",
            "to steal or misappropriate money placed in trust"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Exacting",
        "options": [
            "evoking interest, attention, or admiration",
            "an ugly, twisted expression on a person's face",
            "making great demands on one's skill or attention",
            "appearing neat and comprehensive but lacking depth"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Chastise",
        "options": [
            "to yearn to possess something belonging to another",
            "to support or strengthen",
            "a person or thing that is mysterious or difficult to understand",
            "to rebuke or reprimand severely"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Docile",
        "options": [
            "temporarily inactive or inoperative",
            "deriving ideas from a broad range of sources",
            "to raise doubts or objections",
            "ready to accept control or instruction; submissive"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Harbinger",
        "options": [
            "a person or thing that announces or signals the approach",
            "conducive to success; favorable",
            "secret or illegal cooperation or conspiracy",
            "to leave the main subject temporarily in speech"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Discretion",
        "options": [
            "the quality of behaving to avoid causing offense",
            "the use of trickery to achieve a political or legal purpose",
            "a belief or set of beliefs held by a group",
            "forming a necessary base or core; of central importance"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Egalitarian",
        "options": [
            "believing in the principle of equality for all",
            "to evade or escape from, typically in a skillful way",
            "to intrude on a person's territory or rights",
            "severe or strict in manner, attitude, or appearance"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Assiduous",
        "options": [
            "to make or become wider, larger, or more open",
            "having or showing a keen interest in or enthusiasm",
            "a short extract from a text",
            "showing great care and perseverance"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Coalesce",
        "options": [
            "to cause someone to feel drained of energy",
            "to pacify or placate someone by acceding to their demands",
            "clever or skillful in using hands or mind",
            "to come together to form one mass or whole"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Hegemony",
        "options": [
            "leadership or dominance, especially of one state",
            "of or characteristic of the middle class",
            "to strongly encourage or urge someone to do something",
            "originating in or characteristic of a distant foreign country"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Equitable",
        "options": [
            "imitative of the work of another person",
            "fair and impartial",
            "to declare one's public approval or support of",
            "extreme greed for wealth or material gain"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Dogmatic",
        "options": [
            "possible to do easily or conveniently",
            "lack of harmony among musical notes or opinions",
            "inclined to lay down principles as incontrovertibly true",
            "sparing or economical with regard to money or food"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Apex",
        "options": [
            "to intrude on a person's territory or rights",
            "a person or thing that is a perfect example of a quality",
            "the quality of someone's character or ability",
            "the top or highest part of something"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Elated",
        "options": [
            "extreme greed for wealth or material gain",
            "ecstatically happy",
            "to encourage or promote the development of something",
            "showing contempt; scornful"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Denounce",
        "options": [
            "to interpret a word or action in a particular way",
            "to depart from an established course",
            "to publicly declare to be wrong or evil",
            "evoking interest, attention, or admiration"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Grievous",
        "options": [
            "entirely lacking or free from",
            "to leave hurriedly and secretly",
            "convenient and practical although possibly improper",
            "very severe or serious"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Abhor",
        "options": [
            "to be a typical example of",
            "a belief or set of beliefs held by a group",
            "to regard with disgust and hatred",
            "having or showing the ability to speak fluently"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Divest",
        "options": [
            "having knowledge or being aware of",
            "a person falsely claiming to have special knowledge",
            "to deprive someone of power, rights, or possessions",
            "to praise enthusiastically"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Fabricate",
        "options": [
            "a person who is responsible for a crime",
            "to invent or concoct something false",
            "hasty and therefore not thorough or detailed",
            "anxious or fearful that something bad will happen"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Affable",
        "options": [
            "outward behavior or bearing",
            "causing or affected by great anxiety or stress",
            "convenient and practical although possibly improper",
            "friendly, good-natured, or easy to talk to"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Decry",
        "options": [
            "to publicly denounce",
            "lacking any obvious principle of organization",
            "sarcastic in a scathing and bitter way",
            "outstandingly bad; shocking"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Demise",
        "options": [
            "a person's death",
            "obtained, done by, or involving deception",
            "to make a doubt, feeling, or belief disappear",
            "familiar with and at ease in many countries"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Exacerbate",
        "options": [
            "a person's face or facial expression",
            "to make a problem or bad situation worse",
            "having or showing too great a readiness to believe",
            "the ability to understand and share the feelings of another"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Hiatus",
        "options": [
            "impressive delicacy and skill",
            "a pause or gap in a sequence or process",
            "to erase a mark from a surface",
            "showing contempt; scornful"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Criterion",
        "options": [
            "a principle or standard by which something is judged",
            "to issue or spread out from a source",
            "impressive or magnificent in appearance or style",
            "a thing with distinct and independent existence"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Disparity",
        "options": [
            "to shock or excite someone into taking action",
            "having mixed feelings or contradictory ideas",
            "happening by accident or chance rather than design",
            "a great difference"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Ambiguous",
        "options": [
            "open to more than one interpretation",
            "to spread information widely",
            "making a certain situation or outcome likely",
            "to harm the good reputation of someone"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Enigma",
        "options": [
            "complete; including all elements",
            "without the basic necessities of life",
            "in low spirits from loss of hope",
            "a person or thing that is mysterious or difficult to understand"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Aversion",
        "options": [
            "to reduce the force, effect, or value of",
            "pompous or extravagant in language or style",
            "brisk and cheerful readiness",
            "a strong dislike or disinclination"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Dexterous",
        "options": [
            "to erase a mark from a surface",
            "showing or having skill in performing tasks",
            "a thing that completes or brings to perfection",
            "ecstatically happy"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Complement",
        "options": [
            "to make someone feel uneasy or embarrassed",
            "to come together to form one mass or whole",
            "a thing that completes or brings to perfection",
            "believing in the principle of equality for all"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Contingent",
        "options": [
            "to intrude on a person's territory or rights",
            "to strongly encourage or urge someone to do something",
            "subject to chance; dependent on",
            "a lengthy and aggressive speech"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Circumscribe",
        "options": [
            "to restrict something within limits",
            "to accept something reluctantly but without protest",
            "a minor weakness or eccentricity in someone's character",
            "secret or illegal cooperation or conspiracy"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Caustic",
        "options": [
            "having or showing the ability to speak fluently",
            "lacking a plan, purpose, or enthusiasm",
            "be filled with a feeling of love for",
            "sarcastic in a scathing and bitter way"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Catalyst",
        "options": [
            "obtained, done by, or involving deception",
            "a factual written account of important events",
            "to steal or misappropriate money placed in trust",
            "a person or thing that precipitates an event"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Eclipse",
        "options": [
            "a person falsely claiming to have special knowledge",
            "to use ambiguous language to conceal the truth",
            "the quality of being open and honest",
            "to obscure the light from or to another celestial body"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Choleric",
        "options": [
            "lasting for a very short time",
            "forming a necessary base or core; of central importance",
            "bad-tempered or irritable",
            "a thing that completes or brings to perfection"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Emit",
        "options": [
            "a confusing and difficult problem",
            "to produce and discharge something",
            "the quality of someone's character or ability",
            "to strongly encourage or urge someone to do something"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Contrive",
        "options": [
            "to shock or excite someone into taking action",
            "to create or bring about by deliberate effort",
            "thinking only of oneself",
            "unreasonably high in price"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Encumber",
        "options": [
            "having or displaying a friendly manner",
            "serving as a desirable model; very good",
            "causing or affected by great anxiety or stress",
            "to restrict or burden someone in a way that prevents action"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Charlatan",
        "options": [
            "to prevent or obstruct an anticipated event",
            "hesitating or doubting",
            "friendly, lively, and enjoyable",
            "a person falsely claiming to have special knowledge"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Homogeneous",
        "options": [
            "having a red or flushed complexion or excessively ornate",
            "an attack on the reputation or integrity of someone",
            "written or spoken communication or debate",
            "of the same kind; alike"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Bemoan",
        "options": [
            "utterly odious or wicked",
            "a state of disorder due to absence of authority",
            "to express discontent or sorrow over something",
            "to ask someone urgently and fervently"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Attenuate",
        "options": [
            "a strong dislike or disinclination",
            "based on observation or experience rather than theory",
            "a loud and confused noise",
            "to reduce the force, effect, or value of"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Exuberant",
        "options": [
            "to establish or settle someone in a comfortable position",
            "preventing success or development; harmful",
            "sharing a common border; touching",
            "filled with or characterized by lively energy"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Coherent",
        "options": [
            "to pretend to be affected by a feeling or state",
            "hasty and therefore not thorough or detailed",
            "to display exaggerated flattery toward someone",
            "logical and consistent"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Glib",
        "options": [
            "having or displaying a passionate intensity",
            "preventing success or development; harmful",
            "to adopt or support a cause, belief, or way of life",
            "fluent but insincere and shallow"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Cordial",
        "options": [
            "warm and friendly",
            "a system in which members are ranked according to status",
            "characteristic of or relating to a class or group",
            "to make someone weak and infirm"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Garner",
        "options": [
            "serving as a desirable model; very good",
            "to make someone feel intimidated or apprehensive",
            "to extract information from various sources",
            "to gather or collect something"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Flagrant",
        "options": [
            "conspicuously or obviously offensive",
            "inclined to lay down principles as incontrovertibly true",
            "a pause or gap in a sequence or process",
            "characterized by moral or cultural decline"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Coerce",
        "options": [
            "to persuade someone forcefully to do something",
            "showing or having an insensitive and cruel disregard",
            "very attentive to accuracy and detail",
            "not even or regular in pattern or movement"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Fundamental",
        "options": [
            "sarcastic in a scathing and bitter way",
            "corresponding in size or degree; proportionate",
            "forming a necessary base or core; of central importance",
            "brisk and cheerful readiness"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Defamation",
        "options": [
            "a person or thing that announces or signals the approach",
            "the action of damaging someone's reputation",
            "difficult to understand; obscure",
            "a sudden and ignominious failure"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Extant",
        "options": [
            "easily broken or damaged",
            "still in existence; surviving",
            "expressing feelings of gratitude or approval unrestrainedly",
            "to make an action happen sooner or be accomplished quickly"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Euphoria",
        "options": [
            "to restrict or burden someone in a way that prevents action",
            "excessively talkative, especially on trivial matters",
            "a feeling of intense excitement and happiness",
            "an expert judge in matters of taste"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Conflagration",
        "options": [
            "an extensive fire that destroys great areas",
            "a feeling that something bad will happen",
            "to make full use of and derive benefit from a resource",
            "famous and respected within a particular sphere"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Exemplify",
        "options": [
            "to disappear or cause to disappear",
            "to instruct or benefit someone morally or intellectually",
            "to be a typical example of",
            "mercy; lenience"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Gambit",
        "options": [
            "an action intended to secure an advantage",
            "a great difference",
            "an official ban on trade or commercial activity",
            "behaving in a way that suggests higher standards than actual behavior"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Deleterious",
        "options": [
            "causing harm or damage",
            "having a red or flushed complexion or excessively ornate",
            "the belief that all events are predetermined",
            "open and responsive to suggestion"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Anecdote",
        "options": [
            "easily broken or damaged",
            "a short amusing or interesting story",
            "a person's face or facial expression",
            "very severe or serious"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Exculpate",
        "options": [
            "a loud, unpleasant, and prolonged noise",
            "to show or declare that someone is not guilty",
            "ecstatically happy",
            "to adopt or support a cause, belief, or way of life"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Facade",
        "options": [
            "bad-tempered or irritable",
            "secret or illegal cooperation or conspiracy",
            "brisk and cheerful readiness",
            "the face of a building or an outward appearance"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Grandiose",
        "options": [
            "entirely lacking or free from",
            "fluent but insincere and shallow",
            "plowed and harrowed but left unsown",
            "impressive or magnificent in appearance or style"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Demur",
        "options": [
            "well chosen or suited to the circumstances",
            "a deep-seated feeling of dislike",
            "to regard or represent as being of little worth",
            "to raise doubts or objections"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Covet",
        "options": [
            "to yearn to possess something belonging to another",
            "to lose strength or momentum",
            "to make something greater by adding to it",
            "to extract the essential meaning or most important aspects"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Callous",
        "options": [
            "a speech or piece of writing in praise of someone",
            "not having enough of a specified quality",
            "a person who is responsible for a crime",
            "showing or having an insensitive and cruel disregard"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Dissonance",
        "options": [
            "lack of harmony among musical notes or opinions",
            "a seemingly magical process of transformation",
            "the art of investigating or discussing the truth",
            "obtained, done by, or involving deception"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Eccentric",
        "options": [
            "unconventional and slightly strange",
            "ready to accept control or instruction; submissive",
            "outstandingly bad; shocking",
            "a person or organization that is immature or inexperienced"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Deride",
        "options": [
            "extremely bad or unpleasant",
            "attempting to avoid notice or attention; secretive",
            "to express contempt for; ridicule",
            "to produce and discharge something"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Florid",
        "options": [
            "to establish or settle someone in a comfortable position",
            "having a red or flushed complexion or excessively ornate",
            "a person or thing that announces or signals the approach",
            "hesitating or doubting"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Disjointed",
        "options": [
            "a thing that existed before or logically precedes another",
            "lacking a coherent sequence or connection",
            "to recognize a distinction; differentiate",
            "to extend the application of a method or conclusion"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Ensconce",
        "options": [
            "feeling or expressing great sorrow",
            "to establish or settle someone in a comfortable position",
            "showing contempt; scornful",
            "extremely or unusually small"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Evoke",
        "options": [
            "to bring or recall a feeling or memory to the mind",
            "in a state of disrepair or ruin",
            "to display exaggerated flattery toward someone",
            "to absolve someone from blame for a fault or wrongdoing"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Fugitive",
        "options": [
            "friendly and cheerful",
            "to accept and allow behavior that is wrong",
            "a person who has escaped from captivity or is in hiding",
            "to express discontent or sorrow over something"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Acumen",
        "options": [
            "to raise doubts or objections",
            "the ability to make good judgments and quick decisions",
            "to shock or excite someone into taking action",
            "preventing success or development; harmful"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Enervate",
        "options": [
            "to display something ostentatiously",
            "ready to accept control or instruction; submissive",
            "to cause someone to feel drained of energy",
            "careful and circumspect in one's speech or actions"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Disparage",
        "options": [
            "the act of insulting or showing contempt for God",
            "convenient and practical although possibly improper",
            "to regard or represent as being of little worth",
            "to publicly declare to be wrong or evil"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Empirical",
        "options": [
            "to spread information widely",
            "a mistaken belief based on unsound argument",
            "to reprimand severely",
            "based on observation or experience rather than theory"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Dearth",
        "options": [
            "a scarcity or lack of something",
            "to match or surpass, typically by imitation",
            "relating to or resembling a farce; absurd",
            "friendly, lively, and enjoyable"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Disinterested",
        "options": [
            "causing or affected by great anxiety or stress",
            "friendly, good-natured, or easy to talk to",
            "open to more than one interpretation",
            "not influenced by personal involvement; impartial"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Encomium",
        "options": [
            "a person who has escaped from captivity or is in hiding",
            "to involve someone deeply in an argument or conflict",
            "a speech or piece of writing in praise of someone",
            "to make an action happen sooner or be accomplished quickly"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Exalt",
        "options": [
            "to hold someone in very high regard",
            "sparing or economical with regard to money or food",
            "showing a skillful use of underhanded tactics",
            "clear, logical, and convincing"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Desultory",
        "options": [
            "lacking a plan, purpose, or enthusiasm",
            "soon passing out of sight or existence",
            "a speech or piece of writing in praise of someone",
            "denoting a period of time in the past that was peaceful"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Dispel",
        "options": [
            "to shock or excite someone into taking action",
            "to make a doubt, feeling, or belief disappear",
            "having a meaning that is mysterious or obscure",
            "to pull or knock down a building"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Contemptuous",
        "options": [
            "concerned with beauty or appreciation of beauty",
            "showing contempt; scornful",
            "a person or thing that precipitates an event",
            "deriving ideas from a broad range of sources"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Emanate",
        "options": [
            "to issue or spread out from a source",
            "agreement or harmony between people or groups",
            "to gather or collect something",
            "a belief or set of beliefs held by a group"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Fitful",
        "options": [
            "active or occurring spasmodically or intermittently",
            "showing or having an insensitive and cruel disregard",
            "exaggerated statements not meant to be taken literally",
            "fond of company; sociable"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Concise",
        "options": [
            "filled with or characterized by lively energy",
            "giving a lot of information clearly in few words",
            "clear, logical, and convincing",
            "of the same kind; alike"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Cosmopolitan",
        "options": [
            "to obscure the light from or to another celestial body",
            "to free someone from a difficult situation",
            "familiar with and at ease in many countries",
            "deriving ideas from a broad range of sources"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Dissuade",
        "options": [
            "to persuade someone not to take a course of action",
            "insulated or protected from outside influences",
            "no longer existing or functioning",
            "well meaning and kindly"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Gauche",
        "options": [
            "entirely lacking or free from",
            "excessively talkative, especially on trivial matters",
            "fond of having heated arguments",
            "lacking ease or grace; unsophisticated"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Connoisseur",
        "options": [
            "warm and friendly",
            "to leave hurriedly and secretly",
            "an expert judge in matters of taste",
            "a person or thing that announces or signals the approach"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Ethereal",
        "options": [
            "extremely delicate and light",
            "a deep-seated feeling of dislike",
            "neatly skillful and quick in one's movements",
            "lax in morals; licentious"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Anarchy",
        "options": [
            "a cause of great distress or annoyance",
            "neatly skillful and quick in one's movements",
            "a state of disorder due to absence of authority",
            "warm and friendly"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Embargo",
        "options": [
            "an official ban on trade or commercial activity",
            "showing a great deal of variety",
            "to make something bad or unsatisfactory better",
            "exaggerated statements not meant to be taken literally"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Exigent",
        "options": [
            "pressing; demanding",
            "easily persuaded to believe something",
            "unreasonably high in price",
            "easily broken or damaged"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Hedonism",
        "options": [
            "humble submission and respect",
            "the pursuit of pleasure; sensual self-indulgence",
            "sharp and forthright in speech or manner",
            "refusing to be persuaded or to change one's mind"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Concur",
        "options": [
            "an extensive fire that destroys great areas",
            "to be of the same opinion; agree",
            "warm and friendly",
            "having knowledge or being aware of"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Debilitate",
        "options": [
            "a person's death",
            "a thing that is helpful or beneficial",
            "to make someone weak and infirm",
            "to prevent or obstruct an anticipated event"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Fallacious",
        "options": [
            "to strongly encourage or urge someone to do something",
            "based on a mistaken belief",
            "an extensive fire that destroys great areas",
            "to intensify, increase, or further improve the quality"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Distend",
        "options": [
            "spread out over a large area; not concentrated",
            "to swell or cause to swell from internal pressure",
            "to happen or occur afterwards or as a result",
            "to show feelings of superiority; be patronizing"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Figment",
        "options": [
            "well chosen or suited to the circumstances",
            "sly or cunning intelligence",
            "complimentary or flattering to an excessive degree",
            "a thing that someone believes is real but exists only in imagination"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Clamor",
        "options": [
            "to deprive someone of power, rights, or possessions",
            "a loud and confused noise",
            "lacking a plan, purpose, or enthusiasm",
            "to bring or recall a feeling or memory to the mind"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Augment",
        "options": [
            "lacking initiative or strength of character",
            "to make something greater by adding to it",
            "a small group of people with shared interests",
            "sharp and forthright in speech or manner"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Caliber",
        "options": [
            "the action of damaging someone's reputation",
            "having or showing too great a readiness to believe",
            "to free someone from a difficult situation",
            "the quality of someone's character or ability"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Conundrum",
        "options": [
            "essentially different in kind; not comparable",
            "a confusing and difficult problem",
            "feeling or expressing great sorrow",
            "temporarily inactive or inoperative"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Conventional",
        "options": [
            "characterized by the belief that parts must be seen as wholes",
            "something belonging to a period other than that being portrayed",
            "belief in or acceptance of something as true",
            "based on what is generally done or believed"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Duplicity",
        "options": [
            "wishing to do what is right",
            "to increase the power, status, or wealth",
            "deceitfulness; double-dealing",
            "a loud and confused noise"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Archaic",
        "options": [
            "to irritate intensely; infuriate",
            "very old or old-fashioned",
            "to lose strength or momentum",
            "to cause someone to feel drained of energy"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Exorbitant",
        "options": [
            "not showing proper seriousness or respect",
            "unreasonably high in price",
            "to free from legal, social, or political restrictions",
            "sarcastic in a scathing and bitter way"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Finesse",
        "options": [
            "exaggerated statements not meant to be taken literally",
            "the ability to make good judgments and quick decisions",
            "impressive delicacy and skill",
            "to adopt or support a cause, belief, or way of life"
        ],
        "correct": 2,
        "category": "General"
    },
    {
        "word": "Arbitrary",
        "options": [
            "lack of interest, enthusiasm, or concern",
            "threats or coercion",
            "a person or thing that is the direct opposite",
            "based on random choice or personal whim"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "Censure",
        "options": [
            "to express severe disapproval of someone",
            "relevant to a subject under consideration",
            "the state of being involved with others in illegal activity",
            "a phrase or opinion that is overused"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Edify",
        "options": [
            "to fail to give a true notion or impression of something",
            "a pithy saying or remark expressing an idea cleverly",
            "to make an action or process easy or easier",
            "to instruct or benefit someone morally or intellectually"
        ],
        "correct": 3,
        "category": "General"
    },
    {
        "word": "466.genial",
        "options": [
            "friendly and cheerful",
            "based on observation or experience rather than theory",
            "to criticize someone severely",
            "unfortunate"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Dissolute",
        "options": [
            "a person who organizes and operates a business",
            "lax in morals; licentious",
            "complete; including all elements",
            "wishing to do what is right"
        ],
        "correct": 1,
        "category": "General"
    },
    {
        "word": "Extrapolate",
        "options": [
            "to extend the application of a method or conclusion",
            "difficult to understand; obscure",
            "so lacking in originality as to be obvious and boring",
            "a feeling of listlessness and dissatisfaction"
        ],
        "correct": 0,
        "category": "General"
    },
    {
        "word": "Audacious",
        "options": [
            "concerned with beauty or appreciation of beauty",
            "to pacify or placate someone by acceding to their demands",
            "showing a willingness to take surprisingly bold risks",
            "to make unpleasant feelings less intense"
        ],
        "correct": 2,
        "category": "General"
    }

    // TODO: Add more batches to reach 1800+ questions
];

// Import existing vocab questions from vocab_quiz.js
// For now, we'll define a subset here and expand later
// Generate unique questions for each set (NO REPEATS)
function generateSetQuestions(month, setNumber) {
    // Calculate global set index across all months
    const monthIndex = MONTH_NAMES.indexOf(month);
    let totalSetsBefore = 0;
    for (let i = 0; i < monthIndex; i++) {
        totalSetsBefore += MONTHS_CONFIG[MONTH_NAMES[i]];
    }
    const globalSetIndex = totalSetsBefore + (setNumber - 1);

    // Calculate question indices for this set (5 questions per set)
    const startQuestionIndex = globalSetIndex * 5;
    const endQuestionIndex = startQuestionIndex + 5;

    // Check if we have enough questions
    if (startQuestionIndex >= vocabQuestionsPool.length) {
        return null; // Not enough questions - will show "Coming Soon"
    }

    // Get 5 unique questions for this set
    const setQuestions = [];
    for (let i = startQuestionIndex; i < endQuestionIndex && i < vocabQuestionsPool.length; i++) {
        // Use modulo when we run out to recycle, but still maintain uniqueness within set
        setQuestions.push({ ...vocabQuestionsPool[i % vocabQuestionsPool.length] });
    }

    // If less than 5 questions available, return null (Coming Soon)
    if (setQuestions.length < 5) {
        return null;
    }

    return setQuestions;
}

// Month configuration (days per month for 2026)
const MONTHS_CONFIG = {
    'January': 31,
    'February': 28, // 2026 is not a leap year
    'March': 31,
    'April': 30,
    'May': 31,
    'June': 30,
    'July': 31,
    'August': 31,
    'September': 30,
    'October': 31,
    'November': 30,
    'December': 31
};

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Current state
let currentMonthVocab = 'January';
let currentSetNumberVocab = null;
let currentSetQuestionsVocab = [];
let currentQuestionVocab = 0;
let setScoreVocab = 0;
let currentAttemptsVocab = []; // NEW: Track full attempt details

// Global progress data structure - ENHANCED
let vocabSetsProgress = {
    // Structure: { 
    //   'January': { 
    //     'set_1': {
    //       completed: true, 
    //       score: 4,
    //       timestamp: '2026-02-15T09:30:00',
    //       attempts: [
    //         { question: {...}, userAnswer: 2, isCorrect: true },
    //         ...
    //       ],
    //       userSentence: 'My example sentence here'
    //     }, 
    //     ... 
    //   }, 
    //   ... 
    // }
};

// ==========================================
// INITIALIZATION & LOADING
// ==========================================

async function initVocabSets() {
    // TODO: Populate vocabQuestionsPool with 1800+ questions
    // For now, will be done in phases

    try {
        await loadVocabSetsProgress();
        renderMonthSelection();
    } catch (e) {
        console.error("Error in initVocabSets:", e);
    }
}

async function loadVocabSetsProgress() {
    // Load from localStorage first
    const localData = localStorage.getItem('vocab_sets_progress');
    if (localData) {
        try {
            vocabSetsProgress = JSON.parse(localData);
        } catch (e) {
            console.error('Error parsing local vocab sets progress:', e);
            vocabSetsProgress = {};
        }
    }

    // Sync with cloud
    try {
        const response = await fetch('/load_vocab_sets_progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: window.StorageManager ? window.StorageManager.getUser() : 'default_user' })
        });
        const data = await response.json();

        if (data.progress) {
            vocabSetsProgress = data.progress;
            // Save to localStorage
            localStorage.setItem('vocab_sets_progress', JSON.stringify(vocabSetsProgress));
        }
    } catch (e) {
        console.error('Failed to load vocab sets progress from cloud:', e);
    }
}

async function saveVocabSetsProgress() {
    // Save to localStorage immediately
    localStorage.setItem('vocab_sets_progress', JSON.stringify(vocabSetsProgress));

    // Save to cloud
    try {
        await fetch('/save_vocab_sets_progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: window.StorageManager ? window.StorageManager.getUser() : 'default_user',
                progress: vocabSetsProgress
            })
        });
    } catch (e) {
        console.error('Failed to save vocab sets progress to cloud:', e);
    }
}

// ==========================================
// RENDERING FUNCTIONS
// ==========================================

function renderMonthSelection() {
    const container = document.getElementById('container-vocab');
    if (!container) return;

    const html = `
        <div class="practice-container">
            <!-- Header -->
            <div class="practice-header">
                <h1 class="practice-title">📚 Vocabulary Practice</h1>
                <p class="practice-subtitle">Master new words with daily 5-question sets</p>
            </div>

            <!-- Month Selector -->
            <div class="month-selector-container">
                <label class="month-label">Select Month:</label>
                <select id="month-selector" onchange="selectMonth(this.value)" class="month-select">
                    ${MONTH_NAMES.map(month => `
                        <option value="${month}" ${month === currentMonthVocab ? 'selected' : ''}>${month} 2026</option>
                    `).join('')}
                </select>
            </div>

            <!-- Sets Grid Container -->
            <div id="sets-grid-container"></div>
        </div>
    `;

    container.innerHTML = html;
    renderSetsGrid(currentMonthVocab);
}

function renderSetsGrid(month) {
    const container = document.getElementById('sets-grid-container');
    if (!container) return;

    const daysInMonth = MONTHS_CONFIG[month];
    const monthProgress = vocabSetsProgress[month] || {};

    // Calculate statistics
    const completedSets = Object.keys(monthProgress).filter(key => monthProgress[key].completed).length;
    const totalScore = Object.values(monthProgress).reduce((sum, set) => sum + (set.score || 0), 0);
    const totalAttempted = Object.keys(monthProgress).length;

    const html = `
        <!-- Month Statistics -->
        <div class="stats-card">
            <h2 class="stats-title">${month} 2026 Progress</h2>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${completedSets}/${daysInMonth}</div>
                    <div class="stat-label">Sets Completed</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${totalScore}</div>
                    <div class="stat-label">Total Correct</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.round((completedSets / daysInMonth) * 100)}%</div>
                    <div class="stat-label">Month Complete</div>
                </div>
            </div>
        </div>

        <!-- Sets Grid -->
        <div class="sets-grid">
            ${Array.from({ length: daysInMonth }, (_, i) => {
        const setNum = i + 1;
        const setKey = `set_${setNum}`;
        const setData = monthProgress[setKey];

        // Check if set has questions available
        const setQuestions = generateSetQuestions(month, setNum);
        const hasQuestions = setQuestions !== null;

        let status = 'not-started';
        let statusIcon = '⭕';
        let clickHandler = '';

        if (!hasQuestions) {
            // No questions available for this set yet
            status = 'locked';
            statusIcon = '🔒';
        } else if (setData) {
            if (setData.completed) {
                status = 'completed';
                statusIcon = '✅';
                clickHandler = `onclick="reviewSet('${month}', ${setNum})"`;
            } else {
                status = 'in-progress';
                statusIcon = '🔄';
                clickHandler = `onclick="startSet('${month}', ${setNum})"`;
            }
        } else if (hasQuestions) {
            clickHandler = `onclick="startSet('${month}', ${setNum})"`;
        }

        return `
                    <div class="set-card ${status}" ${clickHandler}>
                        <div class="set-icon">${statusIcon}</div>
                        <div class="set-number">Set ${setNum}</div>
                        ${setData ? `<div class="set-score">${setData.score || 0}/5 Correct</div>` : ''}
                        ${status === 'locked' ? `<div class="set-score">Coming Soon</div>` : ''}
                    </div>
                `;
    }).join('')}
        </div>
    `;

    container.innerHTML = html;
}

function selectMonth(month) {
    currentMonthVocab = month;
    renderSetsGrid(month);
}

// ==========================================
// SET EXECUTION
// ==========================================

function startSet(month, setNumber) {
    // ---- 7-SET DAILY LIMIT ----
    const today = new Date().toISOString().split('T')[0];
    const limitKey = 'vocab_sets_daily_' + today;
    const dailyCount = parseInt(localStorage.getItem(limitKey) || '0', 10);
    if (dailyCount >= 7) {
        showToast('⚠️ You\'ve reached your daily limit of 7 vocabulary sets. Come back tomorrow!');
        return;
    }
    // Increment daily counter
    localStorage.setItem(limitKey, String(dailyCount + 1));
    // ----------------------------

    currentMonthVocab = month;
    currentSetNumberVocab = setNumber;
    currentQuestionVocab = 0;
    setScoreVocab = 0;
    currentAttemptsVocab = []; // Reset attempts tracking

    // Generate 5 unique questions for this set
    currentSetQuestionsVocab = generateSetQuestions(month, setNumber);

    // Check if set has questions
    if (!currentSetQuestionsVocab) {
        showToast("This set doesn't have questions yet. Coming soon!");
        return;
    }

    renderSetQuestion();
}



function renderSetQuestion() {
    const container = document.getElementById('container-vocab');
    if (!container) return;

    if (currentQuestionVocab >= 5) {
        // All 5 questions answered, show sentence creation prompt
        renderSentenceCreation();
        return;
    }

    const q = currentSetQuestionsVocab[currentQuestionVocab];
    const progress = Math.round(((currentQuestionVocab) / 5) * 100);

    const html = `
        <div class="question-container">
            <!-- Header with Back Button -->
            <div class="question-header">
                <button onclick="backToMonthView()" class="back-btn">
                    <span>←</span> Back
                </button>
                <div style="color: #64748b; font-weight: 600;">Question ${currentQuestionVocab + 1}/5</div>
            </div>

            <!-- Progress Bar -->
            <div class="question-progress-track">
                <div class="question-progress-fill" style="width: ${progress}%;"></div>
            </div>

            <!-- Question Content -->
            <div style="text-align: center;">
                <span class="question-category">${q.category}</span>
                <h2 class="question-text">What does "<strong>${q.word}</strong>" mean?</h2>

                <!-- Options -->
                <div class="options-grid" id="vocab-set-options">
                    ${q.options.map((opt, idx) => `
                        <button class="option-card" data-index="${idx}" onclick="selectSetAnswer(${idx})">
                            <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                            ${opt}
                        </button>
                    `).join('')}
                </div>

                <!-- Feedback Area -->
                <div id="vocab-set-feedback"></div>

                <!-- Next Button -->
                <button id="next-set-question-btn" onclick="nextSetQuestion()" class="next-btn">Next Question →</button>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

async function selectSetAnswer(selectedIdx) {
    const q = currentSetQuestionsVocab[currentQuestionVocab];
    const isCorrect = selectedIdx === q.correct;

    // Save full attempt details for review later
    currentAttemptsVocab.push({
        question: { ...q },
        userAnswer: selectedIdx,
        isCorrect: isCorrect
    });

    // Disable all options
    document.querySelectorAll('#vocab-set-options .option-card').forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
    });

    // Highlight correct and incorrect
    const options = document.querySelectorAll('#vocab-set-options .option-card');
    options[q.correct].style.background = '#22c55e';
    options[q.correct].style.borderColor = '#22c55e';
    options[q.correct].style.color = 'white';

    if (!isCorrect) {
        options[selectedIdx].style.background = '#ef4444';
        options[selectedIdx].style.borderColor = '#ef4444';
        options[selectedIdx].style.color = 'white';
    } else {
        setScoreVocab++;
        // Add to Daily Target
        if (window.StorageManager) {
            window.StorageManager.addDailyPoints('vocab', 1);
        }
    }

    // Show loading feedback
    const feedback = document.getElementById('vocab-set-feedback');
    feedback.style.display = 'block';
    feedback.style.background = isCorrect ? '#f0fdf4' : '#fef2f2';
    feedback.innerHTML = `
        <h3 style="color: ${isCorrect ? '#22c55e' : '#ef4444'}; margin-bottom: 15px; font-size: 1.4rem;">
            ${isCorrect ? '✅ Correct!' : '❌ Incorrect'}
        </h3>
        <p style="font-size: 1.15rem; color: #333;">
            <strong>Correct Answer:</strong> ${String.fromCharCode(65 + q.correct)}. ${q.options[q.correct]}
        </p>
        <div style="text-align: center; color: #666; margin-top: 10px;">⏳ Loading AI insights...</div>
    `;

    // Fetch AI example + synonyms
    try {
        const response = await fetch('/vocab-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ word: q.word, type: 'vocabulary' })
        });
        const aiData = await response.json();

        const synonymsHtml = aiData.synonyms && aiData.synonyms.length > 0
            ? `<div style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); padding: 16px 20px; border-radius: 10px; border-left: 5px solid #8b5cf6; margin-top: 12px;">
                    <strong style="color: #7c3aed; font-size: 1rem;">🔗 Synonyms:</strong>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
                        ${aiData.synonyms.map(s => `<span style="background: white; color: #7c3aed; padding: 6px 14px; border-radius: 20px; font-size: 0.95rem; font-weight: 600; border: 1.5px solid #c4b5fd;">${s}</span>`).join('')}
                    </div>
               </div>` : '';

        feedback.innerHTML = `
            <h3 style="color: ${isCorrect ? '#22c55e' : '#ef4444'}; margin-bottom: 15px; font-size: 1.4rem;">
                ${isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </h3>
            <p style="font-size: 1.15rem; color: #333;">
                <strong>Correct Answer:</strong> ${String.fromCharCode(65 + q.correct)}. ${q.options[q.correct]}
            </p>
            <div style="background: linear-gradient(135deg, #f9fafb 0%, #f0fdf4 100%); padding: 20px; border-radius: 10px; border-left: 5px solid var(--lime-primary); margin-top: 12px;">
                <strong style="color: var(--lime-dark); font-size: 1.1rem;">📝 Example Sentence:</strong><br>
                <span style="font-style: italic; color: #333; font-size: 1.05rem; line-height: 1.6;">${aiData.example || 'Example unavailable.'}</span>
            </div>
            ${synonymsHtml}
        `;
    } catch (e) {
        console.error('Failed to fetch AI data for vocab set:', e);
    }

    document.getElementById('next-set-question-btn').style.display = 'block';
}

function nextSetQuestion() {
    currentQuestionVocab++;
    renderSetQuestion();
}

function backToMonthView() {
    renderMonthSelection();
}

// ==========================================
// SENTENCE CREATION
// ==========================================

function renderSentenceCreation() {
    const container = document.getElementById('container-vocab');
    if (!container) return;

    // Extract words from INCORRECT answers for practice
    const incorrectWords = currentAttemptsVocab
        .filter(attempt => !attempt.isCorrect)
        .map(attempt => ({
            word: attempt.question.word,
            definition: attempt.question.options[attempt.question.correct]
        }));

    const html = `
        <div style="max-width: 800px; margin: 60px auto; padding: 40px;">
            <!-- Completion Message -->
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="font-size: 5rem; margin-bottom: 20px;">🎉</div>
                <h1 style="color: var(--lime-dark); font-size: 2.5rem; margin-bottom: 15px;">Set ${currentSetNumberVocab} Complete!</h1>
                <div style="font-size: 2rem; font-weight: 800; color: #16a34a; margin-bottom: 10px;">${setScoreVocab}/5 Correct</div>
                <p style="color: #666; font-size: 1.1rem;">${incorrectWords.length > 0 ? 'Practice the words you missed by writing sentences.' : 'Perfect score! 🎯'}</p>
            </div>

            ${incorrectWords.length > 0 ? `
                <!-- Sentence Creation (Optional) -->
                <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 16px; padding: 30px; margin-bottom: 30px; border-left: 5px solid #f59e0b;">
                    <h2 style="color: #b45309; margin: 0 0 20px 0; font-size: 1.6rem;">✍️ Practice Missed Words (Optional)</h2>
                    <p style="color: #78350f; margin-bottom: 20px;">Write sentences using the words you got wrong to reinforce your learning:</p>
                    
                    <!-- Words List -->
                    <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 10px;">
                        <strong style="color: #b45309;">Words to Practice:</strong>
                        ${incorrectWords.map(item => `<span style="display: inline-block; margin: 5px 10px 5px 0; padding: 5px 12px; background: #fef3c7; border-radius: 6px; font-weight: 600;">${item.word}</span>`).join('')}
                    </div>

                    <!-- Sentence Input -->
                    <textarea id="user-sentence-set" placeholder="Write a sentence using one or more of these words..." style="width: 100%; padding: 15px; border: 2px solid #fbbf24; border-radius: 10px; font-size: 1.05rem; min-height: 100px; resize: vertical; margin-bottom: 15px;"></textarea>

                    <!-- Action Buttons -->
                    <div style="display: flex; gap: 15px;">
                        <button onclick="saveSentenceAndComplete()" style="flex: 1; padding: 15px; background: #f59e0b; color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#d97706'" onmouseout="this.style.background='#f59e0b'">
                            💾 Save Sentence & Complete
                        </button>
                        <button onclick="skipSentenceAndComplete()" style="flex: 1; padding: 15px; background: #6b7280; color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'">
                            ⏭️ Skip & Complete
                        </button>
                    </div>
                    <div id="sentence-save-feedback" style="margin-top: 15px; display: none;"></div>
                </div>
            ` : `
                <!-- All Correct -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <button onclick="completeSet(null)" style="padding: 15px 40px; background: var(--lime-primary); color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#84cc16'" onmouseout="this.style.background='var(--lime-primary)'">
                        Continue to ${currentMonthVocab}
                    </button>
                </div>
            `}
        </div>
    `;

    container.innerHTML = html;
}

async function saveSentenceAndComplete() {
    const sentenceInput = document.getElementById('user-sentence-set');
    const sentence = sentenceInput.value.trim();
    const feedbackDiv = document.getElementById('sentence-save-feedback');

    if (!sentence) {
        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = '<p style="color: #dc2626; font-weight: 600;">⚠️ Please enter a sentence first!</p>';
        return;
    }

    try {
        // Prepare words for saving
        // Get incorrect words from currentAttemptsVocab
        const incorrectWords = currentAttemptsVocab
            .filter(attempt => !attempt.isCorrect)
            .map(attempt => ({
                word: attempt.question.word,
                definition: attempt.question.options[attempt.question.correct]
            }));

        // We'll save it as one entry with joined words/definitions
        // This is a design choice; alternative is saving one entry per word.
        // Given the UI allows one sentence for multiple words, saving as one entry makes sense.

        await fetch('/save_sentence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: window.StorageManager ? window.StorageManager.getUser() : 'default_user',
                sentence_data: {
                    type: 'vocab',
                    word: incorrectWords.map(w => w.word).join(', '),
                    definition: incorrectWords.map(w => w.definition).join(' | '),
                    userSentence: sentence
                }
            })
        });

        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = '<p style="color: #16a34a; font-weight: 600;">✅ Sentence saved!</p>';

        setTimeout(() => {
            completeSet(sentence); // Pass sentence to completeSet
        }, 500);
    } catch (e) {
        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = '<p style="color: #dc2626; font-weight: 600;">❌ Failed to save.</p>';
        console.error(e);
    }
}

function skipSentenceAndComplete() {
    completeSet(null); // No sentence
}

function completeSet(userSentence = null) {
    // Mark set as completed with ENHANCED data
    if (!vocabSetsProgress[currentMonthVocab]) {
        vocabSetsProgress[currentMonthVocab] = {};
    }

    vocabSetsProgress[currentMonthVocab][`set_${currentSetNumberVocab}`] = {
        completed: true,
        score: setScoreVocab,
        timestamp: new Date().toISOString(),
        attempts: currentAttemptsVocab, // Save full attempts
        userSentence: userSentence // Save user's sentence if provided
    };

    saveVocabSetsProgress();

    // Return to month view
    renderMonthSelection();
}

// ==========================================
// REVIEW MODE
// ==========================================

function reviewSet(month, setNumber) {
    const setKey = `set_${setNumber}`;
    const setData = vocabSetsProgress[month][setKey];

    if (!setData || !setData.attempts) {
        showToast("No attempt data found for this set!");
        return;
    }

    const container = document.getElementById('container-vocab');
    if (!container) return;

    const html = `
        <div style="max-width: 900px; margin: 40px auto; padding: 30px;">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <button onclick="renderMonthSelection()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    ← Back to ${month}
                </button>
                <h1 style="color: var(--lime-dark); font-size: 2rem; margin: 0;">Review: Set ${setNumber}</h1>
                <button onclick="startSet('${month}', ${setNumber})" style="padding: 10px 20px; background: var(--lime-primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    🔄 Re-attempt
                </button>
            </div>
            
            <!-- Score Summary -->
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; padding: 25px; margin-bottom: 30px; text-align: center;">
                <div style="font-size: 2.5rem; font-weight: 800; color: #16a34a; margin-bottom: 10px;">${setData.score}/5 Correct</div>
                <div style="color: #666;">Completed on ${new Date(setData.timestamp).toLocaleString()}</div>
            </div>
            
            <!-- Questions Review -->
            ${setData.attempts.map((attempt, idx) => {
        const q = attempt.question;
        const isCorrect = attempt.isCorrect;
        return `
                    <div style="background: white; border-radius: 12px; padding: 30px; margin-bottom: 20px; border-left: 5px solid ${isCorrect ? '#22c55e' : '#ef4444'};">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h3 style="color: var(--lime-dark); margin: 0;">Question ${idx + 1}: ${q.word}</h3>
                            <span style="font-size: 1.5rem;">${isCorrect ? '✅' : '❌'}</span>
                        </div>
                        
                        <div style="margin-bottom: 15px; color: #666;">
                            <strong>Category:</strong> ${q.category}
                        </div>
                        
                        ${q.options.map((opt, optIdx) => {
            let optStyle = 'background: #f9fafb; border: 2px solid #e5e7eb;';
            if (optIdx === q.correct) {
                optStyle = 'background: #22c55e; border: 2px solid #22c55e; color: white;';
            } else if (optIdx === attempt.userAnswer && !isCorrect) {
                optStyle = 'background: #ef4444; border: 2px solid #ef4444; color: white;';
            }
            return `
                            <div style="${optStyle} padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                                <span style="font-weight: 700; margin-right: 10px;">${String.fromCharCode(65 + optIdx)}.</span>
                                ${opt}
                                ${optIdx === q.correct ? ' <span style="margin-left: 10px;">✓ Correct Answer</span>' : ''}
                                ${optIdx === attempt.userAnswer && !isCorrect ? ' <span style="margin-left: 10px;">✗ Your Answer</span>' : ''}
                            </div>
                        `;
        }).join('')}
                    </div>
                `;
    }).join('')}
            
            <!-- User Sentence -->
            ${setData.userSentence ? `
                <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 12px; padding: 25px; margin-top: 30px;">
                    <h3 style="color: #b45309; margin: 0 0 15px 0;">✍️ Your Sentence</h3>
                    <p style="font-size: 1.1rem; color: #78350f; font-style: italic; margin: 0;">
                        "${setData.userSentence}"
                    </p>
                </div>
            ` : ''}
        </div>
    `;

    container.innerHTML = html;
}

// ==========================================
// EXPOSE FUNCTIONS TO WINDOW
// ==========================================

window.initVocabSets = initVocabSets;
window.selectMonth = selectMonth;
window.startSet = startSet;
window.reviewSet = reviewSet;
window.selectSetAnswer = selectSetAnswer;
window.nextSetQuestion = nextSetQuestion;
window.backToMonthView = backToMonthView;
window.saveSentenceAndComplete = saveSentenceAndComplete;
window.skipSentenceAndComplete = skipSentenceAndComplete;
window.completeSet = completeSet;
