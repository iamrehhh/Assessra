// ==========================================
// IDIOMS QUIZ - 300 IDIOMS WITH TRICKY MCQS
// ==========================================

// All 300 idioms data
const idiomsData = [
    { idiom: "A blessing in disguise", meaning: "Something that seems bad but turns out to be good" },
    { idiom: "A dime a dozen", meaning: "Very common and of no particular value" },
    { idiom: "A piece of cake", meaning: "Something very easy to do" },
    { idiom: "A slap on the wrist", meaning: "A mild punishment or warning" },
    { idiom: "Actions speak louder than words", meaning: "What you do is more important than what you say" },
    { idiom: "Add insult to injury", meaning: "To make a bad situation worse" },
    { idiom: "At the drop of a hat", meaning: "Without any hesitation; instantly" },
    { idiom: "Back to the drawing board", meaning: "Start over after a failed attempt" },
    { idiom: "Ball is in your court", meaning: "It's up to you to make the next decision" },
    { idiom: "Barking up the wrong tree", meaning: "Looking in the wrong place; pursuing a mistaken course" },
    { idiom: "Beat around the bush", meaning: "Avoid saying something directly" },
    { idiom: "Bite off more than you can chew", meaning: "Take on more than you can handle" },
    { idiom: "Break a leg", meaning: "Good luck (typically said to performers)" },
    { idiom: "Break the ice", meaning: "Make people feel more comfortable" },
    { idiom: "Burn the midnight oil", meaning: "Work late into the night" },
    { idiom: "Burst someone's bubble", meaning: "Destroy someone's illusions or hopes" },
    { idiom: "By the skin of your teeth", meaning: "Just barely; narrowly" },
    { idiom: "Call it a day", meaning: "Stop working on something" },
    { idiom: "Caught between a rock and a hard place", meaning: "Faced with two difficult choices" },
    { idiom: "Cost an arm and a leg", meaning: "Be very expensive" },
    { idiom: "Cross that bridge when you come to it", meaning: "Deal with a problem when it happens" },
    { idiom: "Cry over spilt milk", meaning: "Complain about something that cannot be changed" },
    { idiom: "Cut corners", meaning: "Do something poorly to save time or money" },
    { idiom: "Cut to the chase", meaning: "Get to the point without wasting time" },
    { idiom: "Devil's advocate", meaning: "Someone who argues against something to test its validity" },
    { idiom: "Don't count your chickens before they hatch", meaning: "Don't assume something will happen" },
    { idiom: "Don't put all your eggs in one basket", meaning: "Don't risk everything on one venture" },
    { idiom: "Drastic times call for drastic measures", meaning: "Extreme situations require extreme actions" },
    { idiom: "Every cloud has a silver lining", meaning: "There's something good in every bad situation" },
    { idiom: "Face the music", meaning: "Accept the consequences of your actions" },
    { idiom: "Get out of hand", meaning: "Become uncontrollable" },
    { idiom: "Get your act together", meaning: "Organize yourself; improve your behavior" },
    { idiom: "Give someone the benefit of the doubt", meaning: "Trust what someone says" },
    { idiom: "Go the extra mile", meaning: "Make an extra effort" },
    { idiom: "Good things come to those who wait", meaning: "Patience brings rewards" },
    { idiom: "Hit the nail on the head", meaning: "Be exactly right about something" },
    { idiom: "Hit the sack", meaning: "Go to bed" },
    { idiom: "In hot water", meaning: "In trouble" },
    { idiom: "It takes two to tango", meaning: "Both parties are responsible" },
    { idiom: "Jump on the bandwagon", meaning: "Join a popular activity or trend" },
    { idiom: "Keep your chin up", meaning: "Stay positive; remain cheerful" },
    { idiom: "Kill two birds with one stone", meaning: "Accomplish two things with one action" },
    { idiom: "Let sleeping dogs lie", meaning: "Avoid interfering with a situation" },
    { idiom: "Let the cat out of the bag", meaning: "Reveal a secret" },
    { idiom: "Make a long story short", meaning: "Tell something briefly" },
    { idiom: "Miss the boat", meaning: "Miss an opportunity" },
    { idiom: "No pain, no gain", meaning: "You have to work hard to achieve results" },
    { idiom: "Not rocket science", meaning: "Not difficult to understand" },
    { idiom: "Off the hook", meaning: "No longer in trouble or responsible" },
    { idiom: "On cloud nine", meaning: "Extremely happy" },
    { idiom: "On the ball", meaning: "Alert and competent" },
    { idiom: "On thin ice", meaning: "In a risky or dangerous situation" },
    { idiom: "Once in a blue moon", meaning: "Very rarely" },
    { idiom: "Out of the blue", meaning: "Unexpectedly" },
    { idiom: "Over the moon", meaning: "Extremely pleased or happy" },
    { idiom: "Play devil's advocate", meaning: "Argue against an idea to test it" },
    { idiom: "Pull someone's leg", meaning: "Tease or joke with someone" },
    { idiom: "Pull yourself together", meaning: "Calm down and regain composure" },
    { idiom: "Put all your cards on the table", meaning: "Be completely honest" },
    { idiom: "Rain on someone's parade", meaning: "Spoil someone's plans or happiness" },
    { idiom: "Read between the lines", meaning: "Understand the hidden meaning" },
    { idiom: "Ring a bell", meaning: "Sound familiar" },
    { idiom: "Rome wasn't built in a day", meaning: "Important things take time" },
    { idiom: "See eye to eye", meaning: "Agree with someone" },
    { idiom: "Sit on the fence", meaning: "Remain neutral; not take sides" },
    { idiom: "Speak of the devil", meaning: "The person we were talking about just arrived" },
    { idiom: "Spill the beans", meaning: "Reveal secret information" },
    { idiom: "Steal someone's thunder", meaning: "Take credit for someone else's achievement" },
    { idiom: "Take it with a grain of salt", meaning: "Don't take something too seriously" },
    { idiom: "Take the bull by the horns", meaning: "Deal with a difficult situation directly" },
    { idiom: "The ball is in your court", meaning: "It's your turn to take action" },
    { idiom: "The best of both worlds", meaning: "An ideal situation with two benefits" },
    { idiom: "The elephant in the room", meaning: "An obvious problem that nobody wants to discuss" },
    { idiom: "The last straw", meaning: "The final problem that makes you lose patience" },
    { idiom: "The whole nine yards", meaning: "Everything; all of it" },
    { idiom: "Throw in the towel", meaning: "Give up; quit" },
    { idiom: "Time flies", meaning: "Time passes quickly" },
    { idiom: "To be on the same page", meaning: "To have the same understanding" },
    { idiom: "Under the weather", meaning: "Feeling sick or ill" },
    { idiom: "Up in the air", meaning: "Uncertain or undecided" },
    { idiom: "Walk on eggshells", meaning: "Be very careful not to offend someone" },
    { idiom: "Water under the bridge", meaning: "Past events that are no longer important" },
    { idiom: "When pigs fly", meaning: "Something that will never happen" },
    { idiom: "Wild goose chase", meaning: "A hopeless pursuit" },
    { idiom: "Wolf in sheep's clothing", meaning: "Someone who appears harmless but is dangerous" },
    { idiom: "You can't have your cake and eat it too", meaning: "You can't have everything" },
    { idiom: "You can't judge a book by its cover", meaning: "Don't judge by appearance alone" },
    { idiom: "Your guess is as good as mine", meaning: "I don't know either" },
    { idiom: "A drop in the ocean", meaning: "A very small amount compared to what is needed" },
    { idiom: "A hot potato", meaning: "A controversial issue that is difficult to handle" },
    { idiom: "A leopard can't change its spots", meaning: "People cannot change their basic nature" },
    { idiom: "A picture is worth a thousand words", meaning: "Visual images convey meaning better than words" },
    { idiom: "A snowball's chance in hell", meaning: "No chance at all" },
    { idiom: "Add fuel to the fire", meaning: "Make a bad situation worse" },
    { idiom: "Against the clock", meaning: "Rushed; under time pressure" },
    { idiom: "All bark and no bite", meaning: "Threatening but not dangerous" },
    { idiom: "All ears", meaning: "Listening attentively" },
    { idiom: "An arm and a leg", meaning: "Very expensive" },
    { idiom: "Apple of my eye", meaning: "Someone very precious or dear" },
    { idiom: "At the end of the day", meaning: "Ultimately; when all is considered" },
    { idiom: "Achilles' heel", meaning: "A weakness or vulnerable point" },
    { idiom: "Against all odds", meaning: "Despite very low probability" },
    { idiom: "Ahead of the curve", meaning: "More advanced than others" },
    { idiom: "All in the same boat", meaning: "In the same difficult situation" },
    { idiom: "All thumbs", meaning: "Clumsy; awkward with hands" },
    { idiom: "Around the clock", meaning: "All day and all night" },
    { idiom: "As fit as a fiddle", meaning: "In very good health" },
    { idiom: "As right as rain", meaning: "Perfectly fine; in good order" },
    { idiom: "At loggerheads", meaning: "In strong disagreement" },
    { idiom: "At your wit's end", meaning: "Completely frustrated; don't know what to do" },
    { idiom: "Back against the wall", meaning: "In a difficult situation with no escape" },
    { idiom: "Back seat driver", meaning: "Someone who gives unwanted advice" },
    { idiom: "Bad blood", meaning: "Ill feeling or hostility between people" },
    { idiom: "Bag of bones", meaning: "An extremely thin person" },
    { idiom: "Baptism of fire", meaning: "A difficult introduction to something" },
    { idiom: "Bark up the wrong tree", meaning: "Pursue the wrong course of action" },
    { idiom: "Beat a dead horse", meaning: "Waste time on something that won't succeed" },
    { idiom: "Behind the eight ball", meaning: "In a difficult position" },
    { idiom: "Bells and whistles", meaning: "Extra features or decorations" },
    { idiom: "Below the belt", meaning: "Unfair or cruel" },
    { idiom: "Between the devil and the deep blue sea", meaning: "Between two dangers" },
    { idiom: "Bite the bullet", meaning: "Endure a painful situation bravely" },
    { idiom: "Bite the dust", meaning: "Die or fail" },
    { idiom: "Black sheep", meaning: "A disgrace to the family or group" },
    { idiom: "Blow off steam", meaning: "Release pent-up energy or emotion" },
    { idiom: "Blow your own trumpet", meaning: "Boast about yourself" },
    { idiom: "Born with a silver spoon", meaning: "Born into wealth" },
    { idiom: "Bottom line", meaning: "The essential point" },
    { idiom: "Break new ground", meaning: "Do something innovative" },
    { idiom: "Bring home the bacon", meaning: "Earn a living" },
    { idiom: "Burning question", meaning: "An urgent or important issue" },
    { idiom: "Bury the hatchet", meaning: "Make peace; end a quarrel" },
    { idiom: "Butterflies in my stomach", meaning: "Nervous or anxious feeling" },
    { idiom: "By hook or by crook", meaning: "By any means necessary" },
    { idiom: "Call a spade a spade", meaning: "Speak frankly and directly" },
    { idiom: "Can of worms", meaning: "A complex, troublesome situation" },
    { idiom: "Carry the can", meaning: "Take the blame for something" },
    { idiom: "Cast pearls before swine", meaning: "Offer something valuable to those who won't appreciate it" },
    { idiom: "Catch-22", meaning: "A problematic situation with no solution" },
    { idiom: "Change of heart", meaning: "A change in opinion or feeling" },
    { idiom: "Chickens come home to roost", meaning: "Bad deeds come back to haunt you" },
    { idiom: "Chip on your shoulder", meaning: "Holding a grudge" },
    { idiom: "Clean slate", meaning: "A fresh start" },
    { idiom: "Close but no cigar", meaning: "Nearly successful but not quite" },
    { idiom: "Cold feet", meaning: "Nervous about doing something" },
    { idiom: "Come hell or high water", meaning: "No matter what happens" },
    { idiom: "Come rain or shine", meaning: "Whatever the circumstances" },
    { idiom: "Come up smelling of roses", meaning: "Emerge from difficulty with reputation intact" },
    { idiom: "Cook someone's goose", meaning: "Ruin someone's plans" },
    { idiom: "Cool as a cucumber", meaning: "Very calm and relaxed" },
    { idiom: "Couch potato", meaning: "A lazy person who watches a lot of TV" },
    { idiom: "Crocodile tears", meaning: "Fake tears; insincere sympathy" },
    { idiom: "Cross your fingers", meaning: "Hope for good luck" },
    { idiom: "Cry wolf", meaning: "Raise a false alarm" },
    { idiom: "Cut and dried", meaning: "Already decided; straightforward" },
    { idiom: "Cut from the same cloth", meaning: "Very similar in nature" },
    { idiom: "Cut the mustard", meaning: "Meet the required standard" },
    { idiom: "Dark horse", meaning: "An unexpected winner or success" },
    { idiom: "Dead as a doornail", meaning: "Completely dead" },
    { idiom: "Dead in the water", meaning: "Unable to make progress" },
    { idiom: "Diamond in the rough", meaning: "Someone with hidden potential" },
    { idiom: "Dime a dozen", meaning: "Common and of little value" },
    { idiom: "Don't cry over spilt milk", meaning: "Don't worry about past mistakes" },
    { idiom: "Don't look a gift horse in the mouth", meaning: "Don't be ungrateful" },
    { idiom: "Draw a blank", meaning: "Unable to remember something" },
    { idiom: "Draw the line", meaning: "Set a limit" },
    { idiom: "Dressed to kill", meaning: "Dressed very stylishly" },
    { idiom: "Drop someone a line", meaning: "Send a message or letter" },
    { idiom: "Eager beaver", meaning: "An enthusiastic person" },
    { idiom: "Early bird catches the worm", meaning: "Success comes to those who prepare" },
    { idiom: "Easier said than done", meaning: "More difficult than it appears" },
    { idiom: "Easy does it", meaning: "Proceed carefully" },
    { idiom: "Eat humble pie", meaning: "Admit you were wrong" },
    { idiom: "Eat your heart out", meaning: "Feel jealousy or regret" },
    { idiom: "Eat your words", meaning: "Retract what you said" },
    { idiom: "Elbow grease", meaning: "Hard physical work" },
    { idiom: "Even stevens", meaning: "Equal; fair" },
    { idiom: "Every dog has its day", meaning: "Everyone gets their chance" },
    { idiom: "Eye for an eye", meaning: "Retaliation in kind" },
    { idiom: "Feather in your cap", meaning: "An achievement to be proud of" },
    { idiom: "Feel under the weather", meaning: "Feel slightly ill" },
    { idiom: "Few and far between", meaning: "Rare; scarce" },
    { idiom: "Fifth wheel", meaning: "An unnecessary person" },
    { idiom: "Fight fire with fire", meaning: "Use the same methods as your opponent" },
    { idiom: "Find your feet", meaning: "Become confident in a new situation" },
    { idiom: "Fish out of water", meaning: "Uncomfortable in unfamiliar surroundings" },
    { idiom: "Flash in the pan", meaning: "Success that doesn't last" },
    { idiom: "Fly by the seat of your pants", meaning: "Act without planning" },
    { idiom: "Fly off the handle", meaning: "Suddenly become very angry" },
    { idiom: "Food for thought", meaning: "Something worth thinking about" },
    { idiom: "Foot in the door", meaning: "An initial opportunity" },
    { idiom: "Foot the bill", meaning: "Pay for something" },
    { idiom: "For a song", meaning: "Very cheaply" },
    { idiom: "From scratch", meaning: "From the beginning" },
    { idiom: "From the horse's mouth", meaning: "From a reliable source" },
    { idiom: "Full of beans", meaning: "Full of energy" },
    { idiom: "Get a kick out of", meaning: "Enjoy something" },
    { idiom: "Get a second wind", meaning: "Regain energy" },
    { idiom: "Get cold feet", meaning: "Become nervous about doing something" },
    { idiom: "Get down to brass tacks", meaning: "Focus on important details" },
    { idiom: "Get in on the ground floor", meaning: "Be involved from the beginning" },
    { idiom: "Get on like a house on fire", meaning: "Have an excellent relationship" },
    { idiom: "Get the show on the road", meaning: "Start an activity" },
    { idiom: "Get wind of", meaning: "Hear about something indirectly" },
    { idiom: "Give someone a run for their money", meaning: "Provide strong competition" },
    { idiom: "Give the cold shoulder", meaning: "Deliberately ignore someone" },
    { idiom: "Go against the grain", meaning: "Do something contrary to normal practice" },
    { idiom: "Go down in flames", meaning: "Fail spectacularly" },
    { idiom: "Go for broke", meaning: "Risk everything" },
    { idiom: "Go out on a limb", meaning: "Take a risk" },
    { idiom: "Go to pot", meaning: "Deteriorate" },
    { idiom: "Golden handshake", meaning: "A large payment given to someone leaving a job" },
    { idiom: "Grease someone's palm", meaning: "Bribe someone" },
    { idiom: "Green thumb", meaning: "Natural skill at gardening" },
    { idiom: "Green with envy", meaning: "Very jealous" },
    { idiom: "Grist for the mill", meaning: "Something useful for your purpose" },
    { idiom: "Hair of the dog", meaning: "An alcoholic drink taken to cure a hangover" },
    { idiom: "Half-baked", meaning: "Not well thought out" },
    { idiom: "Hand in glove", meaning: "Working closely together" },
    { idiom: "Hands down", meaning: "Easily; without question" },
    { idiom: "Hang in there", meaning: "Persevere; don't give up" },
    { idiom: "Have a bone to pick", meaning: "Have a complaint to discuss" },
    { idiom: "Have a chip on your shoulder", meaning: "Be resentful" },
    { idiom: "Have your cake and eat it too", meaning: "Want everything" },
    { idiom: "Head in the clouds", meaning: "Not paying attention to reality" },
    { idiom: "Head over heels", meaning: "Deeply in love" },
    { idiom: "Heart of gold", meaning: "A kind and generous nature" },
    { idiom: "High and dry", meaning: "Abandoned and helpless" },
    { idiom: "High and mighty", meaning: "Arrogant" },
    { idiom: "Hit the ground running", meaning: "Start with energy and enthusiasm" },
    { idiom: "Hold your horses", meaning: "Wait; be patient" },
    { idiom: "Hold your tongue", meaning: "Stop talking" },
    { idiom: "Hook, line, and sinker", meaning: "Completely; entirely" },
    { idiom: "In a nutshell", meaning: "Briefly; in summary" },
    { idiom: "In over your head", meaning: "Involved in something too difficult" },
    { idiom: "In the bag", meaning: "Certain to happen" },
    { idiom: "In the black", meaning: "Profitable; not in debt" },
    { idiom: "In the blink of an eye", meaning: "Very quickly" },
    { idiom: "In the doghouse", meaning: "In trouble" },
    { idiom: "In the heat of the moment", meaning: "While emotions are high" },
    { idiom: "In the long run", meaning: "Eventually; over time" },
    { idiom: "In the nick of time", meaning: "Just in time" },
    { idiom: "In the red", meaning: "In debt" },
    { idiom: "Iron out the wrinkles", meaning: "Solve small problems" },
    { idiom: "It's not over till the fat lady sings", meaning: "It's not finished yet" },
    { idiom: "Ivory tower", meaning: "A state of isolation from reality" },
    { idiom: "Jump down someone's throat", meaning: "Respond angrily" },
    { idiom: "Jump the gun", meaning: "Start too soon" },
    { idiom: "Jump through hoops", meaning: "Do many difficult things" },
    { idiom: "Keep an eye on", meaning: "Watch carefully" },
    { idiom: "Keep at bay", meaning: "Keep at a distance" },
    { idiom: "Keep something at arm's length", meaning: "Avoid becoming too involved" },
    { idiom: "Keep your eye on the ball", meaning: "Stay focused" },
    { idiom: "Keep your head above water", meaning: "Just manage to survive" },
    { idiom: "Kick the bucket", meaning: "Die" },
    { idiom: "Knock on wood", meaning: "Hope for good luck" },
    { idiom: "Know the ropes", meaning: "Understand how something works" },
    { idiom: "Last but not least", meaning: "Equally important though mentioned last" },
    { idiom: "Lay down the law", meaning: "State rules firmly" },
    { idiom: "Learn the ropes", meaning: "Learn how to do something" },
    { idiom: "Leave no stone unturned", meaning: "Try everything possible" },
    { idiom: "Left in the lurch", meaning: "Abandoned in difficulty" },
    { idiom: "Lend an ear", meaning: "Listen" },
    { idiom: "Let bygones be bygones", meaning: "Forget past disagreements" },
    { idiom: "Let off steam", meaning: "Release anger or frustration" },
    { idiom: "Let the chips fall where they may", meaning: "Accept whatever happens" },
    { idiom: "Level playing field", meaning: "Fair conditions for everyone" },
    { idiom: "Lie low", meaning: "Stay hidden; avoid attention" },
    { idiom: "Like a bull in a china shop", meaning: "Clumsy and destructive" },
    { idiom: "Like pulling teeth", meaning: "Very difficult" },
    { idiom: "Live from hand to mouth", meaning: "Barely survive financially" },
    { idiom: "Lock, stock, and barrel", meaning: "Everything; completely" },
    { idiom: "Long shot", meaning: "Something unlikely to succeed" },
    { idiom: "Loose cannon", meaning: "An unpredictable person" },
    { idiom: "Lose your marbles", meaning: "Go crazy" },
    { idiom: "Make ends meet", meaning: "Have just enough money to survive" },
    { idiom: "Make hay while the sun shines", meaning: "Take advantage of opportunities" },
    { idiom: "Make no bones about it", meaning: "Be direct and clear" },
    { idiom: "Make waves", meaning: "Cause trouble" },
    { idiom: "Method to my madness", meaning: "A purpose behind seeming chaos" },
    { idiom: "Midas touch", meaning: "Ability to make money easily" },
    { idiom: "Neck and neck", meaning: "Very close in competition" },
    { idiom: "Nip it in the bud", meaning: "Stop something at an early stage" },
    { idiom: "Not a spark of decency", meaning: "Completely lacking in moral values" },
    { idiom: "Off the record", meaning: "Unofficial; not for publication" },
    { idiom: "Old hat", meaning: "Old-fashioned; outdated" },
    { idiom: "On a roll", meaning: "Having success after success" },
    { idiom: "On pins and needles", meaning: "Anxious; nervous" },
    { idiom: "On the fence", meaning: "Undecided" },
    { idiom: "On the same wavelength", meaning: "Thinking similarly" },
    { idiom: "Once bitten, twice shy", meaning: "Cautious after a bad experience" },
    { idiom: "Out of sight, out of mind", meaning: "Forgotten when not visible" },
    { idiom: "Out of the frying pan into the fire", meaning: "From bad to worse" },
    { idiom: "Out of the woods", meaning: "Out of danger" },
    { idiom: "Over my dead body", meaning: "Absolutely not" },
    { idiom: "Over the top", meaning: "Excessive" },
    { idiom: "Paint the town red", meaning: "Go out and celebrate" },
    { idiom: "Par for the course", meaning: "Normal; expected" },
    { idiom: "Pass the buck", meaning: "Shift responsibility to someone else" }
];

