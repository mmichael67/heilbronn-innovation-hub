

# AI Voice Narration Presentation - Implementation Plan

## Overview

I will create a self-contained HTML presentation with **German AI voice narration** using ElevenLabs text-to-speech. The presentation will auto-play slides with synchronized German audio narration for each slide.

---

## What You Need

To enable AI voice narration, you'll need to:

1. **Connect ElevenLabs** - I'll help you set this up (requires an ElevenLabs API key)
2. The project already has **Lovable Cloud** enabled, so we can securely store the API key

---

## Implementation Steps

### Step 1: Connect ElevenLabs
- Link your ElevenLabs account to the project
- Store the API key securely as a Supabase secret

### Step 2: Create Edge Function for German TTS
- Build a Supabase edge function that calls ElevenLabs API
- Use a professional German voice (e.g., "Daniel" or "Matilda")
- Generate MP3 audio from German narration scripts

### Step 3: Create Narrated HTML Presentation
- Single standalone HTML file with all slides
- German narration script for each slide (approximately 30-60 seconds per slide)
- Auto-play audio synchronized with slide transitions
- Play/Pause controls for audio
- Manual slide navigation with audio restart

---

## Presentation Content (11 Slides, German Audio)

| Slide | Title | Audio Duration |
|-------|-------|----------------|
| 1 | Titelfolie - Industry 4.0 AI Dashboard | ~20s |
| 2 | Die Herausforderung | ~30s |
| 3 | Modul 1: Digitaler Zwilling | ~30s |
| 4 | Modul 2: Flottenoptimierung | ~30s |
| 5 | Modul 3: Vorausschauende Wartung | ~30s |
| 6 | Modul 4: Energiemanagement | ~30s |
| 7 | Modul 5: Lieferkette | ~25s |
| 8 | Technische Umsetzung | ~25s |
| 9 | Regionaler Bezug Heilbronn | ~25s |
| 10 | Zusammenfassung | ~20s |
| 11 | Vielen Dank | ~15s |

**Total: ~4-5 minutes of German narration**

---

## Features

- **Professional German voice** via ElevenLabs (Daniel or Matilda)
- **Auto-advance slides** when audio finishes
- **Play/Pause button** to control narration
- **Progress indicator** showing audio playback
- **Keyboard controls**: Space (play/pause), Arrow keys (navigate)
- **Offline fallback**: Works without audio if API unavailable
- **Download ready**: Single HTML file you can share

---

## Technical Details

```text
┌─────────────────────────────────────────────────────────────┐
│                    User's Browser                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Narrated Presentation (HTML)                 │   │
│  │   ┌──────────────┐  ┌──────────────────────────┐    │   │
│  │   │   Slides     │  │   Audio Player           │    │   │
│  │   │   + Content  │  │   (Auto-sync with slides)│    │   │
│  │   └──────────────┘  └──────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│                            ▼                                │
│              Fetch audio from Edge Function                 │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              Supabase Edge Function                         │
│         (elevenlabs-tts-german)                             │
│                             │                               │
│                             ▼                               │
│               ElevenLabs API (German TTS)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Files to Create

1. `supabase/functions/elevenlabs-tts-german/index.ts` - Edge function for German TTS
2. `public/ihk-presentation-narrated.html` - Standalone presentation with audio

---

## German Narration Scripts (Preview)

**Slide 1 - Introduction:**
> "Willkommen zum Industry 4.0 AI Dashboard. Dieses Projekt wurde für den IHK Wettbewerb 'Jugend macht Zukunft 2026' in Heilbronn-Franken entwickelt. Es demonstriert, wie künstliche Intelligenz die industrielle Produktion revolutionieren kann."

**Slide 3 - Digital Twin:**
> "Der Digitale Zwilling ist eine Echtzeit-3D-Visualisierung unserer virtuellen Fabrik. Mit React Three Fiber haben wir über zwölf animierte Maschinen erstellt, darunter Roboter, Förderbänder, CNC-Maschinen und einen Hallenkran. Die Ansicht ist vollständig interaktiv."

---

## Next Steps

After you approve this plan, I will:

1. **Prompt you to connect ElevenLabs** - You'll need to provide your API key
2. **Create the edge function** for German text-to-speech
3. **Build the narrated presentation** with all audio synchronized to slides
4. **Test the complete flow** to ensure audio plays correctly

---

## Alternative: Pre-recorded Audio

If you prefer not to use ElevenLabs, I can also:
- Provide the complete German narration scripts for all 11 slides
- You can record them yourself or use another TTS service
- I'll create the HTML presentation with audio file placeholders

