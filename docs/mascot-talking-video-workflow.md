# Talking Mascot via ElevenLabs Image & Video — workflow + chroma-key guide

**Goal:** Turn the static All Star Bowl pin mascot into a short talking/waving clip using ElevenLabs' Image & Video (Aurora avatar) workflow, voiced in a fun/vibrant chosen voice, then chroma-key the result to a transparent video for the web page.

**Status:** Manual workflow (ElevenLabs Image & Video is web-app driven, not a documented public API for the avatar/lip-sync step). You do the ElevenLabs clicks; the keying is a local script (Claude runs it).

---

## The hard constraint to understand FIRST

ElevenLabs' Aurora avatar model is a diffusion transformer — it **redraws** the image moving and **bakes in a background, destroying any alpha channel.** A transparent PNG in → an opaque MP4 out. This is the same limitation that applies to all image-to-video gen (you flagged it yourself early on).

**Therefore: do NOT feed the transparent `mascot-wave.png`.** Feed a version of the mascot **pre-composited on solid chroma green**, so the output video has a clean, uniform green background we can key out afterward. Keying a known flat green is reliable; trying to key whatever random background Aurora invents is not.

**Honest caveat on keying VIDEO:** keying a cartoon with a bold black outline works, but video adds two failure modes the stills didn't have — (1) per-frame edge flicker (the alpha shimmers slightly frame to frame), and (2) motion blur on the waving arm turns semi-green at the edges and either leaves a halo or eats into the arm. Expect to spend tuning time here, and judge the result honestly: if the edges shimmer badly, the fallback is to **put the talking mascot in a contained branded panel WITH a background** instead of transparent-on-page. Decide after you see the first keyed result, not before.

---

## Step 0 — Prep the green-background source image (Claude does this)

Before ElevenLabs: composite the mascot onto a solid chroma-green canvas (same green that keyed cleanly before, ~RGB 0,177,64 / "chroma key green"). Output a PNG the avatar model will animate. Keep the mascot centered with margin so the waving arm never touches the frame edge (edge-touching breaks the key). Claude generates `mascot-wave-greenscreen.png` from `public/img/generated/mascot/mascot-wave.png`.

> Ask Claude: "composite mascot-wave.png onto a solid chroma-green background, centered with 15% margin, save as mascot-wave-greenscreen.png."

---

## Step 1 — Record / prepare the voice line

Two options for the audio:
- **Voice Conversion (Speech-to-Speech)** — you RECORD yourself reading the line (keeps your timing/emphasis/energy), ElevenLabs swaps in the chosen fun voice. Best for natural performance.
- **TTS** — type the line, pick the voice, it reads it. Faster, less performance.

Either way, pick the voice in the ElevenLabs Voice Library: fun, vibrant, friendly, upbeat — audition a few against a line like "Heyyy! Ready to bowl? Grab a lane and let's roll!" Note the voice name/ID once chosen.

(Your local ElevenAI MCP can do the TTS/voice-conversion step as code if you prefer — it generates audio to the backend library by item_id. The avatar VIDEO step below is web-app only.)

---

## Step 2 — ElevenLabs Image & Video: animate the mascot

1. Go to ElevenLabs → **Image & Video** (the Creative playground; Aurora is the avatar model). https://elevenlabs.io/docs/eleven-creative/playground/image-video
2. **Upload** `mascot-wave-greenscreen.png` as the source image (NOT the transparent one).
3. Provide the **audio** from Step 1 (or the script text + chosen voice if doing it inline).
4. Choose the **lip-sync / talking-avatar (Aurora)** option so the mouth animates to the audio. Keep motion subtle — a cartoon pin doesn't need big head movement; over-animation warps the art.
5. Generate. Review for: clean lip-sync, the green staying uniform (no weird shadows/gradients Aurora may add — if it muddies the green, that hurts the key), arm/wave readable.
6. **Export MP4** at the highest resolution offered (4K/upscale if available — more pixels = cleaner key edges).

Save the MP4 to `~/Downloads/` and tell Claude the path.

---

## Step 3 — Chroma-key the video to transparent (Claude does this)

Claude keys the green out of the MP4 and outputs a transparent video. Reality of web-transparent video:
- **Browsers do NOT support transparent MP4** universally. True alpha video on the web means **WebM (VP9 with alpha)** for Chrome/Firefox/Edge, and **HEVC-with-alpha MOV** for Safari — OR an **APNG / animated WebP / sprite sheet** fallback. Safari is the perennial problem child.
- Pipeline: ffmpeg extracts frames → the same green-key + despill we used on the stills, applied per frame → re-encode to **WebM (VP9, yuva420p, alpha)**. Provide a Safari fallback (HEVC-alpha MOV or an APNG) or, simpler, a poster-image fallback.
- Tooling present on this machine: ffmpeg + Pillow/numpy/scipy (all confirmed). No new installs needed for the keying; VP9-alpha encode is via ffmpeg.

> Ask Claude: "key the green out of <mp4 path>, despill the edges, output a transparent WebM (VP9 alpha) plus a Safari fallback."

---

## Step 4 — Put it on the page

- Drop the transparent WebM into the existing corner-buddy slot (replaces or augments the static `mascot-wave.png`). `<video autoplay loop muted playsinline>` with the WebM source + a fallback `<source>` for Safari + the PNG as poster.
- Trigger options: autoplay-loop the idle/wave, or play the talking clip on hover/click (ties into the corner-buddy behavior already built in `public/mascot-demo.html`).
- If transparency keying looks bad after Step 3: fall back to the **contained-panel** approach — the talking mascot in a branded box with a background, no keying needed. Still a great effect, zero shimmer.

---

## Decision checkpoints (don't skip)

1. After Step 2: is the green uniform and the lip-sync clean? If Aurora warped the art or muddied the green, regenerate with calmer motion before wasting a keying pass.
2. After Step 3: do the edges shimmer/halo? If yes and tuning doesn't fix it → switch to the contained-panel-with-background plan. Don't ship shimmery edges to a client pitch.

## Out of scope / future

- Real-time mocap (MediaPipe/ARKit → Rive) for a LIVE reactive mascot — separate, bigger build. Not needed for a page mascot.
- Rive auto-lip-sync as an alternative to baked video — stays vector-sharp, fully transparent, no keying — but requires rigging the mascot into Rive. The better long-term answer if the keyed-video edges disappoint.
