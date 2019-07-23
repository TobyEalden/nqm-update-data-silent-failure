"use strict";
const TDXApi = require("@nqminds/nqm-api-tdx");
const {LoremIpsum} = require("lorem-ipsum");
const shortId = require("shortid").generate;
const _ = require("lodash");
const log = require("debug")("nqm:test-silent-failure");

function buildTestData(count) {
  const lorem = new LoremIpsum({
    sentencesPerParagraph: {max: 8, min: 4},
    wordsPerSentence: {max: 16, min: 4},
  });

  const testData = [];
  for (let i = 0; i < count; i++) {
    testData.push({id: shortId(), sentence: lorem.generateSentences(1), value: i});
  }
  return testData;
}

const shareKeyId = "";
const shareKeySecret = "";

const api = new TDXApi({tdxServer: "http://tdx.nqm-2.com"});

async function runTest() {
  try {
    await api.authenticate(shareKeyId, shareKeySecret);
    const testData = buildTestData(20000);
    const chunks = _.chunk(testData, 10);
    for (let i = 0; i < chunks.length; i++) {
      await api.updateData("HkllCtc4zB", chunks[i], true);
    }
    const {count} = await api.getDataCount("HkllCtc4zB");
    log(`Attempted to write ${testData.length} documents`);
    log(`Dataset contains ${count} documents`);
  } catch (err) {
    log(err.message);
  }
}

runTest();
