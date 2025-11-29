@echo off
echo Demarrage du service IA...
cd Ai_agroconnect
python -m uvicorn main:app --reload --port 8000
pause