let idiomsQuestions = [];
let currentIdiomQuestion = 0;
let idiomsScore = 0;
let idiomsAnswered = 0;

//Generate tricky MCQ options
function generateIdiomOptions(correctMeaning, correctIdiom) {
    // Get other meanings ensuring they're semantically close but distinct
    const allMeanings = idiomsData
        .filter(item => item.meaning !== correctMeaning && item.idiom !== correctIdiom)
        .map(item => item.meaning);

    // Shuffle and pick 3 distract ors
    const shuffled = allMeanings.sort(() => 0.5 - Math.random());
    const distractors = shuffled.slice(0, 3);

    // Combine with correct answer and shuffle
    const options = [correctMeaning, ...distractors];
    const shuffledOptions = options.sort(() => 0.5 - Math.random());

    // Find correct index
    const correctIndex = shuffledOptions.indexOf(correctMeaning);

    return { options: shuffledOptions, correct: correctIndex };
}

// Initialize idioms quiz
function initIdiomsQuiz() {
    // Shuffle idioms
    const shuffled = [...idiomsData].sort(() => 0.5 - Math.random());

    // Generate questions with MCQs
    idiomsQuestions = shuffled.map(item => {
        const { options, correct } = generateIdiomOptions(item.meaning, item.idiom);
        return {
            idiom: item.idiom,
            options: options,
            correct: correct
        };
    });
}

