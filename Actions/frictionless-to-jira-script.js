// ===== USER SETTINGS =====
const DEFAULT_ISSUE_TYPE = 'Task'; // Change to "Bug", "Story", etc.
const INCLUDE_TAGS_AS_LABELS = true; // <-- set this to false to not include draft tags in Jira labels
const SENT_FROM_DRAFTS_LABEL = 'send-from-drafts'; // <-- change label or set to false to disable

const MAIN_CREDENTIAL_NAME = 'jira-basic-auth'; //used when URL cannot be parsed
const ALT_CREDENTIAL_NAME = 'jira-domain-and-project'; //used when URL cannot be parsed
// =========================

// ===== Future Possibilities ===== //
/* 
-Multi-level headings (##, ###)
-grouped bullet/numbered lists
-block quotes
-basic rich text formatting 
*/
//===================

// collect JIRA API settings and construct API endpoint
let jira = getJiraSettings();
const apiURL = `https://${jira.domain}/rest/api/3/issue`;

// Use current draft content to construct Jira Issue fields
let lines = draft.content.trim().split('\n');

// The first line is the summary (or title) of the JIRA ticket
jira.summary = lines[0] || 'Untitled';

// Remaining lines are used to construct the Atlassian Document Format (ADF) for the description
// TODO: use Atlassian library to better include emoji, unicode, etc.
const descriptionBody = lines.slice(1).join('\n') || 'No description.';
jira.description = {
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

// Construct the fields object for the JIRA API request
let payloadBody = {
  fields: {
    project: { key: jira.projectKey },
    issuetype: { name: DEFAULT_ISSUE_TYPE },
    summary: jira.summary,
    description: jira.description,
  },
};
jira.labels = getJiraLabels();
if (jira.labels) {
  payloadBody.fields.labels = jira.labels;
}

// Make headers for Basic auth
let authString = `${jira.email}:${jira.token}`;
let authCode = 'Basic ' + Base64.encode(authString);
let apiHeaders = {
  Authorization: authCode,
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

//see payload in consol for debugging
console.log('Request body:');
console.log(JSON.stringify(payloadBody, null, 2));

// Make a POST request to the JIRA API to create a new issue
let http = HTTP.create();
let response = http.request({
  method: 'POST',
  url: apiURL,
  headers: apiHeaders,
  data: payloadBody,
  timeout: 30.0,
});

// Log the API response for debugging
console.log(
  'JIRA API Response: ' + response.statusCode + ' -- ' + response.responseText,
);

// Handle response
if (response.statusCode === 403) {
  context.fail('Access denied. Check your Jira permissions');
} else if (response.statusCode === 400) {
  context.fail('Bad request. Check project key or required fields.');
} else if (response.success && response.statusCode == 201) {
  let r = JSON.parse(response.responseText);
  let ticketURL = `https://${jira.domain}/browse/${r.key}`;

  // Update draft with the created ticket URL
  let t = `${r.key} // ${title} // ${ticketURL}`;
  draft.content = t + '\n\n' + draft.content;
  draft.update();

  app.displaySuccessMessage('Created ' + r.key + ' in JIRA');
  app.setClipboard(ticketURL);
} else {
  app.displayErrorMessage(
    'Failed to create JIRA ticket. Check the console for details.',
  );
  context.fail('ERROR ' + response.statusCode + ' ' + response.responseText);
}
console.log(
  `Reminder: If you have changed Jira servers, you will need forget TWO credentials: go to Drafts Preferences > Credentials and select forget next to credentials named ${MAIN_CREDENTIAL_NAME} and ${ALT_CREDENTIAL_NAME}.`,
);

//====== functions ======== //

//collect JIRA API values from credentials (two if necessary)
function getJiraSettings() {
  let mainCred = getMainCredentials();
  let settings = {
    email: mainCred.getValue('email'),
    token: mainCred.getValue('token'),
    url: mainCred.getValue('projectURL'),
  };

  let parsed = parseJiraProjectURL(settings.url);
  if (parsed) {
    settings.domain = parsed.domain;
    settings.projectKey = parsed.projectKey;
  } else {
    let altCred = getAltCredentials();
    settings.domain = altCred.getValue('domain');
    settings.projectKey = altCred.getValue('projectKey');
  }

  if (
    !settings.domain ||
    !settings.projectKey ||
    !settings.email ||
    !settings.token
  ) {
    console.log('Something went wrong:', JSON.stringify(settings, null, 2));
    context.fail('Incomplete Jira settings.');
  }

  return settings;
}

//parse url to get JIRA domain and Project Key
function parseJiraProjectURL(url) {
  let matches = url.match(
    /^https:\/\/([^.]+\.atlassian\.net)\/jira\/[^\/]+\/projects\/([A-Z0-9]+)\b/i,
  );
  if (!matches) return null;

  return {
    domain: matches[1],
    projectKey: matches[2],
  };
}

// main credentials include JIRA project url, user email, and Atlassian token
function getMainCredentials() {
  let main_c = Credential.create(
    MAIN_CREDENTIAL_NAME,
    'JIRA credentials for ad hoc API calls using a URL, an email, and a token',
  );
  main_c.addURLField('projectURL', 'Jira Project URL');
  main_c.addTextField('email', 'Email Address');
  main_c.addPasswordField('token', 'API Token');
  main_c.authorize(); // This will prompt if not already saved
  return main_c;
}

// alternative credentials include JIRA Cloud domain and Project Key; used only when url parsing fails
function getAltCredentials() {
  let alt_c = Credential.create(
    ALT_CREDENTIAL_NAME,
    'JIRA credentials for ad hoc API calls using a domain and a project key',
  );
  alt_c.addTextField('domain', 'Jira Domain (e.g., example.atlassian.net)');
  alt_c.addTextField('projectKey', 'Jira Project Key (e.g., MKY)');
  alt_c.authorize(); // This will prompt if not already saved
  return alt_c;
}

function getJiraLabels() {
  let labels = [];
  // Convert draft tags to Jira-safe labels (skipping internal use tag)
  if (INCLUDE_TAGS_AS_LABELS) {
    let tags = draft.tags;
    let tagLabels = tags.filter((t) => t !== 'send-to-jira');
    tagLabels = tagLabels.map((l) => l.toLowerCase().replace(/\s+/g, '-'));
    labels = labels.concat(tagLabels);
  }

  if (SENT_FROM_DRAFTS_LABEL) {
    labels = labels.concat(
      SENT_FROM_DRAFTS_LABEL.toLowerCase().replace(/\s+/g, '-'),
    );
  }
  return labels;
}
