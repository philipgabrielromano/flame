const asyncWrapper = require('../../middleware/asyncWrapper');
const { readFile, writeFile } = require('fs/promises');
const checkFileExists = require('../../utils/checkFileExists');

const getReports = asyncWrapper(async (req, res, next) => {
  const exists = await checkFileExists('data/powerbi.json');

  if (!exists) {
    await writeFile('data/powerbi.json', JSON.stringify([]));
  }

  const reports = JSON.parse(await readFile('data/powerbi.json', 'utf-8'));

  res.status(200).json({
    success: true,
    data: reports,
  });
});

module.exports = getReports;
