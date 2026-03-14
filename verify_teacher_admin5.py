import asyncio
from playwright.async_api import async_playwright
import time
import os
import json

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 414, 'height': 896})
        page = await context.new_page()

        print("Starting dev server...")
        os.system("npm run dev > vite_output.log 2>&1 &")
        time.sleep(5)

        print("Injecting mock Admin user...")
        mock_admin = {
            "id": "admin123",
            "name": "Mock Admin",
            "email": "admin@mock.com",
            "role": "ADMIN",
            "profileCompleted": True
        }
        await page.goto("http://localhost:5000", wait_until="load")
        await page.evaluate(f"window.localStorage.setItem('nst_current_user', '{json.dumps(mock_admin)}')")
        await page.goto("http://localhost:5000", wait_until="load")
        time.sleep(2)

        for _ in range(3):
            try:
                await page.click("button:has-text('CLAIM NOW')", timeout=1000)
                time.sleep(1)
            except:
                pass
            try:
                await page.click("button:has-text('Okay')", timeout=1000)
                time.sleep(1)
            except:
                pass

        print("Clicking Admin Panel...")
        try:
            await page.click("text=Admin Panel", timeout=5000)
            time.sleep(2)
        except Exception as e:
            print("Could not click Admin Panel", e)

        print("Opening CORE MANAGEMENT Group...")
        try:
            # Depending on how the FeatureGroupList works, it might be closed or open
            await page.click("text=CORE MANAGEMENT", timeout=2000)
            time.sleep(1)
        except:
            pass

        print("Navigating to Teacher Codes tab in admin...")
        try:
            await page.click("text=Teacher Codes", timeout=5000)
            time.sleep(2)
            await page.screenshot(path="admin_teacher_codes.png", full_page=True)
            print("Successfully navigated to Teacher Codes tab and took screenshot.")
        except Exception as e:
            print("Could not find Teacher Codes tab", e)
            await page.screenshot(path="admin_dashboard_failed.png", full_page=True)

        await browser.close()
        os.system("pkill -f 'vite'")

if __name__ == "__main__":
    asyncio.run(verify())
