from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 390, 'height': 844})
    page = context.new_page()

    # 1. Start on index
    page.goto("http://localhost:5000", wait_until="load")
    time.sleep(1)

    # 2. Accept Terms
    try:
        page.click("text='I Agree & Continue'", timeout=3000)
        time.sleep(1)
    except:
        print("No terms modal found")

    # 3. Set Mock State
    page.evaluate("""
        window.localStorage.setItem('currentUser', JSON.stringify({id: 'admin', role: 'ADMIN', name: 'Admin', phone: '123', classLevel: '12'}));
        window.localStorage.setItem('hasSeenOnboarding', 'true');
        window.localStorage.setItem('hasAcceptedTerms', 'true');
    """)
    page.reload(wait_until="load")
    time.sleep(2)

    # Check if we are in app, go to Admin (either click the admin tab or dispatch event)
    try:
        page.click("text='Admin'", timeout=2000)
    except:
        print("Couldn't click Admin tab natively. Trying evaluating script")
        page.evaluate("""
            const state = JSON.parse(window.localStorage.getItem('currentUser'));
            console.log('User is:', state);
        """)

    page.goto("http://localhost:5000/admin", wait_until="load")
    time.sleep(3)

    page.screenshot(path="admin_screenshot_mcq_editor.png", full_page=True)
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
