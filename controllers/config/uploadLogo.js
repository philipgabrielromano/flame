const asyncWrapper = require('../../middleware/asyncWrapper');
const loadConfig = require('../../utils/loadConfig');
const { writeFile } = require('fs/promises');
const { unlink } = require('fs/promises');
const { join } = require('path');

const uploadLogo = asyncWrapper(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      data: 'No file uploaded or file type not supported',
    });
  }

  const config = await loadConfig();

  if (config.customLogo) {
    const oldPath = join(__dirname, '../../data/uploads', config.customLogo);
    try {
      await unlink(oldPath);
    } catch (e) {}
  }

  config.customLogo = req.file.filename;
  await writeFile('data/config.json', JSON.stringify(config));

  res.status(200).json({
    success: true,
    data: config,
  });
});

module.exports = uploadLogo;