// Load idioms view (called from logic.js)
async function loadIdiomsView() {
    // Logic is now handled in logic.js showIdiomsContainer
    // This function can just ensure init
    if (idiomsQuestions.length === 0) {
        initIdiomsQuiz();
    }
    await loadIdiomsQuiz();
}

// Load idioms progress
async function loadIdiomsQuiz() {
    const container = document.getElementById('container-idioms');
    if (!container) return;

    // Load locally first
    const localData = localStorage.getItem('idioms_progress_local');
    if (localData) {
        try {
            const parsed = JSON.parse(localData);
            idiomsScore = parsed.score || 0;
            idiomsAnswered = parsed.answered || 0;
            currentIdiomQuestion = parsed.current || 0;
            renderIdiomQuestion();
        } catch (e) {
            console.error("Local idioms data parse error", e);
        }
    }

    // Sync with cloud
    try {
        const response = await fetch('/load_idioms_progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: 'default_user' })
        });
        const data = await response.json();

        if (data.progress) {
            const cloudAnswered = data.progress.answered || 0;
            if (cloudAnswered > idiomsAnswered) {
                idiomsScore = data.progress.score || 0;
                idiomsAnswered = cloudAnswered;
                currentIdiomQuestion = data.progress.current || 0;
                renderIdiomQuestion();

                localStorage.setItem('idioms_progress_local', JSON.stringify(data.progress));
            }
        }
    } catch (e) {
        console.error('Failed to load idioms progress from cloud:', e);
    }

    if (idiomsAnswered === 0 && !localData) {
        renderIdiomQuestion();
    }
}

