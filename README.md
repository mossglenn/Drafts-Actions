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
- 🔒 **Secure**: Uses Drafts’ Credential system to store your Atlassian username and API token securely

---

## 📋 Requirements

- **Drafts app** (macOS or iOS)
- **Jira Cloud account**
- **Jira API Token** (🚫 not your password) — [Get one here](https://id.atlassian.com/manage-profile/security/api-tokens)

---

## 🔧 Setup Instructions

1. **Install the Action** into Drafts.
2. **Complete Required Settings**:
   - The Jira Cloud domain (e.g., 'yourdomain.atlassian.net')
   - The Jira Project Key (e.g., 'YJK')
3. **Update Optional Settings**
4. **First run**:  
   The Action will prompt you to securely enter your:
   - Jira Email Address
   - Jira API Token
   Drafts will remember them securely for future use.
5. **Create a Draft** with the content you want.
6. **Run the Action** (keyboard shortcut recommended).
---

## 🏗️ How It Works

- Captures the first line of the Draft as the **Summary** (title).
- Converts remaining lines into a plain text  **Description**:
- Adds optional labels:
  - **Draft tags**
  - **Customizable Jira label**
- **Adds link to new Jira issue at the top of the Draft.


## ⚙️ Configuration

You can adjust the Action’s behavior by editing the following **settings**:
| Setting | instructions |
|---|---|
| Issue Type | The name of any *Task-level* type of issue existing in the target Jira project (for example: `'Bug'`, `'Story'` or a custom type like `'Drafts'` ) <p><p>\[Note: types like `'Epic'` and `'Subtask'` are *untested*\] |
| Include Tags as Labels | All tags on the current draft are included in the new Jira issue as labels. Draft tags are made Jira-safe with conversion to lowercase with no spaces (for example: 'My Tag' becomes 'my-tag'). <p><p>Even when this setting is deactivated, you can **still include the label** from 'Custom Jira Label' setting. |
| Include Jira Label | Add a label to the new Jira issue's labels. Label is taken from the 'Custom Jira Label' setting. |
| Custom Jira Label | Any **Jira-safe** label text added to the new Jira issue's labels. To not include this label, deactivate the 'Include Jira Label' setting. This setting does not interact with the 'Include Tags as Labels' setting. |

#### Credential Name
Inside the script, you can configure the name of the Credential containing your email and token by changing the CREDENTIAL_NAME constant. The default name is 'frictionless-to-Jira'. 
```javascript
// ===== USER SETTINGS =====
const CREDENTIAL_NAME = 'frictionless-to-jira'; //name of credential with email, and token
```
---

## 🛡️ Securing Secret Information

When communication with Jira Cloud, Frictionless-to-Jira collects:
- **Email** of Atlassian user
- **Token** of Atlassian user

This information is stored securely in Drafts Credentials. Once saved, you don't have to enter it again unless you manually forget the Credential.

#### Removing or Changing Credentials
Drafts does not let you view or edit saved Credentials directly. To update your Atlassian credentials:
1) Open Drafts Preferences > Credentials.
2) Look for the Credential named 'frictionless-to-jira' (or your customized CREDENTIAL_NAME).
3) Click `forget` to delete it.

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
