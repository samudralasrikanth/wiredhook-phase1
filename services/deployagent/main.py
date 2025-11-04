from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import time

app = FastAPI(title="DeployAgent", version="0.1.0")

class RunRequest(BaseModel):
    task_id: str
    runtime: Optional[str] = None
    repo_url: Optional[str] = None
    pat: Optional[str] = None
    simulate: bool = True

class RunResponse(BaseModel):
    ok: bool
    url: Optional[str] = None
    logs: list[str]

@app.get("/health")
async def health():
    return {"ok": True, "service": "deployagent"}

@app.post("/run", response_model=RunResponse)
async def run(req: RunRequest):
    logs: list[str] = []
    logs.append(f"Starting task {req.task_id}")
    time.sleep(0.1)
    if req.repo_url:
        logs.append(f"Cloning {req.repo_url} (simulated)")
        time.sleep(0.1)
    logs.append("Building artifact (simulated)")
    time.sleep(0.1)
    logs.append("Deploying to AWS Lambda (simulated)")
    time.sleep(0.1)
    url = f"https://preview.local/{req.task_id}"
    logs.append(f"Done. Preview: {url}")
    return {"ok": True, "url": url, "logs": logs}