// Save idioms progress
async function saveIdiomsProgress() {
    const progressData = {
        score: idiomsScore,
        answered: idiomsAnswered,
        current: currentIdiomQuestion
    };

    // Save to LocalStorage
    localStorage.setItem('idioms_progress_local', JSON.stringify(progressData));

    // Save to Cloud
    try {
        await fetch('/save_idioms_progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: 'default_user',
                progress: progressData
            })
        });
    } catch (e) {
        console.error('Failed to save idioms progress to cloud:', e);
    }
}

// Render idiom question
function renderIdiomQuestion() {
    const container = document.getElementById('container-idioms');

    if (idiomsAnswered === idiomsQuestions.length) {
        // Show completion scorecard
        container.innerHTML = `
            <div style="max-width: 800px; margin: 80px auto; padding: 40px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); text-align: center;">
                <div style="font-size: 5rem; margin-bottom: 20px;">🎉</div>
                <h1 style="color: var(--lime-dark); font-size: 2.8rem; margin-bottom: 15px;">Quiz Complete!</h1>
                <div style="font-size: 3rem; font-weight: 800; color: #16a34a; margin: 20px 0;">
                    ${idiomsScore}/${idiomsQuestions.length}
                </div>
                <p style="font-size: 1.3rem; color: #666; margin-bottom: 30px;">
                    ${Math.round((idiomsScore / idiomsQuestions.length) * 100)}% Correct
                </p>
                <button onclick="resetIdiomsQuiz()" style="
                    padding: 15px 40px;
                    background: linear-gradient(135deg, var(--lime-primary) 0%, #16a34a 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1.2rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 12px rgba(132, 204, 22, 0.3);
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(132, 204, 22, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(132, 204, 22, 0.3)';">
                    🔄 Restart Quiz
                </button>
            </div>
        `;
        return;
    }

    const q = idiomsQuestions[currentIdiomQuestion];
    const progress = Math.round((idiomsAnswered / idiomsQuestions.length) * 100);

    container.innerHTML = `
        <div style="max-width: 900px; margin: 40px auto; padding: 30px;">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h1 style="color: var(--lime-dark); font-size: 2.2rem; margin: 0;">💬 Idioms Quiz</h1>
                <div style="display: flex; gap: 20px; align-items: center;">
                    <div style="text-align: center;">
                        <div style="font-size: 0.9rem; color: #888; margin-bottom: 5px;">Score</div>
                        <div style="font-size: 1.8rem; font-weight: 800; color: var(--lime-dark);">${idiomsScore}/${idiomsAnswered}</div>
                    </div>
                    <button onclick="resetIdiomsQuiz()" style="padding: 10px 20px; background: #ef4444; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">
                        🔄 Reset
                    </button>
                </div>
            </div>
            
            <!-- Progress Bar -->
            <div style="background: #e5e7eb; border-radius: 10px; height: 12px; margin-bottom: 25px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, var(--lime-primary) 0%, #16a34a 100%); height: 100%; width: ${progress}%; transition: width 0.3s;"></div>
            </div>
            
            <!-- Question Counter -->
            <div style="text-align: center; color: #666; font-size: 1rem; margin-bottom: 30px;">
                Question ${idiomsAnswered + 1} of ${idiomsQuestions.length}
            </div>
            
            <!-- Idiom Card -->
            <div style="background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%); padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 30px; border-left: 6px solid var(--lime-primary);">
                <div style="font-size: 1.1rem; color: #888; margin-bottom: 15px; font-weight: 600;">What does this idiom mean?</div>
                <h2 style="font-size: 2rem; color: var(--lime-dark); margin: 0; line-height: 1.4;">"${q.idiom}"</h2>
            </div>
            
            <!-- Options Grid -->
            <div style="display: grid; gap: 15px; margin-bottom: 25px;">
                ${q.options.map((option, idx) => `
                    <button class="idiom-option" onclick="selectIdiomAnswer(${idx})" style="
                        padding: 20px 25px;
                        background: white;
                        border: 3px solid #e5e7eb;
                        border-radius: 12px;
                        text-align: left;
                        cursor: pointer;
                        transition: all 0.2s;
                        font-size: 1.05rem; color: #333;
                        font-weight: 500;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    " onmouseover="if(!this.disabled) { this.style.borderColor='var(--lime-primary)'; this.style.background='#f9fafb'; this.style.transform='translateX(5px)'; }" onmouseout="if(!this.disabled) { this.style.borderColor='#e5e7eb'; this.style.background='white'; this.style.transform='translateX(0)'; }">
                        <span style="display: inline-block; width: 30px; height: 30px; background: #f0f0f0; border-radius: 50%; text-align: center; line-height: 30px; margin-right: 15px; font-weight: 700; color: #666;">${String.fromCharCode(65 + idx)}</span>
                        ${option}
                    </button>
                `).join('')}
            </div>
            
            <!-- Feedback Area -->
            <div id="idiom-feedback" style="display: none; padding: 20px; border-radius: 12px; margin-bottom: 20px;"></div>
            
            <!-- Next Button -->
            <div style="text-align: center;">
                <button id="next-idiom-btn" style="display: none; padding: 15px 50px; background: linear-gradient(135deg, var(--lime-primary) 0%, #16a34a 100%); color: white; border: none; border-radius: 12px; font-size: 1.2rem; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(132, 204, 22, 0.3);" onclick="nextIdiomQuestion()" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(132, 204, 22, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(132, 204, 22, 0.3)';">
                    Next Question →
                </button>
            </div>
        </div>
    `;
}

