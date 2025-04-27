/* This script creates a new Jira issue using the Jira REST API. The new issue is created based on the current draft content.
 * The script requires the following configured values:
 * - jiraDomain: The Jira domain (e.g., yourcompany.atlassian.net)
 * - jiraProjectKey: The Jira project key (e.g., PROJ)
 * - jiraIssueType: The Jira issue type (e.g., Task, Bug)
 * - includeTagsAsLabels: Whether to include draft tags as Jira labels (default: true)
 * - includeJiraLabel: Whether to include a specific Jira label (default: true)
 * - jiraLabel: The specific Jira label to include (default: 'sent-from-drafts')
 * The script also requires a credential named CREDENTIAL_NAME, which can be reset below. The credential includes:
 * - email: The email address of the Jira user
 * - token: The API token for the Jira user
 * After the new Jira issue is created, the script will prepend teh draft with the Markdown link to the new issue.
 */

// ===== User Settings =====
const CREDENTIAL_NAME = 'frictionless-to-jira'; //name of credential with email, and token
// ========================

const settings = getConfiguredValues();

const jira = {};
// Use current draft content to construct Jira Issue fields
const lines = draft.content.trim().split('\n');
jira.summary = lines[0] || 'Untitled';
jira.description = makeAdfDescription(lines.slice(1));
jira.labels = getJiraLabels(draft.tags);

const req = {};
//construct request values
req.url = `https://${settings.domain}/rest/api/3/issue`;
req.cred = getCredentials();
req.payloadBody = {
  fields: {
    project: { key: settings.projectKey },
    issuetype: { name: settings.issueType },
    summary: jira.summary,
    description: jira.description,
    labels: jira.labels,
  },
};

// Make headers for Basic auth
req.headers = {
  Authorization:
    'Basic ' + Base64.encode(`${req.cred.email}:${req.cred.token}`),
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

//see request in consol for debugging
console.log('Request headers:');
console.log(JSON.stringify(req.headers, null, 2));
console.log('Request body:');
console.log(JSON.stringify(payloadBody, null, 2));

// Make a POST request to the JIRA API to create a new issue
const http = HTTP.create();
const response = http.request({
  method: 'POST',
  url: req.url,
  headers: req.headers,
  data: req.payloadBody,
  timeout: 30.0,
});

// Log the API response for debugging
console.log(
  'JIRA API Response: ' + response.statusCode + ' -- ' + response.responseText,
);

// Handle response
if (response.statusCode === 403) {
  context.fail(
    'Access denied. Check your Jira permissions. Forget credentials and rerun.',
  );
} else if (response.statusCode === 400) {
  context.fail('Bad request. Check project key or required fields.');
} else if (response.success && response.statusCode == 201) {
  const r = JSON.parse(response.responseText);

  // Update draft with the created issue URL
  draft.prepend(`Jira Key: (${r.key})[${r.self}]`, '\n\n');
  draft.update();

  app.displaySuccessMessage('Created ' + r.key + ' in JIRA');
  app.setClipboard(`${r.self}`);
} else {
  app.displayErrorMessage(
    'Failed to create JIRA ticket. Check the console for details.',
  );
  context.fail('ERROR ' + response.statusCode + ' ' + response.responseText);
}

//====== functions ======== //

//get Configured Values
function getConfiguredValues() {
  const s = {};
  s.jiraDomain = context.getConfiguredValue('jiraDomain')
    ? context.getConfiguredValue('jiraDomain')
    : null;
  s.jiraProjectKey = context.getConfiguredValue('jiraProjectKey')
    ? context.getConfiguredValue('jiraProjectKey')
    : null;
  s.jiraIssueType = context.getConfiguredValue('jiraIssueType')
    ? context.getConfiguredValue('jiraIssueType')
    : 'Task';
  s.includeTagsAsLabels = context.getConfiguredValue('includeTagsAsLabels')
    ? context.getConfiguredValue('includeTagsAsLabels')
    : true;
  s.includeJiraLabel = context.getConfiguredValue('includeJiraLabel')
    ? context.getConfiguredValue('includeJiraLabel')
    : true;
  s.jiraLabel = context.getConfiguredValue('jiraLabel')
    ? context.getConfiguredValue('jiraLabel')
    : 'sent-from-drafts';

  if (!s.jiraDomain || !s.jiraProjectKey) {
    context.fail('Missing JIRA domain or project key.');
  }
  return s;
}
// credentials user email, and Atlassian token
function getCredentials() {
  const c = Credential.create(
    CREDENTIAL_NAME,
    'JIRA credentials for ad hoc API calls using an email, and a token',
  );
  c.addTextField('email', 'Email Address');
  c.addPasswordField('token', 'API Token');
  c.authorize(); // This will prompt if not already saved
  if (c) {
    return {
      email: c.getValue('email'),
      token: c.getValue('token'),
    };
  } else {
    context.fail('Failed to get credentials');
  }
}

//turn text lines into jira description with Atlassian Document Format (ADF)
function makeAdfDescription(lines) {
  const descriptionBody = lines.slice(1).join('\n') || 'No description.';
  return {
    type: 'doc',
    version: 1,
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: descriptionBody,
          },
        ],
      },
    ],
  };
}

// if set, convert draft tags to Jira-safe labels and add Jira label
function getJiraLabels(draftTags) {
  let labels = [];
  if (settings.includeTagsAsLabels) {
    const tagLabels = draftTags.map((l) =>
      l.toLowerCase().replace(/\s+/g, '-'),
    );
    labels = labels.concat(tagLabels);
  }

  if (settings.includeJiraLabel) {
    labels = labels.concat(
      settings.jiraLabel.toLowerCase().replace(/\s+/g, '-'),
    );
  }
  return labels;
}
