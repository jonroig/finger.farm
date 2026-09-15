# Authentication Providers

Finger.Farm comes pre-wired with support for 14 of the most popular OAuth2 authentication providers. 

Because the configuration is dynamic, **you do not need to modify any code to enable a provider**. The application will automatically detect if a provider's API keys exist in your `.env` file and will instantly render the login button on the homepage and register the required OAuth routes.

## Supported Providers

To enable any of the following providers, simply acquire the OAuth credentials from their respective developer portals and add them to your `.env` file using the exact variable names listed below.

| Provider | Client ID Variable | Client Secret Variable |
| :--- | :--- | :--- |
| **GitHub** | `GITHUB_CLIENT_ID` | `GITHUB_CLIENT_SECRET` |
| **Google** | `GOOGLE_CLIENT_ID` | `GOOGLE_CLIENT_SECRET` |
| **Discord** | `DISCORD_CLIENT_ID` | `DISCORD_CLIENT_SECRET` |
| **GitLab** | `GITLAB_CLIENT_ID` | `GITLAB_CLIENT_SECRET` |
| **Facebook** | `FACEBOOK_CLIENT_ID` | `FACEBOOK_CLIENT_SECRET` |
| **Microsoft** | `MICROSOFT_CLIENT_ID` | `MICROSOFT_CLIENT_SECRET` |
| **LinkedIn** | `LINKEDIN_CLIENT_ID` | `LINKEDIN_CLIENT_SECRET` |
| **Twitch** | `TWITCH_CLIENT_ID` | `TWITCH_CLIENT_SECRET` |
| **Spotify** | `SPOTIFY_CLIENT_ID` | `SPOTIFY_CLIENT_SECRET` |
| **Slack** | `SLACK_CLIENT_ID` | `SLACK_CLIENT_SECRET` |
| **Bitbucket** | `BITBUCKET_CLIENT_ID` | `BITBUCKET_CLIENT_SECRET` |
| **Amazon** | `AMAZON_CLIENT_ID` | `AMAZON_CLIENT_SECRET` |
| **Dropbox** | `DROPBOX_CLIENT_ID` | `DROPBOX_CLIENT_SECRET` |
| **Reddit** | `REDDIT_CLIENT_ID` | `REDDIT_CLIENT_SECRET` |

## Restricting Registration

By default, any user who successfully authenticates via one of the enabled providers will have a new Finger.Farm account automatically provisioned for them.

If you are running a private or personal instance and wish to restrict who can create accounts, you can disable open registration:

1. Add `ALLOW_REGISTRATION=false` to your `.env` file.
2. Restart the server.

When registration is disabled, existing users can continue to log in seamlessly, but new users attempting to authenticate will be politely blocked.

## Adding Custom Providers

If you need a provider that is not included in the default 14:
1. Run `npm install passport-[provider-name]`.
2. Open `auth/strategies.js` and add a new block for your provider following the existing schema.
3. Add your custom environment variables to `.env`.
