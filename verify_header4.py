import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 412, "height": 915})
        page = await context.new_page()

        await page.goto("http://localhost:5000")
        await page.evaluate("""() => {
            const mockUser = {
                id: "test1234",
                name: "Nadim",
                role: "STUDENT",
                mobile: "1234567890",
                isPremium: true,
                subscriptionTier: "MONTHLY",
                subscriptionLevel: "ULTRA",
                subscriptionEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                credits: 748,
                createdAt: new Date().toISOString(),
                streak: 5,
                classLevel: "10",
                board: "CBSE",
                stream: "Science",
                profileCompleted: true,
                password: "123",
                lastLoginRewardDate: new Date().toDateString()
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

            const today = new Date().toDateString();
            localStorage.setItem(`login_bonus_${mockUser.id}_${today}`, "true");
            localStorage.setItem(`referral_shown_${mockUser.id}`, "true");
        }""")

        await page.goto("http://localhost:5000/?mock=xyz", wait_until="load")

        await asyncio.sleep(2)
        await page.screenshot(path="verify_header_banner4.png")

        print("Screenshot saved to verify_header_banner4.png")
        await browser.close()

asyncio.run(run())
