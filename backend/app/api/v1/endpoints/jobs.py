from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_job_recommendations():
    return {
        "success": True,
        "jobs": [
            {
                "id": "job-1",
                "title": "Senior AI & Full Stack Engineer",
                "company": "Razorpay",
                "location": "Bengaluru, Karnataka (Hybrid)",
                "salary": "₹32,00,000 - ₹45,00,000 / year",
                "matchScore": 98,
                "skills": ["React", "TypeScript", "Python", "FastAPI", "Payment Systems"]
            },
            {
                "id": "job-2",
                "title": "Lead Full Stack Architect",
                "company": "Flipkart",
                "location": "Bengaluru, Karnataka (Remote / Hybrid)",
                "salary": "₹42,00,000 - ₹58,00,000 / year",
                "matchScore": 95,
                "skills": ["Next.js", "React 19", "Node.js", "Distributed Systems", "Microservices"]
            },
            {
                "id": "job-3",
                "title": "Principal AI & Cloud Solutions Architect",
                "company": "TCS (Tata Consultancy Services)",
                "location": "Hyderabad / Pune (Hybrid)",
                "salary": "₹28,00,000 - ₹38,00,000 / year",
                "matchScore": 92,
                "skills": ["Python", "LLM Infrastructure", "AWS/Azure", "PyTorch", "GenAI"]
            },
            {
                "id": "job-4",
                "title": "Senior Software Engineer - Platform",
                "company": "Swiggy",
                "location": "Bengaluru, Karnataka (Remote)",
                "salary": "₹30,00,000 - ₹44,00,000 / year",
                "matchScore": 91,
                "skills": ["Node.js", "Go", "Distributed Systems", "Redis", "Kafka"]
            },
            {
                "id": "job-5",
                "title": "Staff Frontend / Full Stack Architect",
                "company": "Zoho Corporation",
                "location": "Chennai, Tamil Nadu (On-site / Hybrid)",
                "salary": "₹26,00,000 - ₹36,00,000 / year",
                "matchScore": 89,
                "skills": ["React", "JavaScript", "Java", "Cloud Architecture", "Web Security"]
            },
            {
                "id": "job-6",
                "title": "Senior AI/ML Platform Engineer",
                "company": "Jio Platforms",
                "location": "Mumbai, Maharashtra (Hybrid)",
                "salary": "₹34,00,000 - ₹48,00,000 / year",
                "matchScore": 87,
                "skills": ["Python", "PyTorch", "Kubernetes", "MLOps", "Big Data"]
            }
        ]
    }

