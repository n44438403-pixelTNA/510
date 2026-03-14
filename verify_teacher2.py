import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 375, 'height': 812},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X)'
        )
        page = await context.new_page()

        print("Navigating to mock app...")
        # Direct render mock logic to avoid Reward popups
        await page.goto("http://localhost:5000?mock=pdf_view", wait_until="load")

        # Wait a bit for the component to render and animations to finish
        await page.wait_for_timeout(3000)

        print("Taking screenshot...")
        await page.screenshot(path="teacher_verification2.png", full_page=True)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
