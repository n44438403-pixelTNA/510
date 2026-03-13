import asyncio
from playwright.async_api import async_playwright
import json

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Use a mobile viewport
        context = await browser.new_context(
            viewport={'width': 375, 'height': 812},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
        )
        page = await context.new_page()

        print("Navigating to app...")
        await page.goto("http://localhost:5000", wait_until="load")

        # Inject user data and navigate
        print("Injecting local storage...")
        mock_user = {
            "id": "test_user_123",
            "uid": "test_user_123",
            "name": "Jules",
            "role": "STUDENT",
            "classLevel": "12",
            "board": "CBSE",
            "stream": "SCIENCE",
            "mobile": "9999999999",
            "isPremium": True,
            "profileCompleted": True,
            "onboardingComplete": True,
            "testResults": [],
            "mcqHistory": [],
            "preferences": {},
            "usageHistory": [
                {
                    "type": "MCQ",
                    "title": "Thermodynamics Quiz",
                    "timestamp": "2024-03-10T12:00:00Z",
                    "metadata": {"subject": "Physics"}
                },
                {
                    "type": "NOTES",
                    "title": "Kinematics Deep Dive",
                    "timestamp": "2024-03-11T12:00:00Z",
                    "metadata": {"subject": "Physics"}
                }
            ]
        }

        await page.evaluate(f"""
            window.localStorage.setItem('nst_current_user', '{json.dumps(mock_user)}');
            window.localStorage.setItem('nst_has_seen_welcome', 'true');
            window.localStorage.setItem('nst_tnc_accepted', 'true');
        """)

        print("Reloading to apply state...")
        await page.reload(wait_until="load")
        await page.wait_for_timeout(2000)

        # Force terms to hide
        await page.evaluate("""
            const termsBtn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('I Agree'));
            if(termsBtn) termsBtn.click();
        """)
        await page.wait_for_timeout(1000)

        # Go straight to history view
        print("Clicking History tab...")
        try:
            # Try evaluating click
            await page.evaluate("""
                const histBtn = Array.from(document.querySelectorAll('span')).find(el => el.textContent === 'History');
                if(histBtn) histBtn.closest('button').click();
            """)
            await page.wait_for_timeout(2000)

            # Switch to Activity Log
            await page.evaluate("""
                const activityBtn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Activity Log'));
                if(activityBtn) activityBtn.click();
            """)
            await page.wait_for_timeout(2000)
        except Exception as e:
            print("Could not click history tab:", e)

        print("Taking screenshots...")
        # Screenshot Activity Log
        await page.screenshot(path="screenshot_history_activity.png", full_page=True)
        print("Saved screenshot_history_activity.png")

        # Try to click OFFLINE tab
        try:
            await page.evaluate("""
                const offBtn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Offline Saved') || el.textContent === 'Offline Saved' || el.textContent.includes('Offline') || el.textContent === 'Offline Saved');
                if(!offBtn) {
                   const btns = document.querySelectorAll('button');
                   for(let btn of btns) {
                      if(btn.textContent.includes('Offline Saved')) btn.click();
                   }
                } else {
                   offBtn.click();
                }
            """)
            await page.wait_for_timeout(2000)
            await page.screenshot(path="screenshot_history_offline.png", full_page=True)
            print("Saved screenshot_history_offline.png")
        except Exception as e:
            print("Could not click OFFLINE tab:", e)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
