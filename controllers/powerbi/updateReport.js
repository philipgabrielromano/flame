const asyncWrapper = require('../../middleware/asyncWrapper');
const { readFile, writeFile } = require('fs/promises');

const updateReport = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { name, embedUrl } = req.body;

  const reports = JSON.parse(await readFile('data/powerbi.json', 'utf-8'));

  const idx = reports.findIndex((r) => r.id === id);

  if (idx === -1) {
    return res.status(404).json({
      success: false,
      data: 'Report not found',
    });
  }

  reports[idx] = { ...reports[idx], name, embedUrl };
  await writeFile('data/powerbi.json', JSON.stringify(reports));

  res.status(200).json({
    success: true,
    data: reports,
  });
});

module.exports = updateReport;
