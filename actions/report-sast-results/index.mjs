import { summary, getInput } from "@actions/core";
import { issue, issueCommand } from "@actions/core/lib/command.js";
import fs from "node:fs";

const semgrepResultToTable = (results) => {
  return [
    [
      "issue",
      "category",
      "confidence",
      "impact",
      "likelihood",
      "shortlink",
    ].map((data) => ({ data, header: true })),
    ...results.map((result) => [
      result.extra.message,
      result.extra.metadata.category,
      result.extra.metadata.confidence,
      result.extra.metadata.impact,
      result.extra.metadata.likelihood,
      `<a href="${result.extra.metadata.shortlink}">${result.extra.metadata.shortlink}</a>`,
    ]),
  ];
};

const reportOn = (semgrepJson) => {
  issue("group", "Semgrep SAST");
  for (const error of semgrepJson.errors ?? []) {
    issueCommand(
      "error",
      {
        file: error.path,
        line: error.spans[0].start.line,
        endLine: error.spans[0].end.line,
        col: error.spans[0].start.col,
        endCol: error.spans[0].end.col,
      },
      error.message
    );
  }
  for (const error of semgrepJson.results ?? []) {
    issueCommand(
      "error",
      {
        file: error.path,
        line: error.start.line,
        endLine: error.end.line,
        col: error.start.col,
        endCol: error.end.col,
      },
      error.extra.message
    );
  }
  issue("endgroup");
  summary.addHeading("Issues found");
  summary.addTable(semgrepResultToTable(semgrepJson.results ?? []));
  summary.write();
};

const loadSemgrepResult = (fileName) => {
  const content = fs.readFileSync(fileName ?? "report.json", {
    encoding: "utf-8",
  });
  return JSON.parse(content);
};

const main = () => {
  const fileName = getInput("result-path");
  const semgrepResult = loadSemgrepResult(fileName);
  reportOn(semgrepResult);
};

main();
