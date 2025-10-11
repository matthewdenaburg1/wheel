
from playwright.sync_api import Page, expect

def test_name_changes(page: Page):
    """
    This test verifies that a user can add, uncheck, and remove names
    from the wheel.
    """
    # 1. Arrange: Go to the application.
    page.goto("http://localhost:5173")

    # 2. Act: Add a new name.
    page.get_by_role("button", name="+").click()
    page.on("dialog", lambda dialog: dialog.accept(prompt_text="Test Name"))

    # 3. Act: Uncheck a name.
    page.get_by_label("Person 1").uncheck()

    # 4. Act: Remove a name.
    page.get_by_role("button", name="-").first.click()

    # 5. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")
