#!/usr/bin/env python3
"""
Automated Cloud Render & Retrieval Script for Remotion Reels
Integrates with GitHub Actions runner on eren-998/code-baithak-reel-render
"""

import sys
import os
import subprocess
import time
import json
import urllib.request
import urllib.error
import zipfile
import io
import re

DEFAULT_REPO = "eren-998/code-baithak-reel-render"
DEFAULT_PROJECT_DIR = "/root/talking-head-remotion"
DEFAULT_OUTPUT_NAME = "video_code_baithak_polished.mp4"

def get_github_token():
    # 1. Check environment variables
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GITHUB_PERSONAL_ACCESS_TOKEN")
    if token:
        return token.strip()

    # 2. Check Antigravity MCP config
    mcp_config_path = os.path.expanduser("~/.gemini/config/mcp_config.json")
    if os.path.exists(mcp_config_path):
        try:
            with open(mcp_config_path, "r") as f:
                cfg = json.load(f)
                token = cfg.get("mcpServers", {}).get("github", {}).get("env", {}).get("GITHUB_PERSONAL_ACCESS_TOKEN")
                if token:
                    return token.strip()
        except Exception:
            pass

    # 3. Check local .env in skill folder
    env_file = os.path.join(os.path.dirname(__file__), "..", ".env")
    if os.path.exists(env_file):
        try:
            with open(env_file, "r") as f:
                for line in f:
                    if line.startswith("GITHUB_TOKEN=") or line.startswith("GITHUB_PERSONAL_ACCESS_TOKEN="):
                        val = line.split("=", 1)[1].strip().strip('"').strip("'")
                        if val:
                            return val
        except Exception:
            pass

    print("[ERROR] GitHub token not found! Set GITHUB_TOKEN or configure ~/.gemini/config/mcp_config.json")
    sys.exit(1)

