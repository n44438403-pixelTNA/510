from playwright.sync_api import sync_playwright
import time
import json

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 390, 'height': 844})
    page = context.new_page()

    # 1. Start on index
    page.goto("http://localhost:5000", wait_until="load")
    time.sleep(1)

    # 2. Accept Terms if present
    try:
        page.click("text='I Agree & Continue'", timeout=3000)
        time.sleep(1)
    except:
        print("No terms modal found")

    # 3. Set Mock State for a Student with History
    mock_history = [
        {
            "id": "mock_result_1",
            "date": "2024-05-20T10:00:00Z",
            "subjectId": "sub1",
            "subjectName": "Science",
            "chapterId": "chap1",
            "chapterTitle": "Chemical Reactions",
            "score": 8,
            "totalQuestions": 10,
            "correctCount": 8,
            "totalTimeSeconds": 120,
            "averageTimePerQuestion": 12,
            "performanceTag": "EXCELLENT",
            "classLevel": "10",
            "omrData": [
                {"qIndex": 0, "selected": 0, "correct": 0},
                {"qIndex": 1, "selected": 1, "correct": 1}
            ],
            "topicAnalysis": {
                "Reactions": { "total": 2, "correct": 2, "percentage": 100 }
            }
        }
    ]

    mock_user = {
        "id": "student1",
        "role": "STUDENT",
        "name": "Test Student",
        "phone": "9876543210",
        "classLevel": "10",
        "mcqHistory": mock_history,
        "subscriptionLevel": "ULTRA",
        "isPremium": True
    }

    page.evaluate(f"""
        window.localStorage.setItem('currentUser', JSON.stringify({json.dumps(mock_user)}));
        window.localStorage.setItem('hasSeenOnboarding', 'true');
        window.localStorage.setItem('hasAcceptedTerms', 'true');
    """)
    page.reload(wait_until="load")
    time.sleep(2)

    # 4. Navigate to Revision Hub to open a marksheet
    page.goto("http://localhost:5000/revision", wait_until="load")
    time.sleep(2)

    # Click on the history item to open the marksheet
    try:
        page.click("text='Chemical Reactions'", timeout=3000)
        time.sleep(2)

        # Click on 'Full Analysis' tab (or Explanations if that's active)
        try:
            page.click("text='Full Analysis'", timeout=2000)
            time.sleep(1)
        except:
             pass # Maybe it's already there or named differently

        # Expand a question accordion
        page.click(".group summary", timeout=2000)
        time.sleep(1)

    except Exception as e:
        print(f"Error navigating to marksheet: {e}")

    page.screenshot(path="student_marksheet_redesign.png", full_page=True)
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
