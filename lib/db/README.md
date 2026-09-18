# Database Adapters

Finger.Farm uses the **Repository Pattern** to completely decouple the application logic from any specific database engine. 

Out of the box, `finger.farm` ships with adapters for:
- SQLite (Default)
- PostgreSQL
- MySQL / MariaDB
- MongoDB
- Supabase
- Redis
- Firebase

## Writing a Custom Adapter

If you want to support a database engine that isn't listed above, you can easily write your own adapter.

1. Create a new file in this directory (e.g., `myDbAdapter.js`).
2. Export an object containing all of the required asynchronous methods listed in the interface below.
3. Open `../connection.js` and add an `else if (process.env.DB_TYPE === 'mydb')` block to load your new adapter.

### The Adapter Interface

Every database adapter must export the following asynchronous functions. You can reference `sqliteAdapter.js` to see exactly how these are implemented in SQL.

#### Read Methods

* `getUserByUsername(username)`
  * **Returns:** A `User` object (or null).
* `getUserById(id)`
  * **Returns:** A `User` object (or null).
* `getUserByExtId(ext_id, authsource)`
  * **Purpose:** Used during OAuth login to find an existing user by their provider ID.
  * **Returns:** A `User` object (or null).
* `getRecentUsers(limit)`
  * **Returns:** An array of the most recently updated `User` objects.
* `getUserCount()`
  * **Returns:** An integer representing the total number of registered users.
* `getUserByToken(username, token)`
  * **Purpose:** Used for API authentication.
  * **Returns:** A `User` object if the token matches the username, otherwise null.

#### Write Methods

* `createUser(user)`
  * **Parameters:** `user` object containing `displayname`, `ext_id`, `token`, and `authsource`.
  * **Returns:** The newly inserted user's ID.
* `updateUsername(id, newUsername)`
  * **Purpose:** Updates a user's unique username.
* `updateToken(id, newToken)`
  * **Purpose:** Regenerates a user's API token.
* `updateProfile(id, displayname, plan, project)`
  * **Purpose:** Updates the core profile fields. Updates the `lastupdate` timestamp.
* `updateProjectByToken(username, token, project)`
  * **Purpose:** API method to update the `.project` file equivalent.
* `updatePlanByToken(username, token, plan)`
  * **Purpose:** API method to update the `.plan` file equivalent.

### The User Object

When returning a user from the read methods, it should generally follow this schema:
```json
{
  "id": 123,
  "username": "jroig",
  "displayname": "Jonathan",
  "plan": "My current plan...",
  "project": "My current project...",
  "lastupdate": "2026-09-13T12:00:00Z",
  "ext_id": "123456789",
  "authsource": "github",
  "token": "a_long_random_string"
}
```
