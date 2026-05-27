@echo off
echo ============================================
echo   College Chatbot - Installing dependencies
echo ============================================
echo.

pip install -r requirements.txt

echo.
echo ============================================
echo   Done!
echo.
echo   Next steps:
echo   1. Open .env and paste your Groq API key
echo      Get a free key at: https://console.groq.com
echo.
echo   2. Run the chatbot:
echo      streamlit run app.py
echo ============================================
pause
