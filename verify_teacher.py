import asyncio
from playwright.async_api import async_playwright
import json

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 375, 'height': 812},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X)'
        )
        page = await context.new_page()

        print("Navigating to mock app...")
        await page.goto("http://localhost:5000", wait_until="load")

        # Inject mock user with TEACHER role
        mock_user = {
            "id": "mock_teacher",
            "name": "Prof. Smith",
            "role": "TEACHER",
            "isPremium": True,
            "profileCompleted": True
        }

        mock_content = {
            "teachingStrategyHtml": "<div class='teacher-section'><h2>🎓 Topic Core</h2><p>This is a test core</p></div>"
        }

        await page.evaluate(f"""
            window.localStorage.setItem('nst_current_user', '{json.dumps(mock_user)}');
            window.localStorage.setItem('nst_has_seen_welcome', 'true');
            window.localStorage.setItem('nst_terms_accepted', 'true');

            // Mock content directly to render PdfView
            const event = new CustomEvent('forceRenderPdfView', {{ detail: {json.dumps(mock_content)} }});
            window.dispatchEvent(event);
        """)

        await page.goto("http://localhost:5000?mock=pdf_view", wait_until="load")
        await page.wait_for_timeout(3000)

        print("Taking screenshot...")
        await page.screenshot(path="teacher_verification.png", full_page=True)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