// Select idiom answer
async function selectIdiomAnswer(selectedIdx) {
    const q = idiomsQuestions[currentIdiomQuestion];
    const isCorrect = selectedIdx === q.correct;

    // Disable all options
    document.querySelectorAll('.idiom-option').forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
    });

    // Highlight correct and incorrect
    const options = document.querySelectorAll('.idiom-option');
    options[q.correct].style.background = '#22c55e';
    options[q.correct].style.borderColor = '#22c55e';
    options[q.correct].style.color = 'white';

    if (!isCorrect) {
        options[selectedIdx].style.background = '#ef4444';
        options[selectedIdx].style.borderColor = '#ef4444';
        options[selectedIdx].style.color = 'white';
    }

    idiomsAnswered++;
    if (isCorrect) idiomsScore++;

    // Save progress
    saveIdiomsProgress();

    // Show feedback
    const feedback = document.getElementById('idiom-feedback');
    feedback.style.display = 'block';
    feedback.innerHTML = `
        <div style="text-align: center;">
            <h3 style="color: ${isCorrect ? '#22c55e' : '#ef4444'}; margin-bottom: 15px; font-size: 1.4rem; font-weight: 700;">
                ${isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </h3>
            <p style="font-size: 1.15rem; color: #333;">
                <strong>Correct Answer:</strong> ${String.fromCharCode(65 + q.correct)}. ${q.options[q.correct]}
            </p>
            ${isCorrect ? `
                <div id="sentence-prompt-idiom" style="margin-top: 25px; padding: 20px; background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 10px; border-left: 5px solid #f59e0b; text-align: left;">
                    <h4 style="color: #b45309; margin: 0 0 15px 0; font-size: 1.2rem;">✍️ Create Your Own Sentence!</h4>
                    <p style="color: #78350f; margin-bottom: 15px; font-size: 0.95rem;">Write a sentence using the idiom "<strong>${q.idiom}</strong>" to help you remember it.</p>
                    <textarea id="user-sentence-idiom" placeholder="Type your sentence here..." style="width: 100%; padding: 12px; border: 2px solid #fbbf24; border-radius: 8px; font-size: 1rem; min-height: 80px; resize: vertical;"></textarea>
                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <button onclick="saveIdiomSentence('${q.idiom.replace(/'/g, "\\'")}', '${q.options[q.correct].replace(/'/g, "\\'")}', 'idiom')" style="flex: 1; padding: 12px; background: #f59e0b; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#d97706'" onmouseout="this.style.background='#f59e0b'">💾 Save Sentence</button>
                        <button onclick="skipIdiomSentence()" style="flex: 1; padding: 12px; background: #6b7280; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'">⏭️ Skip</button>
                    </div>
                    <div id="sentence-feedback-idiom" style="margin-top: 10px; display: none;"></div>
                </div>
            ` : ''}
        </div>
    `;

    if (!isCorrect) {
        document.getElementById('next-idiom-btn').style.display = 'block';
    }
}

