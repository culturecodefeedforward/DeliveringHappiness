import asyncio
import os
import subprocess
import time
from playwright.async_api import async_playwright

# 1. Start python http server in background
PORT = 8011
project_dir = r"c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website"
server_process = subprocess.Popen(
    [
        r"C:\Users\vu.hoang\.gemini\antigravity\scratch\tools\python\python.exe",
        "-m", "http.server", str(PORT),
        "--directory", project_dir
    ],
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL
)

# Wait for server to start
time.sleep(2)

async def main():
    brain_dir = r"C:\Users\vu.hoang\.gemini\antigravity\brain\eddd1298-df3e-4f53-8940-d0f698487b5c"
    project_uat_dir = r"c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshots"
    os.makedirs(brain_dir, exist_ok=True)
    os.makedirs(project_uat_dir, exist_ok=True)

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            
            # --- 1. Test register.html (Desktop) ---
            page = await browser.new_page(viewport={"width": 1280, "height": 1200})
            print("Navigating to local register.html...")
            await page.goto(f"http://localhost:{PORT}/register.html")
            await page.wait_for_timeout(1000)
            
            # Click accordion to expand
            trigger = await page.query_selector("#additionalInfoTrigger")
            if trigger:
                print("Expanding accordion on register.html...")
                await trigger.click()
                await page.wait_for_timeout(1500)
                
            await page.screenshot(path=os.path.join(project_uat_dir, "register_local_desktop_expanded.png"))
            await page.screenshot(path=os.path.join(brain_dir, "register_local_desktop_expanded.png"))
            print("Captured register.html desktop expanded.")

            # --- 1b. Test register.html (Mobile) ---
            context_mobile = await browser.new_context(
                viewport={"width": 375, "height": 812},
                is_mobile=True,
                has_touch=True
            )
            page_mobile = await context_mobile.new_page()
            print("Navigating to local register.html (Mobile)...")
            await page_mobile.goto(f"http://localhost:{PORT}/register.html")
            await page_mobile.wait_for_timeout(1000)
            await page_mobile.screenshot(path=os.path.join(project_uat_dir, "register_local_mobile.png"))
            await page_mobile.screenshot(path=os.path.join(brain_dir, "register_local_mobile.png"))
            print("Captured register.html mobile.")

            # --- 2. Test register_dh9_hanoi.html ---
            page_hanoi = await browser.new_page(viewport={"width": 1280, "height": 1200})
            print("Navigating to local register_dh9_hanoi.html...")
            await page_hanoi.goto(f"http://localhost:{PORT}/register_dh9_hanoi.html")
            await page_hanoi.wait_for_timeout(1000)
            await page_hanoi.screenshot(path=os.path.join(project_uat_dir, "register_hanoi_local.png"))
            await page_hanoi.screenshot(path=os.path.join(brain_dir, "register_hanoi_local.png"))
            print("Captured register_dh9_hanoi.html.")

            # --- 3. Test register_direct.html ---
            page_direct = await browser.new_page(viewport={"width": 1280, "height": 1200})
            print("Navigating to local register_direct.html...")
            await page_direct.goto(f"http://localhost:{PORT}/register_direct.html")
            await page_direct.wait_for_timeout(1000)
            await page_direct.screenshot(path=os.path.join(project_uat_dir, "register_direct_local.png"))
            await page_direct.screenshot(path=os.path.join(brain_dir, "register_direct_local.png"))
            print("Captured register_direct.html.")

            # --- 4. Test assessment.html (Desktop & Mobile) ---
            page_quiz = await browser.new_page(viewport={"width": 1280, "height": 1000})
            print("Navigating to local assessment.html...")
            await page_quiz.goto(f"http://localhost:{PORT}/assessment.html")
            await page_quiz.wait_for_timeout(1000)
            await page_quiz.screenshot(path=os.path.join(project_uat_dir, "assessment_local_desktop.png"))
            await page_quiz.screenshot(path=os.path.join(brain_dir, "assessment_local_desktop.png"))
            print("Captured assessment.html desktop.")

            page_quiz_mobile = await context_mobile.new_page()
            print("Navigating to local assessment.html (Mobile)...")
            await page_quiz_mobile.goto(f"http://localhost:{PORT}/assessment.html")
            await page_quiz_mobile.wait_for_timeout(1000)
            await page_quiz_mobile.screenshot(path=os.path.join(project_uat_dir, "assessment_local_mobile.png"))
            await page_quiz_mobile.screenshot(path=os.path.join(brain_dir, "assessment_local_mobile.png"))
            print("Captured assessment.html mobile.")
            
            # --- 5. Test index.html (Desktop & Mobile) ---
            page_landing = await browser.new_page(viewport={"width": 1280, "height": 800})
            print("Navigating to local index.html...")
            await page_landing.goto(f"http://localhost:{PORT}/index.html")
            await page_landing.wait_for_timeout(1000)
            await page_landing.screenshot(path=os.path.join(project_uat_dir, "landing_local_desktop.png"))
            await page_landing.screenshot(path=os.path.join(brain_dir, "landing_local_desktop.png"))
            print("Captured index.html desktop.")

            page_landing_mobile = await context_mobile.new_page()
            print("Navigating to local index.html (Mobile)...")
            await page_landing_mobile.goto(f"http://localhost:{PORT}/index.html")
            await page_landing_mobile.wait_for_timeout(1000)
            await page_landing_mobile.screenshot(path=os.path.join(project_uat_dir, "landing_local_mobile.png"))
            await page_landing_mobile.screenshot(path=os.path.join(brain_dir, "landing_local_mobile.png"))
            print("Captured index.html mobile.")
            
            await browser.close()
            
    finally:
        # Kill the http server
        print("Stopping local HTTP server...")
        server_process.terminate()
        server_process.wait()

if __name__ == "__main__":
    asyncio.run(main())
