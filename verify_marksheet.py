import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Use a mobile viewport since this app is heavily mobile-focused
        context = await browser.new_context(
            viewport={'width': 375, 'height': 812},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X)'
        )
        page = await context.new_page()

        print("Navigating to mock marksheet...")
        await page.goto("http://localhost:5000?mock=marksheet", wait_until="load")

        # Wait a bit for the component to render and animations to finish
        await page.wait_for_timeout(3000)

        print("Taking screenshot...")
        await page.screenshot(path="marksheet_verification.png", full_page=True)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
