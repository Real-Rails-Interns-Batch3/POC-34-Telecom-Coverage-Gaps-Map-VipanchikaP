from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI(title="Telecom Coverage Gaps API")

# SECURITY: Allows your Next.js frontend (port 3000) to safely talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://telecom-frontend.calmgrass-68f2d261.eastasia.azurecontainerapps.io",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CRASH PREVENTION: Dynamically looks up absolute paths on Windows
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MOCK_DATA_PATH = os.path.join(BASE_DIR, "mock", "mock_data.json")


@app.get("/")
def home():
    return {
        "status": "online",
        "project": "Telecom Coverage Gaps Map"
    }


@app.get("/api/coverage")
def coverage():
    # Defensive fall-safe check if the mock data file hasn't been generated yet
    if not os.path.exists(MOCK_DATA_PATH):
        return {"type": "FeatureCollection", "features": []}

    with open(MOCK_DATA_PATH, "r") as file:
        data = json.load(file)

    return data


# METRICS HANDSHAKE ENDPOINT FOR SIDEBAR (Top Box)
@app.get("/api/v1/dashboard/metrics")
def get_dashboard_metrics():
    if not os.path.exists(MOCK_DATA_PATH):
        return {"population_served": 0, "national_coverage_score": 0, "gap_score": 0}

    with open(MOCK_DATA_PATH, "r") as file:
        data = json.load(file)

    regions = data.get("regions", [])
    if not regions:
        return {"population_served": 0, "national_coverage_score": 0, "gap_score": 0}

    total_population = sum(
        region["population_served"]
        for region in regions
    )

    average_coverage = sum(
        region["coverage_score"]
        for region in regions
    ) / len(regions)

    average_gap = sum(
        region["gap_score"]
        for region in regions
    ) / len(regions)

    return {
        "population_served": total_population,
        "national_coverage_score": round(average_coverage, 2),
        "gap_score": round(average_gap, 2)
    }


# NEW ENDPOINT: PARSES RAW INDIVIDUAL POINTS FOR YOUR NEW NETWORK SIDEBAR (Bottom Box & CSV Export)
@app.get("/api/v1/dashboard/points")
def get_dashboard_points():
    if not os.path.exists(MOCK_DATA_PATH):
        return []

    with open(MOCK_DATA_PATH, "r") as file:
        data = json.load(file)

    regions = data.get("regions", [])
    
    points_data = []
    for idx, region in enumerate(regions):
        points_data.append({
            "id": region.get("id", idx + 1),
            "name": region.get("name", f"Region {idx + 1}"),
            "coverage": region.get("coverage_score", 0),
            "gap": region.get("gap_score", 0)
        })

    return points_data