def run_cmd(cmd, cwd=None):
    res = subprocess.run(cmd, shell=True, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print(f"[ERROR] Command failed: {cmd}\nStderr: {res.stderr.strip()}")
        sys.exit(1)
    return res.stdout.strip()

def main():
    out_name = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_OUTPUT_NAME
    if not out_name.endswith(".mp4"):
        out_name += ".mp4"

    project_dir = os.environ.get("REMOTION_PROJECT_DIR", DEFAULT_PROJECT_DIR)
    repo = os.environ.get("GITHUB_REPO", DEFAULT_REPO)
    token = get_github_token()

    if not os.path.exists(project_dir):
        print(f"[ERROR] Project directory not found: {project_dir}")
        sys.exit(1)

    print(f"=== Starting Cloud Reel Render Pipeline ===")
    print(f"Target Repo: {repo}")
    print(f"Project Dir: {project_dir}")
    print(f"Final Output: /sdcard/Download/{out_name}")

    # 1. Stage and commit changes in local remotion project
    print("\n[1/5] Staging and pushing code & video assets...")
    run_cmd("git add -A", cwd=project_dir)
    status = run_cmd("git status --porcelain", cwd=project_dir)
    
    if status:
        run_cmd('git commit -m "feat: Cloud render trigger for new reel composition"', cwd=project_dir)
        print("  - Committed latest changes")
    else:
        print("  - Working tree clean, nothing new to commit")

    remote_url = f"https://x-access-token:{token}@github.com/{repo}.git"
    run_cmd(f"git remote set-url origin {remote_url} 2>/dev/null || git remote add origin {remote_url}", cwd=project_dir)
    
    push_out = run_cmd("git push origin main --force", cwd=project_dir)
    print("  - Pushed latest composition to GitHub main branch")

    # 2. Wait for GitHub Actions workflow to be scheduled
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github+json",
        "User-Agent": "Antigravity-Reel-Pipeline"
    }

    print("\n[2/5] Detecting GitHub Actions workflow run...")
    run_id = None
    for attempt in range(15):
        time.sleep(3)
        try:
            req = urllib.request.Request(f"https://api.github.com/repos/{repo}/actions/runs?per_page=5", headers=headers)
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode())
                runs = data.get("workflow_runs", [])
                if runs:
                    latest = runs[0]
                    # Check if run is recent (within 5 minutes)
                    run_id = latest["id"]
                    print(f"  - Found Active Run #{run_id} (Status: {latest.get('status')})")
                    print(f"  - Monitor online: {latest.get('html_url')}")
                    break
        except Exception as e:
            print(f"  - Waiting for run to register... ({e})")

    if not run_id:
        print("[ERROR] Could not detect workflow run on GitHub Actions.")
        sys.exit(1)

    # 3. Poll until workflow finishes
    print("\n[3/5] Rendering in the cloud (Ubuntu 4-core runner)...")
    start_time = time.time()
    while True:
        time.sleep(12)
        elapsed = int(time.time() - start_time)
        try:
            req = urllib.request.Request(f"https://api.github.com/repos/{repo}/actions/runs/{run_id}", headers=headers)
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode())
                status = data.get("status")
                conclusion = data.get("conclusion")
                print(f"  [{time.strftime('%X')} - {elapsed}s] Runner Status: {status}, Conclusion: {conclusion}")

                if status == "completed":
                    if conclusion != "success":
                        print(f"\n[ERROR] Cloud render failed with conclusion: {conclusion}")
                        print(f"Check logs at: https://github.com/{repo}/actions/runs/{run_id}")
                        sys.exit(1)
                    print(f"\n[+] Render successfully finished in {elapsed} seconds!")
                    break
        except Exception as e:
            print(f"  - Polling notice: {e}")

    # 4. Fetch artifact download URL
    print("\n[4/5] Retrieving rendered MP4 artifact...")
    req = urllib.request.Request(f"https://api.github.com/repos/{repo}/actions/runs/{run_id}/artifacts", headers=headers)
    with urllib.request.urlopen(req) as resp:
        art_data = json.loads(resp.read().decode())
        artifacts = art_data.get("artifacts", [])

    if not artifacts:
        print("[ERROR] No artifacts uploaded by the workflow run.")
        sys.exit(1)

    art = artifacts[0]
    art_id = art["id"]
    size_mb = art["size_in_bytes"] / (1024 * 1024)
    print(f"  - Artifact '{art['name']}' ready ({size_mb:.2f} MB)")

    # Download zip with curl (curl cleanly handles cross-domain authorization redirect to blob storage)
    temp_zip = "/tmp/reel_rendered.zip"
    temp_dir = "/tmp/reel_extracted"
    os.makedirs(temp_dir, exist_ok=True)

    dl_cmd = f'curl -s -L -H "Authorization: token {token}" -H "Accept: application/vnd.github+json" "https://api.github.com/repos/{repo}/actions/artifacts/{art_id}/zip" -o {temp_zip}'
    run_cmd(dl_cmd)
    print("  - Downloaded artifact archive")

    # Unzip
    with zipfile.ZipFile(temp_zip, 'r') as z:
        z.extractall(temp_dir)
    print("  - Extracted MP4 file")

    # 5. Place video into phone storage
    print("\n[5/5] Moving polished video to device storage...")
    source_mp4 = os.path.join(temp_dir, "video_polished.mp4")
    if not os.path.exists(source_mp4):
        # Find any mp4 in extracted folder
        for f in os.listdir(temp_dir):
            if f.endswith(".mp4"):
                source_mp4 = os.path.join(temp_dir, f)
                break

    dest_download = os.path.join("/sdcard/Download", out_name)
    run_cmd(f"cp {source_mp4} {dest_download}")
    print(f"  [SUCCESS] Copied to: {dest_download}")

    # Optional copy to Movies/Edits
    dest_movies = "/sdcard/Movies/Edits"
    if os.path.exists(dest_movies):
        run_cmd(f"cp {source_mp4} {os.path.join(dest_movies, out_name)}")
        print(f"  [SUCCESS] Copied to: {os.path.join(dest_movies, out_name)}")

    # Cleanup temp zip
    try:
        os.remove(temp_zip)
    except Exception:
        pass

    print("\n=== CLOUD RENDER COMPLETE & DELIVERED ===")
    print(f"File Path: {dest_download}")

if __name__ == "__main__":
    main()
