# All Star Bowl — ElevenLabs Flow-Canvas Video Prompts

Working doc for the ElevenLabs flow-canvas video-generation workflow. Paste the labeled blocks below into the three text fields in the canvas. Reference images are real shots of All Star Bowl (726 N Shortridge Rd, Indianapolis, IN 46219): lanes, interior, an adult mid-throw, a kid in a red shirt throwing.

## How the flow works

The flow ingests a set of bowling-alley reference images and outputs one 8-second, 720p, 16:9 video. It runs two parallel lanes that converge on a single video node:

- All reference images feed BOTH Gemini 2.5 Flash nodes.
- TOP LANE: Gemini 2.5 Flash reads the reference images and, using our instructions, writes an image-generation prompt for the BEGINNING frame. That prompt feeds a Nano Banana Pro node (16:9, 1K) that renders the beginning frame.
- BOTTOM LANE: a second Gemini 2.5 Flash reads the same images and writes an image-generation prompt for the END frame. That feeds a second Nano Banana Pro node that renders the end frame.
- Both frames feed one Veo 3.1 Fast node (16:9, 720p, 8s). Our motion prompt there defines how the shot travels from the beginning frame to the end frame.

There are exactly three text fields a human edits:

1. **TOP Gemini 2.5 Flash** — instructions telling the LLM how to author the BEGINNING-frame image prompt.
2. **BOTTOM Gemini 2.5 Flash** — instructions telling the LLM how to author the END-frame image prompt.
3. **Veo 3.1 Fast** — the motion/transition description from beginning frame to end frame.

**Note:** The two Nano Banana Pro nodes inherit the prompt from their connected Gemini node. Leave them empty — no manual text goes there.

A key constraint runs through all three concepts: the beginning and end frames must read as the two ends of ONE continuous camera shot, not two unrelated images. Same room, same lighting, same palette, same time of night. Veo interpolates between them, so the closer they cohere, the cleaner the motion.

---

## HERO CONCEPT — "Follow her ball to the strike" (run this first)

The signature shot. Camera starts behind a woman bowler at the top of the approach, watches her step through and release, then leaves her and rides the ball all the way down the lane into a thunderous strike before cutting to black. Cinematic, immersive, confident.

### Block 1 — TOP Gemini 2.5 Flash (beginning frame)

```
You are writing a single image-generation prompt for the OPENING frame of an 8-second promotional hero video for a bowling alley. Study all reference images, especially the brighter, lighter-lit reference photo of a WOMAN bowling, and match the real venue's architecture, lane wood tone, lighting, color palette, and the look of that woman bowler. Do not invent logos, signage text, or brand colors not visible in the references.

Produce ONE vivid, concrete image prompt (no preamble, no options, no commentary) describing this opening frame:

A woman bowler seen from BEHIND at the top of the approach, captured from a low-rear three-quarter / over-the-shoulder angle, standing set up and holding the ball at chest height, ready to begin her approach. Composition: the woman occupies the lower foreground, framed from behind; the polished lane stretches out ahead of her, receding toward a full, freshly racked set of ten white bowling pins standing on the pin deck in the distance. Ball returns and lane dividers frame both sides; the approach floor and foul line read clearly ahead of her. Lighting: brighter, lighter-lit warm overhead lane lights matching the reference photo of the woman bowling, with cooler ambient house light behind, a soft glow on the oiled lane surface and gentle reflections. Mood: inviting, energetic evening atmosphere, the feeling of a great night out. Lens: wide-to-normal, roughly 28mm equivalent, cinematic depth of field with the woman and approach crisp and the distant pins slightly soft. Shot on a professional cinema camera, photorealistic, natural plausible human pose and anatomy, no on-screen text, 16:9 aspect ratio. Keep it premium and clean, not generic stock imagery.
```

### Block 2 — BOTTOM Gemini 2.5 Flash (end frame)

