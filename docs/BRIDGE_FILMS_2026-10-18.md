# Bridge film collection

The existing screenshot tour remains on Home, Products and `/products/bridge`.
Its single-film launch button has become a three-film collection with a shared
portrait cinema player. Poster previews load first; MP4s mount only after a
deliberate selection. Native controls, readable transcripts, a fixed close
button, Escape, focus restoration and the existing overlay scroll lock are
preserved. Reduced motion opens a still poster; playback remains available.
Hidden tabs pause playback. Selecting another film returns the viewer to the
screen and unmounts the previous video. No extra motion library or runtime
dependency was added. The interface uses the existing brand fonts and tokens.

## Source and rights

| Website asset | Source | Treatment |
| --- | --- | --- |
| `team-work.mp4` | `D:/TaskFlow/promo-production/bridge-reel-20261004/brag.mp4` | Complete 30-second film, H.264/AAC, 720 x 1280, 1,253,317 bytes |
| `service-maintenance.mp4` | `D:/TaskFlow/promo-production/bridge-amc-cinematic-20261017/bridge-amc-final.mp4` | Complete 25-second film, H.264/AAC, 720 x 1280, 1,770,174 bytes |
| `teaser.mp4` | Existing website asset, from `bridge-teaser-20261004-v2` | Existing 20-second encode retained; labelled as an archive launch film |

New posters are full, uncropped frames at 8.5 seconds (teamwork) and 11.5
seconds (AMC), resized to 360 x 640. Both exports retain original soundtracks
and have fast-start MP4 metadata. FFmpeg used the installed local video-tools
runtime: libx264, CRF 23, slow preset, two threads, yuv420p and AAC 128 kbps.
Source files and the Bridge application were read-only.

The films contain source-grounded illustrative interfaces with fictional data,
not production account captures or measured performance evidence. The AMC film
assumes eligible contracts and enabled automation; expiry tasks do not renew a
contract, and zone grouping does not imply route optimisation. These boundaries
are reflected in the viewer and its text alternative. Capabilities already
listed in `content/maco.ts` were preserved; no live URLs or metrics were invented.

Teamwork music: **Happy Beats & Business Moves Vol. 10**, Sascha Ende,
[original track](https://ende.app/en/song/12875-happy-beats-business-moves-vol-10),
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Trimmed and mixed in the
original film. The viewer displays the credit and license link. Original source
credits also identify Kenney CC0 interface/impact sound effects. The AMC film's
score is original local synthesis with no reference audio reused. The existing
teaser uses its original local synthesis and CC0 Kenney accents. Bridge artwork
is the supplied/existing product artwork, unchanged. Inter is embedded in the
source films under SIL OFL 1.1; no new website font was introduced.

Provenance reviewed: the three productions' storyboards, the reel's `CREDITS.md`,
the AMC film's README and `review/VERIFICATION.md`, its rendered contact sheet,
the source posters, and the website's existing product content.

## Validation

See the 2026-10-18 entries in `PROJECT_STATUS.md` and `AI_HANDOFF.md` for final
checks and release state. Browser output and screenshots are local ignored QA
artifacts under `frontend/.playwright-mcp/`.
