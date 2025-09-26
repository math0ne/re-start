import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const distPath = 'dist'
const xpiPath = 're-start.xpi'

// Check if dist folder exists
if (!fs.existsSync(distPath)) {
    console.error('dist folder not found. Run "npm run build" first.')
    process.exit(1)
}

// Remove existing xpi if it exists
if (fs.existsSync(xpiPath)) {
    fs.unlinkSync(xpiPath)
}

try {
    // Create zip file using PowerShell on Windows
    const command = `powershell "Compress-Archive -Path '${distPath}/*' -DestinationPath '${xpiPath}' -Force"`
    execSync(command, { stdio: 'inherit' })

    console.log(`✓ Created ${xpiPath} (${Math.round(fs.statSync(xpiPath).size / 1024)}kb)`)
    console.log('Ready for Firefox installation!')
} catch (error) {
    console.error('Failed to create xpi:', error.message)
    process.exit(1)
}