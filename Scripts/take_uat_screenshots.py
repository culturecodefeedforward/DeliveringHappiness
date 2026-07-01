import asyncio
import json
import sys
from pathlib import Path
from urllib.parse import urlparse

from playwright.async_api import async_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

PROJECT_ROOT = Path(__file__).resolve().parents[1]
UAT_DIR = PROJECT_ROOT / "UAT"
BASE_URL = "http://127.0.0.1:8000"

SCREENSHOTS = [
    ("index_desktop_uat.png", "/", {"width": 1440, "height": 900}, None),
    (
        "index_mobile_uat.png",
        "/",
        {"width": 375, "height": 812},
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) "
        "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
    ),
    ("assessment_desktop_uat.png", "/assessment.html", {"width": 1440, "height": 900}, None),
    (
        "assessment_mobile_uat.png",
        "/assessment.html",
        {"width": 375, "height": 812},
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) "
        "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
    ),
]

CLICK_TESTS = [
    {"source": "/", "label": "Đăng ký TP.HCM", "expected": "/register.html"},
    {"source": "/", "label": "Đăng ký Hà Nội", "expected": "/register_dh9_hanoi.html"},
    {"source": "/", "label": "Kiểm tra \"Hệ điều hành Hạnh Phúc\"", "expected": "/assessment.html"},
    {"source": "/register.html", "label": "Quay về trang chủ", "expected": "/"},
    {"source": "/register_dh9_hanoi.html", "label": "Quay về trang chủ", "expected": "/"},
    {"source": "/assessment.html", "label": "Thông tin chương trình", "expected": "/"},
    {"source": "/assessment.html", "label": "Đăng ký TP.HCM", "expected": "/register.html"},
    {"source": "/assessment.html", "label": "Đăng ký Hà Nội", "expected": "/register_dh9_hanoi.html"},
]


def page_url(path):
    return f"{BASE_URL}{path}"


def normalize_path(url):
    parsed = urlparse(url)
    path = parsed.path or "/"
    return "/" if path == "" else path


async def new_context(browser, viewport, user_agent=None):
    options = {"viewport": viewport}
    if user_agent:
        options.update({"user_agent": user_agent, "is_mobile": True, "has_touch": True})
    return await browser.new_context(**options)


async def capture_screenshots(browser):
    for filename, path, viewport, user_agent in SCREENSHOTS:
        context = await new_context(browser, viewport, user_agent)
        page = await context.new_page()
        page.set_default_timeout(10000)
        await page.goto(page_url(path), wait_until="domcontentloaded", timeout=10000)
        await page.wait_for_timeout(500)
        await page.screenshot(path=str(UAT_DIR / filename), full_page=True)
        await context.close()
        print(f"SCREENSHOT {filename}", flush=True)


async def click_test(browser, case):
    context = await new_context(browser, {"width": 1440, "height": 900})
    page = await context.new_page()
    result = {
        "source": case["source"],
        "label": case["label"],
        "expected": case["expected"],
        "observed": None,
        "status": "FAILED",
        "error": None,
    }
    try:
        page.set_default_timeout(10000)
        await page.goto(page_url(case["source"]), wait_until="domcontentloaded", timeout=10000)
        link = page.locator("a:visible", has_text=case["label"]).first
        async with page.expect_navigation(wait_until="domcontentloaded", timeout=10000):
            await link.click(timeout=5000)
        observed = normalize_path(page.url)
        result["observed"] = observed
        result["status"] = "PASS" if observed == case["expected"] else "FAILED"
    except Exception as exc:
        result["error"] = f"{type(exc).__name__}: {exc}"
    finally:
        await context.close()
    return result


async def run_click_tests(browser):
    results = []
    for case in CLICK_TESTS:
        result = await click_test(browser, case)
        results.append(result)
        print(
            f"CLICK {result['status']} | {result['source']} | "
            f"{result['label']} | expected={result['expected']} observed={result['observed']}",
            flush=True,
        )
    output = {
        "baseUrl": BASE_URL,
        "results": results,
        "allPassed": all(item["status"] == "PASS" for item in results),
    }
    output_path = UAT_DIR / "uat_click_results_dh9_homepage_grid_20260701.json"
    output_path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    return output


async def main():
    UAT_DIR.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch()
        await capture_screenshots(browser)
        click_output = await run_click_tests(browser)
        await browser.close()
    if not click_output["allPassed"]:
        raise SystemExit(1)


if __name__ == "__main__":
    asyncio.run(main())
