const asyncWrapper = require('../../middleware/asyncWrapper');
const loadConfig = require('../../utils/loadConfig');
const { writeFile } = require('fs/promises');
const { unlink } = require('fs/promises');
const { join } = require('path');

const deleteLogo = asyncWrapper(async (req, res, next) => {
  const config = await loadConfig();

  if (config.customLogo) {
    const logoPath = join(__dirname, '../../data/uploads', config.customLogo);
    try {
      await unlink(logoPath);
    } catch (e) {}
  }

  config.customLogo = '';
  await writeFile('data/config.json', JSON.stringify(config));

  res.status(200).json({
    success: true,
    data: config,
  });
});

module.exports = deleteLogo;
