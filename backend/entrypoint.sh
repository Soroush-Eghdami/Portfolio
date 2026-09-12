#!/bin/sh
set -e

echo "Waiting for database..."
if [ "$POSTGRES_HOST" = "db" ]; then
  until python -c "import psycopg2, os; psycopg2.connect(dbname=os.getenv('POSTGRES_DB'), user=os.getenv('POSTGRES_USER'), password=os.getenv('POSTGRES_PASSWORD'), host=os.getenv('POSTGRES_HOST'), port=os.getenv('POSTGRES_PORT','5432'))" 2>/dev/null; do
    echo "Postgres not ready - sleeping 2s"
    sleep 2
  done
fi

echo "Running migrations..."
python manage.py migrate --noinput

echo "Seeding data if empty..."
python manage.py shell << 'PYEOF'
from api.models import Skill, Project, Profile
if Skill.objects.count() == 0:
    print("Seeding skills...")
    skills = [
        ("Python", "Advanced", "🐍", 1),
        ("Django / DRF", "Advanced", "🌐", 2),
        ("REST APIs", "Advanced", "🔗", 3),
        ("Docker", "Intermediate", "🐳", 4),
        ("PostgreSQL", "Intermediate", "🐘", 5),
        ("MongoDB", "Intermediate", "🍃", 6),
        ("Redis", "Beginner", "⚡", 7),
        ("C++", "Intermediate", "➕", 8),
    ]
    for n,l,i,o in skills:
        Skill.objects.create(name=n, level=l, icon=i, order=o)
else:
    print(f"Skills already seeded: {Skill.objects.count()}")

# Showcase projects: code is the source of truth (matched by title).
# `cover` is intentionally excluded so admin-uploaded photos survive redeploys.
print("Syncing showcase projects...")
GITHUB = "https://github.com/Soroush-Eghdami"
showcase = [
    dict(title="R.A.G", description="Local, private RAG app for law students — upload case files, ask questions and get answers with cited sources. CLI + web UI.", tags=["Python","RAG","AI"], stack="Python, RAG, Transformers", gradient="from-violet-600 to-indigo-600", emoji="🧠", code_url=f"{GITHUB}/R.A.G", order=1),
    dict(title="Tweeter_Demo", description="Full-stack Twitter clone with Docker support and real-time features.", tags=["TypeScript","Docker","Real-time"], stack="TypeScript, Docker, Real-time", gradient="from-fuchsia-600 to-pink-600", emoji="🐦", code_url=f"{GITHUB}/Tweeter_Demo", order=2),
    dict(title="CakeShop", description="Online cake store — product listings, shopping cart and order flow for handcrafted cakes, built with React and Tailwind CSS.", tags=["React","Tailwind","E-commerce"], stack="React, Tailwind, E-commerce", gradient="from-orange-500 to-red-600", emoji="🍰", code_url=f"{GITHUB}/CakeShop", order=3),
    dict(title="Online-shop-CBV", description="Full-featured Django e-commerce demo with clean CBV architecture, ready to deploy.", tags=["Django","CBV","E-commerce"], stack="Django, CBV, PostgreSQL", gradient="from-cyan-500 to-blue-600", emoji="🛒", code_url=f"{GITHUB}/Online-shop-CBV", order=4),
    dict(title="Summerizer", description="Flask web app that summarizes text, PDF documents and audio files using transformer models and the Groq API.", tags=["Flask","Transformers","Groq"], stack="Flask, Transformers, Groq API", gradient="from-emerald-500 to-teal-600", emoji="📝", code_url=f"{GITHUB}/Summerizer", order=5),
]
for p in showcase:
    Project.objects.update_or_create(
        title=p["title"],
        defaults={**p, "demo_url": p["code_url"], "featured": True},
    )
if not Profile.objects.exists():
    Profile.objects.create(name="Soroush Eghdami", role="Python Backend Developer", bio="Python Backend Developer | Django, REST APIs, Docker | Building AI-powered RAG systems & web apps. Computer Engineering student.", location="404: Not Found", email="Soroush.egh@gmail.com", phone="", github="https://github.com/Soroush-Eghdami", linkedin="", twitter="https://x.com/Hoodi_guy")
print(f"Seeded: skills={Skill.objects.count()} projects={Project.objects.count()}")
PYEOF

echo "Collecting static..."
python manage.py collectstatic --noinput || true

if [ -n "$DJANGO_SUPERUSER_USERNAME" ]; then
  python manage.py shell << PYEOF2
from django.contrib.auth import get_user_model
import os
User = get_user_model()
u = os.getenv('DJANGO_SUPERUSER_USERNAME')
e = os.getenv('DJANGO_SUPERUSER_EMAIL','admin@example.com')
p = os.getenv('DJANGO_SUPERUSER_PASSWORD','admin123')
if u and not User.objects.filter(username=u).exists():
    User.objects.create_superuser(u, e, p)
    print(f"Superuser {u} created")
else:
    print(f"Superuser {u} already exists or not set")
PYEOF2
fi

echo "Starting server..."
exec "$@"
