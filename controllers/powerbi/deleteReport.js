const asyncWrapper = require('../../middleware/asyncWrapper');
const { readFile, writeFile } = require('fs/promises');

const deleteReport = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const reports = JSON.parse(await readFile('data/powerbi.json', 'utf-8'));

  const filtered = reports.filter((r) => r.id !== id);
  await writeFile('data/powerbi.json', JSON.stringify(filtered));

  res.status(200).json({
    success: true,
    data: filtered,
  });
});

module.exports = deleteReport;
