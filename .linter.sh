#!/bin/bash
cd /home/kavia/workspace/code-generation/edumentor-ai-38955-fcc175d6/edumentor_ai_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

