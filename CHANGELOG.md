# Changelog

All notable changes to this project will be documented in this file.

## [1.0.1] - 2026-06-19
### Added
- Auto-leave voice channel functionality after 5 minutes of inactivity.
- Bot now seamlessly moves channels upon `/join` if already connected.
- Created `bot-manager.bat` and `bot-manager-gcp.bat` for easy SSH deployments with auto `npm install`.

### Changed
- **CRITICAL**: Replaced `play-dl` with `youtube-dl-exec` (yt-dlp) as the core streaming engine to permanently bypass YouTube IP blocks and 403 Forbidden errors.
- Improved error reporting in queue: songs failing to play correctly return 'error' instead of falsely claiming they were added.
- Streamlined `createAudioResource` piping to fetch raw stdout bytes directly from `yt-dlp` to avoid FFmpeg User-Agent detection.

## [1.0.0] - 2026-06-14
- Initial repository setup (`git init` to `https://github.com/son11930/discordbkkmusic.git`).
- Configured TypeScript, Vitest, and Discord dependencies.
- Added edge case coverage for `queue.ts` in `queue.test.ts` to ensure 100% test coverage.
