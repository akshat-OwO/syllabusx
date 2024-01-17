#!/usr/bin/env node

import * as p from "@clack/prompts";
import { AxiosError } from "axios";
import color from "picocolors";
import { bcaSemesterList, branchList, semesterList } from "./config.js";
import {
    getExperiments,
    getSubjectDetail,
    getSubjectList,
    getTheoryTopics,
    getUnits,
} from "./utils/actions.js";

async function main() {
    console.clear();

    let exit = false;
    let back = false;
    p.intro(`${color.bgCyan(color.black(" SyllabusX "))}`);

    while (!exit) {
        const search = await p.group(
            {
                course: () =>
                    p.select({
                        message: "Select course",
                        initialValue: "btech",
                        options: [
                            { value: "btech", label: "B.Tech" },
                            { value: "bca", label: "BCA" },
                        ],
                    }),
                semester: ({ results }) =>
                    p.select({
                        message: "Select semester",
                        initialValue: "firstsemesters",
                        options:
                            results.course === "btech"
                                ? semesterList
                                : bcaSemesterList,
                    }),
                branch: ({ results }) => {
                    if (results.course === "btech") {
                        return p.select({
                            message: "Select branch",
                            initialValue: "CSE",
                            options: branchList,
                        });
                    }
                },
                subject: async ({ results }) => {
                    try {
                        const subjectList = await getSubjectList({
                            course: results.course,
                            branch: results.branch,
                            semester: results.semester,
                        });
                        return p.select({
                            message: "Select subject",
                            initialValue: subjectList[0].value,
                            options: subjectList,
                        });
                    } catch (error) {
                        if (error instanceof AxiosError) {
                            p.cancel(error.message);
                        } else {
                            p.cancel("Something went wrong");
                        }
                    }
                },
            },
            {
                onCancel: () => {
                    exit = true;
                    p.cancel("Operation cancelled.");
                },
            }
        );

        const subjectDetails = await getSubjectDetail({
            branch: search.branch,
            course: search.course,
            semester: search.semester,
            subject: search.subject,
        });

        const section =
            subjectDetails.lab && subjectDetails.lab.length
                ? [
                      { value: "theory", label: "Theory" },
                      { value: "lab", label: "Lab" },
                  ]
                : [{ value: "theory", label: "Theory" }];

        while (!back) {
            const syllabus = await p.group(
                {
                    section: () => {
                        return p.select({
                            message: "Select section",
                            initialValue: "theory",
                            options: section,
                        });
                    },
                    unit: ({ results }) => {
                        if (results.section === "theory") {
                            return p.select({
                                message: "Select Unit",
                                initialValue: 1,
                                options: getUnits({
                                    course: search.course,
                                    subjectDetails,
                                }),
                            });
                        }
                    },
                    topics: ({ results }) => {
                        if (results.section === "theory" && results.unit) {
                            return p.multiselect({
                                message: `Unit ${results.unit}`,
                                options: getTheoryTopics({
                                    course: search.course,
                                    subjectDetails,
                                    unit: results.unit as number,
                                }),
                                required: false,
                            });
                        }
                    },
                    experiment: ({ results }) => {
                        if (
                            results.section === "lab" &&
                            subjectDetails.lab?.length
                        ) {
                            return p.select({
                                message: "Select Experiment",
                                initialValue: 1,
                                options: getExperiments({ subjectDetails }),
                            });
                        }
                    },
                },
                {
                    onCancel: () => {
                        p.cancel("Going back");
                        back = true;
                    },
                }
            );
        }
    }
}

main();
