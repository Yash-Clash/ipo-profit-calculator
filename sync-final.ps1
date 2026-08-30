$git = "C:\Users\ADMIN\.gemini\antigravity\scratch\mingit\cmd\git.exe"
$gh = "C:\Users\ADMIN\.gemini\antigravity\scratch\gh\bin\gh.exe"

& $git add -A
& $git commit -m "chore: clean temporary sync scripts"
$token = (& $gh auth token).Trim()
& $git push "https://$token@github.com/Yash-Clash/ipo-profit-calculator.git" main
