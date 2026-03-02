@echo off
echo Installing dependencies...
call npm install @types/node@17.0.25
call npm install base64-js@1.5.1 buffer@6.0.3 ieee754@1.2.1 --save-dev
echo Done.
pause