```
You are writing a single image-generation prompt for the CLOSING frame of the SAME 8-second promotional hero video described for the opening. Study all reference images and match the identical venue, lane wood tone, lighting temperature, brighter lighter-lit palette, and time of night as the opening frame so the two frames read as one continuous camera move. Do not invent logos, signage text, or brand colors not visible in the references.

Produce ONE vivid, concrete image prompt (no preamble, no options, no commentary) describing this closing frame:

The camera has traveled the full length of the lane following the ball and is now right at the pin deck, capturing the bowling ball striking a full rack of ten white bowling pins at the moment of impact — a strike. Composition: the ten pins fill the frame, several already exploding and scattering off the pin deck at impact, the ball driving into the pocket, the dark pit and sweep bar just behind them. The pin deck surface reflects the warm light; the background falls into atmospheric shadow. Same brighter, lighter-lit warm-over-cool lighting scheme and palette as the opening frame, same time of night, same venue, so it interpolates cleanly. Lens: same wide-to-normal cinematic look, crisp on the point of impact with motion energy on the scattering pins. Photorealistic, shot on a professional cinema camera, no on-screen text, no people in frame, 16:9 aspect ratio. Premium and clean.
```

### Block 3 — Veo 3.1 Fast (motion / transition)

```
An 8-second continuous cinematic shot inside a bowling alley, one single take, no cuts until the very end. Start on the opening frame: the camera is BEHIND a woman bowler at the top of the approach, low-rear three-quarter angle, as she stands set up holding the ball and looking down the lane toward a full rack of ten pins.

Pacing across the 8 seconds:
- 0.0–2.0s: the woman begins her approach, taking smooth steps forward down the approach; the camera stays behind her, tracking gently with her.
- 2.0–3.5s: she swings the ball back and then through, body lowering into the shot, the camera still behind and slightly following.
- 3.5–4.0s: she releases the ball at the foul line into her follow-through.
- 4.0–6.5s: as the ball leaves her hand the camera LEAVES the woman and travels forward down the lane, tracking the rolling ball low and smooth all the way toward the pins, the bowler falling away behind.
- 6.5–7.5s: the ball reaches the pin deck and strikes the ten pins for a STRIKE — pins explode and scatter into the pit.
- 7.5–8.0s: hold a brief beat on the strike, then CUT TO BLACK at the end.

One continuous, physically plausible camera move with no shake and no cuts until the final cut-to-black. Realistic bowling motion and ball physics: natural human approach, swing, and release; the ball rolls and curves into the pocket; pins scatter on impact. Brighter, lighter-lit realistic alley lighting and atmosphere, premium promotional tone.
```

---

## ALTERNATE 3 — "Dolly down the lane to the strike"

The signature shot. Camera glides low down the approach toward the pins; the night opens up around it; it lands on a fresh rack of pins under warm light. Premium, atmospheric, confident.

### Block 1 — TOP Gemini 2.5 Flash (beginning frame)

```
You are writing a single image-generation prompt for the OPENING frame of an 8-second promotional hero video for a bowling alley. Study all reference images and match the real venue's architecture, lane wood tone, lighting, and color palette. Do not invent logos, signage text, or brand colors not visible in the references.

Produce ONE vivid, concrete image prompt (no preamble, no options, no commentary) describing this opening frame:

A low, near-floor camera position at the foul line of a single bowling lane, looking straight down the lane toward the pins in the distance. Composition: the polished lane recedes to the vanishing point at the pin deck; ball-return units and lane dividers frame both sides; the approach floor and foul line are sharp in the immediate foreground. The pins are small and slightly out of focus far away. Lighting: warm overhead lane lights with cooler ambient house light behind, a faint glow on the oiled lane surface, gentle reflections. Mood: inviting, energetic evening atmosphere, the feeling of a great night out. Lens: wide angle, roughly 24mm equivalent, deep but cinematic depth of field with the foreground crisp. Shot on a professional cinema camera, photorealistic, no text overlays, no people in frame, 16:9 aspect ratio. Keep it premium and clean, not generic stock imagery.
```

### Block 2 — BOTTOM Gemini 2.5 Flash (end frame)

