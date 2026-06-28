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
                
            # Scroll to expectations field at the bottom to verify layout
            expectations = await page.query_selector("textarea[name='expectations']")
            if expectations:
                await expectations.scroll_into_view_if_needed()
                await page.wait_for_timeout(500)
                
            await page.screenshot(path=os.path.join(project_uat_dir, "register_local_desktop_expanded.png"))
            await page.screenshot(path=os.path.join(brain_dir, "register_local_desktop_expanded.png"))
            print("Captured register.html desktop expanded.")

            # --- 2. Test register_dh9_hanoi.html ---
            page_hanoi = await browser.new_page(viewport={"width": 1280, "height": 1200})
            print("Navigating to local register_dh9_hanoi.html...")
            await page_hanoi.goto(f"http://localhost:{PORT}/register_dh9_hanoi.html")
            await page_hanoi.wait_for_timeout(1000)
            
            # Scroll to expectations field
            expectations_hanoi = await page_hanoi.query_selector("textarea[name='expectations']")
            if expectations_hanoi:
                await expectations_hanoi.scroll_into_view_if_needed()
                await page_hanoi.wait_for_timeout(500)
                
            await page_hanoi.screenshot(path=os.path.join(project_uat_dir, "register_hanoi_local.png"))
            await page_hanoi.screenshot(path=os.path.join(brain_dir, "register_hanoi_local.png"))
            print("Captured register_dh9_hanoi.html.")

            # --- 3. Test register_direct.html ---
            page_direct = await browser.new_page(viewport={"width": 1280, "height": 1200})
            print("Navigating to local register_direct.html...")
            await page_direct.goto(f"http://localhost:{PORT}/register_direct.html")
            await page_direct.wait_for_timeout(1000)
            
            # Scroll to expectations field
            expectations_direct = await page_direct.query_selector("textarea[name='expectations']")
            if expectations_direct:
                await expectations_direct.scroll_into_view_if_needed()
                await page_direct.wait_for_timeout(500)
                
            await page_direct.screenshot(path=os.path.join(project_uat_dir, "register_direct_local.png"))
            await page_direct.screenshot(path=os.path.join(brain_dir, "register_direct_local.png"))
            print("Captured register_direct.html.")
            
            await browser.close()
            
    finally:
        # Kill the http server
        print("Stopping local HTTP server...")
        server_process.terminate()
        server_process.wait()

if __name__ == "__main__":
    asyncio.run(main())
