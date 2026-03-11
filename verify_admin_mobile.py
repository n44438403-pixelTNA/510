from playwright.sync_api import sync_playwright

def verify_admin_mobile():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        # Create a mobile context (e.g., iPhone 13 Pro dimensions)
        context = browser.new_context(
            viewport={'width': 390, 'height': 844},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
        )
        page = context.new_page()

        try:
            # Login as Admin
            page.goto('http://localhost:5000', wait_until="load")

            # Dismiss terms modal
            try:
                page.wait_for_selector('text="I Agree & Continue"', timeout=3000)
                page.click('text="I Agree & Continue"')
                page.wait_for_timeout(1000)
            except:
                pass

            # Use auth bypass
            page.evaluate("""
                localStorage.setItem('currentUser', JSON.stringify({id: 'admin', role: 'ADMIN', name: 'Admin', phone: '123', classLevel: '12'}));
                localStorage.setItem('hasSeenOnboarding', 'true');
                localStorage.setItem('hasAcceptedTerms', 'true');
            """)
            page.goto('http://localhost:5000', wait_until="load")
            page.wait_for_timeout(2000)

            page.goto('http://localhost:5000/admin', wait_until="load")
            page.wait_for_timeout(3000)

            # Since the frontend routing can be tricky, let's just evaluate state directly or take screenshot of the dashboard.
            # We want to make sure the app works without throwing any React errors.
            page.screenshot(path='admin_mobile_main.png', full_page=True)
            print("Screenshot saved to admin_mobile_main.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == '__main__':
    verify_admin_mobile()