```
You are writing a single image-generation prompt for the CLOSING frame of the SAME 8-second promotional hero video described for the opening. Study all reference images and match the identical venue, lane wood tone, lighting temperature, and color palette so the two frames read as one continuous camera move. Do not invent logos, signage text, or brand colors not visible in the references.

Produce ONE vivid, concrete image prompt (no preamble, no options, no commentary) describing this closing frame:

The camera has traveled most of the way down the lane and is now close to the pin deck, looking at a full, freshly racked set of ten white bowling pins standing on the pin deck, gleaming under warm spotlighting, with the dark pit and sweep bar just behind them. Composition: the ten pins fill the frame in a tight, confident arrangement; the pin deck surface reflects the warm light; the background falls into soft, atmospheric shadow. Same warm-over-cool lighting scheme and palette as the opening frame, same time of night, same venue. Lens: same wide-to-normal cinematic look, shallow-ish focus landing crisply on the front pins. Photorealistic, shot on a professional cinema camera, no text overlays, no people in frame, 16:9 aspect ratio. Premium and clean.
```

### Block 3 — Veo 3.1 Fast (motion / transition)

```
An 8-second continuous cinematic shot inside a bowling alley. Start on the opening frame: a low camera at the foul line looking down the full length of a single lane toward distant pins. The camera smoothly dollies forward, low and steady, gliding down the lane toward the pin deck, as if mounted on a slider. Subtle motion in the scene: faint shifting reflections on the oiled lane, gentle flicker of warm overhead light. As the camera approaches the pins it slows and settles on the closing frame: a full rack of ten gleaming white pins standing under warm spotlight. Pacing: steady acceleration over the first 5 seconds, then a confident slow-down to a held final beat on the pins. Smooth, controlled, professional camera move, no shake, no cuts. Realistic bowling-alley lighting and atmosphere, premium promotional tone.
```

---

## ALTERNATE 1 — "Atmosphere / establishing wide" (the vibe of the room)

A slow reveal of the whole alley at night. Sells energy and place over a single action.

### Block 1 — TOP Gemini 2.5 Flash (beginning frame)

```
Write ONE concrete image-generation prompt (no preamble, no options) for the OPENING frame of an 8-second promo video. Study the reference images and match the real venue, palette, and lighting. No invented logos or text.

Frame: a wide establishing interior shot of the bowling alley at night, seen slightly high and angled across a row of lanes. One side of the frame is in soft foreground shadow; the far end glows with warm lane lights and the bright pin decks of a full row of lanes receding into the distance. Composition emphasizes the long perspective of multiple parallel lanes, ball returns, and seating areas. Lighting: warm pools of light over the lanes against cooler ambient house light, inviting and lively. Lens: wide angle, cinematic, deep focus. Photorealistic, professional cinema camera, no on-screen text, few or no people, 16:9. Premium, atmospheric, not generic stock.
```

### Block 2 — BOTTOM Gemini 2.5 Flash (end frame)

```
Write ONE concrete image-generation prompt (no preamble, no options) for the CLOSING frame of the SAME video, identical venue, lighting, palette, and time of night so it reads as one continuous move. No invented logos or text.

Frame: the same establishing interior, but the camera has pushed in and settled on one inviting hero lane mid-row, the full lane and its bright pin deck centered and crisp, ball return and approach in the warm foreground, the rest of the room softening into atmospheric background glow. Same warm-over-cool palette and night ambience as the opening. Lens: same cinematic wide-to-normal look, focus landing on the hero lane. Photorealistic, professional cinema camera, no on-screen text, 16:9. Premium and clean.
```

### Block 3 — Veo 3.1 Fast (motion / transition)

```
An 8-second continuous cinematic shot. Begin on the wide establishing frame of the full bowling alley at night. The camera performs a slow, smooth push-in and gentle drift, gradually narrowing from the whole room toward one hero lane mid-row, ending on the closing frame. Ambient life in the scene: soft shifting light, faint warm glow strengthening as the camera moves in. Pacing: gentle, even forward motion across all 8 seconds, no abrupt stops. Smooth gimbal-style movement, no shake, no cuts, no warping of architecture. Realistic alley lighting, inviting energetic mood, premium promotional tone.
```

---

## ALTERNATE 2 — "The throw" (action / human energy)

Uses the people references — an adult mid-throw or the kid in the red shirt. Sells fun and motion. Keep human anatomy plausible.

