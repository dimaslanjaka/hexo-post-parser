@echo off

cls

REM Save the current directory
set "CURRENT_DIR=%cd%"

call npm run build
cd test/esm-project
call npm test

REM Change back to the original directory
cd /d "%CURRENT_DIR%"
