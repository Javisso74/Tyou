set WORKSPACE=..
set LUBAN_DLL=%WORKSPACE%\tools\Luban\Luban.dll
set CONF_ROOT=.

dotnet %LUBAN_DLL% ^
    -t client ^
    -d bin ^
    -c typescript-bin ^
    --conf %CONF_ROOT%\luban.conf ^
    -x outputDataDir=%WORKSPACE%\%WORKSPACE%\Client\assets\asset-raw\config\game ^
    -x outputCodeDir=%WORKSPACE%\%WORKSPACE%\Client\assets\scripts\proto\config\bin^
    -x bin.fileExt=bin

pause
