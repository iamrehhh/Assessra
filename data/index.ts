// Central data index — import all paper data from here
import { businessP3Data, businessP3Papers } from './papers/businessP3';
import { businessP4Data, businessP4Papers } from './papers/businessP4';
import { economicsP4Data, economicsP4Papers } from './papers/economicsP4';
import { economicsP3Data, economicsP3Papers } from './papers/economicsP3';
import { generalPaperData, generalPapers } from './papers/generalPaper';

// Combined lookup map: paperID → paper data (questions + pdf)
export const allPaperData = {
    ...businessP3Data,
    ...businessP4Data,
    ...economicsP4Data,
};

// MCQ data (answer keys only, no questions array)
export const allMCQData = {
    ...economicsP3Data,
};

// General Paper data (essay questions)
export const allGeneralPaperData = {
    ...generalPaperData,
};

// Paper listing metadata grouped by subject-paper key
export const paperListings = {
    'business-p3': businessP3Papers,
    'business-p4': businessP4Papers,
    'economics-p4': economicsP4Papers,
    'economics-p3': economicsP3Papers,
    'general-p1': generalPapers,
    'general-p2': [],
};
