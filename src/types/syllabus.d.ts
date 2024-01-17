type Theory = {
    unit: number;
    topics: string[];
};

type Lab = {
    experiment: number;
    aim: {
        objective: string;
        steps: string[];
        externalLinks?: string;
    };
};

type Syllabus = {
    _id?: string;
    subject?: string;
    dept?: string[];
    theorypapercode?: string | null;
    labpapercode?: string | null;
    theorycredits?: number | null;
    labcredits?: number | null;
    theory?: Theory[];
    units?: Theory[];
    lab?: Lab[];
    camel?: string;
    book?: string;
    pYq?: string;
    practical?: string;
};
