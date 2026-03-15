import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Using a mobile viewport to simulate the app structure properly
        context = await browser.new_context(viewport={"width": 412, "height": 915})
        page = await context.new_page()

        await page.goto("http://localhost:5000")
        await page.evaluate("""() => {
            const now = Date.now();
            const futureDate = new Date(now + 5 * 24 * 60 * 60 * 1000).toISOString();
            const mockUser = {
                id: "test1234",
                name: "Nadim",
                role: "ADMIN",
                mobile: "1234567890",
                isPremium: true,
                subscriptionTier: "MONTHLY",
                subscriptionLevel: "ULTRA",
                subscriptionEndDate: futureDate,
                credits: 748,
                createdAt: new Date().toISOString(),
                streak: 5,
                classLevel: "10",
                board: "CBSE",
                stream: "Science",
                profileCompleted: true,
                password: "123"
            };
            const mockSettings = {
                appName: "NSTA",
                specialDiscountEvent: {
                    enabled: true,
                    eventName: "Sale",
                    discountPercent: 20,
                    showToFreeUsers: true,
                    showToPremiumUsers: true
                }
            };
            localStorage.setItem("nst_current_user", JSON.stringify(mockUser));
            localStorage.setItem("nst_users", JSON.stringify([mockUser]));
            localStorage.setItem("nst_system_settings", JSON.stringify(mockSettings));
            localStorage.setItem("has_seen_terms", "true");
            localStorage.setItem("nst_has_seen_welcome", "true");
            localStorage.setItem("nst_terms_accepted", "true");
            localStorage.setItem("is_logged_in", "true");

            // Bypass the Daily Login Bonus popup
            const today = new Date().toDateString();
            localStorage.setItem(`login_bonus_${mockUser.id}_${today}`, "true");

            // Bypass any onboarding flags
            localStorage.setItem(`referral_shown_${mockUser.id}`, "true");
        }""")

        # Navigate directly to a mock route or reload to apply state
        await page.goto("http://localhost:5000/?mock=xyz", wait_until="load")

        # Click exit on the admin panel if we landed there somehow
        try:
            await page.click('button:has-text("Exit")', timeout=1000)
            print("Exited admin mode")
        except:
            pass

        # Give it a bit to load properly
        await asyncio.sleep(2)

        # Take a screenshot to verify visually
        await page.screenshot(path="verify_header_banner2.png")

        print("Screenshot saved to verify_header_banner2.png")
        await browser.close()

asyncio.run(run())
