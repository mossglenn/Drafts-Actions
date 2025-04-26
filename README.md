# 🚅 Frictionless-to-Jira

> **Quickly capture ideas, tasks, and notes from Drafts into Jira — without breaking your flow.**  
> Designed for fast thought capture, not complex formatting.

---

## ✨ What This Action Does

**Frictionless-to-Jira** takes the current Draft and creates a new Jira issue using the first line as the **Summary** and the remaining text as the **Description**.

- 🎟️ **First line** = Jira Summary (title)
- 📄 **Remaining lines** = Jira Description (formatted in Atlassian Document Format [ADF])
- 🏷️ **Optional**: Draft tags can be automatically added as Jira labels
- 🚀 **Fast and frictionless**: No formatting required — just type and send (bonus points for adding a ⏩️ keyboard shortcut)
- 🔒 **Secure**: Uses Drafts’ Credential system to store your Jira API token securely
- 🧼 **Self-Cleaning**: Add a tag to the Draft and archive (customizable)

---

## 📋 Requirements

- **Drafts app** (macOS or iOS)
- **Jira Cloud account**
- **Jira API Token** (🚫 not your password) — [Get one here](https://id.atlassian.com/manage-profile/security/api-tokens)

---

## 🔧 Setup Instructions

1. **Install the Action** into Drafts.
2. **First run**:  
   The Action will prompt you to securely enter your:
   - Jira Project URL (e.g., `https://yourdomain.atlassian.net/jira/core/projects/KEY/summary`)
   - Jira Email Address
   - Jira API Token
3. **Optional fallback**:  
   If your Project URL cannot be parsed automatically, it will prompt for:
   - Jira Domain (e.g., `yourdomain.atlassian.net`)
   - Jira Project Key (e.g., `AG`)
4. **Save credentials** when prompted.  
   Drafts will remember them securely for future use.
5. **Create a Draft** with the content you want.
6. **Run the Action** (keyboard shortcut recommended).
---

## 🏗️ How It Works

- Captures the first line of the Draft as the **Summary** (title).
- Converts remaining lines into a plain text  **Description**:
- Adds optional labels:
  - **Draft tags**
  - **Custom "sent-from-drafts" label** (configurable)
- Updates the Draft: (configurable)
   - **Adds a link** to the newly created Jira issue
   - **Add 'sent-to-jira' tag**
   - **Archive Draft**



## ⚙️ Configuration

You can adjust the Action’s behavior by editing the **user settings** at the top of the script:

```javascript
// ===== USER SETTINGS =====
const DEFAULT_ISSUE_TYPE = 'Task'; // Change to "Bug", "Story", etc.
const INCLUDE_TAGS_AS_LABELS = true; // Set false to disable adding Draft tags as Jira labels
const SENT_FROM_DRAFTS_LABEL = 'send-from-drafts'; // Change text or set to false to disable adding a "sent-from-drafts" label
const TAG_AFTER_SEND = 'sent-to-jira'; // change text or set to false to disable adding a tag after sending
const ARCHIVE_AFTER_SEND = true; // Set false to disable moving the Draft to Archive
```

| CONST | instructions |
|---|---|
| DEFAULT_ISSUE_TYPE | Set to the `string` name of any Task-level type of issue existing in the target Jira project (for example: `'Bug'`, `'Story'` ) \[Note: `'Epic'` and `'Subtask'` are *untested*\] |
| INCLUDE_TAGS_AS_LABELS | Set to `true` to copy all the tags in the Draft into the new Jira issue. Draft tags are converted to lowercase with no spaces to make them Jira-safe (for example: 'My Tag' becomes 'my-tag'). <br />Set to `false` to not include Draft tags as Jira labels, but you can **still include the label set in SENT_FROM_DRAFTS_LABEL.** |
| SENT_FROM_DRAFTS_LABEL | Set to any **Jira-safe** `string` to include that as a label in the new Jira issue **even if INCLUDE_TAGS_AS_LABELS is `false`**. <br /> Set to `false` to not include this label, but **does not prevent Draft tags from being included** in the new Jira issue with INCLUDE_TAGS_AS_LABELS.|
| TAG_AFTER_SEND | Set to any Draft-safe `string` to add that tag to the Draft. <br /> Set to `false` to not add any new tag to the Draft. |
| ARCHIVE_AFTER_SEND | Set to `true` to automatically send the Draft to the Drafts Archive as soon as the new Jira issue is created. <br />Set to `false` to keep the Draft where it is.|
| MAIN_CREDENTIAL_NAME<br />ALT_CREDENTIAL_NAME | Set to any `string` to name the credentials set for this Action. Included in case of conflicts with other Drafts credentials.<br />ALT_CREDENTIAL_NAME is only used when necessary, so it may not appear in your Drafts Credentials list.<br >**If you need to forget credentials for this Action, make sure to look for BOTH credentials to forget.**


---


## 🛡️ Securing Secret Information

When communication with Jira Cloud, Frictionless-to-Jira collects *some or all* of the following information:
- **URL** of the target Jira project
- **Email** of Atlassian user
- **Token** of Atlassian user
- **Domain** of your Jira Cloud
- **Project Key** of the target Jira project

This information is stored securely in Drafts Credentials. Once saved, you don't have to enter it again unless you manually forget the Credential.

## ☠️ Removing and Forgetting Secret Information
Drafts does not let you view or edit saved Credentials directly. To update your Jira credentials:
1) Open Drafts Preferences > Credentials.
2) Look for the Credential named 'jira-basic-auth' (or your customized MAIN_CREDENTIAL_NAME).
3) Click `forget` to delete it.
4) Look for the Credential named 'jira-domain-and-project' (or your ALT_CREDENTIAL_NAME) and forget it **if it exists**. Frictionless-to-Jira doesn't create this second credential often, but check for it. 

Drafts will ask you for new information the next time the Action runs.


## 🧱 Known Limitations

- Designed for **speed-first** capture — not full Markdown parsing or complex formatting.
- Draft formatting (like bold, italics) is not translated into Jira formatting.
- If you switch Jira servers or projects, you must **manually forget saved credentials.**


---

## 💬 Feedback and Contributions

- Open an Issue or Pull Request if you have suggestions or improvements!
- This Action prioritizes speed, simplicity, and usability over full formatting support.

---

## 📜 License

MIT License.  
Use freely, modify freely, just give a little credit if you share. ❤️

---

# 📥 Quick Install (if published)

> [Install Frictionless-to-Jira →](#)  

---
