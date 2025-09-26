import fs from 'fs'
import path from 'path'

const distManifestPath = path.join('dist', 'manifest.json')

if (fs.existsSync(distManifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(distManifestPath, 'utf-8'))

    // Remove chrome_settings_overrides for Chrome compatibility
    delete manifest.chrome_settings_overrides

    fs.writeFileSync(distManifestPath, JSON.stringify(manifest, null, 4))
    console.log('Removed chrome_settings_overrides from dist/manifest.json')
} else {
    console.log('dist/manifest.json not found, skipping post-build cleanup')
}