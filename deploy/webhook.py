#!/usr/bin/env python3
"""
GitHub Webhook 自动部署脚本
当 GitHub 仓库收到 push 事件时，自动拉取最新代码。

用法：
  1. 修改下方配置
  2. pip3 install flask
  3. python3 webhook.py
"""

import hashlib
import hmac
import subprocess
import os
from flask import Flask, request, jsonify

app = Flask(__name__)

# ===== 配置项 =====
WEBHOOK_SECRET = "your-webhook-secret-here"  # 与 GitHub Webhook 设置中的 Secret 一致
REPO_PATH = "/var/www/blog"                   # 服务器上仓库路径
BRANCH = "main"                               # 监听的分支
PORT = 9000                                   # webhook 监听端口
# ==================


def verify_signature(payload, signature):
    """验证 GitHub webhook 签名"""
    if not signature:
        return False
    mac = hmac.new(
        WEBHOOK_SECRET.encode("utf-8"),
        msg=payload,
        digestmod=hashlib.sha256,
    )
    expected = "sha256=" + mac.hexdigest()
    return hmac.compare_digest(expected, signature)


def pull_latest():
    """拉取最新代码"""
    try:
        result = subprocess.run(
            ["git", "fetch", "origin", BRANCH],
            cwd=REPO_PATH,
            capture_output=True,
            text=True,
            timeout=30,
        )
        result2 = subprocess.run(
            ["git", "reset", "--hard", f"origin/{BRANCH}"],
            cwd=REPO_PATH,
            capture_output=True,
            text=True,
            timeout=30,
        )
        return True, result2.stdout
    except Exception as e:
        return False, str(e)


@app.route("/webhook", methods=["POST"])
def webhook():
    signature = request.headers.get("X-Hub-Signature-256")
    if not verify_signature(request.data, signature):
        return jsonify({"error": "Invalid signature"}), 403

    event = request.headers.get("X-GitHub-Event")
    if event != "push":
        return jsonify({"message": f"Ignored event: {event}"}), 200

    payload = request.json
    ref = payload.get("ref", "")
    if ref != f"refs/heads/{BRANCH}":
        return jsonify({"message": f"Ignored branch: {ref}"}), 200

    success, output = pull_latest()
    if success:
        return jsonify({"message": "Deployed successfully", "output": output}), 200
    else:
        return jsonify({"error": "Deploy failed", "output": output}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    print(f"🚀 Webhook server running on port {PORT}")
    print(f"📂 Watching repo: {REPO_PATH} (branch: {BRANCH})")
    app.run(host="0.0.0.0", port=PORT)
