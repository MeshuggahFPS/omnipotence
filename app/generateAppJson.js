const fs = require('fs');

const packageJson = require('./package.json');

const appJson = {
  name: packageJson.name,
  displayName: packageJson.displayName,
  expo: {
    version: packageJson.version,
    owner: '',
    slug: '',
    extra: {
      eas: {
        projectId: '',
      },
    },
  },
};

fs.writeFileSync('app.json', JSON.stringify(appJson, null, 2));