async function saveIdiomSentence(idiom, meaning, type) {
    const sentenceInput = document.getElementById('user-sentence-idiom');
    const sentence = sentenceInput.value.trim();
    const feedbackDiv = document.getElementById('sentence-feedback-idiom');

    // Validation
    if (!sentence) {
        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = '<p style="color: #dc2626; font-weight: 600;">⚠️ Please enter a sentence first!</p>';
        return;
    }

    if (!sentence.toLowerCase().includes(idiom.toLowerCase())) {
        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = `<p style="color: #dc2626; font-weight: 600;">⚠️ Your sentence must include the idiom "${idiom}"!</p>`;
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
                    idiom: idiom,
                    meaning: meaning,
                    userSentence: sentence
                }
            })
        });

        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = '<p style="color: #16a34a; font-weight: 600;">✅ Sentence saved successfully!</p>';

        setTimeout(() => {
            document.getElementById('next-idiom-btn').style.display = 'block';
            document.getElementById('sentence-prompt-idiom').style.opacity = '0.6';
            sentenceInput.disabled = true;
        }, 800);
    } catch (e) {
        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = '<p style="color: #dc2626; font-weight: 600;">❌ Failed to save. Please try again.</p>';
        console.error('Failed to save idiom sentence:', e);
    }
}

function skipIdiomSentence() {
    document.getElementById('next-idiom-btn').style.display = 'block';
    document.getElementById('sentence-prompt-idiom').style.opacity = '0.6';
}

function nextIdiomQuestion() {
    currentIdiomQuestion++;
    saveIdiomsProgress();
    renderIdiomQuestion();
}

async function resetIdiomsQuiz() {
    if (confirm('Are you sure you want to reset your progress? This will clear your score and start from the beginning.')) {
        // Clear from cloud
        try {
            await fetch('/save_idioms_progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: 'default_user',
                    progress: null
                })
            });
        } catch (e) {
            console.error('Failed to reset idioms progress:', e);
        }

        // Reinitialize
        currentIdiomQuestion = 0;
        idiomsScore = 0;
        idiomsAnswered = 0;
        initIdiomsQuiz();
        renderIdiomQuestion();
    }
}

// Expose to window for logic.js
window.loadIdiomsQuiz = loadIdiomsQuiz;
window.initIdiomsQuiz = initIdiomsQuiz;
