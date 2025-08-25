const core = require('@actions/core');
const axios = require('axios');

async function run() {
  try {
    const version     = core.getInput('version', { required: true });
    const system      = core.getInput('system', { required: true });
    const environment = core.getInput('environment', { required: true });
    const appId       = core.getInput('app_id', { required: true });
    const appKey      = core.getInput('app_key', { required: true });
    const baseUrl     = core.getInput('enov8_url', { required: true });

    core.setSecret(appId);
    core.setSecret(appKey);

    const url = `${baseUrl.replace(/\/$/, '')}/api/environmentinstance`;

    const payload = {
      System: system,
      Environment: environment,
      Version: version
    };

    const headers = {
      'app-id': appId,
      'app-key': appKey,
      'Content-Type': 'application/json'
    };

    const response = await axios.put(url, payload, { headers });

    core.info(`✅ Enov8 API responded: ${response.status}`);
    if (response.data) {
      core.info(`Response body: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    if (error.response) {
      core.setFailed(`❌ API Error: ${error.response.status} ${error.response.statusText}`);
      core.error(`Response body: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      core.setFailed('❌ No response from Enov8 API.');
      core.error(error.request);
    } else {
      core.setFailed(`❌ Request setup error: ${error.message}`);
    }
  }
}

run();
