/* 👉 Flick-to-Jira
 * The script requires the following configured values:
 * - jiraSiteURL: The Jira Site URL (e.g., yourcompany.atlassian.net)
 * - jiraProjectKey: The Jira project key (e.g., PROJ)
 * - jiraIssueType: The Jira issue type (e.g., Task, Bug)
 * - includeTagsAsLabels: Whether to include draft tags as Jira labels (default: true)
 * - jiraLabels: Comma-separated list of labels to add to the new Jira Issue (default: 'sent-from-drafts')
 * The script also requires a credential named the value of CREDENTIAL_NAME, which can be reset below. The credential includes:
 * - email: The email address of the Jira user
 * - token: The API token for the Jira user
 * After the new Jira issue is created, the script will prepend teh draft with the Markdown link to the new issue.
 */
const CREDENTIAL_NAME = 'flick-to-jira';
// =========================

// =================
// 🧰 Helper Functions
// =================

const makeAdfDescription = (lines) => {
  const text = lines.length ? lines.join('\n') : 'No description.';
  return {
    type: 'doc',
    version: 1,
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: text,
          },
        ],
      },
    ],
  };
};

const normalizeLabel = (label) =>
  label
    .trim()
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

const makeJiraLabels = (oldLabels = [], newLabels = []) => {
  if (typeof newLabels === 'string') {
    newLabels = newLabels.split(',');
  }

  return Array.from(
    new Set([
      ...(oldLabels || []).map(normalizeLabel),
      ...(newLabels || []).map(normalizeLabel),
    ]),
  );
};

const makeFieldsFromDraft = (draft, settings) => {
  const lines = draft.content.trim().split('\n');
  return {
    summary: lines[0] || 'Untitled',
    description: makeAdfDescription(lines.slice(1)),
    labels: settings.includeTagsAsLabels ? makeJiraLabels(draft.tags) : [],
  };
};

// ==================
// 🕹️ Main Control Flow
// ==================
validateSettings(context.configuredValues, ['jiraSiteURL', 'jiraProjectKey']);
const settings = context.configuredValues;

const credentials = getCredentials();

let jira = makeFieldsFromDraft(draft, settings);

jira.labels = makeJiraLabels(jira.labels, settings.jiraLabels);

const response = sendJiraRequest(jira, settings, credentials);

handleJiraResponse(response, jira, settings);

// =========================
// Functions with Side Effects
// =========================

function validateSettings(settings, requiredSettings) {
  for (const key of requiredSettings) {
    if (!settings[key] || settings[key] === 'undefined') {
      context.fail(
        `Missing required setting: ${key}.Please configure this Action's settings.`,
      );
    }
  }
}

// --- Credential Handling ---

function getCredentials() {
  const cred = Credential.create(
    CREDENTIAL_NAME,
    'JIRA credentials: email and API token',
  );
  cred.addTextField('email', 'Email Address');
  cred.addPasswordField('token', 'API Token');
  cred.authorize();

  return {
    email: cred.getValue('email'),
    token: cred.getValue('token'),
  };
}

// --- HTTP Request ---

function sendJiraRequest(jira, settings, credentials) {
  const http = HTTP.create();

  const response = http.request({
    method: 'POST',
    url: `https://${settings.jiraSiteURL}/rest/api/3/issue`,
    headers: {
      Authorization:
        'Basic ' + Base64.encode(`${credentials.email}:${credentials.token}`),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: {
      fields: {
        project: { key: settings.jiraProjectKey },
        issuetype: { name: settings.jiraIssueType },
        summary: jira.summary,
        description: jira.description,
        labels: jira.labels,
      },
    },
    timeout: 30.0,
  });

  console.log(`Response Status: ${response.statusCode || 'No status code'}`);
  console.log(`Response Body: ${response.responseText || 'No response text'}`);
  console.log(
    `Jira API Response: ${response.statusCode} , ${response.responseText}`,
  );
  return response;
}

// --- Response Handler ---

function handleJiraResponse(response, jira, settings) {
  if (response.statusCode === 403) {
    context.fail('Access denied. Check your Jira credentials.');
  } else if (response.statusCode === 400) {
    context.fail('Bad request. Check project key and fields.');
  } else if (response.success && response.statusCode === 201) {
    const r = JSON.parse(response.responseText);

    draft.prepend(
      `Jira Issue: [${r.key}](https://${settings.jiraSiteURL}/browse/${r.key})\n\n`,
    );
    draft.update();

    app.displaySuccessMessage(`Created ${r.key} in Jira`);
    app.setClipboard(`https://${settings.jiraSiteURL}/browse/${r.key}`);
  } else {
    app.displayErrorMessage('Failed to create Jira ticket.');
    context.fail('ERROR ' + response.statusCode + ': ' + response.responseText);
  }
}
