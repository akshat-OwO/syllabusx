import axios, { AxiosResponse } from "axios";

export const getSubjectList = async ({
    course,
    semester,
    branch,
}: {
    course: unknown;
    semester: unknown;
    branch: unknown;
}) => {
    let subjectsList: string[];
    const response = (await axios.get(
        `https://server.syllabusx.live/${course}/${semester}/${
            course === "btech" ? branch : ""
        }`
    )) as AxiosResponse;

    subjectsList = response.data;

    let initialValue: { value: string; label: string }[] = [];

    return subjectsList.reduce((acc, curr) => {
        const option = { value: curr, label: curr };
        return [...acc, option];
    }, initialValue);
};

export const getSubjectDetail = async ({
    course,
    semester,
    branch,
    subject,
}: {
    course: unknown;
    semester: unknown;
    branch: unknown;
    subject: unknown;
}) => {
    const response = (await axios.get(
        `https://server.syllabusx.live/${course}/${semester}${
            course === "btech" ? "/" + branch : ""
        }/${subject}`
    )) as AxiosResponse;
    return response.data[0] as Syllabus;
};

export const getUnits = ({
    course,
    subjectDetails,
}: {
    course: unknown;
    subjectDetails: Syllabus;
}) => {
    let initialValue: { value: number; label: string }[] = [];
    if (course === "btech") {
        return subjectDetails.theory!.reduce((acc, curr) => {
            return [...acc, { value: curr.unit, label: `Unit ${curr.unit}` }];
        }, initialValue);
    } else {
        return subjectDetails.units!.reduce((acc, curr) => {
            return [...acc, { value: curr.unit, label: `Unit ${curr.unit}` }];
        }, initialValue);
    }
};

export const getTheoryTopics = ({
    course,
    unit,
    subjectDetails,
}: {
    course: unknown;
    unit: number;
    subjectDetails: Syllabus;
}) => {
    let initialValue: { value: number; label: string }[] = [];
    if (course === "btech") {
        return subjectDetails.theory![unit - 1].topics.reduce(
            (acc, curr, index) => [...acc, { value: index, label: curr }],
            initialValue
        );
    } else {
        return subjectDetails.units![unit - 1].topics.reduce(
            (acc, curr, index) => [...acc, { value: index, label: curr }],
            initialValue
        );
    }
};

export const getExperiments = ({
    subjectDetails,
}: {
    subjectDetails: Syllabus;
}) => {
    let initialValue: { value: number; label: string }[] = [];

    return subjectDetails.lab!.reduce((acc, curr) => {
        return [
            ...acc,
            {
                value: curr.experiment,
                label: `Experiment ${curr.aim.objective}`,
            },
        ];
    }, initialValue);
};