### Block 1 — TOP Gemini 2.5 Flash (beginning frame)

```
Write ONE concrete image-generation prompt (no preamble, no options) for the OPENING frame of an 8-second promo video. Study the reference images, especially the people bowling, and match the real venue, palette, lighting, and the look of the bowler. No invented logos or text.

Frame: a bowler at the top of the approach, captured from a low side-rear three-quarter angle, ball held up at chest height in the wind-up before the throw, body coiled and ready. The lane stretches ahead toward distant pins, slightly out of focus. Composition: the bowler occupies one third of the frame in the foreground, the lane and pins draw the eye down-frame. Lighting: warm overhead light on the bowler and lane, energetic evening atmosphere. Lens: wide-to-normal, cinematic, motion-ready, crisp on the bowler. Photorealistic, professional cinema camera, natural plausible human pose and anatomy, no on-screen text, 16:9. Premium, candid, not staged stock.
```

### Block 2 — BOTTOM Gemini 2.5 Flash (end frame)

```
Write ONE concrete image-generation prompt (no preamble, no options) for the CLOSING frame of the SAME video, identical bowler, venue, lighting, palette, and time of night so it reads as one continuous action. No invented logos or text.

Frame: the same bowler at the follow-through, having just released the ball, arm extended forward, body in the classic finish pose just behind the foul line; the ball is partway down the lane heading toward the pins, motion implied. Composition: bowler still anchored in the foreground third, the lane and the bright pin deck now more prominent down-frame. Same warm lighting, palette, and night ambience as the opening. Lens: same cinematic look, crisp on the bowler with subtle motion energy on the ball. Photorealistic, professional cinema camera, plausible human anatomy, no on-screen text, 16:9. Premium and candid.
```

### Block 3 — Veo 3.1 Fast (motion / transition)

```
An 8-second continuous cinematic shot. Begin on the opening frame: a bowler at the top of the approach, ball raised in the wind-up. Over the shot the bowler steps forward through the approach, swings the arm down and through, and releases the ball at the foul line into the follow-through pose of the closing frame; the released ball rolls forward down the lane toward the pins. The camera holds a steady low three-quarter angle with a slight, smooth arc to follow the body, no shake. Pacing: build through the step and swing across the first 5 to 6 seconds, release near second 6, settle on the follow-through and the rolling ball for the final beat. One continuous action, no cuts, natural human motion, realistic alley lighting, fun energetic mood, premium promotional tone.
```

---

## Tips

**Keep begin and end frames consistent.** Veo interpolates between the two rendered frames, so they must share the same room, camera height range, lens character, lighting temperature (warm-over-cool here), palette, and time of night. If one frame is bright daytime and the other is dim night, Veo will produce flicker, morphing, or a visible "cut." The Gemini end-frame instructions above explicitly tell the model to match the opening frame for this reason.

**Aspect ratio.** Both Nano Banana Pro frames are 16:9 to match the 720p 16:9 Veo output. Do not let either Gemini node request a square or vertical frame — the prompts above pin 16:9. A mismatched source frame gets cropped or letterboxed and breaks the interpolation.

**What makes Veo motion prompts succeed:**
- One continuous, physically plausible camera move (dolly, push-in, gentle arc). Real camera rigs, not teleports.
- Explicit pacing tied to the 8 seconds ("steady for 5s, then slow to a held final beat").
- Concrete subject motion grounded in reality (ball rolling down the lane, bowler's follow-through, reflections shifting).
- Naming the begin state and the end state so the model knows where it starts and lands.

**What makes them fail:**
- Asking for cuts, multiple shots, or scene changes in 8 seconds — Veo is one continuous shot.
- Impossible or contradictory motion (camera in two places, pins falling AND freshly racked in the same beat).
- Vague verbs like "dynamic" or "epic" with no physical direction.
- Begin and end frames that disagree on lighting, layout, or framing — forces morphing.

**Bowling accuracy reminders for prompt edits:** lane, approach, foul line, ball return, gutters, lane dividers, pin deck, ten pins in a triangle, pit and sweep bar behind the pins. Keep these terms correct so the renders read as a real alley, not a generic AI interior.
