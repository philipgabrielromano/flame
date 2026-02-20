const asyncWrapper = require('../../middleware/asyncWrapper');
const { readFile, writeFile } = require('fs/promises');
const checkFileExists = require('../../utils/checkFileExists');

const addReport = asyncWrapper(async (req, res, next) => {
  const { name, embedUrl } = req.body;

  const exists = await checkFileExists('data/powerbi.json');

  if (!exists) {
    await writeFile('data/powerbi.json', JSON.stringify([]));
  }

  const reports = JSON.parse(await readFile('data/powerbi.json', 'utf-8'));

  const newReport = {
    id: Date.now().toString(),
    name,
    embedUrl,
  };

  reports.push(newReport);
  await writeFile('data/powerbi.json', JSON.stringify(reports));

  res.status(201).json({
    success: true,
    data: reports,
  });
});

module.exports = addReport;
