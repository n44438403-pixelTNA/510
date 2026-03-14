import asyncio
from playwright.async_api import async_playwright
import time
import subprocess
import os

async def main():
    print("Starting dev server...")
    server = subprocess.Popen(["npm", "run", "dev"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    time.sleep(5) # Wait for server to start

    print("Launching playwright...")
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        print("Navigating to app...")
        try:
            await page.goto("http://localhost:5000", wait_until="networkidle", timeout=15000)
        except Exception as e:
            print(f"Navigation error: {e}")

        time.sleep(2) # Give it a bit more time to render
        print("Taking screenshot...")
        await page.screenshot(path="/tmp/desktop_view.png", full_page=True)

        await browser.close()

    server.terminate()
    print("Done")

if __name__ == "__main__":
    asyncio.run(main())
