1. **Update `types.ts`:**
   Add `isLogoutEnabled?: boolean;` to the `SystemSettings` interface to store the setting globally.

2. **Update `components/AdminDashboard.tsx`:**
   Add a toggle in the settings tab (maybe under App Settings or General Settings) that modifies `localSettings.isLogoutEnabled`. Give the admin the ability to turn the feature on or off.

3. **Update `components/StudentDashboard.tsx`:**
   Only render the "Logout" button if `settings?.isLogoutEnabled` is true, or if `settings?.isLogoutEnabled` is strictly undefined (to default to true if the property isn't set yet). For admins or impersonators, always show it, or check the logic. The user request says "Logout ka futur dalo logout on off admin kar sakega", meaning Admin should be able to turn on/off the logout button in the student app. So, we'll conditionally render the logout button based on `settings?.isLogoutEnabled !== false` (meaning it's enabled by default).

4. **Update `App.tsx` (if needed) for any other logout buttons:**
   Check if there are other student-facing logout buttons (like in a sidebar or profile menu) that need conditional rendering based on this setting. There doesn't appear to be one in the sidebar directly based on the file content unless we just checked `App.tsx`.

5. **Pre-commit steps:**
   Run pre-commit instructions.
