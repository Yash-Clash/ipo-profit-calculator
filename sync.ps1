$git = "C:\Users\ADMIN\.gemini\antigravity\scratch\mingit\cmd\git.exe"
$gh = "C:\Users\ADMIN\.gemini\antigravity\scratch\gh\bin\gh.exe"

& $git add .
& $git commit -m "feat(ui): complete senior developer overhaul with waterfall flow, sensitivity slider, lot multipliers, and CSV export"
$token = (& $gh auth token).Trim()
& $git push "https://$token@github.com/Yash-Clash/ipo-profit-calculator.git" main
