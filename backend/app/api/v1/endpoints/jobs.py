from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_job_recommendations():
    return {
        "success": True,
        "jobs": [
            {
                "id": "job-1",
                "title": "Staff Software Engineer - AI Systems",
                "company": "OpenAI",
                "location": "San Francisco, CA (Remote)",
                "salary": "$220,000 - $290,000 / year",
                "matchScore": 98,
                "skills": ["React", "TypeScript", "Python", "LLM Infrastructure"]
            },
            {
                "id": "job-2",
                "title": "Lead Full Stack Architect",
                "company": "Vercel",
                "location": "Remote (Global)",
                "salary": "$195,000 - $245,000 / year",
                "matchScore": 95,
                "skills": ["Next.js", "React 19", "Node.js", "Serverless"]
            }
        ]
    }
