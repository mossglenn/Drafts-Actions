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
  - **Draft tags** (excluding `send-to-jira`)
  - **Custom "sent-from-drafts" label** (configurable)

---

## ⚙️ Configuration

You can adjust the Action’s behavior by editing the **user settings** at the top of the script:

```javascript
const DEFAULT_ISSUE_TYPE = 'Task'; // Change to "Bug", "Story", etc.
const INCLUDE_TAGS_AS_LABELS = true; // Set false to disable adding Draft tags as Jira labels
const SENT_FROM_DRAFTS_LABEL = 'send-from-drafts'; // Set to false to disable adding a "sent-from-drafts" label
```

✅ These settings make it easy to personalize without touching the core logic.

---

## 🛡️ Known Limitations

- Designed for **speed-first** capture — not full Markdown support.
- Formatting is not parsed - will show up in Jira issue description unfromatted.
- If you switch Jira servers/projects, you will need to **forget saved credentials** manually via Drafts Preferences > Credentials.

---

## 💬 Feedback and Contributions

- Open an Issue or Pull Request if you have suggestions or improvements!
- This Action is designed to super-fast, frictionless, and easy to use so simplicity and speed are prioritized.

---

## 📜 License

MIT License.  
Use freely, modify freely, just give a little credit if you share. ❤️

---

# 📥 Quick Install (if published)

> [Install Frictionless-to-Jira →](#)  

---
